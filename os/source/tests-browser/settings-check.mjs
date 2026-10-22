// Settings surface check for the TED platform build (settings branch).
// Verifies: nav reachability (desktop + mobile drawer), truthful status
// sections, the delete-all-conversations control end-to-end (including
// persistence of the deletion across a full reload), and the return path.
// Run: node tests-browser/settings-check.mjs [baseUrl]
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:4173/';
const results = [];
const ok = (name, cond, detail = '') => {
  results.push({ name, pass: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};
const browser = await chromium.launch({ args: ['--no-sandbox', '--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] });
const errors = [];

// ---------- desktop ----------
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
await page.goto(BASE, { waitUntil: 'load' });
await page.waitForSelector('textarea', { timeout: 20000 });
ok('boot: TED renders with chat input', true);

// Seed a real saved conversation through the actual chat flow.
await page.locator('textarea').first().fill('Settings check conversation — planning notes');
await page.keyboard.press('Enter');
await page.waitForTimeout(3500);
const storedBefore = await page.evaluate(() => (localStorage.getItem('ted.conversations.v1') || '').length);
ok('seed: conversation persisted to localStorage by the real chat flow', storedBefore > 50, `${storedBefore} bytes`);

// Open Settings from the desktop nav.
const nav = page.locator('nav[aria-label="TED navigation"]:visible');
await nav.getByRole('button', { name: 'Settings', exact: true }).click();
await page.waitForSelector('section[aria-label="TED settings"]', { timeout: 10000 });
let t = await page.evaluate(() => document.body.innerText);
ok('desktop: Settings view renders from nav', t.includes('What TED actually keeps in this browser'));
ok('desktop: history section shows the seeded conversation', /1\s+saved/i.test(t), t.match(/\d+\s*saved/i)?.[0] || 'no chip');
ok('desktop: bridge section truthful (not connected, no token)', t.includes('Tool Bridge') && /not connected/i.test(t));
ok('desktop: voice section reports capability rows', t.includes('Voice input (speech recognition)') && t.includes('Voice output (speech synthesis)'));
ok('desktop: founder key status truthful (not entered)', /founder key/i.test(t) && /not entered/i.test(t));
ok('desktop: product memory section present with honest no-erase note', t.includes('Product memory') && t.includes('no erase control'));

// Delete-all flow: arm the confirm, then confirm.
await page.getByRole('button', { name: 'Delete all conversations…' }).click();
await page.waitForTimeout(300);
await page.getByRole('button', { name: 'Delete all conversations', exact: true }).click();
await page.waitForTimeout(400);
t = await page.evaluate(() => document.body.innerText);
ok('delete-all: count drops to 0 saved in the Settings view', /0\s+saved/i.test(t));
const storedAfter = await page.evaluate(() => localStorage.getItem('ted.conversations.v1'));
ok('delete-all: localStorage key actually removed', storedAfter === null);

// Return path, then reload: the deletion must persist.
await page.getByRole('button', { name: 'Back to TED conversation' }).click();
await page.waitForSelector('textarea', { timeout: 10000 });
ok('return path: Back returns to the TED conversation', true);
await page.reload({ waitUntil: 'load' });
await page.waitForSelector('textarea', { timeout: 20000 });
await nav.getByRole('button', { name: 'Settings', exact: true }).click();
await page.waitForSelector('section[aria-label="TED settings"]', { timeout: 10000 });
t = await page.evaluate(() => document.body.innerText);
ok('persistence: after reload, history is still empty (deletion was real)', /0\s+saved/i.test(t) && t.includes('no saved conversations to delete'));
await ctx.close();

// ---------- mobile ----------
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mp = await mctx.newPage();
mp.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
await mp.goto(BASE, { waitUntil: 'load' });
await mp.waitForSelector('textarea', { timeout: 20000 });
await mp.getByRole('button', { name: 'Open navigation' }).click();
await mp.waitForTimeout(500);
const mnav = mp.locator('nav[aria-label="TED navigation"]:visible');
await mnav.getByRole('button', { name: 'Settings', exact: true }).click();
await mp.waitForSelector('section[aria-label="TED settings"]', { timeout: 10000 });
const mt = await mp.evaluate(() => document.body.innerText);
ok('mobile: Settings reachable from the nav drawer and renders', mt.includes('Conversation history') && mt.includes('Cloud sync & founder key'));
const overflow = await mp.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
ok('mobile: no horizontal overflow at 390px', !overflow);
await mp.getByRole('button', { name: 'Back to TED conversation' }).click();
await mp.waitForSelector('textarea', { timeout: 10000 });
ok('mobile: Back returns to the TED conversation', true);
await mctx.close();

ok('no page errors across both viewports', errors.length === 0, errors.join(' | '));
const failed = results.filter((r) => !r.pass);
console.log(`\nSETTINGS CHECK: ${results.length - failed.length}/${results.length} passed`);
await browser.close();
process.exit(failed.length ? 1 : 0);
