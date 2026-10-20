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
