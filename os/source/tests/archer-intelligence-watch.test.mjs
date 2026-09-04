import test from 'node:test';
import assert from 'node:assert/strict';
import { AGENT_OPERATION_SKILLS, resolveAgentOperationsIntent } from '../src/data/agentOperationsSkills.ts';
import { ARCHER_FRESH_SOURCE_REQUIREMENT, ARCHER_INTELLIGENCE_WATCH } from '../src/data/aiIntelligenceWatch.ts';
import { AidenEngine } from '../src/components/aiden/aidenEngine.ts';

class StorageMock {
  constructor(){ this.map=new Map(); }
  getItem(k){ return this.map.has(k) ? this.map.get(k) : null; }
  setItem(k,v){ this.map.set(k,String(v)); }
  removeItem(k){ this.map.delete(k); }
  key(i){ return [...this.map.keys()][i] ?? null; }
  get length(){ return this.map.size; }
}
globalThis.localStorage = new StorageMock();
globalThis.sessionStorage = new StorageMock();

test('Archer is a reusable Agent Operations skill, not a separate bot', () => {
  const skill=AGENT_OPERATION_SKILLS.find(s=>s.id==='AI_INTELLIGENCE_WATCH');
  assert.ok(skill);
  assert.equal(skill.name,'AI INTELLIGENCE WATCH');
  assert.equal(skill.operatingArea,'rd');
  assert.equal(ARCHER_INTELLIGENCE_WATCH.owner,'Archer');
  assert.equal(ARCHER_INTELLIGENCE_WATCH.routedBy,'Aiden');
  assert.ok(ARCHER_INTELLIGENCE_WATCH.workflow.includes('COMPARE TO OCG'));
  assert.ok(ARCHER_INTELLIGENCE_WATCH.founderBriefFields.includes('SOURCE / PROVENANCE'));
});

test('natural founder language routes to Archer with source truth and challenge composition', () => {
  const r=resolveAgentOperationsIntent('What changed that affects us?');
  assert.ok(r);
  const names=r.skills.map(s=>s.name);
  assert.ok(names.includes('AI INTELLIGENCE WATCH'));
  assert.ok(names.includes('SOURCE OF TRUTH'));
  assert.ok(names.includes('CHALLENGE / RED TEAM'));
});

test('Aiden fails closed instead of fabricating current AI news', () => {
  const r=AidenEngine.processQuery('Archer, anything important in AI today?');
  assert.equal(r.category,'TASK_DISPATCH');
  assert.ok(r.reply.includes('ARCHER — AI Intelligence Watch'));
  assert.ok(r.reply.includes(ARCHER_FRESH_SOURCE_REQUIREMENT));
  assert.ok(r.reply.includes('Primary sources first'));
  assert.ok(!r.reply.includes('BREAKING'));
});
