(function(){
  const endpoint='/api/leadflow-ai';
  let liveState='checking';
  function status(text,tone=''){
    let el=document.getElementById('lfAiStatus');
    if(!el){
      const anchor=document.getElementById('agentLabel');
      if(!anchor)return;
      el=document.createElement('span');el.id='lfAiStatus';el.className='status-pill';el.style.marginLeft='8px';anchor.parentElement.insertBefore(el,anchor.nextSibling);
    }
    el.textContent=text;el.className='status-pill '+tone;
  }
  async function health(){
    try{const r=await fetch(endpoint,{cache:'no-store'});if(!r.ok)throw new Error();const d=await r.json();liveState='ready';status('LIVE AI','green');return d}catch(e){liveState='fallback';status('LOCAL MODE','gold');return null}
  }
  function contextLead(message){
    const low=String(message||'').toLowerCase();
    return (window.S?.leads||[]).find(l=>low.includes(String(l.name||'').toLowerCase())) || (typeof window.selectedLead==='function'?window.selectedLead():null) || {};
  }
  async function askAI(mode,message,lead={}){
    const payload={mode,message,profile:window.S?.profile||{},rules:window.S?.rules||[],permissions:window.S?.permissions||{},connections:window.S?.connections||{},lead};
    const r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const d=await r.json().catch(()=>({}));
    if(!r.ok||!d.text)throw new Error(d.error||'Live AI unavailable');
    return d.text;
  }
  function deterministicManage(q){
    const low=q.toLowerCase(),exact=(window.S?.leads||[]).find(l=>low.includes(String(l.name||'').toLowerCase()));
    if(exact&&typeof window.leadSummary==='function')return window.leadSummary(exact);
    if(/who.*attention|needs.*attention|urgent|follow.?up.*due/.test(low)&&typeof window.attention==='function'){
      const list=window.attention();return list.length?'Needs attention: '+list.slice(0,8).map(x=>`${x.l.name} — ${x.l.followup||x.l.risk||x.l.next}`).join('; ')+'.':'No stored leads currently meet the attention rules.';
    }
    if(/stall|stuck|not moving/.test(low)&&typeof window.stalled==='function'){
      const list=window.stalled();return list.length?'Stalled / waiting: '+list.map(l=>`${l.name} — ${l.risk||l.stage}`).join('; ')+'.':'No stored leads are currently flagged as stalled.';
    }
    if(/missing|need from/.test(low)){
      const list=(window.S?.leads||[]).filter(l=>(l.missing||[]).length);return list.length?list.map(l=>`${l.name}: ${(l.missing||[]).join(', ')}`).join('; '):'No missing-information flags are stored.';
    }
    return 'I can answer from stored LeadFlow relationship memory. Ask about a lead by name, who needs attention, stalled leads, follow-ups, appointments, missing information or next actions.';
  }
  window.manageAsk=async function(){
    const input=document.getElementById('manageInput'),q=input?.value.trim();if(!q)return;
    if(typeof window.addLine==='function')window.addLine('manageChat',q,'user');input.value='';
    let answer='';
    try{
      status('THINKING…','gold');
      answer=await askAI('manage',q,contextLead(q));
      liveState='ready';status('LIVE AI','green');
      if(typeof window.log==='function')window.log('ai-query',q,contextLead(q)?.id||null,{mode:'manage',live:true});
      if(typeof window.persist==='function')window.persist();
    }catch(e){
      liveState='fallback';status('LOCAL MODE','gold');answer=deterministicManage(q);
    }
    if(typeof window.addLine==='function')window.addLine('manageChat',answer,'ai');
  };
  function installPracticeCoach(){
    const send=document.querySelector('#practice button[onclick="practiceSend()"]');if(!send||document.getElementById('lfLivePractice'))return;
    const b=document.createElement('button');b.id='lfLivePractice';b.className='btn';b.textContent='Live AI Coach';b.style.marginLeft='8px';
    b.onclick=async()=>{const input=document.getElementById('practiceInput'),q=input?.value.trim();if(!q)return;if(typeof window.addLine==='function')window.addLine('practiceChat',q,'user');input.value='';try{status('THINKING…','gold');const a=await askAI('practice',q,contextLead(q));status('LIVE AI','green');if(typeof window.addLine==='function')window.addLine('practiceChat',a,'ai')}catch(e){status('LOCAL MODE','gold');if(typeof window.addLine==='function')window.addLine('practiceChat','Live AI is unavailable right now. Use the standard Send button for deterministic training-rule testing.','ai')}};
    send.after(b);
  }
  window.LeadFlowLiveAI={health,ask:askAI,get state(){return liveState}};
  health();installPracticeCoach();
})();
