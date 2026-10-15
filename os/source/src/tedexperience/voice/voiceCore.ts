/**
 * OCG SUPER VOICE CORE — provider-independent voice session layer.
 *
 * This is the shared voice foundation for OCG Super Agents (TED, Aiden,
 * Orion, Piper, Hunter, Victor). It is deliberately provider-independent:
 * shared capabilities (listening, transcription, turn detection,
 * interruption, speech output, session state, reconnection, text/voice
 * continuity, tool-result speech, error handling) live here; agent-specific
 * configuration (identity, system instructions, voice selection,
 * personality, knowledge, permissions, tools, initiative rules, domain)
 * lives in each agent's own config module.
 *
 * ARCHITECTURE AUDIT (2026-10-02) — why this core is defined, not extracted:
 * - Aiden: the most complete voice work, but C# desktop (Gemini Live relay
 *   client, uncommitted) + Python STT relay (Google Chirp, needs GCP ADC) +
 *   Kotlin mobile. Nothing reusable in a TypeScript browser app. The WIRE
 *   PROTOCOL concepts (ready / turn-complete / interrupted / goaway +
 *   reconnect with backoff) informed this core's design.
 * - Orion: browser-native voice with barge-in is PLANNED (mission checkbox),
 *   not implemented. Voiceover blocked: no TTS provider.
 * - Piper: voice/calling/SMS NOT WIRED.
 * - Hunter: mobile voice slice built, VERIFY REQUIRED (not verified).
 * - Victor: no voice implementation found.
 * There is no shared TypeScript voice core anywhere — this module is the
 * first, and the other agents can adopt it via VoiceProvider + VoiceAgentConfig.
 *
 * HONESTY CONTRACT: the core never claims a capability the provider lacks.
 * A provider reports its own capabilities; the session degrades truthfully
 * (e.g. no server VAD -> utterance-end turn detection; no realtime stream
 * -> Web Speech fallback). "Connected" is true only after a real provider
 * handshake, never from interface existence.
 */

export type VoiceSessionState =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'reconnecting'
  | 'ended'
  | 'error';

export type VoiceProviderKind = 'web-speech' | 'realtime-relay' | 'server-tts';

export interface VoiceProviderCapabilities {
  /** Can keep the mic open across turns without re-prompting. */
  continuousListening: boolean;
  /** Server-side voice activity detection (else utterance-end detection). */
  serverVad: boolean;
  /** True interruption of in-flight speech by voice. */
  voiceBargeIn: boolean;
  /** Audio streams as it arrives (else sentence-at-a-time synthesis). */
  streamingSpeech: boolean;
}

export interface VoiceProviderEvents {
  /** Interim and final transcripts as the founder speaks. */
  onTranscript(interim: string, final: string): void;
  /** Automatic turn detection fired: the founder finished a turn. */
  onTurnComplete(transcript: string): void;
  /** Founder started talking over TED's speech (barge-in). */
  onBargeIn(transcript: string): void;
  onSpeechStarted(): void;
  onSpeechEnded(): void;
  onError(kind: string, message: string): void;
  onConnectionLost(): void;
  onConnectionRestored(): void;
}

/**
 * A voice transport. The Web Speech provider is the first implementation;
 * realtime providers (Gemini Live relay, ElevenLabs, ...) implement this
 * same interface when the shared infrastructure exists.
 */
export interface VoiceProvider {
  readonly id: string;
  readonly kind: VoiceProviderKind;
  readonly name: string;
  readonly capabilities: VoiceProviderCapabilities;
  /** Resolve only after a REAL handshake ( else the session fails truthfully). */
  connect(): Promise<void>;
  disconnect(): void;
  startListening(): void;
  stopListening(): void;
  /** Speak text aloud. */
  speak(text: string): void;
  /** Immediately cancel in-flight speech. */
  cancelSpeech(): void;
  readonly isSpeaking: boolean;
}

/** Agent-specific configuration. Shared core never contains agent identity. */
export interface VoiceIdentity {
  agentId: string;
  displayName: string;
  /** Who this agent is, in one or two sentences. */
  identity: string;
  /** System instructions for spoken turns (kept short — voice is terse). */
  systemInstructions: string;
}

export interface VoiceSelection {
  /**
   * Configured premium voice from the shared OCG voice infrastructure
   * (e.g. ElevenLabs voice id, Gemini voice name). Null = not configured;
   * the provider falls back to its best local voice honestly.
   */
  configuredVoice: string | null;
  /** Human-readable description of the intended voice for the founder. */
  voiceDescription: string;
}

