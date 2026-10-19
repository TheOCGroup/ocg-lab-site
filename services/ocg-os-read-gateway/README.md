# OCG OS Canonical Read Gateway — private staging

This Google Cloud Run service reads only `gs://ocg-pipeline-reactor-assets/os/canonical_state.json` using its attached service account. It does not write to storage.

## Verified deployment (2026-10-19)

- Google Cloud project: `ocg-pipeline`, region: `us-central1`.
- Service: `ocg-os-canonical-reader-staging`; deployed and Ready.
- Cloud Run ingress: `internal`; unauthenticated access disabled. No public or external invoker IAM binding was present at the last verification.
- Runtime identity: `ocg-os-canonical-reader@ocg-pipeline.iam.gserviceaccount.com`.
- Storage IAM: one conditional `roles/storage.objectViewer` grant to the runtime identity, matching exactly `os/canonical_state.json`.
- Revision-level maximum instances: 1. The service-level `run.googleapis.com/maxScale` annotation has been observed as 20; resolve this discrepancy before asserting a global scaling cap.
- Repeatable configuration check: `powershell -File services/ocg-os-read-gateway/verify-live-security.ps1`.

**Not verified:** an authenticated internal GET returning canonical state, the corresponding error response for forbidden storage access, or a production-safe frontend caller. A desktop request returned HTTP 404 under internal-only ingress, which does not prove application-level authorization or successful storage access.

## Connection and release gates

1. Create a narrowly authorized caller **inside the permitted Google Cloud network**, without exposing Cloud Run publicly. Grant `roles/run.invoker` only to that caller service identity.
2. Verify a successful authenticated GET `/canonical-state` from that caller and validate the JSON envelope without logging the data. Verify POST is rejected (405) from the same authorized caller.
3. Confirm that the canonical object is current and has the intended founder-approved data before making it authoritative. Existence alone is not freshness.
4. Design and verify an explicit founder authorization boundary before returning canonical state to a browser. Cloud Run IAM alone does not authorize an arbitrary browser user.
5. Only after these checks, add a verified API route to Firebase Hosting and pass the fail-closed readiness gate. Never point a public rewrite directly at this internal data service.
6. Do not alter production DNS, enable writes, or merge the staging branch as a deployment shortcut.

## Local tests

`node --test services/ocg-os-read-gateway/*.test.mjs`

The Cloudflare workload-federation prototype remains **unverified**: no trusted issuer, JWKS, audience, or workload assertion has been demonstrated. Do not accept a user JWT as a workload identity or expose the service to compensate.
