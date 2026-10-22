import test from 'node:test';
import assert from 'node:assert/strict';
import { WebSpeechVoiceProvider } from '../src/tedexperience/voice/webSpeechProvider.ts';

const events = {
  onStateChange() {}, onTranscript() {}, onTurnComplete() {},
  onBargeIn() {}, onSpeechStarted() {}, onSpeechEnded() {},
  onError() {}, onConnectionLost() {}, onConnectionRestored() {},
};

test('TED refuses voice session when audio playback is unavailable', async () => {
  const provider = new WebSpeechVoiceProvider({ RecognitionCtor: class {} }, events);
  await assert.rejects(provider.connect(), /cannot speak TED responses aloud/);
  assert.equal(provider.wasConnectFailed, true);
});
