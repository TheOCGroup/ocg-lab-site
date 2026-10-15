/**
 * TED Phase 2.2 — voice latency + tool bridge tests.
 *
 * Latency: the tracker records real timestamps per turn and reports measured
 * numbers only — no estimates, no fake precision.
 *
 * Bridge: the client handshake is real (mocked transport here), tokens are
 * required, and tool availability flips only on a verified handshake.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { VoiceLatencyTracker } from '../src/tedexperience/voice/latency.ts';
import { ToolBridgeClient } from '../src/tedexperience/tedToolBridge.ts';
import {
  syncBridgeTools,
  getTool,
  setToolAvailability,
} from '../src/tedexperience/tedTools.ts';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

test('latency tracker measures a full turn', async () => {
  const t = new VoiceLatencyTracker();
  t.markSpeechEnd();
  await sleep(30);
  t.markTranscript();
  await sleep(20);
  t.markResponseReady();
  await sleep(25);
  t.markFirstAudio();

  const last = t.getLast();
  assert.ok(last);
  assert.ok(last.speechEndToTranscriptMs >= 25, 'recognition stage measured');
  assert.ok(last.transcriptToResponseMs >= 15, 'persona stage measured');
  assert.ok(last.responseToFirstAudioMs >= 20, 'synthesis stage measured');
  assert.ok(last.totalTurnMs >= 70, 'total measured');
});

test('latency stats identify the slowest stage honestly', async () => {
  const t = new VoiceLatencyTracker();
  for (let i = 0; i < 3; i++) {
    t.markSpeechEnd();
    await sleep(50); // recognition dominates
    t.markTranscript();
    t.markResponseReady();
    t.markFirstAudio();
  }
  const stats = t.getStats();
  assert.equal(stats.turns, 3);
  assert.equal(stats.slowestStage, 'recognition');
  assert.ok(stats.avgTotalMs > 0);
});

test('latency summarize reports measured numbers, never estimates', async () => {
  const t = new VoiceLatencyTracker();
  assert.match(t.summarize(), /No voice turns measured yet/);
  t.markSpeechEnd();
  await sleep(10);
  t.markTranscript();
  t.markResponseReady();
  t.markFirstAudio();
  const s = t.summarize();
  assert.match(s, /Measured over 1 spoken turn/);
  assert.ok(!s.includes('estimate'), 'no estimates claimed');
});

test('bridge client discovers via real handshake only', async () => {
  const orig = globalThis.fetch;
  try {
    // No bridge running
    globalThis.fetch = () => Promise.reject(new Error('refused'));
    const c1 = new ToolBridgeClient('http://127.0.0.1:3777');
    assert.equal(await c1.discover(), null);
    assert.equal(c1.isConnected, false);

    // Bridge answers /health
    globalThis.fetch = (url, opts) => {
      if (String(url).endsWith('/health')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ok: true, version: '0.1.0', capabilities: [], projectRoot: '/x', policy: '' }),
        });
      }
      return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({ ok: false, error: 'nope' }) });
    };
    const c2 = new ToolBridgeClient('http://127.0.0.1:3777');
    const health = await c2.discover();
    assert.ok(health && health.ok);
    assert.equal(c2.isConnected, true);
    assert.equal(c2.bridgeHealth.version, '0.1.0');
  } finally {
    globalThis.fetch = orig;
  }
});

test('bridge calls require a token', async () => {
  const orig = globalThis.fetch;
  let sawToken = null;
  try {
    globalThis.fetch = (url, opts) => {
      sawToken = opts.headers['X-Bridge-Token'];
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true, entries: [] }) });
    };
    const c = new ToolBridgeClient('http://127.0.0.1:3777');
    const r = await c.inspect();
    assert.equal(r.ok, false);
    assert.match(r.error, /token/);
    assert.equal(sawToken, null);

    c.saveCredentials('http://127.0.0.1:3777', 'abc123');
    const r2 = await c.inspect();
    assert.equal(r2.ok, true);
    assert.equal(sawToken, 'abc123');
  } finally {
    globalThis.fetch = orig;
  }
});

test('syncBridgeTools flips availability on verified handshake only', () => {
  syncBridgeTools(false);
  assert.equal(getTool('repo-code').available, false);
  assert.equal(getTool('local-build-test').available, false);
  assert.ok(getTool('repo-code').unavailableReason.includes('Tool Bridge'));

  syncBridgeTools(true);
  assert.equal(getTool('repo-code').available, true);
  assert.equal(getTool('local-build-test').available, true);

  // Deployment is NEVER a bridge operation
  assert.equal(getTool('deployment').available, false);

  syncBridgeTools(false);
  setToolAvailability('repo-code', false);
  setToolAvailability('local-build-test', false);
});
