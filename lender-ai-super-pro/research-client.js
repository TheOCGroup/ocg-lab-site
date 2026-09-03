/* Lender AI SUPER PRO — purchaser-owned AI credential client.
 * Pilot security rule: credential lives in sessionStorage only, is never persisted to localStorage,
 * never committed to source, and is cleared when the browser session ends.
 * Commercial release must replace this pilot transport with authenticated encrypted server-side vault storage.
 */
(()=>{
  const API_BASE='/api/lender-ai-super-pro';
  const KEY='ocg_lender_customer_gemini_session_v1';
  const credential={
    connected(){return Boolean(sessionStorage.getItem(KEY))},
    connect(value){const v=String(value||'').trim();if(!v)throw new Error('Enter your own Gemini API key.');sessionStorage.setItem(KEY,v);return true},
    disconnect(){sessionStorage.removeItem(KEY)},
    get(){return sessionStorage.getItem(KEY)||''}
  };
  async function request(path,payload){const key=credential.get();if(!key)throw new Error('Connect your own Gemini AI account first.');const response=await fetch(`${API_BASE}${path}`,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json','X-Customer-Gemini-Key':key},body:JSON.stringify(payload||{})});let data=null;try{data=await response.json()}catch{}if(!response.ok){const error=new Error(data?.error||data?.message||`Service unavailable (${response.status})`);error.status=response.status;throw error}return data}
  function validateEvidence(item){if(item?.classification==='evergreen')return true;const sources=Array.isArray(item?.sources)?item.sources:[];return sources.length>0&&sources.every(s=>s?.url&&s?.publisher&&s?.retrieved_at)}
  function validateScout(data){if(!data||data.credential_owner!=='customer'||!Array.isArray(data.opportunities)||data.opportunities.length<3)throw new Error('Research returned an invalid customer-isolated result.');if(data.opportunities.some(x=>!validateEvidence(x)))throw new Error('Research evidence is incomplete. Current recommendations are blocked.');return data}
  function validateScript(data){if(!data?.spoken_script||data.credential_owner!=='customer'||!data?.approval_gate)throw new Error('Script service returned an invalid customer-isolated package.');const claims=Array.isArray(data.current_claims)?data.current_claims:[];if(claims.some(c=>!c?.source_url||!c?.verified_at))throw new Error('A time-sensitive script claim is missing verification evidence.');return data}
  window.LenderAICredential=credential;
  window.LenderAIProduction={async research(input){return validateScout(await request('/research',input))},async script(input){return validateScript(await request('/script',input))},unavailableMessage(error){return `LIVE RESEARCH UNAVAILABLE\n\n${error?.message||'The production research service could not be reached.'}\n\nNo current mortgage recommendation has been generated.`}};
})();
