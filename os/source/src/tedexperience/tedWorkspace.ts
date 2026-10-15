/**
 * TED experience workspace adapters.
 *
 * EXPERIENCE LAYER ONLY. This module reads the existing recorded OCG LAB
 * data (projects registry, TED knowledge base, agent roster) and exposes it
 * to the TED conversational experience. It never invents data: anything
 * without a recorded source is returned as STATUS UNAVAILABLE.
 *
 * The intelligence/governance layer lives in src/ted/ and src/data/ and is
 * intentionally not modified here.
 */
import { StorageEngine, ProjectAction } from '../data/storageEngine';

export function getProjectActions(projectId: string): ProjectAction[] {
  return StorageEngine.getProjectActions(projectId);
}
import {
  TED_COMMERCE,
  TED_DEPLOYMENTS,
  TED_KNOWLEDGE_BASE_AS_OF,
  TED_KNOWLEDGE_BASE_VERSION,
  TED_PRODUCTS,
} from '../data/tedKnowledgeBase';
import { ProjectRecord } from '../types';

export const TED_STATUS_UNAVAILABLE = 'STATUS UNAVAILABLE';

export interface WorkspaceProject {
  id: string;
  name: string;
  status: string;
  phase: string;
  completionPercent: number;
  blockers: string[];
  nextAction: string;
  productionUrl: string;
  deployment: string;
  latestVerifiedOutput: string;
  assignedAgents: string[];
  whyItMatters?: string;
}

export interface WorkspaceProduct {
  id: string;
  name: string;
  type: string;
  route: string;
  pageLive: boolean;
  checkoutVerified: boolean;
  readiness: string;
  price: string;
}

export interface SpecialistAgent {
  id: 'MARK' | 'ORION' | 'NOVA';
  name: string;
  responsibility: string;
  notResponsible: string;
}

function toWorkspaceProject(p: ProjectRecord): WorkspaceProject {
  return {
    id: p.id,
    name: p.name,
    status: p.status,
    phase: p.currentPhase,
    completionPercent: p.completionPercent,
    blockers: p.blockers ?? [],
    nextAction: p.nextAction || TED_STATUS_UNAVAILABLE,
    productionUrl: p.productionUrl || TED_STATUS_UNAVAILABLE,
    deployment: p.deployment || TED_STATUS_UNAVAILABLE,
    latestVerifiedOutput: p.latestVerifiedOutput || TED_STATUS_UNAVAILABLE,
    assignedAgents: p.assignedAgents ?? [],
    whyItMatters: p.whyItMatters,
  };
}

export function getWorkspaceProjects(): WorkspaceProject[] {
  return StorageEngine.loadState().projects.map(toWorkspaceProject);
}

export function getWorkspaceProducts(): WorkspaceProduct[] {
  return TED_PRODUCTS.map((p) => ({
    id: p.productId,
    name: p.productName,
    type: p.productType,
    route: p.route,
    pageLive: p.pageStatus === 'LIVE_PAGE',
    checkoutVerified: p.checkoutStatus === 'VERIFIED_CHECKOUT',
    readiness: p.readiness,
    price: p.price,
  }));
}

export const SPECIALIST_AGENTS: SpecialistAgent[] = [
  {
    id: 'MARK',
    name: 'MARK',
    responsibility:
      'Marketing strategy, market research, positioning, offers, SEO/GEO, acquisition, campaigns, attribution, growth.',
    notResponsible: 'MARK never does content creation or media production.',
  },
  {
    id: 'ORION',
    name: 'ORION',
    responsibility:
      'Content creator: concepts, hooks, scripts, storytelling, G Method content, educational content.',
    notResponsible: 'ORION never owns marketing strategy or final production.',
  },
  {
    id: 'NOVA',
    name: 'NOVA',
    responsibility:
      'Creative and media production: video, graphics, images, editing, production, creative assets.',
    notResponsible: 'NOVA never owns strategy or positioning.',
  },
];

export type TedWorkspaceContext =
  | { kind: 'none' }
  | { kind: 'project'; project: WorkspaceProject }
  | { kind: 'product'; product: WorkspaceProduct }
  | { kind: 'agent'; agent: SpecialistAgent }
  | { kind: 'idea'; ideaSummary: string };

export interface TedOperation {
  label: string;
  state: 'WORKING' | 'QUEUED' | 'WAITING' | 'BLOCKED';
  detail?: string;
}

const normalized = (value: string): string =>
  value.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();

function tokenizeName(name: string): string[] {
  return normalized(name)
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(' ')
    .filter((t) => t.length > 2 && !['the', 'and', 'for', 'with', 'our', 'lab', 'ocg'].includes(t));
}

/**
 * Detect which recorded project, product, or specialist the founder is
 * talking about. Returns null when nothing recorded matches — the
 * experience then keeps context unchanged instead of guessing.
 */
export function detectWorkspaceContext(message: string): TedWorkspaceContext | null {
  const q = normalized(message);

  for (const agent of SPECIALIST_AGENTS) {
    if (q.includes(agent.id.toLowerCase()) || q.includes(agent.name.toLowerCase())) {
      return { kind: 'agent', agent };
    }
  }

  for (const product of getWorkspaceProducts()) {
    const tokens = tokenizeName(product.name);
    const hits = tokens.filter((t) => q.includes(t)).length;
    if (hits >= 2) return { kind: 'product', product };
  }

  let best: WorkspaceProject | null = null;
  let bestScore = 0;
  for (const project of getWorkspaceProjects()) {
    const tokens = tokenizeName(project.name);
    const score = tokens.filter((t) => q.includes(t)).length;
    if (score > bestScore) {
      bestScore = score;
      best = project;
    }
  }
  if (best && bestScore >= 2) return { kind: 'project', project: best };

  return null;
}

export function getCommerceTruth(): typeof TED_COMMERCE {
  return TED_COMMERCE;
}

export function getDeploymentTruth(): typeof TED_DEPLOYMENTS {
  return TED_DEPLOYMENTS;
}

export function getKnowledgeBaseProvenance(): { version: string; asOf: string } {
  return { version: TED_KNOWLEDGE_BASE_VERSION, asOf: TED_KNOWLEDGE_BASE_AS_OF };
}

/** Customers: no verified customer source exists in the recorded data. */
export function getCustomerTruth(): string {
  return TED_STATUS_UNAVAILABLE;
}
