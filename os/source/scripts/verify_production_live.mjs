import { chromium } from "playwright";
import path from "path";

const SCREENSHOT_DIR = "C:\\Users\\Genaro\\.gemini\\antigravity\\brain\\09a4059b-2949-4349-ae21-0ad6f65bc7d3\\screenshots";
const PROD_URL = "https://ocg-lab-products.vercel.app/os/";

async function main() {
  console.log(`Starting real production smoke test against ${PROD_URL}...`);
  
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });

  const consoleErrors = [];
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on("console", msg => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  const response = await page.goto(PROD_URL, { waitUntil: "networkidle", timeout: 30000 });
  console.log(`HTTP Status: ${response.status()}`);
  if (response.status() !== 200) {
    throw new Error(`Production URL returned HTTP status ${response.status()}`);
  }

  await page.waitForTimeout(1000);

  // Assert page content
  const heading = await page.textContent("h1");
  console.log(`Production H1: ${heading}`);
  if (!heading.includes("Technology Department Operating System")) {
    throw new Error(`Unexpected heading on production: ${heading}`);
  }

  // Verify Active Strategic Objective card
  const objectiveCard = await page.textContent("div:has-text('Prepare Insurance Agent AI Playbook for Etsy Sale')");
  console.log("Verified Strategic Objective Card present on live production!");

  // Capture production live screenshot 1
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "prod_live_01_command.png") });
  console.log("Saved: prod_live_01_command.png");

  // Click Inspect Objective & Work Orders
  await page.click("button:has-text('Inspect Objective & Work Orders')");
  await page.waitForTimeout(800);

  // Assert modal content
  const modalTitle = await page.textContent("h2:has-text('Prepare Insurance Agent AI Playbook for Etsy Sale')");
  console.log(`Verified Objective Detail Modal open: ${modalTitle}`);

  // Capture production live screenshot 2
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "prod_live_02_objective_detail.png") });
  console.log("Saved: prod_live_02_objective_detail.png");

  // Close modal
  await page.click("button:has-text('Close Objective Detail')");
  await page.waitForTimeout(500);

  // Test Aiden Modal on live production
  await page.click("button[data-aiden-btn='desktop']");
  await page.waitForTimeout(600);

  // Click the Etsy prompt chip
  await page.click("button:has-text('Aiden, get this OCG LAB Digital Playbook commercially ready for Etsy.')");
  await page.waitForTimeout(1000);

  const aidenReply = await page.textContent("div:has-text('Aiden Executive Briefing — Etsy Commercialization Objective')");
  console.log("Verified Aiden Orchestration directive processed on live production!");

  // Capture production live screenshot 3
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "prod_live_03_aiden_live.png") });
  console.log("Saved: prod_live_03_aiden_live.png");

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
