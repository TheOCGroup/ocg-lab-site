import { OperatingArea } from '../types';

export type AgentOperationSkillId =
  | 'SOURCE_OF_TRUTH'
  | 'RECOVER_CONTINUE'
  | 'VISUALIZE'
  | 'EXECUTIVE_BRIEF'
  | 'VERIFY'
  | 'ACT_VERIFY'
  | 'CHALLENGE'
  | 'MONEY_FIRST'
  | 'DEAL_UNDERWRITE'
  | 'PROPERTY_VISUALIZER'
  | 'CLIENT_RESPONSE'
  | 'FOLLOW_UP'
  | 'ETSY_LAUNCH'
  | 'PRODUCT_FACTORY'
  | 'CONTENT_FACTORY'
  | 'REPURPOSE'
  | 'DECISION_MEMO'
  | 'BUILD_DIRECTIVE';

export interface AgentOperationSkill {
  id: AgentOperationSkillId;
  name: string;
  purpose: string;
  operatingArea: OperatingArea;
  approvalPolicy: 'INTERNAL_AUTONOMOUS' | 'GOVERNED_EXTERNAL_ACTION';
  examples: string[];
  cues: string[];
}

export interface AgentOperationResolution {
  primary: AgentOperationSkill;
  skills: AgentOperationSkill[];
  confidence: 'HIGH' | 'MEDIUM';
  contextualizedFrom?: string;
}

export const AGENT_OPERATION_SKILLS: AgentOperationSkill[] = [
  { id: 'SOURCE_OF_TRUTH', name: 'SOURCE OF TRUTH', purpose: 'Recover canonical files, systems, provider state, and prior decisions before acting.', operatingArea: 'knowledge', approvalPolicy: 'INTERNAL_AUTONOMOUS', examples: ['Find the real one.', 'What is the source of truth?'], cues: ['find the real one', 'source of truth', 'real version', 'canonical'] },
  { id: 'RECOVER_CONTINUE', name: 'RECOVER & CONTINUE', purpose: 'Resume unfinished work from its verified stopping point instead of rebuilding.', operatingArea: 'projects', approvalPolicy: 'INTERNAL_AUTONOMOUS', examples: ['Pick up where we left off.', 'Finish it.'], cues: ['pick up where we left off', 'continue', 'finish it', 'finish this', 'resume'] },
  { id: 'VISUALIZE', name: 'VISUALIZE', purpose: 'Choose the clearest operating board, flow, timeline, comparison, chart, or status map.', operatingArea: 'command', approvalPolicy: 'INTERNAL_AUTONOMOUS', examples: ['Show me.', 'Map this out.'], cues: ['show me', 'visualize', 'map this', 'draw this', 'show the flow'] },
  { id: 'EXECUTIVE_BRIEF', name: 'EXECUTIVE BRIEF', purpose: 'Surface money, decisions, blockers, opportunities, deadlines, and next actions.', operatingArea: 'command', approvalPolicy: 'INTERNAL_AUTONOMOUS', examples: ['Where are we?', 'What matters right now?'], cues: ['where are we', 'brief me', 'what matters', 'status right now'] },
  { id: 'VERIFY', name: 'VERIFY', purpose: 'Independently test claims, deployment, data, functionality, and completion before success is asserted.', operatingArea: 'qa', approvalPolicy: 'INTERNAL_AUTONOMOUS', examples: ['Check this.', 'Verify this.'], cues: ['check this', 'verify this', 'is this real', 'prove it'] },
  { id: 'ACT_VERIFY', name: 'ACT & VERIFY', purpose: 'Carry an authorized objective through governed tools, verify the result, and persist work state.', operatingArea: 'operations', approvalPolicy: 'GOVERNED_EXTERNAL_ACTION', examples: ['Do it.', 'Get it done.'], cues: ['do it', 'get it done', 'execute it', 'handle it'] },
  { id: 'CHALLENGE', name: 'CHALLENGE / RED TEAM', purpose: 'Pressure-test the current approach and recommend KEEP, MODIFY, or REPLACE.', operatingArea: 'rd', approvalPolicy: 'INTERNAL_AUTONOMOUS', examples: ['Should we do this?', 'Challenge this plan.'], cues: ['challenge this', 'red team', 'should we do this', 'pressure test'] },
  { id: 'MONEY_FIRST', name: 'MONEY FIRST', purpose: 'Rank the nearest evidence-backed path to revenue before lower-leverage work.', operatingArea: 'storefronts', approvalPolicy: 'INTERNAL_AUTONOMOUS', examples: ['What makes us money fastest?', 'What can we sell next?'], cues: ['money fastest', 'make money fastest', 'sell next', 'closest to revenue', 'revenue first'] },
  { id: 'DEAL_UNDERWRITE', name: 'DEAL UNDERWRITE', purpose: 'Route property analysis through deterministic underwriting and risk checks.', operatingArea: 'operations', approvalPolicy: 'INTERNAL_AUTONOMOUS', examples: ['Analyze this property.', 'Underwrite this deal.'], cues: ['analyze this property', 'underwrite this deal', 'analyze the deal'] },
  { id: 'PROPERTY_VISUALIZER', name: 'PROPERTY VISUALIZER', purpose: 'Present a deal as a clear property/deal board.', operatingArea: 'operations', approvalPolicy: 'INTERNAL_AUTONOMOUS', examples: ['Show me the deal.'], cues: ['show me the deal', 'visualize the property'] },
  { id: 'CLIENT_RESPONSE', name: 'CLIENT RESPONSE', purpose: 'Draft a context-aware client response and route specialist review where needed.', operatingArea: 'client-solutions', approvalPolicy: 'GOVERNED_EXTERNAL_ACTION', examples: ['Handle this client text.'], cues: ['handle this client text', 'reply to this client', 'respond to this client'] },
  { id: 'FOLLOW_UP', name: 'FOLLOW-UP', purpose: 'Identify pending people, approvals, dependencies, and next contact actions.', operatingArea: 'operations', approvalPolicy: 'GOVERNED_EXTERNAL_ACTION', examples: ['Who are we waiting on?'], cues: ['who are we waiting on', 'follow up', 'who needs a follow up'] },
  { id: 'ETSY_LAUNCH', name: 'ETSY LAUNCH', purpose: 'Prepare or verify the nearest Etsy listing gate without duplicating provider-backed products.', operatingArea: 'storefronts', approvalPolicy: 'GOVERNED_EXTERNAL_ACTION', examples: ['Get this listed.'], cues: ['get this listed', 'list this on etsy', 'etsy launch'] },
  { id: 'PRODUCT_FACTORY', name: 'PRODUCT FACTORY', purpose: 'Route an approved product through source-of-truth, build, QA, package, and commercialization gates.', operatingArea: 'product-studio', approvalPolicy: 'INTERNAL_AUTONOMOUS', examples: ['Build the next product.'], cues: ['build the next product', 'product factory', 'make the next product'] },
  { id: 'CONTENT_FACTORY', name: 'CONTENT FACTORY', purpose: 'Route an approved content objective through creation, QA, and distribution preparation.', operatingArea: 'operations', approvalPolicy: 'INTERNAL_AUTONOMOUS', examples: ["Make today's video."], cues: ["make today's video", 'make the video', 'content factory'] },
  { id: 'REPURPOSE', name: 'REPURPOSE', purpose: 'Adapt an existing approved asset into channel-specific derivatives without changing source truth.', operatingArea: 'operations', approvalPolicy: 'INTERNAL_AUTONOMOUS', examples: ['Repurpose this.'], cues: ['repurpose this', 'reuse this content'] },
  { id: 'DECISION_MEMO', name: 'DECISION MEMO', purpose: 'Produce an evidence-backed decision with options, tradeoffs, risks, and recommendation.', operatingArea: 'command', approvalPolicy: 'INTERNAL_AUTONOMOUS', examples: ['Should we do this?'], cues: ['decision memo', 'decide whether', 'should we do this'] },
  { id: 'BUILD_DIRECTIVE', name: 'BUILD DIRECTIVE', purpose: 'Translate the verified objective into a constrained implementation directive for the build workforce.', operatingArea: 'engineering', approvalPolicy: 'INTERNAL_AUTONOMOUS', examples: ['Send this to Codex.'], cues: ['send this to codex', 'build directive', 'hand this to codex'] }
];

