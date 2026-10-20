/**
 * OCG INTELLIGENCE — OCG LAB product handoff.
 * Read-only product inventory metadata, deliberately not a published catalog
 * entry, live integration, or second TED experience.
 */
export const INTELLIGENCE_PRODUCT = Object.freeze({
  id: 'ocg-intelligence',
  title: 'OCG INTELLIGENCE',
  subtitle: 'Competitor intelligence and market research for OCG LAB',
  status: 'BUILDING',
  whatIsIt: 'Evidence-based competitor research, with Market Radar in isolated development.',
  whatsNext: 'Review Market Radar preview and complete TED integration QA.',
  sourceRepository: 'TheOCGroup/OCG-ONE',
  sourceBranch: 'docs/ocg-intelligence-brand-20261020',
  pullRequest: 'https://github.com/TheOCGroup/OCG-ONE/pull/20',
  modules: [
    { id: 'market-radar', label: 'Market Radar', status: 'PREVIEW' },
    { id: 'signal', label: 'Signal', status: 'PLANNED' },
    { id: 'watchtower', label: 'Watchtower', status: 'PLANNED' },
    { id: 'strategist', label: 'Strategist', status: 'PLANNED' }
  ]
});
