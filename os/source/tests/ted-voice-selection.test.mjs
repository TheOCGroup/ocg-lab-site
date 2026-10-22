import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const picker = readFileSync(new URL('../src/tedexperience/components/TedVoicePicker.tsx', import.meta.url), 'utf8');
test('TED preview uses displayed voice', () => {
  assert.ok(picker.includes('const voice = selectedVoice;'));
});
test('TED preview exposes fallback voice', () => {
  assert.ok(picker.includes('Automatic voice'));
  assert.ok(picker.includes('selectedVoice'));
});
test('TED preview cancels on selection change', () => {
  assert.ok(picker.includes('window.speechSynthesis?.cancel();'));
});
test('TED live speech prefers saved voice then Thomas', () => {
  const runtime = readFileSync(new URL('../src/tedexperience/tedVoice.ts', import.meta.url), 'utf8');
  assert.ok(runtime.includes('preferred ?? thomas ?? executive'));
});
