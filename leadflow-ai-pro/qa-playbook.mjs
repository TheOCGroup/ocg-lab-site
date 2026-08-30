import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const result={checks:{},errors:[]};
async function run(viewport,label){
  const context=await browser.newContext({viewport,permissions:['clipboard-read','clipboard-write']});
  const page=await context.newPage();
  page.on('pageerror',e=>result.errors.push(`${label}: pageerror ${e.message}`));
  page.on('console',m=>{if(m.type()==='error')result.errors.push(`${label}: console ${m.text()}`)});
  await page.goto('http://127.0.0.1:4173/playbooks/leadflow/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>typeof goTo==='function'&&typeof PROMPTS!=='undefined',{timeout:10000});
  const spreads=await page.locator('section.spread').count();
  result.checks[`${label}FourteenSpreads`]=spreads===14;
  result.checks[`${label}ThirtySixPrompts`]=await page.evaluate(()=>PROMPTS.length===36);
  result.checks[`${label}ApprovedLogo`]=await page.locator('img[data-asset="logo"]').first().evaluate(img=>img.src.includes('/assets/approved-logo.png'));
  if(label==='desktop'){
    result.checks.chapterNavigation=await page.locator('.chapter-btn').count()===14;
    await page.evaluate(()=>goTo(3));await page.waitForTimeout(100);
    result.checks.starterTrainingVisible=await page.locator('.lf-starter-training').isVisible();
    const starter=await page.locator('#lfStarterTrainingText').innerText();
    result.checks.starterTrainingIsSpecific=starter.includes('Never claim')&&starter.includes('Ask one useful question at a time')&&starter.includes('connector');
    await page.locator('#lfStarterCopy').click();await page.waitForTimeout(60);
    result.checks.copyButtonWorks=(await page.locator('#lfStarterCopy').innerText())==='Copied';
    await page.evaluate(()=>goTo(11));await page.waitForTimeout(80);
    result.checks.promptVaultRenders=await page.locator('#vaultGrid .vault-card').count()>0;
    await page.fill('#vaultSearch','attention');await page.waitForTimeout(80);
    result.checks.promptVaultSearchWorks=await page.locator('#vaultGrid .vault-card').count()>=1;
    await page.evaluate(()=>goTo(2));await page.waitForTimeout(50);
    await page.click('button:has-text("Talk to LeadFlow")');
    result.checks.assistantOpens=await page.locator('#assistant').evaluate(el=>el.classList.contains('open'));
    await page.fill('#askInput','How should I train my business rules?');await page.click('button:has-text("Ask LeadFlow")');
    const answer=await page.locator('#assistantAnswer').innerText();
    result.checks.assistantAnswersTraining=answer.toLowerCase().includes('train')||answer.toLowerCase().includes('services');
    await page.evaluate(()=>goTo(5));await page.waitForTimeout(40);
    result.checks.readingPositionSaved=await page.evaluate(()=>localStorage.getItem('lf-current')==='5');
    await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>typeof goTo==='function'&&typeof PROMPTS!=='undefined');
    result.checks.readingPositionRestored=await page.locator('section.spread.active').getAttribute('data-title')!==null && await page.evaluate(()=>localStorage.getItem('lf-current')==='5');
    await page.emulateMedia({media:'print'});
    result.checks.printMediaRenders=await page.locator('.book').isVisible();
  }
  const ho=[];const vo=[];
  for(let i=0;i<spreads;i++){
    await page.evaluate(i=>goTo(i),i);await page.waitForTimeout(25);
    const metrics=await page.locator('section.spread').nth(i).locator('.page').evaluateAll(nodes=>nodes.map(el=>({sw:el.scrollWidth,cw:el.clientWidth,sh:el.scrollHeight,ch:el.clientHeight})));
    metrics.forEach((m,j)=>{if(m.sw>m.cw+2)ho.push([i,j,m]);if(label==='desktop'&&m.sh>m.ch+2)vo.push([i,j,m])});
  }
  result.checks[`${label}NoHorizontalPageOverflow`]=ho.length===0;
  if(label==='desktop')result.checks.desktopNoVerticalPageOverflow=vo.length===0;
  await page.screenshot({path:`leadflow-ai-pro/qa-playbook-${label}.png`,fullPage:true});
  await context.close();
}
await run({width:1440,height:900},'desktop');
await run({width:390,height:844},'mobile');
await browser.close();
const failed=Object.entries(result.checks).filter(([,v])=>!v);
result.passed=failed.length===0&&result.errors.length===0;
result.failedChecks=failed.map(([k])=>k);
console.log(JSON.stringify(result,null,2));
if(!result.passed)process.exit(1);
