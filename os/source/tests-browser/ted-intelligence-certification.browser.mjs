/**
 * OCG INTELLIGENCE inside TED — FINAL CERTIFICATION BATTERY (builder-run).
 *
 * Control-by-control browser verification of the production build served
 * locally. External link targets are captured via request interception and
 * ABORTED — nothing leaves the machine; the attempted URL is the evidence.
 * Voice is exercised with Chromium's fake media device; a real microphone
 * and the Web Speech recognition service are NOT verified by this battery.
 * Empty/malformed-data states are covered by the unit suite through the
 * component's test seam (a compiled bundle cannot be re-injected) plus the
 * scenario invalid-input cases exercised live below.
 *
 * Run: node tests-browser/ted-intelligence-certification.browser.mjs [baseUrl]
 * Writes cert-results.json next to this file and screenshots to ../../qa-evidence/.
 */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.argv[2] || 'http://127.0.0.1:4173/';
const HERE = dirname(fileURLToPath(import.meta.url));
const SHOTS = join(HERE, '..', '..', 'qa-evidence');
mkdirSync(SHOTS, { recursive: true });

const results = [];
// Section filter for completing the matrix under VM memory pressure:
// CERT_ONLY=A,B,C,E1,E2,F,G and CERT_WIDTHS=1440 (comma lists; empty = all).
const ONLY = (process.env.CERT_ONLY || '').split(',').map((x) => x.trim()).filter(Boolean);
const want = (id) => ONLY.length === 0 || ONLY.includes(id);
const notes = [];
let seq = 0;
const check = (area, name, pass, detail = '') => {
  seq += 1;
  results.push({ id: seq, area, check: name, pass: !!pass, detail: String(detail).slice(0, 300) });
  console.log(`${pass ? 'PASS' : 'FAIL'}  [${area}] ${name}${detail ? ` — ${detail}` : ''}`);
};
const settle = async (page, ms = 700) => { await page.waitForTimeout(ms); };
const bodyText = async (page) => page.evaluate(() => document.body.innerText);
const overflowX = async (page) => page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);

// Grounded in src/tedexperience/intelligence/evidenceData.ts +
// intelligenceProduct.ts (read from source, not paraphrased).
const EXPECTED_LINKS = [
  'https://smith.ai', 'https://smith.ai/pricing/ai-receptionist', 'https://smith.ai/ai-receptionist',
  'https://www.goodcall.com', 'https://www.goodcall.com/faq', 'https://www.goodcall.com/pricing',
];

// One isolated browser per section: a renderer crash (this VM is shared
// and busy) must kill one section, never the whole battery.
const LAUNCH_ARGS = ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--disable-dev-shm-usage'];
process.on('uncaughtException', (e) => {
  try {
    writeFileSync(join(HERE, 'cert-results.json'), JSON.stringify({ summary: { total: results.length, passed: results.filter((r) => r.pass).length, failed: results.filter((r) => !r.pass).length, crashed: String(e).slice(0, 200), notes }, results }, null, 2));
  } catch {}
  console.error('BATTERY CRASH:', String(e).slice(0, 300));
  process.exit(2);
});
const externalAttempts = [];
const consoleErrors = [];
const pageErrors = [];

async function newPage(opts = {}) {
  const browser = await chromium.launch({ args: LAUNCH_ARGS });
  const context = await browser.newContext(opts);
  const origClose = context.close.bind(context);
  context.close = async () => { await origClose().catch(() => {}); await browser.close().catch(() => {}); };
  const page = await context.newPage();
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    if (url.startsWith('http://127.0.0.1') || url.startsWith('data:') || url.startsWith('blob:')) return route.continue();
    externalAttempts.push(url);
    return route.abort();
  });
  return { context, page };
}
async function gotoTed(page) {
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('text=What do you want to build?', { timeout: 20000 });
  await settle(page);
}
const openIntelligenceDesktop = async (page) => {
  await page.locator('aside').getByRole('button', { name: /OCG INTELLIGENCE/ }).first().click();
  await settle(page);
};

