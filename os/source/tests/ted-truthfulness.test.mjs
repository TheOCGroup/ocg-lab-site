import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const handlers = fs.readFileSync(new URL('../src/ted/tedQueryHandlers.ts', import.meta.url), 'utf8');
const kb = fs.readFileSync(new URL('../src/data/tedKnowledgeBase.ts', import.meta.url), 'utf8');

test('TED exposes exactly the five governed intents', () => {
  for (const id of ['TED_PRODUCT_STATUS', 'TED_COMMERCE_STATUS', 'TED_PIPELINE_OVERVIEW', 'TED_DEPLOY_STATUS', 'TED_TASK']) {
    assert.ok(handlers.includes(`id: '${id}'`), `handlers must define intent ${id}`);
  }
  assert.match(handlers, /export type TedIntentId/);
  assert.match(handlers, /export function resolveTedIntent/);
  assert.match(handlers, /export function handleTedQuery/);
});

test('intent resolution mirrors the repo cue-scoring pattern', () => {
  assert.match(handlers, /normalized/);
  assert.match(handlers, /recentFounderQueries/);
  assert.match(handlers, /compositions/);
  assert.match(handlers, /'HIGH' \| 'MEDIUM'|confidence/);
});

test('every handler reply is fail-closed: STATUS UNAVAILABLE appears across all commerce answers', () => {
  assert.match(handlers, /fail-closed/);
  assert.match(handlers, /No invented numbers/);
  const commerceReply = handlers.includes('TED — OCG LAB Commerce Status');
  assert.ok(commerceReply, 'commerce handler must exist');
  // Any dollar figure in a reply must sit inside an anti-fabrication sentence
  // ("$0 placeholders are unverified content") or inside the registry-recorded
  // section that labels them "recorded evidence, NOT current live prices".
  const s = handlers.replace(/\$\{[^}]*\}/g, '');
  for (const m of s.matchAll(/\$\d/g)) {
    const context = s.slice(Math.max(0, m.index - 160), m.index + 160);
    assert.ok(/unverified|recorded evidence|not current live/i.test(context),
      `dollar figure outside anti-fabrication context: ...${context.slice(-60)}...`);
  }
});

test('TED_TASK returns a governed QUEUED object and never claims execution', () => {
  assert.match(handlers, /QUEUED/);
  assert.match(handlers, /not executing and not complete/);
  assert.match(handlers, /FOUNDER.*AIDEN.*CHIEF.*TED|TED_COMMAND_CHAIN/);
});

test('TED_TASK uses deterministic task ids (no wall-clock fabrication in tests)', () => {
  assert.match(handlers, /deterministicTaskId/);
  assert.ok(!handlers.includes('Date.now()'), 'TED task ids must not depend on wall-clock time');
});

test('anti-fabrication vocabulary is enforced in the handler source', () => {
  assert.match(handlers, /TED_NEVER_FABRICATE/);
  assert.match(handlers, /STATUS UNAVAILABLE/);
});

test('knowledge base helper functions exist for honest reporting', () => {
  assert.match(kb, /tedProductCount/);
  assert.match(kb, /tedProductsWithVerifiedCheckout/);
  assert.match(kb, /tedCommerceMetricStates/);
});
