const GATEWAY_URL = 'https://ai-gateway.vercel.sh/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-5.6-luna';
const buckets = globalThis.__leadflowAiBuckets || (globalThis.__leadflowAiBuckets = new Map());

function reply(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}
function clean(value, max = 5000) { return typeof value === 'string' ? value.slice(0, max) : ''; }
function object(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
function rateAllowed(req) {
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  let bucket = buckets.get(ip);
  if (!bucket || now - bucket.start > 60 * 60 * 1000) bucket = { start: now, count: 0 };
  bucket.count += 1;
  buckets.set(ip, bucket);
  return bucket.count <= 40;
}
function leadContext(lead) {
  return {
    name: clean(lead.name, 120), need: clean(lead.need, 500), stage: clean(lead.stage, 80),
    priority: clean(lead.priority, 30), missing: Array.isArray(lead.missing) ? lead.missing.slice(0, 20).map(x => clean(x, 200)) : [],
    appointment: clean(lead.appointment, 300), followup: clean(lead.followup, 300), risk: clean(lead.risk, 500), next: clean(lead.next, 500),
    history: Array.isArray(lead.history) ? lead.history.slice(-20).map(h => ({ ts: clean(h?.ts, 80), channel: clean(h?.channel, 50), text: clean(h?.text, 600) })) : []
  };
}

export default async function handler(req, res) {
  const model = clean(process.env.LEADFLOW_AI_MODEL, 120).trim() || DEFAULT_MODEL;
  const configured = Boolean(process.env.AI_GATEWAY_API_KEY);
  if (req.method === 'GET') return reply(res, 200, { status: configured ? 'ready' : 'auth_required', provider: 'vercel-ai-gateway', model, configured });
  if (req.method !== 'POST') return reply(res, 405, { error: 'Method not allowed' });
  if (!configured) return reply(res, 503, { error: 'LeadFlow live AI is not configured. Deterministic LeadFlow remains available.', code: 'AI_AUTH_REQUIRED' });
  if (!rateAllowed(req)) return reply(res, 429, { error: 'LeadFlow AI rate limit reached. Try again later.' });

  const body = object(req.body);
  if (JSON.stringify(body).length > 80000) return reply(res, 413, { error: 'Request too large' });
  const message = clean(body.message, 4000).trim();
  if (!message) return reply(res, 400, { error: 'Message is required' });
  const mode = ['manage', 'practice', 'training'].includes(body.mode) ? body.mode : 'manage';
  const profile = object(body.profile), permissions = object(body.permissions), connections = object(body.connections), lead = object(body.lead);
  const rules = Array.isArray(body.rules) ? body.rules.slice(0, 60).map(r => clean(r?.text || r, 500)).filter(Boolean) : [];

  const system = `You are the customer's LeadFlow AI Lead Employee inside OCG LAB LeadFlow AI PRO.\n\nNON-NEGOTIABLE OPERATING RULES:\n- The supplied business profile, owner rules and lead record are the user-provided working context.\n- Never invent lead facts, contacts, messages, appointments, prices, policies, service areas, business rules, availability, completed actions or connector results.\n- If information is missing, say exactly what is missing.\n- Permission and connection fields are context only; they never prove an outside action occurred.\n- You have no authority to execute external actions from this endpoint. Draft or recommend actions unless a separate governed connector independently confirms success.\n- Newer owner corrections outrank older instructions when they conflict.\n- For lead-status questions summarize what the person wants, relevant history, completed work explicitly recorded in the supplied data, missing information, appointment status, follow-up status, risks and recommended next action.\n- In practice mode, coach and test. Never claim a real customer action occurred.\n- In training mode, turn owner instructions into precise operating rules and identify contradictions or missing boundaries.\n- Be concise, operational and natural.\n\nBUSINESS PROFILE:\n${JSON.stringify(profile)}\n\nOWNER RULES, NEWEST FIRST:\n${JSON.stringify(rules)}\n\nPERMISSIONS (CONTEXT ONLY):\n${JSON.stringify(permissions)}\n\nCONNECTION STATES (CONTEXT ONLY):\n${JSON.stringify(connections)}\n\nCURRENT LEAD:\n${JSON.stringify(leadContext(lead))}\n\nMODE: ${mode}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(GATEWAY_URL, {
      method: 'POST', signal: controller.signal,
      headers: { 'Authorization': `Bearer ${process.env.AI_GATEWAY_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, { role: 'user', content: message }], max_completion_tokens: 700 })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('leadflow-ai-gateway-error', response.status, data?.error?.code || 'gateway_error');
      return reply(res, 503, { error: 'LeadFlow live AI is temporarily unavailable. Deterministic LeadFlow operations remain available.' });
    }
    const text = typeof data?.choices?.[0]?.message?.content === 'string' ? data.choices[0].message.content.trim() : '';
    if (!text) return reply(res, 503, { error: 'LeadFlow live AI returned no usable response. Deterministic LeadFlow operations remain available.' });
    return reply(res, 200, { text, model });
  } catch (error) {
    console.error('leadflow-ai-error', error?.name || 'error');
    return reply(res, 503, { error: 'LeadFlow live AI is temporarily unavailable. Deterministic LeadFlow operations remain available.' });
  } finally { clearTimeout(timer); }
}
