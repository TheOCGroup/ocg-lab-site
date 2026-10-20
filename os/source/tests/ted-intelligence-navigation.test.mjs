import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('OCG Intelligence preview entry is in existing TED navigation', () => {
  const nav = read('../src/tedexperience/components/TedNav.tsx');
  assert.match(nav, /OCG INTELLIGENCE/);
  assert.match(nav, /onOpenIntelligence/);
  assert.match(nav, /Preview/);
  assert.match(nav, /New chat/);
  assert.match(nav, /Previous Work/);
  assert.match(nav, /onOpenProducts/);
});

test('both desktop and mobile TED navigation wire the preview action', () => {
  const page = read('../src/pages/TedExperiencePage.tsx');
  assert.equal((page.match(/onOpenIntelligence=\{\(\) => \{/g) ?? []).length, 2);
  assert.match(page, /setNavOpen\(false\)/);
  assert.match(page, /setProductsOpen\(true\)/);
});

test('Products view receives intelligence focus from navigation state', () => {
  const page = read('../src/pages/TedExperiencePage.tsx');
  const products = read('../src/tedexperience/components/TedProducts.tsx');
  assert.match(page, /<TedProducts\s+focusIntelligence=\{focusIntelligence\}/);
  assert.match(products, /intelligenceRef\.current\.scrollIntoView/);
});

test('intelligence overview receives keyboard focus and respects reduced motion', () => {
  const products = read('../src/tedexperience/components/TedProducts.tsx');
  assert.match(products, /prefers-reduced-motion: reduce/);
  assert.match(products, /intelligenceRef\.current\.focus\(\{ preventScroll: true \}\)/);
  assert.match(products, /tabIndex=\{-1\}/);
});
