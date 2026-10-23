import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler, readCanonicalState } from './server.mjs';

function fakeResponse() {
  return {
    status: null,
    headers: {},
    body: '',
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    writeHead(status) { this.status = status; },
    end(body = '') { this.body = body; }
  };
}

test('storage permission errors fail closed without leaking response or token', async () => {
  let calls = 0;
  const reader = () => readCanonicalState(async () => {
    calls++;
    if (calls === 1) return { ok: true, json: async () => ({ access_token: 'private-test-token' }) };
    return { ok: false, status: 403, text: async () => 'secret-storage-details' };
  });
  const response = fakeResponse();
  await createHandler(reader)({ method: 'GET', url: '/canonical-state' }, response);
  assert.equal(response.status, 502);
  assert.deepEqual(JSON.parse(response.body), { error: 'CANONICAL_READ_UNAVAILABLE' });
  assert.equal(response.headers['cache-control'], 'no-store');
  assert.doesNotMatch(response.body, /private-test-token|secret-storage-details/);
  assert.equal(calls, 2);
});

test('failed metadata credential lookup never attempts storage', async () => {
  let calls = 0;
  const response = fakeResponse();
  await createHandler(() => readCanonicalState(async () => {
    calls++;
    return { ok: false, status: 500 };
  }))({ method: 'GET', url: '/canonical-state' }, response);
  assert.equal(calls, 1);
  assert.equal(response.status, 502);
});

test('non-GET methods and unknown routes do not call canonical reader', async () => {
  let reads = 0;
  const handler = createHandler(async () => { reads++; return { status: 200, body: { ok: true } }; });
  for (const [method, url, expected] of [
    ['POST', '/canonical-state', 405],
    ['PUT', '/canonical-state', 405],
    ['DELETE', '/canonical-state', 405],
    ['GET', '/canonical-state?debug=true', 404],
    ['GET', '/healthz', 404]
  ]) {
    const response = fakeResponse();
    await handler({ method, url }, response);
    assert.equal(response.status, expected);
    assert.equal(response.headers['cache-control'], 'no-store');
  }
  assert.equal(reads, 0);
});
