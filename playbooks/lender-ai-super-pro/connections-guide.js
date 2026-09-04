(()=>{
  if(document.getElementById('connectionsGuide'))return;
  const styles=document.createElement('style');
  styles.textContent=`
  .setup-guide{position:fixed;inset:72px 24px 24px auto;width:min(520px,calc(100vw - 32px));z-index:140;background:#fff;color:#0f172a;border:1px solid rgba(15,23,42,.14);box-shadow:0 24px 70px rgba(15,23,42,.28);border-radius:18px;display:none;overflow:auto}.setup-guide.open{display:block}.setup-guide-head{position:sticky;top:0;background:#07111f;color:#fff;padding:18px 20px;display:flex;justify-content:space-between;align-items:center;z-index:2}.setup-guide-body{padding:20px}.setup-step{border:1px solid #e2e8f0;border-radius:14px;padding:14px 16px;margin:12px 0}.setup-step h3{margin:0 0 7px;font-size:16px}.setup-step p{margin:6px 0;line-height:1.5}.setup-step ol{margin:8px 0;padding-left:20px}.setup-step li{margin:6px 0;line-height:1.45}.setup-note{background:#f8fafc;border-left:3px solid #22c55e;padding:12px;border-radius:10px;margin:12px 0}.setup-status{font-weight:800;font-size:12px;letter-spacing:.04em;text-transform:uppercase}.setup-close{border:0;background:transparent;color:#fff;font-size:24px;cursor:pointer}.setup-link{display:inline-flex;margin-top:8px;text-decoration:none}.dark .setup-guide{background:#0f172a;color:#e2e8f0}.dark .setup-step{border-color:#334155}.dark .setup-note{background:#111827}@media(max-width:760px){.setup-guide{inset:62px 8px 8px;width:auto}}`;
  document.head.appendChild(styles);

  const button=document.createElement('button');
  button.className='pill-btn';
  button.textContent='Setup & Connections';
  button.onclick=()=>document.getElementById('connectionsGuide')?.classList.add('open');
  const actions=document.querySelector('.top-actions');
  if(actions)actions.insertBefore(button,actions.firstChild);

  const panel=document.createElement('aside');
  panel.id='connectionsGuide';
  panel.className='setup-guide';
  panel.innerHTML=`
    <div class="setup-guide-head"><div><b>Setup & Connections</b><div style="font-size:11px;opacity:.75">Plain-English setup guide</div></div><button class="setup-close" aria-label="Close setup guide">×</button></div>
    <div class="setup-guide-body">
      <div class="setup-note"><b>Start here.</b><p>You do not need to be technical. This guide tells you what to connect, where to get it, and what happens next. You stay in control of every account and permission.</p></div>

      <div class="setup-step"><div class="setup-status">1 · Your profile</div><h3>Tell the system who you are</h3><ol><li>Open <b>My Lender Workbook</b>.</li><li>Add your name, company, market, NMLS/disclosure text, preferred audience, voice, and CTA.</li><li>Your answers save on this device.</li></ol></div>

      <div class="setup-step"><div class="setup-status">2 · Your AI</div><h3>Connect the AI provider you prefer</h3><p>You can use OpenAI, Anthropic/Claude, Google Gemini, xAI, Groq, DeepSeek, Mistral, or another compatible provider supported by Lender AI SUPER PRO.</p><ol><li>Open your chosen provider's developer/API account.</li><li>Create an <b>API key</b>. This is not your normal account password.</li><li>Open <b>Lender AI SUPER PRO</b> using the button below.</li><li>Choose your provider and paste the API key into <b>API credential</b>.</li><li>Leave Model blank unless you specifically want one. Leave Base URL blank unless your provider tells you to use one.</li><li>Tap <b>Connect My AI</b>.</li></ol><div class="setup-note"><b>Security:</b> Never send your API key to OCG LAB support or paste it into a chat. Enter it only inside your own product connection screen.</div><a class="pill-btn primary setup-link" href="../../lender-ai-super-pro/">Open Lender AI SUPER PRO →</a></div>

      <div class="setup-step"><div class="setup-status">3 · Email</div><h3>Connect email when you want inbox assistance</h3><p>Email connection is optional. When the product offers a supported email connection, choose your email provider, sign in on the provider's own secure authorization screen, review the requested permissions, and approve only the access you want. Do not paste your email password into the playbook.</p></div>

      <div class="setup-step"><div class="setup-status">4 · Calendar</div><h3>Connect your calendar for appointments and reminders</h3><p>Choose the supported calendar connection, sign in with your calendar provider, review the permissions, and approve. The goal is to let the system help prepare for appointments and surface follow-ups—not to take control of your calendar without permission.</p></div>

      <div class="setup-step"><div class="setup-status">5 · CRM</div><h3>Connect the CRM you actually use</h3><p>When your CRM is supported, choose it from Connections and follow its secure sign-in/authorization flow. Approve only the data access needed for follow-up, lead context, and workflow preparation. If your CRM is not listed, keep using the playbook manually until that connector is available.</p></div>

      <div class="setup-step"><div class="setup-status">6 · Social / publishing</div><h3>Connect social accounts only when you want publishing help</h3><p>Use the platform's own authorization screen, choose the account/page, and approve the requested publishing permissions. Drafting and approval should come before publishing.</p></div>

      <div class="setup-step"><div class="setup-status">7 · Camera, microphone & avatar</div><h3>Video setup is straightforward</h3><p>For self-recording, approve camera and microphone permission when your browser asks. For a private avatar, use your own supported avatar-provider account and complete any identity/consent requirements requested by that provider.</p></div>

      <div class="setup-step"><div class="setup-status">Your first successful workflow</div><h3>Do this once from start to finish</h3><ol><li>Save your lender profile.</li><li>Connect your AI.</li><li>Run Content Scout.</li><li>Choose a useful topic.</li><li>Generate the script.</li><li>Review and approve it.</li><li>Choose <b>Record Myself</b>.</li><li>Allow camera + microphone.</li><li>Record, review, and download your video.</li></ol><p>If a button is locked, finish the step directly above it first.</p></div>

      <div class="setup-note"><b>Important distinction:</b><p>This guide explains how connections work. A connection should only be described as available when the actual provider connector is present in your product. If a connector is not yet available, the product should say so instead of pretending it is connected.</p></div>
    </div>`;
  document.body.appendChild(panel);
  panel.querySelector('.setup-close').onclick=()=>panel.classList.remove('open');
})();
