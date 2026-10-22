/**
 * OCG INTELLIGENCE — real browser verification (Playwright Chromium).
 *
 * NOT part of `npm test` (filename intentionally lacks .test). Run with:
 *   node tests-browser/ted-intelligence.browser.mjs [baseUrl]
 * Requires a served build (vite preview) at baseUrl (default :4173).
 *
 * Covers the PR #82 QA-gate acceptance items that were left NOT YET
 * EXECUTED, extended for the completed workspace: sidebar navigation
 * (desktop + mobile), Market Radar data flow, source evidence, planned
 * modules, scenario failure handling, TED conversation preservation,
 * history persistence, security boundaries (no external data calls),
 * reduced motion, and zero page errors.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4173/';
const OUT = new URL('../../qa-evidence/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

let passed = 0;
const failures = [];
function check(name, cond, detail = '') {
  if (cond) { passed++; console.log(`PASS  ${name}`); }
  else { failures.push(name); console.log(`FAIL  ${name} ${detail}`); }
}

const browser = await chromium.launch();

// ---------------------------------------------------------------- desktop
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const pageErrors = [];
  const externalRequests = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  page.on('request', (r) => {
    const u = new URL(r.url());
    if (u.origin !== new URL(BASE).origin && u.protocol.startsWith('http')) externalRequests.push(r.url());
  });
  await page.goto(BASE, { waitUntil: 'networkidle' });

  const composer = page.getByLabel('Tell TED what you want to create');
  check('desktop: TED chat composer visible on load', await composer.isVisible().catch(() => false));

  // Seed a real conversation through the UI.
  await composer.fill('Hello TED, what are we building?');
  await page.getByLabel('Send message').click();
  await page.getByText('Hello TED, what are we building?').waitFor({ timeout: 5000 });
  await page.waitForTimeout(1600); // persona reply latency
  check('desktop: founder message persisted in thread', true);

  const micCountBefore = await page.locator('button[aria-label*="voice" i], button[aria-label*="microphone" i], button[aria-label*="mic" i]').count();

  // Sidebar → Intelligence workspace.
  await page.getByRole('button', { name: /OCG INTELLIGENCE/ }).first().click();
  const ws = page.getByLabel('OCG INTELLIGENCE workspace');
  await ws.waitFor({ timeout: 5000 });
  check('desktop: intelligence workspace opens from sidebar', await ws.isVisible());
  check('desktop: workspace receives focus', await page.evaluate(() => document.activeElement?.getAttribute('aria-label') === 'OCG INTELLIGENCE workspace'));
  check('desktop: chat composer replaced (focused workspace)', !(await composer.isVisible().catch(() => false)));

  const wsText = await ws.innerText();
  check('radar: Smith.ai comparison present', wsText.includes('Smith.ai'));
  check('radar: Goodcall comparison present', wsText.includes('Goodcall'));
  check('radar: evidence quality counts real (4 records, 4 unscored)', /RECORDS\s+4/.test(wsText) && /UNSCORED\s+4/.test(wsText));
  check('radar: unscored honesty (Not scored — rubric pending)', /not scored — rubric pending/i.test(wsText));
  check('radar: no fabricated score shown', !/Score \d/.test(wsText));
  check('radar: pricing gate BLOCKED', /gate: blocked/i.test(wsText));
  check('radar: source attribution links present', (await ws.locator('a[href="https://smith.ai/pricing/ai-receptionist"]').count()) >= 1);
  check('radar: retrieved date shown', wsText.includes('Retrieved 2026-10-20'));
  check('radar: usage rights shown', wsText.includes('vendor-reported'));
  check('radar: illustrative scenario computed ($212.5 / $79)', wsText.includes('$212.5') && wsText.includes('$79'));
  check('radar: not-a-quote caveat shown', wsText.includes('Not a quote'));

  await page.screenshot({ path: OUT + 'desktop-intelligence.png', fullPage: false });

  // Planned module honesty.
  await page.getByRole('tab', { name: /Signal/ }).click();
  const planned = await page.getByRole('tabpanel').innerText();
  check('planned: Signal panel says not built yet', /not built yet/i.test(planned) && /planned/i.test(planned));
  await page.getByRole('tab', { name: /Market Radar/ }).click();
  await page.getByText('Competitor comparison').waitFor({ timeout: 5000 });

  // Scenario failure handling: unique customers > calls must error, not fabricate.
  await page.getByLabel('Unique customers per month').fill('500');
  await page.waitForTimeout(300);
  const alert = page.getByRole('alert');
  check('failure: invalid scenario surfaces an alert', (await alert.count()) >= 1 && (await alert.first().innerText()).includes('cannot exceed'));
  await page.getByLabel('Unique customers per month').fill('90');
  await page.waitForTimeout(300);
  check('failure: fixing input restores the estimate', (await ws.innerText()).includes('$212.5'));

  // Back to chat — conversation preserved.
  await page.getByRole('button', { name: /Back to TED conversation/ }).click();
  await composer.waitFor({ timeout: 5000 });
  check('preserve: composer back after workspace', await composer.isVisible());
  check('preserve: earlier founder message still in thread', await page.getByText('Hello TED, what are we building?').first().isVisible());
  const micCountAfter = await page.locator('button[aria-label*="voice" i], button[aria-label*="microphone" i], button[aria-label*="mic" i]').count();
  check('preserve: voice controls present before/after', micCountBefore >= 1 && micCountAfter >= 1, `before=${micCountBefore} after=${micCountAfter}`);

  // Products flow: sidebar Products → inventory → card opens workspace.
  await page.getByRole('button', { name: /^Products$/ }).first().click();
  await page.waitForTimeout(600);
  const productsText = await page.locator('#ted-products').innerText();
  check('products: intelligence card present in inventory', productsText.includes('OCG INTELLIGENCE') && /in development/i.test(productsText));
  await page.getByRole('button', { name: /Open Intelligence workspace/ }).click();
  await ws.waitFor({ timeout: 5000 });
  check('products: card button opens the workspace', await ws.isVisible());
  await page.getByRole('button', { name: /Back to TED conversation/ }).click();
  await composer.waitFor({ timeout: 5000 });

  // History persistence across the intelligence detour + reload.
  const stored = await page.evaluate(() => localStorage.getItem('ted.conversations.v1') ?? '');
  check('history: conversation stored locally', stored.includes('Hello TED'));
  await page.reload({ waitUntil: 'networkidle' });
  const prevWork = await page.locator('nav[aria-label="TED navigation"]').first().innerText();
  check('history: Previous Work survives reload', /previous work/i.test(prevWork) && prevWork.includes('Hello TED, what are we building?'));

  // Security boundary: the intelligence integration must add NO network
  // surface. Pre-existing app-shell requests are accounted for explicitly:
  // Google Fonts (index.html, predates this work) and the Tool Bridge
  // localhost health probe (TED Phase 2.2, predates this work). Any call
  // to a competitor/source domain or any other external host fails.
  const intelligenceLeaks = externalRequests.filter((u) => {
    const h = new URL(u).hostname;
    return h.endsWith('smith.ai') || h.endsWith('goodcall.com') ||
      !(h === 'fonts.googleapis.com' || h === 'fonts.gstatic.com' || h === '127.0.0.1' || h === 'localhost');
  });
  check('security: intelligence adds no external data requests', intelligenceLeaks.length === 0, intelligenceLeaks.join(', '));
  check('desktop: zero page errors', pageErrors.length === 0, pageErrors.join(' | '));
  await context.close();
}

// ------------------------------------------------------- reduced motion
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /OCG INTELLIGENCE/ }).first().click();
  await page.getByLabel('OCG INTELLIGENCE workspace').waitFor({ timeout: 5000 });
  check('a11y: workspace opens under reduced-motion', true);
  check('a11y: zero page errors under reduced-motion', pageErrors.length === 0, pageErrors.join(' | '));
  await context.close();
}

// ----------------------------------------------------------------- mobile
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  await page.goto(BASE, { waitUntil: 'networkidle' });

  await page.getByLabel('Open navigation').click();
  const drawerIntel = page.getByRole('button', { name: /OCG INTELLIGENCE/ });
  check('mobile: intelligence entry visible in drawer', await drawerIntel.last().isVisible());
  await drawerIntel.last().click();
  const ws = page.getByLabel('OCG INTELLIGENCE workspace');
  await ws.waitFor({ timeout: 5000 });
  check('mobile: workspace opens and drawer closes', await ws.isVisible());
  const wsText = await ws.innerText();
  check('mobile: competitor evidence readable', wsText.includes('Smith.ai') && /gate: blocked/i.test(wsText));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('mobile: no horizontal overflow', overflow <= 1, `overflow=${overflow}`);
  await page.screenshot({ path: OUT + 'mobile-intelligence.png' });

  await page.getByRole('button', { name: /Back to TED conversation/ }).click();
  await page.getByLabel('Tell TED what you want to create').waitFor({ timeout: 5000 });
  check('mobile: back to TED conversation works', true);
  check('mobile: zero page errors', pageErrors.length === 0, pageErrors.join(' | '));
  await context.close();
}

await browser.close();
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) { console.log('Failures:', failures.join('; ')); process.exit(1); }
