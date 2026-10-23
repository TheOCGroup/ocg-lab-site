import http from 'node:http';
import { pathToFileURL } from 'node:url';

const BUCKET = 'ocg-pipeline-reactor-assets';
const OBJECT = 'os/canonical_state.json';
const METADATA_TOKEN = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';

export async function readCanonicalState(fetcher = fetch) {
  const tokenResponse = await fetcher(METADATA_TOKEN, { headers: { 'Metadata-Flavor': 'Google' } });
  if (!tokenResponse.ok) throw new Error('IDENTITY_TOKEN_UNAVAILABLE');
  const { access_token } = await tokenResponse.json();
  if (typeof access_token !== 'string' || !access_token) throw new Error('IDENTITY_TOKEN_UNAVAILABLE');
  const url = 'https://storage.googleapis.com/storage/v1/b/' + BUCKET + '/o/' + encodeURIComponent(OBJECT) + '?alt=media';
  const response = await fetcher(url, { headers: { authorization: 'Bearer ' + access_token } });
  if (response.status === 404) return { status: 404, body: { error: 'CANONICAL_STATE_NOT_FOUND' } };
  if (!response.ok) throw new Error('STORAGE_READ_FAILED');
  return { status: 200, body: { ok: true, state: await response.json() } };
}

export function createHandler(reader = readCanonicalState) {
  return async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET') { res.writeHead(405); res.end(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' })); return; }
    if (req.url !== '/canonical-state') { res.writeHead(404); res.end(JSON.stringify({ error: 'NOT_FOUND' })); return; }
    try { const result = await reader(); res.writeHead(result.status); res.end(JSON.stringify(result.body)); }
    catch { res.writeHead(502); res.end(JSON.stringify({ error: 'CANONICAL_READ_UNAVAILABLE' })); }
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  http.createServer(createHandler()).listen(Number(process.env.PORT || 8080), '0.0.0.0');
}
