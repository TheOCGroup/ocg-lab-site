import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.LEADFLOW_BASE_URL || 'http://127.0.0.1:4173/leadflow-ai-pro/';
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1440,height:900}});
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{if(m.type()==='error') errors.push(m.text())});
await page.goto(base,{waitUntil:'networkidle'});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'networkidle'});

// Blank-state setup -> persistent employee profile.
await page.fill('#employeeName','Riley');
await page.fill('#businessName','Test Home Services');
await page.fill('#businessType','Home Services');
await page.fill('#serviceArea','Wichita, Derby');
await page.fill('#hours','Mon-Fri 8-5');
await page.click('button:has-text("Save Employee Profile")');

for (const rule of [
  'Escalate emergency or water intrusion situations to a human immediately.',
  'Never schedule inspections after 5 PM.',
  'We service Wichita and Derby.'
]) {
  await page.fill('#ruleInput',rule);
  await page.click('button:has-text("Teach This Rule")');
}
let state=await page.evaluate(()=>JSON.parse(localStorage.getItem('ocg_leadflow_ai_pro_family_v3')));
assert.equal(state.profile.name,'Riley');
assert.equal(state.rules.length,3);

// Persistence across reload.
await page.reload({waitUntil:'networkidle'});
assert.equal(await page.inputValue('#employeeName'),'Riley');
state=await page.evaluate(()=>JSON.parse(localStorage.getItem('ocg_leadflow_ai_pro_family_v3')));
assert.equal(state.rules.length,3);

// Practice: stored scheduling/service/escalation rules are used.
for (const scenario of [
  'My roof is leaking and water is entering the house.',
  'Can someone inspect this after 6 PM?',
  'Do you service Derby?'
]) {
  await page.fill('#practiceInput',scenario);
  await page.click('button:has-text("Send")');
  await page.waitForTimeout(180);
}
state=await page.evaluate(()=>JSON.parse(localStorage.getItem('ocg_leadflow_ai_pro_family_v3')));
assert.equal(state.practice.runs,3);
assert.equal(state.practice.passed,3);

// Multi-lead memory.
await page.locator('button:has-text("Load Robert Demo")').click();
await page.fill('#lfLeadName','Sarah');
await page.fill('#lfLeadNeed','Bathroom remodel estimate');
await page.fill('#lfLeadContact','sarah@example.com');
await page.fill('#lfLeadSource','Referral');
await page.click('button:has-text("Add Lead")');
state=await page.evaluate(()=>JSON.parse(localStorage.getItem('ocg_leadflow_ai_pro_family_v3')));
assert.equal(state.leads.length,2);
assert.ok(state.leads.some(l=>l.name==='Robert'));
assert.ok(state.leads.some(l=>l.name==='Sarah'));

// Add relationship activity and verify it remains on Sarah only.
await page.fill('#lfActivityText','Sarah prefers a walkthrough next Tuesday morning.');
await page.selectOption('#lfActivityChannel','Call');
await page.click('button:has-text("Add Activity")');
state=await page.evaluate(()=>JSON.parse(localStorage.getItem('ocg_leadflow_ai_pro_family_v3')));
const sarah=state.leads.find(l=>l.name==='Sarah');
const robert=state.leads.find(l=>l.name==='Robert');
assert.ok(sarah.history.some(h=>h.text.includes('next Tuesday')));
assert.ok(!robert.history.some(h=>h.text.includes('next Tuesday')));

// Natural-language relationship retrieval.
await page.fill('#manageInput','What is going on with Robert?');
await page.locator('#manage button:has-text("Ask")').click();
await page.waitForTimeout(160);
const manageText=await page.locator('#manageChat').innerText();
assert.match(manageText,/Robert wants a kitchen remodel estimate/i);
assert.match(manageText,/Property address/i);

// Proactive attention retrieval.
await page.fill('#manageInput','Who needs attention today?');
await page.locator('#manage button:has-text("Ask")').click();
await page.waitForTimeout(160);
assert.match(await page.locator('#manageChat').innerText(),/Needs attention/i);

// Permission + action truthfulness.
for (const perm of ['draft','send','schedule']) await page.check(`[data-perm="${perm}"]`);
await page.click('button:has-text("Save Permissions")');
await page.click('button:has-text("Create Follow-Up Draft")');
state=await page.evaluate(()=>JSON.parse(localStorage.getItem('ocg_leadflow_ai_pro_family_v3')));
assert.equal(state.actions[0].type,'draft');
assert.equal(state.actions[0].state,'ready');

// Scheduling is queued, not falsely executed, without connector.
await page.click('button:has-text("Queue Scheduling")');
state=await page.evaluate(()=>JSON.parse(localStorage.getItem('ocg_leadflow_ai_pro_family_v3')));
assert.equal(state.actions[0].type,'schedule');
assert.equal(state.actions[0].state,'queued');
const scheduleId=state.actions[0].id;
await page.evaluate(id=>executeAction(id),scheduleId);
state=await page.evaluate(()=>JSON.parse(localStorage.getItem('ocg_leadflow_ai_pro_family_v3')));
assert.equal(state.actions.find(a=>a.id===scheduleId).state,'queued');
assert.match(state.actions.find(a=>a.id===scheduleId).reason,/No technical calendar connector/i);

// Register a real runtime connector, then execution may complete.
await page.evaluate(()=>LeadFlowConnectorBridge.register('calendar',async payload=>({ok:true,provider:'qa-calendar',payload})));
await page.evaluate(id=>queueAction('schedule',id,{connector:'calendar',lead:'Sarah'}),sarah.id);
state=await page.evaluate(()=>JSON.parse(localStorage.getItem('ocg_leadflow_ai_pro_family_v3')));
const liveAction=state.actions[0];
assert.equal(liveAction.state,'ready');
await page.evaluate(id=>executeAction(id),liveAction.id);
await page.waitForTimeout(80);
state=await page.evaluate(()=>JSON.parse(localStorage.getItem('ocg_leadflow_ai_pro_family_v3')));
assert.equal(state.actions.find(a=>a.id===liveAction.id).state,'completed');
assert.equal(state.actions.find(a=>a.id===liveAction.id).result.provider,'qa-calendar');

// AI DNA export.
const downloadPromise=page.waitForEvent('download');
await page.click('button:has-text("Export AI DNA")');
const download=await downloadPromise;
assert.equal(download.suggestedFilename(),'LeadFlow_AI_DNA.json');

// Readiness and operational audit trail.
const readiness=await page.evaluate(()=>recalc());
assert.ok(readiness>=70);
state=await page.evaluate(()=>JSON.parse(localStorage.getItem('ocg_leadflow_ai_pro_family_v3')));
assert.ok(state.events.length>=10);

// Desktop and mobile overflow + screenshot evidence.
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth),false);
await page.screenshot({path:'leadflow-ai-pro/qa-desktop.png',fullPage:true});
await page.setViewportSize({width:390,height:844});
await page.waitForTimeout(100);
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth),false);
await page.screenshot({path:'leadflow-ai-pro/qa-mobile.png',fullPage:true});

assert.deepEqual(errors,[]);
console.log(JSON.stringify({status:'PASS',profile:true,persistence:true,rules:3,practice:state.practice,multiLead:true,leadMemory:true,attention:true,truthfulQueuedAction:true,realConnectorExecution:true,dnaExport:true,readiness,events:state.events.length,desktopOverflow:false,mobileOverflow:false,errors},null,2));
await browser.close();
