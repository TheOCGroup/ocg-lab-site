# Lender AI SUPER PRO — Whole-Product Final QA Gate

## Release rule
This product does not pass because one page loads, one agent answers, one deployment succeeds, or one workflow works in isolation.

**FINAL PASS means the complete Brandy customer experience works as one product:**

Playbook + Harper + Lender AI SUPER PRO + research + content recommendation + verified script + approval gates + self-record path + consented-avatar path + production + independent QA + publishing package + memory + permissions + simple automations + mobile/desktop + persistence/recovery + failure states.

If any required production capability is simulated, disconnected, misleading, inaccessible, or fails its acceptance test, the whole product remains NOT READY for Brandy final delivery.

## Mandatory commercial release sequence
BUILD → FUNCTIONAL QA → VISUAL/RESPONSIVE QA → SECURITY/INTEGRATION QA → INDEPENDENT PURCHASER ACCEPTANCE QA → ADVERSARIAL/FAILURE QA → FINAL APPROVAL → PRODUCTION VERIFY → COMMERCIAL/SELLABLE.

**No purchaser PASS = no sale. No evidence = no PASS.**

The agent that built or fixed the release may not perform Independent Purchaser Acceptance QA for that release. Purchaser QA must be performed cold by another agent that did not implement requirements, code, design, prompts, integrations, or fixes for the release. The purchaser receives only what a paying customer receives and may not use hidden builder knowledge, developer access, undocumented setup, preconfigured browser state, or builder assistance.

---

## Product-role separation

### Harper — Playbook specialist
Harper is the interactive teacher inside the Digital Playbook. Harper must know the whole lender playbook, explain prompts and workflows, show clearly hypothetical examples, help with workbook exercises, find the right workflow from plain English, role-play practice scenarios, and explain guardrails. Harper is **not** the production AI employee and must not fake live research, connected-account work, publishing, or lending decisions.

### Lender AI SUPER PRO — production worker
The AI SUPER PRO is the working system Brandy trains/configures. It must research what is worth posting, rank opportunities using current evidence and history, produce source-backed lender-safe scripts, remember approved profile/brand preferences, support self-record and consented-avatar production, prepare platform packages, use connections only after authorization, and remain draft/approval gated unless explicit action permission exists.

---

## A. First-open / zero-instruction test
- [ ] Public Brandy delivery link opens without owner/developer help.
- [ ] Product clearly tells Brandy what it is and what to do first.
- [ ] Playbook and AI SUPER PRO are visibly connected but roles are not confused.
- [ ] Harper can immediately explain the product and guide the first action.
- [ ] No unavailable integration is represented as already connected.
- [ ] No technical/developer language is required to get started.

Evidence: desktop + mobile screenshots/video and first-use transcript.

## B. Digital Playbook test
- [x] Insurance-master-style book reader architecture implemented.
- [x] Book cover, chapter navigation, Previous/Next and reading progress implemented.
- [x] Harper embedded with Guide / Example / Role-play / Find Prompt modes.
- [x] Workbook implemented with local persistence.
- [x] Daily Routine and 30-Day assignments implemented.
- [x] Print/PDF control implemented.
- [ ] Every spread visually inspected desktop/mobile.
- [ ] Keyboard and screen-reader order audited.
- [ ] Print/PDF visually inspected page-by-page.
- [ ] Refresh/reopen restores reading/workbook state.

## C. Harper acceptance test — teacher, not worker
- [ ] Explain Morning Lender Brief purpose, inputs, output and example.
- [ ] Show hypothetical New Lead Follow-Up and label assumptions.
- [ ] Find No-Response workflow from “A buyer stopped replying.”
- [ ] Role-play Realtor with preferred lender, then coach.
- [ ] Explain avatar consent + approval + production sequence.
- [ ] On “What should I post today?” distinguish teaching from invoking production AI; never fake live research.
- [ ] Never invent live rates, approvals, eligibility or company policy.
- [ ] Remain context-aware across chapters.

