// Platform battery for the combined TED platform build (PR #86 tree).
// Drives: Unified Workspace + Planning Studio (PR #70), OS page sweep via
// Navbar, Commercialization round-trip, sync honesty, mobile, persistence.
import { chromium } from 'playwright';
import fs from 'fs';
const BASE = process.env.CERT_BASE || 'http://127.0.0.1:4173';
const OUT = new URL('./platform-results/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const results = [];
const ok = (name, cond, detail = '') => { results.push({ name, pass: !!cond, detail }); console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };
const browser = await chromium.launch({ args: ['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] });
// ---------- main context (1280) ----------
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e).slice(0, 160)));
const bodyText = () => page.evaluate(() => document.body.innerText);
const vb = (name) => page.locator('button:visible', { hasText: name });
await page.goto(BASE + '/', { waitUntil: 'load' });
await page.waitForSelector('textarea', { timeout: 20000 });
ok('boot: TED renders with chat input', true);
const goWorkspace = async () => { await vb('OCG Workspace').first().click(); await page.waitForSelector('text=Your LAB work, in one place.', { timeout: 10000 }); };
const backToTed = async () => { await vb('Back to TED').first().click(); await page.waitForSelector('textarea', { timeout: 10000 }); };
// P1 workspace
await goWorkspace();
let t = await bodyText();
ok('P1 workspace heading + five destination cards', t.includes('Your LAB work, in one place.') && (await page.locator('button:visible', { hasText: 'Open workspace' }).count()) === 5);
ok('P1 planning studio mounted', await page.locator('section[aria-label="Interactive planning studio"]').count() === 1);
ok('P1 no stray `n artifact anywhere on the page', !t.includes('`n'));
// P2 studio product defaults + governed copy summary
const studio = page.locator('section[aria-label="Interactive planning studio"]');
ok('P2 illustrative labeling visible', (await studio.innerText()).includes('Illustrative inputs · not live data'));
let st = await studio.innerText();
ok('P2 product defaults math (MRR $4,900 / surplus $3,100 / 5 churned)', st.includes('Estimated monthly recurring revenue') && st.includes('$4,900') && st.includes('Operating surplus: $3,100') && st.includes('Estimated monthly churn: 5 subscribers'));
await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE });
await studio.getByRole('button', { name: /Copy scenario summary/ }).click(); await page.waitForTimeout(400);
const clip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => '');
ok('P2b Copy scenario summary yields the governed summary text', clip.includes('TED scenario: 100 subscribers at $49/month, estimated MRR $4,900'), clip.slice(0, 90));
// P3 slider change
await page.getByLabel('Active paid subscribers', { exact: true }).focus();
for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight');
await page.waitForTimeout(300); st = await studio.innerText();
ok('P3 slider 100->200 recomputes (MRR $9,800 / surplus $8,000 / 10 churned)', st.includes('$9,800') && st.includes('Operating surplus: $8,000') && st.includes('Estimated monthly churn: 10 subscribers'));
// P4 media scenario
await page.getByRole('tab', { name: /Orion · Render budget/ }).click(); await page.waitForTimeout(300); st = await studio.innerText();
ok('P4 media defaults (1,280 credits / $128 / approval blocks rendering)', st.includes('Projected render credits') && st.includes('1,280') && st.includes('$128 estimated') && st.includes('Rendering remains blocked pending storyboard approval.'));
await studio.locator('input[type="checkbox"]').check(); await page.waitForTimeout(300); st = await studio.innerText();
ok('P4 approval checkbox flips to non-authorizing acknowledgment', st.includes('Checklist acknowledged. Rendering still requires separate authorization.'));
// P4b regression lock: per-credit readout and copied summary must show cents, never $0 for a sub-$0.50 price
ok('P4b per-credit readout shows $0.10 at the default', st.includes('$0.10'));
await studio.getByRole('button', { name: /Copy scenario summary/ }).click(); await page.waitForTimeout(400);
const mclip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => '');
ok('P4b copied ORION summary states $0.10 per credit', mclip.includes('at an assumed $0.10 per credit'), mclip.slice(0, 110));
// P4c regression lock: a nonzero sub-$1 total must show cents, never $0 (extreme-minimum corner)
for (const label of ['Storyboard scenes', 'Attempts per scene', 'Credits per attempt', 'Assumed USD per credit']) {
  await page.getByLabel(label, { exact: true }).focus(); await page.keyboard.press('Home');
}
await page.waitForTimeout(300); st = await studio.innerText();
ok('P4c minimum-corner total shows $0.10 estimated, not $0', st.includes('$0.10 estimated'), st.slice(-200).replace(/\n/g, ' | '));
await studio.getByRole('button', { name: /Copy scenario summary/ }).click(); await page.waitForTimeout(400);
const cclip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => '');
ok('P4c copied summary states estimated $0.10', cclip.includes('10 credits at an assumed $0.01 per credit, estimated $0.10'), cclip.slice(0, 120));
// P10 persistence across navigation
await backToTed();
await page.locator('textarea').first().fill('Platform battery persistence probe');
await page.keyboard.press('Enter'); await page.waitForTimeout(2500);
await goWorkspace(); await backToTed(); await page.waitForTimeout(600);
t = await bodyText();
ok('P10 conversation survives workspace round-trip', t.includes('Platform battery persistence probe'));
// P7 commercialization round-trip
await vb('Commercialization').first().click(); await page.waitForTimeout(1200);
t = await bodyText();
ok('P7 Commercialization view renders', t.includes('Commercialization') && t.length > 400, `len=${t.length}`);
await backToTed();
ok('P7 back to TED', true);
// P5 workspace destination -> Projects
await goWorkspace();
await page.evaluate(() => window.scrollTo(0, 0));
await page.locator('button:visible', { hasText: 'Open workspace' }).first().click(); await page.waitForTimeout(1200);
t = await bodyText();
ok('P5 Client Projects destination renders the Projects page', /Project/i.test(t) && t.length > 400, `len=${t.length}`);
ok('zero page errors across the main-context platform run', errors.length === 0, errors.slice(0, 2).join(' | '));
await page.screenshot({ path: OUT + 'platform-desktop-projects.png' });
// ---------- wide context (1600): Navbar sweep + sync honesty ----------
{
  const wctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
  const wp = await wctx.newPage(); const werrors = [];
  wp.on('pageerror', e => werrors.push(String(e).slice(0, 120)));
  const wvb = (name) => wp.locator('header button:visible', { hasText: name });
  await wp.goto(BASE + '/', { waitUntil: 'load' }); await wp.waitForSelector('textarea', { timeout: 20000 });
  await wp.locator('button:visible', { hasText: 'Project Workbench' }).first().click(); await wp.waitForTimeout(1000);
  const sweep = [['Workspaces', 'Your LAB work, in one place.'], ['Systems', null], ['Workforce', null], ['QA & Releases', null], ['Engineering', null], ['Commercial', null], ['Knowledge', null], ['Projects', null]];
  for (const [label, expect] of sweep) {
    await wvb(label).first().click(); await wp.waitForTimeout(900);
    const tt = await wp.evaluate(() => document.body.innerText); const heads = await wp.locator('h1, h2').count();
    ok(`P6 nav -> ${label} renders`, tt.length > 300 && heads >= 1 && (!expect || tt.includes(expect)), `len=${tt.length} h=${heads}`);
  }
  let dialogText = '';
  wp.once('dialog', async d => { dialogText = d.message(); await d.dismiss(); });
  await wvb('SYNC').first().click(); await wp.waitForTimeout(600);
  const faked = await wp.evaluate(() => document.body.innerText.includes('SYNCED'));
  ok('P8 sync asks for founder key and never fakes SYNCED', dialogText.includes('Founder cloud-sync key') && !faked, dialogText.slice(0, 60));
  await wvb('TED').first().click(); await wp.waitForSelector('textarea', { timeout: 10000 });
  ok('P6 nav -> TED returns to the conversation', true);
  ok('zero page errors across the wide-context sweep', werrors.length === 0, werrors.slice(0, 2).join(' | '));
  await wp.screenshot({ path: OUT + 'platform-desktop-sweep.png' });
  await wctx.close();
}
// ---------- mobile (390) ----------
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await mctx.newPage(); const merrors = [];
mp.on('pageerror', e => merrors.push(String(e).slice(0, 120)));
await mp.goto(BASE + '/', { waitUntil: 'load' }); await mp.waitForSelector('textarea', { timeout: 20000 });
await mp.getByRole('button', { name: 'Open navigation' }).click(); await mp.waitForTimeout(700);
await mp.locator('button:visible', { hasText: 'OCG Workspace' }).first().click(); await mp.waitForSelector('text=Your LAB work, in one place.', { timeout: 10000 });
await mp.getByRole('tab', { name: /Orion · Render budget/ }).click(); await mp.waitForTimeout(300);
const mst = await mp.locator('section[aria-label="Interactive planning studio"]').innerText();
const noOverflow = await mp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
ok('P9 mobile: workspace + studio media tab work, no horizontal overflow', mst.includes('1,280') && noOverflow && merrors.length === 0, merrors[0] || '');
await mp.screenshot({ path: OUT + 'platform-mobile-workspace.png' });
const failed = results.filter(r => !r.pass);
fs.writeFileSync(OUT + 'platform-results.json', JSON.stringify({ total: results.length, passed: results.length - failed.length, failed: failed.map(f => f.name), results }, null, 2));
console.log(`\nPLATFORM BATTERY: ${results.length - failed.length}/${results.length} passed`);
await browser.close();
process.exit(failed.length ? 1 : 0);
