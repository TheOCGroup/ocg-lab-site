/**
 * Price publication gate: do not display a modeled price as verified unless
 * the plan's billing terms were independently reviewed and attributed.
 *
 * Ported faithfully (TypeScript) from TheOCGroup/OCG-ONE
 * src/intelligence/pricingEvidenceGate.js @ PR #20 (cee14d58d474).
 * This module performs no requests, scraping, or production writes.
 */
export type BillingUnit = 'per_call' | 'per_unique_customer' | 'per_minute' | 'flat';

export interface PricingEvidenceRecord {
  provider: string;
  plan: string;
  sourceUrl: string;
  verifiedAt: string;
  billingUnit: BillingUnit;
  basePrice: number;
  includedUnits: number;
  overagePrice: number;
  reviewed: boolean;
}

export interface PricingEvidenceReview {
  provider?: string;
  plan?: string;
  status: 'REVIEWED' | 'BLOCKED';
  issues: string[];
}

const BILLING_UNITS: readonly string[] = ['per_call', 'per_unique_customer', 'per_minute', 'flat'];
export const PRICING_EVIDENCE_MAX_AGE_DAYS = 30;

export function evaluatePricingEvidence(
  records: PricingEvidenceRecord[],
  asOf: string = new Date().toISOString(),
): PricingEvidenceReview[] {
  if (!Array.isArray(records)) throw new TypeError('Expected evidence records');
  const today = Date.parse(asOf);
  if (!Number.isFinite(today)) throw new TypeError('Invalid asOf date');
  return records.map((record) => {
    const issues: string[] = [];
    if (!record || typeof record !== 'object') return { status: 'BLOCKED', issues: ['Missing record'] };
    if (typeof record.provider !== 'string' || !record.provider.trim()) issues.push('Missing provider');
    if (typeof record.plan !== 'string' || !record.plan.trim()) issues.push('Missing plan');
    try {
      const url = new URL(record.sourceUrl);
      if (url.protocol !== 'https:') issues.push('Source must be HTTPS');
    } catch {
      issues.push('Invalid source URL');
    }
    const verifiedAt = Date.parse(record.verifiedAt);
    if (!Number.isFinite(verifiedAt) || verifiedAt > today) issues.push('Invalid verification date');
    else if (today - verifiedAt > PRICING_EVIDENCE_MAX_AGE_DAYS * 86400000) issues.push('Evidence older than 30 days');
    if (!BILLING_UNITS.includes(record.billingUnit)) issues.push('Unverified billing unit');
    for (const field of ['basePrice', 'includedUnits', 'overagePrice'] as const) {
      if (!Number.isFinite(record[field]) || record[field] < 0) issues.push('Invalid ' + field);
    }
    if (record.reviewed !== true) issues.push('Human verification pending');
    return { provider: record.provider, plan: record.plan, status: issues.length ? 'BLOCKED' : 'REVIEWED', issues };
  });
}
