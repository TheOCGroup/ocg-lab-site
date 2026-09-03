# OCG LAB — DIGITAL PLAYBOOK MASTER RELEASE RULE

**Status: MANDATORY / NON-BYPASSABLE**

This rule applies to every OCG LAB Digital Playbook, including Lender AI SUPER PRO.

## 1. Canonical master
`playbooks/insurance-agent/` is the canonical Digital Playbook product master.

A new playbook is NOT a new design system. It must inherit the Insurance Agent AI Digital Playbook's product family and customer experience. Industry-specific content, specialist identity, prompts, worksheets, examples, workflows, and authorized product-tool connections may change. The core product experience may not drift without explicit founder approval.

## 2. Master-parity gate
No Digital Playbook may be classified READY, FINAL, RELEASED, COMMERCIAL, SELLABLE, COMPLETE, DONE, or equivalent until the actual rendered candidate is compared against the actual rendered Insurance master.

Required comparison includes, at minimum:
- cover/book presentation
- OCG LAB branding/logo treatment
- desktop two-page reading experience
- mobile/responsive reading experience
- typography, spacing, hierarchy, and visual polish
- sidebar/chapter navigation
- Previous/Next navigation and spread position
- reading progress and assignments
- workbook/worksheet behavior
- specialist-agent experience and modes
- Prompt Vault
- Daily AI Routine
- 30-Day implementation
- Reading Mode
- persistence/reopen behavior
- print/PDF output
- keyboard/focus/accessibility behavior
- linked operational tool experience where applicable

Sharing CSS, components, code, route structure, or a design system does NOT constitute visual parity evidence.

## 3. Evidence rule
**NO EVIDENCE = NO PASS.**

The following are engineering evidence only and can NEVER by themselves establish product readiness:
- HTTP 200
- successful deployment
- green build
- successful merge
- shared stylesheet
- inherited components
- unit/integration tests alone
- endpoint health
- a feature existing in source code

A playbook parity PASS requires retained rendered evidence from the candidate and master at equivalent desktop and mobile states, plus page/spread-by-page/spread inspection results.

## 4. Builder cannot self-approve
The builder/fixer may report BUILD COMPLETE or READY FOR QA only.

The builder/fixer may NOT issue the final Visual Parity PASS, Independent Purchaser PASS, Final Approval PASS, COMMERCIAL/SELLABLE status, or equivalent release approval for their own material work.

## 5. Mandatory release sequence
SOURCE OF TRUTH → BUILD → MASTER PARITY QA → FUNCTIONAL QA → VISUAL/RESPONSIVE QA → SECURITY/INTEGRATION QA (when applicable) → INDEPENDENT PURCHASER ACCEPTANCE QA → ADVERSARIAL/FAILURE QA → FINAL APPROVAL → PRODUCTION VERIFY → RELEASED/COMMERCIAL.

A failure at any gate returns the product to the responsible build/fix stage. The failed gate must then be rerun on the corrected release.

## 6. Independent purchaser gate
A cold purchaser QA agent/tester who did not build or fix the release must receive only what a real purchaser receives. No developer access, hidden instructions, preloaded browser state, undocumented setup, or builder coaching is allowed.

The purchaser must independently understand the product, configure it, use its primary advertised workflow, recover state after close/reopen, and understand/recover from required failure and permission-denial states.

**NO INDEPENDENT PURCHASER PASS = NO SALE.**

## 7. Final approval language
Until all mandatory gates pass with evidence, status language is restricted to factual intermediate states such as:
- BUILDING
- BUILD COMPLETE — QA REQUIRED
- QA IN PROGRESS
- QA FAILED — FIX REQUIRED
- READY FOR INDEPENDENT PURCHASER QA
- BLOCKED

`READY`, `FINISHED`, `DONE`, `FINAL`, `RELEASED`, `PRODUCTION-READY`, `COMMERCIAL`, and `SELLABLE` are forbidden unless the corresponding release gates have actually passed.

## 8. Reference drift rule
If a product has a named canonical master, architecture, repo, agent role, commercial model, or product pattern, implementation problems must be solved inside those constraints. The builder may not silently reinterpret or replace the reference to make implementation easier.

Any intentional deviation requires explicit founder approval and must be documented before implementation.

## 9. Lender AI SUPER PRO enforcement
The current Lender AI Digital Playbook is subject to this rule immediately.

Its current public deployment or HTTP health does NOT make it ready. It must pass rendered Insurance-master parity QA before any readiness claim. Harper replaces Avery in the specialist role; lender-specific content/workflows replace insurance-specific content/workflows; the Digital Playbook product family remains the Insurance master. The separate Lender AI SUPER PRO production worker may be linked from the Playbook but does not redefine the Playbook UI/UX.

## 10. Permanent release invariant
**NO MASTER COMPARISON = NO PASS.**
**NO RENDERED EVIDENCE = NO PASS.**
**NO INDEPENDENT QA = NO RELEASE.**
**NO PURCHASER PASS = NO SALE.**
