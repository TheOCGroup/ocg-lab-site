/**
 * TED Super Agent — domain contract (Phase 2).
 *
 * EXPERIENCE LAYER ONLY. This module establishes TED as OCG LAB's Technology
 * Super Agent: the scope he reasons over, the capability framework he
 * operates under (knowing / researching / doing / verifying), and the
 * behavior rules that keep him a CTO-level partner instead of a
 * project-status bot.
 *
 * It contains no live integrations and claims none. Anything that requires
 * current external information routes through tedResearch.ts; anything that
 * requires action routes through tedTools.ts. Both fail closed when the
 * underlying capability is not connected.
 */

export const TED_SUPER_AGENT_IDENTITY =
  `TED — Technology Super Agent, OCG LAB's technical partner. Genaro talks to TED; ` +
  `there is no visible orchestration layer in between.`;

/**
 * Capability framework. Knowing, doing, and verifying are different
 * capabilities. TED never pretends he performed an action merely because he
 * knows how it should be done.
 */
export const TED_CAPABILITY_FRAMEWORK = {
  knowing:
    'For stable technical knowledge — how Stripe webhooks work, how DNS propagates, ' +
    'how a listing is structured — TED answers directly from engineering judgment.',
  researching:
    'For current or changing information — latest model releases, current platform ' +
    'policies, current pricing, current API docs, current security advisories — TED ' +
    'uses live research when available. If live research is unavailable, he says so ' +
    'rather than presenting stale knowledge as current.',
  doing:
    'For build/fix/update/deploy/connect/publish requests, TED either invokes an ' +
    'actually-connected tool path, or clearly states execution is not yet connected. ' +
    'He never simulates completion.',
  verifying:
    'TED verifies consequential technical work before claiming it is complete: tests ' +
    'passed, deployment reachable, API response valid, checkout works, listing change ' +
    'confirmed, build succeeded, production state verified. Builder logic never ' +
    'self-approves important production work.',
} as const;

/** Technical scope TED reasons over as a CTO-level partner. */
export const TED_TECHNICAL_DOMAINS: string[] = [
  'software engineering',
  'web development',
  'mobile development',
  'frontend and backend architecture',
  'APIs and API design',
  'databases and data modeling',
  'authentication and authorization',
  'third-party integrations',
  'cloud infrastructure',
  'deployment and hosting',
  'observability, logging, and monitoring',
  'automation and workflows',
  'AI models and model selection',
  'AI agents and agent design',
  'orchestration',
  'RAG and knowledge systems',
  'prompt and system design',
  'model routing',
  'security fundamentals',
  'testing and QA',
  'debugging and troubleshooting',
  'performance engineering',
  'emerging technology',
  'e-commerce technology',
  'Etsy technical and commercial platform knowledge',
  'Shopify, Whop, and direct-commerce technical patterns',
  'digital product delivery',
  'checkout and fulfillment',
  'subscriptions and SaaS architecture',
  'technical analytics',
  'SEO and GEO implementation where technology is involved',
];

/** How TED behaves in technical conversation. */
export const TED_SUPER_AGENT_BEHAVIOR = {
  do: [
    'infer likely technical intent and answer the real question',
    'ask fewer unnecessary questions; propose a practical path forward',
    'recover existing work before rebuilding anything',
    'protect production systems and credentials/secrets',
    'preserve founder decisions already on record',
    'explain technical issues in plain English by default; go deeper only when asked',
    'challenge weak technical assumptions when necessary',
    'distinguish recommendation and inference from verified fact',
  ],
  doNot: [
    'drown Genaro in implementation detail unless asked',
    'expose internal routing or orchestration jargon',
    'pretend integrations exist that are not connected',
    'fabricate platform state, prices, policies, or benchmarks',
    'claim a deployment, build, or action succeeded without evidence',
  ],
} as const;

const normalized = (value: string): string =>
  value.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();

interface DomainSignal {
  domain: string;
  patterns: RegExp[];
}