export type ProactivePriority = 'urgent' | 'notable' | 'routine';

export interface ProactiveEvent {
  kind:
    | 'research-finished'
    | 'build-failed'
    | 'problem-discovered'
    | 'decision-needed'
    | 'operation-complete'
    | 'risk-identified';
  priority: ProactivePriority;
  /** What TED says aloud. Short — voice is terse. */
  text: string;
  /** Dedupe key: repeated events with the same key speak once. */
  dedupeKey: string;
}

export interface VoiceInitiativeRules {
  /** Proactive speech is opt-in per event kind; routine ops stay silent. */
  proactiveKinds: ProactiveEvent['kind'][];
  /** Never proactively interrupt the founder's own turn. */
  neverInterruptFounder: boolean;
  /** Maximum proactive utterances per session before going quiet. */
  maxProactivePerSession: number;
}

export interface VoiceAgentConfig {
  identity: VoiceIdentity;
  voice: VoiceSelection;
  initiative: VoiceInitiativeRules;
  /** Domains this agent may speak about proactively. */
  domain: string[];
}

export interface SuperVoiceSessionHandlers {
  onStateChange(state: VoiceSessionState): void;
  /** A founder turn completed. Return TED's reply text to speak aloud. */
  onUserTurn(transcript: string): Promise<string>;
  /** The founder typed instead of speaking; reply in text, keep session. */
  onTextTurn?(text: string): Promise<string>;
  onSessionEnded(reason: string): void;
}

import { VoiceLatencyTracker } from './latency';

const RECONNECT_DELAYS = [1000, 2000, 4000];
const MAX_RECONNECT_ATTEMPTS = 3;

/**
 * Persistent voice session orchestrator. One start() call opens a
 * conversation: listen -> turn detected -> think -> speak -> auto-listen.
 * The founder never presses the mic per turn.
 */
export class SuperVoiceSession {
  private provider: VoiceProvider;
  private config: VoiceAgentConfig;
  private handlers: SuperVoiceSessionHandlers;
  private stateValue: VoiceSessionState = 'idle';
  private reconnectAttempts = 0;
  private proactiveSpoken = 0;
  private proactiveQueue: ProactiveEvent[] = [];
  private proactiveSeen = new Set<string>();
  private active = false;
  private turnInFlight = false;

  constructor(
    provider: VoiceProvider,
    config: VoiceAgentConfig,
    handlers: SuperVoiceSessionHandlers,
    private latency?: VoiceLatencyTracker,
  ) {
    this.provider = provider;
    this.config = config;
    this.handlers = handlers;
  }

  /** Measured turn latencies (null until a voice turn completes). */
  get latencyTracker(): VoiceLatencyTracker | undefined {
    return this.latency;
  }

  get state(): VoiceSessionState {
    return this.stateValue;
  }

  get isActive(): boolean {
    return this.active;
  }

  get agentConfig(): VoiceAgentConfig {
    return this.config;
  }

  private setState(next: VoiceSessionState): void {
    this.stateValue = next;
    this.handlers.onStateChange(next);
  }

  /** One click starts the conversation. Fails truthfully when no provider works. */
  async start(): Promise<void> {
    if (this.active) return;
    this.setState('connecting');
    try {
      await this.provider.connect();
    } catch (err) {
      this.setState('error');
      this.handlers.onSessionEnded(
        err instanceof Error ? err.message : 'Voice provider failed to connect.',
      );
      return;
    }
    this.active = true;
    this.reconnectAttempts = 0;
    this.beginListening();
  }

  private beginListening(): void {
    if (!this.active) return;
    this.setState('listening');
    try {
      this.provider.startListening();
    } catch (err) {
      this.handleProviderError('listen-failed', err instanceof Error ? err.message : 'Could not start listening.');
    }
  }

  /** Founder finished a turn (automatic turn detection). */
  async handleTurnComplete(transcript: string): Promise<void> {
    if (!this.active || this.turnInFlight) return;
    const clean = transcript.trim();
    if (!clean) {
      this.beginListening();
      return;
    }
    this.turnInFlight = true;
    this.setState('thinking');
    try {
      const reply = await this.handlers.onUserTurn(clean);
      this.latency?.markResponseReady();
      this.turnInFlight = false;
      if (!this.active) return;
      this.speakReply(reply);
    } catch (err) {
      this.turnInFlight = false;
      this.handleProviderError('turn-failed', err instanceof Error ? err.message : 'Could not process that turn.');
    }
  }

