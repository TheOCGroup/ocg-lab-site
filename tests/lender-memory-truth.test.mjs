import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const familyApp = fs.readFileSync(new URL('../lender-ai-super-pro/family-app.js', import.meta.url), 'utf8');
const bridge = fs.readFileSync(new URL('../lender-ai-super-pro/production-bridge.js', import.meta.url), 'utf8');
const body = fs.readFileSync(new URL('../lender-ai-super-pro/family-body.html', import.meta.url), 'utf8');
const qa = fs.readFileSync(new URL('../lender-ai-super-pro/QA_RELEASE.md', import.meta.url), 'utf8');

test('Lender profile and recent-topic memory remain explicitly browser/device local', () => {
  assert.match(familyApp, /localStorage\.setItem\(PROFILE_KEY/);
  assert.match(familyApp, /Pilot memory is stored on this device\./);
  assert.match(bridge, /localStorage\.getItem\('ocg_lender_super_pro_history_v1'\)/);
  assert.match(qa, /\[x\] Browser profile\/recent-topic memory exists\./);
});

test('Lender commercial UI does not claim unimplemented cloud or cross-device memory', () => {
  const customerFacing = `${body}\n${familyApp}`;
  assert.doesNotMatch(customerFacing, /cross[- ]device memory|cloud memory|server[- ]side memory|syncs? across devices|cloud-synced memory/i);
});

test('Lender QA keeps close-reopen persistence as an evidence gate rather than a claimed pass', () => {
  assert.match(qa, /\[ \] Close\/reopen restores expected purchaser state\./);
  assert.match(qa, /\[ \] Purchaser closes\/reopens and recovers expected state\./);
});
