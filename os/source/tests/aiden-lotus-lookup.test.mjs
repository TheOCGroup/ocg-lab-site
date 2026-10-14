import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AidenEngine } from '../src/components/aiden/aidenEngine.ts';

test('Aiden recognizes Lotus Insight and routes accountability to TED', () => {
  const result = AidenEngine.processQuery('Where are we with Lotus Insight?');
  assert.equal(result.category, 'STATUS');
  assert.match(result.reply, /Lotus Insight/);
  assert.match(result.reply, /TED/);
  assert.match(result.reply, /STATUS UNAVAILABLE/);
});
