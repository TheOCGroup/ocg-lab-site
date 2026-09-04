import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const health = fs.readFileSync(new URL('../api/lender-ai-super-pro/health.js', import.meta.url), 'utf8');
const credential = fs.readFileSync(new URL('../api/lender-ai-super-pro/credential.js', import.meta.url), 'utf8');
const research = fs.readFileSync(new URL('../api/lender-ai-super-pro/research.js', import.meta.url), 'utf8');
const script = fs.readFileSync(new URL('../api/lender-ai-super-pro/script.js', import.meta.url), 'utf8');

test('Lender API health reports the implemented credential boundary truthfully', () => {
  assert.match(health, /customer_owned_ai:true/);
  assert.match(health, /ocg_runtime_ai_key_used:false/);
  assert.match(health, /credential_storage_mode:'encrypted_http_only_browser_isolated'/);
  assert.match(health, /secure_browser_credential_transport_configured:true/);
  assert.match(health, /durable_server_side_credential_store_configured:false/);
  assert.doesNotMatch(health, /secure_credential_store_configured:true/);
});

test('Lender customer credential remains HttpOnly/Secure and is never returned by status', () => {
  assert.match(credential, /HttpOnly; Secure; SameSite=Strict/);
  assert.match(credential, /credential_owner:cfg\?'customer':null/);
  assert.match(credential, /secrets_exposed:false/);
  assert.doesNotMatch(credential, /api_key:cfg\?\.api_key/);
});

test('Lender research is purchaser-neutral and fails closed without a connected provider', () => {
  assert.match(research, /if\(!cfg\)return res\.status\(401\)/);
  assert.match(research, /Connect your own AI provider before using live research/);
  assert.match(research, /const market=String\(body\.market\|\|''\)\.trim\(\)/);
  assert.match(research, /Not specified by purchaser/);
  assert.doesNotMatch(research, /body\.market\|\|'Wichita, Kansas'/);
});

test('Lender script generation requires researched evidence and human approval', () => {
  assert.match(script, /Connect your own AI provider before generating a live script/);
  assert.match(script, /A researched content opportunity is required/);
  assert.match(script, /Current topic has no verified source evidence/);
  assert.match(script, /pending_human_approval/);
});
