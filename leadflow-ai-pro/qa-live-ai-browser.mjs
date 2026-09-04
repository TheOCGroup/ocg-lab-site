import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
const errors=[]; let getCount=0, postCount=0;
page.on('pageerror',e=>errors.push(`pageerror ${e.message}`));
page.on('console',m=>{if(m.type()==='error')errors.push(`console ${m.text()}`)});
await page.route('**/api/leadflow-ai',async route=>{
  const method=route.request().method();
  if(method==='GET'){
    getCount++;
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({status:'auth_required',provider:'vercel-ai-gateway',model:'openai/gpt-5.6-luna',configured:false})});
  }
  postCount++;
  return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'AI auth required'})});
});
await page.goto('http://127.0.0.1:4173/leadflow-ai-pro/',{waitUntil:'networkidle'});
await page.waitForFunction(()=>window.LeadFlowLiveAI && window.LeadFlowLiveAI.state==='fallback',{timeout:10000});
const status=await page.locator('#lfAiStatus').textContent();
assert.equal(status,'LOCAL MODE');
assert.ok(getCount>=1,'health endpoint should be checked');
assert.equal(postCount,0,'unconfigured Live AI must not issue POST requests during startup');
assert.equal(await page.locator('#lfLivePractice').count(),0,'Live AI Coach must not be installed when auth is unavailable');
assert.deepEqual(errors,[]);
await browser.close();
console.log(JSON.stringify({passed:true,checks:{localMode:status==='LOCAL MODE',healthChecked:getCount>=1,noPostWhenUnconfigured:postCount===0,noLivePracticeWhenUnconfigured:true,noConsoleErrors:errors.length===0}},null,2));
