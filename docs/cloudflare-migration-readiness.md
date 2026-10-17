# OCG LAB Cloudflare migration — readiness and cutover gates

Status: PREPARATION ONLY. Do not route production traffic to Cloudflare yet.

## Verified inventory

- Canonical GitHub repository: `TheOCGroup/ocg-lab-site`; deployed OCG OS entrypoint: `/os/`.
- Existing Netlify production site: `ocg-lab-os.netlify.app`.
- Netlify function `netlify/functions/os-sync.mjs` handles `/api/os/sync` with authenticated reads and conditional writes to Google Cloud Storage. It uses the Netlify runtime environment variable `OCG_GCS_ADC_ENCRYPTED_JSON`. Do not put this variable in public build output or commit it.
- Cloudflare Wrangler on the development workstation is not authenticated as of October 17, 2026.
- Netlify rejects new deploys because account credit usage is exceeded; the current site remains published.

## Safe migration sequence

1. Authenticate Cloudflare Wrangler with the owner's intended account using `npx wrangler login` on the authorized workstation. Never paste API tokens into chat or commit them.
2. Create a **separate staging Pages project** and publish a build from the canonical repo. Preserve the repository root as the published directory so `/os/` and existing asset paths remain intact. Do not attach the live domain.
3. Port `/api/os/sync` to a Cloudflare-compatible runtime or retain it behind a separately authorized backend. Preserve same-origin behavior, authentication, conditional generation writes, response codes, and fail-closed errors. Configure encrypted credentials as runtime secrets only; do not expose them in Pages assets.
4. Verify the browser app, routing, all static assets, voice UI, login/access, and a real authenticated sync read/write/conflict test on staging. Use independent QA and record evidence before cutover.
5. Compare hosting usage/costs with Netlify and approve the final architecture.
6. Switch the production domain only after staging parity and rollback testing. Keep the Netlify site available for rollback until production checks pass.

## Blockers

- Cloudflare account authorization is required to create or deploy a project.
- `/api/os/sync` has not been ported or verified on Cloudflare.
- No production cutover is authorized or complete.

## Deployment discipline

Use preview builds for iterative changes. Promote a tested release to production only after all gates pass. Avoid repeated production deployments for minor development changes.
