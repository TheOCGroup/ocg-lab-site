/**
 * TED Super Agent — real two-way voice (Phase 2).
 *
 * Voice path: the Web Speech API (SpeechRecognition + speechSynthesis) — the
 * best genuinely available two-way voice path for a browser-only app. No
 * keys, no backend, no fake transport.
 *
 * HONESTY CONTRACT (load-bearing):
 * - TED never claims voice is connected until a full round trip actually
 *   works: microphone -> transcript received -> response spoken aloud.
 * - Capability is feature-detected at runtime. Unsupported browsers and
 *   denied microphone permission are handled cleanly; text chat always
 *   keeps working.
 * - States are visible without clutter: listening / processing / speaking.
 * - Speech can be interrupted (cancel) where the platform allows it.
 *
 * The controller takes an injected runtime so the state machine,
 * transitions, and truthfulness are fully testable without a microphone.
 */

export type TedVoiceState =
  | 'idle'
  | 'requesting-permission'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'error';

export type TedVoiceErrorKind =
  | 'not-supported'
  | 'permission-denied'
  | 'no-microphone'
  | 'recognition-failed'
  | 'synthesis-unavailable'
  | 'aborted';

export interface TedVoiceSupport {
  recognition: boolean;
  synthesis: boolean;
}

/** Minimal surface of the Web Speech API the controller needs. Injectable for tests. */
export interface TedVoiceRuntime {
  RecognitionCtor?: new () => TedRecognitionLike;
  synthesis?: TedSynthesisLike;
  UtteranceCtor?: new (text: string) => TedUtteranceLike;
}

export interface TedRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

export interface TedSynthesisLike {
  speak(utterance: TedUtteranceLike): void;
  cancel(): void;
  getVoices(): TedVoiceLike[];
  readonly speaking: boolean;
  addEventListener?: (type: string, listener: () => void, options?: any) => void;
}

export interface TedVoiceLike {
  name: string;
  lang: string;
  localService: boolean;
}

export interface TedUtteranceLike {
  text: string;
  voice: TedVoiceLike | null;
  rate: number;
  pitch: number;
  onend: (() => void) | null;
  onerror: ((event: any) => void) | null;
  onstart?: (() => void) | null;
}

export interface TedVoiceCallbacks {
  onStateChange(state: TedVoiceState): void;
  /** Interim and final transcripts as the founder speaks. */
  onTranscript(interim: string, final: string): void;
  onError(kind: TedVoiceErrorKind, message: string): void;
  /** Fired when speaking starts and ends. */
  onSpeakingChange(speaking: boolean): void;
  /** Fired when synthesis actually starts producing audio (utterance onstart). */
  onSpeechAudioStart?: () => void;
}

/** Feature-detect voice support from a runtime (defaults to window). */
export function detectVoiceSupport(runtime: TedVoiceRuntime): TedVoiceSupport {
  return {
    recognition: typeof runtime.RecognitionCtor === 'function',
    synthesis:
      typeof runtime.synthesis !== 'undefined' &&
      typeof runtime.UtteranceCtor === 'function',
  };
}

/** Build a runtime from the real browser environment. */
export function browserVoiceRuntime(): TedVoiceRuntime {
  if (typeof window === 'undefined') return {};
  const w = window as any;
  return {
    RecognitionCtor: w.SpeechRecognition ?? w.webkitSpeechRecognition ?? undefined,
    synthesis: w.speechSynthesis,
    UtteranceCtor: w.SpeechSynthesisUtterance,
  };
}

const NATURAL_VOICE_HINTS = /google|microsoft|samantha|zira|david|aria|jenny|guy|natural|neural/i;

/**
 * Pick the best available voice: prefer a natural/neural en voice, then any
 * en voice, then the platform default. Never silently fall back to a robotic
 * default when a better configured voice exists.
 */
export function selectVoice(voices: TedVoiceLike[], lang = 'en-US'): TedVoiceLike | null {
  if (!voices.length) return null;
  const en = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
  const pool = en.length ? en : voices;
  const natural = pool.filter((v) => NATURAL_VOICE_HINTS.test(v.name));
  if (natural.length) {
    const exact = natural.find((v) => v.lang.toLowerCase() === lang.toLowerCase());
    return exact ?? natural[0];
  }
  const exact = pool.find((v) => v.lang.toLowerCase() === lang.toLowerCase());
  return exact ?? pool[0];
}

const FRIENDLY_ERRORS: Record<TedVoiceErrorKind, string> = {
  'not-supported': 'Voice input needs a browser with speech recognition (Chrome or Edge on desktop work best). Text chat works fine here.',
  'permission-denied': 'Microphone access was blocked — check the browser permission for this site, then tap the mic again. Typing still works.',
  'no-microphone': "I couldn't find a microphone on this device. Typing still works.",
  'recognition-failed': "I didn't catch that — try again, or just type it.",
  'synthesis-unavailable': "I can't speak aloud in this browser, but I'll keep answering in text.",
  'aborted': 'Voice stopped.',
};

