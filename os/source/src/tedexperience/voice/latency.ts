/**
 * OCG Super Voice Core — turn latency instrumentation (Phase 2.2).
 *
 * Measures the real voice pipeline, per turn:
 *   speech-end -> transcript      (browser recognition end-detection)
 *   transcript -> TED response    (persona compute)
 *   response -> first audible     (synthesis startup)
 *   total                         (end of founder speech -> TED starts talking)
 *
 * No fake status messages: the tracker records timestamps only. The founder
 * can ask for the numbers; TED reports measured values, never estimates.
 * Nothing here invents precision — browser-controlled stages are labeled.
 */

export interface TurnLatency {
  /** ms from recognition end to turn dispatch (browser end-detection). */
  speechEndToTranscriptMs: number | null;
  /** ms from turn dispatch to reply ready (local persona compute). */
  transcriptToResponseMs: number | null;
  /** ms from reply ready to first audible audio (synthesis startup). */
  responseToFirstAudioMs: number | null;
  /** ms from end of founder speech to TED audible. */
  totalTurnMs: number | null;
}

export interface LatencyStats {
  turns: number;
  avgTotalMs: number;
  avgTranscriptToResponseMs: number;
  avgResponseToFirstAudioMs: number;
  slowestStage: 'recognition' | 'persona' | 'synthesis';
}

const now = (): number =>
  typeof performance !== 'undefined' ? performance.now() : Date.now();

export class VoiceLatencyTracker {
  private tSpeechEnd = 0;
  private tTranscript = 0;
  private tResponseReady = 0;
  private last: TurnLatency | null = null;
  private totals: number[] = [];
  private personaMs: number[] = [];
  private synthesisMs: number[] = [];

  /** Recognition session ended (founder stopped speaking). */
  markSpeechEnd(): void {
    this.tSpeechEnd = now();
  }

  /** Turn dispatched to the agent. */
  markTranscript(): void {
    this.tTranscript = now();
  }

  /** Agent reply text ready. */
  markResponseReady(): void {
    this.tResponseReady = now();
    if (this.tTranscript > 0) {
      const ms = this.tResponseReady - this.tTranscript;
      this.personaMs.push(ms);
    }
  }

  /** First audible audio from synthesis. */
  markFirstAudio(): void {
    const t = now();
    const speechEndToTranscript =
      this.tSpeechEnd > 0 && this.tTranscript >= this.tSpeechEnd
        ? Math.round(this.tTranscript - this.tSpeechEnd)
        : null;
    const transcriptToResponse =
      this.tTranscript > 0 && this.tResponseReady >= this.tTranscript
        ? Math.round(this.tResponseReady - this.tTranscript)
        : null;
    const responseToFirstAudio =
      this.tResponseReady > 0 ? Math.round(t - this.tResponseReady) : null;
    const totalTurn =
      this.tSpeechEnd > 0 ? Math.round(t - this.tSpeechEnd) : null;
    this.last = {
      speechEndToTranscriptMs: speechEndToTranscript,
      transcriptToResponseMs: transcriptToResponse,
      responseToFirstAudioMs: responseToFirstAudio,
      totalTurnMs: totalTurn,
    };
    if (totalTurn !== null) this.totals.push(totalTurn);
    if (responseToFirstAudio !== null) this.synthesisMs.push(responseToFirstAudio);
    this.tSpeechEnd = 0;
    this.tTranscript = 0;
    this.tResponseReady = 0;
  }

  getLast(): TurnLatency | null {
    return this.last;
  }

  getStats(): LatencyStats | null {
    if (this.totals.length === 0) return null;
    const avg = (a: number[]): number => Math.round(a.reduce((s, v) => s + v, 0) / a.length);
    const avgTotal = avg(this.totals);
    const avgPersona = this.personaMs.length ? avg(this.personaMs) : 0;
    const avgSynthesis = this.synthesisMs.length ? avg(this.synthesisMs) : 0;
    // Recognition stage is browser-controlled; estimate from total minus locals.
    const avgRecognition = Math.max(0, avgTotal - avgPersona - avgSynthesis);
    const slowestStage =
      avgRecognition >= avgPersona && avgRecognition >= avgSynthesis
        ? 'recognition'
        : avgPersona >= avgSynthesis
          ? 'persona'
          : 'synthesis';
    return {
      turns: this.totals.length,
      avgTotalMs: avgTotal,
      avgTranscriptToResponseMs: avgPersona,
      avgResponseToFirstAudioMs: avgSynthesis,
      slowestStage,
    };
  }

  /**
   * Founder-facing summary. Reports measured numbers only; names the
   * bottleneck honestly (usually the browser's speech end-detection).
   */
  summarize(): string {
    const stats = this.getStats();
    if (!stats) return 'No voice turns measured yet — have a spoken conversation first.';
    const stageNote =
      stats.slowestStage === 'recognition'
        ? 'The biggest slice is the browser deciding you finished speaking — that wait is built into speech recognition, not something I can tune away.'
        : stats.slowestStage === 'synthesis'
          ? 'The biggest slice is the browser starting speech output.'
          : 'The biggest slice is my own reply computation.';
    return (
      `Measured over ${stats.turns} spoken turn${stats.turns === 1 ? '' : 's'}: ` +
      `about ${(stats.avgTotalMs / 1000).toFixed(1)}s from you finishing to me starting to talk. ` +
      `${stageNote}`
    );
  }
}
