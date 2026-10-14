/**
 * TED conversational persona — the experience layer's brain.
 *
 * ARCHITECTURE: this module is the EXPERIENCE layer. It never replaces the
 * intelligence/governance layer in src/ted/tedQueryHandlers.ts. Every founder
 * message is first offered to handleTedQuery(); only when the intelligence
 * layer has no governed answer does the persona respond conversationally.
 *
 * TRUTH CONTRACT (same as the intelligence layer):
 * - OCG LAB facts (products, revenue, customers, orders, deployments, prices)
 *   come only from recorded data. Everything else is STATUS UNAVAILABLE.
 * - TED never claims an action completed without evidence.
 * - TED never impersonates MARK, ORION, or NOVA.
 * - General technology reasoning is offered as guidance, never as recorded
 *   OCG LAB fact.
 */
import { handleTedQuery } from '../ted/tedQueryHandlers';
import { lotusDiscoveryBrief } from './lotusDiscovery';
import {
  SPECIALIST_AGENTS,
  TedOperation,
  TedWorkspaceContext,
  detectWorkspaceContext,
  getCommerceTruth,
  getCustomerTruth,
  getDeploymentTruth,
  getWorkspaceProjects,
} from './tedWorkspace';
// PHASE 2 — super-agent capability modules. Experience layer only: no live
// integrations are claimed; research and tools fail closed when unconnected.
import { classifyIntent, toolForMessage } from './tedRouter';
import { getAvailableResearchProvider, researchUnavailableReply } from './tedResearch';
import { requestExecution } from './tedTools';
import { technicalGuidanceReply } from './tedSuperAgent';
import { etsyAccountActionReply, etsyGuidanceReply, isEtsyStructuralQuestion } from './tedEtsy';
import { formatKnowledgeBrief, getInternalKnowledgeBrief } from './tedKnowledge';
// PHASE 2.2 — build execution behavior: active build tracking across turns.
import {
  BuildContext,
  advanceBuild,
  buildStatusLine,
  startBuild,
  wantsBuildPlan,
} from './tedBuild';
import { getProductMemoryWithOverlay } from './productMemory';

/** A Tool Bridge operation for the page to execute asynchronously. */
export interface TedBridgeOp {
  kind: 'inspect' | 'read' | 'test' | 'build' | 'edit-propose' | 'edit-confirm';
  path?: string;
  oldText?: string;
  newText?: string;
  confirmationId?: string;
  /** Founder-facing description of what TED is about to do. */
  label: string;
}

export interface TedPendingEdit {
  confirmationId: string;
  path: string;
  diffPreview: string;
}

export type TedArtifactKind = 'projects' | 'products' | 'project' | 'product';

export interface TedPersonaResult {
  reply: string;
  context: TedWorkspaceContext | null;
  operation: TedOperation | null;
  agentHandoff: 'MARK' | 'ORION' | 'NOVA' | null;
  /** Set when the reply produced something worth inspecting beside the chat. Null = chat only. */
  artifact: TedArtifactKind | null;
  /** 'last' = speak the most recent TED reply aloud via the voice controller. */
  speak: 'last' | null;
  /** Set when live research should run for this turn (a provider is connected). */
  researchQuery: string | null;
  /** Set when a Tool Bridge operation should run for this turn. */
  bridgeOp: TedBridgeOp | null;
  /** Updated build tracking. Absent = no change; null = cleared. */
  build?: BuildContext | null;
  /** Updated pending edit. Absent = no change; null = cleared. */
  pendingEdit?: TedPendingEdit | null;
}

export interface TedPersonaOptions {
  /** True when the browser actually supports voice input. From runtime feature detection. */
  voiceSupported?: boolean;
  /** True when the Tool Bridge handshake succeeded (real local execution). */
  bridgeConnected?: boolean;
}

export interface TedPersonaState {
  context: TedWorkspaceContext;
  recentQueries: string[];
  operation: TedOperation | null;
  ideaDraft: string | null;
  /** Active build being tracked across turns (null = no active build). */
  build: BuildContext | null;
  /** Edit proposed via the bridge, awaiting founder confirmation. */
  pendingEdit: TedPendingEdit | null;
  /** Active product context from "Continue with TED" (null = none). */
  activeProductId: string | null;
}

