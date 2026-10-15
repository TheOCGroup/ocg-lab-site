/**
 * TED Super Agent — intent routing (Phase 2).
 *
 * EXPERIENCE LAYER ONLY. Classifies a founder message into the capability
 * path that should handle it. Priority order is load-bearing:
 *
 *   voice-command  >  execution-request  >  etsy-action  >  current-info /
 *   etsy-policy  >  internal-ocg  >  technical-question  >  conversational
 *
 * An execution request ("update my Etsy listing") must never be answered as
 * a mere technical question, and a current-info question must never be
 * answered from stale stored knowledge.
 */

import { isEtsyAccountAction, isEtsyPolicyQuestion, isEtsyStructuralQuestion } from './tedEtsy';
import { isInternalOcgQuestion } from './tedKnowledge';
import { isExecutionRequest, mapActionToTool } from './tedTools';
import { needsCurrentInfo } from './tedResearch';
import { detectTechnicalDomain } from './tedSuperAgent';

export type TedIntent =
  | 'voice-command'
  | 'execution-request'
  | 'etsy-action'
  | 'etsy-policy'
  | 'current-info'
  | 'internal-ocg'
  | 'technical-question'
  | 'conversational';

const normalized = (value: string): string =>
  value.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();

const VOICE_COMMAND_PATTERNS: RegExp[] = [
  /read (that|this|it) (to me|out loud|aloud)/,
  /read (me )?that answer/,
  /\bspeak\b.*(that|this|it|the answer)/,
  /say (that|this|it) out loud/,
  /read it back/,
];

/** True when the founder is commanding TED's voice (not asking about voice). */
export function isVoiceCommand(message: string): boolean {
  const q = normalized(message);
  return VOICE_COMMAND_PATTERNS.some((p) => p.test(q));
}

/**
 * Classify the founder's message. Pure function — no side effects, fully
 * testable. Conversational intents already handled by the persona (greeting,
 * idea capture, status sweep, commerce, agents) are returned as
 * 'conversational' here; the persona's existing branches keep priority for
 * those.
 */
export function classifyIntent(message: string): TedIntent {
  const q = normalized(message);

  if (isVoiceCommand(message)) return 'voice-command';

  // Execution beats explanation: "update my Etsy listing" is an action.
  if (isEtsyAccountAction(message)) return 'etsy-action';
  if (isExecutionRequest(message)) {
    // A mapped tool confirms it's a real action request; an unmapped one
    // with action verbs is still treated as execution (fail closed).
    return 'execution-request';
  }

  // Current information beats stored knowledge.
  if (isEtsyPolicyQuestion(message) || needsCurrentInfo(message)) {
    return isEtsyPolicyQuestion(message) ? 'etsy-policy' : 'current-info';
  }

  // Internal recorded knowledge before general technical reasoning.
  if (isInternalOcgQuestion(message)) return 'internal-ocg';

  // Technical question: a recognized technical domain.
  if (detectTechnicalDomain(message)) {
    // Structural Etsy questions are technical questions too.
    if (isEtsyStructuralQuestion(message)) return 'technical-question';
    return 'technical-question';
  }
  if (isEtsyStructuralQuestion(message)) return 'technical-question';

  return 'conversational';
}

/** For execution intents: which tool would perform it (may be unconnected). */
export function toolForMessage(message: string): string | null {
  const tool = mapActionToTool(message);
  return tool ? tool.id : null;
}
