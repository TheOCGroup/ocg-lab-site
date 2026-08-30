const LEADFLOW_TRAINING_CATEGORIES=[
  {id:'business',title:'1. Teach the business basics',why:'Your AI employee needs the operating facts before it can qualify or route anyone.',keywords:['work for','service area','business hours'],template:p=>`You work for ${p.business||'[BUSINESS NAME]'}. We are a ${p.type||'[BUSINESS TYPE]'} business. We serve ${p.area||'[SERVICE AREA]'}. Our normal business hours are ${p.hours||'[BUSINESS HOURS]'}. When a new lead contacts us, first understand why they reached out, then follow the rules I teach you. Never promise service outside our confirmed service area or hours unless I explicitly approve it.`},
  {id:'services',title:'2. Teach services + pricing boundaries',why:'This prevents made-up prices, services, guarantees and availability.',keywords:['approved pricing','do not invent','services we offer'],template:p=>`These are the services or products we offer: [LIST THEM]. These are the services we do NOT offer: [LIST THEM]. Only quote a price, range, discount, warranty, guarantee or promotion when I have explicitly approved that information in your training. If a lead asks for something you do not have verified information for, say you need to confirm it and route the question to me. Never invent pricing, availability, coverage, guarantees or policies.`},
  {id:'qualification',title:'3. Teach exactly how to qualify a lead',why:'LeadFlow should know what information is required before the lead can advance.',keywords:['qualification','ask one question','required information'],template:p=>`For every new lead, qualify them conversationally. Collect the person's name, best contact information, what they need, service or property location when relevant, timing or urgency, and any business-specific information I require before the next step. Ask one useful question at a time. Do not repeat a question the lead already answered. Before you advance the lead, identify any required information that is still missing. My additional qualification criteria are: [ADD YOUR CRITERIA].`},
  {id:'priority',title:'4. Teach lead priority',why:'Your AI employee should know who needs attention first instead of treating every lead the same.',keywords:['high priority','lead priority','urgent lead'],template:p=>`Use these lead-priority rules: HIGH PRIORITY when [DEFINE YOUR BEST / MOST URGENT LEADS]. MEDIUM PRIORITY when [DEFINE]. LOW PRIORITY when [DEFINE]. Immediately flag a lead for human review when [DEFINE]. Do not change priority based on assumptions; use the facts in the relationship history and my rules.`},
  {id:'scheduling',title:'5. Teach scheduling rules',why:'Scheduling is where an untrained AI can make promises the business cannot keep.',keywords:['schedule','calendar','available time'],template:p=>`My scheduling rules are: [ADD APPOINTMENT TYPES, DURATIONS, BUFFERS AND BLACKOUTS]. Our normal hours are ${p.hours||'[BUSINESS HOURS]'}. Before scheduling, make sure the required lead information is complete. Never claim an appointment time is available unless a real connected calendar confirms it. Never schedule outside my approved rules. If the calendar is not connected, ask for preferred times or prepare the request for a human instead of pretending an appointment was booked.`},
  {id:'followup',title:'6. Teach the follow-up cadence',why:'The AI should follow up with context, not send generic repeated messages.',keywords:['follow up','follow-up','stop following'],template:p=>`My follow-up rules are: [ADD YOUR TIMING / CADENCE]. Every follow-up must use the relationship history so you do not ask questions that were already answered. State the most useful next step clearly. Do not manufacture urgency. Stop following up when [DEFINE STOP CONDITIONS]. Escalate to me when [DEFINE HUMAN HANDOFF CONDITIONS].`},
  {id:'escalation',title:'7. Teach human escalation + emergencies',why:'The AI must know the situations it should not handle on its own.',keywords:['escalat','emergency','human review'],template:p=>`Escalate to a human immediately for emergencies or safety issues, angry or threatening customers, legal or regulatory questions, refund or discount exceptions, requests for unsupported guarantees, sensitive complaints, or anything outside your stored authority. For an urgent situation, collect only the essential contact and location/context needed for the handoff, tell the person a human needs to review it, and never invent an emergency policy. My additional escalation rules are: [ADD THEM].`},
  {id:'voice',title:'8. Teach brand voice',why:'The employee should sound like the business, not like a generic chatbot.',keywords:['brand voice','sound like','tone'],template:p=>`Use this communication style for ${p.business||'[BUSINESS NAME]'}: [DESCRIBE YOUR BRAND VOICE]. Sound natural, concise, capable and helpful. Do not sound robotic or over-explain. Mirror the customer's level of formality without becoming unprofessional. Use our preferred terminology: [ADD TERMS]. Never use these phrases or claims: [ADD PROHIBITED LANGUAGE].`},
  {id:'permissions',title:'9. Teach action permissions + truthfulness',why:'This is the non-negotiable rule that keeps LeadFlow honest about real-world actions.',keywords:['never claim','connector','completed action'],template:p=>`Never say you sent a message, booked or changed an appointment, updated a CRM, contacted a lead, assigned a lead, or completed any external action unless the required connector is actually available, authorized, and confirms success. If a connector is unavailable, draft the action or queue it and tell me exactly what still needs to happen. My allowed actions are controlled by the LeadFlow permissions I set. Never bypass those permissions.`},
  {id:'handoff',title:'10. Teach the owner handoff standard',why:'Every human handoff should be immediately usable instead of forcing the owner to reread the whole history.',keywords:['handoff','what they want','next action'],template:p=>`Whenever you hand a lead to me or another team member, summarize: who the person is, what they want, relevant relationship history, what has already been done, missing information, appointment status, follow-up status, risks or blockers, and the exact recommended next action. Include only stored facts. If something is unknown, label it unknown.`}
];

