// Staging-only Cloud Run Job: never log identity tokens or canonical-state contents.
const audience = process.env.GATEWAY_AUDIENCE;
if (!audience || !/^https:\/\/[a-z0-9.-]+\.run\.app$/.test(audience)) throw new Error('INVALID_GATEWAY_AUDIENCE');
const metadataUrl = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=' + encodeURIComponent(audience);
const tokenResponse = await fetch(metadataUrl, { headers: { 'Metadata-Flavor': 'Google' } });
if (!tokenResponse.ok) throw new Error('METADATA_IDENTITY_UNAVAILABLE');
const token = await tokenResponse.text();
if (!token) throw new Error('EMPTY_IDENTITY');
let failed = false;
for (const [method, expected] of [['GET', 200], ['POST', 405]]) {
  try {
    const response = await fetch(audience + '/canonical-state', {
      method,
      headers: { authorization: 'Bearer ' + token },
      signal: AbortSignal.timeout(12000)
    });
    console.log(method + ' status=' + response.status + ' content-type=' + (response.headers.get('content-type') || 'none'));
    if (method === 'GET' && response.ok) {
      const result = await response.json();
      if (!result.ok || !result.state || typeof result.state !== 'object') throw new Error('INVALID_CANONICAL_ENVELOPE');
      console.log('PASS GET: canonical JSON envelope verified; payload withheld');
    }
    if (response.status !== expected) failed = true;
  } catch (error) {
    // Only a known error code/name is logged, never raw response bodies or tokens.
    console.log(method + ' transport-failure=' + (error?.cause?.code || error?.name || 'UNKNOWN'));
    failed = true;
  }
}
if (failed) process.exitCode = 1;
