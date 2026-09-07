function buildReadyPrompt(i){const p=PROMPTS[i],x=profile(),s=(localStorage.getItem(STORAGE_KEY+'-situation-'+i)||'').trim();return `You are the specialist inside the OCG LAB Real Estate Investor AI Playbook. Help me apply the playbook to the situation below.

MY INVESTOR PROFILE
Primary strategies: ${x.strategy}
Typical property / buy box: ${x.buybox}
Decision style / return rules: ${x.rules}
Primary market: ${x.market}
Human-verification rule: ${x.verify}

NON-NEGOTIABLE INVESTOR GUARDRAIL
Use only facts I provide for property condition, comps, rents, ARV, bids, lender terms, title, taxes, insurance, legal documents and transaction details. Never invent missing values or market evidence. Label assumptions explicitly. If a critical fact is missing, identify it before giving a final recommendation.

CURRENT SITUATION
${s||'I have not added the situation yet. Ask only for the specific facts required for this task.'}

TASK
${p.text}`}
function saveSituation(i,val){localStorage.setItem(STORAGE_KEY+'-situation-'+i,val);const pre=document.getElementById('ready-'+i);if(pre)pre.textContent=buildReadyPrompt(i)}
function chapterIndexByTitle(term){term=term.toLowerCase();return spreads.findIndex(s=>(s.dataset.title||'').toLowerCase().includes(term))}
function openVault(){const idx=chapterIndexByTitle('Prompt Vault');if(idx>=0)goTo(idx);setTimeout(()=>document.querySelector('[data-save="profile_lines"]')?.focus(),250)}
function openVaultPrompt(name){const idx=chapterIndexByTitle('Prompt Vault');if(idx>=0)goTo(idx);setTimeout(()=>{const q=document.getElementById('vaultSearch');if(q)q.value=name;const c=document.getElementById('vaultCategory');if(c)c.value='all';renderVault();document.getElementById('vaultGrid')?.scrollIntoView({behavior:'smooth',block:'start'})},250)}
function initVault(){const sel=document.getElementById('vaultCategory');if(!sel)return;[...new Set(PROMPTS.map(p=>p.cat))].forEach(c=>sel.add(new Option(c,c)));renderVault()}
function renderVault(){const grid=document.getElementById('vaultGrid');if(!grid)return;const q=(document.getElementById('vaultSearch')?.value||'').toLowerCase();const cat=document.getElementById('vaultCategory')?.value||'all';const items=PROMPTS.map((p,index)=>({p,index})).filter(({p})=>(cat==='all'||p.cat===cat)&&(!q||`${p.name} ${p.cat} ${p.text}`.toLowerCase().includes(q)));grid.innerHTML=items.map(({p,index})=>`<div class="vault-card"><div class="meta"><span>${p.cat}</span><span class="ready-badge">Investor profile added</span></div><h3>${p.name}</h3><div class="problem-label">1. Tell Grant what is happening</div><textarea id="situation-${index}" placeholder="Paste your verified deal facts, notes, terms or decision here." oninput="saveSituation(${index},this.value)">${localStorage.getItem(STORAGE_KEY+'-situation-'+index)||''}</textarea><div class="problem-label" style="margin-top:12px">2. Your ready-to-use prompt</div><div class="ready-preview" id="ready-${index}">${buildReadyPrompt(index)}</div><div class="vault-actions"><button class="mini-btn primary" onclick="copyPromptText(buildReadyPrompt(${index}),this)">Copy Ready Prompt</button><button class="mini-btn" onclick="askAboutPrompt(${index})">Practice with Grant</button></div></div>`).join('')||'<div class="callout"><b>No prompt found.</b><p>Try DSCR, rehab, financing, comp, offer, title, portfolio or postmortem.</p></div>'}
function askAboutPrompt(i){openAssistant();guideMode='prompt';document.getElementById('askInput').value=`Help me practice the ${PROMPTS[i].name} workflow.`;answerQuestion()}
