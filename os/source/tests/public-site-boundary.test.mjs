import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { isPublicCapabilityAllowed, PUBLIC_SITE_INTEGRATION_BOUNDARY } from '../src/data/publicSiteBoundary.ts';

const readme = fs.readFileSync(new URL('../../../README.md', import.meta.url), 'utf8');
const command = fs.readFileSync(new URL('../src/pages/CommandPage.tsx', import.meta.url), 'utf8');

test('public commercial surface is explicitly separated from internal OCG LAB OS authority', () => {
  assert.equal(PUBLIC_SITE_INTEGRATION_BOUNDARY.publicSurface.canonicalRepository, 'TheOCGroup/ocg-lab-site');
  assert.equal(PUBLIC_SITE_INTEGRATION_BOUNDARY.internalSystem.route, '/os/');
  assert.ok(PUBLIC_SITE_INTEGRATION_BOUNDARY.internalSystem.hierarchy.includes('OCG LAB TECHNOLOGY DIRECTOR'));
  assert.ok(readme.includes('least-privilege APIs, registries, or shared services'));
  assert.ok(command.includes('OCG LAB TECHNOLOGY DIRECTOR'));
});

test('public capability policy fails closed for internal/admin scopes', () => {
  assert.equal(isPublicCapabilityAllowed('PRODUCT_CATALOG_READ'), true);
  assert.equal(isPublicCapabilityAllowed('SUPPORT_REQUEST_CREATE'), true);
  for (const forbidden of PUBLIC_SITE_INTEGRATION_BOUNDARY.forbiddenPublicScopes) {
    assert.equal(isPublicCapabilityAllowed(forbidden), false, forbidden);
  }
});

test('boundary forbids secrets and unrestricted internal/tool permissions', () => {
  const policy = JSON.stringify(PUBLIC_SITE_INTEGRATION_BOUNDARY);
  for (const requirement of ['Plaintext secrets', 'FOUNDER_AUTH_MATERIAL', 'PROVIDER_SECRET_READ', 'UNRESTRICTED_TOOL_EXECUTION', 'AUDIT_LEDGER_WRITE_DIRECT']) {
    assert.ok(policy.includes(requirement), requirement);
  }
});
