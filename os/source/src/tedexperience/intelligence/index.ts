/**
 * OCG INTELLIGENCE — read-only Market Radar interface for TED.
 *
 * The logic in this folder is a faithful TypeScript port of the
 * reviewed prototype in TheOCGroup/OCG-ONE `src/intelligence/`
 * (PR #20, branch docs/ocg-intelligence-brand-20261020, head
 * cee14d58d474). It is the single intelligence implementation inside
 * TED — no second engine, no network access, no writes.
 */
export * from './brandRegistry';
export * from './marketRadar';
export * from './competitorComparison';
export * from './pricingEvidenceGate';
export * from './receptionistPricing';
export * from './reviewedPricingReport';
export * from './dashboardModel';
export * from './evidenceData';
