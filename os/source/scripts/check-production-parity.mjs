import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const sourceRoot = path.resolve('dist');
const prodRoot = path.resolve('..');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const list = root => {
  const out = [];
  const walk = (dir, rel='') => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const childRel = path.join(rel, entry.name);
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full, childRel);
      else out.push(childRel.replaceAll('\\','/'));
    }
  };
  walk(root);
  return out.sort();
};
const expected = list(sourceRoot).filter(p => p === 'index.html' || p.startsWith('assets/') || p.startsWith('favicon.'));
const actual = list(prodRoot).filter(p => p === 'index.html' || p.startsWith('assets/') || p.startsWith('favicon.'));
const mismatches = [];
for (const rel of new Set([...expected, ...actual])) {
  const a = path.join(sourceRoot, rel), b = path.join(prodRoot, rel);
  if (!fs.existsSync(a)) mismatches.push(`production-only: ${rel}`);
  else if (!fs.existsSync(b)) mismatches.push(`missing production: ${rel}`);
  else if (hash(a) !== hash(b)) mismatches.push(`content mismatch: ${rel}`);
}
if (mismatches.length) {
  console.error('OCG LAB OS production assets are stale relative to os/source build:\n' + mismatches.join('\n'));
  process.exit(1);
}
console.log(`OCG LAB OS production parity passed (${expected.length} artifacts).`);
