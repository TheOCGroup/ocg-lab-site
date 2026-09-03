function jsonFromModel(text){const clean=text.replace(/^```json\s*/i,'').replace(/```$/,'').trim();return JSON.parse(clean)}
async function gemini(prompt){const key=process.env.GEMINI_API_KEY||process.env.GOOGLE_API_KEY;if(!key)throw new Error('MODEL_NOT_CONFIGURED');const model=process.env.GEMINI_MODEL||'gemini-2.5-flash';const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{temperature:.2,responseMimeType:'application/json'}})});if(!r.ok)throw new Error(`MODEL_${r.status}`);const data=await r.json();const text=data?.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('')||'';if(!text)throw new Error('MODEL_EMPTY');return jsonFromModel(text)}
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'POST required'});
  try{
    const b=req.body||{};const opportunity=b.opportunity||{};const profile=b.profile||{};const duration=String(b.duration||'60 seconds');
    if(!opportunity.topic)return res.status(400).json({error:'A researched content opportunity is required.'});
    const sources=Array.isArray(opportunity.sources)?opportunity.sources:[];
    if(opportunity.classification!=='evergreen'&&!sources.length)return res.status(422).json({error:'Current topic has no verified source evidence.'});
    const evidence=sources.map((s,i)=>`SOURCE ${i+1}: ${s.publisher} | ${s.url} | retrieved ${s.retrieved_at}`).join('\n');
    const prompt=`Create a lender-safe short-form educational video package. Use only the supplied researched opportunity and evidence. Do not introduce any new current rate, program, eligibility, loan-limit, savings, approval, or market-statistic claim. Do not promise qualification or savings. Distinguish general education from borrower-specific advice. If a claim cannot be supported, omit it. Lender profile: ${JSON.stringify(profile)}. Target duration: ${duration}. Opportunity: ${JSON.stringify(opportunity)}. Evidence: ${evidence||'Evergreen topic; no current factual claim may be implied.'}. Return JSON only with: {"headline":"","hook":"","spoken_script":"","cta":"","lower_third":"","b_roll":[],"caption_plan":"","disclosures":[],"risk_flags":[],"current_claims":[{"claim":"","source_url":"","verified_at":""}],"approval_gate":{"required":true,"status":"pending_human_approval"}}. current_claims must contain every time-sensitive claim in the spoken script. If there are none, return an empty array.`;
    const result=await gemini(prompt);
    if(!result.spoken_script||!result.approval_gate?.required)throw new Error('MODEL_BAD_SHAPE');
    const allowed=new Map(sources.map(s=>[s.url,s]));
    const claims=Array.isArray(result.current_claims)?result.current_claims:[];
    for(const c of claims){const s=allowed.get(c.source_url);if(!s)throw new Error('SCRIPT_UNVERIFIED_CLAIM');c.verified_at=s.retrieved_at;}
    result.current_claims=claims;result.research_topic=opportunity.topic;result.generated_at=new Date().toISOString();
    return res.status(200).json(result);
  }catch(e){console.error('lender script error',e);return res.status(503).json({error:e.message==='MODEL_NOT_CONFIGURED'?'Production AI model is not configured.':`Script generation unavailable: ${e.message||'unknown error'}`});}
};
