(()=>{
  const PROFILE_KEY='ocg_lender_super_pro_profile_v1';
  const sanitizeText=value=>String(value??'')
    .replace(/Brandy’s/g,"the purchaser’s")
    .replace(/Brandy's/g,"the purchaser's")
    .replace(/BRANDY/g,'LENDER')
    .replace(/Brandy/g,'the lender')
    .replace(/Wichita, Kansas/g,'your market');

  function cleanFirstRun(){
    const hasProfile=Boolean(localStorage.getItem(PROFILE_KEY));
    if(!hasProfile){
      const name=document.getElementById('lenderName');
      const market=document.getElementById('market');
      const company=document.getElementById('company');
      const nmls=document.getElementById('nmls');
      const cta=document.getElementById('preferredCta');
      if(name)name.value='';
      if(market)market.value='';
      if(company)company.value='';
      if(nmls)nmls.value='';
      if(cta)cta.value='';
    }
    const status=document.getElementById('profileStatus');
    if(status&&!hasProfile)status.textContent='Create your lender profile. Your settings stay on this device.';
  }

  function sanitizeNode(root){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      const next=sanitizeText(node.nodeValue);
      if(next!==node.nodeValue)node.nodeValue=next;
    }
  }

  function start(){
    cleanFirstRun();
    sanitizeNode(document.body);
    const observer=new MutationObserver(records=>{
      for(const record of records){
        record.addedNodes.forEach(node=>{
          if(node.nodeType===Node.TEXT_NODE){
            const next=sanitizeText(node.nodeValue);
            if(next!==node.nodeValue)node.nodeValue=next;
          }else if(node.nodeType===Node.ELEMENT_NODE){
            sanitizeNode(node);
          }
        });
        if(record.type==='characterData'){
          const next=sanitizeText(record.target.nodeValue);
          if(next!==record.target.nodeValue)record.target.nodeValue=next;
        }
      }
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
