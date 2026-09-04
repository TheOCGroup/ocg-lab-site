(()=>{
  const providerHelp={
    openai:'Open your OpenAI developer account, go to API keys, create a new secret key, copy it once, then return here and paste it into API credential.',
    anthropic:'Open the Anthropic Console, go to API Keys, create a key, copy it, then return here and paste it into API credential.',
    gemini:'Open Google AI Studio, create or select a project, choose Get API key, create a key, then return here and paste it into API credential.',
    xai:'Open the xAI Console, create an API key for your account, copy it, then return here and paste it into API credential.',
    groq:'Open the Groq Console, go to API Keys, create a key, copy it, then return here and paste it into API credential.',
    deepseek:'Open the DeepSeek API platform, go to API keys, create a key, copy it, then return here and paste it into API credential.',
    mistral:'Open the Mistral AI platform, go to API Keys, create a key, copy it, then return here and paste it into API credential.',
    'openai-compatible':'Use the API credential and HTTPS base URL supplied by your chosen OpenAI-compatible provider. Do not paste account passwords or credentials embedded in a URL.'
  };
  function inject(){
    const provider=document.getElementById('customerAiProvider');
    const key=document.getElementById('customerAiKey');
    const connect=document.getElementById('connectAiBtn');
    if(!provider||!key||!connect||document.getElementById('aiSetupGuide'))return;
    const guide=document.createElement('div');
    guide.id='aiSetupGuide';
    guide.className='minioutput';
    guide.style.margin='12px 0';
    guide.innerHTML='<strong>First-time setup</strong><ol style="margin:8px 0 0;padding-left:20px"><li>Choose the AI provider you already use or want to use.</li><li id="providerKeyHelp"></li><li>Paste the new API key into <b>API credential</b>. The model field can stay blank unless you want a specific model.</li><li>Leave API base URL blank unless your provider specifically requires one.</li><li>Tap <b>Connect My AI</b>. After connection, the key field is cleared and product JavaScript cannot read the stored credential.</li></ol><p style="margin:8px 0 0"><b>Important:</b> An API key is different from your normal account password. Never enter your provider password here, and never send your API key to OCG LAB support or in chat.</p>';
    connect.parentNode.insertBefore(guide,key);
    const help=()=>{const el=document.getElementById('providerKeyHelp');if(el)el.textContent=providerHelp[provider.value]||'Create an API key in your provider’s developer/API settings, then return here.'};
    provider.addEventListener('change',help);help();
    const after=document.createElement('div');
    after.id='firstWorkflowGuide';after.className='minioutput';after.style.marginTop='12px';
    after.innerHTML='<strong>After you connect</strong><br>1. Fill out and save your Lender Profile. 2. Run AI Content Scout. 3. Pick a recommended topic. 4. Build the script. 5. Review and approve it. 6. Choose Record Myself. 7. Allow camera + microphone when your browser asks. 8. Record, review, and download your video.<br><br>If a step is locked, complete the step immediately above it first.';
    document.getElementById('aiConnectionStatus')?.after(after);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(inject,0),{once:true});else setTimeout(inject,0);
})();
