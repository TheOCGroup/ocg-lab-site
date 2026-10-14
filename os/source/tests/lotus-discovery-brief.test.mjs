import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lotusDiscoveryBrief } from '../src/tedexperience/lotusDiscovery.ts';
import { readFileSync } from 'node:fs';

test('Lotus Insight briefing provides actionable discovery work without inventing connected data', () => {
  const brief = lotusDiscoveryBrief();
  assert.match(brief, /discovery meeting with Al/i);
  assert.match(brief, /STATUS UNAVAILABLE/);
  assert.match(brief, /not been independently reconciled/i);
  assert.doesNotMatch(brief, /deployment verified|tasks completed/i);
});

test('TED routes explicit Lotus Insight questions to the scoped discovery briefing', () => {
  const source = readFileSync(new URL('../src/tedexperience/tedPersona.ts', import.meta.url), 'utf8');
  assert.match(source, /q\.includes\('lotus insight'\)/);
  assert.match(source, /reply: lotusDiscoveryBrief\(\)/);
});
