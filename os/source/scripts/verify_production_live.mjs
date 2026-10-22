import { chromium } from "playwright";
import fs from "fs";
import path from "path";

// Canonical OCG LAB production target — verified live 2026-10-21:
// https://ocg-lab-os.netlify.app/os/ returns HTTP 200 and is the published
// production build of this repository (Netlify hosting, founder baseline
// 2026-09-11). The previous target, ocg-lab-products.vercel.app, is the
// retired Vercel deployment and returns HTTP 402 DEPLOYMENT_DISABLED.
// Override explicitly with OCG_PROD_URL to smoke-test another environment;
// never let this script silently test the wrong one.
const PROD_URL = process.env.OCG_PROD_URL || "https://ocg-lab-os.netlify.app/os/";
const EXPECTED_TITLE = "The OCG Lab — Practical Software for Real Businesses";

// Portable runtime: CHROME_PATH may point at a local Chrome/Chromium
// executable; otherwise Playwright's bundled Chromium is used.
// PROD_SCREENSHOT_DIR controls where captures are written.
const SCREENSHOT_DIR = process.env.PROD_SCREENSHOT_DIR || "./prod-live-screenshots";

async function main() {
  console.log(`Starting real production smoke test against ${PROD_URL}...`);
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const launchOptions = { headless: true };
  if (process.env.CHROME_PATH) launchOptions.executablePath = process.env.CHROME_PATH;
  const browser = await chromium.launch(launchOptions);

  const consoleErrors = [];
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on("console", msg => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  // The production app polls by design, so "networkidle" never settles;
  // wait for load, then for the client render to produce content.
  const response = await page.goto(PROD_URL, { waitUntil: "load", timeout: 30000 });
  console.log(`HTTP Status: ${response.status()}`);
  if (response.status() !== 200) {
    throw new Error(`Production URL returned HTTP status ${response.status()}`);
  }

  await page.waitForFunction(() => (document.body?.innerText.trim().length ?? 0) > 0, null, { timeout: 15000 });
  await page.waitForTimeout(500);

  // The production /os/ app is a client-rendered shell; the stable,
  // truthful identity assertion is its document title, verified against
  // the live site on 2026-10-21.
  const title = await page.title();
  console.log(`Production title: ${title}`);
  if (title !== EXPECTED_TITLE) {
    throw new Error(`Unexpected title on production: ${title}`);
  }

  // The app must actually render content (not a blank shell).
  const renderedText = (await page.textContent("body"))?.trim() ?? "";
  if (renderedText.length === 0) {
    throw new Error("Production page rendered no content");
  }
  console.log(`Rendered content present (${renderedText.length} chars of body text)`);

  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "prod_live_01_command.png") });
  console.log("Saved: prod_live_01_command.png");

  // NOTE (2026-10-21 cleanup): the previous version of this script also
  // asserted a strategic-objective card, an objective detail modal, and
  // an Aiden Etsy-commercialization flow. Those described the retired
  // pre-Netlify department-OS application that used to be served from
  // the old Vercel host; they are not part of the application production
  // serves today and were removed rather than re-aimed at content they
  // never described. Add new interaction assertions only against
  // behavior verified on the live Netlify build.

  await browser.close();

  console.log(`\nProduction Console Errors count: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.warn("Console errors logged:", consoleErrors);
  }

  console.log("\nREAL PRODUCTION SMOKE TEST: 100% PASSED!");
  process.exit(0);
}

main().catch(err => {
  console.error("Production smoke test failed:", err);
  process.exit(1);
});
