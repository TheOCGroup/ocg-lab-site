import type { CompetitorProfile } from './competitorComparison';
import type { PricingEvidenceRecord } from './pricingEvidenceGate';

/**
 * OCG MARKET RADAR — bundled evidence dataset (read-only).
 *
 * Every record is transcribed from the public-source baseline
 * docs/research/ONCALL_COMPETITOR_BASELINE_2026-10-20.md in
 * TheOCGroup/OCG-ONE (PR #20): vendor-reported claims observed on the
 * competitors' own official pages, researched 2026-10-20.
 *
 * Truth rules honored here:
 * - No 0–100 scores: the baseline states the scoring rubric is not yet
 *   defined and forbids inventing scores from marketing copy, so every
 *   record carries `score: null` (reported as UNSCORED, never as zero).
 * - No traffic, market-share, conversion, or performance figures: the
 *   baseline records none.
 * - Pricing candidates carry `reviewed: false`: the baseline research
 *   was not a human pricing review, so the fail-closed pricing gate
 *   correctly reports BLOCKED until a reviewer signs off.
 * - Recheck before commercial use (baseline instruction).
 */
export const EVIDENCE_RESEARCHED_AT = '2026-10-20';

const USAGE_RIGHTS = 'Public factual observation — vendor-reported claim; no independent performance verification.';

export const COMPETITOR_PROFILES: CompetitorProfile[] = [
  {
    name: 'Smith.ai',
    website: 'https://smith.ai',
    evidence: [
      {
        category: 'pricing',
        status: 'OBSERVED',
        sourceUrl: 'https://smith.ai/pricing/ai-receptionist',
        retrievedAt: '2026-10-20T00:00:00Z',
        summary:
          'Official pricing page: Free plan offers 25 live calls/month; Pro starts at $150/month; Enterprise starts at $500/month. Pricing unit is per call, with tier-specific allowances and overages.',
        usageRights: USAGE_RIGHTS,
        score: null,
      },
      {
        category: 'product',
        status: 'OBSERVED',
        sourceUrl: 'https://smith.ai/ai-receptionist',
        retrievedAt: '2026-10-20T00:00:00Z',
        summary:
          'Official capabilities page advertises AI answering, lead qualification, scheduling, CRM integrations, and optional human receptionist escalation.',
        usageRights: USAGE_RIGHTS,
        score: null,
      },
    ],
  },
  {
    name: 'Goodcall',
    website: 'https://www.goodcall.com',
    evidence: [
      {
        category: 'pricing',
        status: 'OBSERVED',
        sourceUrl: 'https://www.goodcall.com/faq',
        retrievedAt: '2026-10-20T00:00:00Z',
        summary:
          'Official FAQ: Starter $79/month for 100 unique customers; Growth $129/month for 500; Scale $299/month for 2,000. Pricing unit is unique customers, not minutes or total calls; overage terms vary by plan.',
        usageRights: USAGE_RIGHTS,
        score: null,
      },
      {
        category: 'product',
        status: 'OBSERVED',
        sourceUrl: 'https://www.goodcall.com/faq',
        retrievedAt: '2026-10-20T00:00:00Z',
        summary:
          'Official FAQ advertises Google Calendar, Google Sheets, and HighLevel integrations, with API tool / MCP configuration for other systems.',
        usageRights: USAGE_RIGHTS,
        score: null,
      },
    ],
  },
];

/**
 * Candidate pricing records for the fail-closed gate. Values match the
 * modeled plan terms in reviewedPricingReport.ts and the baseline's
 * observed figures. `verifiedAt` is the baseline observation date;
 * `reviewed` stays false — no human reviewer has signed these off, so
 * the gate must (and does) report BLOCKED.
 */
export const PRICING_EVIDENCE_CANDIDATES: PricingEvidenceRecord[] = [
  {
    provider: 'Smith.ai',
    plan: 'pro',
    sourceUrl: 'https://smith.ai/pricing/ai-receptionist',
    verifiedAt: '2026-10-20T00:00:00Z',
    billingUnit: 'per_call',
    basePrice: 150,
    includedUnits: 75,
    overagePrice: 2.5,
    reviewed: false,
  },
  {
    provider: 'Goodcall',
    plan: 'starter',
    sourceUrl: 'https://www.goodcall.com/faq',
    verifiedAt: '2026-10-20T00:00:00Z',
    billingUnit: 'per_unique_customer',
    basePrice: 79,
    includedUnits: 100,
    overagePrice: 0.79,
    reviewed: false,
  },
];

/** Default illustrative scenario (from the OCG-ONE offline QA preview). */
export const DEFAULT_PRICING_SCENARIO = Object.freeze({ calls: 100, uniqueCustomers: 90 });
