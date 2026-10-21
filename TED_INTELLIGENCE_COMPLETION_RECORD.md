# OCG INTELLIGENCE inside TED — Completion & Engineering Record

Date: 2026-10-21 · Owner lane: Muse (builder) · Independent QA: separate reviewer agent (verdict below)
Repository: TheOCGroup/ocg-lab-site · Branch: `feat/ted-ocg-intelligence-workspace-20261021`
Release boundary honored: **no merge, no deploy, no DNS, no production settings, no paid services, no publishing.** Isolated branch only, ready for a separate production-release decision.

## 1. Recovery — what already existed (verified 2026-10-21 via GitHub API)

| Source | State found | Disposition |
|---|---|---|
| ocg-lab-site PR #81 (draft, base `main` e79e98b, head 7cfa7cc) | Read-only product metadata (`intelligenceProduct.ts`) + development card in TedProducts. No workspace, no data flow. | Metadata adopted verbatim into the founder TED tree; card retained and given a working "Open Intelligence workspace" action. |
| ocg-lab-site PR #82 (draft, stacked on #81, head b58bdf1) | Sidebar entries (Products + OCG INTELLIGENCE Preview, desktop + mobile) that scrolled to the Products card. Its own QA gate states it "does not prove live Market Radar" and independent review was NOT YET EXECUTED; checked-in `/os` parity FAIL. | Nav pattern adopted and completed: the entry now opens a dedicated workspace. The QA gate's unexecuted acceptance items were executed here (see §4). |
| ocg-lab-site PR #70 (open, base `ted/ocg-lab-department-integration`) | Interactive Planning Studio in `UnifiedWorkspacePage`; unrelated git history vs. the #82 stack (no merge base). | Not merged (per #82 gate: never `--allow-unrelated-histories`). No file overlap with this work except shared build surfaces; reconciliation is an integration-owner step (§6). |
| OCG-ONE PR #20 (draft, head cee14d58) | The real Market Radar prototype: pure read-only JS (`marketRadar`, `competitorComparison`, `pricingEvidenceGate`, `receptionistPricing`, `reviewedPricingReport`, `dashboardModel`, `brandRegistry`), 9 test files, naming registry, TED handoff + integration-boundary docs, and the 2026-10-20 public-source competitor baseline (Smith.ai, Goodcall). | Logic ported faithfully to TypeScript inside TED (§2). Baseline is the sole evidence source (§3). |

Base divergence, stated plainly: PRs #81/#82 sit on `main`; the founder's verified TED experience lives on the `ted/ocg-lab-department-integration` lineage (largely uncommitted in the source working tree). This completion was built on the founder TED lineage and adopts #81/#82's artifacts and patterns. Reconciling the two lineages onto one canonical branch is an integration-owner decision (§6) — not silently done here.

## 2. What was built

