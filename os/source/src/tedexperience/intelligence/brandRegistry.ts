/**
 * OCG INTELLIGENCE — naming registry.
 *
 * Ported faithfully (TypeScript) from TheOCGroup/OCG-ONE
 * src/intelligence/brandRegistry.js @ docs/ocg-intelligence-brand-20261020
 * (PR #20, head cee14d58d474). User-facing labels only; internal agent/API
 * identifiers are unchanged. Read-only: no network, storage, or writes.
 */
export const intelligenceBrands = Object.freeze({
  platform: Object.freeze({ label: 'OCG INTELLIGENCE', description: 'Evidence-based market and business intelligence' }),
  competitor: Object.freeze({ label: 'OCG MARKET RADAR', description: 'Competitor analysis and opportunity research' }),
  signals: Object.freeze({ label: 'OCG SIGNAL', description: 'External evidence and signal normalization' }),
  monitoring: Object.freeze({ label: 'OCG WATCHTOWER', description: 'Competitor change monitoring' }),
  strategy: Object.freeze({ label: 'OCG STRATEGIST', description: 'Evidence-linked recommendations requiring approval' }),
});

export type IntelligenceBrandKey = keyof typeof intelligenceBrands;

export function getIntelligenceBrand(key: string) {
  return Object.hasOwn(intelligenceBrands, key)
    ? intelligenceBrands[key as IntelligenceBrandKey]
    : null;
}
