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
  assert.match(aiden, /PUBLIC \/ SELLER QA PENDING|READY TO PUBLISH/);
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
  assert.match(readiness, /READY TO PUBLISH/);
  assert.match(readiness, /PUBLIC \/ SELLER QA PENDING/);
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
  const publishIndex = readiness.indexOf("else if (publishChannel)");
  const draftIndex = readiness.indexOf("else if (draftChannel)");
  const registrationIndex = readiness.indexOf("else if (missingRegistration)");
  assert.ok(verificationIndex > -1 && verificationIndex < publishIndex && publishIndex < draftIndex && draftIndex < registrationIndex, 'revenue priority must be verification > publish > draft > registration');
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
  assert.match(aiden, /PUBLIC \/ SELLER QA PENDING/);
  assert.match(aiden, /no duplicate was created/i);
  assert.match(aiden, /No external Live state inferred/);
});

test('C11 commerce verification completion fails closed until authenticated evidence and independent QA are present', () => {
  const storage = fs.readFileSync(new URL('../src/data/storageEngine.ts', import.meta.url), 'utf8');
  assert.match(storage, /completeCommerceVerification/);
  assert.match(storage, /Authenticated external evidence is required/);
  assert.match(storage, /Independent QA PASS evidence from a non-builder inspector is required/);
  assert.match(storage, /input\.qaResult\.inspectorAgent === workOrder\.assignedAgent/);
  assert.match(storage, /item\.productId === productId && item\.channel === channel/);
  assert.match(storage, /Matching storefront record not found; Live state cannot be inferred/);
  assert.match(storage, /storefrontItem\.status !== 'Ready' && storefrontItem\.status !== 'Live'/);
  assert.match(storage, /status: 'Live'/);
  assert.match(storage, /finalCommerceStatus: 'LIVE'/);
  assert.match(storage, /COMPLETE_COMMERCE_VERIFICATION/);
  assert.match(storage, /transitioned Ready → Live/);
});



test('C12 Whop distinguishes ready-to-publish from public seller-QA verification and dispatches publication durably', () => {
  const readiness = fs.readFileSync(new URL('../src/data/productCommercializationReadiness.ts', import.meta.url), 'utf8');
  const storage = fs.readFileSync(new URL('../src/data/storageEngine.ts', import.meta.url), 'utf8');
  assert.match(readiness, /READY TO PUBLISH/);
  assert.match(readiness, /PUBLIC \/ SELLER QA PENDING/);
  assert.match(readiness, /record\.buyerQaStatus === 'VERIFIED' && record\.sellerQaStatus === 'PENDING'/);
  assert.match(storage, /ensureCommercePublicationDispatch/);
  assert.match(storage, /DISPATCH_COMMERCE_PUBLICATION/);
  assert.match(storage, /no public listing or Live state was inferred/);
  assert.match(aiden, /Whop Publication Work Order Prepared/);
  assert.match(aiden, /READY TO PUBLISH/);
  assert.match(aiden, /This does not mark Whop Live/);
});


test('C13 publicly verified Whop products are reconciled without claiming seller-side verification', () => {
  assert.match(storefronts, /productId: 'playbook-rei'[\s\S]*price: 19\.99[\s\S]*status: 'Ready'[\s\S]*real-estate-investor-ai-playbook/);
  assert.match(storefronts, /productId: 'aipro-rei'[\s\S]*price: 29[\s\S]*status: 'Ready'[\s\S]*real-estate-investor-ai-pro/);
  assert.match(storefronts, /productId: 'aipro-leadflow'[\s\S]*price: 99\.99[\s\S]*status: 'Ready'[\s\S]*leadflow-ai-pro-e8/);
  assert.match(storefronts, /seller-side entitlement\/configuration QA pending|seller-side fulfillment\/configuration QA still pending authenticated read-back/);
  assert.doesNotMatch(storefronts, /productId: 'playbook-rei'[\s\S]*status: 'Live'/);
});


