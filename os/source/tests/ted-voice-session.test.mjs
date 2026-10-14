/**
 * TED Super Voice Agent — Phase 2.1 session tests.
 *
 * Covers the OCG Super Voice Core: persistent session lifecycle, automatic
 * turn-taking, barge-in with immediate speech cancellation, turn detection,
 * echo guard, proactive speech policy, reconnect with truthful failure,
 * provider honesty, and TED's voice identity.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  SuperVoiceSession,
} from '../src/tedexperience/voice/voiceCore.ts';
import { WebSpeechVoiceProvider } from '../src/tedexperience/voice/webSpeechProvider.ts';
import {
  UtteranceEndTurnDetector,
  isRealTurn,
  isEcho,
} from '../src/tedexperience/voice/turnDetection.ts';
import {
  makeProactiveEvent,
  renderProactiveText,
  TED_PROACTIVE_POLICY,
} from '../src/tedexperience/voice/proactive.ts';
import { TED_VOICE_AGENT_CONFIG } from '../src/tedexperience/voice/tedVoiceAgent.ts';

const tick = (ms = 20) => new Promise((r) => setTimeout(r, ms));

/** Mock transport implementing the VoiceProvider surface. */
class MockProvider {
  events = null;
  capabilities = {
    continuousListening: true,
    serverVad: false,
    voiceBargeIn: true,
    streamingSpeech: false,
  };
  spoken = [];
  cancelled = 0;
  listening = false;
  connected = false;
  failConnect = false;
  _speaking = false;
  connectCalls = 0;

  get id() { return 'mock-provider'; }
  get kind() { return 'web-speech'; }
  get name() { return 'Mock'; }
  get isSpeaking() { return this._speaking; }

  async connect() {
    this.connectCalls++;
    if (this.failConnect) throw new Error('mock connection refused');
    this.connected = true;
  }
  disconnect() { this.connected = false; this.listening = false; }
  startListening() { this.listening = true; }
  stopListening() { this.listening = false; }
  speak(text) { this._speaking = true; this.spoken.push(text); }
  cancelSpeech() { this.cancelled++; this._speaking = false; }

  // test drivers
  turn(transcript) { this.events.onTurnComplete(transcript); }
  bargeIn(transcript) { this.events.onBargeIn(transcript); }
  speechEnded() { this._speaking = false; this.events.onSpeechEnded(); }
  loseConnection() { this.events.onConnectionLost(); }
}

function makeSession(provider, handlers = {}) {
  const states = [];
  const turns = [];
  const ended = [];
  const session = new SuperVoiceSession(provider, TED_VOICE_AGENT_CONFIG, {
    onStateChange: (s) => states.push(s),
    onUserTurn: async (t) => {
      turns.push(t);
      return `Reply to: ${t}`;
    },
    onSessionEnded: (reason) => ended.push(reason),
    ...handlers,
  });
  provider.events = {
    onTranscript: () => {},
    onTurnComplete: (t) => session.handleTurnComplete(t),
    onBargeIn: (t) => session.handleBargeIn(t),
    onSpeechStarted: () => {},
    onSpeechEnded: () => session.handleSpeechEnded(),
    onError: () => {},
    onConnectionLost: () => session.handleConnectionLost(),
    onConnectionRestored: () => {},
  };
  return { session, states, turns, ended };
}

test('acceptance: one click opens a persistent conversation with auto turn-taking', async () => {
  const provider = new MockProvider();
  const { session, states, turns } = makeSession(provider);
  await session.start();
  assert.deepEqual(states, ['connecting', 'listening']);

  // Turn 1 — no mic press needed beyond the session start.
  provider.turn('TED, I want to build an AI product for real estate investors.');
  await tick();
  assert.deepEqual(turns, ['TED, I want to build an AI product for real estate investors.']);
  assert.ok(states.includes('thinking'));
  assert.ok(states.includes('speaking'));
  assert.equal(provider.spoken[0], 'Reply to: TED, I want to build an AI product for real estate investors.');

  // TED finishes -> automatically resumes listening (no click).
  provider.speechEnded();
  await tick();
  assert.equal(states[states.length - 1], 'listening');
  assert.equal(provider.listening, true);

  // Turn 2 — still no mic press.
  provider.turn('Okay, but how would we make money from it?');
  await tick();
  assert.equal(turns.length, 2);
  assert.equal(turns[1], 'Okay, but how would we make money from it?');
});

