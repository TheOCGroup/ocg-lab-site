import test from 'node:test';
import assert from 'node:assert/strict';
import { TedVoiceController } from '../src/tedexperience/tedVoice.ts';

test('TED still speaks with default browser voice if voice inventory throws', () => {
  const spoken = [];
  class Utterance {
    constructor(text) { this.text = text; this.voice = null; }
  }
  const runtime = {
    synthesis: {
      getVoices() { throw new Error('voice inventory temporarily unavailable'); },
      speak(utterance) { spoken.push(utterance); },
      cancel() {},
    },
    UtteranceCtor: Utterance,
  };
  const errors = [];
  const controller = new TedVoiceController(runtime, {
    onStateChange() {}, onTranscript() {},
    onError(kind) { errors.push(kind); },
    onSpeakingChange() {},
  });
  controller.speak('Hello from TED');
  assert.equal(spoken.length, 1);
  assert.equal(spoken[0].text, 'Hello from TED');
  assert.equal(spoken[0].voice, null);
  assert.deepEqual(errors, []);
});
