# TED Product Command Center — /os Surface Design

**Status:** design spec for the execution lane. Deployment target is the **existing Netlify `/os` promote path only** (`os/source` → bundle → `/os`). No new hosting, no Vercel (superseded), no parallel app.

**Pattern reuse:** model the surface on `os/source/src/pages/OperationsPage.tsx` + `os/source/src/data/technologyAgents.ts` (governed roster + operating surface + readiness counts + flow banner). TED's record (`src/data/tedDepartment.ts`) renders in the same governed style.

---

## 1. Placement

- New page/section inside the existing `/os` surface (e.g. a "LAB Department" tab alongside the Technology Department operations surface), wired through the existing `App.tsx` routing — not a new route tree.
- TED's section appears only after CHIEF-level authorization context exists; it is a department command view, not a developer console.

## 2. Panels

### 2.1 Products (from `TED_PRODUCTS`)
- One row per product: name, type, route, page state (renders live), checkout state, readiness, price.
- Empty/unknown states: **"STATUS UNAVAILABLE — no verified source"** — never zeros, never guesses.
- The row for a product with no verified checkout must not contain a buy button or price; it contains the status truth.

### 2.2 Deployments (from `TED_DEPLOYMENTS`)
- Production row: published deploy id, file count, health (HTTP 200 / 401 behavior).
- Sync-timeout patch row: **BLOCKED** with the exact founder-only unblock action (add Netlify account credits, rerun the approved deploy script).
- No green "deployed" badge unless the provider confirms the published deploy.

### 2.3 Commerce (from `TED_COMMERCE`)
- Per channel: catalog / orders / revenue / customers / subscriptions — each renders its verification state.
- When all are STATUS UNAVAILABLE, the panel says so plainly: *"No verified commerce source is connected. TED will not invent commercial proof."*

### 2.4 Lifecycle (from `TED_LIFECYCLE_STATE`)
- The 10 stages as a flow strip. Each stage shows its data-source state. All currently STATUS UNAVAILABLE — the strip renders as honest gaps, not empty charts.

## 3. Empty-state standard (mandatory)

Every panel's empty state renders the literal pattern:

> **STATUS UNAVAILABLE — no verified source**
> *TED reports only verified state. This panel stays honest until a verified source feeds it.*

Zero-filled charts, sample data, or "demo mode" figures are prohibited.

## 4. Truthfulness gates (must hold before any production claim)

- No panel may render a price, order count, revenue figure, or customer count that does not come from a verified source.
- Registry-recorded prices (from `TED_REGISTRY_RECORDED_PRICES`) render with their recorded-verification date and a **"recorded evidence — not current live price"** label.
- The sync-timeout patch deployment remains BLOCKED; the command center must not contradict that state.

## 5. Post-deploy verification note

The pending sync-timeout patch swaps the live bundle `index-ClFous8_.js` → `index-DAtRr9ge.js`. After that deploy (once Netlify credits are added), the execution lane must re-verify the Technology Department surface still renders before treating TED's command-center home as intact.
