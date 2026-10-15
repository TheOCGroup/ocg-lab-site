import { StorageEngine } from '../data/storageEngine';

/** Founder-reported discovery briefing with recorded project actions. */
export function lotusDiscoveryBrief(): string {
  const actions = StorageEngine.getProjectActions('lotus-insight');
  const actionLines = actions.length ? actions.map(a => `- [${a.status}] ${a.title} (${a.owner})`) : ['No project actions recorded yet.'];
  return [
    '**Lotus Insight — Discovery briefing**',
    '',
    'Based on founder-reported context: Al is the client contact, the contract was reported signed, and a $1,250 payment was reported received October 11, 2026. These details have not been independently reconciled with accounting or signed documents.',
    '',
    '**What to do next:**',
    '1. Attach the signed scope, contract, and payment confirmation to the client project record.',
    '2. Hold a discovery meeting with Al: goals, users, current processes, tools, problems, and access restrictions.',
    '3. Document and approve discovery deliverables, success metrics, dependencies, and the four-phase implementation roadmap.',
    '4. Prepare a prioritized solution brief with integrations, security requirements, timeline, and decisions required from Al.',
    '',
    '**Recorded project actions:**',
    ...actionLines,
    '',
    '**Connection status:** STATUS UNAVAILABLE — these items are not synchronized from a live CRM or project database. No task is claimed completed.',
  ].join('\n');
}
