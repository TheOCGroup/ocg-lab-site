/**
 * TED Phase 2.3 — OCG LAB Product Memory.
 *
 * Structured product memory underneath TED. Normalizes the canonical
 * repository records (PRODUCTS_DATA, PROJECTS_DATA, DECISIONS_DATA) into
 * founder-friendly product records. No second database — this reads the
 * existing sources and presents them plainly.
 *
 * TRUTH CONTRACT:
 * - Every field comes from a canonical record or is marked unavailable.
 * - Evidence levels: PLANNED | IMPLEMENTED | VERIFIED.
 * - Statuses use founder language only: IDEA | BUILDING | NEEDS ATTENTION |
 *   READY TO REVIEW | READY | LIVE | STATUS UNAVAILABLE.
 * - Nothing is invented: no percentages, no prices, no dates, no URLs
 *   unless the record contains them.
 */

import { PRODUCTS_DATA } from '../data/products';
import { PROJECTS_DATA } from '../data/projects';
import { DECISIONS_DATA } from '../data/decisions';
import type { Product } from '../types';

/** Founder-facing product status. Plain English only. */
export type FounderProductStatus =
  | 'IDEA'
  | 'BUILDING'
  | 'NEEDS ATTENTION'
  | 'READY TO REVIEW'
  | 'READY'
  | 'LIVE'
  | 'STATUS UNAVAILABLE';

/** How well we know something. */
export type EvidenceLevel = 'PLANNED' | 'IMPLEMENTED' | 'VERIFIED';

export interface ProductFunction {
  name: string;
  evidence: EvidenceLevel;
  /** Where this came from. */
  source: string;
}

export interface ProductDecision {
  title: string;
  why: string;
  date: string | null;
  scope: string;
}

export interface ProductMemory {
  id: string;
  title: string;
  subtitle: string;
  /** 1. WHAT ARE WE BUILDING? — original vision, plain English. */
  vision: string;
  /** 2. WHO IS IT FOR? */
  audience: string;
  /** 3. PROBLEM IT SOLVES */
  problem: string;
  /** 4. WHAT IT DOES — only functions belonging to this product. */
  functions: ProductFunction[];
  /** 5. THE EXPERIENCE — what happens when someone uses it. */
  experience: string;
  /** 6. KEY COMPONENTS — only components belonging to this product. */
  components: string[];
  /** Founder status. */
  status: FounderProductStatus;
  /** 7. WHAT'S FINISHED — verified/evidenced only. */
  finished: { item: string; evidence: EvidenceLevel }[];
  /** 8. WHAT'S LEFT — remaining known work, plain English. */
  remaining: string[];
  /** 9. BUSINESS MODEL — only recorded values. */
  businessModel: {
    price: string;
    billing: string;
    fulfillment: string[];
  };
  /** 10. IMPORTANT DECISIONS — recorded only. */
  decisions: ProductDecision[];
  /** 11. FILES & BUILDS — verified assets only. */
  assets: { label: string; value: string }[];
  /** 12. NEXT MOVE — 1-3 items. */
  nextMoves: string[];
  /** Source records this was built from. */
  sources: string[];
  lastUpdated: string;
}

/**
 * Map internal statuses to founder language.
 * Published (storefront catalog) → LIVE — it's offered for sale.
 * Project BUILDING → BUILDING. PRODUCTION → LIVE. RELEASED → READY.
 * Anything unknown → STATUS UNAVAILABLE (never guess).
 */
export function mapToFounderStatus(
  productStatus: string | undefined,
  projectStatus: string | undefined,
): FounderProductStatus {
  if (projectStatus === 'BUILDING') return 'BUILDING';
  if (projectStatus === 'PRODUCTION') return 'LIVE';
  if (productStatus === 'Published') return 'LIVE';
  if (projectStatus === 'RELEASED') return 'READY';
  return 'STATUS UNAVAILABLE';
}

/** Find a project record linked to a product by name similarity. */
function findLinkedProject(productTitle: string) {
  const norm = productTitle.toLowerCase();
  return PROJECTS_DATA.find((p) => {
    const pn = p.name.toLowerCase();
    const ps = (p.productSystem || '').toLowerCase();
    return (
      pn.includes(norm.split(' ')[0]) ||
      ps.includes(norm.split(' ')[0]) ||
      norm.includes(ps.split(' ')[0])
    );
  });
}

