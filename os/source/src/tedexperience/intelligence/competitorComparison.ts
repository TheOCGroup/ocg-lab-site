import {
  classifyEvidence,
  scoreCompetitor,
  validateEvidence,
  type CompetitorAssessment,
  type EvidenceClassification,
  type EvidenceRecord,
} from './marketRadar';

/**
 * Compare named competitors using only supplied, attributed observations.
 *
 * Ported faithfully (TypeScript) from TheOCGroup/OCG-ONE
 * src/intelligence/competitorComparison.js @ PR #20 (cee14d58d474).
 * No network calls, persistence, or generated traffic claims.
 * Extension: each result also carries the evidence classification
 * (accepted / unscored / rejected with reasons) for quality reporting.
 */
export interface CompetitorProfile {
  name: string;
  website?: string;
  evidence?: EvidenceRecord[];
}

export interface CompetitorComparison {
  name: string;
  website: string;
  assessment: CompetitorAssessment;
  latestObservedAt: string | null;
  /** Newest non-rejected evidence date (added reporting field). */
  latestEvidenceAt: string | null;
  /** Fully valid evidence (upstream behavior — these carry provenance). */
  evidence: EvidenceRecord[];
  /** Every supplied record with its quality verdict, in input order. */
  classifications: { record: EvidenceRecord; classification: EvidenceClassification }[];
  unscoredCount: number;
  requiresReview: boolean;
}

export function buildCompetitorComparison(profiles: CompetitorProfile[] = []): CompetitorComparison[] {
  if (!Array.isArray(profiles)) throw new TypeError('Profiles must be an array');
  const seen = new Set<string>();
  return profiles.map((profile) => {
    const name = typeof profile?.name === 'string' ? profile.name.trim() : '';
    const website = typeof profile?.website === 'string' ? profile.website.trim() : '';
    if (!name || seen.has(name.toLowerCase())) throw new Error('Each competitor needs a unique name');
    seen.add(name.toLowerCase());
    const evidence = Array.isArray(profile.evidence) ? profile.evidence : [];
    const assessment = scoreCompetitor(evidence);
    const accepted = evidence.filter(validateEvidence);
    const classifications = evidence.map((record) => ({
      record,
      classification: classifyEvidence(record),
    }));
    const unscoredCount = classifications.filter((c) => c.classification.verdict === 'unscored').length;
    // Upstream semantics preserved exactly: latestObservedAt reflects only
    // fully valid (scored) evidence. latestEvidenceAt is an added reporting
    // field covering every non-rejected record, scored or not.
    const latestObservedAt = accepted.length
      ? accepted.map((e) => e.retrievedAt).sort().at(-1) ?? null
      : null;
    const latestEvidenceAt = classifications.length
      ? classifications
          .filter((c) => c.classification.verdict !== 'rejected')
          .map((c) => c.record.retrievedAt)
          .sort()
          .at(-1) ?? null
      : null;
    return {
      name,
      website,
      assessment,
      latestObservedAt,
      latestEvidenceAt,
      evidence: accepted.map((e) => ({
        category: e.category,
        summary: e.summary,
        sourceUrl: e.sourceUrl,
        retrievedAt: e.retrievedAt,
        usageRights: e.usageRights,
        status: e.status,
        score: e.score,
      })),
      classifications,
      unscoredCount,
      requiresReview: assessment.coveragePercent < 100 || assessment.rejectedCount > 0,
    };
  });
}