export function friendlyVoiceError(kind: TedVoiceErrorKind): string {
  return FRIENDLY_ERRORS[kind];
}

export class TedVoiceController {
  private runtime: TedVoiceRuntime;
  private cb: TedVoiceCallbacks;
  private recognition: TedRecognitionLike | null = null;
  private stateValue: TedVoiceState = 'idle';
  private heardTranscript = false;
  private roundTrip = false;
  private finalTranscript = '';
  private interimTranscript = '';

  constructor(runtime: TedVoiceRuntime, callbacks: TedVoiceCallbacks) {
    this.runtime = runtime;
    this.cb = callbacks;
  }

  get state(): TedVoiceState {
    return this.stateValue;
  }

  get support(): TedVoiceSupport {
    return detectVoiceSupport(this.runtime);
  }

  /**
   * True only after a FULL round trip worked: the mic produced a transcript
   * AND a response was spoken aloud. TED never claims voice is connected
   * before this.
   */
  get voiceConnected(): boolean {
    return this.roundTrip;
  }

  private setState(next: TedVoiceState): void {
    this.stateValue = next;
    this.cb.onStateChange(next);
  }

  private fail(kind: TedVoiceErrorKind): void {
    this.teardownRecognition();
    this.setState('error');
    this.cb.onError(kind, friendlyVoiceError(kind));
    this.setState('idle');
  }

  private teardownRecognition(): void {
    if (this.recognition) {
      try {
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.abort();
      } catch {
        /* already stopped */
      }
      this.recognition = null;
    }
  }

  /** Start listening. No-op (with honest error) when recognition is unsupported. */
  startListening(): void {
    if (this.stateValue === 'listening' || this.stateValue === 'requesting-permission') return;
    const Ctor = this.runtime.RecognitionCtor;
    if (!Ctor) {
      this.fail('not-supported');
      return;
    }
    // A lingering barge-in recognition must never survive into a new turn.
    this.teardownRecognition();
    this.cancelSpeaking();
    this.finalTranscript = '';
    this.interimTranscript = '';
    this.setState('requesting-permission');
    const recognition = new Ctor();
    this.recognition = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      const results = event?.results;
      if (results) {
        for (let i = event.resultIndex ?? 0; i < results.length; i++) {
          const transcript = results[i]?.[0]?.transcript ?? '';
          if (results[i]?.isFinal) final += transcript;
          else interim += transcript;
        }
      }
      this.interimTranscript = interim;
      if (final) {
        this.finalTranscript = (this.finalTranscript + ' ' + final).trim();
        this.heardTranscript = true;
      }
      this.cb.onTranscript(this.interimTranscript, this.finalTranscript);
    };

    recognition.onerror = (event: any) => {
      const code = event?.error ?? '';
      if (code === 'not-allowed' || code === 'service-not-allowed') this.fail('permission-denied');
      else if (code === 'audio-capture') this.fail('no-microphone');
      else if (code === 'aborted') this.setState('idle');
      else this.fail('recognition-failed');
    };

    recognition.onend = () => {
      if (this.stateValue === 'listening') {
        // Natural end of utterance: hand the final transcript over for processing.
        this.teardownRecognition();
        this.setState(this.finalTranscript ? 'processing' : 'idle');
      }
    };

