import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source=readFileSync(new URL('../api/os/sync.js', import.meta.url),'utf8');
test('cloud upload reads current object generation and uses a conditional write',()=>{
 assert.match(source,/fields=generation/);
 assert.match(source,/ifGenerationMatch=\$\{generation\}/);
 assert.match(source,/metadataRes.status === 404 \? "0"/);
});
test('concurrent update is surfaced as retryable conflict instead of blind overwrite',()=>{
 assert.match(source,/uploadRes.status === 412/);
 assert.match(source,/res.status\(409\)/);
 assert.match(source,/CLOUD_GENERATION_CONFLICT/);
});
