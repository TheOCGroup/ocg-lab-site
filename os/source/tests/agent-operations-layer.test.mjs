import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const skills = fs.readFileSync(new URL('../src/data/agentOperationsSkills.ts', import.meta.url), 'utf8');
const engine = fs.readFileSync(new URL('../src/components/aiden/aidenEngine.ts', import.meta.url), 'utf8');
const modal = fs.readFileSync(new URL('../src/components/aiden/AidenOrchestratorModal.tsx', import.meta.url), 'utf8');

test('Agent Operations defines the foundational shared skills from the founder decision', () => {
  for (const name of ['SOURCE OF TRUTH', 'RECOVER & CONTINUE', 'VISUALIZE', 'EXECUTIVE BRIEF', 'VERIFY', 'ACT & VERIFY', 'CHALLENGE / RED TEAM']) {
    assert.match(skills, new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('natural founder language composes reusable skills instead of rigid slash commands', () => {
  assert.match(skills, /where are we/);
  assert.match(skills, /finish it/);
  assert.match(skills, /show me the deal/);
  assert.match(skills, /get this listed/);
  assert.match(skills, /build the next product/);
  assert.match(skills, /recentFounderQueries/);
  assert.doesNotMatch(skills, /slash command/i);
});

test('Aiden uses the shared semantic resolver and preserves fail-closed verification', () => {
  assert.match(engine, /resolveAgentOperationsIntent/);
  assert.match(engine, /skillsUsed/);
  assert.match(engine, /No external action was inferred or marked complete/);
  assert.match(engine, /provider read-back remains authoritative/i);
});

test('Aiden UI exposes natural examples and resolved skill composition', () => {
  assert.match(modal, /Where are we\?/);
  assert.match(modal, /What makes us money fastest\?/);
  assert.match(modal, /Find the real one\./);
  assert.match(modal, /data-agent-ops-skills/);
  assert.match(modal, /recentFounderQueries/);
});
