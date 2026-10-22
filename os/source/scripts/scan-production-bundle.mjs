import fs from 'node:fs';
import path from 'node:path';

const target = process.argv[2] || 'dist';
const files = [];
const walk = p => {
  for (const entry of fs.readdirSync(p, { withFileTypes: true })) {
    const full = path.join(p, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(js|html)$/i.test(entry.name)) files.push(full);
  }
};
const assetsDir = path.join(target, 'assets');
const indexFile = path.join(target, 'index.html');
if (fs.existsSync(assetsDir)) {
  if (fs.existsSync(indexFile)) files.push(indexFile);
  walk(assetsDir);
} else {
  walk(target);
}
const failures = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  if (text.includes('FOUNDER_KEY_DEFAULT')) failures.push(`${file}: default founder-key symbol found`);
  if (/ocg_founder_key(?!_session)/.test(text)) failures.push(`${file}: legacy persistent founder-key storage found`);
  for (const match of text.matchAll(/[0-9a-f]{64}/gi)) {
    const start = Math.max(0, match.index - 12);
    const prefix = text.slice(start, match.index).toLowerCase();
    // A 64-hex literal is a documented hash — not a credential — only when
    // it carries its algorithm label immediately before it, in any standard
    // written form: "sha256:<hex>", "SHA-256 <hex>", "sha-256: <hex>".
    // Published artifact hashes cited in prose (e.g. the knowledge base's
    // verified-artifact reference) are documentation. An UNLABELED 64-hex
    // literal still fails this scan, and the founder-key checks above are
    // unaffected.
    if (!/sha[-\s]?256[\s:]*$/.test(prefix)) failures.push(`${file}: unprefixed 64-hex literal found`);
  }
}
if (failures.length) {
  console.error('Production bundle security scan failed:\n' + failures.join('\n'));
  process.exit(1);
}
console.log(`Production bundle security scan passed (${files.length} files).`);