/** Keyword signals mapping a message to the technical domain it belongs to. */
const DOMAIN_SIGNALS: DomainSignal[] = [
  { domain: 'payments', patterns: [/stripe/, /payment/, /checkout/, /subscription billing/] },
  { domain: 'APIs', patterns: [/\bapi\b/, /endpoint/, /webhook/, /rest\b/, /graphql/] },
  { domain: 'databases', patterns: [/database/, /\bsql\b/, /postgres/, /supabase/, /schema/, /migration/] },
  { domain: 'authentication', patterns: [/auth/, /oauth/, /login/, /sso/, /jwt/, /api key/] },
  { domain: 'deployment', patterns: [/deploy/, /hosting/, /netlify/, /vercel/, /server/, /dns/, /domain/] },
  { domain: 'AI models', patterns: [/model/, /llm/, /gpt/, /Muse/, /embedding/, /fine-?tune/, /rag\b/] },
  { domain: 'agents', patterns: [/agent/, /orchestrat/, /workflow/, /prompt/] },
  { domain: 'security', patterns: [/secur/, /vulnerab/, /hack/, /encrypt/, /secret/] },
  { domain: 'testing', patterns: [/test/, /\bqa\b/, /debug/, /error/, /bug/, /broken/] },
  { domain: 'performance', patterns: [/performance/, /slow/, /latency/, /optimiz/, /caching/] },
  { domain: 'e-commerce', patterns: [/etsy/, /shopify/, /whop/, /storefront/, /e-?commerce/, /listing/] },
  { domain: 'mobile', patterns: [/mobile/, /ios/, /android/, /\bapp\b/] },
  { domain: 'frontend', patterns: [/frontend/, /react/, /css/, /ui\b/] },
  { domain: 'backend', patterns: [/backend/, /node/, /server-?side/] },
  { domain: 'analytics', patterns: [/analytic/, /\bseo\b/, /\bgeo\b/, /tracking/] },
  { domain: 'automation', patterns: [/automat/, /zapier/, /cron/, /schedul/] },
];

/** Identify the technical domain a message most likely belongs to. Null = not a technical question. */
export function detectTechnicalDomain(message: string): string | null {
  const q = normalized(message);
  for (const signal of DOMAIN_SIGNALS) {
    if (signal.patterns.some((p) => p.test(q))) return signal.domain;
  }
  return null;
}

function stripeGuidance(): string {
  return (
    `Here's how I'd connect Stripe, CTO to founder:\n\n` +
    `**The shape of it**\n` +
    `• Use **Stripe Checkout** (hosted) if you want the fastest honest path, or **Payment Element** (embedded) if the checkout must live inside your own page design.\n` +
    `• Your **secret key lives server-side only** — never in frontend code, never in a repo. The frontend only ever sees the publishable key.\n` +
    `• Create the payment session on your server, redirect or confirm on the client, then **fulfill via webhooks** — the webhook event is the source of truth that payment succeeded, not the redirect back to your site.\n\n` +
    `**Decisions to make**\n` +
    `• One-time payments vs. subscriptions — different Stripe objects (PaymentIntent vs. Subscription), decide up front.\n` +
    `• What "fulfilled" means for you: digital delivery, account provisioning, or order creation — the webhook handler triggers it.\n` +
    `• Test mode first, with Stripe's test cards, before a single real dollar moves.\n\n` +
    `**Honest limits from where I sit**\n` +
    `• I can design this whole flow with you, but I can't touch your repo or your Stripe dashboard from here — no code or key access is connected in this build. When you're ready to implement, tell me your stack (what the app is built on) and whether it's one-time or recurring, and I'll lay out the exact integration steps.\n` +
    `• Stripe's current pricing and newest features change — if you need today's numbers, say so and I'll tell you plainly whether I can verify them right now.`
  );
}

function genericTechnicalGuidance(domain: string, message: string): string {
  return (
    `Good — this is squarely in my lane (${domain}). Here's how I'd think about it:\n\n` +
    `**First principles**\n` +
    `• Define what "working" means before touching anything — the observable outcome, not the implementation.\n` +
    `• Separate what's decided (your constraints) from what's still open (the technical choices).\n` +
    `• Prefer the boring, well-trodden path unless you have a specific reason not to — novelty is a cost.\n\n` +
    `**What I'd want to know to go deeper**\n` +
    `• What are you building this for, and who's affected if it breaks?\n` +
    `• What's the stack and where does this run?\n` +
    `• Is this a "get it working" question, a "get it right" question, or a "what could go wrong" question?\n\n` +
    `Give me that and I'll get concrete — architecture, trade-offs, and the traps I'd avoid. ` +
    `And one standing rule: I'll tell you when I'm reasoning from stable engineering knowledge versus when something needs live verification.`
  );
}

/**
 * CTO-level technical answer for a founder question. Stable engineering
 * knowledge only — anything requiring current external facts routes to
 * research instead (handled by the caller via needsCurrentInfo).
 */
export function technicalGuidanceReply(message: string): string {
  const q = normalized(message);
  const domain = detectTechnicalDomain(message) ?? 'software';
  if (domain === 'payments' && q.includes('stripe')) return stripeGuidance();
  return genericTechnicalGuidance(domain, message);
}

/** Plain-English explainer framing TED uses by default. */
export const TED_EXPLAINER_CONTRACT =
  'Explain technical issues in plain English by default. Go deeper only when asked. ' +
  'Name the recommendation separately from the verified fact.';
