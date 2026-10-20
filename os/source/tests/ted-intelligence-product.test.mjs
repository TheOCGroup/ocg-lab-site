import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('OCG Intelligence development card is present only in TED Products', () => {
  const products = read('../src/tedexperience/components/TedProducts.tsx');
  assert.match(products, /INTELLIGENCE_PRODUCT/);
  assert.match(products, /In development/);
  assert.match(products, /View development progress/);
  assert.match(products, /rel="noopener noreferrer"/);
});
test('development metadata cannot be mistaken for a live priced product', () => {
  const metadata = read('../src/tedexperience/intelligenceProduct.ts');
  assert.match(metadata, /status: 'BUILDING'/);
  assert.match(metadata, /status: 'PREVIEW'/);
  assert.match(metadata, /status: 'PLANNED'/);
  assert.doesNotMatch(metadata, /price:/);
  assert.doesNotMatch(metadata, /productionUrl:/);
});
test('TED chat and navigation remain unchanged by the new card', () => {
  const nav = read('../src/tedexperience/components/TedNav.tsx');
  assert.match(nav, /New chat/);
  assert.match(nav, /Previous Work/);
  assert.match(nav, /onOpenProducts/);
});
