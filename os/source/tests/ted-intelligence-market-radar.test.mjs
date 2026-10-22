/**
 * OCG INTELLIGENCE — Market Radar logic parity + truth tests.
 *
 * The assertions in the "upstream parity" sections replicate, one for
 * one, the test suites of TheOCGroup/OCG-ONE src/intelligence/
 * (PR #20: market-radar, competitor-comparison, pricing-evidence-gate,
 * receptionist-pricing, reviewed-pricing-report, intelligence-dashboard)
 * against the TypeScript port in src/tedexperience/intelligence/.
 * The "bundled dataset" section guards the truth contract: no invented
 * scores, no unreviewed pricing presented as verified.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { validateEvidence, scoreCompetitor, classifyEvidence, isSafeExternalUrl } from '../src/tedexperience/intelligence/marketRadar.ts';
import { buildCompetitorComparison } from '../src/tedexperience/intelligence/competitorComparison.ts';
import { evaluatePricingEvidence } from '../src/tedexperience/intelligence/pricingEvidenceGate.ts';
import { compareReceptionistPricing } from '../src/tedexperience/intelligence/receptionistPricing.ts';
import { buildReviewedReceptionistPricing } from '../src/tedexperience/intelligence/reviewedPricingReport.ts';
import { buildIntelligenceDashboard } from '../src/tedexperience/intelligence/dashboardModel.ts';
import { getIntelligenceBrand } from '../src/tedexperience/intelligence/brandRegistry.ts';
import {
  COMPETITOR_PROFILES,
  PRICING_EVIDENCE_CANDIDATES,
} from '../src/tedexperience/intelligence/evidenceData.ts';

const evidence = (overrides = {}) => ({
  category: 'pricing', status: 'OBSERVED', sourceUrl: 'https://example.org/pricing',
  retrievedAt: '2026-10-20T12:00:00Z', summary: 'Public pricing observed',
  usageRights: 'Public factual observation', score: 80, ...overrides,
});

// --- Upstream: market-radar.test.mjs -------------------------------------

test('rejects unsupported or unsourced assertions', () => {
  assert.equal(validateEvidence(evidence({ sourceUrl: 'file:///etc/passwd' })), false);
  assert.equal(validateEvidence(evidence({ score: 110 })), false);
  assert.equal(validateEvidence(evidence({ retrievedAt: 'invalid' })), false);
  assert.equal(validateEvidence(evidence({ usageRights: '' })), false);
});

test('partial coverage is explicit and missing categories are not zero', () => {
  const result = scoreCompetitor([evidence()]);
  assert.equal(result.score, 80);
  assert.equal(result.coveragePercent, 20);
  assert.equal(result.label, 'PARTIAL_COVERAGE');
  assert.equal(result.categories.product, null);
});

test('third party estimates and inference are excluded from observed scoring', () => {
  const result = scoreCompetitor([evidence({ status: 'INFERENCE', score: 100 })]);
  assert.equal(result.score, null);
  assert.equal(result.evidenceCount, 1);
});

test('invalid evidence is counted and excluded', () => {
  const result = scoreCompetitor([evidence(), evidence({ sourceUrl: 'javascript:alert(1)' })]);
  assert.equal(result.evidenceCount, 1);
  assert.equal(result.rejectedCount, 1);
});

test('empty evidence produces unknown score', () => {
  assert.equal(scoreCompetitor([]).score, null);
});

// --- Upstream: competitor-comparison.test.mjs ----------------------------

const compEvidence = { category: 'product', status: 'OBSERVED', sourceUrl: 'https://example.org/features', retrievedAt: '2026-10-20T12:00:00Z', summary: 'Feature page', usageRights: 'Public factual observation', score: 75 };

test('builds a read-only comparison with source provenance', () => {
  const [a, b] = buildCompetitorComparison([
    { name: 'Example A', website: 'https://example.org', evidence: [compEvidence] },
    { name: 'Example B', website: 'https://example.net', evidence: [] },
  ]);
  assert.equal(a.assessment.score, 75);
  assert.equal(a.evidence[0].sourceUrl, compEvidence.sourceUrl);
  assert.equal(a.requiresReview, true);
  assert.equal(b.assessment.score, null);
  assert.equal(b.latestObservedAt, null);
});

test('rejects duplicate names rather than silently merging competitors', () => {
  assert.throws(() => buildCompetitorComparison([{ name: 'Example A' }, { name: 'example a' }]));
});

test('drops invalid source records and flags review', () => {
  const [item] = buildCompetitorComparison([{ name: 'Example', evidence: [{ ...compEvidence, sourceUrl: 'javascript:alert(1)' }] }]);
  assert.equal(item.evidence.length, 0);
  assert.equal(item.assessment.rejectedCount, 1);
  assert.equal(item.requiresReview, true);
});

// --- Port extension: classification ---------------------------------------

test('structurally valid but unscored evidence is UNSCORED, never zero', () => {
  const c = classifyEvidence(evidence({ score: null }));
  assert.equal(c.verdict, 'unscored');
  const result = scoreCompetitor([evidence({ score: null })]);
  assert.equal(result.score, null);
  assert.equal(result.evidenceCount, 0);
  assert.equal(result.rejectedCount, 1); // upstream counting: unscored cannot score
});

test('out-of-range score is rejected, not unscored', () => {
  assert.equal(classifyEvidence(evidence({ score: 140 })).verdict, 'rejected');
  assert.equal(classifyEvidence(evidence()).verdict, 'accepted');
  assert.equal(classifyEvidence(evidence({ sourceUrl: 'javascript:x' })).verdict, 'rejected');
});

// --- Upstream: pricing gates ----------------------------------------------

const reviewedRecord = (overrides = {}) => ({
  provider: 'Smith.ai', plan: 'pro', sourceUrl: 'https://smith.ai/pricing/ai-receptionist',
  verifiedAt: '2026-10-20T00:00:00Z', billingUnit: 'per_call', basePrice: 150,
  includedUnits: 75, overagePrice: 2.5, reviewed: true, ...overrides,
});

test('pricing gate passes only fresh, https, human-reviewed records', () => {
  const [ok] = evaluatePricingEvidence([reviewedRecord()], '2026-10-21T00:00:00Z');
  assert.equal(ok.status, 'REVIEWED');
  const [pending] = evaluatePricingEvidence([reviewedRecord({ reviewed: false })], '2026-10-21T00:00:00Z');
  assert.equal(pending.status, 'BLOCKED');
  assert.ok(pending.issues.includes('Human verification pending'));
  const [stale] = evaluatePricingEvidence([reviewedRecord()], '2026-12-01T00:00:00Z');
  assert.equal(stale.status, 'BLOCKED');
  assert.ok(stale.issues.some((i) => i.includes('30 days')));
  const [http] = evaluatePricingEvidence([reviewedRecord({ sourceUrl: 'http://smith.ai/pricing' })], '2026-10-21T00:00:00Z');
  assert.equal(http.status, 'BLOCKED');
});

test('reviewed pricing report is fail-closed without matching reviewed evidence', () => {
  const blocked = buildReviewedReceptionistPricing({ calls: 100, uniqueCustomers: 90, evidence: [], asOf: '2026-10-21T00:00:00Z' });
  assert.equal(blocked.status, 'BLOCKED');
  assert.equal(blocked.comparison, null);
  const goodcall = { provider: 'Goodcall', plan: 'starter', sourceUrl: 'https://www.goodcall.com/faq', verifiedAt: '2026-10-20T00:00:00Z', billingUnit: 'per_unique_customer', basePrice: 79, includedUnits: 100, overagePrice: 0.79, reviewed: true };
  const reviewed = buildReviewedReceptionistPricing({ calls: 100, uniqueCustomers: 90, evidence: [reviewedRecord(), goodcall], asOf: '2026-10-21T00:00:00Z' });
  assert.equal(reviewed.status, 'REVIEWED');
  assert.equal(reviewed.comparison.smith.estimate, 212.5);
  assert.equal(reviewed.comparison.goodcall.estimate, 79);
});

test('receptionist pricing arithmetic matches published-plan constants', () => {
  const r = compareReceptionistPricing({ calls: 100, uniqueCustomers: 90 });
  assert.equal(r.smith.estimate, 212.5);
  assert.equal(r.goodcall.estimate, 79);
  assert.match(r.caveat, /Not a quote/);
  assert.throws(() => compareReceptionistPricing({ calls: 10, uniqueCustomers: 11 }), /cannot exceed/);
});

// --- Upstream: dashboard model + brand registry ----------------------------

test('dashboard model is read-only and surfaces evidence alerts', () => {
  const dash = buildIntelligenceDashboard({ profiles: [{ name: 'Example', evidence: [] }] });
  assert.equal(dash.product, 'OCG INTELLIGENCE');
  assert.equal(dash.module, 'OCG MARKET RADAR');
  assert.equal(dash.readOnly, true);
  assert.equal(dash.alerts.length, 1);
  assert.equal(dash.alerts[0].type, 'EVIDENCE_REVIEW');
});

test('brand registry keeps user-facing names without renaming internals', () => {
  assert.equal(getIntelligenceBrand('platform').label, 'OCG INTELLIGENCE');
  assert.equal(getIntelligenceBrand('competitor').label, 'OCG MARKET RADAR');
  assert.equal(getIntelligenceBrand('nope'), null);
});

// --- Bundled dataset truth contract ----------------------------------------

test('bundled evidence is source-backed, dated, and never scored', () => {
  assert.equal(COMPETITOR_PROFILES.length, 2);
  for (const profile of COMPETITOR_PROFILES) {
    assert.ok(profile.evidence.length >= 2, profile.name);
    for (const record of profile.evidence) {
      assert.equal(record.score, null, 'scores must not be invented before a rubric exists');
      assert.equal(record.status, 'OBSERVED');
      assert.ok(record.sourceUrl.startsWith('https://'), record.sourceUrl);
      assert.equal(record.retrievedAt.slice(0, 10), '2026-10-20');
      assert.ok(record.usageRights.includes('vendor-reported'));
      assert.equal(classifyEvidence(record).verdict, 'unscored');
    }
  }
});

test('bundled dashboard: comparison present, scores null, pricing BLOCKED', () => {
  const dash = buildIntelligenceDashboard({
    profiles: COMPETITOR_PROFILES,
    pricingScenario: { calls: 100, uniqueCustomers: 90 },
    pricingEvidence: PRICING_EVIDENCE_CANDIDATES,
    asOf: '2026-10-21T00:00:00Z',
  });
  assert.deepEqual(dash.competitors.map((c) => c.name), ['Smith.ai', 'Goodcall']);
  for (const c of dash.competitors) {
    assert.equal(c.assessment.score, null);
    assert.equal(c.latestEvidenceAt?.slice(0, 10), '2026-10-20');
    assert.equal(c.unscoredCount, 2);
    assert.equal(c.requiresReview, true);
  }
  assert.equal(dash.pricing.status, 'BLOCKED');
  assert.equal(dash.pricing.comparison, null);
  assert.equal(dash.quality.totalRecords, 4);
  assert.equal(dash.quality.accepted, 0);
  assert.equal(dash.quality.unscored, 4);
  assert.equal(dash.quality.rejected, 0);
  assert.equal(dash.quality.scoringState, 'NOT_SCORED');
});

test('pricing candidates are never marked reviewed', () => {
  for (const r of PRICING_EVIDENCE_CANDIDATES) assert.equal(r.reviewed, false);
  const reviews = evaluatePricingEvidence(PRICING_EVIDENCE_CANDIDATES, '2026-10-21T00:00:00Z');
  assert.ok(reviews.every((r) => r.status === 'BLOCKED'));
});

test('render-layer allowlist withholds unsafe URLs (QA U2)', () => {
  assert.equal(isSafeExternalUrl('https://smith.ai/pricing'), true);
  assert.equal(isSafeExternalUrl('http://example.org/x'), true);
  assert.equal(isSafeExternalUrl('javascript:alert(1)'), false);
  assert.equal(isSafeExternalUrl('data:text/html,<script>1</script>'), false);
  assert.equal(isSafeExternalUrl(''), false);
  assert.equal(isSafeExternalUrl(undefined), false);
});
