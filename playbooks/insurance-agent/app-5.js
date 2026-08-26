async function ocgCopyExactText(text,btn){
  const value=String(text??'').trim();
  if(!value){if(btn)btn.textContent='Nothing to Copy';return false}
  const original=btn?.textContent||'Copy Prompt';
  let copied=false;
  try{
    if(navigator.clipboard&&window.isSecureContext){
      await navigator.clipboard.writeText(value);
      copied=true;
    }
  }catch(e){}
  if(!copied){
    const ta=document.createElement('textarea');
    ta.value=value;
    ta.setAttribute('readonly','');
    ta.style.position='fixed';
    ta.style.opacity='0';
    ta.style.pointerEvents='none';
    ta.style.left='-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0,ta.value.length);
    try{copied=document.execCommand('copy')}catch(e){copied=false}
    document.body.removeChild(ta);
  }
  if(btn){
    btn.textContent=copied?'Prompt Copied ✓':'Copy Failed — Select Prompt';
    setTimeout(()=>btn.textContent=original,1400);
  }
  return copied;
}

copyText=function(id,btn){
  const el=document.getElementById(id);
  const exact=el?(el.textContent||el.innerText||''):'';
  return ocgCopyExactText(exact,btn);
};

copyPromptText=function(text,btn){
  return ocgCopyExactText(text,btn);
};
