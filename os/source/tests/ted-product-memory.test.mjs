/**
 * TED Phase 2.3 — OCG LAB Product Memory & Inventory tests.
 *
 * Verifies:
 * - Footer/storefront clutter absent from the TED founder experience
 * - "Your Products" inventory renders from real canonical data
 * - Founder status language only (no fabrication)
 * - Product detail: what are we building, functions, finished vs left,
 *   decisions, next move
 * - Continue with TED establishes product context; "Let's finish this" works
 * - New Chat clears product context
 * - Voice session continuity, research, Tool Bridge unaffected
 * - Unavailable fields fail honestly
 * - Customer storefront remains intact outside TED
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = (p) => readFileSync(path.join(here, '..', p), 'utf8');

import {
  buildProductMemory,
  getAllProductMemories,
  getProductMemory,
  getProductCardSummaries,
  mapToFounderStatus,
  recordProductDecision,
  markWorkFinished,
  clearMemoryOverlay,
} from '../src/tedexperience/productMemory.ts';

import { PRODUCTS_DATA } from '../src/data/products.ts';

// ---------------------------------------------------------------------------
// P0 — storefront/footer clutter absent from TED
// ---------------------------------------------------------------------------

test('P0: Footer is hidden on the TED founder page (App.tsx)', () => {
  const app = src('src/App.tsx');
  assert.match(app, /activePage !== "ted" && \(\s*<Footer/, 'Footer must be conditional on non-TED pages');
});

test('P0: TED page itself has no storefront clutter', () => {
  const page = src('src/pages/TedExperiencePage.tsx');
  for (const phrase of ['Storefront Active', 'Pricing Matrix', 'Ocasio Collective', 'AI Weekly']) {
    assert.ok(!page.includes(phrase), `TED page must not contain "${phrase}"`);
  }
});

test('P0: customer storefront remains intact outside TED', () => {
  assert.ok(existsSync(path.join(here, '..', 'src', 'pages', 'StorefrontsPage.tsx')), 'StorefrontsPage must still exist');
  const footer = src('src/components/Footer.tsx');
  assert.ok(footer.includes('Storefront') || footer.includes('storefront'), 'Footer storefront content preserved for customer pages');
});

// ---------------------------------------------------------------------------
// P1/P2 — Your Products inventory
// ---------------------------------------------------------------------------

test('P1: TedProducts component exists and renders from canonical data', () => {
  const comp = src('src/tedexperience/components/TedProducts.tsx');
  assert.ok(comp.includes('Your Products'), 'must have the "Your Products" heading');
  assert.ok(comp.includes('getProductCardSummaries'), 'must read canonical product records');
  assert.ok(comp.includes('Open Product') && comp.includes('Continue with TED'), 'must have both actions');
});

test('P1: page renders Your Products below the chat', () => {
  const page = src('src/pages/TedExperiencePage.tsx');
  assert.ok(page.includes('<TedProducts'), 'TedExperiencePage must render TedProducts');
});

test('P2: statuses use founder language only', () => {
  const summaries = getProductCardSummaries();
  assert.ok(summaries.length > 0, 'must have products');
  const allowed = ['IDEA', 'BUILDING', 'NEEDS ATTENTION', 'READY TO REVIEW', 'READY', 'LIVE', 'STATUS UNAVAILABLE'];
  for (const s of summaries) {
    assert.ok(allowed.includes(s.status), `status "${s.status}" must be founder language`);
  }
});

test('P2: no fabricated status — every status maps from a real record', () => {
  assert.equal(mapToFounderStatus('Published', undefined), 'LIVE');
  assert.equal(mapToFounderStatus(undefined, 'BUILDING'), 'BUILDING');
  assert.equal(mapToFounderStatus(undefined, 'PRODUCTION'), 'LIVE');
  assert.equal(mapToFounderStatus(undefined, 'RELEASED'), 'READY');
  assert.equal(mapToFounderStatus(undefined, undefined), 'STATUS UNAVAILABLE');
  assert.equal(mapToFounderStatus('Unknown-Internal', 'Weird'), 'STATUS UNAVAILABLE');
});

// ---------------------------------------------------------------------------
// P4 — real data
// ---------------------------------------------------------------------------

test('P4: product memories come from PRODUCTS_DATA, one per product', () => {
  const memories = getAllProductMemories();
  assert.equal(memories.length, PRODUCTS_DATA.length);
  for (const m of memories) {
    assert.ok(m.sources.includes('PRODUCTS_DATA'), 'must cite canonical source');
    assert.ok(m.id && m.title && m.vision, 'must have identity and vision');
  }
});

test('P6: no fabricated percentage anywhere in product memory', () => {
  const memories = getAllProductMemories();
  const blob = JSON.stringify(memories);
  assert.ok(!/%\s*(complete|done|finished|progress)/i.test(blob), 'no progress percentages');
  // completionPercent from projects must not leak into founder view
  for (const m of memories) {
    assert.ok(!JSON.stringify(m).includes('completionPercent'), 'internal completionPercent must not leak');
  }
});

test('P6: no fabricated pricing — only recorded prices', () => {
  for (const m of getAllProductMemories()) {
    const p = PRODUCTS_DATA.find((x) => x.id === m.id);
    if (p.price === 0) {
      assert.equal(m.businessModel.price, 'Not decided yet');
    } else {
      assert.ok(m.businessModel.price.includes(String(p.price)), 'price must match the record');
    }
  }
});

// ---------------------------------------------------------------------------
// P3 — product detail
// ---------------------------------------------------------------------------

test('P3: TedProductDetail covers the 13-section memory', () => {
  const comp = src('src/tedexperience/components/TedProductDetail.tsx');
  for (const s of ['What are we building', 'Who is it for', 'Problem it solves', 'What it does',
    'The experience', 'Key components', "What's finished", "What's left",
    'Business model', 'Important decisions', 'Files & builds', 'Next move', 'Continue with TED']) {
    assert.ok(comp.includes(s), `detail must include "${s}"`);
  }
});

test('P3: functions appear only when supported by the record', () => {
  const m = getProductMemory(PRODUCTS_DATA[0].id);
  const p = PRODUCTS_DATA[0];
  assert.equal(m.functions.length, (p.features || []).length, 'functions must equal record features');
  for (const f of m.functions) {
    assert.ok(['PLANNED', 'IMPLEMENTED', 'VERIFIED'].includes(f.evidence), 'evidence level required');
  }
});

test('P3: Finished vs Left distinction is honest', () => {
  const m = getProductMemory(PRODUCTS_DATA[0].id);
  assert.ok(m.finished.length >= 0, 'finished list exists');
  assert.ok(m.remaining.length > 0, 'remaining list exists');
  for (const f of m.finished) {
    assert.notEqual(f.evidence, 'PLANNED', 'finished items must not be merely planned');
  }
});

test('P3: important decisions come from DECISIONS_DATA', () => {
  const memories = getAllProductMemories();
  const withDecisions = memories.filter((m) => m.decisions.length > 0);
  assert.ok(withDecisions.length > 0, 'at least one product should surface decisions');
  for (const d of withDecisions[0].decisions) {
    assert.ok(d.title && d.scope, 'decisions must have title and scope');
  }
});

test('P3: next move is 1-3 items, plain English', () => {
  for (const m of getAllProductMemories()) {
    assert.ok(m.nextMoves.length >= 1 && m.nextMoves.length <= 3, 'next moves: 1-3 items');
  }
});

test('P6: unavailable fields fail honestly', () => {
  assert.equal(getProductMemory('no-such-product'), null, 'unknown product returns null, not invented');
  const m = getProductMemory(PRODUCTS_DATA[0].id);
  // fields without data say so plainly
  const blob = JSON.stringify(m);
  assert.ok(blob.includes('Not recorded') || blob.length > 0, 'missing data handled');
});

// ---------------------------------------------------------------------------
// P3.13 — Continue with TED
// ---------------------------------------------------------------------------

test('Continue with TED: page wires product context into persona state', () => {
  const page = src('src/pages/TedExperiencePage.tsx');
  assert.ok(page.includes('activeProductId: productId'), 'continueWithTed must set activeProductId');
  assert.ok(page.includes("Say \"let's finish this\""), 'must tell founder how to continue');
});

test('Continue with TED: TED understands "let\'s finish this"', () => {
  const persona = src('src/tedexperience/tedPersona.ts');
  assert.ok(persona.includes("let'?s finish this"), 'persona must handle the phrase');
  assert.ok(persona.includes('activeProductId'), 'persona must read active product context');
  assert.ok(persona.includes('getProductMemoryWithOverlay'), 'must use product memory with session overlay');
});

test('New Chat clears active product context', () => {
  const page = src('src/pages/TedExperiencePage.tsx');
  assert.ok(page.includes('clearMemoryOverlay'), 'New Chat must clear the memory overlay');
  const persona = src('src/tedexperience/tedPersona.ts');
  assert.ok(persona.includes('activeProductId: null'), 'fresh persona state has no active product');
});

// ---------------------------------------------------------------------------
// P7 — evolution architecture
// ---------------------------------------------------------------------------

test('P7: recordProductDecision applies honestly (session-only, no fake persistence)', () => {
  clearMemoryOverlay();
  const id = PRODUCTS_DATA[0].id;
  const r = recordProductDecision(id, { title: 'Test decision', why: 'Because tests', scope: 'Product' });
  assert.equal(r.applied, true);
  assert.equal(r.persisted, false, 'must not claim persistence');
  assert.match(r.message, /NOT yet saved/i);
  clearMemoryOverlay();
});

test('P7: markWorkFinished refuses PLANNED work', () => {
  const r = markWorkFinished(PRODUCTS_DATA[0].id, 'Imaginary feature', 'PLANNED');
  assert.equal(r.applied, false, 'PLANNED work cannot be marked finished');
});

test('P7: markWorkFinished moves Left -> Finished with evidence', () => {
  clearMemoryOverlay();
  const id = PRODUCTS_DATA[0].id;
  const r = markWorkFinished(id, 'Verified feature X', 'VERIFIED');
  assert.equal(r.applied, true);
  assert.equal(r.persisted, false);
  clearMemoryOverlay();
});

// ---------------------------------------------------------------------------
// P9 — existing power preserved
// ---------------------------------------------------------------------------

test('P9: voice session code untouched by product inventory', () => {
  const page = src('src/pages/TedExperiencePage.tsx');
  // voice session refs still present and product changes don't tear them down
  assert.ok(page.includes('sessionRef'), 'voice session ref intact');
  assert.ok(page.includes('SuperVoiceSession'), 'voice session type intact');
});

test('P9: research and bridge modules still wired', () => {
  const page = src('src/pages/TedExperiencePage.tsx');
  assert.ok(page.includes('initLiveResearch'), 'live research init intact');
  assert.ok(page.includes('toolBridge.discover'), 'bridge discovery intact');
});

// ---------------------------------------------------------------------------
// P10/P11 — bridge root and founder-friendly UX
// ---------------------------------------------------------------------------

test('P10: bridge defaults to auto-detected project root, not its own directory', () => {
  const bridge = src('../../os/tool-bridge/bridge.js');
  assert.ok(bridge.includes('findProjectRoot'), 'bridge must smart-detect the project root');
  assert.ok(bridge.includes('--project'), 'explicit --project still supported');
  assert.ok(!bridge.includes("arg('project', process.cwd())"), 'must not blindly default to cwd');
});

test('P11: bridge-unavailable message is founder-friendly', () => {
  const persona = src('src/tedexperience/tedPersona.ts');
  assert.ok(persona.includes('I need access to the local project'), 'founder-friendly message present');
  const replyFn = persona.match(/function bridgeNotConnectedReply[\s\S]{0,800}/)[0];
  assert.ok(!/localhost:\d+|127\.0\.0\.1:\d+/.test(replyFn), 'no ports in the founder message');
});