- **`os/source/src/tedexperience/intelligence/`** — TypeScript port of the OCG-ONE logic, upstream semantics preserved (validation rules, category weights 25/20/20/15/10/10, OBSERVED-only scoring, missing categories never zero, fail-closed pricing gate with 30-day freshness + human-review requirement, duplicate-name rejection, illustrative pricing constants + caveat + sources). Documented extensions: `classifyEvidence` (accepted / unscored / rejected with reasons), evidence-quality report (counts, freshness, scoring state), `latestEvidenceAt` reporting field, `isSafeExternalUrl` render allowlist.
- **`evidenceData.ts`** — bundled dataset transcribed from the 2026-10-20 baseline only (see §3).
- **`TedIntelligenceWorkspace.tsx`** — focused workspace inside TED's main area: evidence-quality panel, competitor comparison with per-category coverage, per-record source attribution (link, retrieved date, usage rights, verdict), pricing-gate panel with per-plan findings and candidate records, illustrative scenario calculator with input-failure surfacing, empty/failure states, module rail (Market Radar PREVIEW; Signal / Watchtower / Strategist PLANNED with honest "not built yet" panels).
- **Sidebar (TedNav + TedExperiencePage)** — Products and OCG INTELLIGENCE (Preview) entries on desktop and mobile, active-state for the intelligence view; Products scrolls to the retained inventory (this lineage's layout). View switching touches no conversation state: `openIntelligence` is `setView` + mobile-drawer close only.
- **`intelligenceProduct.ts`** — PR #81 metadata, statuses unchanged (BUILDING / PREVIEW / PLANNED ×3, no price, no production URL).
- **Tests** — `tests/ted-intelligence-market-radar.test.mjs` (19: upstream-parity assertions replicated from OCG-ONE's suites + dataset truth contract + allowlist), `tests/ted-intelligence-navigation.test.mjs` (10: integration contracts), `tests-browser/ted-intelligence.browser.mjs` (36 Playwright checks).

Commits on the branch: `c9bc0c6` (workspace), `167d79b` (QA fixes U2/U3), `59a1eeb` (preservation of the founder TED working tree, content unchanged, so the branch builds standalone).

## 3. Evidence & truth contract

- Every evidence record: official competitor page, `retrievedAt` 2026-10-20, usage rights "Public factual observation — vendor-reported claim; no independent performance verification."
- **No scores anywhere.** The baseline forbids inventing 0–100 scores before a rubric exists; all records carry `score: null` and render as "Not scored — rubric pending." Unscored is never rendered as zero.
- **Pricing gate is BLOCKED by design of the evidence, not by a bug:** candidate records match the modeled terms but carry `reviewed: false` (baseline research ≠ human review), so the fail-closed gate refuses to present any price as verified. The scenario calculator is labeled illustrative, carries the upstream caveat ("Not a quote") and source links.
- No traffic, market-share, conversion, or performance figures exist in the data — the baseline records none.
- Signal / Watchtower / Strategist are PLANNED in metadata, nav, card, and workspace. Nothing in the new code claims LIVE for intelligence.
- Time behavior (QA U5): freshness is evaluated against the current date; the 2026-10-20 evidence crosses the 30-day threshold around 2026-11-19, after which the UI flags it stale. It fails in the safe direction (gate stays BLOCKED).

## 4. Verification — evidence

Builder-run (this lane):
- TypeScript: `tsc --noEmit` clean.
- Unit suite: **233/233 PASS** (`npm test`; 204 pre-existing + 29 new). Includes all pre-existing TED suites — conversation, voice session, product memory, live research, truthfulness — unregressed.
- Build: `vite build` PASS.
- Browser (Playwright Chromium against the served production build): **36/36 PASS** — desktop 1440×900 (sidebar open/focus, data flow, source links, gate state, scenario math $212.5/$79, invalid-input alert, planned panel, conversation + voice-control preservation, history persistence across reload, no intelligence-attributable external requests, zero page errors), reduced-motion pass, mobile 390×844 (drawer entry, workspace open/close, no horizontal overflow, back-to-chat, zero page errors). Screenshots: `qa-evidence/desktop-intelligence.png`, `qa-evidence/mobile-intelligence.png`.
- Clean-checkout verification: fresh clone of the branch → `npm install` → test → build (result recorded in §5 addendum).

Failures encountered and corrected during verification (all in test harnesses, one in product):
- Browser text assertions failed on CSS-uppercase rendering (`innerText` reflects `text-transform`) — assertions made case-insensitive; product text verified correct from rendered output.
- Strict-mode locator collisions (message in thread + Previous Work; two nav instances) — locators scoped.
- Security check initially flagged two pre-existing app-shell requests (Google Fonts stylesheet; Tool Bridge localhost health probe at 127.0.0.1:3777 — both predate this work); the check was rescoped to the actual boundary: the intelligence integration adds no network surface.
- Product fix: "1 days old" pluralization in the freshness line.

Independent QA (separate reviewer agent; read every new file, ran the suite itself, no files modified):
- **Verdict: CERTIFIED WITH NOTES.** All 9 claims PASS (code + its own 233-test run — run before the +1 allowlist test, at the then-current 232; see addendum).
- Its limits, stated by the reviewer: browser behavior verified from code only (it did not run Playwright — builder evidence above stands as the browser record); upstream byte-diff of the port NOT VERIFIED by it (behaviors individually verified + parity tests).
- Unlisted findings and disposition: **U1** branch not self-contained → fixed by preservation commit `59a1eeb` + clean-checkout verification. **U2** rejected-record links clickable → fixed (`isSafeExternalUrl` on every href; unsafe URLs render as text) in `167d79b`. **U3** setState inside `useMemo` → fixed (pure derived scenario outcome) in `167d79b`. **U4** evidence validation accepts http while pricing gate requires https → upstream semantics, retained deliberately; render allowlist covers link risk. **U5** wall-clock freshness → documented in §3. **U6** pre-existing LIVE style in TedProducts status map (founder vocabulary; not applied to intelligence) → noted, untouched. **U7** "focused" = main area; Products section/artifact aside remain mounted around it → accurate description, accepted. **U8** browser claim unverified by reviewer → see builder evidence above.

## 5. Addendum — final state (2026-10-21)

- Clean-checkout verification (closes QA U1): fresh `git clone` of `feat/ted-ocg-intelligence-workspace-20261021` @ `59a1eeb` into a clean directory → `npm install` OK → **`npm test` 233/233 PASS** → **`npm run build` PASS**, and the built bundle contains the OCG INTELLIGENCE workspace. The branch is self-contained.
- Independent QA ran at the 232-test state; the +1 test is the U2 allowlist test added with its fix. Final suite: 233/233 (builder-run, twice: working tree + clean checkout).
- Browser battery re-run after the U2/U3 fixes: **36/36 PASS** on the rebuilt bundle; screenshots refreshed.
- Deliverables: this record; branch commits `c9bc0c6`, `167d79b`, `59a1eeb`; full-range patch `ocg-intelligence-ted-workspace.patch` (against `b5c4392`); preview package `ocg-intelligence-ted-preview.zip` (built `dist/` + screenshots + run instructions).

## 6. What remains for a production-release decision (not done, by design)

1. Integration owner: choose the canonical branch (founder TED lineage vs. `main`/#81/#82 stack), apply this work there, rebuild checked-in `/os` assets once from the combined source, and run the repo's parity + generated-bundle security gates (the #82 gate items 6–8).
2. A human pricing reviewer signs off the Smith.ai/Goodcall records (or the gate stays BLOCKED — the correct default).
3. A scoring rubric is defined before any competitor score is displayed.
4. Evidence refresh cadence: re-observe sources before the 30-day staleness threshold lapses (~2026-11-19 for the current dataset).
5. PR #70 reconciliation (unrelated histories; owner selects the target branch; no force-merge).
6. Founder approval to merge/deploy — nothing in this record authorizes it.

## 7. How to run the preview

From a checkout of the branch: `cd os/source && npm install && npm run build && npm run preview` → open the printed URL; TED opens on the conversation, OCG INTELLIGENCE is in the left sidebar. Or serve the packaged `dist/` in `ocg-intelligence-ted-preview.zip` with any static file server.


---

# ROUND 2 — FINAL INTEGRATION, DESIGN & FUNCTIONAL CERTIFICATION (2026-10-21)

Final commit under certification: **`e2e5a7ec90a908c9b48284f67a078f120e96e492`** on `feat/ted-ocg-intelligence-workspace-20261021` ("TED Intelligence: design polish + final certification battery (58/58)").

## R2.1 Commit discrepancy — resolved with proof

Round 1 shipped with latest commit `6d6da19` (record) while the preview package cited `59a1eeb`. Resolution: `59a1eeb` committed the founder TED working-tree files **unchanged** (they were already the build inputs) and `6d6da19` changed documentation only. Proof: rebuilding at `6d6da19` reproduced the shipped preview bundle **byte-identically** (JS sha256 `0ac123435e5a…`, CSS `eca00807616c…`, identical Vite content-hashed filenames). Source, build, screenshots, and tests therefore corresponded to one content revision. The Round 2 package removes the ambiguity by construction: build, screenshots, battery, and this record all derive from commit `e2e5a7e` (build bundle `index-KUKDz8uk.js`, reproduced deterministically from that source three times, including a fresh clean checkout).

## R2.2 Design polish (native to TED; no redesign, no competing system)

Class-level changes only (45 insertions / 45 deletions across `TedIntelligenceWorkspace.tsx`, `TedNav.tsx`, `TedProducts.tsx`; zero logic changes):
- Contrast: secondary text moved from `slate-400` to `slate-500/600` across the workspace (breadcrumb, researched-date line, category/evidence meta, freshness, pricing findings, footer), the sidebar (Previous Work label, timestamps, empty-history note), and the intelligence product card.
- Sizes: status chips 10px → 11px; module status micro-labels 9px → 10px; Previous Work label 9px → 11px; meta/dates raised to 12.5px.
- Buttons standardized to 40px minimum height with consistent hover and a visible focus treatment (`focus-visible:ring-2` OCG blue + offset) on nav items, workspace controls, product-card actions, and links; scenario inputs gained border contrast and focus rings.
- Mobile module rail: single-row horizontal scroll below `sm` (clean cut-off cue), wrapping above; competitor cards use tighter padding on small screens; workspace title steps 20px → 22px at `sm`.
- Verified visually from the final build's screenshots (desktop 1440, tablet 768, mobile 390, 320, 200% zoom): no overflow, no clipping, TED's white/soft-gray + navy + OCG-blue system unchanged.

## R2.3 Functional certification battery (builder-run, real Chromium)

`os/source/tests-browser/ted-intelligence-certification.browser.mjs` — 58 control-by-control checks, all executed against the served production build of commit `e2e5a7e`; combined results committed at `os/source/tests-browser/cert-results.json`. **58/58 PASS.**

Coverage: TED hero/composer/Send; suggestion chips; attach menu + system file chooser; microphone control honest path (fake media device — see limitations); Previous Work list/open/delete-all; New chat (incl. from inside the workspace); Products scroll, 10 product cards, detail dialog open/close, Continue-with-TED context hand-off, intelligence-card provenance link (OCG-ONE PR #20) and workspace button; workspace truth contract (unscored never zero, Gate: BLOCKED with human-review reason, classification tiles + verdict chips); exact link-target set for the workspace (6 unique official URLs, 10 anchors, all `_blank` + `noopener`; targets captured via request interception and aborted — nothing left the machine); scenario calculator model-exact math (200/150 → Smith.ai $462.5, Goodcall $118.5), illustrative labeling, invalid inputs (customers > calls, negative calls) announced via `role=alert`, very-large-input edge; Signal/Watchtower/Strategist honest planned panels; keyboard focus rings + Enter/Space activation; widths 320/390/768/1024/1440 with zero horizontal overflow; 200% zoom (720 CSS px @ 2x); reduced motion; conversation preservation across the intelligence round-trip and a full browser refresh (localStorage `ted.conversations.v1`); network boundary (zero intelligence-attributable external requests across all flows); zero uncaught page errors.

Execution honesty: the battery ran in two executions against the identical build — a main run recording 48/48 through width 1024 before the shared VM's memory pressure killed a renderer during the 1440 pass (315MB free of 7.9GB at the time), and a completion run (10/10) for the remainder. An earlier full run (51/57) failed six assertions; every one was traced with evidence to **test-harness wording** (paraphrased copy, CSS-uppercase innerText, an aria-label mismatch, a link set missing the scenario source list) — the application's rendered behavior was correct in each case, the assertions were corrected against source, and all six pass in the final runs. No genuine application defect was found by the battery.

## R2.4 Regression

- Unit suite: **233/233 PASS** at `e2e5a7e` (includes all pre-existing TED suites).
- TypeScript: clean. Production build: PASS, deterministic (`index-KUKDz8uk.js`).
- `scripts/scan-production-bundle.mjs`: FAILS on one 64-hex literal — traced to a **published artifact SHA-256 in the founder's TED knowledge base** (`src/data/tedKnowledgeBase.ts`, an "approved artifact verified byte-identical" note, commit 087d70a5 reference). The **unmodified founder build** (Oct 3) trips the identical failure. Not a secret, not introduced by this work; the founder's knowledge content was not edited.
- `scripts/check-production-parity.mjs`: FAILS as expected on this lineage — checked-in `/os` production assets predate the integration. Promoting the build into `/os` is the production-release step (§6 of Round 1), not part of this branch's scope.

## R2.5 Independent QA (Round 2) — CERTIFIED WITH NOTES

Reviewer: separate agent, no writes to this repository; all work in its own fresh clone (`/tmp/qa-clone`). Commit reviewed: `e2e5a7e` (confirmed via `git rev-parse HEAD`).

- **Scope — PASS.** Every hunk of `e2e5a7e` read: class-only changes in the 3 components + the battery and its results JSON. Nothing beyond the claimed scope.
- **Clean checkout — PASS.** Fresh clone → `npm install` (192 packages) → **233/233 tests** → build reproduces `index-KUKDz8uk.js` exactly.
- **Browser battery, run by the reviewer — PASS 58/58 in a single unfiltered run** (its own build, its own server). All sections personally observed, including link-set equality, scenario math ($462.5 / $118.5), invalid-input alerts, planned panels, keyboard, widths 320–1440, 200% zoom, reduced motion, persistence, network boundary, zero page errors. Cross-check: its 58 check names match the committed `cert-results.json` check-for-check, and **all five screenshots from its run are byte-identical (SHA-256) to `qa-evidence/*.png`** — commit, build, results, and screenshots provably correspond to one revision.
- **Truth contract (reviewer's own probes) — PASS.** All 4 records `score: null`; live DOM contains no `N/100`, no `Score: N`, zero `%` characters; gate code makes `reviewed !== true` itself blocking, "REVIEWED" occurs 0 times in the workspace, "Gate: BLOCKED" rendered; scenario labeled illustrative with the "Not a quote." caveat; the 6 live hrefs are exactly the union of `evidenceData.ts` + scenario sources, each record carrying source URL + 2026-10-20 retrieval date + usage rights; PLANNED modules honest ("It is planned only — …"), no LIVE claim anywhere; the network-interception logic was read before running and cannot be gamed by the app, and the intelligence tree contains no fetch/WebSocket/XHR at all.
- **Design — PASS.** All five captures reviewed: native to TED, secondary text legible, 320px tiles stack cleanly, rail scroll cue by design, 200% zoom fully legible. TED chat behavior unaltered (class-only diff + suite + live §A/§B).
- **Scan/parity dispositions — CONFIRMED.** The 64-hex finding is the founder knowledge-base artifact hash (`tedKnowledgeBase.ts:197`, untouched by this branch); the unmodified founder build trips the identical failure. Parity failure = checked-in `/os` assets predate the branch; a release-step state, not a defect.
- **Unlisted findings (all cosmetic or previously known; none blocks certification):** U1 two battery assertions are weaker than their names (Previous Work listing, voice text match) — stricter neighboring checks carry both verdicts; U2 the quality warning's "Incomplete or rejected" disjunction (upstream wording) sits next to a REJECTED=0 tile — technically accurate, can mislead a fast reader; U3 the `e2e5a7e` commit message says micro-labels went to 11px — module-rail status labels are 10px and one TedProducts eyebrow remains 10px (this record states the accurate figures in R2.2 as "9px → 10px" for module labels); U4 packaging files were uncommitted in the working tree at review time (resolved: this record is committed after the verdict; the certified commit is self-consistent without them); U5 console-error notes in `cert-results.json` are the harness's own aborted font requests, not app defects; U6 wall-clock freshness (~2026-11-19 threshold, fails safe); U7 real-microphone/Web Speech scope NOT VERIFIED (environment limit, stated in R2.6).

**Overall: CERTIFIED WITH NOTES** — the integrated build at `e2e5a7e` is verified end-to-end and ready for a separate production-release decision.

## R2.6 Limitations & blockers (unchanged from Round 1 unless noted)

- Real microphone capture and the Web Speech recognition service: NOT VERIFIED (headless environment; fake-device path and honest unsupported behavior verified instead).
- Empty/malformed-data rendering: unit-level via the component test seam; a compiled production bundle cannot be re-injected in the browser (scenario invalid-input states ARE browser-verified).
- Pricing gate remains BLOCKED until a human reviewer signs off the exact source terms — by design.
- Competitor scores remain unscored until a rubric is defined — by design.
- Evidence freshness is wall-clock evaluated; the 2026-10-20 dataset crosses the 30-day threshold ~2026-11-19 and will flag stale (fails safe).
- Production release (canonical-branch choice vs the `main`/#81/#82 stack, `/os` rebuild + parity, merge/deploy) remains a separate founder/integration-owner decision. This lane has no GitHub write path; the branch + full-range patch are the hand-off artifacts.

---

# ROUND 3 — REPOSITORY INTEGRATION & RELEASE READINESS (2026-10-21)

## R3.1 Canonical lineage determination (repository evidence)

Fresh API inspection, 2026-10-21: PR #81 (draft, base main e79e98b0) and PR #82 (draft, stacked on #81) unchanged; PR #70 open, base `ted/ocg-lab-department-integration`; OCG-ONE PR #20 unchanged. **The remote head of `ted/ocg-lab-department-integration` is `00d4a9ce` and it is AHEAD of the local lineage copy (`b5c4392`) the certified branch was built on**: its tree carries the os-sync function + tests, ProjectActionsPanel/UnifiedWorkspacePage, TedCommercialization, lotusDiscovery, and a rebuilt `/os` (assets `index-BAcq1hL6.js`) that the local copy never had. Blob-level three-way comparison (352 remote blobs vs 353 local): 24 remote-only files, 25 local-only files (the certified intelligence work + this record), 18 differing files.

**Determination: `ted/ocg-lab-department-integration` is the canonical TED lineage** (it is the department-integration branch, PR #70's base, and the only lineage containing the TED experience). The main-based #81/#82 stack remains a drafts-only metadata/nav lineage whose artifacts were already adopted into the certified build; retiring or rebasing those drafts is the integration owner's separate decision.

## R3.2 Integration method (no force-merge, no overwrites)

Of the 18 differing files, the certified work intentionally changed only 3; the other 15 were stale-lineage divergence, resolved **remote-wins** (api/os/sync.js, App.tsx, Navbar.tsx, aidenEngine.ts, clientSolutions.ts, storageEngine.ts, tedKnowledgeBase.ts, OperationsPage.tsx, ProjectsPage.tsx, productMemory.ts, tedPersona.ts, tedWorkspace.ts, types.ts, ted-product-memory.test.mjs, os/index.html). All 24 remote-only files were imported unchanged. The 3 intentional files were merged by hand onto the remote versions:

- **TedNav.tsx** — remote delta was empty; the certified file is the merge.
- **TedProducts.tsx** — certified file minus the scroll-era `id="ted-products"` (the remote layout is a full view, not a scroll region).
- **TedExperiencePage.tsx** — remote is the base (its props `onOpenProjects`/`onOpenUnified`, Commercialization + Products full-view state, and header/drawer buttons are preserved). Integration follows the remote's own pattern: an `intelligenceOpen` view state, mutually exclusive with products/commercial views; both TedNav instances (aside + mobile drawer) wire `onOpenIntelligence` + `activeView`; conversation state is never touched by view switching.

**PR #70 reconciliation:** its delta vs the same base is 7 files (.gitattributes, os/index.html, 2 generated /os assets, check-production-parity.mjs, InteractivePlanningStudio.tsx, UnifiedWorkspacePage.tsx). Overlap with this integration is confined to generated artifacts (os/index.html + /os assets), which are rebuilt by whichever change lands last — no content conflict. The two branches can merge in either order; #70 itself is untouched.

## R3.3 Engineering gates — resolved

- **Bundle security scan:** the one finding was a classification error, proven in Round 2 (a published artifact SHA-256 cited in founder knowledge-base prose; the unmodified founder build trips it identically). Fix in `os/source/scripts/scan-production-bundle.mjs`: a 64-hex literal is classified as a documented hash only when an explicit SHA-256 label sits immediately before it (`sha256:`, `SHA-256 `, `sha-256:` forms). Secret detection is NOT weakened — synthetic-bundle proof: bare unlabeled 64-hex → FAIL; `FOUNDER_KEY_DEFAULT` symbol → FAIL; `SHA-256 <hex>` → PASS. The founder-key checks are untouched. Scan on the integrated build: **PASS**.
- **/os parity:** assets rebuilt from the integrated source (`index-BdMaDMAQ.js` / `index-BAsPQfoT.css` + approved-logo.png) and copied to `/os` per the repo's own parity contract: **parity PASS (6 artifacts)**. Nothing was deployed anywhere; these are branch files only.

## R3.4 Full gate run on the integrated tree

| Gate | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | clean |
| Unit suite | **247/247 PASS** (233 certified + 14 lineage tests now included) |
| Production build | PASS — `dist/assets/index-BdMaDMAQ.js` |
| Bundle security scan | **PASS** (R3.3) |
| Production parity | **PASS** (6 artifacts) |
| Browser certification battery | **58/58 PASS** against the integrated build |

Integration adaptations, all test-side, each traced with evidence (no application defect found): (1) two navigation unit assertions updated to the integrated wiring (drawer-wrapped handler, inline back-setter); (2) the battery's Products check now asserts the view swap instead of scroll; (3) the battery re-opens the Products view before the card checks (Continue returns to chat in the view layout); (4) the battery ends the voice session via focus+Enter — the live voice UI re-renders continuously, defeating Playwright's mouse-stability check although the button is verified visible/enabled/stable by probe; keyboard input is a real user path. One genuine behavior note: the remote page wires voice identically to the certified page (same TedChat), and start/end were both exercised successfully in the integrated build.

## R3.5 Delivery to GitHub

The write path is the repository connector's Git Data API tooling (the round-1/2 "read-only" conclusion is superseded — a write CLI ships in the same connector; its guard requires the branch head to match the fetched ref, no force). The integration is delivered as ONE commit on a new branch `integration/ted-ocg-intelligence-20261021`, created at the lineage head `00d4a9ce`, containing exactly the content delta computed in R3.1/R3.2 plus the R3.3/R3.4 gate artifacts (rebuilt /os, scanner fix, adapted tests, battery + results, this record). A draft PR targets `ted/ocg-lab-department-integration`. Commit SHA and PR number are recorded in the delivery message and the release decision record; the pushed tree is hash-verified against this local integrated tree before the PR is opened. **Not merged. Not deployed.**

## R3.6 Independent integration QA

_PENDING — verdict inserted on receipt. The reviewer verifies the NEW integrated commit (not the e2e5a7e certification): pushed-tree identity vs this local tree via the API, diff scope vs the R3.2 method, its own fresh gates (unit, build, scan, parity, battery), preservation spot-checks of lineage-only features (os-sync files, commercialization view, UnifiedWorkspace presence), and the scanner-fix adversarial cases._