## D. AI Content Scout — production proof
- [ ] Run live authoritative research.
- [ ] Return at least 3 ranked opportunities.
- [ ] Every time-sensitive opportunity includes source evidence + freshness timestamp.
- [ ] Distinguish evergreen ideas when live evidence is unavailable.
- [ ] Use content history to avoid unnecessary repetition.
- [ ] Identify intended audience.
- [ ] Include why-now, hook, CTA and compliance-risk classification.

Fail: generic topic list pretending to be current; uncited current claims; repeated recent content without reason.

## E. Script Studio — production proof
- [ ] Generate 30/45/60-second scripts for a real Scout topic.
- [ ] Match audience and Brandy profile.
- [ ] Trace current claims to evidence.
- [ ] Show disclosure/verification flags.
- [ ] Generate hook, headline, CTA, B-roll and caption plan.
- [ ] Rewrite preserves verified facts.
- [ ] Cannot progress to production before human approval.
- [ ] Refuse/verify requests to invent today’s rate, promise qualification, or guarantee savings.

## F. Self-record production path
- [ ] Approved script loads in teleprompter.
- [ ] Real browser camera permission and record/stop/review/discard/retry work.
- [ ] Camera denial has useful failure state.
- [ ] Recording is safely preserved through workflow.
- [ ] Media processing/captions/branding are real.
- [ ] 9:16 output visually inspected.

## G. Avatar production path
- [ ] Explicit identity consent required.
- [ ] Private provider identity stored securely server-side.
- [ ] Cannot render by typing another person’s identity.
- [ ] Exact approved script sent to render.
- [ ] 9:16 render completes and identity/voice match approval.
- [ ] Provider failure is recoverable and never faked.

## H. Independent functional/content QA
QA is separate from script generation.
- [ ] Verify cited claims support spoken wording.
- [ ] Detect uncited/outdated claims and guarantee/approval/savings language.
- [ ] Verify disclosures, captions, terminology, approved script match, safe areas, framing and CTA.
- [ ] Deliberate bad script blocks release.

## I. Publish package
- [ ] Instagram Reels, Facebook, TikTok and YouTube Shorts packages.
- [ ] Thumbnail suggestion.
- [ ] Facts/disclosures preserved; no new unsupported claims.
- [ ] Auto-publishing off until explicit approved scope exists.

## J. Memory / personalization
- [x] Pilot browser profile/recent-topic memory exists.
- [x] Playbook workbook local persistence exists.
- [ ] Authenticated server-side lender profile.
- [ ] Brand voice, disclosures, topics, CTA and secure avatar reference retained.
- [ ] Harper learning context and production memory remain separated.
- [ ] Unauthorized user cannot access Brandy memory.

## K. Permissions / connections
- [x] Consent UI exists before connection action.
- [ ] Real secure provider authorization and exact scopes.
- [ ] Denial leaves product usable; revocation removes future access.
- [ ] Draft-only behavior enforced until explicit action permission.
- [ ] No provider secrets exposed client-side.

## L. Simple automation workflows
End-to-end proof required for Morning Brief, New Lead, No Reply, Preapproval Check-In, Weekly Partner Touch, Weekly Content Batch, Closing Milestone and Past Client Nurture. Each proves trigger/input → AI work → approval → output/action → stop/opt-out.

## M. BIGVU replacement test
- [ ] Confirm exact BIGVU functions Brandy uses and actual billing before cancellation recommendation.
- [ ] Reproduce each required workflow.
- [ ] Compare quality, time, friction and cost repeatedly.
- [ ] Recommend cancellation only after verified parity for her actual workflow.

## N. Responsive / browser / resilience QA
- [ ] Chrome/Edge desktop; iPhone/Android/narrow mobile.
- [ ] Reload persistence.
- [ ] Offline/network, research, model and avatar-provider failures.
- [ ] Camera/microphone denial and OAuth denial/revocation.
- [ ] Duplicate-click/idempotency, keyboard-only, focus visibility/modal focus.

