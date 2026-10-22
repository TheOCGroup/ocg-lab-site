/**
 * OCG INTELLIGENCE — TED integration contract tests.
 *
 * Extends draft PR #82's navigation test with the completion contract:
 * a dedicated workspace (not a scroll-to-card), Market Radar data flow,
 * planned modules labeled, and TED's conversation/voice/Products intact.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const exists = (path) => existsSync(new URL(path, import.meta.url));

test('OCG Intelligence preview entry is in existing TED navigation', () => {
  const nav = read('../src/tedexperience/components/TedNav.tsx');
  assert.match(nav, /OCG INTELLIGENCE/);
  assert.match(nav, /onOpenIntelligence/);
  assert.match(nav, /Preview/);
  assert.match(nav, /New chat/);
  assert.match(nav, /Previous Work/);
  assert.match(nav, /onOpenProducts/);
  assert.match(nav, /Products/);
});

test('both desktop and mobile TED navigation wire the intelligence action', () => {
  const page = read('../src/pages/TedExperiencePage.tsx');
  // Both TedNav instances (desktop aside + mobile drawer) wire the action;
  // the Products card is a third, separate wiring of the same handler.
  const navBlocks = page.split('<TedNav').slice(1).map((b) => b.split('/>')[0]);
  assert.equal(navBlocks.length, 2);
  // Integrated layout: the desktop aside wires the bare handler; the
  // mobile drawer wraps it with drawer dismissal. Both must be present.
  for (const block of navBlocks) assert.match(block, /onOpenIntelligence=\{(openIntelligence|\(\) => \{ openIntelligence\(\); setNavOpen\(false\); \})\}/);
  assert.match(page, /setNavOpen\(false\)/);
  assert.match(page, /setIntelligenceOpen\(true\)/);
});

test('intelligence opens a dedicated workspace, not the products card', () => {
  const page = read('../src/pages/TedExperiencePage.tsx');
  assert.match(page, /<TedIntelligenceWorkspace onBackToChat=\{\(\) => setIntelligenceOpen\(false\)\} \/>/);
  assert.match(page, /intelligenceOpen \?/);
  assert.ok(exists('../src/tedexperience/components/TedIntelligenceWorkspace.tsx'));
});

test('workspace preserves the TED conversation by construction', () => {
  const page = read('../src/pages/TedExperiencePage.tsx');
  // View switching must not clear messages or persona state.
  const openIntel = page.slice(page.indexOf('const openIntelligence'), page.indexOf('const openProducts'));
  assert.doesNotMatch(openIntel, /setMessages|setPersona|clearMemoryOverlay/);
  assert.match(page, /<TedChat/);
  assert.match(page, /voice=\{\{ state: voiceUiState/);
});

test('workspace wires the real Market Radar model and evidence', () => {
  const ws = read('../src/tedexperience/components/TedIntelligenceWorkspace.tsx');
  assert.match(ws, /buildIntelligenceDashboard/);
  assert.match(ws, /COMPETITOR_PROFILES/);
  assert.match(ws, /PRICING_EVIDENCE_CANDIDATES/);
  assert.match(ws, /compareReceptionistPricing/);
  // Source attribution is rendered per evidence record.
  assert.match(ws, /x\.record\.sourceUrl/);
  assert.match(ws, /Retrieved \{fmtDate\(x\.record\.retrievedAt\)\}/);
  assert.match(ws, /x\.record\.usageRights/);
});

test('planned modules are labeled planned and never presented as live', () => {
  const ws = read('../src/tedexperience/components/TedIntelligenceWorkspace.tsx');
  assert.match(ws, /PLANNED_NOTES/);
  assert.match(ws, /is not built yet/);
  const meta = read('../src/tedexperience/intelligenceProduct.ts');
  assert.match(meta, /status: 'PREVIEW'/);
  assert.equal((meta.match(/status: 'PLANNED'/g) ?? []).length, 3);
  assert.doesNotMatch(meta, /status: 'LIVE'/);
  assert.doesNotMatch(ws, /status: 'LIVE'|>'LIVE'<|\"LIVE\"/);
});

test('workspace is honest about scoring and pricing gates', () => {
  const ws = read('../src/tedexperience/components/TedIntelligenceWorkspace.tsx');
  assert.match(ws, /Not scored — rubric pending/);
  assert.match(ws, /Gate: \{dashboard\.pricing\.status\}/);
  assert.match(ws, /not a quote/);
  assert.match(ws, /No live provider connection/);
});

test('workspace handles empty and failure states without fabricating data', () => {
  const ws = read('../src/tedexperience/components/TedIntelligenceWorkspace.tsx');
  assert.match(ws, /No competitors loaded/);
  assert.match(ws, /No evidence loaded yet/);
  assert.match(ws, /could not be loaded/);
  assert.match(ws, /role="alert"/); // scenario input failure is surfaced
  assert.match(ws, /isSafeExternalUrl\(x\.record\.sourceUrl\)/); // QA U2: render-layer allowlist
  assert.doesNotMatch(ws, /setScenarioError/); // QA U3: no setState during render
});

test('products card (PR #81) is retained and opens the workspace', () => {
  const products = read('../src/tedexperience/components/TedProducts.tsx');
  assert.match(products, /INTELLIGENCE_PRODUCT/);
  assert.match(products, /In development/);
  assert.match(products, /View development progress/);
  assert.match(products, /rel="noopener noreferrer"/);
  assert.match(products, /Open Intelligence workspace/);
  assert.match(products, /onOpenIntelligence/);
});

test('intelligence logic makes no network calls and no writes', () => {
  for (const f of [
    'marketRadar.ts', 'competitorComparison.ts', 'pricingEvidenceGate.ts',
    'receptionistPricing.ts', 'reviewedPricingReport.ts', 'dashboardModel.ts',
    'evidenceData.ts', 'brandRegistry.ts',
  ]) {
    const src = read(`../src/tedexperience/intelligence/${f}`);
    assert.doesNotMatch(src, /fetch\(|XMLHttpRequest|localStorage|sessionStorage/, f);
  }
  const ws = read('../src/tedexperience/components/TedIntelligenceWorkspace.tsx');
  assert.doesNotMatch(ws, /fetch\(|localStorage/);
});
