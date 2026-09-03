const SOURCES=[
  ['Fannie Mae Selling Guide','https://selling-guide.fanniemae.com/'],
  ['Fannie Mae Selling Policy Communications','https://singlefamily.fanniemae.com/selling-policy-communications'],
  ['HUD FHA Mortgagee Letters','https://www.hud.gov/hudclips/letters/mortgagee'],
  ['HUD FHA Lender Resources','https://www.hud.gov/LENDERS'],
  ['CFPB Regulation Z §1026.24 Advertising','https://www.consumerfinance.gov/rules-policy/regulations/1026/24/'],
  ['CFPB Loan Originator Rule Resources','https://www.consumerfinance.gov/compliance/compliance-resources/mortgage-resources/loan-origination-rule/'],
  ['CFPB RESPA Resources','https://www.consumerfinance.gov/compliance/compliance-resources/mortgage-resources/real-estate-settlement-procedures-act/']
];

function strip(html){return html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim().slice(0,18000)}
async function fetchSource([publisher,url]){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),7000);try{const r=await fetch(url,{signal:controller.signal,headers:{'user-agent':'OCG-Lender-AI-SUPER-PRO/1.0'}});if(!r.ok)throw new Error(String(r.status));const text=strip(await r.text());return{publisher,url,retrieved_at:new Date().toISOString(),text}}finally{clearTimeout(timer)}}
function jsonFromModel(text){const clean=text.replace(/^```json\s*/i,'').replace(/```$/,'').trim();return JSON.parse(clean)}
async function gemini(prompt){const key=process.env.GEMINI_API_KEY||process.env.GOOGLE_API_KEY;if(!key)throw new Error('MODEL_NOT_CONFIGURED');const model=process.env.GEMINI_MODEL||'gemini-2.5-flash';const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{temperature:.15,responseMimeType:'application/json'}})});if(!r.ok)throw new Error(`MODEL_${r.status}`);const data=await r.json();const text=data?.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('')||'';if(!text)throw new Error('MODEL_EMPTY');return jsonFromModel(text)}
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'POST required'});
  try{
    const body=req.body||{};const audience=String(body.audience||'Homebuyers');const market=String(body.market||'Wichita, Kansas');const history=Array.isArray(body.history)?body.history.slice(0,20):[];
    const settled=await Promise.allSettled(SOURCES.map(fetchSource));
    const evidence=settled.filter(x=>x.status==='fulfilled').map(x=>x.value);
    if(evidence.length<3)return res.status(503).json({error:'Authoritative research service could not obtain enough live source evidence.'});
    const sourceText=evidence.map((s,i)=>`SOURCE ${i+1}\nPublisher: ${s.publisher}\nURL: ${s.url}\nRetrieved: ${s.retrieved_at}\nText: ${s.text}`).join('\n\n');
    const prompt=`You are the production research engine for a U.S. mortgage lender content assistant. Use ONLY the source evidence below. Do not invent current rates, program rules, eligibility, loan limits, market statistics, or regulatory facts. Audience: ${audience}. Market: ${market}. Recently used topics: ${JSON.stringify(history)}. Return JSON only with this shape: {"opportunities":[{"score":0,"topic":"","why_now":"","classification":"current|evergreen","audience":"","hook":"","cta":"","compliance_risk":"low|medium|high","sources":[{"publisher":"","url":"","retrieved_at":""}]}]}. Return at least 3 and at most 5 ranked opportunities. For any current claim, include only supporting sources from the supplied evidence. If a topic is not supported as current, mark it evergreen and do not use freshness language. Avoid unnecessary repetition of recent topics.\n\n${sourceText}`;
    const result=await gemini(prompt);
    if(!Array.isArray(result.opportunities)||result.opportunities.length<3)throw new Error('MODEL_BAD_SHAPE');
    const allowed=new Map(evidence.map(s=>[s.url,s]));
    for(const op of result.opportunities){
      if(op.classification!=='evergreen'){
        if(!Array.isArray(op.sources)||!op.sources.length)throw new Error('UNSOURCED_CURRENT_OPPORTUNITY');
        op.sources=op.sources.map(s=>allowed.get(s.url)).filter(Boolean);
        if(!op.sources.length)throw new Error('UNVERIFIED_SOURCE_REFERENCE');
      }else op.sources=Array.isArray(op.sources)?op.sources.map(s=>allowed.get(s.url)).filter(Boolean):[];
    }
    return res.status(200).json({generated_at:new Date().toISOString(),source_count:evidence.length,opportunities:result.opportunities.slice(0,5)});
  }catch(e){console.error('lender research error',e);return res.status(503).json({error:e.message==='MODEL_NOT_CONFIGURED'?'Production AI model is not configured.':`Live research unavailable: ${e.message||'unknown error'}`});}
};
