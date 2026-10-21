# TED LAB Workspace — Pipeline Extension Design (PROPOSAL ONLY)

**Status:** design spec, not an implementation. Any database, API, routing, ownership, or handoff change below requires **ASTRA review and approval** before the execution lane implements anything. Nothing here authorizes a contract change.

**Goal:** give TED the OCG LAB commercial workspace he is accountable for — leads through review/referral — as a minimal native extension of the canonical `TheOCGroup/PIPELINE` repo. **No second CRM, no second database, no parallel application.**

**Reference inspected:** `~/workspace/pipeline-recovered` (TheOCGroup/PIPELINE main @ 0c1ec3514e9a13b2ef6cee6af5ecf9e237981652 + pending execution-lane fixes).

---

## 1. Shape of the existing code this mirrors

- Native route modules under `src/http/routes/` (ESM, `handle*Routes(req, res, ctx, url, segments)` convention).
- Piper family: `src/http/routes/piperRoutes.js` → `/api/v1/piper/*`:
  - `GET /brief` (operating brief from stored state)
  - `POST /ask` (one turn; may settle `awaiting_approval`)
  - `POST /cancel`, `POST /approve` (the only write path, gated on readOnly)
  - `GET /thread`, `GET /status`, `POST /probe`
- Migrations `migrations/001..025` (`023_agent_operations_work_room.sql` persists tasks/events with an older status vocabulary).
- Write gating: nothing mutates operator data except an approved path, gated on `readOnly` the same way every other write is.

## 2. Proposed `/api/v1/lab/*` route family (mirrors Piper)

New module: `src/http/routes/labRoutes.js`

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/lab/brief` | TED's operating brief: lifecycle stage counts, open blockers, nearest revenue gate — derived from stored state only |
| POST | `/api/v1/lab/ask` | One TED turn (intent resolution via `handleTedQuery`); may settle `awaiting_approval` |
| POST | `/api/v1/lab/cancel` | Abort an in-flight TED run |
| POST | `/api/v1/lab/approve` | Approve/reject a TED-proposed action — the ONLY write path, gated on readOnly |
| GET | `/api/v1/lab/thread` | Persisted TED transcript |
| GET | `/api/v1/lab/stages` | Lifecycle stage vocabulary + per-stage data-source state (STATUS UNAVAILABLE until sourced) |
| GET | `/api/v1/lab/status` | Provider/connection identity for any connected commerce source (all currently STATUS UNAVAILABLE) |

Conventions to preserve: `sendJson` response helper, `readOnly` gating, `ctx.services` registration, `actorOf` attribution, segment-based dispatch.

## 3. Lifecycle stages as a status vocabulary

Domain module: `src/domain/lab/lifecycleStages.js` — exports the canonical 10 stages from `tedKnowledgeBase.ts`:

```
LEAD → QUALIFIED → PRODUCT INTEREST → CONVERSATION/DEMO → OFFER →
PURCHASED → ONBOARDING → ACTIVE CUSTOMER → UPSELL/RENEWAL → REVIEW/REFERRAL
```

Each stage carries a `dataSource` descriptor (`NONE_VERIFIED` until a real source lands). Transition writes are only permitted via `POST /approve`; stage counts read from the `lab_lifecycle_events` table below.

## 4. Migration 026 sketch (table shape — ASTRA must approve)

`migrations/026_lab_commercial_workspace.sql` — new, LAB-namespaced tables only; zero changes to Piper/real-estate tables:

- `lab_leads` — id, created_at, source_label, contact_ref, stage, notes; CHECK constraint pins `stage` to the 10-stage vocabulary.
- `lab_lifecycle_events` — id, lead_id FK, from_stage, to_stage, actor, created_at; append-only (immutability pattern from migration 004).
- `lab_tasks` — id, title, status (governed vocabulary), owner_agent, evidence, created_at; mirrors the work-room task shape from migration 023 where sensible.

Deliberately OUT of scope: no CRM duplication, no second identity/session system, no new secrets.

## 5. Data-ownership boundaries (non-negotiable)

- TED's workspace is the **OCG LAB commercial workspace**: leads, lifecycle, products, orders, subscriptions, campaigns, onboarding, support, upsells, renewals, reviews, revenue, attribution.
- **PIPER's real-estate namespace is untouched.** No route, table, or query crosses into seller/opportunity/offer data.
- Any future commerce source (Etsy read-back, Whop read-back) connects through the provider-identity pattern used by `/status`, never by storing credentials in repo code.

## 6. ASTRA review checkpoints (must clear before implementation)

1. Auth: does `/api/v1/lab/*` reuse the existing session/Bearer (`PIPELINE_OPERATOR_SECRET`) model unchanged?
2. Data ownership: is the `lab_*` table set a correct, minimal, non-duplicating addition?
3. API contracts: are route shapes and response envelopes consistent with the Piper family?
4. Routing/handoffs: how does the LAB workspace surface to AIDEN/CHIEF dispatch without a new command structure?
5. Secrets: no new secret introduced; provenance of every new row is honest.

## 7. What the execution lane must NOT do

- Do not create a second database, CRM app, hosting account, or paid service.
- Do not backfill fake leads, fake revenue, or fake stage counts to make panels look alive.
- Do not claim the workspace is production-ready until ASTRA approves the contract and the two pending Pipeline fixes are live and re-verified.
