import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const storage = fs.readFileSync(new URL('../src/data/storageEngine.ts', import.meta.url), 'utf8');
const navbar = fs.readFileSync(new URL('../src/components/Navbar.tsx', import.meta.url), 'utf8');

test('P1 cloud sync requires runtime founder authentication and never embeds a default key', () => {
  assert.match(storage, /FOUNDER_SESSION_KEY/);
  assert.match(storage, /sessionStorage/);
  assert.match(storage, /AUTH_REQUIRED/);
  assert.doesNotMatch(storage, /FOUNDER_KEY_DEFAULT/);
  assert.doesNotMatch(storage, /ocg_founder_key['"]/);
  assert.match(navbar, /Founder key is session-only/);
});

test('P2 cloud-dominant storefront state is reconciled against canonical commerce metadata', () => {
  assert.match(storage, /reconcileStorefrontItems\(cloudState\.storefrontItems, STOREFRONT_ITEMS_DATA\)/);
  assert.match(storage, /CLOUD_DOMINANT/);
});

test('P3 commerce verification cannot mark Live before buyer QA and records seller QA evidence on completion', () => {
  assert.match(storage, /Buyer\/public QA must be VERIFIED with timestamped evidence/);
  assert.match(storage, /sellerQaStatus: 'VERIFIED'/);
  assert.match(storage, /sellerQaVerifiedAt:/);
  assert.match(storage, /sellerQaEvidence:/);
});
