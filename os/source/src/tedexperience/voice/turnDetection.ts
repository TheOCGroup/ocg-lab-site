/**
 * OCG Super Voice Core — automatic turn detection.
 *
 * A "turn" is a completed founder utterance the agent should answer. Two
 * detection strategies, chosen by provider capability:
 *
 * - SERVER VAD (realtime providers): the transport emits turn boundaries
 *   from server-side voice activity detection. Most accurate.
 * - UTTERANCE END (Web Speech fallback): the recognition session ends when
 *   the speaker pauses; the accumulated final transcript is the turn.
 *
 * Heuristics keep the fallback honest: empty transcripts and bare
 * acknowledgments ("mm", "uh") never become turns.
 */

export type TurnDetectionStrategy = 'server-vad' | 'utterance-end';

const FILLER_ONLY = /^(m+h+m+|u+h+h+u+h+|mm+|uh+|um+|ah+|er+|hmm+|yeah?|okay?|ok)$/i;
const MIN_TURN_CHARS = 2;

/** True when a transcript is substantial enough to be a real turn. */
export function isRealTurn(transcript: string): boolean {
  const clean = transcript.trim().replace(/[.,!?]+$/, '').replace(/[-\s]+/g, '');
  if (clean.length < MIN_TURN_CHARS) return false;
  if (FILLER_ONLY.test(clean)) return false;
  return true;
}

export interface TurnDetectorEvents {
  onTurn(transcript: string): void;
}

/**
 * Utterance-end turn detector for the Web Speech provider: feed it the
 * recognition lifecycle; it emits a turn when the utterance ends with a
 * real transcript.
 */
export class UtteranceEndTurnDetector {
  private events: TurnDetectorEvents;
  private strategy: TurnDetectionStrategy = 'utterance-end';

  constructor(events: TurnDetectorEvents) {
    this.events = events;
  }

  get detectionStrategy(): TurnDetectionStrategy {
    return this.strategy;
  }

  /** Call when the recognition session ends naturally. */
  utteranceEnded(finalTranscript: string): void {
    const clean = finalTranscript.trim();
    if (isRealTurn(clean)) this.events.onTurn(clean);
  }
}

const normalized = (value: string): string =>
  value.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();

/**
 * Echo guard for barge-in: the mic often hears TED's own speech. A
 * candidate interruption is treated as echo (ignored) when it matches what
 * TED is currently saying, arrived inside the grace period, or is too
 * short to be an intentional interruption.
 */
export interface EchoGuardOptions {
  /** ms after speech starts during which transcripts are ignored. */
  gracePeriodMs: number;
  /** Minimum chars for a barge-in to count. */
  minBargeInChars: number;
}

export const DEFAULT_ECHO_GUARD: EchoGuardOptions = {
  gracePeriodMs: 800,
  minBargeInChars: 4,
};

export function isEcho(
  candidate: string,
  speakingText: string,
  speechAgeMs: number,
  options: EchoGuardOptions = DEFAULT_ECHO_GUARD,
): boolean {
  const c = normalized(candidate);
  if (!c || c.length < options.minBargeInChars) return true;
  if (speechAgeMs < options.gracePeriodMs) return true;
  const s = normalized(speakingText);
  // The mic heard TED's own words (or a fragment of them).
  if (s.includes(c)) return true;
  // The candidate is a fragment TED already said (partial echo).
  const words = c.split(' ').filter((w) => w.length > 2);
  if (words.length >= 2 && words.every((w) => s.includes(w))) return true;
  return false;
}
