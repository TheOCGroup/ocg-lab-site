const BUCKET = 'ocg-pipeline-reactor-assets';
const OBJECT = 'os/canonical_state.json';
const respond = (value, status = 200) => new Response(JSON.stringify(value), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'vary': 'Origin' }
});
const hex = (value) => {
  if (typeof value !== 'string' || value.length % 2 || !/^[0-9a-f]+$/i.test(value)) throw Error('INVALID_ENCRYPTED_CREDENTIALS');
  return Uint8Array.from(value.match(/../g), part => parseInt(part, 16));
};
async function decryptCredential(key, encrypted) {
  const envelope = JSON.parse(encrypted);
  const secret = await crypto.subtle.importKey('raw', hex(key), 'AES-GCM', false, ['decrypt']);
  const ciphertext = hex(envelope.encryptedData);
  const tag = hex(envelope.authTag);
  const combined = new Uint8Array(ciphertext.length + tag.length);
  combined.set(ciphertext);
  combined.set(tag, ciphertext.length);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: hex(envelope.iv), tagLength: 128 }, secret, combined);
  return JSON.parse(new TextDecoder().decode(plaintext));
}
export async function onRequest({ request, env }) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return respond({ error: 'CROSS_ORIGIN_DENIED' }, 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
  if (!['GET', 'POST'].includes(request.method)) return respond({ error: 'METHOD_NOT_ALLOWED' }, 405);
  // This migration endpoint is intentionally read-only, including authenticated requests.
  if (request.method === 'POST') return respond({ error: 'STAGING_WRITE_DISABLED' }, 403);
  const key = (request.headers.get('x-founder-key') || request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!/^[0-9a-f]{64}$/i.test(key)) return respond({ error: 'UNAUTHORIZED_FOUNDER_ACCESS' }, 401);
  if (!env.OCG_GCS_ADC_ENCRYPTED_JSON) return respond({ error: 'CLOUD_CREDENTIALS_NOT_CONFIGURED' }, 503);
  let credential;
  try { credential = await decryptCredential(key, env.OCG_GCS_ADC_ENCRYPTED_JSON); }
  catch { return respond({ error: 'UNAUTHORIZED_FOUNDER_ACCESS' }, 401); }
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: credential.client_id, client_secret: credential.client_secret,
        refresh_token: credential.refresh_token, grant_type: 'refresh_token'
      })
    });
    if (!tokenResponse.ok) return respond({ error: 'GOOGLE_TOKEN_FAILED' }, 502);
    const token = (await tokenResponse.json()).access_token;
    if (!token) return respond({ error: 'GOOGLE_TOKEN_MISSING' }, 502);
    const url = 'https://storage.googleapis.com/storage/v1/b/' + BUCKET + '/o/' + encodeURIComponent(OBJECT) + '?alt=media';
    const upstream = await fetch(url, { headers: { authorization: 'Bearer ' + token } });
    if (upstream.status === 404) return respond({ exists: false }, 404);
    if (!upstream.ok) return respond({ error: 'GCS_READ_FAILED' }, 502);
    const state = await upstream.json();
    return respond({ ok: true, source: 'google_cloud_storage', state, syncedAt: state.lastSyncedAt, version: state.version });
  } catch { return respond({ error: 'CLOUD_SYNC_UNAVAILABLE' }, 502); }
}
