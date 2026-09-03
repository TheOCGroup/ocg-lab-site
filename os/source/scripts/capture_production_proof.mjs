import { chromium } from "playwright";
import { spawn } from "child_process";
import path from "path";
import http from "http";

const SCREENSHOT_DIR = "C:\\Users\\Genaro\\.gemini\\antigravity\\brain\\09a4059b-2949-4349-ae21-0ad6f65bc7d3\\screenshots";
const PORT = 5174;

function pingServer() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}`, (res) => {
      if (res.statusCode === 200) resolve(true);
      else resolve(false);
    });
    req.on("error", () => resolve(false));
    req.end();
  });
}

async function main() {
  console.log(`Starting preview server on port ${PORT}...`);
  const server = spawn("cmd.exe", ["/c", "npx", "vite", "preview", "--port", String(PORT)], {
    cwd: "C:\\Users\\Genaro\\.gemini\\antigravity\\scratch\\ocg-lab",
    stdio: "pipe"
  });

  for (let i = 0; i < 30; i++) {
    if (await pingServer()) {
      console.log(`Server ready on port ${PORT}!`);
      break;
    }
    await new Promise(r => setTimeout(r, 500));
  }

  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });

  // 1. DESKTOP (1440x900)
  console.log("\n=== 1. CAPTURING DESKTOP (1440x900) ===");
  const desktopCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dPage = await desktopCtx.newPage();
  await dPage.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
  await dPage.waitForTimeout(500);

  // Command page with active objective card
  await dPage.screenshot({ path: path.join(SCREENSHOT_DIR, "desktop_01_command_objective.png") });
  console.log("Saved: desktop_01_command_objective.png");

  // Click Inspect Objective
  await dPage.click("button:has-text('Inspect Objective & Work Orders')");
  await dPage.waitForTimeout(600);
  await dPage.screenshot({ path: path.join(SCREENSHOT_DIR, "desktop_02_objective_detail.png") });
  console.log("Saved: desktop_02_objective_detail.png");

  // Click Simulate Controlled Defect
  await dPage.click("button:has-text('Simulate Controlled Defect')");
  await dPage.waitForTimeout(500);
  await dPage.screenshot({ path: path.join(SCREENSHOT_DIR, "desktop_03_failure_recovery_defect.png") });
  console.log("Saved: desktop_03_failure_recovery_defect.png");

  // Click Submit Fix & Re-run QA
  await dPage.click("button:has-text('Submit Fix & Re-run QA')");
  await dPage.waitForTimeout(500);
  await dPage.screenshot({ path: path.join(SCREENSHOT_DIR, "desktop_04_failure_recovery_resolved.png") });
  console.log("Saved: desktop_04_failure_recovery_resolved.png");

  // Close modal
  await dPage.click("button:has-text('Close Objective Detail')");
  await dPage.waitForTimeout(400);

  // Open Aiden Modal & Run Directive
  await dPage.click("button[data-aiden-btn='desktop']");
  await dPage.waitForTimeout(500);

  // Click the first prompt chip (the exact directive)
  await dPage.click("button:has-text('Aiden, get this OCG LAB Digital Playbook commercially ready for Etsy.')");
  await dPage.waitForTimeout(800);
  await dPage.screenshot({ path: path.join(SCREENSHOT_DIR, "desktop_05_aiden_orchestration.png") });
  console.log("Saved: desktop_05_aiden_orchestration.png");

  await desktopCtx.close();

  // 2. TABLET (768x1024)
  console.log("\n=== 2. CAPTURING TABLET (768x1024) ===");
  const tabCtx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const tPage = await tabCtx.newPage();
  await tPage.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
  await tPage.waitForTimeout(500);

  await tPage.screenshot({ path: path.join(SCREENSHOT_DIR, "tablet_01_command.png") });
  console.log("Saved: tablet_01_command.png");

  await tPage.click("button:has-text('Inspect Objective & Work Orders')");
  await tPage.waitForTimeout(500);
  await tPage.screenshot({ path: path.join(SCREENSHOT_DIR, "tablet_02_objective_detail.png") });
  console.log("Saved: tablet_02_objective_detail.png");
  await tabCtx.close();

  // 3. MOBILE (390x844)
  console.log("\n=== 3. CAPTURING MOBILE (390x844) ===");
  const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mPage = await mobCtx.newPage();
  await mPage.goto(`http://localhost:${PORT}`, { waitUntil: "networkidle" });
  await mPage.waitForTimeout(500);

  await mPage.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile_01_command.png") });
  console.log("Saved: mobile_01_command.png");

  await mPage.click("button:has-text('Inspect Objective & Work Orders')");
  await mPage.waitForTimeout(500);
  await mPage.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile_02_objective_detail.png") });
  console.log("Saved: mobile_02_objective_detail.png");
  await mobCtx.close();

  await browser.close();
  server.kill();
  console.log("\nQA Evidence Capture Complete!");
  process.exit(0);
}

main().catch(err => {
  console.error("Capture failed:", err);
  process.exit(1);
});
