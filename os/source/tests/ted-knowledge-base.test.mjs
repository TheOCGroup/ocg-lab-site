import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const kb = fs.readFileSync(new URL('../src/data/tedKnowledgeBase.ts', import.meta.url), 'utf8');
const matrix = fs.readFileSync(new URL('../PRODUCT-PORTFOLIO-MATRIX.md', import.meta.url), 'utf8');

test('knowledge base pins canonical identity to verified deployment truth', () => {
  assert.match(kb, /TheOCGroup\/ocg-lab-site/);
  assert.match(kb, /f9f92c319c8c902ebcc914c8e0a1f63295b9e0fe/);
  assert.match(kb, /ocg-lab-os\.netlify\.app/);
  assert.match(kb, /6aa6c8a7f91990de791a0128/);
});

test('knowledge base carries exactly the 8 verified products from the portfolio matrix', () => {
  const products = [
    'Real Estate Investor AI PRO', 'Fix & Flip Calculator', 'Wholesaler Deal Calculator',
    'BRRRR Calculator', 'Rental Property Calculator', 'Insurance Agent AI Playbook',
    'Real Estate Investor AI Playbook', 'Lender AI SUPER PRO',
  ];
  for (const product of products) {
    assert.ok(kb.includes(product), `knowledge base must include ${product}`);
    assert.ok(matrix.includes(product), `portfolio matrix must include ${product}`);
  }
  for (const route of [
    '/real-estate-investor-ai-pro/', '/fix-flip-calculator/', '/wholesaler-deal-calculator/',
    '/brrrr-calculator/', '/rental-property-calculator/', '/playbooks/insurance-agent/',
    '/playbooks/real-estate-investor/', '/playbooks/lender-ai-super-pro/',
  ]) {
    assert.ok(kb.includes(route), `knowledge base must include route ${route}`);
  }
});

test('no product in the knowledge base asserts a price, checkout, readiness, or sale', () => {
  assert.match(kb, /price: 'STATUS UNAVAILABLE'/);
  assert.match(kb, /checkoutStatus: 'NO_VERIFIED_CHECKOUT'/);
  assert.match(kb, /readiness: 'UNVERIFIED'/);
  assert.ok(!kb.includes('price: $'), 'knowledge base must not assert a dollar price on any product');
  assert.ok(!kb.includes("checkoutStatus: 'VERIFIED_CHECKOUT'"), 'knowledge base must not claim a verified checkout on any product');
});

test('registry-recorded prices are labeled as recorded evidence, never current live prices', () => {
  assert.match(kb, /currentLivePrice: 'STATUS UNAVAILABLE'/);
  assert.match(kb, /recorded evidence/i);
  assert.match(kb, /not current live price/i);
});

test('sync-timeout patch is recorded as BLOCKED with the founder-only unblock path', () => {
  assert.match(kb, /BLOCKED/);
  assert.match(kb, /087d70a5/);
  assert.match(kb, /Account credit usage exceeded/);
  assert.match(kb, /Founder-only/);
});

test('Etsy and Whop commerce metrics are all STATUS UNAVAILABLE', () => {
  assert.match(kb, /Etsy API returned 403/);
  assert.match(kb, /4568082033/);
  assert.match(kb, /4554940134/);
  assert.match(kb, /4567698713/);
  assert.match(kb, /4570937150/);
  assert.match(kb, /DO NOT TOUCH/);
});

test('every lifecycle stage carries a data source and honest state', () => {
  assert.match(kb, /dataSource: 'NONE_VERIFIED'/);
  assert.match(kb, /TED_LIFECYCLE_STATE/);
});

test('never-fabricate governance list is present and comprehensive', () => {
  assert.match(kb, /TED_NEVER_FABRICATE/);
  for (const rule of ['Never claim a price is live', 'Never report sales', 'STATUS UNAVAILABLE']) {
    assert.ok(kb.includes(rule), `governance must include: ${rule}`);
  }
});
