/**
 * ONCALL pricing comparison: transparent scenario arithmetic only.
 * Does not estimate customer-to-call ratios or infer feature parity.
 * Currency USD; all inputs explicitly supplied by analyst.
 *
 * Ported faithfully (TypeScript) from TheOCGroup/OCG-ONE
 * src/intelligence/receptionistPricing.js @ PR #20 (cee14d58d474).
 * Plan constants are the published-plan figures recorded in the
 * 2026-10-20 competitor baseline; they are illustrative, not a quote.
 */
function nonnegativeInteger(value: number, field: string): number {
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError(field + ' must be a nonnegative integer');
  return value;
}
function nonnegativeMoney(value: number, field: string): number {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(field + ' must be nonnegative');
  return value;
}
const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export interface ReceptionistPricingInput {
  calls: number;
  uniqueCustomers: number;
  smithPlan?: 'free' | 'pro' | 'enterprise';
  goodcallPlan?: 'starter' | 'growth' | 'scale';
}

export function compareReceptionistPricing({ calls, uniqueCustomers, smithPlan = 'pro', goodcallPlan = 'starter' }: ReceptionistPricingInput) {
  nonnegativeInteger(calls, 'calls');
  nonnegativeInteger(uniqueCustomers, 'uniqueCustomers');
  if (uniqueCustomers > calls) throw new RangeError('uniqueCustomers cannot exceed calls');
  const smith = {
    free: { base: 0, included: 25, overage: 3 },
    pro: { base: 150, included: 75, overage: 2.5 },
    enterprise: { base: 500, included: 300, overage: 2.17 },
  }[smithPlan];
  const goodcall = {
    starter: { base: 79, included: 100, overage: 0.79 },
    growth: { base: 129, included: 500, overage: 0.26 },
    scale: { base: 299, included: 2000, overage: 0.15 },
  }[goodcallPlan];
  if (!smith || !goodcall) throw new RangeError('Unknown published plan');
  // Constants are validated by construction; keep the upstream money checks
  // as a guard against future edits.
  nonnegativeMoney(smith.base, 'base');
  nonnegativeMoney(goodcall.base, 'base');
  return {
    scenario: { calls, uniqueCustomers },
    smith: { plan: smithPlan, estimate: round(smith.base + Math.max(0, calls - smith.included) * smith.overage), unit: 'calls' },
    goodcall: { plan: goodcallPlan, estimate: round(goodcall.base + Math.max(0, uniqueCustomers - goodcall.included) * goodcall.overage), unit: 'unique customers' },
    caveat: 'Illustrative published-plan arithmetic only; excludes taxes, add-ons, eligibility, discounts, and changed terms. Not a quote.',
    sources: [
      'https://smith.ai/pricing/ai-receptionist',
      'https://www.goodcall.com/pricing',
    ],
  };
}
