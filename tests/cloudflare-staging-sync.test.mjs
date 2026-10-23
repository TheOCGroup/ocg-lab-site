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

test('Cloudflare staging decrypts credential and reads GCS without writing', async () => {
  const { webcrypto } = await import('node:crypto');
  const founderKey = 'ab'.repeat(32);
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const key = await webcrypto.subtle.importKey('raw', Uint8Array.from(Buffer.from(founderKey, 'hex')), 'AES-GCM', false, ['encrypt']);
  const credential = { client_id: 'test-client', client_secret: 'test-secret', refresh_token: 'test-refresh' };
  const encrypted = new Uint8Array(await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(credential))));
  const envelope = JSON.stringify({
    iv: Buffer.from(iv).toString('hex'),
    encryptedData: Buffer.from(encrypted.slice(0, -16)).toString('hex'),
    authTag: Buffer.from(encrypted.slice(-16)).toString('hex')
  });
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), method: options.method || 'GET' });
    if (String(url) === 'https://oauth2.googleapis.com/token') {
      assert.equal(new URLSearchParams(options.body).get('refresh_token'), 'test-refresh');
      return Response.json({ access_token: 'test-token' });
    }
    assert.match(String(url), /storage\.googleapis\.com\/storage\/v1\/b\/ocg-pipeline-reactor-assets\/o\/os%2Fcanonical_state\.json\?alt=media/);
    assert.equal(options.headers.authorization, 'Bearer test-token');
    return Response.json({ version: '3.0.0', lastSyncedAt: '2026-10-18T00:00:00Z' });
  };
  try {
    for (const encoded of [envelope, '{iv:' + Buffer.from(iv).toString('hex') + ',authTag:' + Buffer.from(encrypted.slice(-16)).toString('hex') + ',encryptedData:' + Buffer.from(encrypted.slice(0, -16)).toString('hex') + '}']) {
    const response = await invoke('GET', { 'x-founder-key': founderKey }, { OCG_GCS_ADC_ENCRYPTED_JSON: encoded });
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.ok, true);
    assert.equal(body.version, '3.0.0');
    assert.deepEqual(calls.map(c => c.method).slice(-2), ['POST', 'GET']);
    assert.equal(calls.filter(c => c.url.includes('storage.googleapis.com') && c.method !== 'GET').length, 0);
    }
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Cloudflare staging responses are never cacheable', async () => {
  for (const [method, headers, env] of [
    ['GET', {}, {}],
    ['GET', { 'x-founder-key': 'a'.repeat(64) }, {}],
    ['POST', { 'x-founder-key': 'a'.repeat(64) }, {}],
    ['GET', { origin: 'https://attacker.example' }, {}],
  ]) {
    const response = await invoke(method, headers, env);
    assert.match(response.headers.get('cache-control') || '', /no-store/i);
  }
});

test('Cloudflare staging rejects cross-origin preflight', async () => {
  const response = await invoke('OPTIONS', { origin: 'https://attacker.example' });
  assert.equal(response.status, 403);
});

test('Cloudflare staging allows same-origin preflight without caching', async () => {
  const response = await invoke('OPTIONS', { origin: 'https://preview.example' });
  assert.equal(response.status, 204);
  assert.match(response.headers.get('cache-control') || '', /no-store/i);
});

test('Cloudflare staging rejects writes before invoking upstream services', async () => {
  const originalFetch = globalThis.fetch;
  let upstreamCalls = 0;
  globalThis.fetch = async () => { upstreamCalls++; throw Error('Unexpected upstream request'); };
  try {
    const response = await invoke('POST', { 'x-founder-key': 'a'.repeat(64) }, { OCG_GCS_ADC_ENCRYPTED_JSON: 'test' });
    assert.equal(response.status, 403);
    assert.equal(upstreamCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
