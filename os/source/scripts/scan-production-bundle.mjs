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
    if (!prefix.includes('sha256:')) failures.push(`${file}: unprefixed 64-hex literal found`);
  }
}
if (failures.length) {
  console.error('Production bundle security scan failed:\n' + failures.join('\n'));
  process.exit(1);
}
console.log(`Production bundle security scan passed (${files.length} files).`);
