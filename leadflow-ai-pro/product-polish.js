function lfPolishStyle(){
  if(document.getElementById('lfProductPolishStyles'))return;
  const s=document.createElement('style');s.id='lfProductPolishStyles';s.textContent=`
    .reveal{opacity:1!important;transform:none!important}
    .lf-motion .reveal:not(.in){opacity:0!important;transform:translateY(18px)!important}
    .lf-motion .reveal.in{opacity:1!important;transform:none!important}
    .lf-mobile-nav{display:none}
    .lf-attention-list{display:grid;gap:8px}.lf-attention-empty{padding:12px;border-radius:14px;background:rgba(255,255,255,.06);color:#9db2c9;font-size:12px;line-height:1.5}
    .lf-attention-list .todo>div{display:grid;gap:2px;min-width:0}.lf-attention-list .todo b{display:block}.lf-attention-list .todo span:not(.badge){display:block;line-height:1.35}
    .lf-quick-commands{margin-top:14px;padding-top:13px;border-top:1px solid rgba(255,255,255,.09)}.lf-quick-commands>small{display:block;color:#7fd7ff;font-size:9px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px}.lf-command-grid{display:grid;gap:6px}.lf-command{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.055);color:#dce8f5;border-radius:11px;padding:8px 10px;text-align:left;font-size:10.5px;line-height:1.3;cursor:pointer}.lf-command:hover{background:rgba(23,108,255,.16);border-color:rgba(78,158,255,.26)}
    .lf-improvement-loop{display:grid;gap:10px;margin-top:12px}.lf-improve-step{padding:12px 14px;border:1px solid #e1e9f1;border-radius:15px;background:#fff;display:flex;gap:12px;align-items:flex-start}.lf-improve-step b{display:grid;place-items:center;flex:0 0 30px;height:30px;border-radius:10px;background:linear-gradient(135deg,rgba(23,108,255,.12),rgba(57,189,112,.13));color:#176cff}.lf-improve-step span{font-size:13px;color:#5e7184;line-height:1.45}
    @media(max-width:920px){.lf-mobile-nav{position:sticky;top:76px;z-index:45;display:flex;gap:7px;overflow-x:auto;padding:8px 11px;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);border-bottom:1px solid #e4ebf2;scrollbar-width:none}.lf-mobile-nav::-webkit-scrollbar{display:none}.lf-mobile-nav a{flex:0 0 auto;padding:8px 11px;border:1px solid #dfe8f1;border-radius:999px;background:#fff;font-size:10px;font-weight:900;letter-spacing:.05em;color:#456078}.lf-mobile-nav a:first-child{background:linear-gradient(135deg,#176cff,#12b8dd,#39bd70);color:#fff;border:0}}
  `;document.head.appendChild(s)
}
function lfReliableMotion(){
  document.documentElement.classList.add('lf-motion');
  const nodes=[...document.querySelectorAll('.reveal')];
  if('IntersectionObserver' in window){const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.08,rootMargin:'0px 0px -3% 0px'});nodes.forEach(n=>o.observe(n))}else nodes.forEach(n=>n.classList.add('in'));
  setTimeout(()=>document.querySelectorAll('.reveal').forEach(n=>n.classList.add('in')),1100)
}
function lfMobileNav(){
  if(document.querySelector('.lf-mobile-nav'))return;
  const header=document.querySelector('.topbar');if(!header)return;
  const nav=document.createElement('nav');nav.className='lf-mobile-nav';nav.setAttribute('aria-label','LeadFlow stages');nav.innerHTML='<a href="#train">Train</a><a href="#practice">Practice</a><a href="#connect">Connect</a><a href="#deploy">Deploy</a><a href="#manage">Manage</a><a href="#improve">Improve</a><a href="#playbook">Playbook</a>';header.after(nav)
}
function lfCorrectHeroStat(){
  const stats=[...document.querySelectorAll('.mini-stats .stat')];
  const target=stats.find(x=>x.textContent.includes('1 lead'));if(target)target.innerHTML='<strong>Multi-lead</strong><span>One memory per relationship</span>'
}
function lfHeroQuestion(){
  const q=document.querySelector('.hero .panel .chat-line.user');if(!q)return;
  const top=typeof attention==='function'?attention()[0]:null;
  if(top)q.textContent=`What needs my attention with ${top.l.name}?`;
  else if(typeof S!=='undefined'&&Array.isArray(S.leads)&&S.leads.length)q.textContent='Who needs my attention today?';
  else q.textContent='What should I teach you first?'
}
function lfRunHeroCommand(command){
  const input=document.getElementById('manageInput');
  if(command==='train'){document.getElementById('train')?.scrollIntoView({behavior:'smooth'});document.querySelector('.lf-next .btn')?.focus();return}
  const prompts={attention:'Who needs my attention today?',stalled:'Which leads are stalled or waiting?',missing:'What information is missing from my leads?'};
  if(input&&prompts[command]){input.value=prompts[command];document.getElementById('manage')?.scrollIntoView({behavior:'smooth'});setTimeout(()=>{if(typeof manageAsk==='function')manageAsk()},350)}
}
function lfHeroQuickCommands(){
  const conversation=document.querySelector('.hero .console-grid .panel:first-child');if(!conversation||conversation.querySelector('.lf-quick-commands'))return;
  const box=document.createElement('div');box.className='lf-quick-commands';box.innerHTML='<small>Try asking LeadFlow</small><div class="lf-command-grid"><button class="lf-command" onclick="lfRunHeroCommand(\'train\')">What should I teach my AI employee next?</button><button class="lf-command" onclick="lfRunHeroCommand(\'attention\')">Who needs my attention today?</button><button class="lf-command" onclick="lfRunHeroCommand(\'stalled\')">Which leads are stalled or waiting?</button><button class="lf-command" onclick="lfRunHeroCommand(\'missing\')">What information is missing?</button></div>';conversation.appendChild(box)
}
function lfHeroAttention(){
  const panels=document.querySelectorAll('.hero .console-grid .panel');if(panels.length<2)return;
  const panel=panels[1];if(!panel.querySelector('#lfHeroAttention'))panel.innerHTML='<h3>Needs attention</h3><div class="lf-attention-list" id="lfHeroAttention"></div>';
  const host=document.getElementById('lfHeroAttention');if(!host)return;
  const items=typeof attention==='function'?attention().slice(0,3):[];
  const trainingMissing=typeof S!=='undefined'&&Array.isArray(S.rules)&&S.rules.length<3;
  const permissionMissing=typeof S!=='undefined'&&Object.keys(S.permissions||{}).length<3;
  const rows=[];
  items.forEach(x=>rows.push(`<div class="todo"><div><b>${esc(x.l.name)}</b><span>${esc(x.l.followup||x.l.risk||x.l.next||'Review lead')}</span></div><span class="badge gold">ATTENTION</span></div>`));
  if(trainingMissing)rows.push('<div class="todo"><div><b>Training</b><span>Complete the core AI employee rules</span></div><span class="badge">TEACH</span></div>');
  if(permissionMissing)rows.push('<div class="todo"><div><b>Permissions</b><span>Decide what the AI may draft or execute</span></div><span class="badge">REVIEW</span></div>');
  host.innerHTML=rows.length?rows.join(''):'<div class="lf-attention-empty">Nothing is currently flagged. Add a lead or continue training and LeadFlow will surface what needs attention here.</div>'
}
function lfImprovePanel(){
  const box=document.querySelector('#improve .product-ladder');if(!box||box.dataset.polished)return;box.dataset.polished='1';box.innerHTML=`<div class="eyebrow">CONTINUOUS IMPROVEMENT</div><h3>Train → test → correct → retest.</h3><p style="color:#627487">LeadFlow should get better because the owner teaches it—not because it guesses.</p><div class="lf-improvement-loop"><div class="lf-improve-step"><b>1</b><span>Review failed practice scenarios, stalled leads and human corrections.</span></div><div class="lf-improve-step"><b>2</b><span>Turn the lesson into a clear persistent operating rule.</span></div><div class="lf-improve-step"><b>3</b><span>Run the same scenario again and confirm the behavior changed.</span></div><div class="lf-improve-step"><b>4</b><span>Export a fresh AI DNA when your operating rules materially change.</span></div></div>`
}
function lfPolishRender(){lfCorrectHeroStat();lfHeroQuestion();lfHeroQuickCommands();lfHeroAttention();lfImprovePanel();lfMobileNav()}
const lfPreviousRender=typeof renderAll==='function'?renderAll:null;
if(lfPreviousRender){window.renderAll=function(){lfPreviousRender();lfPolishRender()}}
lfPolishStyle();lfMobileNav();lfCorrectHeroStat();lfHeroQuestion();lfHeroQuickCommands();lfHeroAttention();lfImprovePanel();lfReliableMotion();
setTimeout(lfPolishRender,50);