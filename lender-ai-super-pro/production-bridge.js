/* Routes the existing pilot UI through production research + script endpoints.
 * Capture-phase listeners prevent legacy local Scout/template generation from presenting as production.
 */
(()=>{
  const $=id=>document.getElementById(id);
  const state={opportunities:[],selected:null,lastResearch:null,lastScript:null};
  window.LenderAIResearchState=state;

  function profile(){return{name:$('lenderName')?.value?.trim()||'Brandy',company:$('company')?.value?.trim()||'',market:$('market')?.value?.trim()||'Wichita, Kansas',nmls:$('nmls')?.value?.trim()||'',voice:$('voice')?.value||'Warm educator',cta:$('preferredCta')?.value?.trim()||''}}
  function history(){try{return JSON.parse(localStorage.getItem('ocg_lender_super_pro_history_v1')||'[]').map(x=>x.topic).filter(Boolean)}catch{return[]}}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function setWorkflowStep(n){const nodes=[...document.querySelectorAll('#workflow .step')];nodes.forEach((el,i)=>{el.classList.toggle('done',i<n);el.classList.toggle('active',i===n)})}
  function sourceLabel(op){if(op.classification==='evergreen')return 'EVERGREEN — not presented as a current development';const src=(op.sources||[]).map(s=>`${s.publisher} • ${new Date(s.retrieved_at).toLocaleString()}`).join(' | ');return `LIVE EVIDENCE — ${src}`}

  async function runProductionScout(){
    const out=$('scoutOutput');if(!out||!window.LenderAIProduction)return;
    setWorkflowStep(1);out.textContent='Running live authoritative mortgage research…';
    state.selected=null;state.opportunities=[];
    try{
      const data=await window.LenderAIProduction.research({audience:$('audience')?.value||'Homebuyers',market:profile().market,history:history()});
      state.lastResearch=data;state.opportunities=data.opportunities;
      out.innerHTML=data.opportunities.map((x,i)=>`<button class="topicpick production-topic" data-index="${i}"><strong>#${i+1} • ${esc(x.score)}% opportunity</strong><span>${esc(x.topic)}</span><small>${esc(x.why_now)}<br>${esc(sourceLabel(x))}<br>Compliance risk: ${esc(x.compliance_risk)}</small></button>`).join('');
      out.querySelectorAll('.production-topic').forEach(btn=>btn.addEventListener('click',()=>{const op=state.opportunities[Number(btn.dataset.index)];state.selected=op;if($('topic'))$('topic').value=op.topic;$('topic')?.focus();}));
      setWorkflowStep(2);
    }catch(e){state.lastResearch=null;out.textContent=window.LenderAIProduction.unavailableMessage(e);setWorkflowStep(1);}
  }

  function renderScript(pkg){
    const claims=(pkg.current_claims||[]).map(c=>`• ${c.claim}\n  Source: ${c.source_url}\n  Verified: ${c.verified_at}`).join('\n');
    const sources=(state.selected?.sources||[]).map(s=>`• ${s.publisher}\n  ${s.url}\n  Retrieved: ${s.retrieved_at}`).join('\n');
    return `SOURCE-OF-TRUTH EVIDENCE\n${sources||'EVERGREEN — no current claim may be implied.'}\n\nHEADLINE\n${pkg.headline||''}\n\nHOOK\n${pkg.hook||''}\n\nSPOKEN SCRIPT\n${pkg.spoken_script}\n\nCTA\n${pkg.cta||''}\n\nLOWER THIRD\n${pkg.lower_third||''}\n\nB-ROLL\n${(pkg.b_roll||[]).map(x=>'• '+x).join('\n')}\n\nCAPTION PLAN\n${pkg.caption_plan||''}\n\nDISCLOSURES\n${(pkg.disclosures||[]).map(x=>'• '+x).join('\n')||'• Company/compliance review required before publishing.'}\n\nCURRENT CLAIM AUDIT\n${claims||'No time-sensitive current claims included.'}\n\nRISK FLAGS\n${(pkg.risk_flags||[]).map(x=>'• '+x).join('\n')||'None returned; human review still required.'}\n\nAPPROVAL GATE\nPENDING HUMAN APPROVAL — production remains locked until approved.`}

  async function generateProductionScript(){
    const out=$('scriptOutput');if(!out||!window.LenderAIProduction)return;
    if(!state.selected){out.classList.remove('empty');out.textContent='RESEARCH SELECTION REQUIRED\n\nRun the live AI Content Scout and select an evidence-backed recommendation before generating a production script. The system will not silently use the old local template.';return;}
    if($('topic')?.value?.trim()!==state.selected.topic){out.classList.remove('empty');out.textContent='TOPIC CHANGED AFTER RESEARCH\n\nRun the Content Scout again or re-select the researched topic. Production scripting is blocked because the current topic no longer matches its evidence packet.';return;}
    out.classList.remove('empty');out.textContent='Generating evidence-bound lender script…';setWorkflowStep(3);
    try{
      const pkg=await window.LenderAIProduction.script({opportunity:state.selected,profile:profile(),duration:$('length')?.value||'60 seconds'});
      state.lastScript=pkg;out.textContent=renderScript(pkg);setWorkflowStep(5);
      if($('approveBtn'))$('approveBtn').disabled=false;if($('reviseBtn'))$('reviseBtn').disabled=false;
    }catch(e){state.lastScript=null;out.textContent=`SCRIPT GENERATION BLOCKED\n\n${e.message||'The evidence-bound script service is unavailable.'}\n\nNo production script was generated.`;setWorkflowStep(3);}
  }

  document.addEventListener('click',e=>{
    const scout=e.target.closest?.('#scoutBtn');
    if(scout){e.preventDefault();e.stopImmediatePropagation();runProductionScout();return;}
    const gen=e.target.closest?.('#generateBtn');
    if(gen){e.preventDefault();e.stopImmediatePropagation();generateProductionScript();return;}
  },true);

  const status=$('scoutOutput');
  if(status&&status.textContent.includes('No')) status.textContent='Run the AI Content Scout to perform live authoritative research. Current recommendations require source evidence.';
})();
