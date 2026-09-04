import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const standard = fs.readFileSync(new URL('../src/data/whopQualityStandard.ts', import.meta.url), 'utf8');
const document = fs.readFileSync(new URL('../../../commercialization/whop/WHOP_PRODUCT_PAGE_STANDARD.md', import.meta.url), 'utf8');

test('WQ1 Whop standard separates publish, seller QA, and verified live states', () => {
  for (const state of ['READY TO PUBLISH', 'PUBLIC / SELLER QA PENDING', 'VERIFIED LIVE']) {
    assert.match(standard, new RegExp(state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(document, new RegExp(state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('WQ2 public buyer QA includes core Whop merchandising and checkout gates', () => {
  for (const gate of ['buyer-visible price', 'gallery', 'video', 'FAQs', 'Order now', 'mobile', 'post-purchase access']) {
    assert.match(document, new RegExp(gate, 'i'));
  }
});

test('WQ3 seller-side QA requires authenticated plan and fulfillment evidence', () => {
  for (const gate of ['product ID', 'plan ID', 'one-time vs recurring', 'entitlement/access', 'fulfillment destination', 'duplicate product/plan']) {
    assert.match(document, new RegExp(gate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }
});

test('WQ4 standard explicitly prevents fabricated commercial evidence', () => {
  assert.match(document, /No fabricated orders, revenue, conversion, ratings, reviews, subscribers, or checkout events/);
  assert.match(document, /No seller-side verification inferred from a public page/);
  assert.match(document, /absent from the public Whop catalog remains READY TO PUBLISH/i);
});

test('WQ5 independent non-builder QA is mandatory before verified live', () => {
  assert.match(document, /builder\/publisher cannot self-approve/i);
  assert.match(document, /Independent non-builder QA returns PASS/);
  assert.match(standard, /Inspector is not the assigned builder\/publisher/);
});
