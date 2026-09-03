import { chromium } from "playwright";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const SCREENSHOT_DIR = "C:\\Users\\Genaro\\.gemini\\antigravity\\brain\\e26883fb-3b54-413d-a260-55d29c049d46\\screenshots";

async function main() {
  console.log("Starting preview server...");
  const server = spawn("cmd.exe", ["/c", "npx", "vite", "preview", "--port", "5173"], {
    cwd: "C:\\Users\\Genaro\\.gemini\\antigravity\\scratch\\ocg-lab",
    stdio: "pipe"
  });

  // Wait 3s for server to start
  await new Promise(res => setTimeout(res, 3000));

  console.log("Launching browser for rendered QA...");
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });

  const viewports = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 390, height: 844 }
  ];

  const consoleErrors = [];

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name.toUpperCase()} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height }
    });
    const page = await context.newPage();

    page.on("console", msg => {
      if (msg.type() === "error") {
        console.error(`[Browser Error - ${vp.name}]`, msg.text());
        consoleErrors.push({ viewport: vp.name, text: msg.text() });
      }
    });

    page.on("pageerror", err => {
      console.error(`[Page Error - ${vp.name}]`, err.message);
      consoleErrors.push({ viewport: vp.name, text: err.message });
    });

    await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // 1. Command Page
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_01_command.png`), fullPage: false });
    console.log(`Saved ${vp.name}_01_command.png`);

    // 2. Projects Page
    // Click Projects tab or navigate
    if (vp.name === "mobile") {
      // Mobile menu might need opening or direct click
      await page.click("button:has-text('Projects')").catch(() => {});
    } else {
      await page.click("nav button:has-text('Projects')").catch(() => {});
    }
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_02_projects.png`), fullPage: false });
    console.log(`Saved ${vp.name}_02_projects.png`);

    // 3. Portfolio Page
    if (vp.name === "mobile") {
      await page.click("button:has-text('Portfolio')").catch(() => {});
    } else {
      await page.click("nav button:has-text('Portfolio')").catch(() => {});
    }
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_03_portfolio.png`), fullPage: false });
    console.log(`Saved ${vp.name}_03_portfolio.png`);

    // 4. QA & Releases Page
    if (vp.name === "mobile") {
      await page.click("button:has-text('QA & Releases')").catch(() => {});
    } else {
      await page.click("nav button:has-text('QA & Releases')").catch(() => {});
    }
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_04_qa_releases.png`), fullPage: false });
    console.log(`Saved ${vp.name}_04_qa_releases.png`);

    // 5. Aiden Orchestrator Modal
    await page.click("button:has-text('AIDEN')").catch(() => {});
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${vp.name}_05_aiden_modal.png`), fullPage: false });
    console.log(`Saved ${vp.name}_05_aiden_modal.png`);

    await context.close();
  }

  await browser.close();

  // Terminate preview server
  spawn("taskkill", ["/pid", server.pid.toString(), "/f", "/t"]);
  console.log("\nQA Browser Run Complete!");
  console.log("Total Console / Page Errors:", consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log("Errors:", JSON.stringify(consoleErrors, null, 2));
  }
}

main().catch(err => {
  console.error("Fatal QA error:", err);
  process.exit(1);
});
