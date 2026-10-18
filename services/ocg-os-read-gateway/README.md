# OCG OS Read Gateway (staging only)

A minimal Google Cloud Run service that uses its attached service identity to GET `gs://ocg-pipeline-reactor-assets/os/canonical_state.json`. No storage writes are implemented.

## Current state

- Source and unit tests exist. Not deployed.
- Do not reuse the broad-privilege `sa-reactor` identity.
- Require authenticated Cloud Run invocation (do **not** grant `allUsers` invoker).
- A federated caller **prototype** is implemented and unit-tested, but there is no verified Cloudflare-issued OIDC assertion, dedicated Google provider, or deployed caller. Do not deploy as a publicly accessible shortcut.

## IAM deployment requirements

1. Create a dedicated service account for this service.
2. Grant only `roles/storage.objectViewer` on the required bucket, preferably with an object-specific IAM condition where supported.
3. Deploy Cloud Run with `--no-allow-unauthenticated` and the dedicated service account.
4. Grant `roles/run.invoker` only to a verified Cloudflare caller identity. This requires a supported Google-signed ID token flow or an independently reviewed alternative.
5. Confirm anonymous requests return 401/403, authenticated GET reads only the canonical object, and POST returns 405.
6. Never expose service credentials or canonical state in public logs.

## Local test

`node --test services/ocg-os-read-gateway/*.test.mjs`

## Rollout gate

Do not alter production DNS, deploy this gateway, or merge the Cloudflare PR until caller identity, IAM least privilege, and live authenticated reads have been reviewed and verified.

## Identity federation blocker

The caller prototype assumes a cryptographically verifiable OIDC JWT issued to the Cloudflare workload, accepted by a dedicated Google Workload Identity Federation provider. Cloudflare Pages deployment does not by itself establish such an issuer, audience, or JWT. **Do not substitute an arbitrary Cloudflare Access user JWT** without verifying that the token identifies the intended workload and is restricted to the exact caller. Before configuring IAM, document the token issuer, JWKS, audience, claims, rotation, and replay/threat model. If no suitable workload assertion is available, choose another authenticated transport rather than exposing Cloud Run publicly.
