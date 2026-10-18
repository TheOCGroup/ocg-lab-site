// Experimental Cloudflare -> private Cloud Run caller. No credentials embedded.
// Requires a verified OIDC issuer and dedicated Google Workload Identity Federation provider.
export async function invokePrivateGateway({ assertion, providerAudience, serviceAccountEmail, cloudRunUrl, fetcher = fetch }) {
  if (![assertion, providerAudience, serviceAccountEmail, cloudRunUrl].every(v => typeof v === 'string' && v.length > 0)) throw new Error('CALLER_CONFIG_MISSING');
  const sts = await fetcher('https://sts.googleapis.com/v1/token', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ audience: providerAudience, grantType: 'urn:ietf:params:oauth:grant-type:token-exchange', requestedTokenType: 'urn:ietf:params:oauth:token-type:access_token', scope: 'https://www.googleapis.com/auth/cloud-platform', subjectTokenType: 'urn:ietf:params:oauth:token-type:jwt', subjectToken: assertion })
  });
  if (!sts.ok) throw new Error('FEDERATION_FAILED');
  const { access_token } = await sts.json();
  if (!access_token) throw new Error('FEDERATION_FAILED');
  const id = await fetcher('https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/' + encodeURIComponent(serviceAccountEmail) + ':generateIdToken', {
    method: 'POST', headers: { authorization: 'Bearer ' + access_token, 'content-type': 'application/json' },
    body: JSON.stringify({ audience: cloudRunUrl, includeEmail: true })
  });
  if (!id.ok) throw new Error('IDENTITY_MINT_FAILED');
  const { token } = await id.json();
  if (!token) throw new Error('IDENTITY_MINT_FAILED');
  return fetcher(cloudRunUrl.replace(/\/$/, '') + '/canonical-state', { headers: { authorization: 'Bearer ' + token }, method: 'GET' });
}