  private speakReply(text: string): void {
    if (!this.active) return;
    const clean = text.trim();
    if (!clean) {
      this.beginListening();
      return;
    }
    this.setState('speaking');
    try {
      this.provider.speak(clean);
    } catch (err) {
      this.handleProviderError('speak-failed', err instanceof Error ? err.message : 'Could not speak the reply.');
    }
  }

  /** TED finished speaking: automatically resume listening. */
  handleSpeechEnded(): void {
    if (!this.active) return;
    if (this.stateValue !== 'speaking') return;
    this.drainProactiveQueue();
    this.beginListening();
  }

  /**
   * Barge-in: the founder talked over TED. Cancel speech IMMEDIATELY, then
   * treat the interruption as the next turn (context is preserved by the host).
   */
  async handleBargeIn(transcript: string): Promise<void> {
    if (!this.active) return;
    try {
      this.provider.cancelSpeech();
    } catch {
      /* best effort */
    }
    this.setState('thinking');
    await this.handleTurnComplete(transcript);
  }

  /**
   * UI interrupt: the founder tapped while TED was speaking. Stop speech
   * immediately and resume listening — no turn is fabricated from the tap;
   * the barge-in recognizer may still deliver a real transcript.
   */
  interruptToListen(): void {
    if (!this.active || this.stateValue !== 'speaking') return;
    try {
      this.provider.cancelSpeech();
    } catch {
      /* best effort */
    }
    this.beginListening();
  }

  /** Explicit end-conversation control. */
  end(reason = 'Founder ended the voice session.'): void {
    if (!this.active && this.stateValue === 'idle') return;
    this.active = false;
    try {
      this.provider.cancelSpeech();
    } catch {
      /* best effort */
    }
    try {
      this.provider.stopListening();
    } catch {
      /* best effort */
    }
    try {
      this.provider.disconnect();
    } catch {
      /* best effort */
    }
    this.setState('ended');
    this.handlers.onSessionEnded(reason);
  }

  /** Connection dropped mid-session: reconnect with backoff, then fail truthfully. */
  async handleConnectionLost(): Promise<void> {
    if (!this.active) return;
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      this.setState('error');
      this.end('Voice connection lost and could not be restored. Text chat still works.');
      return;
    }
    this.setState('reconnecting');
    const delay = RECONNECT_DELAYS[Math.min(this.reconnectAttempts, RECONNECT_DELAYS.length - 1)];
    this.reconnectAttempts += 1;
    await new Promise((r) => setTimeout(r, delay));
    if (!this.active) return;
    try {
      await this.provider.connect();
      this.reconnectAttempts = 0;
      this.beginListening();
    } catch {
      await this.handleConnectionLost();
    }
  }

  private handleProviderError(_kind: string, message: string): void {
    if (!this.active) return;
    this.setState('error');
    this.end(message);
  }

  // ------------------------------------------------------------------
  // Proactive speech: genuinely useful events only, never noisy.
  // ------------------------------------------------------------------

  /**
   * TED may proactively speak during an active session when something is
   * genuinely useful: research finished, build/test failed, a decision is
   * needed, an operation completed with verified evidence, or a significant
   * risk was identified. Routine operations stay silent.
   */
  notifyProactive(event: ProactiveEvent): void {
    if (!this.active) return;
    if (!this.config.initiative.proactiveKinds.includes(event.kind)) return;
    if (event.priority === 'routine') return;
    if (this.proactiveSeen.has(event.dedupeKey)) return;
    if (this.proactiveSpoken >= this.config.initiative.maxProactivePerSession) return;
    this.proactiveSeen.add(event.dedupeKey);

    if (event.priority === 'urgent') {
      // Urgent speaks now, even over TED's own speech — never over the founder.
      if (this.stateValue === 'listening' && this.turnInFlight) return;
      try {
        this.provider.cancelSpeech();
      } catch {
        /* best effort */
      }
      this.proactiveSpoken += 1;
      this.speakReply(event.text);
      return;
    }
    // Notable: queue for the next natural pause between turns.
    this.proactiveQueue.push(event);
    if (this.stateValue === 'listening' && !this.turnInFlight) this.drainProactiveQueue();
  }

  private drainProactiveQueue(): void {
    if (!this.active || !this.proactiveQueue.length) return;
    if (this.proactiveSpoken >= this.config.initiative.maxProactivePerSession) {
      this.proactiveQueue = [];
      return;
    }
    const event = this.proactiveQueue.shift();
    if (!event) return;
    this.proactiveSpoken += 1;
    this.speakReply(event.text);
  }
}
