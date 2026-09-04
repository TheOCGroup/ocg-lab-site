import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const index = fs.readFileSync(new URL('../playbooks/lender-ai-super-pro/index.html', import.meta.url), 'utf8');
const book = fs.readFileSync(new URL('../playbooks/lender-ai-super-pro/book.js', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../playbooks/lender-ai-super-pro/app.js', import.meta.url), 'utf8');

test('Lender reader preserves Insurance master-family cover/header pattern', () => {
  assert.match(index, /class=\\\"brand\\\"/);
  assert.match(index, /data-asset=\\\"logo\\\"/);
  assert.match(index, /\\.cover-art/);
  assert.match(book, /class=\\\"page left cover-page\\\"/);
  assert.match(book, /class=\\\"cover-art\\\"/);
  assert.match(book, /LENDER AI<\\/br><span>DIGITAL PLAYBOOK<\\/span>/);
  assert.doesNotMatch(index + book, /cover-custom/);
});

test('Harper stays the playbook specialist and commercial first-run has no client-specific identity', () => {
  assert.match(index, /Lender AI Digital Playbook Specialist/);
  assert.match(book, /separate Lender AI SUPER PRO production worker/);
  assert.doesNotMatch(index + book + app, /Brandy/i);
  assert.doesNotMatch(index + book + app, /Wichita, Kansas/i);
});

test('commercial workbook reset is purchaser-neutral', () => {
  assert.match(app, /document\.querySelectorAll\('\[data-work\]'\)\.forEach\(el=>el\.value=''\s*\)/);
});