export const initialPersonaState = (): TedPersonaState => ({
  context: { kind: 'none' },
  recentQueries: [],
  operation: null,
  ideaDraft: null,
  build: null,
  pendingEdit: null,
  activeProductId: null,
});

const normalized = (value: string): string =>
  value.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();

/** The governed layer owns product-status replies; surface them as an inspectable artifact. */
function looksLikePortfolioRequest(q: string): boolean {
  return (
    q.includes('product status') ||
    q.includes('what products') ||
    q.includes('how many products') ||
    q.includes('products ready') ||
    q.includes('unfinished products') ||
    q.includes('show me the products') ||
    q.includes('product portfolio') ||
    q.includes('products are live')
  );
}

const GREETING =
  `Hey — Ted here. I'm OCG LAB's technology intelligence: I keep the full picture of our products, builds, and deployments in my head, and I can reason through anything technical with you.\n\n` +
  `Just talk to me like you'd talk to a person. Try:\n\n` +
  `• "Ted, I have an idea."\n` +
  `• "What are we building right now?"\n` +
  `• "Pull up the Fix & Flip Calculator."\n` +
  `• "What model should we use for this?"\n\n` +
  `One honest note up front: where I don't have a verified source, I'll tell you it's STATUS UNAVAILABLE instead of guessing. That's a feature, not a bug.`;

