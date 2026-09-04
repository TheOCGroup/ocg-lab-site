import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const master = readFileSync(new URL('../playbooks/insurance-agent/index.html', import.meta.url), 'utf8');
const lender = readFileSync(new URL('../playbooks/lender-ai-super-pro/index.html', import.meta.url), 'utf8');
const familyCss = readFileSync(new URL('../playbooks/insurance-agent/styles-2.css', import.meta.url), 'utf8');

for (const [name, html] of [['Insurance master', master], ['Lender', lender]]) {
  test(`${name} exposes a native Print / Save PDF control`, () => {
    assert.match(html, /Print \/ Save PDF/);
    assert.match(html, /aria-label="Print or save this playbook as PDF"/);
    assert.match(html, /onclick="window\.print\(\)"/);
  });
}

test('shared mobile CSS keeps the PDF control reachable', () => {
  assert.match(familyCss, /\.top-actions \.print-btn\{display:inline-flex!important/);
});
