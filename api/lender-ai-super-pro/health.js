export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET') return res.status(405).json({error:'GET required'});
  const secureCredentialStore=Boolean(String(process.env.CREDENTIAL_ENCRYPTION_KEY||'').trim());
  return res.status(secureCredentialStore?200:503).json({
    service:'lender-ai-super-pro',
    research_endpoint:'/api/lender-ai-super-pro/research',
    script_endpoint:'/api/lender-ai-super-pro/script',
    credential_endpoint:'/api/lender-ai-super-pro/credential',
    customer_owned_ai:true,
    ocg_runtime_ai_key_used:false,
    credential_transport:'encrypted_http_only_cookie',
    secure_credential_store_configured:secureCredentialStore,
    configured:secureCredentialStore,
    secrets_exposed:false,
    checked_at:new Date().toISOString()
  });
}
