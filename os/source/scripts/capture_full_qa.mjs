import { chromium } from "playwright";
import { spawn } from "child_process";
import path from "path";
import http from "http";

const SCREENSHOT_DIR = "C:\\Users\\Genaro\\.gemini\\antigravity\\brain\\e26883fb-3b54-413d-a260-55d29c049d46\\screenshots";

function pingServer() {
  return new Promise((resolve) => {
    const req = http.get("http://localhost:5173", (res) => {
      if (res.statusCode === 200) resolve(true);
      else resolve(false);
    });
    req.on("error", () => resolve(false));
    req.end();
  });
}

async function main() {
  console.log("Starting preview server...");
  const server = spawn("cmd.exe", ["/c", "npx", "vite", "preview", "--port", "5173"], {
    cwd: "C:\\Users\\Genaro\\.gemini\\antigravity\\scratch\\ocg-lab",
    stdio: "pipe"
  });

  for (let i = 0; i < 20; i++) {
    if (await pingServer()) {
      console.log("Server ready on port 5173!");
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
  await dPage.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await dPage.waitForTimeout(300);

  const desktopViews = [
    { name: "desktop_01_command.png", nav: "Command" },
    { name: "desktop_02_projects.png", nav: "Projects" },
    { name: "desktop_03_portfolio.png", nav: "Portfolio" },
    { name: "desktop_04_operations.png", nav: "Agents & Ops" },
    { name: "desktop_05_qa_releases.png", nav: "QA & Releases" },
    { name: "desktop_06_storefronts.png", nav: "Storefronts" },
    { name: "desktop_07_knowledge.png", nav: "Knowledge & R&D" },
  ];

  for (const v of desktopViews) {
    await dPage.click(`nav button:has-text("${v.nav}")`);
    await dPage.waitForTimeout(300);
    await dPage.screenshot({ path: path.join(SCREENSHOT_DIR, v.name) });
    console.log(`Saved: ${v.name}`);
  }

  await dPage.click("button[data-aiden-btn=\"desktop\"]");
  await dPage.waitForTimeout(400);
  await dPage.screenshot({ path: path.join(SCREENSHOT_DIR, "desktop_08_aiden_modal.png") });
  console.log("Saved: desktop_08_aiden_modal.png");
  await desktopCtx.close();

  // 2. TABLET (768x1024)
  console.log("\n=== 2. CAPTURING TABLET (768x1024) ===");
  const tabCtx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const tPage = await tabCtx.newPage();
  await tPage.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await tPage.waitForTimeout(300);

  await tPage.screenshot({ path: path.join(SCREENSHOT_DIR, "tablet_01_command.png") });
  console.log("Saved: tablet_01_command.png");

  // Projects
  await tPage.click("button[data-menu-toggle=\"mobile\"]");
  await tPage.waitForTimeout(200);
  await tPage.click("button[data-nav-mobile=\"projects\"]");
  await tPage.waitForTimeout(300);
  await tPage.screenshot({ path: path.join(SCREENSHOT_DIR, "tablet_02_projects.png") });
  console.log("Saved: tablet_02_projects.png");

  // Portfolio
  await tPage.click("button[data-menu-toggle=\"mobile\"]");
  await tPage.waitForTimeout(200);
  await tPage.click("button[data-nav-mobile=\"portfolio\"]");
  await tPage.waitForTimeout(300);
  await tPage.screenshot({ path: path.join(SCREENSHOT_DIR, "tablet_03_portfolio.png") });
  console.log("Saved: tablet_03_portfolio.png");

  // Tablet Aiden Modal
  await tPage.click("button[data-aiden-btn=\"mobile\"]");
  await tPage.waitForTimeout(400);
  await tPage.screenshot({ path: path.join(SCREENSHOT_DIR, "tablet_04_aiden_modal.png") });
  console.log("Saved: tablet_04_aiden_modal.png");
  await tabCtx.close();

  // 3. MOBILE (390x844)
  console.log("\n=== 3. CAPTURING MOBILE (390x844) ===");
  const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mPage = await mobCtx.newPage();
  await mPage.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await mPage.waitForTimeout(300);

  await mPage.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile_01_command.png") });
  console.log("Saved: mobile_01_command.png");

  // Projects
  await mPage.click("button[data-menu-toggle=\"mobile\"]");
  await mPage.waitForTimeout(200);
  await mPage.click("button[data-nav-mobile=\"projects\"]");
  await mPage.waitForTimeout(300);
  await mPage.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile_02_projects.png") });
  console.log("Saved: mobile_02_projects.png");

  // Portfolio
  await mPage.click("button[data-menu-toggle=\"mobile\"]");
  await mPage.waitForTimeout(200);
  await mPage.click("button[data-nav-mobile=\"portfolio\"]");
  await mPage.waitForTimeout(300);
  await mPage.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile_03_portfolio.png") });
  console.log("Saved: mobile_03_portfolio.png");

  // Mobile Aiden Modal
  await mPage.click("button[data-aiden-btn=\"mobile\"]");
  await mPage.waitForTimeout(400);
  await mPage.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile_04_aiden_modal.png") });
  console.log("Saved: mobile_04_aiden_modal.png");
  await mobCtx.close();

  await browser.close();
  spawn("taskkill", ["/pid", server.pid.toString(), "/f", "/t"]);
  console.log("\nFull Rendered QA Complete! All 16 screenshots saved.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
