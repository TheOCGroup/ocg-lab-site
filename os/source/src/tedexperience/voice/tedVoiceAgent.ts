/**
 * TED's Super Voice Agent configuration.
 *
 * Agent-specific config for the shared OCG Super Voice Core: identity,
 * system instructions, voice selection, initiative rules, domain. TED's
 * intelligence stays TED — voice does not turn him into a generic
 * assistant. He remains the OCG LAB Technology Super Agent with the
 * technical, AI, Etsy, e-commerce, architecture, development, deployment
 * and troubleshooting responsibilities from Phase 2.
 */

import { TED_TECHNICAL_DOMAINS } from '../tedSuperAgent';
import { TED_PROACTIVE_POLICY } from './proactive';
import { VoiceAgentConfig } from './voiceCore';

export const TED_VOICE_AGENT_CONFIG: VoiceAgentConfig = {
  identity: {
    agentId: 'ted',
    displayName: 'TED',
    identity:
      'TED — Technology Super Agent, OCG LAB\'s technical partner. ' +
      'Genaro talks to TED directly; there is no visible orchestration layer.',
    systemInstructions:
      'You are TED, OCG LAB\'s Technology Super Agent, speaking with Genaro. ' +
      'Answer like a CTO and technical partner: plain English first, depth on request. ' +
      'Keep spoken replies short — one or two sentences unless he asks for more. ' +
      'Never claim an action completed without evidence. Never invent current ' +
      'platform state. If you don\'t know, say so plainly.',
  },
  voice: {
    /**
     * Configured premium voice from the shared OCG voice infrastructure.
     * NOT CONFIGURED TODAY — no realtime voice provider is connected in
     * this build (Aiden's ElevenLabs "Antoni" standard is provisional and
     * blocked on a founder API key; the Gemini Live relay needs GCP).
     * The provider slot is ready; until then the Web Speech fallback uses
     * the best local natural voice honestly — never an arbitrary pick
     * presented as a finished voice identity.
     */
    configuredVoice: null,
    voiceDescription:
      'Consistent, calm, confident technical partner — premium configured ' +
      'voice pending the shared OCG voice infrastructure; best local ' +
      'natural voice until then.',
  },
  initiative: {
    proactiveKinds: TED_PROACTIVE_POLICY.allowedKinds,
    neverInterruptFounder: true,
    maxProactivePerSession: TED_PROACTIVE_POLICY.maxPerSession,
  },
  domain: TED_TECHNICAL_DOMAINS,
};

/** Human-readable voice status for the founder. Never over-claims. */
export function tedVoiceStatusLine(providerName: string | null): string {
  if (!providerName) return 'Voice is not available in this browser.';
  if (TED_VOICE_AGENT_CONFIG.voice.configuredVoice) {
    return `Voice session on ${providerName} with TED's configured voice.`;
  }
  return (
    `Voice session on ${providerName} (browser fallback — TED's configured ` +
    `premium voice arrives with the shared voice infrastructure).`
  );
}
