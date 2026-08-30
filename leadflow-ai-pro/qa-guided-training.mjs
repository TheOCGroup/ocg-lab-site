import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const result={checks:{},errors:[]};
async function run(viewport,label){
  const page=await browser.newPage({viewport});
  page.on('pageerror',e=>result.errors.push(`${label}: pageerror ${e.message}`));
  page.on('console',m=>{if(m.type()==='error')result.errors.push(`${label}: console ${m.text()}`)});
  await page.goto('http://127.0.0.1:4173/leadflow-ai-pro/',{waitUntil:'networkidle'});
  await page.waitForSelector('#lfTrainingCoach',{timeout:10000});
  if(label==='desktop'){
    result.checks.trainingCoachVisible=await page.locator('#lfTrainingCoach').isVisible();
    result.checks.tenTrainingAreas=await page.locator('.lf-training-card').count()===10;
    result.checks.tellYourAgentLanguage=(await page.locator('#lfTrainingCoach').innerText()).includes('Tell your AI employee');
    result.checks.nextTrainingVisible=await page.locator('.lf-next').isVisible();
    await page.fill('#businessName','Acme Home Services');
    await page.fill('#businessType','Home services');
    await page.fill('#serviceArea','Wichita and Derby');
    await page.fill('#hours','Monday through Friday 8 AM to 5 PM');
    await page.click('button:has-text("Save Employee Profile")');
    await page.locator('.lf-training-card').first().locator('button:has-text("Use in trainer")').click();
    const filled=await page.inputValue('#ruleInput');
    result.checks.profileInterpolates=filled.includes('Acme Home Services')&&filled.includes('Wichita and Derby')&&filled.includes('Monday through Friday 8 AM to 5 PM');
    result.checks.readyScriptIsSpecific=filled.includes('Never promise service outside our confirmed service area');
    await page.click('button:has-text("Teach This Rule")');
    await page.waitForTimeout(100);
    const covered=await page.locator('.lf-training-card.done').count();
    result.checks.savedTrainingUpdatesCoach=covered>=1;
    const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('ocg_leadflow_ai_pro_family_v3')||'{}'));
    result.checks.savedRulePersists=Array.isArray(stored.rules)&&stored.rules.some(r=>String(r.text||'').includes('Acme Home Services'));
    await page.reload({waitUntil:'networkidle'});
    await page.waitForSelector('#lfTrainingCoach');
    result.checks.coveragePersistsAfterReload=await page.locator('.lf-training-card.done').count()>=1;
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+2);
  result.checks[`${label}NoHorizontalOverflow`]=!overflow;
  await page.screenshot({path:`leadflow-ai-pro/qa-training-${label}.png`,fullPage:true});
  await page.close();
}
await run({width:1440,height:900},'desktop');
await run({width:390,height:844},'mobile');
await browser.close();
const failed=Object.entries(result.checks).filter(([,v])=>!v);
result.passed=failed.length===0&&result.errors.length===0;
result.failedChecks=failed.map(([k])=>k);
console.log(JSON.stringify(result,null,2));
if(!result.passed)process.exit(1);