test('acceptance: barge-in stops speech immediately and keeps context', async () => {
  const provider = new MockProvider();
  const { session, turns } = makeSession(provider);
  await session.start();
  provider.turn('Tell me about APIs.');
  await tick();
  assert.equal(provider.spoken.length, 1);

  // Founder interrupts mid-speech.
  provider.bargeIn('Wait — what about Etsy?');
  await tick(50);
  assert.equal(provider.cancelled, 1, 'speech cancelled immediately on barge-in');
  assert.equal(turns[turns.length - 1], 'Wait — what about Etsy?');
  await tick();
  assert.equal(provider.spoken.length, 2, 'interruption answered as the next turn');
});

test('empty transcripts never become turns', async () => {
  const provider = new MockProvider();
  const { session, states, turns } = makeSession(provider);
  await session.start();
  const before = states.length;
  provider.turn('   ');
  await tick();
  assert.equal(turns.length, 0);
  assert.equal(states[states.length - 1], 'listening', 'resumes listening on empty turn');
  assert.ok(states.length > before);
});

test('turn detection filters filler and requires substance', () => {
  assert.equal(isRealTurn(''), false);
  assert.equal(isRealTurn('uh'), false);
  assert.equal(isRealTurn('mm-hmm'), false);
  assert.equal(isRealTurn('okay'), false);
  assert.equal(isRealTurn('What about Etsy?'), true);
  assert.equal(isRealTurn('a'), false);
});

test('utterance-end detector emits only real turns', () => {
  const emitted = [];
  const detector = new UtteranceEndTurnDetector({ onTurn: (t) => emitted.push(t) });
  detector.utteranceEnded('  ');
  detector.utteranceEnded('uh');
  detector.utteranceEnded('How do webhooks work?');
  assert.deepEqual(emitted, ['How do webhooks work?']);
});

test('echo guard ignores TED hearing himself', () => {
  const speaking = 'Stripe webhooks are the source of truth for payment success.';
  // Exact echo of what TED is saying.
  assert.equal(isEcho('Stripe webhooks are the source of truth', speaking, 2000), true);
  // Inside the grace period.
  assert.equal(isEcho('Wait, what about Etsy?', speaking, 200), true);
  // Too short to be intentional.
  assert.equal(isEcho('hey', speaking, 2000), true);
  // Genuine interruption after the grace period.
  assert.equal(isEcho('Wait, what about Etsy?', speaking, 2000), false);
});

test('proactive: urgent speaks now, notable queues, routine stays silent', async () => {
  const provider = new MockProvider();
  const { session } = makeSession(provider);
  await session.start();

  session.notifyProactive(makeProactiveEvent('research-finished', 'Research is done: X.', 'r1'));
  await tick();
  assert.ok(provider.spoken.some((s) => s.includes('Research is done')), 'notable event spoken at natural pause');

  const spokenBefore = provider.spoken.length;
  session.notifyProactive(makeProactiveEvent('build-failed', 'x', 'r2', 'routine'));
  await tick();
  assert.equal(provider.spoken.length, spokenBefore, 'routine events stay silent');

  // Dedupe: same key speaks once.
  session.notifyProactive(makeProactiveEvent('research-finished', 'Research is done: X.', 'r1'));
  await tick();
  assert.equal(provider.spoken.filter((s) => s.includes('Research is done')).length, 1);
});

test('proactive: urgent interrupts TED speech but never the founder', async () => {
  const provider = new MockProvider();
  const { session } = makeSession(provider);
  await session.start();
  provider.turn('Tell me a long story.');
  await tick();
  assert.equal(provider.spoken.length, 1);

  session.notifyProactive(makeProactiveEvent('build-failed', 'The build just failed on tests.', 'b1'));
  await tick();
  assert.equal(provider.cancelled, 1, 'urgent event interrupts TED speech');
  assert.ok(provider.spoken[provider.spoken.length - 1].includes('build just failed'));
});

