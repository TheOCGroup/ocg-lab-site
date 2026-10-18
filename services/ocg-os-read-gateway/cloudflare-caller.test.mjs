import test from 'node:test';
import assert from 'node:assert/strict';
import { invokePrivateGateway } from './cloudflare-caller.mjs';
const config = { assertion: 'synthetic-jwt', providerAudience: '//iam.googleapis.com/projects/123/locations/global/workloadIdentityPools/pool/providers/provider', serviceAccountEmail: 'caller@example.iam.gserviceaccount.com', cloudRunUrl: 'https://example.run.app' };
test('federates assertion, mints scoped ID token, invokes read-only route', async () => {
  const calls = [];
  const result = await invokePrivateGateway({ ...config, fetcher: async (url, options) => {
    calls.push({ url, options });
    if (calls.length === 1) return { ok: true, json: async () => ({ access_token: 'synthetic-sts' }) };
    if (calls.length === 2) return { ok: true, json: async () => ({ token: 'synthetic-id' }) };
    return { ok: true, status: 200 };
  }});
  assert.equal(result.status, 200);
  assert.equal(calls.length, 3);
  assert.equal(JSON.parse(calls[0].options.body).subjectToken, 'synthetic-jwt');
  assert.equal(JSON.parse(calls[1].options.body).audience, config.cloudRunUrl);
  assert.equal(calls[2].options.method, 'GET');
  assert.equal(calls[2].options.headers.authorization, 'Bearer synthetic-id');
});
test('fails closed if federation is rejected', async () => {
  await assert.rejects(invokePrivateGateway({ ...config, fetcher: async () => ({ ok: false }) }), /FEDERATION_FAILED/);
});
test('fails closed without identity configuration', async () => {
  await assert.rejects(invokePrivateGateway({ ...config, assertion: '' }), /CALLER_CONFIG_MISSING/);
});
