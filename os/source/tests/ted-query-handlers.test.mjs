import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const handlers = fs.readFileSync(new URL('../src/ted/tedQueryHandlers.ts', import.meta.url), 'utf8');

const intentBlock = (id) => {
  const start = handlers.indexOf(`id: '${id}'`);
  assert.ok(start !== -1, `intent ${id} must exist`);
  return handlers.slice(start, start + 1200);
};

test('product-status cues cover natural founder phrasing', () => {
  const block = intentBlock('TED_PRODUCT_STATUS');
  assert.ok(block.includes('product status'), 'cue: product status');
  assert.ok(block.includes('how many products'), 'cue: how many products');
});

test('commerce-status cues cover sales/revenue/customer phrasing', () => {
  const block = intentBlock('TED_COMMERCE_STATUS');
  for (const cue of ['any sales', 'our revenue', 'how many customers', 'how many orders', 'subscriptions', 'what do we know about sales', 'what do we know about customers']) {
    assert.ok(block.includes(cue), `cue missing: ${cue}`);
  }
});

test('pipeline-overview cues cover lifecycle phrasing', () => {
  const block = intentBlock('TED_PIPELINE_OVERVIEW');
  assert.ok(block.includes('commercial lifecycle'), 'cue: commercial lifecycle');
  assert.ok(block.includes('lab pipeline'), 'cue: lab pipeline');
});

test('deploy-status cues cover the sync-timeout patch phrasing', () => {
  const block = intentBlock('TED_DEPLOY_STATUS');
  for (const cue of ['deploy status', 'sync timeout patch', 'netlify deploy', 'is the sync patch live']) {
    assert.ok(block.includes(cue), `cue missing: ${cue}`);
  }
});

test('task cues cover assignment phrasing and require governed approval policy', () => {
  const block = intentBlock('TED_TASK');
  for (const cue of ['ted, take this on', 'ted, own this', 'assign this to ted']) {
    assert.ok(block.includes(cue), `cue missing: ${cue}`);
  }
  assert.ok(block.includes('GOVERNED_EXTERNAL_ACTION'), 'TED_TASK must be GOVERNED_EXTERNAL_ACTION');
});

test('product-status cues cover readiness / unfinished founder phrasing', () => {
  const block = intentBlock('TED_PRODUCT_STATUS');
  for (const cue of ['which products are ready', 'products ready', 'what products are unfinished', 'unfinished products']) {
    assert.ok(block.includes(cue), `cue missing: ${cue}`);
  }
});

test('compositions route brief/status phrasing to multi-intent TED views', () => {
  assert.ok(handlers.includes("'ted, status'"), 'composition cue: ted, status');
  assert.ok(handlers.includes("'ted, brief me'"), 'composition cue: ted, brief me');
});

test('each intent has founder-facing examples', () => {
  for (const id of ['TED_PRODUCT_STATUS', 'TED_COMMERCE_STATUS', 'TED_PIPELINE_OVERVIEW', 'TED_DEPLOY_STATUS', 'TED_TASK']) {
    const block = intentBlock(id);
    assert.ok(block.includes('examples:'), `intent ${id} must include examples`);
  }
});