test('proactive goes quiet after the per-session cap', async () => {
  const provider = new MockProvider();
  const { session } = makeSession(provider);
  await session.start();
  for (let i = 0; i < 6; i++) {
    session.notifyProactive(makeProactiveEvent('risk-identified', `Risk ${i}.`, `risk-${i}`));
    await tick();
  }
  assert.ok(
    provider.spoken.length <= TED_PROACTIVE_POLICY.maxPerSession,
    `at most ${TED_PROACTIVE_POLICY.maxPerSession} proactive utterances per session`,
  );
});

test('reconnect: transient drop recovers, persistent failure ends truthfully', async () => {
  const provider = new MockProvider();
  const { session, states, ended } = makeSession(provider);
  await session.start();

  const waitFor = async (pred, timeoutMs) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (pred()) return true;
      await tick(100);
    }
    return pred();
  };

  // Transient: first reconnect attempt fails, second succeeds.
  let attempts = 0;
  const realConnect = provider.connect.bind(provider);
  provider.connect = async () => {
    attempts++;
    if (attempts === 1) throw new Error('blip');
    return realConnect();
  };
  provider.loseConnection();
  assert.ok(await waitFor(() => states[states.length - 1] === 'listening', 6000), 'session recovers after transient drop');
  assert.ok(states.includes('reconnecting'));

  // Persistent: all attempts fail -> truthful end, no fake "connected".
  provider.failConnect = true;
  provider.loseConnection();
  assert.ok(await waitFor(() => ended.length > 0, 12000), 'session ends after exhausting reconnect budget');
  assert.ok(states.includes('error'));
  assert.match(ended[ended.length - 1], /could not be restored|lost/i);
  assert.equal(session.isActive, false);
});

test('explicit end-conversation control stops everything', async () => {
  const provider = new MockProvider();
  const { session, states, ended } = makeSession(provider);
  await session.start();
  provider.turn('Hi.');
  await tick();
  session.end();
  assert.equal(states[states.length - 1], 'ended');
  assert.equal(provider.listening, false);
  assert.equal(provider.connected, false);
  assert.equal(session.isActive, false);
  assert.ok(ended.length > 0);
});

test('web speech provider refuses to fake a connection', async () => {
  const events = {
    onTranscript: () => {}, onTurnComplete: () => {}, onBargeIn: () => {},
    onSpeechStarted: () => {}, onSpeechEnded: () => {}, onError: () => {},
    onConnectionLost: () => {}, onConnectionRestored: () => {},
  };
  const provider = new WebSpeechVoiceProvider({}, events);
  assert.deepEqual(provider.capabilities.serverVad, false);
  assert.deepEqual(provider.capabilities.streamingSpeech, false);
  await assert.rejects(() => provider.connect(), /speech recognition/);
  assert.equal(provider.wasConnectFailed, true);
});

test('TED voice identity is honest: no configured premium voice yet', () => {
  const voice = TED_VOICE_AGENT_CONFIG.voice;
  assert.equal(voice.configuredVoice, null, 'no fake premium voice claimed');
  assert.match(voice.voiceDescription, /fallback|pending/i);
  assert.equal(TED_VOICE_AGENT_CONFIG.identity.agentId, 'ted');
  assert.ok(TED_VOICE_AGENT_CONFIG.domain.length > 20, 'Phase 2 technical domains preserved');
  assert.equal(TED_VOICE_AGENT_CONFIG.initiative.neverInterruptFounder, true);
});

test('proactive text rendering is short and plain', () => {
  const text = renderProactiveText('decision-needed', 'Should we use Postgres or Supabase?');
  assert.ok(text.length < 300, 'voice utterances stay terse');
  assert.match(text, /your call/i);
});

