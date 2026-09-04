import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const command = fs.readFileSync(new URL('../src/pages/CommandPage.tsx', import.meta.url), 'utf8');

test('public boundary contract is wired into the live OS command surface', () => {
  assert.match(command, /PUBLIC_SITE_INTEGRATION_BOUNDARY/);
  assert.match(command, /data-public-boundary=\"active\"/);
  assert.match(command, /Public Surface: Request Only/);
  assert.match(command, /forbiddenPublicScopes/);
});
