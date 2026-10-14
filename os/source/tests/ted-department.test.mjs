import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const dept = fs.readFileSync(new URL('../src/data/tedDepartment.ts', import.meta.url), 'utf8');

test('TED identity matches the governed technologyAgents role-contract shape', () => {
  for (const field of [
    'id:', 'name:', 'role:', 'departmentId:', 'status:', 'specialty:',
    'skills:', 'tools:', 'assignedProjects:', 'executionStats:',
    'operatingLayer:', 'readiness:', 'truthNote:',
  ]) {
    assert.ok(dept.includes(field), `TED record must carry the ${field} field`);
  }
  assert.match(dept, /TechnologyAgentDefinition/);
  assert.match(dept, /export const TED_IDENTITY/);
});

test('TED is the OCG LAB department head with the documented chain of command', () => {
  assert.match(dept, /Ted the Tech Guy/);
  assert.match(dept, /OCG LAB Department Head/);
  assert.match(dept, /FOUNDER.*AIDEN.*CHIEF.*TED/);
  assert.match(dept, /TED_COMMAND_CHAIN/);
});

test('TED is STANDBY / ROLE_READY until a real task executes', () => {
  assert.match(dept, /status: 'STANDBY'/);
  assert.match(dept, /readiness: 'ROLE_READY'/);
  assert.match(dept, /may only show ACTIVE while a[\s\S]*?real Workforce task is running/i);
});

test('TED coordinates MARK / ORION / NOVA and never impersonates them', () => {
  assert.match(dept, /MARK/);
  assert.match(dept, /ORION/);
  assert.match(dept, /NOVA/);
  assert.match(dept, /never impersonates/i);
  assert.match(dept, /never PIPER|real-estate data/i);
});

test('TED truthNote encodes the fail-closed commerce contract', () => {
  assert.match(dept, /STATUS UNAVAILABLE/);
  assert.match(dept, /never fabricates/i);
});

test('TED owns the 10-stage commercial lifecycle vocabulary', () => {
  for (const stage of [
    'LEAD', 'QUALIFIED', 'PRODUCT INTEREST', 'CONVERSATION/DEMO', 'OFFER',
    'PURCHASED', 'ONBOARDING', 'ACTIVE CUSTOMER', 'UPSELL/RENEWAL', 'REVIEW/REFERRAL',
  ]) {
    assert.ok(dept.includes(`'${stage}'`), `lifecycle must include stage ${stage}`);
  }
  assert.match(dept, /TED_COMMERCIAL_LIFECYCLE/);
});