/** Find decisions relevant to a product. */
function findProductDecisions(productTitle: string): ProductDecision[] {
  const keywords = productTitle.toLowerCase().split(' ').filter((w) => w.length > 3);
  return DECISIONS_DATA.filter((d) => {
    const text = (d.title + ' ' + d.why).toLowerCase();
    return (
      d.scope === 'Product' ||
      keywords.some((k) => text.includes(k))
    );
  })
    .slice(0, 5)
    .map((d) => ({
      title: d.title,
      why: d.why,
      date: d.date || null,
      scope: d.scope,
    }));
}

function formatPrice(product: Product): string {
  if (product.price === 0) return 'Not decided yet';
  const billing =
    product.billingModel === 'monthly'
      ? '/month'
      : product.billingModel === 'annual'
        ? '/year'
        : product.billingModel === 'one-time'
          ? ' one-time'
          : '';
  return `$${product.price}${billing}`;
}

/** Build a ProductMemory from canonical records. Never invents. */
export function buildProductMemory(product: Product): ProductMemory {
  const project = findLinkedProject(product.title);
  const status = mapToFounderStatus(product.status, project?.status);

  // Functions: from the product's feature list. Published = IMPLEMENTED.
  // We do NOT claim VERIFIED without verification evidence.
  const functions: ProductFunction[] = (product.features || []).map((f) => ({
    name: f,
    evidence: 'IMPLEMENTED' as EvidenceLevel,
    source: 'Product catalog (Published)',
  }));

  // Finished: features are published, so they're implemented.
  // We stay conservative: IMPLEMENTED, not VERIFIED.
  const finished = (product.features || []).slice(0, 8).map((f) => ({
    item: f,
    evidence: 'IMPLEMENTED' as EvidenceLevel,
  }));

  // Remaining: from linked project, or honest about the gap.
  const remaining: string[] = [];
  if (project?.nextAction) remaining.push(project.nextAction);
  if (project?.blockers && project.blockers.length > 0) {
    remaining.push(...project.blockers.slice(0, 2));
  }
  if (remaining.length === 0) {
    remaining.push('Not recorded — ask TED to investigate.');
  }

  // Components: only what the record actually lists.
  const components: string[] = [];
  if (product.integrations?.length) components.push(...product.integrations.slice(0, 6));
  if (product.techStack?.length) components.push(...product.techStack.slice(0, 4));

  // Assets: only verified, only real.
  const assets: { label: string; value: string }[] = [];
  if (project?.sourceRepository) {
    assets.push({ label: 'Repository', value: project.sourceRepository });
  }
  if (project?.productionUrl && !project.productionUrl.includes('localhost')) {
    assets.push({ label: 'Production URL', value: project.productionUrl });
  }
  if (product.downloadUrl && !product.downloadUrl.startsWith('/downloads/')) {
    assets.push({ label: 'Document', value: product.downloadUrl });
  }

  // Next moves: 1-3, from project or honest.
  const nextMoves = remaining.slice(0, 3);

  // Experience: from howItWorks + expectedResult.
  const experienceParts: string[] = [];
  if (product.expectedResult) experienceParts.push(product.expectedResult);
  if (product.howItWorks?.length) {
    experienceParts.push('How it works: ' + product.howItWorks.slice(0, 3).join(' → '));
  }
  const experience = experienceParts.join('\n\n') || 'Not recorded.';

  return {
    id: product.id,
    title: product.title,
    subtitle: product.subtitle || '',
    vision: product.summary || 'Not recorded.',
    audience: product.intendedAudience || 'Not recorded.',
    problem: product.problemSolved || 'Not recorded.',
    functions,
    experience,
    components,
    status,
    finished,
    remaining,
    businessModel: {
      price: formatPrice(product),
      billing: product.billingModel || 'Not decided yet',
      fulfillment: product.fulfillmentOptions || [],
    },
    decisions: findProductDecisions(product.title),
    assets,
    nextMoves,
    sources: [
      'PRODUCTS_DATA',
      ...(project ? ['PROJECTS_DATA:' + project.id] : []),
      'DECISIONS_DATA',
    ],
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
}

/** All product memories, built from canonical records. */
export function getAllProductMemories(): ProductMemory[] {
  return PRODUCTS_DATA.map(buildProductMemory);
}

/** Get a single product memory by ID. Null if not found (never invent). */
export function getProductMemory(id: string): ProductMemory | null {
  const product = PRODUCTS_DATA.find((p) => p.id === id);
  return product ? buildProductMemory(product) : null;
}

// ---------------------------------------------------------------------------
// P7 — PRODUCT MEMORY EVOLUTION
//
// Architecture for TED to maintain Product Memory as work occurs.
// CURRENT LIMITATION (honest): there is no write path to the canonical
// TypeScript records from the browser. These functions operate on an
// in-memory overlay that lasts for the session. Persistent writes require
// either (a) the Tool Bridge to edit the data files, or (b) a backend.
// TED must never claim a memory update persisted unless it actually did.
// ---------------------------------------------------------------------------

/** In-memory overlay: session-scoped updates awaiting persistence. */
const MEMORY_STORAGE_KEY = 'ted-product-memory-v1';

function loadMemoryOverlay(): Map<string, Partial<ProductMemory>> {
  try {
    if (typeof localStorage === 'undefined') return new Map();
    const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
    if (!raw) return new Map();
    const parsed = JSON.parse(raw) as Record<string, Partial<ProductMemory>>;
    return new Map(Object.entries(parsed));
  } catch {
    return new Map();
  }
}

const memoryOverlay = loadMemoryOverlay();

function persistMemoryOverlay(): boolean {
  try {
    if (typeof localStorage === 'undefined') return false;
    localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(Object.fromEntries(memoryOverlay)));
    return true;
  } catch {
    return false;
  }
}

