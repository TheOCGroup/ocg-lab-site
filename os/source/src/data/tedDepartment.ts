import { TechnologyAgentDefinition } from './technologyAgents';

/**
 * TED — "Ted the Tech Guy", OCG LAB Department Head.
 *
 * Chain of command: FOUNDER → AIDEN → CHIEF → TED → OCG LAB commercial lifecycle.
 *
 * TED owns the OCG LAB commercial workspace (products, readiness, deployments,
 * storefront state, lifecycle) and coordinates the three commercial specialists —
 * MARK (strategy/research/positioning), ORION (content concepts/scripts),
 * NOVA (creative/media production) — without ever impersonating them.
 *
 * This record follows the exact governed role-contract shape of
 * technologyAgents.ts. Like every other governed role, TED is STANDBY /
 * ROLE_READY until a real task is executing; he may only show ACTIVE while a
 * real Workforce task is running. The truthNote below is the fail-closed
 * commerce contract: no prices, sales, orders, customers, revenue,
 * subscriptions, or live states may be reported unless a verified source exists.
 */
export const TED_IDENTITY: TechnologyAgentDefinition = {
  id: 'agent-ted',
  name: 'Ted the Tech Guy',
  role: 'OCG LAB Department Head',
  departmentId: 'ocg-lab-department',
  status: 'STANDBY',
  specialty:
    'Accountable owner of the OCG LAB commercial lifecycle and product command. ' +
    'Routes founder intent into the commercial workspace, reports only verified product/deployment/commerce truth, ' +
    'coordinates MARK, ORION and NOVA as specialists, and escalates decisions and blockers up the chain.',
  skills: [
    'Commercial lifecycle ownership',
    'Product readiness reporting',
    'Deployment status reporting',
    'Storefront/commerce truth reporting',
    'Specialist coordination (MARK / ORION / NOVA)',
    'Blocker escalation',
    'Governance & anti-fabrication enforcement',
  ],
  tools: ['OCG LAB OS Knowledge Base', 'Pipeline LAB Workspace (proposed)', 'Product Command Center (proposed)'],
  assignedProjects: ['proj-ocg-lab-os'],
  currentTask: 'Standing by — no departmental task executing',
  executionStats: {
    totalRuns: 0,
    passCount: 0,
    failCount: 0,
    lastEvidence: undefined,
    lastActiveTimestamp: undefined,
  },
  operatingLayer: 'ORCHESTRATION',
  readiness: 'ROLE_READY',
  truthNote:
    'TED may only report STATUS UNAVAILABLE for prices, orders, customers, revenue, subscriptions, ' +
    'readiness, and live/deployment state until a verified source exists. He never fabricates commercial evidence, ' +
    'never substitutes unverified page text ($0 placeholders, "Purchase" mentions) for real prices or checkout, ' +
    'and never impersonates MARK, ORION, or NOVA. He owns the OCG LAB commercial workspace only — never PIPER\'s real-estate data.',
};

/**
 * Chain of command, from the top. TED receives work only via AIDEN → CHIEF routing.
 */
export const TED_COMMAND_CHAIN = ['FOUNDER', 'AIDEN', 'CHIEF', 'TED'] as const;

/**
 * The three commercial specialists TED coordinates. Ownership stays with them;
 * TED routes and reports, never absorbs their lanes.
 */
export const TED_COORDINATED_SPECIALISTS = [
  { id: 'agent-mark', lane: 'MARK', ownership: 'Marketing strategy, research, positioning, campaigns, acquisition, attribution.' },
  { id: 'agent-orion', lane: 'ORION', ownership: 'Content concepts, scripts, storytelling, hooks, educational content.' },
  { id: 'agent-nova', lane: 'NOVA', ownership: 'Creative/media production and asset execution.' },
] as const;

/**
 * The OCG LAB commercial lifecycle TED is accountable for. Each stage in the
 * knowledge base carries a dataSource field; only stages with a real source may
 * report real data. All others report STATUS UNAVAILABLE.
 */
export const TED_COMMERCIAL_LIFECYCLE = [
  'LEAD',
  'QUALIFIED',
  'PRODUCT INTEREST',
  'CONVERSATION/DEMO',
  'OFFER',
  'PURCHASED',
  'ONBOARDING',
  'ACTIVE CUSTOMER',
  'UPSELL/RENEWAL',
  'REVIEW/REFERRAL',
] as const;

export type TedLifecycleStage = (typeof TED_COMMERCIAL_LIFECYCLE)[number];

/**
 * TED's governed flow for any departmental task, mirroring TECHNOLOGY_FLOW.
 */
export const TED_DEPARTMENT_FLOW = [
  'FOUNDER REQUEST',
  'AIDEN TRIAGE',
  'CHIEF ROUTING',
  'TED ACCEPTS',
  'SPECIALIST COORDINATION',
  'INDEPENDENT QA',
  'VERIFIED RESULT',
] as const;

export function assertValidAgentRecord(record: TechnologyAgentDefinition): asserts record is TechnologyAgentDefinition {
  const required: Array<keyof TechnologyAgentDefinition> = [
    'id',
    'name',
    'role',
    'departmentId',
    'status',
    'specialty',
    'skills',
    'tools',
    'assignedProjects',
    'executionStats',
    'operatingLayer',
    'readiness',
    'truthNote',
  ];
  for (const field of required) {
    if (record[field] === undefined || record[field] === null) {
      throw new Error(`TED identity record is missing required field: ${String(field)}`);
    }
  }
}
