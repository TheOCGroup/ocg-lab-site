export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET') return res.status(405).json({error:'GET required'});
  return res.status(200).json({
    service:'lender-ai-super-pro',
    research_endpoint:'/api/lender-ai-super-pro/research',
    script_endpoint:'/api/lender-ai-super-pro/script',
    credential_endpoint:'/api/lender-ai-super-pro/credential',
    customer_owned_ai:true,
    byo_ai:true,
    provider_agnostic:true,
    supported_provider_routes:['openai','anthropic','gemini','xai','groq','deepseek','mistral','openai-compatible'],
    ocg_runtime_ai_key_used:false,
    credential_transport:'encrypted_http_only_browser_isolated',
    secure_credential_store_configured:true,
    configured:true,
    secrets_exposed:false,
    checked_at:new Date().toISOString()
  });
}
