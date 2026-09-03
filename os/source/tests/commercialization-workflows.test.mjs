import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const workflows = fs.readFileSync(new URL('../src/data/commercializationWorkflows.ts', import.meta.url), 'utf8');
const storefronts = fs.readFileSync(new URL('../src/data/storefronts.ts', import.meta.url), 'utf8');
const page = fs.readFileSync(new URL('../src/pages/StorefrontsPage.tsx', import.meta.url), 'utf8');
const aiden = fs.readFileSync(new URL('../src/components/aiden/aidenEngine.ts', import.meta.url), 'utf8');

test('C1 universal commercialization lifecycle includes post-purchase operations', () => {
  for (const stage of ['PRODUCT READY','PRODUCT QA','COMMERCIAL PACKAGE','CHANNEL ADAPTATION','CHANNEL QA','FOUNDER APPROVAL','PUBLISH','PUBLIC VERIFICATION','BUYER EXPERIENCE QA','MARKETING LAUNCH','ANALYTICS','CUSTOMER SUPPORT','OPTIMIZATION']) {
    assert.match(workflows, new RegExp(stage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('C2 Etsy, Whop, Direct and operating workflows are registered', () => {
  for (const id of ['wf-etsy','wf-whop','wf-direct','wf-onboarding','wf-support','wf-refunds','wf-updates','wf-marketing','wf-analytics','wf-reviews','wf-affiliate']) assert.match(workflows, new RegExp(id));
});

test('C3 Whop is not certified/live before authenticated external verification', () => {
  assert.match(workflows, /id: 'wf-whop'[\s\S]*status: 'READY'/);
  assert.match(aiden, /Whop remains \*\*READY \/ UNVERIFIED\*\*/);
});

test('C4 storefront catalog contains no fabricated order counts', () => {
  assert.doesNotMatch(storefronts, /orderCount:\s*(?:[1-9]\d*)/);
  assert.doesNotMatch(page, /SIMULATED REVENUE/);
});

test('C5 Aiden supports generalized commerce commands', () => {
  for (const phrase of ['commercialization status','prepare','whop','all channels','incomplete storefront','Buyer Access Audit Dispatch']) assert.match(aiden, new RegExp(phrase, 'i'));
});

test('C6 external live-state anti-fabrication rule is explicit', () => {
  assert.match(aiden, /Only externally verified channels may be represented as live/);
  assert.match(aiden, /never LIVE by inference/);
});

test('C7 product-type commercialization templates cover the complete OCG LAB product ladder', () => {
  const productTemplates = fs.readFileSync(new URL('../src/data/productCommercializationTemplates.ts', import.meta.url), 'utf8');
  for (const type of ['PLAYBOOK','AI PRO','AI SUPER PRO','CALCULATOR / TOOL']) assert.match(productTemplates, new RegExp(type.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  for (const gate of ['Master parity','Authentication / credentials','Persistent agent behavior','Calculation correctness']) assert.match(productTemplates, new RegExp(gate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(page, /Product-Type Playbooks/);
});

test('C8 real portfolio products are deterministically assigned to commercialization readiness without fuzzy matching', () => {
  const readiness = fs.readFileSync(new URL('../src/data/productCommercializationReadiness.ts', import.meta.url), 'utf8');
  assert.match(readiness, /PORTFOLIO_DATA\.flatMap/);
  assert.match(readiness, /storefront\.productId === item\.id/);
  for (const mapping of ["ladder === 'PLAYBOOK'", "ladder === 'AI PRO'", "ladder === 'AI SUPER PRO'", "ladder === 'CALCULATOR'"]) assert.match(readiness, new RegExp(mapping.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(readiness, /CHANNEL REGISTRATION/);
  assert.match(readiness, /READY \/ EXTERNAL VERIFICATION/);
  assert.match(readiness, /only then may it be marked Live/);
  assert.match(page, /Product Commercialization Readiness/);
  assert.match(page, /Next action:/);
});

test('C9 Aiden ranks real product readiness for revenue instead of using hard-coded launch claims', () => {
  const readiness = fs.readFileSync(new URL('../src/data/productCommercializationReadiness.ts', import.meta.url), 'utf8');
  assert.match(aiden, /PRODUCT_COMMERCIALIZATION_READINESS/);
  for (const phrase of ['sell next','closest to revenue','Whop Revenue Gate','evidence-based','No sales or live-state metrics are inferred']) assert.match(aiden, new RegExp(phrase, 'i'));
  assert.match(aiden, /priority\[a\.state\] - priority\[b\.state\]/);
  assert.doesNotMatch(aiden, /Fastest Revenue Opportunities \(Immediate Commercial Distribution\)/);
  const verificationIndex = readiness.indexOf("else if (verificationChannel)");
  const draftIndex = readiness.indexOf("else if (draftChannel)");
  const registrationIndex = readiness.indexOf("else if (missingRegistration)");
  assert.ok(verificationIndex > -1 && verificationIndex < draftIndex && draftIndex < registrationIndex, 'revenue priority must be verification > draft > registration');
});

test('C10 Aiden can persist an idempotent authenticated commerce verification work order for the nearest revenue gate', () => {
  const storage = fs.readFileSync(new URL('../src/data/storageEngine.ts', import.meta.url), 'utf8');
  assert.match(storage, /ensureCommerceVerificationDispatch/);
  assert.match(storage, /obj-commerce-verify-\$\{input\.productId\}-\$\{channelKey\}/);
  assert.match(storage, /wo-commerce-verify-\$\{input\.productId\}-\$\{channelKey\}/);
  assert.match(storage, /existingObjective && existingWorkOrder/);
  assert.match(storage, /DISPATCH_COMMERCE_VERIFICATION/);
  assert.match(storage, /does not authorize publication or fabricate live state/);
  assert.match(aiden, /dispatch nearest revenue gate/i);
  assert.match(aiden, /ensureCommerceVerificationDispatch/);
  assert.match(aiden, /READY \/ EXTERNAL VERIFICATION/);
  assert.match(aiden, /no duplicate was created/i);
  assert.match(aiden, /No external Live state inferred/);
});

