import { compareReceptionistPricing } from './receptionistPricing';
import { evaluatePricingEvidence, type PricingEvidenceRecord } from './pricingEvidenceGate';

/**
 * Fail-closed pricing report. Do not mark prices reviewed until the exact
 * source terms and modeled values match human-reviewed records.
 * Other plan combinations remain illustrative in the underlying calculator.
 *
 * Ported faithfully (TypeScript) from TheOCGroup/OCG-ONE
 * src/intelligence/reviewedPricingReport.js @ PR #20 (cee14d58d474).
 */
const REQUIRED = Object.freeze([
  { provider: 'Smith.ai', plan: 'pro', billingUnit: 'per_call', basePrice: 150, includedUnits: 75, overagePrice: 2.5 },
  { provider: 'Goodcall', plan: 'starter', billingUnit: 'per_unique_customer', basePrice: 79, includedUnits: 100, overagePrice: 0.79 },
] as const);

export interface ReviewedPricingInput {
  calls: number;
  uniqueCustomers: number;
  evidence?: PricingEvidenceRecord[];
  asOf?: string;
}

export function buildReviewedReceptionistPricing({ calls, uniqueCustomers, evidence = [], asOf }: ReviewedPricingInput) {
  const reviews = evaluatePricingEvidence(evidence, asOf);
  const findings = REQUIRED.map((expected) => {
    const candidates = evidence
      .map((record, index) => ({ record, review: reviews[index] }))
      .filter(({ record }) => record?.provider === expected.provider && record?.plan === expected.plan);
    const valid = candidates.find(
      ({ record, review }) =>
        review.status === 'REVIEWED' &&
        (['billingUnit', 'basePrice', 'includedUnits', 'overagePrice'] as const).every((key) => record[key] === expected[key]),
    );
    return {
      provider: expected.provider as string,
      plan: expected.plan as string,
      status: valid ? ('REVIEWED' as const) : ('BLOCKED' as const),
      issues: valid ? [] : ['Current reviewed evidence must match all modeled plan terms'],
    };
  });
  if (findings.some((item) => item.status !== 'REVIEWED')) {
    return { status: 'BLOCKED' as const, findings, comparison: null };
  }
  return {
    status: 'REVIEWED' as const,
    findings,
    comparison: compareReceptionistPricing({ calls, uniqueCustomers, smithPlan: 'pro', goodcallPlan: 'starter' }),
  };
}