export interface MemoryUpdateResult {
  applied: boolean;
  persisted: boolean;
  message: string;
}

/**
 * Record an important decision for a product. Applies to the session overlay
 * immediately; persists only via the Tool Bridge (not yet wired).
 */
export function recordProductDecision(
  productId: string,
  decision: Omit<ProductDecision, 'date'> & { date?: string | null },
): MemoryUpdateResult {
  const existing = getProductMemory(productId);
  if (!existing) {
    return { applied: false, persisted: false, message: `No product found with ID "${productId}".` };
  }
  const overlay = memoryOverlay.get(productId) || {};
  const decisions = [...(overlay.decisions ?? existing.decisions)];
  decisions.unshift({
    title: decision.title,
    why: decision.why,
    date: decision.date ?? new Date().toISOString().slice(0, 10),
    scope: decision.scope,
  });
  memoryOverlay.set(productId, { ...overlay, decisions });
  persistMemoryOverlay();
  return {
    applied: true,
    persisted: false,
    message:
      `Decision recorded for "${existing.title}" for this session. ` +
      `It is NOT yet saved to the canonical records — that needs the Tool Bridge or a backend.`,
  };
}

/**
 * Move work from "What's Left" to "What's Finished". Only call with
 * verification evidence — never on a failed build/test.
 */
export function markWorkFinished(
  productId: string,
  item: string,
  evidence: EvidenceLevel,
): MemoryUpdateResult {
  if (evidence === 'PLANNED') {
    return {
      applied: false,
      persisted: false,
      message: 'Refused: PLANNED work cannot be marked finished. Verify it first.',
    };
  }
  const existing = getProductMemory(productId);
  if (!existing) {
    return { applied: false, persisted: false, message: `No product found with ID "${productId}".` };
  }
  const overlay = memoryOverlay.get(productId) || {};
  const finished = [...(overlay.finished ?? existing.finished), { item, evidence }];
  const remaining = (overlay.remaining ?? existing.remaining).filter(
    (r) => !r.toLowerCase().includes(item.toLowerCase().slice(0, 20)),
  );
  memoryOverlay.set(productId, { ...overlay, finished, remaining });
  persistMemoryOverlay();
  return {
    applied: true,
    persisted: false,
    message:
      `"${item}" marked finished (${evidence}) for this session. ` +
      `Not yet saved to canonical records.`,
  };
}

/** Get a product memory with session overlay applied. */
export function getProductMemoryWithOverlay(id: string): ProductMemory | null {
  const base = getProductMemory(id);
  if (!base) return null;
  const overlay = memoryOverlay.get(id);
  return overlay ? { ...base, ...overlay } : base;
}

/** How many products carry session-overlay notes in this browser. */
export function getMemoryOverlayCount(): number {
  return loadMemoryOverlay().size;
}

/** Clear the session overlay (e.g. on New chat). */
export function clearMemoryOverlay(): void {
  // Product decisions are independent of chat sessions. Do not erase them
  // when switching conversations or starting a new chat.
}

/** Card-level summary: WHAT IS IT? / WHERE ARE WE? / WHAT'S NEXT? */
export interface ProductCardSummary {
  id: string;
  title: string;
  whatIsIt: string;
  status: FounderProductStatus;
  whatsNext: string;
}

export function getProductCardSummaries(): ProductCardSummary[] {
  return getAllProductMemories().map((m) => ({
    id: m.id,
    title: m.title,
    whatIsIt: m.subtitle || m.vision.slice(0, 100),
    status: m.status,
    whatsNext: m.nextMoves[0] || 'Not recorded.',
  }));
}