test('C14 Insurance Whop package locks price, one-time billing, fulfillment and verification gates', () => {
  const packagePath = new URL('../../../commercialization/whop/INSURANCE_AGENT_AI_PLAYBOOK_WHOP_PACKAGE.md', import.meta.url);
  const packageText = fs.readFileSync(packagePath, 'utf8');
  assert.match(packageText, /Price: `\$19\.00` one-time/);
  assert.match(packageText, /Initial price: `\$19\.00`/);
  assert.match(packageText, /https:\/\/ocg-lab-products\.vercel\.app\/playbooks\/insurance-agent\//);
  assert.match(packageText, /OCG_LAB_Insurance_Agent_Playbook_ACCESS\.pdf/);
  assert.match(packageText, /OCG_LAB_Insurance_Agent_ETSY_COMPLETE_PACKAGE_FINAL\.zip/);
  assert.match(packageText, /READY TO PUBLISH/);
  assert.match(packageText, /PUBLIC \/ SELLER QA PENDING/);
  assert.match(packageText, /VERIFIED LIVE/);
  assert.match(storefronts, /commercialization\/whop\/INSURANCE_AGENT_AI_PLAYBOOK_WHOP_PACKAGE\.md/);
});


test('C15 storefront verification is evidence-based, not inferred from URL presence', () => {
  const types = fs.readFileSync(new URL('../src/types.ts', import.meta.url), 'utf8');
  const readiness = fs.readFileSync(new URL('../src/data/productCommercializationReadiness.ts', import.meta.url), 'utf8');
  assert.match(types, /buyerQaStatus: StorefrontVerificationStatus/);
  assert.match(types, /sellerQaStatus: StorefrontVerificationStatus/);
  assert.match(storefronts, /buyerQaEvidence:/);
  assert.match(storefronts, /sellerQaEvidence:/);
  assert.match(readiness, /record\.buyerQaStatus === 'VERIFIED'/);
  assert.match(readiness, /record\.sellerQaStatus === 'PENDING'/);
  assert.doesNotMatch(readiness, /fulfillmentUrl\.includes\('whop\.com\/'\)/);
  assert.match(page, /Buyer QA:/);
  assert.match(page, /Seller QA:/);
});

test('C16 current public Whop catalog is reconciled without seller-side overclaim', () => {
  for (const tuple of [
    ['Real Estate Investor AI Playbook', '19.99', 'real-estate-investor-ai-playbook'],
    ['Real Estate Investor AI PRO', '29', 'real-estate-investor-ai-pro'],
    ['LeadFlow AI PRO', '99.99', 'leadflow-ai-pro-e8']
  ]) {
    assert.match(storefronts, new RegExp(tuple[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(storefronts, new RegExp(`price: ${tuple[1].replace('.', '\\.')}`));
    assert.match(storefronts, new RegExp(tuple[2]));
  }
  assert.match(storefronts, /buyerQaStatus: 'VERIFIED'/);
  assert.match(storefronts, /sellerQaStatus: 'PENDING'/);
  assert.match(storefronts, /Insurance Agent AI Playbook[\s\S]*buyerQaStatus: 'PENDING'/);
});


test('C17 storefront verification freshness expires evidence and prioritizes seller QA debt', () => {
  const freshness = fs.readFileSync(new URL('../src/data/storefrontVerification.ts', import.meta.url), 'utf8');
  assert.match(freshness, /STOREFRONT_QA_MAX_AGE_DAYS = 7/);
  assert.match(freshness, /VerificationFreshness = 'CURRENT' \| 'STALE' \| 'PENDING' \| 'NOT_APPLICABLE'/);
  assert.match(freshness, /sellerQaStatus === 'PENDING' && item\.buyerQaStatus === 'VERIFIED'/);
  assert.match(freshness, /priority: 0/);
  assert.match(aiden, /Storefront Verification Debt/);
  assert.match(aiden, /verification freshness/i);
  assert.match(page, /getVerificationFreshness/);
});
