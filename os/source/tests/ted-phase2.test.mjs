/**
 * TED Super Agent — Phase 2 tests.
 *
 * Covers: voice truthfulness + state transitions + text fallback, technical
 * domain routing, current-info -> research requirement, internal OCG LAB
 * knowledge path, execution fail-closed without tools, evidence-required
 * completion with mocked tools, Etsy policy/account-action routing, no fake
 * deployment/build/storefront claims, and the Phase 2 acceptance flow.
 *
 * Pure modules are imported and exercised directly (the test runner is
 * `npx tsx --test`, so TypeScript imports work). UI contracts are asserted
 * against source text, matching the existing suite's pattern.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  TedVoiceController,
  detectVoiceSupport,
  selectVoice,
  stripMarkdownForSpeech,
  friendlyVoiceError,
} from '../src/tedexperience/tedVoice.ts';
import { classifyIntent, isVoiceCommand, toolForMessage } from '../src/tedexperience/tedRouter.ts';
import {
  getAvailableResearchProvider,
  registerResearchProvider,
  unregisterResearchProvider,
  requestResearch,
  needsCurrentInfo,
  formatResearchResult,
  researchUnavailableReply,
} from '../src/tedexperience/tedResearch.ts';
import {
  getTool,
  setToolAvailability,
  requestExecution,
  isExecutionRequest,
  mapActionToTool,
} from '../src/tedexperience/tedTools.ts';
import { detectTechnicalDomain, technicalGuidanceReply } from '../src/tedexperience/tedSuperAgent.ts';
import {
  isEtsyAccountAction,
  isEtsyPolicyQuestion,
  etsyAccountActionReply,
} from '../src/tedexperience/tedEtsy.ts';
import { isInternalOcgQuestion, getInternalKnowledgeBrief, formatKnowledgeBrief } from '../src/tedexperience/tedKnowledge.ts';
import { tedPersonaRespond, initialPersonaState } from '../src/tedexperience/tedPersona.ts';

const chat = fs.readFileSync(new URL('../src/tedexperience/components/TedChat.tsx', import.meta.url), 'utf8');
const page = fs.readFileSync(new URL('../src/pages/TedExperiencePage.tsx', import.meta.url), 'utf8');
const voiceSrc = fs.readFileSync(new URL('../src/tedexperience/tedVoice.ts', import.meta.url), 'utf8');
const personaSrc = fs.readFileSync(new URL('../src/tedexperience/tedPersona.ts', import.meta.url), 'utf8');

// ---------------------------------------------------------------------------
// Voice: truthfulness
// ---------------------------------------------------------------------------

test('voice never claims to be connected before a full round trip works', () => {
  assert.match(voiceSrc, /never claims voice is connected/i);
  assert.match(voiceSrc, /voiceConnected/);
  assert.match(voiceSrc, /Full round trip/);
});

test('voice capability detection is honest on runtimes with no speech APIs', () => {
  assert.deepEqual(detectVoiceSupport({}), { recognition: false, synthesis: false });
  assert.deepEqual(
    detectVoiceSupport({ RecognitionCtor: function () {}, synthesis: {}, UtteranceCtor: function () {} }),
    { recognition: true, synthesis: true },
  );
});

function makeRuntime() {
  const rec = {
    lang: '',
    interimResults: false,
    continuous: false,
    onresult: null,
    onerror: null,
    onend: null,
    started: false,
    start() { this.started = true; },
    stop() { this.started = false; },
    abort() { this.started = false; },
    emitResult(finalText) {
      const event = {
        resultIndex: 0,
        results: [{ 0: { transcript: finalText }, isFinal: true, length: 1 }],
      };
      if (this.onresult) this.onresult(event);
    },
    emitError(code) { if (this.onerror) this.onerror({ error: code }); },
    end() { if (this.onend) this.onend(); },
  };
  const utterances = [];
  const synthesis = {
    spoken: [],
    speak(u) { this.spoken.push(u); },
    cancel() {},
    getVoices() { return [{ name: 'Google US English', lang: 'en-US', localService: false }]; },
    speaking: false,
  };
  function Utterance(text) {
    this.text = text;
    this.voice = null;
    this.rate = 1;
    this.pitch = 1;
    this.onend = null;
    this.onerror = null;
  }
  const events = { states: [], transcripts: [], errors: [], speaking: [] };
  const controller = new TedVoiceController(
    { RecognitionCtor: function () { return rec; }, synthesis, UtteranceCtor: Utterance },
    {
      onStateChange: (s) => events.states.push(s),
      onTranscript: (i, f) => events.transcripts.push([i, f]),
      onError: (k, m) => events.errors.push([k, m]),
      onSpeakingChange: (s) => events.speaking.push(s),
    },
  );
  return { rec, synthesis, utterances, events, controller };
}

test('voice state transitions: listening -> processing -> speaking -> idle, then connected', () => {
  const { rec, utterances, events, controller } = makeRuntime();
  assert.equal(controller.voiceConnected, false);
  controller.startListening();
  assert.equal(controller.state, 'listening');
  rec.emitResult('hello TED');
  assert.ok(events.transcripts.some(([, f]) => f.includes('hello TED')));
  rec.end();
  assert.equal(controller.state, 'processing');
  controller.speak('Hi Genaro');
  assert.equal(controller.state, 'speaking');
  assert.equal(utterances.length, 0); // utterances tracked via synthesis.spoken
  const spoken = controller['runtime'].synthesis.spoken;
  assert.equal(spoken.length, 1);
  assert.equal(spoken[0].voice.name, 'Google US English');
  spoken[0].onend();
  assert.equal(controller.state, 'idle');
  assert.equal(controller.voiceConnected, true, 'full round trip completed: mic -> transcript -> spoken reply');
});

test('voice permission denial fails cleanly and preserves text chat', () => {
  const { rec, events, controller } = makeRuntime();
  controller.startListening();
  rec.emitError('not-allowed');
  assert.equal(controller.state, 'idle');
  assert.ok(events.errors.some(([k]) => k === 'permission-denied'));
  const msg = friendlyVoiceError('permission-denied');
  assert.match(msg, /Microphone access was blocked/);
  assert.match(msg, /Typing still works/);
});

test('voice on an unsupported runtime reports not-supported honestly', () => {
  const events = { states: [], transcripts: [], errors: [], speaking: [] };
  const controller = new TedVoiceController(
    {},
    {
      onStateChange: (s) => events.states.push(s),
      onTranscript: (i, f) => events.transcripts.push([i, f]),
      onError: (k, m) => events.errors.push([k, m]),
      onSpeakingChange: (s) => events.speaking.push(s),
    },
  );
  controller.startListening();
  assert.ok(events.errors.some(([k]) => k === 'not-supported'));
  assert.match(events.errors[0][1], /browser with speech recognition/);
  assert.equal(controller.voiceConnected, false);
});

test('speaking can be interrupted via cancel', () => {
  const { controller } = makeRuntime();
  controller.startListening();
  controller.speak('a long answer');
  assert.equal(controller.state, 'speaking');
  controller.cancelSpeaking();
  assert.equal(controller.state, 'idle');
  assert.equal(controller.voiceConnected, false, 'interrupted speech is not a completed round trip');
});

test('voice selection prefers a natural voice over the robotic default', () => {
  const picked = selectVoice([
    { name: 'Default', lang: 'en-US', localService: true },
    { name: 'Microsoft Aria Online (Natural)', lang: 'en-US', localService: false },
  ]);
  assert.equal(picked.name, 'Microsoft Aria Online (Natural)');
  assert.equal(selectVoice([]), null);
});

test('markdown is stripped before speech so TED sounds natural', () => {
  const out = stripMarkdownForSpeech('**Stripe** setup:\n• Create a `PaymentIntent`\n• Handle [webhooks](https://x.com)');
  assert.ok(!out.includes('**') && !out.includes('•') && !out.includes('https://x.com'));
  assert.match(out, /Stripe setup/);
});

// ---------------------------------------------------------------------------
// Routing: technical questions, current info, internal knowledge
// ---------------------------------------------------------------------------

test('acceptance: "best way to connect Stripe" is a technical question with CTO-level guidance', () => {
  assert.equal(classifyIntent("TED, what's the best way to connect Stripe to this app?"), 'technical-question');
  assert.equal(detectTechnicalDomain('connect Stripe to this app'), 'payments');
  const result = tedPersonaRespond("TED, what's the best way to connect Stripe to this app?", initialPersonaState());
  assert.match(result.reply, /secret key/i);
  assert.match(result.reply, /server-side/);
  assert.match(result.reply, /webhook/i);
  assert.match(result.reply, /test mode/i);
});

test('technical guidance never fabricates current platform state', () => {
  const reply = technicalGuidanceReply('how should we set up webhooks for our API?');
  assert.ok(!/^\s*Done/i.test(reply));
  assert.match(reply, /APIs|webhook/i);
});

test('acceptance: "what\'s new with Etsy digital products" requires research and fails closed', () => {
  assert.equal(classifyIntent("What's new with Etsy digital products right now?"), 'etsy-policy');
  assert.equal(needsCurrentInfo("What's new with Etsy digital products right now?"), true);
  const result = tedPersonaRespond("What's new with Etsy digital products right now?", initialPersonaState());
  assert.match(result.reply, /don't have live web access/i);
  assert.ok(!result.reply.includes('Etsy just announced'), 'must not invent current platform status');
  assert.ok(!/policy (is|was) \d/.test(result.reply), 'no fabricated policy facts');
});

test('research fails closed when no provider is connected', async () => {
  assert.equal(getAvailableResearchProvider(), null);
  const outcome = await requestResearch('latest Etsy fees');
  assert.equal(outcome.status, 'unavailable');
  assert.match(outcome.reason, /No live research provider/);
  assert.match(researchUnavailableReply('latest Etsy fees'), /won't dress up stale knowledge/);
});

test('research with a connected provider cites sources with dates', async () => {
  registerResearchProvider({
    id: 'mock-search',
    name: 'Mock Search',
    isAvailable: () => true,
    research: async (q) => ({
      query: q,
      providerId: 'mock-search',
      summary: 'Etsy updated digital delivery docs.',
      sources: [{ title: 'Etsy Seller Handbook', url: 'https://example.com/handbook', publishedAt: '2026-09-01' }],
      evidenceDate: '2026-10-02',
    }),
  });
  const outcome = await requestResearch('etsy digital delivery');
  assert.equal(outcome.status, 'ok');
  const text = formatResearchResult(outcome.result);
  assert.match(text, /Etsy Seller Handbook/);
  assert.match(text, /2026-09-01/);
  assert.match(text, /2026-10-02/);
  unregisterResearchProvider('mock-search');
  assert.equal(getAvailableResearchProvider(), null);
});

test('internal OCG LAB questions use the recorded knowledge path with evidence labels', () => {
  assert.equal(classifyIntent('What are our known blockers?'), 'internal-ocg');
  assert.equal(isInternalOcgQuestion('What did we decide about QA?'), true);
  const brief = getInternalKnowledgeBrief('What did we decide about QA?');
  const text = formatKnowledgeBrief(brief);
  assert.match(text, /recorded/);
  assert.match(text, /live check needed/);
  assert.match(text, /Recorded knowledge base v/);
});

test('voice command "read that answer to me" routes to speaking the last reply', () => {
  assert.equal(isVoiceCommand('Read that answer to me.'), true);
  assert.equal(classifyIntent('Read that answer to me.'), 'voice-command');
  const result = tedPersonaRespond('Read that answer to me.', initialPersonaState());
  assert.equal(result.speak, 'last');
});

// ---------------------------------------------------------------------------
// Execution: fail closed without tools, evidence required with tools
// ---------------------------------------------------------------------------

test('execution request without a connected tool fails closed honestly', () => {
  assert.equal(isExecutionRequest('Deploy this to production.'), true);
  assert.equal(isExecutionRequest('How do I deploy this?'), false, 'questions are not execution requests');
  assert.equal(isExecutionRequest("What's the best way to connect Stripe?"), false);
  assert.equal(mapActionToTool('Deploy this to production.'), getTool('deployment'));
  const result = tedPersonaRespond('Deploy this to production.', initialPersonaState());
  assert.match(result.reply, /no .* connect|cannot|can't/i);
  assert.ok(!/^\s*Done\b/m.test(result.reply), 'never claims completion');
  assert.ok(!/deployed/i.test(result.reply) || /not connected|can.?t|cannot/i.test(result.reply));
});

test('mocked tool without evidence cannot produce a completion claim', () => {
  assert.equal(setToolAvailability('deployment', true), true);
  const outcome = requestExecution('deployment', 'deploying the app');
  assert.equal(outcome.status, 'failed');
  assert.match(outcome.message, /no verifiable evidence/i);
  setToolAvailability('deployment', false);
});

test('mocked tool with evidence produces a verified completion claim', () => {
  setToolAvailability('deployment', true);
  const outcome = requestExecution('deployment', 'deploying the app', {
    proof: 'HTTP 200 at / (deploy 6aa6c8a)',
    verifiedAt: '2026-10-02',
  });
  assert.equal(outcome.status, 'executed');
  assert.match(outcome.message, /verified/i);
  assert.match(outcome.message, /HTTP 200/);
  setToolAvailability('deployment', false);
  assert.equal(getTool('deployment').available, false);
});

test('all execution tools report unavailable with specific reasons in this build', () => {
  for (const tool of ['repo-code', 'local-build-test', 'deployment', 'site-verification', 'database-api', 'ecommerce-platform', 'etsy-ops', 'file-artifact', 'live-research']) {
    const t = getTool(tool);
    assert.ok(t, `${tool} is registered`);
    assert.equal(t.available, false, `${tool} must not pretend to be connected`);
    assert.ok(t.unavailableReason.length > 10, `${tool} explains why`);
  }
});

test('unknown tool ids fail closed instead of executing', () => {
  const outcome = requestExecution('teleport', 'teleporting');
  assert.equal(outcome.status, 'failed');
});

// ---------------------------------------------------------------------------
// Etsy: policy vs structural vs account action
// ---------------------------------------------------------------------------

test('acceptance: "Update my Etsy listing." is refused honestly without auth', () => {
  assert.equal(isEtsyAccountAction('Update my Etsy listing.'), true);
  assert.equal(classifyIntent('Update my Etsy listing.'), 'etsy-action');
  const result = tedPersonaRespond('Update my Etsy listing.', initialPersonaState());
  assert.match(result.reply, /Etsy write access is not connected/i);
  assert.ok(!/Done|updated your listing/i.test(result.reply));
  assert.match(etsyAccountActionReply(), /draft the exact new title/i);
});

test('Etsy structural questions get real guidance; policy questions go to research', () => {
  assert.equal(isEtsyPolicyQuestion('Did Etsy change its fees?'), true);
  assert.equal(isEtsyPolicyQuestion('How should I structure my Etsy tags?'), false);
  const result = tedPersonaRespond('How should I structure my Etsy tags for better discovery?', initialPersonaState());
  assert.match(result.reply, /tags/i);
  assert.ok(!result.reply.includes('fee is now'), 'no invented fee facts');
});

test('no fake deployment, build, or storefront claims anywhere in execution replies', () => {
  for (const msg of [
    'Deploy the app now.',
    'Build me a new checkout page.',
    'Publish my storefront.',
    'Connect the database.',
  ]) {
    const result = tedPersonaRespond(msg, initialPersonaState());
    assert.ok(!/^(Done|Deployed|Published|Complete)/m.test(result.reply), `"${msg}" must not claim completion`);
    assert.match(result.reply, /no \w+ .*connect|not connected|not wired|cannot/i);
  }
});

// ---------------------------------------------------------------------------
// UI contracts: real voice states, simplified UI intact
// ---------------------------------------------------------------------------

test('composer mic reflects real voice session states without clutter', () => {
  assert.match(chat, /TedVoiceUiState/);
  assert.match(chat, /'listening'/);
  assert.match(chat, /'thinking'/);
  assert.match(chat, /'speaking'/);
  assert.match(chat, /'reconnecting'/);
  assert.match(chat, /Listening — just talk/);
  assert.match(chat, /Speaking — mic interrupts/);
  assert.match(chat, /Start a voice conversation with TED/);
  assert.match(chat, /End session/);
  assert.match(chat, /Voice not available in this browser/);
  assert.ok(!chat.includes('Voice coming soon'), 'coming-soon placeholder is replaced by real voice');
  assert.ok(!chat.includes('Voice not connected in this build'), 'no permanent voice notice');
});

test('page wires the super voice session: transcript, speak-back, research follow-up', () => {
  assert.match(page, /SuperVoiceSession/);
  assert.match(page, /WebSpeechVoiceProvider/);
  assert.match(page, /TED_VOICE_AGENT_CONFIG/);
  assert.match(page, /handleMicTap/);
  assert.match(page, /handleEndSession/);
  assert.match(page, /interruptToListen/);
  assert.match(page, /speakAloud/);
  assert.match(page, /runResearch/);
  assert.match(page, /voiceTranscript/);
  assert.match(page, /result\.speak === 'last'/);
  assert.match(page, /viaSession/);
  assert.match(page, /notifyProactive/);
});

test('persona exposes speak and researchQuery on every result', () => {
  assert.match(personaSrc, /speak: 'last' \| null/);
  assert.match(personaSrc, /researchQuery: string \| null/);
  assert.match(personaSrc, /classifyIntent\(message\)/);
});

test('Phase 2 keeps the simplified founder UI intact', () => {
  const block = chat.match(/const SUGGESTIONS = \[([\s\S]*?)\];/);
  assert.ok(block, 'SUGGESTIONS block must exist');
  const entries = block[1].match(/\{ label:/g) || [];
  assert.ok(entries.length <= 2, `at most two suggestion pills, found ${entries.length}`);
  assert.ok(!chat.includes('More from OCG LAB'), 'no OS nav in chat');
  assert.match(chat, /What do you want to build\?/);
});
