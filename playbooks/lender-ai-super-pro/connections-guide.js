(()=>{
  if(document.getElementById('connectionsGuide'))return;
  const styles=document.createElement('style');
  styles.textContent=`
  .setup-guide{position:fixed;inset:0;z-index:160;background:rgba(7,17,31,.96);display:none;overflow:auto;padding:84px 28px 28px}.setup-guide.open{display:block}.setup-guide-shell{max-width:1180px;margin:0 auto;background:#fff;color:#0f172a;border-radius:24px;box-shadow:0 30px 90px rgba(0,0,0,.42);overflow:hidden}.setup-guide-head{background:radial-gradient(circle at 80% 20%,rgba(34,197,94,.22),transparent 28%),linear-gradient(145deg,#07111f,#0b1f35 58%,#07111f);color:#fff;padding:34px 40px 30px;display:flex;justify-content:space-between;gap:24px;align-items:flex-start}.setup-guide-brand{font-weight:900;letter-spacing:.16em;font-size:13px}.setup-guide-brand span{color:#4ade80}.setup-guide-head h2{font-size:42px;line-height:1;margin:12px 0 8px;letter-spacing:-.04em}.setup-guide-head p{margin:0;color:#cbd5e1;max-width:680px;font-size:16px;line-height:1.55}.setup-close{border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;border-radius:999px;width:42px;height:42px;font-size:24px;cursor:pointer}.setup-guide-body{padding:34px 40px 40px}.setup-intro{display:grid;grid-template-columns:1.2fr .8fr;gap:18px;margin-bottom:24px}.setup-intro .card,.setup-step{border:1px solid #e2e8f0;border-radius:18px;background:#fff;box-shadow:0 10px 26px rgba(15,23,42,.06)}.setup-intro .card{padding:20px}.setup-intro .card h3{font-size:21px;margin:6px 0 8px}.setup-intro .card p{margin:0;line-height:1.55;color:#475569}.setup-kicker{font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#0ea5e9}.setup-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.setup-step{padding:20px}.setup-step h3{font-size:20px;margin:6px 0 10px;letter-spacing:-.02em}.setup-step p,.setup-step li{line-height:1.55;color:#334155}.setup-step ol{margin:10px 0 0;padding-left:20px}.setup-step li{margin:7px 0}.setup-num{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:999px;background:linear-gradient(135deg,#22c55e,#0ea5e9);color:#fff;font-weight:900;font-size:12px;margin-bottom:6px}.setup-note{background:linear-gradient(135deg,rgba(34,197,94,.08),rgba(14,165,233,.08));border:1px solid rgba(14,165,233,.18);padding:14px 16px;border-radius:14px;margin-top:14px}.setup-note b{display:block;margin-bottom:4px}.setup-link{display:inline-flex;margin-top:14px;text-decoration:none}.setup-finish{margin-top:20px;padding:24px;border-radius:20px;background:#07111f;color:#fff}.setup-finish h3{font-size:25px;margin:6px 0 12px}.setup-finish ol{columns:2;column-gap:36px;padding-left:20px}.setup-finish li{margin:8px 0;color:#e2e8f0;break-inside:avoid}.setup-footer-note{margin-top:18px;font-size:13px;color:#64748b;line-height:1.55}.dark .setup-guide-shell{background:#0f172a;color:#e2e8f0}.dark .setup-guide-body{background:#0f172a}.dark .setup-intro .card,.dark .setup-step{background:#111827;border-color:#334155}.dark .setup-intro .card p,.dark .setup-step p,.dark .setup-step li{color:#cbd5e1}.dark .setup-footer-note{color:#94a3b8}@media(max-width:860px){.setup-guide{padding:70px 10px 10px}.setup-guide-head{padding:26px 22px}.setup-guide-head h2{font-size:34px}.setup-guide-body{padding:22px}.setup-intro,.setup-grid{grid-template-columns:1fr}.setup-finish ol{columns:1}}`;
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
    <div class="setup-guide-shell">
      <div class="setup-guide-head">
        <div><div class="setup-guide-brand">OCG <span>LAB</span> · LENDER AI SUPER PRO</div><div class="setup-kicker" style="color:#7dd3fc;margin-top:14px">Getting Started</div><h2>Setup & Connections</h2><p>A guided, plain-English setup path for your AI, lender profile, email, calendar, CRM, social accounts and video tools. You stay in control of every account and permission.</p></div>
        <button class="setup-close" aria-label="Close setup guide">×</button>
      </div>
      <div class="setup-guide-body">
        <div class="setup-intro">
          <div class="card"><div class="setup-kicker">Start here</div><h3>You do not need to be technical.</h3><p>Follow the steps in order. If a connection is available, use that provider's own secure sign-in screen. If it is not available yet, the playbook will say so instead of pretending it is connected.</p></div>
          <div class="card"><div class="setup-kicker">Harper can help</div><h3>Ask while you set up.</h3><p>If a term or step is confusing, close this guide, tap <b>Talk to Harper</b>, and ask what it means in plain English.</p></div>
        </div>

        <div class="setup-grid">
          <div class="setup-step"><div class="setup-num">1</div><div class="setup-kicker">Your profile</div><h3>Tell the system who you are</h3><ol><li>Open <b>My Lender Workbook</b>.</li><li>Add your name, company, market, NMLS/disclosure text, preferred audience, natural voice, and CTA.</li><li>Your answers save on this device.</li></ol></div>

          <div class="setup-step"><div class="setup-num">2</div><div class="setup-kicker">Your AI</div><h3>Connect the AI provider you prefer</h3><p>Use OpenAI, Anthropic/Claude, Google Gemini, xAI, Groq, DeepSeek, Mistral, or another supported compatible provider.</p><ol><li>Open your chosen provider's developer/API account.</li><li>Create an <b>API key</b>. This is not your normal password.</li><li>Open Lender AI SUPER PRO.</li><li>Choose your provider and paste the key into <b>API credential</b>.</li><li>Leave Model and Base URL blank unless your provider specifically tells you otherwise.</li><li>Tap <b>Connect My AI</b>.</li></ol><div class="setup-note"><b>Protect your key.</b> Never send it to OCG LAB support or paste it into a chat. Enter it only inside your product connection screen.</div><a class="pill-btn primary setup-link" href="../../lender-ai-super-pro/">Open Lender AI SUPER PRO →</a></div>

          <div class="setup-step"><div class="setup-num">3</div><div class="setup-kicker">Email</div><h3>Connect email when you want inbox assistance</h3><p>When a supported email connector is available, choose your provider, sign in on the provider's own secure authorization page, review the requested permissions, and approve only the access you want. Never enter your email password directly into the playbook.</p></div>

          <div class="setup-step"><div class="setup-num">4</div><div class="setup-kicker">Calendar</div><h3>Connect appointments and reminders</h3><p>Choose the supported calendar connection, sign in with your calendar provider, review the permissions, and approve. The purpose is preparation and follow-up—not uncontrolled calendar changes.</p></div>

          <div class="setup-step"><div class="setup-num">5</div><div class="setup-kicker">CRM</div><h3>Connect the CRM you actually use</h3><p>When your CRM is supported, choose it from Connections and follow its secure sign-in flow. Approve only the access needed for lead context, follow-up and workflow preparation. If your CRM is not listed, keep using the playbook manually until that connector is available.</p></div>

          <div class="setup-step"><div class="setup-num">6</div><div class="setup-kicker">Social & publishing</div><h3>Connect social accounts only when you want publishing help</h3><p>Use the social platform's own authorization screen, select the correct account or page, and review publishing permissions. Drafting and human approval should happen before publishing.</p></div>

          <div class="setup-step"><div class="setup-num">7</div><div class="setup-kicker">Video</div><h3>Camera, microphone and optional avatar</h3><p>For self-recording, approve camera and microphone access when your browser asks. For a private avatar, use your own supported avatar-provider account and complete that provider's identity and consent requirements.</p></div>

          <div class="setup-step"><div class="setup-num">8</div><div class="setup-kicker">Permissions</div><h3>Only connect what you want to use</h3><p>You do not need every connection on day one. Start with your AI and self-record workflow. Add email, calendar, CRM, social or avatar tools only when they are useful to you.</p></div>
        </div>

        <div class="setup-finish"><div class="setup-kicker" style="color:#7dd3fc">Your first successful workflow</div><h3>Do this once from start to finish.</h3><ol><li>Save your lender profile.</li><li>Connect your AI.</li><li>Run Content Scout.</li><li>Choose a useful topic.</li><li>Generate the script.</li><li>Review and approve it.</li><li>Choose Record Myself.</li><li>Allow camera + microphone.</li><li>Record, review, and download your video.</li></ol></div>

        <div class="setup-footer-note"><b>Connection truth rule:</b> this guide explains how supported connections work. A connection is only presented as available when the actual connector exists in the product.</div>
      </div>
    </div>`;
  document.body.appendChild(panel);
  panel.querySelector('.setup-close').onclick=()=>panel.classList.remove('open');
})();
