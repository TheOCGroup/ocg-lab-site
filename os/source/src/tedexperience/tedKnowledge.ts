/**
 * TED Super Agent — internal OCG LAB knowledge index (Phase 2).
 *
 * EXPERIENCE LAYER ONLY. Expands TED's ability to answer questions about
 * OCG LAB's own products, builds, deployments, technical decisions, project
 * state, known blockers, and current verified capabilities — all from
 * RECORDED data (src/data + the workspace adapters). Nothing is invented.
 *
 * Every brief separates three evidence classes:
 *   - RECORDED: what the data files actually say (with provenance date).
 *   - LIVE: what would require live verification (never claimed from here).
 *   - INFERENCE: TED's technical recommendation, labeled as such.
 */

import { DECISIONS_DATA } from '../data/decisions';
import {
  getCommerceTruth,
  getDeploymentTruth,
  getKnowledgeBaseProvenance,
  getWorkspaceProducts,
  getWorkspaceProjects,
  TED_STATUS_UNAVAILABLE,
} from './tedWorkspace';

export type EvidenceClass = 'recorded' | 'live' | 'inference';

export interface KnowledgeBriefSection {
  evidence: EvidenceClass;
  heading: string;
  lines: string[];
}

export interface InternalKnowledgeBrief {
  topic: string;
  sections: KnowledgeBriefSection[];
  provenance: string;
}

const normalized = (value: string): string =>
  value.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();

/** True when the message asks about OCG LAB's own recorded state. */
export function isInternalOcgQuestion(message: string): boolean {
  const q = normalized(message);
  const internalSignals = [
    /our (product|project|build|deploy|system|app|site|listing|shop)/,
    /ocg lab/,
    /what did we decide/,
    /technical decision/,
    /known blocker/,
    /where are we (on|with)/,
    /status of (the|our)/,
    /what'?s deployed/,
    /production (state|status)/,
  ];
  if (internalSignals.some((p) => p.test(q))) return true;
  // Named recorded entities also count.
  const names = [
    ...getWorkspaceProjects().map((p) => p.name.toLowerCase()),
    ...getWorkspaceProducts().map((p) => p.name.toLowerCase()),
  ];
  return names.some((n) => n.length > 4 && q.includes(n));
}

function deploymentsSection(): KnowledgeBriefSection {
  const deployments = getDeploymentTruth();
  const lines = deployments.slice(0, 6).map((d: any) => `• **${d.name}** — ${d.state}: ${String(d.detail).slice(0, 160)}`);
  return {
    evidence: 'recorded',
    heading: 'Deployments (recorded)',
    lines: lines.length ? lines : ['No deployment records on file.'],
  };
}

function blockersSection(): KnowledgeBriefSection {
  const blocked = getWorkspaceProjects().filter((p) =>
    ['BLOCKED', 'QA FAILED'].includes(p.status),
  );
  const lines: string[] = [];
  for (const p of blocked.slice(0, 5)) {
    const b = p.blockers.length ? p.blockers.join('; ') : 'recorded as blocked, no blocker detail on file';
    lines.push(`• **${p.name}** — ${b}`);
  }
  return {
    evidence: 'recorded',
    heading: 'Known blockers (recorded)',
    lines: lines.length ? lines : ['No projects are currently recorded as blocked.'],
  };
}

function decisionsSection(topic: string): KnowledgeBriefSection {
  const q = normalized(topic);
  const tokens = q.split(' ').filter((t) => t.length > 3);
  const scored = DECISIONS_DATA.map((d: any) => {
    const text = `${d.title} ${d.why} ${d.scope}`.toLowerCase();
    const score = tokens.filter((t) => text.includes(t)).length;
    return { d, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
  const lines = scored.map(
    (s) => `• **${s.d.title}** (${s.d.date}, ${s.d.scope}) — ${s.d.why}`,
  );
  return {
    evidence: 'recorded',
    heading: 'Technical decisions on record',
    lines: lines.length ? lines : ['No recorded decision matches that topic.'],
  };
}

function commerceSection(): KnowledgeBriefSection {
  const commerce = getCommerceTruth();
  const lines = (commerce as any[]).map(
    (c) => `• **${c.channel}** — orders: ${c.ordersState}; revenue: ${c.revenueState}; customers: ${c.customersState}`,
  );
  return {
    evidence: 'recorded',
    heading: 'Commerce (recorded — never estimated)',
    lines: lines.length ? lines : ['No commerce records on file.'],
  };
}

function liveBoundarySection(): KnowledgeBriefSection {
  return {
    evidence: 'live',
    heading: 'Live state (not verifiable from here)',
    lines: [
      'Whether a deployment is reachable RIGHT NOW, whether a checkout completes TODAY, or what a dashboard shows THIS MINUTE — I cannot verify live state from this build. The records above are the last verified truth I hold.',
      'If you need live confirmation, tell me what to check and I\'ll tell you exactly how — or point me at the evidence and I\'ll read it.',
    ],
  };
}

/** Build a brief over recorded OCG LAB knowledge for the founder's question. */
export function getInternalKnowledgeBrief(message: string): InternalKnowledgeBrief {
  const q = normalized(message);
  const provenance = getKnowledgeBaseProvenance();
  const sections: KnowledgeBriefSection[] = [];

  if (/deploy|production|live|hosting|netlify|vercel/.test(q)) sections.push(deploymentsSection());
  if (/block|stuck|problem|issue/.test(q)) sections.push(blockersSection());
  if (/decid|decision|why did we|architecture choice/.test(q)) sections.push(decisionsSection(message));
  if (/revenue|customer|order|sale|commerce|money/.test(q)) sections.push(commerceSection());

  if (!sections.length) {
    // General internal question: give the honest landscape.
    sections.push(deploymentsSection());
    sections.push(blockersSection());
  }
  sections.push(liveBoundarySection());

  return {
    topic: message.slice(0, 120),
    sections,
    provenance: `Recorded knowledge base v${provenance.version} (as of ${provenance.asOf}).`,
  };
}

/** Render a brief as a founder-facing reply with evidence classes labeled. */
export function formatKnowledgeBrief(brief: InternalKnowledgeBrief): string {
  const out: string[] = [`Here's what I actually have on record:\n`];
  for (const s of brief.sections) {
    const tag =
      s.evidence === 'recorded'
        ? '📋 recorded'
        : s.evidence === 'live'
          ? '🌐 live check needed'
          : '💡 my read';
    out.push(`**${s.heading}** _(${tag})_`);
    out.push(...s.lines);
    out.push('');
  }
  out.push(`_${brief.provenance}_`);
  out.push(
    'Anything above marked "live check needed" is a boundary I won\'t cross by guessing — ' +
      'show me the evidence or tell me where to look and I\'ll work it with you.',
  );
  return out.join('\n');
}

export { TED_STATUS_UNAVAILABLE };
