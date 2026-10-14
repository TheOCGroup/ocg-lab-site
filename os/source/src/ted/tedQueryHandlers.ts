import {
  TED_CANONICAL_IDENTITY,
  TED_COMMERCE,
  TED_DEPLOYMENTS,
  TED_KNOWLEDGE_BASE_AS_OF,
  TED_KNOWLEDGE_BASE_VERSION,
  TED_LIFECYCLE_STATE,
  TED_NEVER_FABRICATE,
  TED_PRODUCTS,
  TED_REGISTRY_RECORDED_PRICES,
  tedProductsWithVerifiedCheckout,
} from '../data/tedKnowledgeBase';
import { TED_COMMAND_CHAIN, TED_COMMERCIAL_LIFECYCLE, TED_DEPARTMENT_FLOW } from '../data/tedDepartment';

/**
 * TED query handlers — natural-language routing for the OCG LAB commercial
 * department, accountable to TED ("Ted the Tech Guy"), OCG LAB Department Head.
 *
 * Pattern: mirrors resolveAgentOperationsIntent (cue scoring + compositions +
 * recent-query context) so the execution lane can wire it into aidenEngine.ts
 * the same way agentOperationsSkills.ts is wired.
 *
 * Fail-closed contract: every reply states what is verified and marks the rest
 * STATUS UNAVAILABLE. No invented numbers, prices, sales, or readiness — ever.
 */

export type TedIntentId =
  | 'TED_PRODUCT_STATUS'
  | 'TED_COMMERCE_STATUS'
  | 'TED_PIPELINE_OVERVIEW'
  | 'TED_DEPLOY_STATUS'
  | 'TED_TASK';

export interface TedIntent {
  id: TedIntentId;
  name: string;
  purpose: string;
  approvalPolicy: 'INTERNAL_AUTONOMOUS' | 'GOVERNED_EXTERNAL_ACTION';
  examples: string[];
  cues: string[];
}

export interface TedIntentResolution {
  primary: TedIntent;
  intents: TedIntent[];
  confidence: 'HIGH' | 'MEDIUM';
  contextualizedFrom?: string;
}

export interface TedReply {
  reply: string;
  intent: TedIntentId;
  confidence: 'HIGH' | 'MEDIUM';
  evidence: string;
}

export const TED_INTENTS: TedIntent[] = [
  {
    id: 'TED_PRODUCT_STATUS',
    name: 'TED PRODUCT STATUS',
    purpose: 'Report verified OCG LAB product, page, and readiness truth from the knowledge base.',
    approvalPolicy: 'INTERNAL_AUTONOMOUS',
    examples: ['Ted, what is the product status?', 'How many products do we have?', 'Are the calculators live?'],
    cues: ['ted, product status', 'ted product status', 'product status', 'what products do we have', 'how many products', 'are the calculators', 'product readiness', 'ted, are we live', 'which products are ready', 'products ready', 'what products are unfinished', 'unfinished products', 'products unfinished'],
  },
  {
    id: 'TED_COMMERCE_STATUS',
    name: 'TED COMMERCE STATUS',
    purpose: 'Report honest commerce state: sales, orders, revenue, customers, subscriptions — fail-closed when no verified source exists.',
    approvalPolicy: 'INTERNAL_AUTONOMOUS',
    examples: ['Ted, any sales?', 'What is our revenue?', 'How many customers?'],
    cues: ['ted, any sales', 'any sales', 'our revenue', 'what is our revenue', 'how many customers', 'how many orders', 'subscriptions', 'ted, commerce status', 'commerce status', 'what did we sell', 'what do we know about sales', 'what do we know about customers'],
  },
  {
    id: 'TED_PIPELINE_OVERVIEW',
    name: 'TED PIPELINE OVERVIEW',
    purpose: 'Report the OCG LAB commercial lifecycle stages and honest data gaps per stage.',
    approvalPolicy: 'INTERNAL_AUTONOMOUS',
    examples: ['Ted, show me the pipeline.', 'Where are we in the lifecycle?'],
    cues: ['ted, pipeline', 'lab pipeline', 'commercial lifecycle', 'lifecycle stages', 'ted, show me the pipeline', 'where are we in the lifecycle', 'leads to customers'],
  },
  {
    id: 'TED_DEPLOY_STATUS',
    name: 'TED DEPLOY STATUS',
    purpose: 'Report verified deployment truth: what is published, what is blocked, and the founder-only path to unblock.',
    approvalPolicy: 'INTERNAL_AUTONOMOUS',
    examples: ['Ted, deploy status?', 'Is the sync patch live?', 'What is blocking the deploy?'],
    cues: ['ted, deploy status', 'deploy status', 'is the sync patch live', 'sync timeout patch', 'what is blocking the deploy', 'netlify deploy', 'deployment status'],
  },
  {
    id: 'TED_TASK',
    name: 'TED TASK',
    purpose: 'Accept a departmental task from the founder (routed AIDEN → CHIEF → TED) and return a governed QUEUED task object. Never claims execution.',
    approvalPolicy: 'GOVERNED_EXTERNAL_ACTION',
    examples: ['Ted, take this on.', 'Ted, own this workstream.'],
    cues: ['ted, take this on', 'ted, own this', 'ted, handle this', 'ted, pick this up', 'ted task', 'assign this to ted'],
  },
];

