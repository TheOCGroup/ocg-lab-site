import { buildCompetitorComparison, type CompetitorProfile } from './competitorComparison';
import { buildReviewedReceptionistPricing } from './reviewedPricingReport';
import type { PricingEvidenceRecord } from './pricingEvidenceGate';

/**
 * Read-only view model for the OCG INTELLIGENCE workspace.
 *
 * Ported from TheOCGroup/OCG-ONE src/intelligence/dashboardModel.js
 * @ PR #20 (cee14d58d474), extended with an evidence-quality report.
 * No DOM, navigation, network calls, storage, or production effects.
 */
export interface IntelligenceDashboardInput {
  profiles?: CompetitorProfile[];
  pricingScenario?: { calls: number; uniqueCustomers: number } | null;
  pricingEvidence?: PricingEvidenceRecord[];
  asOf?: string;
}

export interface EvidenceQualityReport {
  totalRecords: number;
  accepted: number;
  unscored: number;
  rejected: number;
  rejectedReasons: string[];
  newestEvidenceAt: string | null;
  oldestEvidenceAt: string | null;
  /** Days between asOf and the newest evidence; null when no evidence. */
  newestAgeDays: number | null;
  /** Reporting threshold aligned with the pricing gate's 30-day rule. */
  staleThresholdDays: 30;
  stale: boolean;
  scoringState: 'SCORED' | 'PARTIAL' | 'NOT_SCORED';
}

export function buildEvidenceQualityReport(
  competitors: ReturnType<typeof buildCompetitorComparison>,
  asOf?: string,
): EvidenceQualityReport {
  const all = competitors.flatMap((c) => c.classifications);
  const accepted = all.filter((c) => c.classification.verdict === 'accepted').length;
  const unscored = all.filter((c) => c.classification.verdict === 'unscored').length;
  const rejected = all.filter((c) => c.classification.verdict === 'rejected');
  const dates = all
    .filter((c) => c.classification.verdict !== 'rejected')
    .map((c) => c.record.retrievedAt)
    .sort();
  const newestEvidenceAt = dates.at(-1) ?? null;
  const oldestEvidenceAt = dates.at(0) ?? null;
  const asOfMs = asOf ? Date.parse(asOf) : Date.now();
  const newestAgeDays =
    newestEvidenceAt && Number.isFinite(asOfMs)
      ? Math.max(0, Math.floor((asOfMs - Date.parse(newestEvidenceAt)) / 86400000))
      : null;
  return {
    totalRecords: all.length,
    accepted,
    unscored,
    rejected: rejected.length,
    rejectedReasons: rejected.flatMap((c) => c.classification.reasons),
    newestEvidenceAt,
    oldestEvidenceAt,
    newestAgeDays,
    staleThresholdDays: 30,
    stale: newestAgeDays !== null && newestAgeDays > 30,
    scoringState: accepted === 0 ? 'NOT_SCORED' : unscored > 0 || rejected.length > 0 ? 'PARTIAL' : 'SCORED',
  };
}

export function buildIntelligenceDashboard({
  profiles = [],
  pricingScenario = null,
  pricingEvidence = [],
  asOf,
}: IntelligenceDashboardInput = {}) {
  const competitors = buildCompetitorComparison(profiles);
  const pricing = pricingScenario
    ? buildReviewedReceptionistPricing({ ...pricingScenario, evidence: pricingEvidence, asOf })
    : { status: 'NOT_REQUESTED' as const, comparison: null, findings: [] as { provider: string; plan: string; status: string; issues: string[] }[] };
  return {
    product: 'OCG INTELLIGENCE',
    module: 'OCG MARKET RADAR',
    competitors,
    pricing,
    quality: buildEvidenceQualityReport(competitors, asOf),
    alerts: [
      ...competitors
        .filter((c) => c.requiresReview)
        .map((c) => ({
          type: 'EVIDENCE_REVIEW',
          subject: c.name,
          message: 'Incomplete or rejected competitor evidence',
        })),
      ...(pricing.status === 'BLOCKED'
        ? [
            {
              type: 'PRICING_REVIEW',
              subject: 'Competitor pricing',
              message: 'Reviewed pricing evidence is incomplete or inconsistent',
            },
          ]
        : []),
    ],
    readOnly: true as const,
  };
}

export type IntelligenceDashboard = ReturnType<typeof buildIntelligenceDashboard>;
