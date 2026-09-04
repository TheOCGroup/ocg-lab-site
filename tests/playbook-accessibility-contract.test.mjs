import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const familyCss = readFileSync(new URL('../playbooks/insurance-agent/styles-2.css', import.meta.url), 'utf8');
const masterVault = readFileSync(new URL('../playbooks/insurance-agent/app-3.js', import.meta.url), 'utf8');
const lenderVault = readFileSync(new URL('../playbooks/lender-ai-super-pro/vault.js', import.meta.url), 'utf8');
const lenderVaultCss = readFileSync(new URL('../playbooks/lender-ai-super-pro/vault.css', import.meta.url), 'utf8');

test('playbook family exposes a visible keyboard focus state', () => {
  assert.match(familyCss, /:focus-visible/);
  assert.match(familyCss, /outline:\s*3px\s+solid\s+var\(--blue\)/);
  assert.match(familyCss, /outline-offset:\s*3px/);
});

test('Prompt Vault card titles use H3 semantics in both master and Lender', () => {
  assert.match(masterVault, /<h3>\$\{p\.name\}<\/h3>/);
  assert.doesNotMatch(masterVault, /<h4>\$\{p\.name\}<\/h4>/);
  assert.match(lenderVault, /<h3>\$\{x\[1\]\}<\/h3>/);
  assert.doesNotMatch(lenderVault, /<h4>\$\{x\[1\]\}<\/h4>/);
  assert.match(lenderVaultCss, /\.vault-card h3/);
});
