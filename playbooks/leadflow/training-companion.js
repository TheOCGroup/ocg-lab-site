(function(){
  const spread=document.querySelector('section[data-title="Business Training"]');
  if(!spread||spread.querySelector('.lf-starter-training'))return;
  const right=spread.querySelector('.page.right');if(!right)return;
  const prompt=right.querySelector('.prompt');if(!prompt)return;
  const text=`You work for [BUSINESS NAME]. We serve [SERVICE AREA] during [BUSINESS HOURS]. Your job is to understand why each lead contacted us, collect the information I require, remember the full relationship history, and move the lead to the correct next step. Ask one useful question at a time and never repeat information the lead already gave you. Only quote prices, promises, warranties, service availability or policies that I have explicitly approved. Never claim you sent a message, scheduled an appointment, updated a CRM or completed another outside action unless the required connector is actually available, authorized and confirms success. Escalate emergencies, sensitive situations, exceptions and anything outside your stored authority to a human.`;
  const card=document.createElement('div');card.className='callout lf-starter-training';card.innerHTML=`<b>Tell Your AI Employee This First</b><p id="lfStarterTrainingText">${text}</p><button class="copy" id="lfStarterCopy">Copy Starter Training</button>`;
  prompt.before(card);
  document.getElementById('lfStarterCopy').onclick=async function(){
    try{await navigator.clipboard.writeText(text);this.textContent='Copied';setTimeout(()=>this.textContent='Copy Starter Training',1300)}catch(e){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();this.textContent='Copied';setTimeout(()=>this.textContent='Copy Starter Training',1300)}
  };
  const style=document.createElement('style');style.textContent='.lf-starter-training{margin:10px 0 12px!important;padding:12px 14px!important}.lf-starter-training p{font-size:10.5px!important;line-height:1.35!important;margin:6px 0 9px!important}.lf-starter-training .copy{margin-top:0!important}';document.head.appendChild(style);
})();