const byId = (id: TedIntentId): TedIntent => TED_INTENTS.find((intent) => intent.id === id)!;

const compositions: Array<{ cues: string[]; ids: TedIntentId[] }> = [
  { cues: ['ted, status'], ids: ['TED_PRODUCT_STATUS', 'TED_COMMERCE_STATUS', 'TED_DEPLOY_STATUS'] },
  { cues: ['ted, brief me', 'ted, where are we'], ids: ['TED_PRODUCT_STATUS', 'TED_PIPELINE_OVERVIEW', 'TED_COMMERCE_STATUS'] },
  { cues: ['ted, take this on', 'ted, own this'], ids: ['TED_TASK', 'TED_PIPELINE_OVERVIEW'] },
];

const normalized = (value: string): string => value.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();

export function resolveTedIntent(query: string, recentFounderQueries: string[] = []): TedIntentResolution | null {
  const q = normalized(query);
  const recent = [...recentFounderQueries].reverse().map(normalized).find((item) => item && item !== q);
  const contextDependent = ['ted', 'status', 'brief me', 'where are we'];
  const effective = contextDependent.some((cue) => q === cue || q.startsWith(cue)) && recent ? `${recent} ${q}` : q;

  for (const composition of compositions) {
    if (composition.cues.some((cue) => effective.includes(cue))) {
      return {
        primary: byId(composition.ids[0]),
        intents: composition.ids.map(byId),
        confidence: 'HIGH',
        contextualizedFrom: recent && effective !== q ? recent : undefined,
      };
    }
  }

  const scored = TED_INTENTS
    .map((intent) => ({
      intent,
      score: intent.cues.reduce((score, cue) => score + (effective.includes(cue) ? Math.max(1, cue.split(' ').length) : 0), 0),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return null;
  const best = scored[0];
  return {
    primary: best.intent,
    intents: [best.intent],
    confidence: best.score >= 2 ? 'HIGH' : 'MEDIUM',
    contextualizedFrom: recent && effective !== q ? recent : undefined,
  };
}

/* ------------------------------------------------------------------ */
/* Reply builders — every reply is fail-closed.                        */
/* ------------------------------------------------------------------ */

function productStatusReply(): string {
  const lines = TED_PRODUCTS.map(
    (p) => `• **${p.productName}** (${p.productType}) — ${p.route}\n  Page: ${p.pageStatus === 'LIVE_PAGE' ? 'renders live' : 'not on site'} · Checkout: ${p.checkoutStatus === 'VERIFIED_CHECKOUT' ? 'verified' : 'NO VERIFIED CHECKOUT'} · Readiness: ${p.readiness} · Price: ${p.price}`,
  ).join('\n\n');
  const verified = tedProductsWithVerifiedCheckout();
  return (
    `### **TED — OCG LAB Product Status**\n\n` +
    `**${TED_PRODUCTS.length} products** in the verified portfolio (repo ${TED_CANONICAL_IDENTITY.repo} @ ${TED_CANONICAL_IDENTITY.repoHeadCommit.slice(0, 8)}).\n\n` +
    `${lines}\n\n` +
    `**Verified checkouts:** ${verified.length === 0 ? 'none — 0 of 8 products have a verified checkout path' : verified.length}\n\n` +
    `Registry-recorded channel prices (recorded evidence, NOT current live prices):\n` +
    `${TED_REGISTRY_RECORDED_PRICES.map((r) => `• ${r.productName} — ${r.channel} $${r.recordedPriceUsd} (${r.recordedVerification}); current live price: ${r.currentLivePrice}`).join('\n')}\n\n` +
    `TED reports page content ("$0", "Purchase" text) as unverified content, never as price or checkout.`
  );
}

function commerceStatusReply(): string {
  const lines = TED_COMMERCE.map(
    (c) =>
      `• **${c.channel}**\n  Catalog: ${c.catalogState} · Orders: ${c.ordersState} · Revenue: ${c.revenueState} · Customers: ${c.customersState} · Subscriptions: ${c.subscriptionsState}\n  ${c.detail}`,
  ).join('\n\n');
  return (
    `### **TED — OCG LAB Commerce Status**\n\n${lines}\n\n` +
    `No sales, orders, customers, subscriptions, or revenue may be reported anywhere until a verified source exists. ` +
    `TED will not invent commercial proof.`
  );
}

function pipelineOverviewReply(): string {
  const lines = TED_LIFECYCLE_STATE.map((s) => `• **${s.stage}** — data source: ${s.dataSource} · state: ${s.currentState}\n  ${s.note}`).join('\n\n');
  return (
    `### **TED — OCG LAB Commercial Lifecycle**\n\n` +
    `Lifecycle: ${TED_COMMERCIAL_LIFECYCLE.join(' → ')}\n\n${lines}\n\n` +
    `The workspace that will persist these stages is the proposed Pipeline LAB namespace (/api/v1/lab/*) — design only, ASTRA review required before any implementation.`
  );
}

function deployStatusReply(): string {
  const lines = TED_DEPLOYMENTS.map((d) => `• **${d.name}** — **${d.state}**\n  ${d.detail}`).join('\n\n');
  return `### **TED — OCG LAB Deployment Status**\n\n${lines}`;
}

function deterministicTaskId(query: string): string {
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    hash = (hash * 31 + query.charCodeAt(i)) >>> 0;
  }
  return `ted-task-${hash.toString(16).padStart(8, '0')}`;
}

function taskReply(query: string): string {
  const taskId = deterministicTaskId(normalized(query));
  return (
    `### **TED — Departmental Task Accepted**\n\n` +
    `**Task:** \`${taskId}\` — **QUEUED**\n` +
    `**Owner:** TED (Ted the Tech Guy), OCG LAB Department Head\n` +
    `**Routed:** ${TED_COMMAND_CHAIN.join(' → ')}\n` +
    `**Flow:** ${TED_DEPARTMENT_FLOW.join(' → ')}\n\n` +
    `This task is QUEUED, not executing and not complete. TED will coordinate MARK / ORION / NOVA as needed ` +
    `and report a verified result — never a claimed one.`
  );
}

/* ------------------------------------------------------------------ */
/* Public entry point                                                  */
/* ------------------------------------------------------------------ */

export function handleTedQuery(rawQuery: string, recentFounderQueries: string[] = []): TedReply | null {
  const resolution = resolveTedIntent(rawQuery, recentFounderQueries);
  if (!resolution) return null;

  const builders: Record<TedIntentId, (q: string) => string> = {
    TED_PRODUCT_STATUS: productStatusReply,
    TED_COMMERCE_STATUS: commerceStatusReply,
    TED_PIPELINE_OVERVIEW: pipelineOverviewReply,
    TED_DEPLOY_STATUS: deployStatusReply,
    TED_TASK: taskReply,
  };

  const reply = builders[resolution.primary.id](rawQuery);
  return {
    reply,
    intent: resolution.primary.id,
    confidence: resolution.confidence,
    evidence: `TED knowledge base v${TED_KNOWLEDGE_BASE_VERSION} (as of ${TED_KNOWLEDGE_BASE_AS_OF}); intent ${resolution.primary.name} resolved from founder language.`,
  };
}

export { TED_NEVER_FABRICATE };
