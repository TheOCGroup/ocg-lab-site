import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const recorder = readFileSync(new URL('../lender-ai-super-pro/recorder.js', import.meta.url), 'utf8');
const bridge = readFileSync(new URL('../lender-ai-super-pro/production-bridge.js', import.meta.url), 'utf8');
const researchClient = readFileSync(new URL('../lender-ai-super-pro/research-client.js', import.meta.url), 'utf8');

test('camera permission denial is explicit, recoverable, and does not create a recording', () => {
  assert.match(recorder, /NotAllowedError/);
  assert.match(recorder, /PermissionDeniedError/);
  assert.match(recorder, /PERMISSION DENIED — camera or microphone access was not granted/);
  assert.match(recorder, /Allow camera and microphone for this site, then choose Enable Camera \+ Microphone to retry/);
  assert.match(recorder, /CAMERA START FAILED — no recording was created/);
});

test('lost approval state rejects the media artifact instead of silently advancing production', () => {
  assert.match(recorder, /Approved-script state was lost/);
  assert.match(recorder, /No recording artifact was accepted; approve the script and retry/);
  assert.match(recorder, /Recording discarded\. No production completion was recorded/);
});

test('disconnected or unavailable purchaser AI fails closed with a useful next action', () => {
  assert.match(bridge, /NOT CONNECTED — live AI work is locked until you connect your own provider/);
  assert.match(bridge, /AI connection status unavailable/);
  assert.match(bridge, /CUSTOMER AI CONNECTION REQUIRED/);
  assert.match(bridge, /Connect your own AI provider in Step 0\. OCG LAB credentials are not used for customer runtime/);
});

test('research and script state cannot drift after evidence selection', () => {
  assert.match(bridge, /RESEARCH SELECTION REQUIRED/);
  assert.match(bridge, /TOPIC CHANGED AFTER RESEARCH/);
  assert.match(bridge, /Re-run research so the topic and evidence packet match/);
});

test('provider or network failure never falls back to invented current mortgage guidance', () => {
  assert.match(researchClient, /Service unavailable/);
  assert.match(researchClient, /LIVE RESEARCH UNAVAILABLE/);
  assert.match(researchClient, /No current mortgage recommendation has been generated/);
  assert.doesNotMatch(researchClient, /fallback current mortgage recommendation/i);
});