## O. Independent Purchaser Acceptance QA — mandatory commercial gate
This gate occurs after functional, visual/responsive, and security/integration QA. It is not performed by the builder.

Required purchaser evidence:
- [ ] QA agent identity recorded.
- [ ] Evidence QA agent did not build/fix this release.
- [ ] Clean browser/session/device state recorded.
- [ ] Purchaser receives only customer delivery package/link.
- [ ] No hidden instructions, developer access, preloaded state or builder assistance.
- [ ] First-open purpose and next action understood without coaching.
- [ ] Purchaser configures required profile/workbook/permissions.
- [ ] Purchaser independently achieves advertised primary outcome.
- [ ] Purchaser closes/reopens and recovers expected state.
- [ ] Permission denial and provider/network failure states are understandable/recoverable.
- [ ] Confusing instructions, simulated production capability presented as real, inaccessible features, unsupported AI claims, failed persistence, or inability to achieve the primary outcome causes FAIL.
- [ ] Screenshots/video, transcript, logs and evidence references retained.

A FAIL automatically returns the release to the responsible builder/workforce stage. After fixes, a new clean purchaser retest is required. Builder may not coach the retest.

## P. Adversarial / failure QA
- [ ] Inject at least one factual defect; QA catches and blocks it.
- [ ] Attempt unsupported current-rate/program claims; system refuses/verifies.
- [ ] Attempt approval/eligibility/guaranteed-savings claim; system blocks it.
- [ ] Exercise connection denial/revocation, network/provider failure, duplicate action and stale evidence.
- [ ] Corrected release is independently retested.

## Q. Final Brandy scenario — mandatory release proof
1. First-time purchaser opens final delivery link.
2. Harper explains playbook and demonstrates one prompt.
3. Purchaser personalizes profile/workbook.
4. Opens AI SUPER PRO and asks what to post today.
5. Scout performs live research and returns ranked, sourced recommendations.
6. Select one; system creates verified 60-second lender script.
7. Harper may teach/practice without pretending to be production worker.
8. Purchaser approves script.
9. Chooses self-record or consented private avatar.
10. System produces video.
11. Independent functional/content QA checks output.
12. Independent purchaser QA completes cold customer journey.
13. Adversarial defect is caught; corrected release retested.
14. Platform publish package created.
15. Close/reopen persistence works and recent topic is not unnecessarily repeated.
16. Final Approval Agent reviews evidence and alone authorizes COMMERCIAL/SELLABLE.

Required proof: screenshots/video, sources, script, approval state, production output, QA reports, purchaser identity/independence evidence, publish package, persistence result and PASS/FAIL per step.

---

## Current verified state
### Verified now
- [x] Product shell exists.
- [x] Digital Playbook reader exists in Insurance Agent Playbook family structure.
- [x] Harper embedded as playbook specialist UI.
- [x] Workbook/persistence and assignment tracking exist.
- [x] Prompt/automation/permission/product-comparison pilot UI exists.
- [x] Guardrail language does not represent disconnected integrations as live.
- [x] Independent Purchaser Acceptance QA is now an explicit mandatory release gate in this product QA contract.

### Not yet proven production-ready
- [ ] Live research.
- [ ] Live model-generated script workflow.
- [ ] Real OAuth connections.
- [ ] Real browser recording/media processing.
- [ ] Real consented avatar rendering.
- [ ] Independent production QA agent.
- [ ] Independent purchaser acceptance run by non-builder agent.
- [ ] Server-side authenticated client memory.
- [ ] Brandy/company-specific compliance configuration.
- [ ] Full visual/functional browser QA.
- [ ] Whole-product final Brandy scenario.

## Release classification
**CURRENT: PRODUCT/DESIGN PILOT — PASS**

**FINAL BRANDY DELIVERY — NOT YET PASS**

Final delivery may be labeled PASS only after the actual deployed customer product clears all required gates with retained evidence. COMMERCIAL/SELLABLE remains locked until independent purchaser acceptance and Final Approval PASS.