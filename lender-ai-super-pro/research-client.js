(()=>{
  const API_BASE='/api/lender-ai-super-pro';
  async function jsonRequest(path,options={}){const response=await fetch(`${API_BASE}${path}`,{credentials:'same-origin',headers:{'Content-Type':'application/json','Accept':'application/json',...(options.headers||{})},...options});let data=null;try{data=await response.json()}catch{}if(!response.ok){const error=new Error(data?.error||data?.message||`Service unavailable (${response.status})`);error.status=response.status;throw error}return data}
  const credential={
    async status(){return jsonRequest('/credential',{method:'GET'})},
    async connect(value){const v=String(value||'').trim();if(!v)throw new Error('Enter your own Gemini API key.');return jsonRequest('/credential',{method:'POST',body:JSON.stringify({api_key:v})})},
    async disconnect(){return jsonRequest('/credential',{method:'DELETE'})}
  };
  async function request(path,payload){return jsonRequest(path,{method:'POST',body:JSON.stringify(payload||{})})}
  function validateEvidence(item){if(item?.classification==='evergreen')return true;const sources=Array.isArray(item?.sources)?item.sources:[];return sources.length>0&&sources.every(s=>s?.url&&s?.publisher&&s?.retrieved_at)}
  function validateScout(data){if(!data||data.credential_owner!=='customer'||data.credential_transport!=='encrypted_http_only_cookie'||!Array.isArray(data.opportunities)||data.opportunities.length<3)throw new Error('Research returned an invalid customer-isolated result.');if(data.opportunities.some(x=>!validateEvidence(x)))throw new Error('Research evidence is incomplete. Current recommendations are blocked.');return data}
  function validateScript(data){if(!data?.spoken_script||data.credential_owner!=='customer'||data.credential_transport!=='encrypted_http_only_cookie'||!data?.approval_gate)throw new Error('Script service returned an invalid customer-isolated package.');const claims=Array.isArray(data.current_claims)?data.current_claims:[];if(claims.some(c=>!c?.source_url||!c?.verified_at))throw new Error('A time-sensitive script claim is missing verification evidence.');return data}
  window.LenderAICredential=credential;
  window.LenderAIProduction={async research(input){return validateScout(await request('/research',input))},async script(input){return validateScript(await request('/script',input))},unavailableMessage(error){return `LIVE RESEARCH UNAVAILABLE\n\n${error?.message||'The production research service could not be reached.'}\n\nNo current mortgage recommendation has been generated.`}};
})();
