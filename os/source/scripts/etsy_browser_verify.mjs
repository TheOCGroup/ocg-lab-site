import { chromium } from "playwright";
import path from "path";

const SCREENSHOT_DIR = "C:\\Users\\Genaro\\.gemini\\antigravity\\brain\\09a4059b-2949-4349-ae21-0ad6f65bc7d3\\screenshots";
const ETSY_URL = "https://www.etsy.com/listing/4568082033/insurance-agent-ai-playbook-chatgpt";

async function main() {
  console.log(`Verifying public Etsy URL: ${ETSY_URL}...`);
  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true
  });

  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
  });
  const page = await ctx.newPage();

  try {
    const res = await page.goto(ETSY_URL, { waitUntil: "domcontentloaded", timeout: 25000 });
    console.log("Etsy Page HTTP status:", res.status());
    await page.waitForTimeout(3000);

    const title = await page.title();
    console.log("Etsy Page Title:", title);

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "etsy_live_listing_verified.png") });
    console.log("Saved screenshot: etsy_live_listing_verified.png");
  } catch (err) {
    console.warn("Browser navigation note:", err.message);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
