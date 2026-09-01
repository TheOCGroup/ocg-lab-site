# OCG LAB Recovery Map

Recovered: 2026-09-01

This map covers OCG LAB only. OCG OS, OCG MEDIA, and OCG HOME OS are explicitly excluded.

| Found | Canonical | Reuse | Duplicate / Risk | Missing | Recommended action |
| --- | --- | --- | --- | --- | --- |
| Product delivery repository | `TheOCGroup/ocg-lab-site` | Yes | None confirmed at repository level | Technology Department OS | Extend this repository; preserve every existing product route |
| Prior product-organization work | Branch `aiden/ocg-lab-product-organization` at `426712a` | Selectively | Experimental storefront modules must not be confused with the internal Technology Department OS | Branch reconciliation | Reuse its canonical product catalog and paid-access findings; do not blindly merge experimental pages |
| Product delivery deployment | Vercel `ocg-lab-products`, `prj_KzPT5VKcYdi8YrHd4ulXzBuxQeng` | Yes | Older `ocg-lab-site` and test projects require reconciliation | Authenticated internal OS deployment boundary | Do not delete; map domains and last-known-good releases first |
| Approved OCG LAB logo | `assets/approved-logo.png` | Yes | Multiple embedded/base64 copies exist in product artifacts | Central token package | Reuse canonical asset; extract tokens only after visual comparison |
| Commercial products | Existing routes plus linked product repositories | Yes | Several products have test/handoff Vercel variants | Unified canonical product registry | Register one product identity with multiple evidence relationships |
| MAESTRO | `TheOCGroup/maestro` + Vercel `maestro` | Yes | No duplicate canonical identity established | Live registry integration | Preserve current production; ingest verified evidence |
| NOVA | `TheOCGroup/nova` + Vercel `nova` | Yes | Production alias/release history needs reconciliation | Live registry integration | Verify current canonical production release before changes |
| Aiden Mobile | `TheOCGroup/bryan-os` | Yes | Legacy name remains in repository identity | Current distribution evidence integration | Preserve repository identity; recover latest verified Firebase release |
| Insurance Agent AI PRO | Dedicated repository and Vercel project | Yes | Playbook test projects exist | Product-family QA record | Independently verify the production customer workflow |
| Real Estate Investor AI products | Dedicated repositories/projects and OCG LAB routes | Yes | AI PRO/SUPER PRO identities and landing-page projects overlap | Canonical packaging decision | Reconcile product vs landing page without merging identities prematurely |
| LeadFlow AI PRO | `ocg-lab-site/leadflow-ai-pro` | Yes | No separate canonical repository identified | Production visual QA | Keep inside canonical site until evidence supports extraction |
| OCG LAB design history | Approved logo, existing product interfaces, Library design/product files | Yes | Multiple generated previews and embedded gateways | Formal token and component source | Recover visual rules; do not invent a new logo or theme |
| Technical workforce | Requirements and prior operating model | Partial | Decorative/runtime claims would be misleading | Secured orchestration backend | Define responsibilities now; label runtime `NOT CONNECTED` |
| Technology intelligence/radar | Governing requirements | No implementation found | None | Provider evaluation data and review workflow | Install schema first; connect feeds only with cost/security controls |
| QA/release evidence | Per-product files, repositories and deployment histories | Partial | Evidence is fragmented | Canonical verification ledger | Normalize evidence without upgrading claimed states |
| Paid-product access control | `.release/PAID_PRODUCT_ACCESS_GATE.md` on recovered product-organization branch | Yes | Current public application routes may expose paid products anonymously | Canonical checkout + server-verified entitlement | Treat as a P0 release blocker and fail closed before storefront certification |
| Infrastructure/cost control | GitHub and Vercel inventory recovered | Partial | Numerous test/unlinked projects | Billing, domains, cloud and provider inventories | Reconcile before any paid provisioning or cleanup |

## Phase 0 decision

The canonical starting point is `TheOCGroup/ocg-lab-site`, deployed through the linked Vercel project `ocg-lab-products`. The first operating-system slice lives at `/os/` so existing storefront and fulfillment routes remain unchanged.

## Verification boundary

The `/os/` foundation uses recovered records only. It does not claim live monitoring, AI execution, incident ingestion, billing telemetry, or production controls. Those capabilities remain labeled `NOT CONNECTED` until secured server-side integrations are implemented and independently tested.
