import test from 'node:test';
import assert from 'node:assert/strict';
import { readCanonicalState, createHandler } from './server.mjs';

test('uses metadata identity and only reads canonical object', async () => {
  const calls = [];
  const result = await readCanonicalState(async (url, options) => {
    calls.push({ url, options });
    if (calls.length === 1) return { ok: true, json: async () => ({ access_token: 'synthetic-token' }) };
    return { ok: true, json: async () => ({ version: 7 }) };
  });
  assert.equal(result.status, 200);
  assert.equal(result.body.state.version, 7);
  assert.equal(calls.length, 2);
  assert.match(calls[1].url, /canonical_state.json/);
  assert.equal(calls[1].options.headers.authorization, 'Bearer synthetic-token');
  assert.equal(calls[1].options.method, undefined);
});

test('missing canonical object returns 404', async () => {
  let count = 0;
  const result = await readCanonicalState(async () => ++count === 1 ? { ok: true, json: async () => ({ access_token: 'synthetic' }) } : { ok: false, status: 404 });
  assert.equal(result.status, 404);
});

test('rejects missing identity token', async () => {
  await assert.rejects(readCanonicalState(async () => ({ ok: true, json: async () => ({}) })), /IDENTITY_TOKEN_UNAVAILABLE/);
});

test('handler blocks writes and unknown paths without invoking reader', async () => {
  let reads = 0;
  const handler = createHandler(async () => { reads++; return { status: 200, body: { ok: true } }; });
  for (const [method, url, status] of [['POST', '/canonical-state', 405], ['GET', '/other', 404]]) {
    const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, writeHead(n) { this.status = n; }, end() {} };
    await handler({ method, url }, res);
    assert.equal(res.status, status);
  }
  assert.equal(reads, 0);
});
