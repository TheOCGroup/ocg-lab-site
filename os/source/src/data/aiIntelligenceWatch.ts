export type IntelligenceConfidence = 'OFFICIAL_CONFIRMED' | 'CREDIBLE_REPORTING' | 'UNVERIFIED_SPECULATIVE';
export type IntelligenceAction = 'IGNORE' | 'WATCH' | 'RESEARCH' | 'TEST' | 'ADD_TO_BACKLOG' | 'INTEGRATE_NOW';
export type IntelligenceUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'IMMEDIATE';

export interface IntelligenceWatchContract {
  owner: 'Archer';
  routedBy: 'Aiden';
  cadence: 'EVERY_OTHER_MORNING';
  workflow: string[];
  sourcePriority: string[];
  founderBriefFields: string[];
  duplicatePolicy: string;
  escalationRule: string;
  contentSplit: string[];
  noSignalRule: string;
}

export const ARCHER_INTELLIGENCE_WATCH: IntelligenceWatchContract = {
  owner: 'Archer',
  routedBy: 'Aiden',
  cadence: 'EVERY_OTHER_MORNING',
  workflow: ['DISCOVER', 'RANK', 'WATCH/READ', 'EXTRACT', 'VERIFY', 'COMPARE TO OCG', 'GAP ANALYSIS', 'RECOMMEND', 'ROUTE', 'ARCHIVE', 'UPDATE STATE'],
  sourcePriority: [
    'Primary company announcements and release notes',
    'Primary technical/research publications',
    'GitHub/release activity where materially relevant',
    'High-signal interviews and podcasts',
    'Credible AI/business reporting',
  ],
  founderBriefFields: ['WHAT HAPPENED', 'WHY WE CARE', 'WE ALREADY HAVE IT?', 'OPPORTUNITY / GAP', 'ACTION', 'OWNER', 'URGENCY', 'CONFIDENCE', 'SOURCE / PROVENANCE'],
  duplicatePolicy: 'Compare every material finding against canonical OCG architecture and active work before creating a new requirement. Already covered means do not duplicate.',
  escalationRule: 'Escalate immediately only when a verified development can materially affect an active build, security/safety, model/tool availability, revenue opportunity, or a time-sensitive competitive move.',
  contentSplit: ['ARCHER / OCG LAB — build, buy, test, integrate, stop, or accelerate', 'MARK / OCG MEDIA — timely content, newsletter, story, product-positioning, or audience opportunity'],
  noSignalRule: 'If nothing material changed, report no material change instead of manufacturing a brief.',
};

export const ARCHER_FRESH_SOURCE_REQUIREMENT = 'Fresh public-source execution is required for a current intelligence brief. Persisted OS metadata alone cannot prove a current development.';
