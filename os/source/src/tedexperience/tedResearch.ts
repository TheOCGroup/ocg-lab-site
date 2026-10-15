/**
 * TED Super Agent — governed live research (Phase 2).
 *
 * EXPERIENCE LAYER ONLY. TED must be able to decide:
 *   - stored knowledge is enough,
 *   - OCG LAB internal knowledge is needed,
 *   - live external research is required.
 *
 * Research results must identify sources, separate current web evidence from
 * internal OCG LAB records, avoid unsupported claims, avoid inventing current
 * platform status, and preserve source dates where relevant.
 *
 * Current-information questions FAIL CLOSED when research is unavailable:
 * TED says so rather than presenting stale knowledge as current.
 */

export interface ResearchSource {
  title: string;
  url: string;
  /** ISO date the source was published/updated, when known. */
  publishedAt?: string;
}

export interface ResearchResult {
  query: string;
  providerId: string;
  summary: string;
  sources: ResearchSource[];
  /** ISO date the research was performed. */
  evidenceDate: string;
}

export interface ResearchProvider {
  id: string;
  name: string;
  isAvailable(): boolean;
  research(query: string): Promise<ResearchResult>;
}

/**
 * Provider registry. This static build ships with NO live research provider
 * connected — there is no backend and no search API key, and a browser-only
 * app cannot reliably reach search APIs (CORS, auth). The interface is real
 * and a provider can be registered later; until then every current-info
 * question fails closed honestly.
 */
const PROVIDERS: ResearchProvider[] = [];

export function listResearchProviders(): ResearchProvider[] {
  return [...PROVIDERS];
}

/** Test/embedding hook: register a provider (e.g. a mock in tests). */
export function registerResearchProvider(provider: ResearchProvider): void {
  const i = PROVIDERS.findIndex((p) => p.id === provider.id);
  if (i >= 0) PROVIDERS[i] = provider;
  else PROVIDERS.push(provider);
}

export function unregisterResearchProvider(id: string): void {
  const i = PROVIDERS.findIndex((p) => p.id === id);
  if (i >= 0) PROVIDERS.splice(i, 1);
}

export function getAvailableResearchProvider(): ResearchProvider | null {
  return PROVIDERS.find((p) => {
    try {
      return p.isAvailable();
    } catch {
      return false;
    }
  }) ?? null;
}

const normalized = (value: string): string =>
  value.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();

const RECENCY_PATTERNS: RegExp[] = [
  /what'?s new/,
  /\blatest\b/,
  /\bcurrent\b/,
  /right now/,
  /\b202[56]\b/,
  /this (week|month|year)/,
  /recently/,
  /just (released|announced|changed|launched)/,
  /new (policy|policies|feature|features|pricing|release)/,
  /still (available|supported|true)/,
  /did .* change/,
  /has .* changed/,
];

const CURRENT_INFO_TOPICS: RegExp[] = [
  /etsy.*(policy|policies|fee|fees|feature|change)/,
  /(policy|policies).*(etsy|shopify|whop)/,
  /(price|pricing).*(stripe|openai|anthropic|vercel|netlify|supabase|shopify)/,
  /api (doc|documentation|change)/,
  /security advisor/,
  /model.*(release|released|benchmark)/,
  /(release|released).*(model|gpt|Muse|gemini|llama)/,
];

/**
 * True when a question requires current/changing external information that
 * stored knowledge cannot honestly answer.
 */
export function needsCurrentInfo(message: string): boolean {
  const q = normalized(message);
  if (CURRENT_INFO_TOPICS.some((p) => p.test(q))) return true;
  if (RECENCY_PATTERNS.some((p) => p.test(q))) {
    // Recency language about our own recorded work is internal, not web research.
    if (/our|we('| a)re|ocg lab|my (project|product|listing|shop)/.test(q)) return false;
    return true;
  }
  return false;
}

export type ResearchOutcome =
  | { status: 'ok'; result: ResearchResult }
  | { status: 'unavailable'; reason: string };

/** Attempt live research. Fails closed when no provider is connected. */
export async function requestResearch(query: string): Promise<ResearchOutcome> {
  const provider = getAvailableResearchProvider();
  if (!provider) {
    return {
      status: 'unavailable',
      reason:
        'No live research provider is connected in this build — TED runs as a local app ' +
        'with no search backend, so he cannot reach the live web from here.',
    };
  }
  try {
    const result = await provider.research(query);
    return { status: 'ok', result };
  } catch (err) {
    return {
      status: 'unavailable',
      reason: `The research provider (${provider.name}) failed: ${err instanceof Error ? err.message : 'unknown error'}.`,
    };
  }
}

/**
 * Founder-facing reply for a current-information question when research is
 * unavailable. Names what TED can do instead; never fills the gap with a
 * guess dressed as current fact.
 */
export function researchUnavailableReply(query: string): string {
  return (
    `That's a "what's true right now" question, and I want to answer it honestly: ` +
    `I don't have live web access in this build, so I can't verify what's current — ` +
    `and I won't dress up stale knowledge as today's fact.\n\n` +
    `What I *can* do:\n\n` +
    `• Reason from stable knowledge about how ${query.length > 60 ? 'this space' : `“${query}”`} generally works\n` +
    `• Tell you exactly what to check and where, so the lookup takes you thirty seconds\n` +
    `• Work from our own recorded data if the question touches OCG LAB's products or builds\n\n` +
    `Want the stable-knowledge version, or the checklist of what to verify live?`
  );
}

/**
 * Format a research result with sources separated from interpretation, and
 * source dates preserved. Used when a provider IS connected.
 */
export function formatResearchResult(result: ResearchResult): string {
  const lines: string[] = [
    `Here's what live research found (checked ${result.evidenceDate}, via ${result.providerId}):`,
    '',
    result.summary,
    '',
    '**Sources**',
  ];
  for (const s of result.sources) {
    lines.push(`• ${s.title}${s.publishedAt ? ` (${s.publishedAt})` : ''} — ${s.url}`);
  }
  lines.push(
    '',
    'Treat anything above without a source as my read, not a verified fact.',
  );
  return lines.join('\n');
}

/** Evidence label helpers so replies keep recorded/live/inference separate. */
export const EVIDENCE_LABELS = {
  recorded: 'Recorded OCG LAB state',
  live: 'Live external state',
  inference: 'Technical recommendation / inference',
} as const;