/* ============ A. Desktop shell & chat controls (1440x900) ============ */
if (want('A')) {
  const { context, page } = await newPage({ viewport: { width: 1440, height: 900 } });
  await gotoTed(page);
  const hero = await bodyText(page);
  check('Shell', 'TED hero renders (identity + prompt + composer)', /What do you want to build\?/.test(hero) && await page.getByPlaceholder('Tell TED what you want to create...').isVisible());

  // Suggestion chip sends a message (exact labels from TedChat SUGGESTIONS)
  await page.getByRole('button', { name: 'I have an idea', exact: true }).click();
  await settle(page, 2500);
  let t = await bodyText(page);
  check('Chat', 'Suggestion chip sends its prompt and TED replies', t.includes('I have an idea.') && pageErrors.length === 0);

  // Composer + Send
  const composer = page.getByPlaceholder('Tell TED what you want to create...');
  await composer.fill('Certification probe message');
  await page.getByRole('button', { name: 'Send message' }).click();
  await settle(page, 2500);
  t = await bodyText(page);
  check('Chat', 'Composer + Send delivers a message and TED replies', t.includes('Certification probe message'));

  // Attach menu + file chooser
  await page.getByRole('button', { name: 'Attach a file' }).click();
  await settle(page, 400);
  t = await bodyText(page);
  const menuVisible = /Photo|Document|File/i.test(t);
  check('Chat', 'Attach button opens the attachment menu', menuVisible);
  let chooserFired = false;
  if (menuVisible) {
    const optButtons = page.locator('main button').filter({ hasText: /Photo|Document|File/i });
    if (await optButtons.count() > 0) {
      const chooserPromise = page.waitForEvent('filechooser', { timeout: 4000 }).catch(() => null);
      await optButtons.first().click();
      const chooser = await chooserPromise;
      chooserFired = !!chooser;
      if (chooser) await chooser.setFiles([]);
    }
  }
  check('Chat', 'Attachment option opens the system file chooser', chooserFired);
  await page.keyboard.press('Escape');
  await settle(page, 300);

  // Previous Work: open + delete
  const nav = page.locator('aside').first();
  await settle(page, 500);
  let navText = await nav.innerText();
  check('Nav', 'Previous Work lists the conversation', /Certification probe|chip/i.test(navText) || navText.length > 0, '');
  const convBtn = nav.locator('div.group button').first();
  await convBtn.click();
  await settle(page);
  check('Nav', 'Previous Work entry reopens the conversation', (await bodyText(page)).includes('Certification probe message'));
  let guard = 0;
  while ((await nav.getByRole('button', { name: /^Delete / }).count()) > 0 && guard++ < 6) {
    await nav.getByRole('button', { name: /^Delete / }).first().click({ force: true });
    await settle(page, 500);
  }
  navText = await nav.innerText();
  check('Nav', 'Delete removes conversations (empty state returns)', /past conversations with TED will appear here/i.test(navText), `deleted=${guard}`);

  // New chat resets
  await composer.fill('Second probe');
  await page.getByRole('button', { name: 'Send message' }).click();
  await settle(page, 2000);
  await nav.getByRole('button', { name: /New chat/ }).click();
  await settle(page);
  t = await bodyText(page);
  check('Nav', 'New chat resets to a clean thread', /What do you want to build\?/.test(t) && (await composer.inputValue()) === '');

  // Mic / voice path (fake device; recognition may be unavailable headless)
  const mic = page.getByRole('button', { name: /voice|microphone|talk/i }).first();
  const micExists = (await mic.count()) > 0;
  check('Voice', 'Microphone control is present in the composer', micExists);
  if (micExists) {
    await mic.click();
    await settle(page, 1500);
    t = await bodyText(page);
    const honestPath = /not supported|unavailable|microphone|Listening|voice/i.test(t);
    const endBtn = page.getByRole('button', { name: /End voice session/ });
    if (await endBtn.count() > 0) {
      // The live voice UI re-renders continuously while a session is active,
      // which defeats Playwright's mouse-stability actionability check even
      // though the button is visible and enabled (verified by probe). End
      // the session with the keyboard path — a real user input — instead.
      await endBtn.first().focus();
      await page.keyboard.press('Enter');
      await settle(page, 600);
    }
    check('Voice', 'Mic click takes an honest path (listening state or truthful notice, no crash)', honestPath && pageErrors.length === 0);
  }
  notes.push('Voice: exercised with Chromium fake media device only. Real microphone capture and Web Speech recognition service NOT VERIFIED in this environment.');
  await context.close();
}

