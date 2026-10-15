/**
 * OCG Super Voice Core — Web Speech provider.
 *
 * First (and currently only) VoiceProvider implementation: the Web Speech
 * API (SpeechRecognition + speechSynthesis). Honest fallback for the Super
 * Voice Agent experience — no keys, no backend, works in Chrome/Edge.
 *
 * Capabilities reported truthfully:
 * - continuousListening: true where the API exists (re-prompt per session
 *   start, not per turn — the session loop restarts recognition itself).
 * - serverVad: false -> utterance-end turn detection.
 * - voiceBargeIn: best-effort via barge-in recognition during speech with
 *   echo guard (documented limitation: no real acoustic echo cancellation).
 * - streamingSpeech: false -> sentence-at-a-time synthesis.
 *
 * When the shared realtime infrastructure lands (Gemini Live relay,
 * ElevenLabs, ...), it implements VoiceProvider beside this one — the
 * session orchestrator does not change.
 */

import {
  TedVoiceController,
  TedVoiceRuntime,
  browserVoiceRuntime,
} from '../tedVoice';
import {
  VoiceProvider,
  VoiceProviderCapabilities,
  VoiceProviderEvents,
} from './voiceCore';
import { UtteranceEndTurnDetector, isEcho } from './turnDetection';
import { VoiceLatencyTracker } from './latency';

export const WEB_SPEECH_PROVIDER_ID = 'web-speech-fallback';

const CAPABILITIES: VoiceProviderCapabilities = {
  continuousListening: true,
  serverVad: false,
  voiceBargeIn: true, // best-effort: barge-in recognition + echo guard
  streamingSpeech: false,
};

export class WebSpeechVoiceProvider implements VoiceProvider {
  readonly id = WEB_SPEECH_PROVIDER_ID;
  readonly kind = 'web-speech' as const;
  readonly name = 'Web Speech (browser fallback)';
  readonly capabilities = CAPABILITIES;

  private controller: TedVoiceController;
  private turnDetector: UtteranceEndTurnDetector;
  private listening = false;
  private speakingText = '';
  private speechStartTime = 0;
  private seenFinalLength = 0;
  private connectFailed = false;
  /** Set when speech was cancelled deliberately: suppress the end event so
   *  the session (which initiated the cancel) doesn't re-enter its end handler. */
  private speechCancelSuppressed = false;

  constructor(
    runtime: TedVoiceRuntime,
    private events: VoiceProviderEvents,
    private latency?: VoiceLatencyTracker,
  ) {
    this.controller = new TedVoiceController(runtime, {
      onStateChange: (s) => this.handleControllerState(s),
      onTranscript: (interim, final) => this.handleTranscript(interim, final),
      onError: (kind, message) => this.events.onError(kind, message),
      onSpeechAudioStart: () => this.latency?.markFirstAudio(),
      onSpeakingChange: (speaking) => {
        if (speaking) {
          this.speechCancelSuppressed = false;
          this.events.onSpeechStarted();
        } else if (!this.speechCancelSuppressed) {
          // Natural end of speech -> the session auto-resumes listening.
          // Cancel-initiated ends are suppressed: the initiator drives next.
          this.events.onSpeechEnded();
        }
      },
    });
    this.turnDetector = new UtteranceEndTurnDetector({
      onTurn: (transcript) => {
        this.latency?.markTranscript();
        this.events.onTurnComplete(transcript);
      },
    });
  }

  /** Build a provider from the real browser environment. */
  static fromBrowser(events: VoiceProviderEvents): WebSpeechVoiceProvider {
    return new WebSpeechVoiceProvider(browserVoiceRuntime(), events);
  }

  get support() {
    return this.controller.support;
  }

  get isSpeaking(): boolean {
    return this.controller.state === 'speaking';
  }

  get wasConnectFailed(): boolean {
    return this.connectFailed;
  }

  async connect(): Promise<void> {
    const support = this.controller.support;
    if (!support.recognition) {
      this.connectFailed = true;
      throw new Error(
        'Voice input needs a browser with speech recognition (Chrome or Edge on desktop work best).',
      );
    }
    // Pre-warm synthesis voices: the first getVoices() call can be slow or
    // empty; warming here cuts first-speech startup latency.
    try {
      this.controller.prewarmVoices();
    } catch {
      /* best effort */
    }
    // Web Speech needs no handshake beyond feature detection; the session
    // treats first successful recognition as the live path.
  }

  disconnect(): void {
    this.listening = false;
    this.controller.cancel();
  }

  startListening(): void {
    this.listening = true;
    this.seenFinalLength = 0;
    this.controller.startListening();
  }

  stopListening(): void {
    this.listening = false;
    this.controller.stopListening();
  }

  speak(text: string): void {
    const clean = text.trim();
    this.speechCancelSuppressed = false;
    if (!clean) {
      // Nothing to say: behave as if speech ended instantly.
      this.events.onSpeechStarted();
      this.events.onSpeechEnded();
      return;
    }
    this.speakingText = clean;
    this.speechStartTime = Date.now();
    this.seenFinalLength = this.controller.transcript.length;
    this.controller.speak(clean);
    // Arm voice barge-in: keep the mic open while TED talks.
    this.controller.startBargeInListening();
  }

  cancelSpeech(): void {
    this.speechCancelSuppressed = true;
    this.controller.cancelSpeaking();
  }

  private handleControllerState(state: string): void {
    if (state === 'processing' && this.listening) {
      // Utterance ended: automatic turn detection.
      this.listening = false;
      this.latency?.markSpeechEnd();
      this.turnDetector.utteranceEnded(this.controller.transcript);
    }
  }

  private handleTranscript(interim: string, final: string): void {
    const controllerState = this.controller.state;
    if (controllerState === 'speaking' && this.controller.bargeInArmed) {
      // Possible barge-in: only the NEW text since speech started counts.
      const newFinal = final.slice(this.seenFinalLength).trim();
      this.seenFinalLength = final.length;
      if (!newFinal && !interim) return;
      const candidate = newFinal || interim;
      const age = Date.now() - this.speechStartTime;
      if (isEcho(candidate, this.speakingText, age)) return;
      // Genuine interruption: hand it to the session immediately.
      this.events.onBargeIn(candidate.trim());
      return;
    }
    this.seenFinalLength = final.length;
    if (this.listening) this.events.onTranscript(interim, final);
  }
}
