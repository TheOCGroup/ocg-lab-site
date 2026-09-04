(()=>{
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const profileName=()=>($('lenderName')?.value||'').trim()||'you';

  const promptGroups=[
    ['TODAY','What Should I Post Today?',`Act as my mortgage content strategist. Using my lender profile, audience, market, approved content history and only evidence available through the connected research workflow, rank 3 useful topics I could post today. For each give: audience, why it matters now, 3 hook options, recommended 30/45/60-second format, CTA, verification needs and compliance risk. Never invent rates, program rules, eligibility, savings or market statistics.`],
    ['VIDEO','30-Second Reel',`Create a 30-second vertical video script for [AUDIENCE] about [TOPIC]. Structure: 1 strong hook, 1 plain-English teaching point, 1 practical takeaway, 1 soft CTA. Keep the spoken copy natural and teleprompter-ready. Flag every current or borrower-specific claim that requires verification.`],
    ['VIDEO','45-Second Educational Video',`Create a 45-second mortgage education video about [TOPIC] for [AUDIENCE]. Give me: headline, hook, spoken script, on-screen title, 3 caption callouts, CTA and verification flags. Use clear language and no guarantees.`],
    ['VIDEO','60-Second Authority Video',`Write a 60-second authority-building lender video about [TOPIC]. Teach rather than sell. Include hook, context, one useful example clearly labeled hypothetical, the key takeaway, CTA and compliance/verification flags.`],
    ['BIGVU','BIGVU Teleprompter Script',`Turn [APPROVED TOPIC OR DRAFT] into a BIGVU-ready teleprompter script. Use short spoken sentences, natural pauses, no stage directions inside the spoken copy, and a conversational cadence. Output: project title, spoken script, lower-third text, 3 on-screen callouts, CTA, B-roll suggestions and facts that must be verified before recording.`],
    ['BUYER','First-Time Buyer Myth',`Create a first-time homebuyer myth-vs-fact video about [MYTH]. Do not assume the myth is universally false. Explain what depends on loan program, borrower facts or lender policy, then give one useful next step.`],
    ['BUYER','Mortgage Myth vs. Fact',`Turn this mortgage misconception into a myth-vs-fact short: [MYTH]. Explain the nuance in plain English, separate general education from scenario-specific advice, and flag any current program facts that must be checked.`],
    ['CURRENT','Rate Headline Explainer',`Explain this mortgage-rate headline for consumers without predicting future rates or quoting an unverified current rate: [HEADLINE]. Give 3 hooks, a 45-second script, what the headline does NOT tell a borrower, CTA and source/verification notes.`],
    ['BUYER','Payment vs. Purchase Price',`Create a borrower education video explaining why purchase price alone does not determine affordability. Discuss payment components and scenario variables at a high level without creating a borrower-specific quote. Add CTA and verification flags.`],
    ['BUYER','Cash-to-Close Explainer',`Create a clear video explaining cash-to-close at a general educational level. Distinguish down payment, closing costs, prepaid items and possible credits/concessions without quoting universal percentages. End with a consultation CTA.`],
    ['BUYER','Seller Concession Explainer',`Create a lender-safe explainer on seller concessions: what they may help with, what they cannot automatically solve, and why program/property/transaction rules must be verified. Include Realtor-friendly language.`],
    ['BUYER','Preapproval Education',`Create a 45-second video explaining what a preapproval is, what it is not, what can change, and why buyers should keep their lender updated. Do not imply guaranteed final approval.`],
    ['BUYER','Credit Misconception',`Create a short educational video about this credit misconception: [MISCONCEPTION]. Avoid giving individualized credit-repair advice or promising score changes. Give practical questions a buyer can ask their lender.`],
    ['BUYER','Down-Payment Misconception',`Create a myth-busting video about down payment. Avoid stating one universal minimum. Explain that requirements vary by program and borrower/property facts and invite the viewer to compare verified options.`],
    ['INVESTOR','Investor / DSCR Education',`Create an investor-focused educational video about [DSCR OR INVESTOR TOPIC]. Separate general concepts from lender/investor-specific guidelines. Do not state current ratios, reserves, minimum scores, LTVs or rates unless verified from an authoritative current source.`],
    ['PARTNER','Realtor Partner Value Video',`Create a video for Realtor partners that teaches one financing-related insight they can use with buyers. Make it value-first, not referral-solicitation. Avoid compensation, quid-pro-quo or unverified program claims.`],
    ['PARTNER','Open-House Lender Video',`Create a short lender video that can support an open house at [PROPERTY/AREA]. Focus on buyer preparation, questions to ask and financing education. Do not advertise a payment or rate unless a compliant verified scenario is supplied.`],
    ['LOCAL','Local Market + Mortgage Angle',`Using only verified local-market evidence supplied through the research workflow, create a mortgage-professional video connecting [LOCAL TREND] to useful buyer questions. Separate verified local facts from general mortgage education.`],
    ['SERIES','3 Things Buyers Should Know This Week',`Create a weekly 3-point buyer video. Only use current items that have source evidence. For each point give one sentence of context and one practical takeaway. If current evidence is weak, replace it with an evergreen education item and label it evergreen.`],
    ['REPURPOSE','FAQ to Video',`Turn this real borrower or Realtor FAQ into a concise video: [QUESTION]. Give a direct answer, explain what depends on individual facts, then create hook, spoken script, CTA, captions and verification flags.`],
    ['REPURPOSE','Client Question to Reel',`Turn this anonymized client question into a Reel without exposing private information: [QUESTION]. Generalize the scenario, teach the concept, note what would require individual review, and add a soft CTA.`],
    ['REPURPOSE','Long Form to 3 Shorts',`Take this approved long-form lender content and create 3 distinct short videos with different hooks and no new factual claims. Each short needs a 30-45 second script, title and CTA: [CONTENT].`],
    ['REPURPOSE','Email to Video',`Convert this approved lender email into a video script while preserving its verified facts and disclosures: [EMAIL]. Remove email-specific wording and make it conversational for camera.`],
    ['REPURPOSE','Article to Video',`Convert this verified article or source packet into a lender video. Cite the source in the working notes, distinguish source facts from interpretation, and do not add unsupported mortgage claims: [ARTICLE/SOURCE NOTES].`],
    ['HOOK','10 Video Hooks',`Generate 10 credible hooks for a mortgage video about [TOPIC] for [AUDIENCE]. No fearbait, fake urgency, guarantees or exaggerated savings. Make the hooks specific enough to earn attention without misleading.`],
    ['CTA','CTA Generator',`Generate 10 low-pressure CTAs for [AUDIENCE] after a video about [TOPIC]. Mix DM, consultation, checklist, question and Realtor-partner CTAs. Do not imply approval, guaranteed savings or limited-time pressure.`],
    ['BIGVU','BIGVU Scene + B-Roll Plan',`For this approved lender script, create a BIGVU-friendly production plan: opening frame, lower third, 3-5 on-screen callouts, B-roll/cutaway ideas, caption emphasis, visual warnings and outro. Never use visuals that imply an unverified rate, approval or savings claim.`],
    ['BIGVU','On-Screen Titles + Captions',`Create a clean set of on-screen titles and caption emphasis phrases for this approved script. Keep wording faithful to the script and do not introduce new claims: [SCRIPT].`],
    ['SOCIAL','Instagram Caption',`Write an Instagram/Facebook caption for this approved lender video. Preserve verified facts, add a concise CTA and optional general-education disclaimer where useful. Do not create new claims: [APPROVED SCRIPT].`],
    ['SOCIAL','Facebook Version',`Adapt this approved lender content for Facebook. Use slightly more context and a conversational CTA while preserving every verified fact and disclosure: [APPROVED CONTENT].`],
    ['SOCIAL','LinkedIn Professional Version',`Adapt this approved mortgage content for LinkedIn with a professional educator tone for consumers and referral partners. Preserve facts and avoid sales hype: [APPROVED CONTENT].`],
    ['SOCIAL','YouTube Shorts Package',`Create a YouTube Shorts package from this approved lender script: title options, first-line description, full description, chapter-free short caption, keywords and CTA. Do not add new mortgage claims.`],
    ['SOCIAL','TikTok Rewrite',`Rewrite this approved mortgage script for TikTok pacing while preserving every verified fact. Use a stronger first 2 seconds, conversational phrasing and one CTA. No gimmicky guarantees or fearbait.`],
    ['SERIES','5-Episode Content Series',`Build a 5-episode educational series for [AUDIENCE] around [THEME]. For each episode provide purpose, hook, one teaching point, CTA and any verification needed. Sequence the episodes logically.`],
    ['SERIES','4-Week Content Calendar',`Create a 4-week lender content calendar using my approved content pillars and audience mix. Balance evergreen education, Realtor-partner value, FAQs, local/current topics only when verified, and conversion-oriented CTAs. Avoid repetitive topics from my recent history.`],
    ['BATCH','Record 5 Videos Today',`Give me a batch-recording plan for 5 lender videos I can record in one sitting. Use varied audiences and formats. For each include title, 30-60 second teleprompter script, lower third, CTA, B-roll/caption suggestions and verification flags.`]
  ];

  function replacePersonalizationLeaks(root=document.body){
    const name=profileName();
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let n; while(n=walker.nextNode()){
      if(/Brandy/i.test(n.nodeValue)) n.nodeValue=n.nodeValue.replace(/Brandy/gi,name==='you'?'you':name);
    }
  }

  function approvedPacket(){
    const pkg=window.LenderApprovedScript;
    if(!pkg?.spoken_script) return null;
    const p={name:($('lenderName')?.value||'').trim(),company:($('company')?.value||'').trim(),nmls:($('nmls')?.value||'').trim(),cta:($('preferredCta')?.value||'').trim()};
    return `BIGVU PRODUCTION PACKET\n\nPROJECT TITLE\n${pkg.headline||$('topic')?.value||'Lender video'}\n\nHOOK\n${pkg.hook||''}\n\nTELEPROMPTER SCRIPT\n${pkg.spoken_script}\n\nCTA\n${pkg.cta||p.cta||''}\n\nLOWER THIRD\n${[p.name,p.company,p.nmls?`NMLS ${p.nmls}`:''].filter(Boolean).join(' • ')}\n\nBIGVU HANDOFF\n1. Create a new BIGVU script/project.\n2. Paste only the TELEPROMPTER SCRIPT into the teleprompter.\n3. Apply your BIGVU Brand Kit, captions and approved visual style.\n4. Add B-roll/callouts only if they do not introduce new financial claims.\n5. Record/edit in BIGVU, then review the final video against the approved script before publishing.\n\nFINAL CHECK\nVerify current mortgage facts, disclosures, company requirements and any borrower-specific information before use.`;
  }

  function inject(){
    if(document.getElementById('bigvuStudio')) return;
    const tools=document.getElementById('tools');
    if(!tools) return;
    const section=document.createElement('section');
    section.className='section alt'; section.id='bigvuStudio';
    section.innerHTML=`<div class="shell"><div class="eyebrow">Content Production System</div><h2>Lender Content Studio + BIGVU Handoff</h2><p class="section-intro">Lender AI SUPER PRO handles mortgage-specific research, strategy, scripting, verification gates and approval. BIGVU is an optional third-party video production layer for teleprompter recording, captions, editing, branding and distribution. Your BIGVU subscription is separate and BIGVU features vary by plan.</p>
      <div class="dual-grid"><article class="step-card"><span class="step-no">01</span><h3>What Lender AI SUPER PRO does</h3><p>Finds useful mortgage content opportunities, applies your lender profile and audience, creates lender-specific scripts, preserves source/verification gates, tracks recent topics and requires human approval before production.</p></article><article class="step-card"><span class="step-no">02</span><h3>What BIGVU does</h3><p>Use BIGVU after approval when you want its teleprompter, recording, captions, editing, Brand Kit, B-roll and publishing tools. Lender AI SUPER PRO does not include or resell BIGVU and does not claim a live BIGVU account connection.</p></article></div>
      <div class="note" style="margin-top:18px"><b>Simple workflow:</b> Content Scout → verified topic → script → human approval → copy BIGVU production packet → record/edit in BIGVU → final review → publish.</div>
      <div class="actions" style="margin-top:18px"><button id="copyBigvuPacketBtn" class="btn primary">Copy BIGVU Production Packet</button><button id="showBigvuPacketBtn" class="btn">Preview Packet</button></div><div id="bigvuPacketOutput" class="output empty">Approve a live script first. Then this tool prepares a clean BIGVU handoff without changing the approved spoken copy.</div>
      <div class="eyebrow" style="margin-top:42px">Mortgage Content Vault</div><h2>36 lender-specific content workflows.</h2><p class="section-intro">Choose a workflow, replace the bracketed inputs and use it with your approved AI workflow. Current rates, programs, eligibility, savings, disclosures and local statistics must be verified before use.</p><div id="bigvuPromptGrid" class="feature-grid promptgrid"></div><div id="bigvuPromptOutput" class="output empty">Choose a content workflow to view the prompt.</div></div>`;
    tools.parentNode.insertBefore(section,tools);
    const grid=document.getElementById('bigvuPromptGrid');
    promptGroups.forEach(([tag,title,prompt],i)=>{const b=document.createElement('button');b.className='feature-card promptcard';b.type='button';b.innerHTML=`<div class="badge green">${esc(tag)}</div><h3>${esc(title)}</h3><p>Open ready-to-use workflow ${i+1}.</p>`;b.addEventListener('click',()=>{const out=$('bigvuPromptOutput');out.classList.remove('empty');out.textContent=prompt;out.scrollIntoView({behavior:'smooth',block:'center'})});grid.appendChild(b)});
    $('showBigvuPacketBtn').addEventListener('click',()=>{const out=$('bigvuPacketOutput'),packet=approvedPacket();out.classList.remove('empty');out.textContent=packet||'APPROVED SCRIPT REQUIRED\n\nRun Content Scout, generate a live evidence-backed script and approve it before preparing the BIGVU production packet.'});
    $('copyBigvuPacketBtn').addEventListener('click',async()=>{const packet=approvedPacket(),out=$('bigvuPacketOutput');out.classList.remove('empty');if(!packet){out.textContent='APPROVED SCRIPT REQUIRED\n\nRun Content Scout, generate a live evidence-backed script and approve it before preparing the BIGVU production packet.';return}try{await navigator.clipboard.writeText(packet);out.textContent='COPIED — BIGVU production packet is ready to paste into your BIGVU project.'}catch{out.textContent=packet}});
    replacePersonalizationLeaks();
    new MutationObserver(()=>replacePersonalizationLeaks()).observe(document.getElementById('app')||document.body,{subtree:true,childList:true,characterData:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(inject,0));else setTimeout(inject,0);
})();
