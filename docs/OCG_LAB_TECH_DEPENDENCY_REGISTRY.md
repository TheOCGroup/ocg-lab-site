# OCG LAB Technical Dependency Registry

## Purpose

This registry is the machine-readable source of truth for OCG LAB production dependencies. It is designed for Technology Operations agents, not as a place to store credentials.

Canonical registry: `ops/tech/dependencies.json`

Automated auditor: `scripts/tech-ops-audit.mjs`

Scheduled workflow: `.github/workflows/tech-ops-audit.yml`

## What this first implementation does

- validates the registry structure
- checks canonical production URLs with retries and timeouts
- validates expected HTTP status and basic product identity through the page title
- records each dependency's provider, credential type, logical credential names, declared connection state, and Founder-action boundary
- publishes a machine-readable report as a GitHub Actions artifact
- runs automatically once daily, on manual demand, and whenever the registry/auditor changes on `main`

## What it deliberately does not do

It does not store or print secret values.

It does not claim an OAuth/API/MCP connection is functional merely because a name appears in the registry.

It does not rotate credentials blindly.

It does not spend money, create paid infrastructure, bypass MFA/CAPTCHA, or take destructive production actions.

## Current credential reality

Repository-level GitHub Actions secrets and variables were audited before implementation and both inventories were empty. Therefore this phase creates the control plane and health registry but does not pretend the repo already has production credentials available to automation.

The OCG LAB OS persistence path is specifically marked `DEGRADED` at the credential-automation layer because `api/os/sync.js` currently decrypts an encrypted OAuth credential file using a Founder-supplied key. That may function at runtime, but it is not the target autonomous secret-management model.

## Next migration target

For each production system, Technology Operations should progressively move credentials to one approved pattern:

1. managed OAuth connector where available
2. workload identity / service account for cloud infrastructure
3. provider-native secret manager or protected runtime secret store for unavoidable secrets
4. logical secret names in the registry only
5. automated health checks that prove authentication, authorization, representative runtime action, and end-to-end user flow

## Repair behavior

The auditor is detection-first. A failed check should trigger the autonomous repair loop defined in `docs/OCG_LAB_TECHNOLOGY_OPERATIONS.md`:

`DETECT -> CLASSIFY -> REPRODUCE -> REPAIR -> TEST -> DEPLOY -> PRODUCTION VERIFY -> EVIDENCE`

Safe automatic repair should be added provider-by-provider only after the corresponding service identity and rollback path are verified. This prevents a generic automation job from making unbounded production changes.

## Definition of progress

This phase is successful when Technology Operations can answer, from one registry:

- what production systems exist
- what endpoints define their health
- what external dependencies they rely on
- what credential class each dependency uses
- which logical credentials are required
- what state the dependency is currently in
- whether a Founder action is genuinely required

The next phase is to connect the actual secret/service-account backends and add authenticated functional probes for each dependency.
