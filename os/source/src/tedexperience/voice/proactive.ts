/**
 * OCG Super Voice Core — proactive speech.
 *
 * During an active voice session, the agent may proactively speak when there
 * is something GENUINELY useful for the founder:
 * - research finishes
 * - a build/test fails
 * - an important technical problem is discovered
 * - the agent needs a founder decision
 * - an operation completes with verified evidence
 * - the agent identifies a significant risk or better technical approach
 *
 * Do NOT make the agent noisy: routine internal operations remain silent.
 * This module is the policy layer; the session orchestrator enforces it.
 */

import { ProactiveEvent, ProactivePriority } from './voiceCore';

export interface ProactivePolicy {
  /** Event kinds this agent may speak about unprompted. */
  allowedKinds: ProactiveEvent['kind'][];
  /** Cap per session; the agent goes quiet after this many. */
  maxPerSession: number;
}

/** TED's proactive policy: useful, never noisy. */
export const TED_PROACTIVE_POLICY: ProactivePolicy = {
  allowedKinds: [
    'research-finished',
    'build-failed',
    'problem-discovered',
    'decision-needed',
    'operation-complete',
    'risk-identified',
  ],
  maxPerSession: 3,
};

export function makeProactiveEvent(
  kind: ProactiveEvent['kind'],
  text: string,
  dedupeKey: string,
  priority?: ProactivePriority,
): ProactiveEvent {
  const inferred: ProactivePriority =
    priority ??
    (kind === 'build-failed' || kind === 'decision-needed' || kind === 'problem-discovered'
      ? 'urgent'
      : 'notable');
  return { kind, priority: inferred, text, dedupeKey };
}

/**
 * Plain-English renderings for proactive events. Short — voice is terse.
 * The host builds these from real outcomes, never from speculation.
 */
export function renderProactiveText(
  kind: ProactiveEvent['kind'],
  detail: string,
): string {
  const d = detail.trim().slice(0, 220);
  switch (kind) {
    case 'research-finished':
      return `That research just finished. ${d}`;
    case 'build-failed':
      return `Heads up — the build failed. ${d}`;
    case 'problem-discovered':
      return `I found something worth your attention. ${d}`;
    case 'decision-needed':
      return `I need your call on something. ${d}`;
    case 'operation-complete':
      return `Done and verified. ${d}`;
    case 'risk-identified':
      return `One risk before we go further. ${d}`;
  }
}
