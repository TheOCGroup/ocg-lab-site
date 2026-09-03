// Lender AI SUPER PRO production health check. Touch 2026-09-02 to refresh deployment environment.
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET') return res.status(405).json({error:'GET required'});
  const hasGemini=Boolean((process.env.GEMINI_API_KEY||process.env.GOOGLE_API_KEY||'').trim());
  const model=(process.env.GEMINI_MODEL||'gemini-2.5-flash').trim();
  return res.status(hasGemini?200:503).json({
    service:'lender-ai-super-pro',
    research_endpoint:'/api/lender-ai-super-pro/research',
    script_endpoint:'/api/lender-ai-super-pro/script',
    model_provider:hasGemini?'gemini':'unconfigured',
    model,
    configured:hasGemini,
    secrets_exposed:false,
    checked_at:new Date().toISOString()
  });
}