const byId = (id: AgentOperationSkillId) => AGENT_OPERATION_SKILLS.find(skill => skill.id === id)!;

const compositions: Array<{ cues: string[]; ids: AgentOperationSkillId[] }> = [
  { cues: ['where are we'], ids: ['SOURCE_OF_TRUTH', 'EXECUTIVE_BRIEF', 'VISUALIZE'] },
  { cues: ['finish it', 'finish this', 'get it done'], ids: ['RECOVER_CONTINUE', 'ACT_VERIFY', 'VERIFY'] },
  { cues: ['show me the deal'], ids: ['DEAL_UNDERWRITE', 'PROPERTY_VISUALIZER', 'VISUALIZE'] },
  { cues: ['should we do this'], ids: ['CHALLENGE', 'DECISION_MEMO'] },
  { cues: ['get this listed'], ids: ['SOURCE_OF_TRUTH', 'ETSY_LAUNCH', 'VERIFY'] },
  { cues: ['build the next product'], ids: ['SOURCE_OF_TRUTH', 'PRODUCT_FACTORY', 'VERIFY'] }
];

const normalized = (value: string) => value.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();

export function resolveAgentOperationsIntent(query: string, recentFounderQueries: string[] = []): AgentOperationResolution | null {
  const q = normalized(query);
  const recent = [...recentFounderQueries].reverse().map(normalized).find(item => item && item !== q);
  const contextDependent = ['show me', 'do it', 'finish it', 'get it done', 'check this', 'verify this', 'repurpose this'];
  const effective = contextDependent.some(cue => q === cue || q.startsWith(cue)) && recent ? `${recent} ${q}` : q;

  for (const composition of compositions) {
    if (composition.cues.some(cue => effective.includes(cue))) {
      return { primary: byId(composition.ids[0]), skills: composition.ids.map(byId), confidence: 'HIGH', contextualizedFrom: recent && effective !== q ? recent : undefined };
    }
  }

  const scored = AGENT_OPERATION_SKILLS
    .map(skill => ({ skill, score: skill.cues.reduce((score, cue) => score + (effective.includes(cue) ? Math.max(1, cue.split(' ').length) : 0), 0) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return null;
  const best = scored[0];
  return { primary: best.skill, skills: [best.skill], confidence: best.score >= 2 ? 'HIGH' : 'MEDIUM', contextualizedFrom: recent && effective !== q ? recent : undefined };
}
