import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../os/source/functions/api/os/sync.js';
const invoke = (method, headers = {}, env = {}) => onRequest({
  request: new Request('https://preview.example/api/os/sync', { method, headers }), env
});
test('Cloudflare staging rejects anonymous GET', async () => {
  const r = await invoke('GET');
  assert.equal(r.status, 401);
});
test('Cloudflare staging rejects cross-origin GET', async () => {
  const r = await invoke('GET', { origin: 'https://attacker.example' });
  assert.equal(r.status, 403);
});
test('Cloudflare staging blocks POST even with a founder key', async () => {
  const r = await invoke('POST', { 'x-founder-key': 'a'.repeat(64) });
  assert.equal(r.status, 403);
  assert.equal((await r.json()).error, 'STAGING_WRITE_DISABLED');
});
test('Cloudflare staging returns 503 without credential secret', async () => {
  const r = await invoke('GET', { 'x-founder-key': 'a'.repeat(64) });
  assert.equal(r.status, 503);
});
test('Cloudflare staging rejects invalid encrypted credentials', async () => {
  const r = await invoke('GET', { 'x-founder-key': 'a'.repeat(64) }, { OCG_GCS_ADC_ENCRYPTED_JSON: '{}' });
  assert.equal(r.status, 401);
});
test('Cloudflare staging rejects unsupported methods', async () => {
  const r = await invoke('PUT');
  assert.equal(r.status, 405);
});
