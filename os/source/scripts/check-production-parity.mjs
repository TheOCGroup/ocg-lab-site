import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const sourceRoot = path.resolve('dist');
const prodRoot = path.resolve('..');
const hash = (p, rel) => {
  const bytes = fs.readFileSync(p);
  // Generated HTML line endings differ between Windows and Linux builders.
  // Normalize only HTML; binary JS/CSS parity stays byte-exact.
  const content = rel === 'index.html' ? Buffer.from(bytes.toString('utf8').replaceAll(String.fromCharCode(13), '')) : bytes;
  return crypto.createHash('sha256').update(content).digest('hex');
};
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
  else if (hash(a, rel) !== hash(b, rel)) mismatches.push(`content mismatch: ${rel}`);
}
if (mismatches.length) {
  console.error('OCG LAB OS production assets are stale relative to os/source build:\n' + mismatches.join('\n'));
  process.exit(1);
}
console.log(`OCG LAB OS production parity passed (${expected.length} artifacts).`);