function lfTrainingProfile(){return typeof S!=='undefined'&&S.profile?S.profile:{}}
function lfTemplate(item){return item.template(lfTrainingProfile())}
function lfUseTraining(id,saveNow=false){
  const item=LEADFLOW_TRAINING_CATEGORIES.find(x=>x.id===id); if(!item)return;
  const box=document.getElementById('ruleInput'); if(!box)return;
  box.value=lfTemplate(item); box.focus(); box.scrollIntoView({behavior:'smooth',block:'center'});
  if(saveNow&&typeof teachRule==='function')teachRule();
}
function lfCopyTraining(id){
  const item=LEADFLOW_TRAINING_CATEGORIES.find(x=>x.id===id);if(!item)return;
  const text=lfTemplate(item);
  if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>typeof toast==='function'&&toast('Training script copied')).catch(()=>{});
}
function lfRuleCovered(item){
  if(typeof S==='undefined'||!Array.isArray(S.rules))return false;
  const corpus=S.rules.filter(r=>r.active!==false).map(r=>String(r.text||'').toLowerCase()).join(' ');
  return item.keywords.some(k=>corpus.includes(k));
}
function lfNextTraining(){return LEADFLOW_TRAINING_CATEGORIES.find(x=>!lfRuleCovered(x))||null}
function lfRenderTrainingCoach(){
  const host=document.getElementById('lfTrainingCoach');if(!host)return;
  const covered=LEADFLOW_TRAINING_CATEGORIES.filter(lfRuleCovered).length;
  const next=lfNextTraining();
  host.innerHTML=`
    <div class="lf-coach-head">
      <div><div class="eyebrow">LEADFLOW TRAINING COACH</div><h3>We tell you what to teach your AI employee.</h3><p>You should not have to guess what the AI needs to know. Work through these ten training conversations. Customize the bracketed parts, then save each instruction.</p></div>
      <div class="lf-coach-progress"><strong>${covered}/10</strong><span>training areas covered</span></div>
    </div>
    ${next?`<div class="lf-next"><b>Teach this next:</b> ${next.title}<button class="btn primary" onclick="lfUseTraining('${next.id}')">Use this script</button></div>`:`<div class="lf-next complete"><b>Core training covered.</b> Move to Practice and test the employee against real customer scenarios.</div>`}
    <div class="lf-training-grid">${LEADFLOW_TRAINING_CATEGORIES.map((item,i)=>{
      const done=lfRuleCovered(item);return `<article class="lf-training-card ${done?'done':''}">
        <div class="lf-training-card-top"><span class="lf-number">${String(i+1).padStart(2,'0')}</span><span class="status-pill ${done?'green':''}">${done?'COVERED':'TEACH'}</span></div>
        <h4>${item.title}</h4><p>${item.why}</p>
        <div class="lf-say"><b>Tell your AI employee:</b><span>${lfTemplate(item)}</span></div>
        <div class="lf-card-actions"><button class="btn primary" onclick="lfUseTraining('${item.id}')">Use in trainer</button><button class="btn" onclick="lfCopyTraining('${item.id}')">Copy</button></div>
      </article>`}).join('')}</div>`;
}
function lfInjectTrainingCoach(){
  if(document.getElementById('lfTrainingCoach'))return;
  const train=document.getElementById('train');if(!train)return;
  const shell=train.querySelector('.shell');if(!shell)return;
  const intro=shell.querySelector('.section-intro');
  const coach=document.createElement('div');coach.id='lfTrainingCoach';coach.className='lf-training-coach reveal in';
  intro?.after(coach);
  lfRenderTrainingCoach();
}
const lfOriginalRenderAll=typeof renderAll==='function'?renderAll:null;
if(lfOriginalRenderAll){window.renderAll=function(){lfOriginalRenderAll();lfInjectTrainingCoach();lfRenderTrainingCoach()}}
function lfPatchPersistenceHooks(){
  ['teachRule','improveRule','removeRule','saveProfile'].forEach(name=>{
    const original=window[name];if(typeof original!=='function'||original.__lfCoachWrapped)return;
    const wrapped=function(...args){const result=original.apply(this,args);setTimeout(lfRenderTrainingCoach,0);return result};wrapped.__lfCoachWrapped=true;window[name]=wrapped;
  });
}
function lfInjectCoachStyles(){
  if(document.getElementById('lfTrainingCoachStyles'))return;
  const style=document.createElement('style');style.id='lfTrainingCoachStyles';style.textContent=`
    .lf-training-coach{margin:0 0 30px;padding:26px;border:1px solid #dce7f1;border-radius:28px;background:linear-gradient(145deg,#fff,#f4f9ff 55%,#f1fcf7);box-shadow:0 18px 50px rgba(9,39,72,.08)}
    .lf-coach-head{display:grid;grid-template-columns:1fr auto;gap:22px;align-items:start}.lf-coach-head h3{font-size:30px;line-height:1.05;letter-spacing:-.035em;margin:0 0 9px}.lf-coach-head p{color:#607386;max-width:760px;margin:0}
    .lf-coach-progress{min-width:150px;padding:16px;border-radius:20px;background:#0d1a31;color:#fff;text-align:center}.lf-coach-progress strong{display:block;font-size:30px}.lf-coach-progress span{display:block;font-size:10px;color:#a9bdd1;text-transform:uppercase;letter-spacing:.09em}
    .lf-next{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:22px 0;padding:14px 16px;border-left:4px solid #176cff;border-radius:0 16px 16px 0;background:#edf5ff;color:#29445f}.lf-next .btn{margin-left:auto}.lf-next.complete{border-left-color:#39bd70;background:#eefaf3}
    .lf-training-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.lf-training-card{display:flex;flex-direction:column;min-height:340px;border:1px solid #dde7f1;border-radius:22px;padding:18px;background:#fff}.lf-training-card.done{border-color:#bfe9d0;background:linear-gradient(180deg,#fff,#f4fcf7)}
    .lf-training-card-top{display:flex;align-items:center;justify-content:space-between}.lf-number{display:grid;place-items:center;width:38px;height:38px;border-radius:12px;background:linear-gradient(135deg,rgba(23,108,255,.11),rgba(57,189,112,.12));font-weight:900;color:#176cff}.lf-training-card h4{font-size:18px;margin:13px 0 7px}.lf-training-card>p{color:#64778a;font-size:13px;margin:0 0 12px}
    .lf-say{padding:13px;border-radius:15px;background:#0d1a31;color:#dce8f5;font-size:12px;line-height:1.52;flex:1}.lf-say b{display:block;color:#6bd4ff;font-size:10px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:7px}.lf-say span{display:block;white-space:normal}.lf-card-actions{display:flex;gap:8px;margin-top:12px}.lf-card-actions .btn{padding:10px 12px;font-size:12px}
    @media(max-width:760px){.lf-coach-head{grid-template-columns:1fr}.lf-coach-progress{width:100%}.lf-training-grid{grid-template-columns:1fr}.lf-next .btn{margin-left:0;width:100%}.lf-training-coach{padding:18px}.lf-training-card{min-height:0}}
  `;document.head.appendChild(style);
}
lfInjectCoachStyles();lfInjectTrainingCoach();lfPatchPersistenceHooks();lfRenderTrainingCoach();