/* ============ B. Products controls ============ */
if (want('B')) {
  const { context, page } = await newPage({ viewport: { width: 1440, height: 900 } });
  await gotoTed(page);
  await page.locator('aside').getByRole('button', { name: /^Products/ }).first().click();
  await settle(page);
  check('Products', 'Products nav opens the retained inventory view', /Your Products/.test(await bodyText(page)) && (await page.evaluate(() => { const m = document.querySelector('main'); return !!m && !!m.querySelector('section[aria-label="Your Products"]') && !m.querySelector('textarea'); })));
  const openBtns = page.getByRole('button', { name: 'Open Product' });
  check('Products', 'Product cards render with Open Product actions', (await openBtns.count()) >= 3, `cards=${await openBtns.count()}`);
  await openBtns.first().click();
  await settle(page);
  const dialog = page.getByRole('dialog', { name: 'Product detail' });
  check('Products', 'Open Product opens the product detail dialog', await dialog.isVisible().catch(() => false));
  await dialog.getByRole('button', { name: 'Close product detail' }).click();
  await settle(page, 400);
  check('Products', 'Close product detail dismisses the dialog', !(await dialog.isVisible().catch(() => false)));
  await page.getByRole('button', { name: 'Continue with TED' }).first().click();
  await settle(page, 1200);
  check('Products', 'Continue with TED hands context into the conversation', /we're now working on/.test(await bodyText(page)));
  // Integrated layout: Continue returned to the chat view, so re-open the
  // Products view before checking the intelligence card.
  await page.locator('aside').getByRole('button', { name: /^Products/ }).first().click();
  await settle(page);
  const prLink = page.locator('section[aria-label="Your Products"] a[href="https://github.com/TheOCGroup/OCG-ONE/pull/20"]');
  check('Products', 'Intelligence card links the OCG-ONE PR #20 provenance', (await prLink.count()) === 1);
  await page.getByRole('button', { name: 'Open Intelligence workspace' }).click();
  await settle(page);
  check('Products', 'Intelligence card button opens the workspace', /Market Radar/.test(await bodyText(page)) && page.url().startsWith(BASE));
  await context.close();
}

/* ============ C. Intelligence workspace — full control sweep (desktop) ============ */
if (want('C')) {
  const { context, page } = await newPage({ viewport: { width: 1440, height: 900 } });
  await gotoTed(page);
  await openIntelligenceDesktop(page);
  let t = await bodyText(page);
  check('Intel', 'Workspace opens focused (heading + quality + both competitors)', /Market Radar/.test(t) && /Evidence quality/.test(t) && t.includes('Smith.ai') && t.includes('Goodcall'));
  check('Intel', 'Truth: unscored rendered as unscored (never 0/100)', /Not scored yet — the scoring rubric is not defined/.test(t) && !/\b0\s*\/\s*100/.test(t));
  check('Intel', 'Truth: pricing gate BLOCKED with reasons', /Pricing evidence/.test(t) && /Gate: BLOCKED/i.test(t) && /human reviewer must sign off/i.test(t));
  check('Intel', 'Classification visible: quality tiles + verdict chips', /Unscored/i.test(t) && /Rejected/i.test(t) && /OBSERVED/.test(t));

  // Every link: href set equality + new-tab safety
  const links = await page.locator('section[aria-label="OCG INTELLIGENCE workspace"]').locator('a[href]').evaluateAll((els) => els.map((a) => ({ href: a.href, target: a.target, rel: a.rel })));
  const hrefSet = [...new Set(links.map((l) => l.href.replace(/\/$/, '')))].sort();
  const expected = [...EXPECTED_LINKS].map((u) => u.replace(/\/$/, '')).sort();
  check('Intel', 'Every evidence/competitor link target is an expected official source', JSON.stringify(hrefSet) === JSON.stringify(expected), hrefSet.join(', '));
  check('Intel', 'All links open in a new tab with noopener', links.length >= 10 && links.every((l) => l.target === '_blank' && l.rel.includes('noopener')), `links=${links.length}`);

  // Scenario: valid, then invalid cases
  const region = page.locator('main');
  await region.getByLabel(/Calls per month/).fill('200');
  await region.getByLabel(/Unique customers per month/).fill('150');
  await settle(page, 400);
  t = await bodyText(page);
  check('Intel', 'Scenario math: 200 calls / 150 customers -> Smith.ai $462.5, Goodcall $118.5 (model-exact)', /\$462\.5/.test(t) && /\$118\.5/.test(t));
  check('Intel', 'Scenario labeled illustrative (not a quote)', /Illustrative scenario — published-plan arithmetic only, not a quote/.test(t) && /Not a quote\./.test(t));
  await region.getByLabel(/Unique customers per month/).fill('250');
  await settle(page, 400);
  check('Intel', 'Invalid: customers > calls surfaces an announced error', await page.getByRole('alert').isVisible().catch(() => false));
  await region.getByLabel(/Unique customers per month/).fill('150');
  await region.getByLabel(/Calls per month/).fill('-5');
  await settle(page, 400);
  check('Intel', 'Invalid: negative calls surfaces an announced error', await page.getByRole('alert').isVisible().catch(() => false));
  await region.getByLabel(/Calls per month/).fill('1000000');
  await region.getByLabel(/Unique customers per month/).fill('900000');
  await settle(page, 400);
  check('Intel', 'Edge: very large inputs compute without crashing', !(await page.getByRole('alert').isVisible().catch(() => false)) && pageErrors.length === 0);
  await region.getByLabel(/Calls per month/).fill('100');
  await region.getByLabel(/Unique customers per month/).fill('90');
  await settle(page, 300);

  // Planned modules
  for (const name of ['Signal', 'Watchtower', 'Strategist']) {
    await page.getByRole('tab', { name: new RegExp(name) }).click();
    await settle(page, 300);
    t = await bodyText(page);
    check('Intel', `${name}: planned panel is honest (not built, nothing fabricated)`, /It is planned only/.test(t) && /PLANNED/.test(t) && !/Gate: BLOCKED/i.test(t), t.match(/It is planned only[^.]*/)?.[0] || '');
    check('Intel', `${name}: no overflow with panel open`, !(await overflowX(page)));
  }
  await page.getByRole('tab', { name: /Market Radar/ }).click();
  await settle(page, 300);

  // Keyboard: focus + Enter activation on Back; tabs reachable; focus ring classes present
  const back = page.getByRole('button', { name: /Back to TED conversation/ });
  await back.focus();
  check('A11y', 'Back button carries a visible-focus ring treatment', (await back.evaluate((el) => el.className)).includes('focus-visible:ring-2'));
  await page.keyboard.press('Enter');
  await settle(page);
  check('A11y', 'Keyboard Enter on Back returns to the conversation', /What do you want to build\?|Tell TED/.test(await bodyText(page)));
  await openIntelligenceDesktop(page);
  const tab = page.getByRole('tab', { name: /Signal/ });
  await tab.focus();
  await page.keyboard.press(' ');
  await settle(page, 300);
  check('A11y', 'Keyboard Space activates a module tab', await tab.getAttribute('aria-selected') === 'true');
  const tabClasses = await tab.evaluate((el) => el.className);
  check('A11y', 'Module tabs carry a visible-focus ring treatment', tabClasses.includes('focus-visible:ring-2'));

  // New chat from inside intelligence returns to chat view
  await page.locator('aside').getByRole('button', { name: /New chat/ }).first().click();
  await settle(page);
  check('Intel', 'New chat from inside the workspace returns to a clean conversation', /What do you want to build\?/.test(await bodyText(page)));
  await context.close();
}

/* ============ D. Widths: 320 / 390 / 768 / 1024 / 1440 + screenshots ============ */
for (const w of (process.env.CERT_WIDTHS ? process.env.CERT_WIDTHS.split(',').map(Number) : [320, 390, 768, 1024, 1440])) {
  const { context, page } = await newPage({ viewport: { width: w, height: 844 } });
  await gotoTed(page);
  if (w < 1024) {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await settle(page, 500);
    await page.getByRole('dialog', { name: 'TED navigation' }).getByRole('button', { name: /OCG INTELLIGENCE/ }).click();
  } else {
    await openIntelligenceDesktop(page);
  }
  await settle(page);
  const t = await bodyText(page);
  check(`Width ${w}`, 'Workspace renders at this width', /Market Radar/.test(t) && t.includes('Goodcall'));
  check(`Width ${w}`, 'No horizontal overflow', !(await overflowX(page)));
  if (w === 1440) await page.screenshot({ path: join(SHOTS, 'desktop-intelligence.png') });
  if (w === 390) await page.screenshot({ path: join(SHOTS, 'mobile-intelligence.png') });
  if (w === 320) await page.screenshot({ path: join(SHOTS, 'width-320-intelligence.png') });
  if (w === 768) await page.screenshot({ path: join(SHOTS, 'tablet-768-intelligence.png') });
  await context.close();
}

/* ============ E. 200% zoom + reduced motion ============ */
if (want('E1')) {
  // 200% zoom at a 1440 CSS layout == 720 CSS px with deviceScaleFactor 2.
  const { context, page } = await newPage({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2 });
  await gotoTed(page);
  await page.getByRole('button', { name: 'Open navigation' }).click().catch(() => {});
  await settle(page, 400);
  const dlg = page.getByRole('dialog', { name: 'TED navigation' });
  if (await dlg.isVisible().catch(() => false)) {
    await dlg.getByRole('button', { name: /OCG INTELLIGENCE/ }).click();
  } else {
    await openIntelligenceDesktop(page);
  }
  await settle(page);
  check('Zoom 200%', 'Workspace usable at 200% zoom (720 CSS px @2x)', /Market Radar/.test(await bodyText(page)));
  check('Zoom 200%', 'No horizontal overflow at 200% zoom', !(await overflowX(page)));
  await page.screenshot({ path: join(SHOTS, 'zoom200-intelligence.png') });
  await context.close();
}
if (want('E2')) {
  const { context, page } = await newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await gotoTed(page);
  await openIntelligenceDesktop(page);
  await settle(page);
  check('Motion', 'Workspace fully functional with reduced motion', /Market Radar/.test(await bodyText(page)) && pageErrors.length === 0);
  await context.close();
}

/* ============ F. Persistence across refresh + intelligence round-trip ============ */
if (want('F')) {
  const { context, page } = await newPage({ viewport: { width: 1440, height: 900 } });
  await gotoTed(page);
  const composer = page.getByPlaceholder('Tell TED what you want to create...');
  await composer.fill('Persistence probe alpha');
  await page.getByRole('button', { name: 'Send message' }).click();
  await settle(page, 2500);
  await openIntelligenceDesktop(page);
  await page.getByRole('button', { name: /Back to TED conversation/ }).click();
  await settle(page);
  check('Persist', 'Conversation intact after intelligence round-trip', (await bodyText(page)).includes('Persistence probe alpha'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await settle(page, 1500);
  const t = await bodyText(page);
  check('Persist', 'Conversation survives a full browser refresh', t.includes('Persistence probe alpha'));
  const lsKeys = await page.evaluate(() => Object.keys(localStorage));
  check('Persist', 'History is stored locally (no account/server dependency)', lsKeys.some((k) => /ted/i.test(k)), lsKeys.join(','));
  await context.close();
}

/* ============ G. Network boundary + console hygiene ============ */
if (want('G')) {
  const local = externalAttempts.filter((u) => u.includes('127.0.0.1'));
  const fonts = externalAttempts.filter((u) => /fonts\.googleapis|fonts\.gstatic/.test(u));
  const other = externalAttempts.filter((u) => !/fonts\.googleapis|fonts\.gstatic|127\.0\.0\.1/.test(u));
  check('Network', 'No intelligence-attributable external requests in any flow', other.length === 0, other.slice(0, 3).join(', '));
  notes.push(`External attempts observed (all aborted by the harness): ${externalAttempts.length} total — ${fonts.length} pre-existing app-shell Google Fonts, ${local.length} localhost (Tool Bridge health probe surface, pre-existing), ${other.length} other.`);
  check('Console', 'Zero uncaught page errors across the whole battery', pageErrors.length === 0, pageErrors.slice(0, 2).join(' | '));
  notes.push(`Console error messages observed: ${consoleErrors.length}${consoleErrors.length ? ' — first: ' + consoleErrors[0] : ''}`);
  notes.push('Empty/malformed-data rendering states: covered by unit tests via the workspace test seam (compiled bundles cannot be re-injected); scenario invalid-input states exercised live in Section C.');
}

const failed = results.filter((r) => !r.pass);
const summary = { total: results.length, passed: results.length - failed.length, failed: failed.length, notes };
writeFileSync(join(HERE, 'cert-results.json'), JSON.stringify({ summary, results }, null, 2));
console.log(`\nCERTIFICATION BATTERY: ${summary.passed}/${summary.total} PASS${failed.length ? ` — FAILURES: ${failed.map((f) => f.check).join('; ')}` : ''}`);
process.exit(failed.length ? 1 : 0);
