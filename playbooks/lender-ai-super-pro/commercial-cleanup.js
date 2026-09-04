(()=>{
  const PREFIX='ocg-lender-book-';
  const sanitize=value=>String(value??'')
    .replace(/Brandy’s/g,"the purchaser’s")
    .replace(/Brandy's/g,"the purchaser's")
    .replace(/BRANDY/g,'LENDER')
    .replace(/Brandy/g,'the lender')
    .replace(/Wichita, Kansas/g,'your market');

  function blankFirstRun(){
    document.querySelectorAll('[data-work]').forEach(el=>{
      const key=PREFIX+'work-'+el.dataset.work;
      if(localStorage.getItem(key)===null&&(el.dataset.work==='name'||el.dataset.work==='market'))el.value='';
    });
  }

  function sanitizeNode(root){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      const next=sanitize(node.nodeValue);
      if(next!==node.nodeValue)node.nodeValue=next;
    }
  }

  window.resetWorkbook=function(){
    if(!confirm('Reset all lender workbook answers and checklists on this device?'))return;
    Object.keys(localStorage).filter(k=>k.startsWith(PREFIX+'work-')||k.startsWith(PREFIX+'check-')).forEach(k=>localStorage.removeItem(k));
    document.querySelectorAll('[data-work]').forEach(el=>el.value='');
    document.querySelectorAll('[data-task],[data-plan]').forEach(el=>el.checked=false);
    if(typeof updateProgress==='function')updateProgress();
    if(typeof flashSaved==='function')flashSaved();
  };

  blankFirstRun();
  sanitizeNode(document.body);
  const observer=new MutationObserver(records=>{
    records.forEach(record=>{
      record.addedNodes.forEach(node=>{
        if(node.nodeType===Node.TEXT_NODE){
          const next=sanitize(node.nodeValue);
          if(next!==node.nodeValue)node.nodeValue=next;
        }else if(node.nodeType===Node.ELEMENT_NODE){
          sanitizeNode(node);
        }
      });
      if(record.type==='characterData'){
        const next=sanitize(record.target.nodeValue);
        if(next!==record.target.nodeValue)record.target.nodeValue=next;
      }
    });
  });
  observer.observe(document.body,{subtree:true,childList:true,characterData:true});
})();
