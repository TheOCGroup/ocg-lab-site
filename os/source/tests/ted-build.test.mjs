/**
 * TED Phase 2.2 — super-agent build behavior tests.
 *
 * Verifies the active-build stage machine: intent detection, objective
 * inference, requirement questions (only what matters, max 3), stage
 * advancement, decision tracking, and the founder-friendly status line.
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  wantsBuildPlan,
  inferObjective,
  identifyMissingRequirements,
  startBuild,
  advanceBuild,
  buildStatusLine,
  stageLabel,
} from '../src/tedexperience/tedBuild.ts';

test('wantsBuildPlan detects build intent, not casual mentions', () => {
  assert.equal(wantsBuildPlan("let's build it"), true);
  assert.equal(wantsBuildPlan('start building'), true);
  assert.equal(wantsBuildPlan('how do we build the checkout?'), true);
  assert.equal(wantsBuildPlan('what is the tech stack for this?'), true);
  assert.equal(wantsBuildPlan('tell me about APIs'), false);
  assert.equal(wantsBuildPlan('what about Etsy?'), false);
});

test('inferObjective summarizes the idea plainly', () => {
  const o = inferObjective('I want to build an AI product for real estate investors');
  assert.match(o, /real-estate investors/i);
  assert.match(o, /AI/i);
  assert.equal(inferObjective('').length > 0, true);
});

test('identifyMissingRequirements asks only what matters, max 3', () => {
  const reqs = identifyMissingRequirements('an AI product');
  assert.ok(reqs.length >= 2 && reqs.length <= 3, `got ${reqs.length}`);
  for (const r of reqs) {
    assert.ok(r.question.length > 10);
    assert.ok(r.whyItMatters.length > 10, 'every question justifies itself');
  }
  // A well-specified idea asks fewer questions
  const full = identifyMissingRequirements('an AI SaaS for investors who flip houses, $49/month, MVP is deal scoring');
  assert.ok(full.length <= reqs.length);
});

test('startBuild opens at requirements with questions queued', () => {
  const build = startBuild('Deal Scorer', 'an AI product for real estate investors');
  assert.equal(build.projectName, 'Deal Scorer');
  assert.equal(build.stage, 'requirements');
  assert.ok(build.objective.length > 0);
  assert.ok(build.decisionsNeeded.length > 0);
  assert.ok(build.updatedAt > 0);
});

test('advanceBuild walks requirements -> research -> architecture -> plan', () => {
  let build = startBuild('Deal Scorer', 'an AI product');
  const opts = { researchAvailable: true, toolsAvailable: false };

  // Answer first requirement question
  let r = advanceBuild(build, 'It is for house flippers in Wichita', opts);
  build = r.build;
  assert.ok(r.reply.length > 20);
  assert.equal(build.stage, 'requirements', 'still gathering');

  // Say skip -> moves to research
  r = advanceBuild(build, 'skip the rest', opts);
  build = r.build;
  assert.equal(build.stage, 'research');

  r = advanceBuild(build, 'ok', opts);
  build = r.build;
  assert.equal(build.stage, 'architecture');

  r = advanceBuild(build, 'looks good', opts);
  build = r.build;
  assert.equal(build.stage, 'build-plan');
  assert.ok(r.reply.includes('Build plan'), 'plan presented');
});

test('build plan without tools is honest about the bridge', () => {
  let build = startBuild('X', 'an AI product');
  build.stage = 'build-plan';
  const r = advanceBuild(build, 'go', { researchAvailable: true, toolsAvailable: false });
  assert.match(r.reply, /tool bridge/i);
  assert.match(r.reply, /can.t run the build from here/i);
});

test('build plan with tools starts implementation', () => {
  let build = startBuild('X', 'an AI product');
  build.stage = 'build-plan';
  const r = advanceBuild(build, 'go', { researchAvailable: true, toolsAvailable: true });
  assert.equal(r.build.stage, 'implementation');
});

test('buildStatusLine is short and voice-friendly', () => {
  const build = startBuild('Deal Scorer', 'an AI product');
  const line = buildStatusLine(build);
  assert.ok(line.length < 200, 'terse enough to speak');
  assert.match(line, /Deal Scorer/);
  assert.match(line, /requirements/);
});

test('stageLabel covers every stage', () => {
  for (const s of ['idea', 'requirements', 'research', 'architecture', 'build-plan', 'implementation', 'testing', 'qa', 'deployment']) {
    assert.ok(stageLabel(s).length > 0);
  }
});

test('persona: build intent starts tracking, follow-ups advance stages', async () => {
  const { tedPersonaRespond, initialPersonaState } = await import('../src/tedexperience/tedPersona.ts');
  let state = initialPersonaState();
  state.ideaDraft = 'an AI product for real estate investors';

  const r1 = tedPersonaRespond("let's build it", state, {});
  assert.ok(r1.build, 'build tracking started');
  assert.equal(r1.build.stage, 'requirements');
  assert.match(r1.reply, /Let's build it/);
  state = { ...state, build: r1.build };

  const r2 = tedPersonaRespond('it is for house flippers', state, {});
  assert.ok(r2.build);
  state = { ...state, build: r2.build };

  const r3 = tedPersonaRespond('where are we', state, {});
  assert.match(r3.reply, /requirements/);
});

test('persona: bridge intents need the bridge connected', async () => {
  const { tedPersonaRespond, initialPersonaState } = await import('../src/tedexperience/tedPersona.ts');
  const state = initialPersonaState();

  // Not connected -> honest, founder-friendly reply, no op (Phase 2.3 P11:
  // no bridge/tool terminology in the founder message).
  const r1 = tedPersonaRespond('run the tests', state, { bridgeConnected: false });
  assert.equal(r1.bridgeOp, null);
  assert.match(r1.reply, /I need access to the local project/);

  // Connected -> real op descriptor
  const r2 = tedPersonaRespond('run the tests', state, { bridgeConnected: true });
  assert.ok(r2.bridgeOp);
  assert.equal(r2.bridgeOp.kind, 'test');

  const r3 = tedPersonaRespond('inspect the project', state, { bridgeConnected: true });
  assert.equal(r3.bridgeOp.kind, 'inspect');

  const r4 = tedPersonaRespond('change hello to hello world in a.txt', state, { bridgeConnected: true });
  assert.equal(r4.bridgeOp.kind, 'edit-propose');
  assert.equal(r4.bridgeOp.path, 'a.txt');
  assert.equal(r4.bridgeOp.oldText, 'hello');
  assert.equal(r4.bridgeOp.newText, 'hello world');
});

test('persona: edit confirm requires a pending edit', async () => {
  const { tedPersonaRespond, initialPersonaState } = await import('../src/tedexperience/tedPersona.ts');
  const state = initialPersonaState();

  // "apply it" with no pending edit -> not an edit-confirm
  const r1 = tedPersonaRespond('apply it', state, { bridgeConnected: true });
  assert.ok(!r1.bridgeOp || r1.bridgeOp.kind !== 'edit-confirm');

  // With pending edit -> confirm op carrying the confirmation id
  const withPending = {
    ...state,
    pendingEdit: { confirmationId: 'abc123', path: 'a.txt', diffPreview: '- hello\n+ hi' },
  };
  const r2 = tedPersonaRespond('apply it', withPending, { bridgeConnected: true });
  assert.ok(r2.bridgeOp);
  assert.equal(r2.bridgeOp.kind, 'edit-confirm');
  assert.equal(r2.bridgeOp.confirmationId, 'abc123');
});