function isGreeting(q: string): boolean {
  return /^(hey|hi|hello|yo|good (morning|afternoon|evening)|what's up|whats up|howdy|ted[,.]? (you there|are you there))/.test(q) || q === 'ted';
}

/** Voice/text continuity: a mid-idea question about a different domain
 *  ("Wait — what about Etsy?") is a NEW question, not more idea input.
 *  The idea draft is preserved; the turn routes normally. */
const DOMAIN_KEYWORDS = [
  'etsy', 'shopify', 'whop', 'stripe', 'api', 'database', 'postgres', 'supabase',
  'deploy', 'netlify', 'vercel', 'render', 'oauth', 'webhook', 'docker', 'kubernetes',
];
function isNewDomainQuestion(q: string): boolean {
  const hasQuestionShape =
    /^(what|how|why|when|where|which|can|could|should|do|does|is|are|will|would)\b/.test(q)
    || q.includes('?')
    || q.includes('what about');
  return hasQuestionShape && DOMAIN_KEYWORDS.some((k) => q.includes(k));
}

function isIdeaOpener(q: string): boolean {
  return q.includes('i have an idea') || q.includes("i've got an idea") || q.includes('hear me out') || q.includes('new idea')
    || q.includes('i want to build') || q.includes('i want to create');
}

function isStatusSweep(q: string): boolean {
  return (
    q.includes('what are we building') ||
    q.includes('what are we working on') ||
    q.includes('state of ocg lab') ||
    q.includes('what still needs work') ||
    q.includes('what needs work') ||
    q.includes('what is blocked') ||
    q.includes("what's blocked")
  );
}

function isModelQuestion(q: string): boolean {
  return q.includes('model should we use') || q.includes('which model') || q.includes('what model') || q.includes('ai model');
}

function isResearchRequest(q: string): boolean {
  return q.includes('research') && (q.includes('this') || q.includes('new'));
}

function isBuildRequest(q: string): boolean {
  return (
    q.includes('build me') ||
    q.includes('build a prototype') ||
    q.includes('fix this') ||
    q.includes('what broke') ||
    q.includes('finish the')
  );
}

function isVoiceQuestion(q: string): boolean {
  return q.includes('voice') && (q.includes('talk') || q.includes('speak') || q.includes('microphone') || q.includes('available'));
}

function projectStatusSweep(): string {
  const projects = getWorkspaceProjects().filter((p) => !p.name.toLowerCase().includes('bench') || true);
  const active = projects.filter((p) => ['BUILDING', 'TESTING', 'PREVIEW'].includes(p.status));
  const blocked = projects.filter((p) => ['BLOCKED', 'QA FAILED'].includes(p.status));
  const lines: string[] = [];
  if (active.length) {
    lines.push(`**In motion right now:**`);
    for (const p of active.slice(0, 5)) {
      lines.push(`• **${p.name}** — ${p.status}, ${p.phase} (${p.completionPercent}% complete)`);
      if (p.nextAction && p.nextAction !== 'STATUS UNAVAILABLE') lines.push(`  Next: ${p.nextAction}`);
    }
  }
  if (blocked.length) {
    lines.push(`\n**Blocked / needs attention:**`);
    for (const p of blocked.slice(0, 5)) {
      const blocker = p.blockers.length ? p.blockers.join('; ') : 'recorded as blocked, no blocker detail on file';
      lines.push(`• **${p.name}** — ${blocker}`);
    }
  }
  if (!lines.length) {
    return `Nothing in the recorded registry is currently marked building, testing, or blocked. If you expected motion somewhere, point me at the project and I'll pull its record.`;
  }
  return (
    `Here's the honest picture from the recorded project registry:\n\n${lines.join('\n')}\n\n` +
    `Want me to pull up any of these in detail — blockers, latest verified output, what's next?`
  );
}

function ideaCaptureReply(state: TedPersonaState, message: string): TedPersonaResult {
  const draft = state.ideaDraft ? `${state.ideaDraft} ${message}` : message;
  return {
    reply:
      `Good — let's work it. I've got the start of it captured.\n\n` +
      `To shape this into something we can actually build, tell me:\n\n` +
      `1. **Who is it for?** — who's the person with the problem?\n` +
      `2. **What's the painful moment?** — what goes wrong for them today?\n` +
      `3. **What does "working" look like?** — what can they do after we build it that they can't do now?\n\n` +
      `Answer in any order, in your own words. I'll keep track and sketch the technical shape with you as we go.`,
    context: { kind: 'idea', ideaSummary: draft.slice(0, 220) },
    operation: { label: 'Shaping a new idea', state: 'WORKING', detail: 'Capturing founder intent; no build started.' },
    agentHandoff: null,
    artifact: null,
  speak: null,
  researchQuery: null,
  bridgeOp: null
  };
}

function modelGuidanceReply(): string {
  return (
    `Good question — and the honest answer is "it depends on the job." Here's how I think about it:\n\n` +
    `• **Reasoning / planning / architecture** — use the strongest reasoning model available to you. This is where quality compounds.\n` +
    `• **Code generation at volume** — a fast, code-specialized model keeps iteration tight; reserve the heavy model for review.\n` +
    `• **Embeddings / retrieval** — a dedicated embeddings model, not a chat model doing double duty.\n` +
    `• **Voice / realtime** — a realtime speech model only if latency actually matters for the use case.\n\n` +
    `Tell me what you're building it for — the workload, the latency budget, roughly how much it'll run — and I'll narrow it to a concrete recommendation with trade-offs. ` +
    `I don't have live model-benchmark data in this build, so treat this as engineering judgment, not a verified benchmark.`
  );
}

function researchReply(): string {
  return (
    `I'd love to dig into that — but I have to be straight with you: this build of TED doesn't have live web access, so I can't run fresh research right now. That's STATUS UNAVAILABLE, not a quiet guess.\n\n` +
    `What I *can* do from recorded knowledge:\n\n` +
    `• Pull up anything in our product portfolio, project registry, or deployment record\n` +
    `• Reason through the technical shape of the problem with you\n` +
    `• Frame the exact research questions so the lookup is fast when you run it\n\n` +
    `Want to start there? Tell me what you're trying to learn.`
  );
}

function buildRequestReply(q: string): string {
  if (q.includes('what broke')) {
    return (
      `Let's diagnose it properly. Tell me:\n\n` +
      `1. **What did you expect to happen?**\n` +
      `2. **What happened instead?** (exact error text helps enormously)\n` +
      `3. **Where?** — which project, page, or build?\n\n` +
      `I'll work it with you step by step. I won't claim it's fixed until we've seen it actually work.`
    );
  }
  return (
    `I'm in. Before I start shaping anything, I need the shape of it:\n\n` +
    `1. **What should it do?** — one paragraph, plain words.\n` +
    `2. **Who uses it?**\n` +
    `3. **What's the smallest version that proves it works?**\n\n` +
      `Give me that and I'll sketch the architecture with you — then we decide together what gets built first. I queue real build work through the governed chain; I never pretend something is built when it isn't.`
  );
}

function agentCoordinationReply(q: string): TedPersonaResult {
  const agent = SPECIALIST_AGENTS.find((a) => q.includes(a.id.toLowerCase()));
  if (!agent) {
    return {
      reply:
        `Here's how the specialist bench breaks down:\n\n` +
        SPECIALIST_AGENTS.map((a) => `• **${a.name}** — ${a.responsibility}`).join('\n') +
        `\n\nTell me what you're launching or making and I'll tell you who should own which part. I coordinate them — I don't pretend to be them.`,
      context: null,
      operation: null,
      agentHandoff: null,
      artifact: null,
    speak: null,
    researchQuery: null,
    bridgeOp: null
    };
  }
  const needsHandoff =
    q.includes('launch') || q.includes('campaign') || q.includes('marketing') || q.includes('content') || q.includes('video') || q.includes('script');
  return {
    reply:
      `**${agent.name}** — ${agent.responsibility}\n\n${agent.notResponsible}\n\n` +
      (needsHandoff
        ? `This sounds like real ${agent.name} work. I can queue it as a governed departmental task — ${agent.name} owns the craft, I own making sure it actually gets done and verified. Want me to queue it? Tell me the objective in one or two sentences.`
        : `Want me to bring ${agent.name} into whatever you're working on? Say the word and tell me the objective.`),
    context: { kind: 'agent', agent },
    operation: needsHandoff ? { label: `${agent.name} coordination`, state: 'WAITING', detail: 'Awaiting founder objective before queueing.' } : null,
    agentHandoff: agent.id,
    artifact: null,
  speak: null,
  researchQuery: null,
  bridgeOp: null
  };
}

function projectDetailReply(projectName: string): TedPersonaResult | null {
  const projects = getWorkspaceProjects();
  const match = projects.find((p) => normalized(p.name).includes(normalized(projectName).slice(0, 18)));
  if (!match) return null;
  const blockers = match.blockers.length ? match.blockers.join('; ') : 'None recorded.';
  return {
    reply:
      `**${match.name}**\n\n` +
      `• Status: **${match.status}** — phase ${match.phase} (${match.completionPercent}% complete)\n` +
      `• Deployment: ${match.deployment}\n` +
      `• Production: ${match.productionUrl}\n` +
      `• Latest verified output: ${match.latestVerifiedOutput}\n` +
      `• Blockers: ${blockers}\n` +
      `• Next action: ${match.nextAction}\n` +
      (match.assignedAgents.length ? `• Assigned: ${match.assignedAgents.join(', ')}\n` : '') +
      `\nThis is the recorded registry talking, not a guess. Want the acceptance criteria, or should we talk about what's next?`,
    context: { kind: 'project', project: match },
    operation: null,
    agentHandoff: null,
    artifact: 'project',
  speak: null,
  researchQuery: null,
  bridgeOp: null
  };
}

function commerceHonestyReply(): string {
  const commerce = getCommerceTruth();
  const lines = commerce.map((c) => `• **${c.channel}** — orders: ${c.ordersState}; revenue: ${c.revenueState}; customers: ${c.customersState}`);
  return (
    `Straight answer: **${getCustomerTruth()}**.\n\n` +
    `Here's exactly what the recorded commerce data says:\n\n${lines.join('\n')}\n\n` +
    `I won't invent a single customer, order, or dollar. When a verified source exists, I'll report it the same day.`
  );
}

/**
 * Main entry: conversational reply for one founder message.
 * The intelligence layer (handleTedQuery) always gets first refusal.
 */
/**
 * Summarize an action request as a gerund phrase for honest tool messaging,
 * e.g. "update my Etsy listing" -> "updating your Etsy listing".
 */
function summarizeAction(message: string): string {
  const q = normalized(message).replace(/\b(my|please)\b/g, '').replace(/\s+/g, ' ').trim().replace(/[.\s]+$/, '');
  const gerunds: Array<[RegExp, string]> = [
    [/\bupdat\w*\b/, 'updating'],
    [/\bdeploy\w*\b/, 'deploying'],
    [/\bbuild\w*\b/, 'building'],
    [/\bfix\w*\b/, 'fixing'],
    [/\bpublish\w*\b/, 'publishing'],
    [/\bconnect\w*\b/, 'connecting'],
    [/\bchang\w*\b/, 'changing'],
    [/\bcreat\w*\b/, 'creating'],
    [/\bmigrat\w*\b/, 'migrating'],
    [/\bship\w*\b/, 'shipping'],
  ];
  for (const [pattern, gerund] of gerunds) {
    const m = q.match(pattern);
    if (m && m.index !== undefined) {
      const rest = q.slice(m.index + m[0].length).trim().split(' ').slice(0, 6).join(' ');
      return `${gerund}${rest ? ` ${rest}` : ''}`;
    }
  }
  return 'making that change';
}

function executionRequestReply(message: string): string {
  const toolId = toolForMessage(message);
  if (toolId) {
    const outcome = requestExecution(toolId, summarizeAction(message));
    return outcome.message;
  }
  return (
    `I hear you — you want me to do something, not just talk about it. ` +
    `But I have to be straight: no execution tools are connected in this build — ` +
    `no repo access, no build runner, no deployment pipeline, no platform sessions. ` +
    `Tell me exactly what the action is (what changes, where) and I'll name the precise ` +
    `connection that's missing and what I'd do the moment it exists. I won't fake it.`
  );
}

function currentInfoReply(message: string): TedPersonaResult {
  const provider = getAvailableResearchProvider();
  if (!provider) {
    return {
      reply: researchUnavailableReply(message),
      context: null,
      operation: null,
      agentHandoff: null,
      artifact: null,
      speak: null,
      researchQuery: null, bridgeOp: null,
    };
  }
  return {
    reply: `On it — researching that live now. One moment.`,
    context: null,
    operation: { label: 'Live research', state: 'WORKING', detail: `Provider: ${provider.name}` },
    agentHandoff: null,
    artifact: null,
    speak: null,
    researchQuery: message, bridgeOp: null,
  };
}

function voiceCapabilityReply(voiceSupported?: boolean): string {
  if (voiceSupported === true) {
    return (
      `Voice is live — tap the mic and talk to me like a person. You'll see me listening, ` +
      `working, and speaking back. Tap the mic again anytime to stop me. If the browser ` +
      `blocks the microphone, I'll tell you plainly and typing keeps working.`
    );
  }
  if (voiceSupported === false) {
    return (
      `Voice input needs a browser with speech recognition — Chrome or Edge on desktop ` +
      `work best. This browser doesn't have it, so the mic stays quiet and honest. ` +
      `Type to me here; nothing is lost.`
    );
  }
  return (
    `Voice runs on your browser's speech recognition (Chrome or Edge on desktop work best). ` +
    `Tap the mic — if the browser supports it, we'll talk; if not, I'll say so plainly and ` +
    `typing keeps working.`
  );
}

/** Derive a short project name from the idea draft. */
function deriveProjectName(ideaDraft: string): string {
  const words = ideaDraft
    .split(/\s+/)
    .filter((w) => w.length > 2 && !/^(the|and|for|with|that|this|from|want|build)$/i.test(w));
  const name = words.slice(0, 4).join(' ');
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'New project';
}

/**
 * Detect a Tool Bridge operation intent. Returns the op, or null.
 * Edit parsing handles "change X to Y in file" / "replace X with Y in file".
 */
function bridgeIntent(q: string, state: TedPersonaState): TedBridgeOp | null {
  if (/^(apply it|yes,? apply|confirm( the)? edit|do it|yes)$/.test(q) && state.pendingEdit) {
    return {
      kind: 'edit-confirm',
      path: state.pendingEdit.path,
      confirmationId: state.pendingEdit.confirmationId,
      label: `Apply the proposed edit to ${state.pendingEdit.path}`,
    };
  }
  if (/\brun (the )?tests?\b/.test(q) || q === 'test it') {
    return { kind: 'test', label: 'Run the test suite' };
  }
  if (/\brun (the )?build\b/.test(q) || q.includes('build the project')) {
    return { kind: 'build', label: 'Run the build' };
  }
  if (/inspect (the )?project|project structure|list (the )?files|show me the (code|project)/.test(q)) {
    return { kind: 'inspect', label: 'Inspect the project' };
  }
  const readMatch = q.match(/\bread (the )?file ([\w./-]+\.\w+)/);
  if (readMatch) {
    return { kind: 'read', path: readMatch[2], label: `Read ${readMatch[2]}` };
  }
  const editMatch = q.match(/(?:change|replace)\s+(.+?)\s+(?:to|with)\s+(.+?)\s+in\s+([\w./-]+\.\w+)/);
  if (editMatch) {
    return {
      kind: 'edit-propose',
      path: editMatch[3],
      oldText: editMatch[1].trim(),
      newText: editMatch[2].trim(),
      label: `Propose edit to ${editMatch[3]}`,
    };
  }
  return null;
}

function bridgeNotConnectedReply(op: TedBridgeOp): string {
  // P11 (Phase 2.3): founder-friendly. No ports, tokens, handshake details,
  // or server terminology in the normal interface.
  return (
    `I need access to the local project before I can ${op.label.toLowerCase()}.\n\n` +
    `Here's the one-time setup:\n\n` +
    `1. Open a terminal in the OCG LAB project folder\n` +
    `2. Run: node os/tool-bridge/bridge.js\n` +
    `3. Paste the code it shows you into our chat\n\n` +
    `After that, I can inspect, test, build, and make changes — all with proof.`
  );
}

export function tedPersonaRespond(
  message: string,
  state: TedPersonaState,
  opts?: TedPersonaOptions,
): TedPersonaResult {
  const q = normalized(message);

  // LAYER 1 — governed intelligence. Preserves all existing TED behavior/tests.
  const governed = handleTedQuery(message, state.recentQueries);
  if (governed) {
    return {
      reply: governed.reply,
      context: null,
      operation: null,
      agentHandoff: null,
      artifact: looksLikePortfolioRequest(q) ? 'products' : null,
      speak: null,
      researchQuery: null, bridgeOp: null,
    };
  }

  // LAYER 2 — conversational experience over recorded data.
  if (isGreeting(q)) {
    return { reply: GREETING, context: null, operation: null, agentHandoff: null, artifact: null, speak: null, researchQuery: null, bridgeOp: null };
  }
  if (isIdeaOpener(q)) {
    return ideaCaptureReply(state, message);
  }
  // PHASE 2.2 — active build tracking. The founder said "let's build it":
  // start tracking, and route follow-ups through the build stage machine.
  // PHASE 2.3 — "Let's finish this" with active product context.
  // TED knows which product, what's done, what's left, and what's next.
  if (/let'?s finish this|finish it|complete this/.test(q) && state.activeProductId) {
    const memory = getProductMemoryWithOverlay(state.activeProductId);
    if (memory) {
      const remaining = memory.remaining.slice(0, 3).join('\n• ');
      const finishedCount = memory.finished.length;
      return {
        reply:
          `On it — **${memory.title}**.\n\n` +
          `Here's where we stand:\n` +
          `• Finished: ${finishedCount} item${finishedCount === 1 ? '' : 's'} verified\n` +
          `• Left:\n• ${remaining}\n\n` +
          `Next move: ${memory.nextMoves[0] || 'Not recorded.'}\n\n` +
          `Want me to start on that, or dig into something specific?`,
        context: null,
        operation: { label: `Product: ${memory.title}`, state: 'WORKING', detail: `Status: ${memory.status}` },
        agentHandoff: null,
        artifact: null,
        speak: null,
        researchQuery: null, bridgeOp: null,
      };
    }
  }
  if (wantsBuildPlan(q) && state.ideaDraft && !state.build) {
    const build = startBuild(deriveProjectName(state.ideaDraft), state.ideaDraft);
    const first = build.decisionsNeeded[0];
    return {
      reply:
        `Let's build it. I'm tracking "${build.projectName}" — objective: ${build.objective}.\n\n` +
        (first
          ? `Before I plan the architecture: ${first.question}\n\n${first.whyItMatters}`
          : `I've got what I need. Moving to research.`),
      context: null,
      operation: { label: `Build: ${build.projectName}`, state: 'WORKING', detail: `Stage: ${build.stage}` },
      agentHandoff: null,
      artifact: null,
      speak: null,
      researchQuery: null, bridgeOp: null,
      build,
    };
  }
  if (state.build && !isNewDomainQuestion(q) && !isStatusSweep(q)
      && !/where are we|build status|what'?s the (plan|status)/.test(q)) {
    const { reply, build } = advanceBuild(state.build, message, {
      researchAvailable: !!getAvailableResearchProvider(),
      toolsAvailable: !!opts?.bridgeConnected,
    });
    return {
      reply,
      context: null,
      operation: { label: `Build: ${build.projectName}`, state: 'WORKING', detail: `Stage: ${build.stage}` },
      agentHandoff: null,
      artifact: null,
      speak: null,
      researchQuery: null, bridgeOp: null,
      build,
    };
  }
  if (/where are we|build status|what'?s the (plan|status)/.test(q) && state.build) {
    return {
      reply: buildStatusLine(state.build),
      context: null,
      operation: null,
      agentHandoff: null,
      artifact: null,
      speak: null,
      researchQuery: null, bridgeOp: null,
    };
  }
  // PHASE 2.2 — Tool Bridge operations. Checked before generic routing so
  // every phrasing ("run the tests", "inspect the project", "apply it")
  // reaches the governed execution path.
  const bOp = bridgeIntent(q, state);
  if (bOp) {
    if (!opts?.bridgeConnected) {
      return {
        reply: bridgeNotConnectedReply(bOp),
        context: null,
        operation: null,
        agentHandoff: null,
        artifact: null,
        speak: null,
        researchQuery: null, bridgeOp: null,
      };
    }
    return {
      reply: `${bOp.label} — on it.`,
      context: null,
      operation: { label: bOp.label, state: 'WORKING', detail: 'Via Tool Bridge' },
      agentHandoff: null,
      artifact: null,
      speak: null,
      researchQuery: null,
      bridgeOp: bOp,
    };
  }
  if (state.ideaDraft && q.length > 12 && !isStatusSweep(q) && !isNewDomainQuestion(q)) {
    // Mid-idea shaping continues — unless the founder pivots to a new domain
    // question ("Wait — what about Etsy?"), which routes normally. The draft survives.
    return ideaCaptureReply(state, message);
  }
  if (q.includes('lotus insight')) {
    return { reply: lotusDiscoveryBrief(), context: null, operation: null, agentHandoff: null, artifact: null, speak: null, researchQuery: null, bridgeOp: null };
  }
  if (isStatusSweep(q)) {
    return { reply: projectStatusSweep(), context: null, operation: null, agentHandoff: null, artifact: 'projects', speak: null, researchQuery: null, bridgeOp: null };
  }
  if (q.includes('customer') || q.includes('revenue') || q.includes('sales') || q.includes('orders')) {
    return { reply: commerceHonestyReply(), context: null, operation: null, agentHandoff: null, artifact: null, speak: null, researchQuery: null, bridgeOp: null };
  }
  if (isModelQuestion(q)) {
    return { reply: modelGuidanceReply(), context: null, operation: null, agentHandoff: null, artifact: null, speak: null, researchQuery: null, bridgeOp: null };
  }

  // LAYER 3 — Phase 2 super-agent routing. Execution beats explanation;
  // current info beats stored knowledge; recorded knowledge beats inference.
  const intent = classifyIntent(message);
  if (intent === 'voice-command') {
    return {
      reply: `On it — reading that back to you now.`,
      context: null,
      operation: null,
      agentHandoff: null,
      artifact: null,
      speak: 'last',
      researchQuery: null, bridgeOp: null,
    };
  }
  if (intent === 'etsy-action') {
    return {
      reply: etsyAccountActionReply(),
      context: null,
      operation: null,
      agentHandoff: null,
      artifact: null,
      speak: null,
      researchQuery: null, bridgeOp: null,
    };
  }
  if (intent === 'execution-request') {
    return {
      reply: executionRequestReply(message),
      context: null,
      operation: null,
      agentHandoff: null,
      artifact: null,
      speak: null,
      researchQuery: null, bridgeOp: null,
    };
  }
  if (intent === 'etsy-policy' || intent === 'current-info') {
    return currentInfoReply(message);
  }
  if (intent === 'internal-ocg') {
    return {
      reply: formatKnowledgeBrief(getInternalKnowledgeBrief(message)),
      context: null,
      operation: null,
      agentHandoff: null,
      artifact: null,
      speak: null,
      researchQuery: null, bridgeOp: null,
    };
  }
  if (intent === 'technical-question') {
    const reply = isEtsyStructuralQuestion(message)
      ? etsyGuidanceReply(message)
      : technicalGuidanceReply(message);
    return {
      reply,
      context: null,
      operation: null,
      agentHandoff: null,
      artifact: null,
      speak: null,
      researchQuery: null, bridgeOp: null,
    };
  }

  if (isResearchRequest(q)) {
    return { reply: researchReply(), context: null, operation: null, agentHandoff: null, artifact: null, speak: null, researchQuery: null, bridgeOp: null };
  }
  if (isBuildRequest(q)) {
    return { reply: buildRequestReply(q), context: null, operation: null, agentHandoff: null, artifact: null, speak: null, researchQuery: null, bridgeOp: null };
  }
  if (isVoiceQuestion(q)) {
    return {
      reply: voiceCapabilityReply(opts?.voiceSupported),
      context: null,
      operation: null,
      agentHandoff: null,
      artifact: null,
    speak: null,
    researchQuery: null,
    bridgeOp: null
    };
  }
  if (q.includes('mark') || q.includes('orion') || q.includes('nova') || q.includes('launch') || q.includes('campaign')) {
    return agentCoordinationReply(q);
  }

  // Context detection against recorded projects/products.
  const detected = detectWorkspaceContext(message);
  if (detected?.kind === 'project') {
    const detail = projectDetailReply(detected.project.name);
    if (detail) return detail;
  }
  if (detected?.kind === 'product') {
    const p = detected.product;
    return {
      reply:
        `**${p.name}** (${p.type})\n\n` +
        `• Route: ${p.route} — ${p.pageLive ? 'page renders live' : 'not on the live site'}\n` +
        `• Checkout: ${p.checkoutVerified ? 'verified' : 'NO verified checkout'}\n` +
        `• Readiness: ${p.readiness}\n` +
        `• Price: ${p.price}\n\n` +
        `That's the recorded product truth — page content like "$0" or "Purchase" text is never treated as a price. Want the full portfolio, or do you want to talk about what this product should become?`,
      context: detected,
      operation: null,
      agentHandoff: null,
      artifact: 'product',
    speak: null,
    researchQuery: null,
    bridgeOp: null
    };
  }
  if (detected?.kind === 'agent') {
    return agentCoordinationReply(q);
  }

  // Conversational fallback — curious, honest, never fabricating.
  return {
    reply:
      `I'm with you — say a little more and I'll run with it.\n\n` +
      `I can pull from what we've actually recorded — our products, our projects, and what's published — ` +
      `and I can think through architecture, models, and debugging with you as a technical partner.\n\n` +
      `What are we digging into?`,
    context: null,
    operation: null,
    agentHandoff: null,
    artifact: null,
  speak: null,
  researchQuery: null,
  bridgeOp: null
  };
}