test('core is provider-independent: no agent imports in shared modules', () => {
  const core = fs.readFileSync(new URL('../src/tedexperience/voice/voiceCore.ts', import.meta.url), 'utf8');
  const turn = fs.readFileSync(new URL('../src/tedexperience/voice/turnDetection.ts', import.meta.url), 'utf8');
  const proactive = fs.readFileSync(new URL('../src/tedexperience/voice/proactive.ts', import.meta.url), 'utf8');
  for (const [name, src] of [['voiceCore', core], ['turnDetection', turn], ['proactive', proactive]]) {
    assert.ok(!src.includes('tedPersona'), `${name} must not import TED's persona`);
    assert.ok(!src.includes('TED_VOICE_AGENT_CONFIG'), `${name} must not contain TED's config`);
  }
  const agent = fs.readFileSync(new URL('../src/tedexperience/voice/tedVoiceAgent.ts', import.meta.url), 'utf8');
  assert.match(agent, /TED_VOICE_AGENT_CONFIG/);
});

test('ACCEPTANCE: full founder scenario with the real persona — context survives voice turns, barge-in, and text', async () => {
  const { tedPersonaRespond, initialPersonaState } = await import('../src/tedexperience/tedPersona.ts');
  const provider = new MockProvider();
  let personaState = initialPersonaState();
  const spoken = [];
  const session = new SuperVoiceSession(provider, TED_VOICE_AGENT_CONFIG, {
    onStateChange: () => {},
    onUserTurn: async (transcript) => {
      const result = tedPersonaRespond(transcript, personaState);
      personaState = {
        context: result.context ?? personaState.context,
        recentQueries: [...personaState.recentQueries, transcript].slice(-6),
        operation: result.operation,
        ideaDraft: result.context?.kind === 'idea' ? `${personaState.ideaDraft ? personaState.ideaDraft + ' ' : ''}${transcript}`.slice(0, 500) : personaState.ideaDraft,
      };
      return result.reply;
    },
    onSessionEnded: () => {},
  });
  provider.events = {
    onTranscript: () => {}, onTurnComplete: (t) => session.handleTurnComplete(t),
    onBargeIn: (t) => session.handleBargeIn(t), onSpeechStarted: () => {},
    onSpeechEnded: () => session.handleSpeechEnded(), onError: () => {},
    onConnectionLost: () => session.handleConnectionLost(), onConnectionRestored: () => {},
  };
  // Speak captures what TED would say aloud.
  const origSpeak = provider.speak.bind(provider);
  provider.speak = (text) => { spoken.push(text); origSpeak(text); };

  await session.start();

  // 1. "TED, I want to build an AI product for real estate investors."
  provider.turn('TED, I want to build an AI product for real estate investors.');
  await tick(50);
  assert.ok(spoken[0].includes("let's work it") || spoken[0].includes('idea'), 'TED responds aloud to the idea');
  assert.ok(personaState.ideaDraft, 'idea context captured');
  provider.speechEnded();
  await tick();

  // 2. No click: "Okay, but how would we make money from it?"
  provider.turn('Okay, but how would we make money from it?');
  await tick(50);
  assert.equal(spoken.length, 2, 'second turn heard without touching the screen');
  assert.ok(personaState.ideaDraft.includes('real estate'), 'context maintained across voice turns');

  // 3. Interrupt while speaking: "Wait — what about Etsy?"
  provider.bargeIn('Wait — what about Etsy?');
  await tick(80);
  assert.equal(provider.cancelled, 1, 'TED stops speaking immediately');
  await tick(50);
  assert.equal(spoken.length, 3, 'interruption answered');
  assert.ok(/etsy/i.test(spoken[2]), 'response is about Etsy');

  // 4. Text turn keeps the same conversation (shared persona state).
  const textResult = tedPersonaRespond('What was my idea again?', personaState);
  assert.ok(personaState.ideaDraft.includes('real estate'), 'idea context survived voice turns and barge-in');
  assert.ok(/let's work it|captured/i.test(textResult.reply), 'typed message continues the shaping flow, not a cold fallback');

  session.end();
  assert.equal(session.isActive, false);
});