    try {
      recognition.start();
      this.setState('listening');
    } catch {
      this.fail('recognition-failed');
    }
  }

  /** Pre-warm the synthesis voice list so first speech starts faster. */
  prewarmVoices(): void {
    try {
      const voices = this.runtime.synthesis?.getVoices() ?? [];
      if (voices.length === 0 && typeof this.runtime.synthesis?.addEventListener === 'function') {
        this.runtime.synthesis.addEventListener('voiceschanged', () => {
          try {
            this.runtime.synthesis?.getVoices();
          } catch {
            /* noop */
          }
        }, { once: true } as any);
      }
    } catch {
      /* best effort */
    }
  }

  /** Stop listening without treating it as an error (founder tapped stop). */
  stopListening(): void {
    if (this.stateValue !== 'listening' && this.stateValue !== 'requesting-permission') return;
    this.teardownRecognition();
    this.setState(this.finalTranscript ? 'processing' : 'idle');
  }

  /**
   * Start listening WITHOUT cancelling in-flight speech and WITHOUT leaving
   * the 'speaking' state. Used for voice barge-in: the founder talks over
   * TED, transcripts arrive via onTranscript, and the host decides whether
   * it's an interruption (vs. TTS echo). Returns false when unavailable.
   */
  startBargeInListening(): boolean {
    const Ctor = this.runtime.RecognitionCtor;
    if (!Ctor || this.recognition) return false;
    if (this.stateValue !== 'speaking') return false;
    const recognition = new Ctor();
    this.recognition = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      const results = event?.results;
      if (results) {
        for (let i = event.resultIndex ?? 0; i < results.length; i++) {
          const transcript = results[i]?.[0]?.transcript ?? '';
          if (results[i]?.isFinal) final += transcript;
          else interim += transcript;
        }
      }
      if (final) this.finalTranscript = (this.finalTranscript + ' ' + final).trim();
      this.cb.onTranscript(interim, this.finalTranscript);
    };

    recognition.onerror = (event: any) => {
      const code = event?.error ?? '';
      // During barge-in, errors are non-fatal: the speech continues and the
      // host keeps its own state. Only surface genuine problems.
      if (code === 'not-allowed' || code === 'service-not-allowed') {
        this.teardownRecognition();
      } else if (code === 'aborted' || code === 'no-speech') {
        this.teardownRecognition();
      }
    };

    recognition.onend = () => {
      // Barge-in recognition ending never changes the speaking state; the
      // host restarts it if speech is still in flight.
      if (this.recognition === recognition) this.recognition = null;
    };

    try {
      recognition.start();
      return true;
    } catch {
      this.recognition = null;
      return false;
    }
  }

  /** True while barge-in recognition is armed during speech. */
  get bargeInArmed(): boolean {
    return this.stateValue === 'speaking' && this.recognition !== null;
  }

  /** Call when the transcript has been answered; returns controller to idle. */
  finishProcessing(): void {
    if (this.stateValue === 'processing') this.setState('idle');
  }

  get transcript(): string {
    return this.finalTranscript || this.interimTranscript;
  }

  /** Speak text aloud. Selects the best voice; no robotic fallback when a better voice exists. */
  speak(text: string): void {
    const synthesis = this.runtime.synthesis;
    const Utterance = this.runtime.UtteranceCtor;
    if (!synthesis || !Utterance) {
      this.cb.onError('synthesis-unavailable', friendlyVoiceError('synthesis-unavailable'));
      return;
    }
    this.cancelSpeaking();
    const clean = stripMarkdownForSpeech(text);
    if (!clean.trim()) return;
    const utterance = new Utterance(clean);
    const voices = synthesis.getVoices();
    // Prefer a US English executive male voice where the browser provides one.
    // A saved exact voice name takes priority and survives subsequent sessions.
    let preferredName = '';
    try { preferredName = localStorage.getItem('ted-preferred-voice') ?? ''; } catch { /* storage unavailable */ }
    const preferred = preferredName ? voices.find((v) => v.name === preferredName && v.lang.toLowerCase().startsWith('en')) : null;
    const executive = voices.find((v) => v.lang.toLowerCase() === 'en-us' && /^(Microsoft (Guy|David)|Google US English Male)/i.test(v.name));
    const thomas = voices.find((v) => v.lang.toLowerCase().startsWith('en-gb') && /microsoft.*thomas/i.test(v.name));
    const voice = preferred ?? thomas ?? executive ?? selectVoice(voices);
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.pitch = 1;
    this.setState('speaking');
    this.cb.onSpeakingChange(true);
    utterance.onend = () => {
      this.cb.onSpeakingChange(false);
      // Full round trip: the mic produced a transcript AND a response was
      // spoken aloud. Only now may TED claim voice is connected.
      if (this.heardTranscript) this.roundTrip = true;
      if (this.stateValue === 'speaking') this.setState('idle');
    };
    utterance.onerror = () => {
      this.cb.onSpeakingChange(false);
      if (this.stateValue === 'speaking') this.setState('idle');
      this.cb.onError('synthesis-unavailable', friendlyVoiceError('synthesis-unavailable'));
    };
    utterance.onstart = () => {
      try {
        this.cb.onSpeechAudioStart?.();
      } catch {
        /* measurement only */
      }
    };
    try {
      synthesis.speak(utterance);
    } catch {
      this.cb.onSpeakingChange(false);
      if (this.stateValue === 'speaking') this.setState('idle');
      this.cb.onError('synthesis-unavailable', friendlyVoiceError('synthesis-unavailable'));
    }
  }

  /** Interrupt speaking (founder tapped stop / started talking). */
  cancelSpeaking(): void {
    try {
      this.runtime.synthesis?.cancel();
    } catch {
      /* noop */
    }
    // Barge-in recognition served its purpose once speech is cancelled.
    this.teardownRecognition();
    if (this.stateValue === 'speaking') {
      this.cb.onSpeakingChange(false);
      this.setState('idle');
    }
  }

  /** Stop everything: listening and speaking. */
  cancel(): void {
    this.teardownRecognition();
    this.cancelSpeaking();
    if (this.stateValue !== 'idle') this.setState('idle');
  }
}

/** Strip markdown/formatting so spoken output sounds natural. */
export function stripMarkdownForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' code omitted ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/^[\s]*[-•*]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
