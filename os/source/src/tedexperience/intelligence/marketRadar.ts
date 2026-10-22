/**
 * OCG MARKET RADAR — evidence-only competitor comparison.
 *
 * Ported faithfully (TypeScript) from TheOCGroup/OCG-ONE
 * src/intelligence/marketRadar.js @ docs/ocg-intelligence-brand-20261020
 * (PR #20, head cee14d58d474). No scraping, network access, writes, or
 * unsupported traffic estimation.
 *
 * One deliberate, documented extension: `classifyEvidence` separates
 * structural validity from scoring. A structurally valid record whose
 * score is null is UNSCORED (the 2026-10-20 baseline forbids inventing
 * 0–100 scores before a rubric exists); `validateEvidence` and
 * `scoreCompetitor` keep the exact upstream semantics, so unscored
 * records never contribute a score.
 */
export const EVIDENCE_CATEGORIES = Object.freeze([
  'product', 'pricing', 'customer', 'technology', 'distribution', 'trust',
] as const);
export type EvidenceCategory = (typeof EVIDENCE_CATEGORIES)[number];

export const MARKET_RADAR_WEIGHTS = Object.freeze({
  product: 25, pricing: 20, customer: 20, technology: 15, distribution: 10, trust: 10,
} as const);

export type EvidenceStatus = 'OBSERVED' | 'THIRD_PARTY_ESTIMATE' | 'INFERENCE';
const STATUSES = new Set<string>(['OBSERVED', 'THIRD_PARTY_ESTIMATE', 'INFERENCE']);

export interface EvidenceRecord {
  category: EvidenceCategory;
  status: EvidenceStatus;
  sourceUrl: string;
  retrievedAt: string;
  summary: string;
  usageRights: string;
  /** 0–100 once a documented rubric assigns one; null = not scored yet. */
  score: number | null;
}

function validUrl(value: unknown): boolean {
  try {
    const u = new URL(String(value));
    return ['https:', 'http:'].includes(u.protocol) && Boolean(u.hostname);
  } catch {
    return false;
  }
}

/**
 * Render-layer allowlist (defense in depth): only http(s) URLs may be
 * rendered as links. Anything else — including records the logic layer
 * rejected — must be shown as plain text, never as an href.
 */
export function isSafeExternalUrl(value: unknown): boolean {
  return validUrl(value);
}

/** Structural + scoring validity, exactly as upstream `validateEvidence`. */
export function validateEvidence(record: unknown): boolean {
  if (!record || typeof record !== 'object') return false;
  const r = record as Record<string, unknown>;
  return (
    (EVIDENCE_CATEGORIES as readonly string[]).includes(r.category as string) &&
    STATUSES.has(r.status as string) &&
    validUrl(r.sourceUrl) &&
    Number.isFinite(Date.parse(r.retrievedAt as string)) &&
    typeof r.summary === 'string' && r.summary.trim().length > 0 &&
    typeof r.usageRights === 'string' && r.usageRights.trim().length > 0 &&
    Number.isFinite(r.score as number) && (r.score as number) >= 0 && (r.score as number) <= 100
  );
}

export type EvidenceVerdict = 'accepted' | 'unscored' | 'rejected';

export interface EvidenceClassification {
  verdict: EvidenceVerdict;
  reasons: string[];
}

/**
 * Classify one record for evidence-quality reporting.
 * - accepted: fully valid, including a rubric score — eligible for scoring.
 * - unscored: structurally valid but score is null (rubric pending).
 * - rejected: structurally invalid, or score present but out of range.
 */
export function classifyEvidence(record: unknown): EvidenceClassification {
  if (!record || typeof record !== 'object') {
    return { verdict: 'rejected', reasons: ['Record is missing or not an object'] };
  }
  const r = record as Record<string, unknown>;
  const reasons: string[] = [];
  if (!(EVIDENCE_CATEGORIES as readonly string[]).includes(r.category as string)) reasons.push('Unknown category');
  if (!STATUSES.has(r.status as string)) reasons.push('Unknown evidence status');
  if (!validUrl(r.sourceUrl)) reasons.push('Source URL must be a valid http(s) URL');
  if (!Number.isFinite(Date.parse(r.retrievedAt as string))) reasons.push('Retrieved date is invalid');
  if (typeof r.summary !== 'string' || r.summary.trim().length === 0) reasons.push('Summary is missing');
  if (typeof r.usageRights !== 'string' || r.usageRights.trim().length === 0) reasons.push('Usage rights are missing');

  const scoreMissing = r.score === null || r.score === undefined;
  if (!scoreMissing && !(Number.isFinite(r.score as number) && (r.score as number) >= 0 && (r.score as number) <= 100)) {
    reasons.push('Score must be a number between 0 and 100');
  }
  if (reasons.length > 0) return { verdict: 'rejected', reasons };
  if (scoreMissing) return { verdict: 'unscored', reasons: ['No rubric score assigned yet'] };
  return { verdict: 'accepted', reasons: [] };
}

export interface CategoryScore {
  score: number;
  count: number;
}

export interface CompetitorAssessment {
  score: number | null;
  coveragePercent: number;
  evidenceCount: number;
  rejectedCount: number;
  categories: Record<EvidenceCategory, CategoryScore | null>;
  label: 'COMPLETE_COVERAGE' | 'PARTIAL_COVERAGE';
}

/** Weighted scoring over OBSERVED, fully valid evidence only (upstream). */
export function scoreCompetitor(evidence: EvidenceRecord[] = []): CompetitorAssessment {
  if (!Array.isArray(evidence)) throw new TypeError('Evidence must be an array');
  const accepted = evidence.filter(validateEvidence);
  const byCategory = {} as Record<EvidenceCategory, CategoryScore | null>;
  for (const category of EVIDENCE_CATEGORIES) {
    const entries = accepted.filter((e) => e.category === category && e.status === 'OBSERVED');
    // Do not treat missing or inferred data as a zero score.
    byCategory[category] = entries.length
      ? { score: entries.reduce((sum, e) => sum + (e.score as number), 0) / entries.length, count: entries.length }
      : null;
  }
  const covered = EVIDENCE_CATEGORIES.filter((k) => byCategory[k] !== null);
  const coveredWeight = covered.reduce((sum, k) => sum + MARKET_RADAR_WEIGHTS[k], 0);
  const weightedScore = coveredWeight
    ? covered.reduce((sum, k) => sum + (byCategory[k] as CategoryScore).score * MARKET_RADAR_WEIGHTS[k], 0) / coveredWeight
    : null;
  return Object.freeze({
    score: weightedScore === null ? null : Math.round(weightedScore * 10) / 10,
    coveragePercent: coveredWeight,
    evidenceCount: accepted.length,
    rejectedCount: evidence.length - accepted.length,
    categories: byCategory,
    label: coveredWeight === 100 ? 'COMPLETE_COVERAGE' : 'PARTIAL_COVERAGE',
  }) as CompetitorAssessment;
}

export const marketRadarWeights = MARKET_RADAR_WEIGHTS;
