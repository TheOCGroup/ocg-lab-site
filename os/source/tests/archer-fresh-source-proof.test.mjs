import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const proof = readFileSync(resolve(here, '../../../evidence/ARCHER_FRESH_SOURCE_PROOF_2026-09-04.md'), 'utf8');

test('Archer fresh-source proof preserves the required founder brief contract', () => {
  for (const field of ['WHAT HAPPENED', 'WHY WE CARE', 'WE ALREADY HAVE IT?', 'OPPORTUNITY / GAP', 'ACTION', 'OWNER', 'URGENCY', 'CONFIDENCE', 'SOURCE / PROVENANCE']) {
    assert.ok(proof.includes(field), `missing ${field}`);
  }
  assert.ok(proof.includes('FRESH_SOURCE_EXECUTION_PASS'));
  assert.ok(proof.includes('No new system required'));
  assert.ok(proof.includes('NO MATERIAL CHANGE'));
});

test('Archer proof uses dated primary-source provenance and does not authorize OCG MEDIA actions', () => {
  assert.ok(proof.includes('https://openai.com/news/'));
  assert.ok(proof.includes('https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-agentic-video-in-gemini/'));
  assert.ok(proof.includes('https://www.anthropic.com/news'));
  assert.ok(proof.includes('No OCG MEDIA implementation, campaign, post, or publishing action is authorized by this proof.'));
});
