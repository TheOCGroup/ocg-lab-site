/* Lender AI SUPER PRO — production research/script client
 * Fail-closed: never presents local/demo content as current research.
 */
(()=>{
  const API_BASE='/api/lender-ai-super-pro';

  async function request(path,payload){
    const response=await fetch(`${API_BASE}${path}`,{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify(payload||{})
    });
    let data=null;
    try{data=await response.json()}catch{}
    if(!response.ok){
      const message=data?.error||data?.message||`Service unavailable (${response.status})`;
      const error=new Error(message);
      error.status=response.status;
      throw error;
    }
    return data;
  }

  function validateEvidence(item){
    if(item?.classification==='evergreen') return true;
    const sources=Array.isArray(item?.sources)?item.sources:[];
    return sources.length>0&&sources.every(s=>s?.url&&s?.publisher&&s?.retrieved_at);
  }

  function validateScout(data){
    if(!data||!Array.isArray(data.opportunities)||data.opportunities.length<3){
      throw new Error('Research returned insufficient evidence-backed opportunities.');
    }
    if(data.opportunities.some(x=>!validateEvidence(x))){
      throw new Error('Research evidence is incomplete. Current recommendations are blocked.');
    }
    return data;
  }

  function validateScript(data){
    if(!data?.spoken_script||!data?.approval_gate){
      throw new Error('Script service returned an incomplete production package.');
    }
    const currentClaims=Array.isArray(data.current_claims)?data.current_claims:[];
    if(currentClaims.some(c=>!c?.source_url||!c?.verified_at)){
      throw new Error('A time-sensitive script claim is missing verification evidence.');
    }
    return data;
  }

  window.LenderAIProduction={
    async research(input){return validateScout(await request('/research',input));},
    async script(input){return validateScript(await request('/script',input));},
    unavailableMessage(error){
      return `LIVE RESEARCH UNAVAILABLE\n\n${error?.message||'The production research service could not be reached.'}\n\nNo current mortgage recommendation has been generated. Try again when the authoritative research service is available. Evergreen education may only be used when it is explicitly labeled evergreen.`;
    }
  };
})();
