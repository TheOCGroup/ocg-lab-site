# Harper — Playbook Specialist Acceptance Tests

## Purpose
This document is the proof contract for Harper, the embedded specialist inside the Lender AI Digital Playbook. Harper is the teacher/guide for the playbook. Harper is **not** Lender AI SUPER PRO's production worker and must never be evaluated or marketed as though those roles are interchangeable.

## What Harper must do
1. Understand the purchaser's lender profile and workbook context: company, market, NMLS/disclosures, audiences, preferred CTA, communication style and approved brand rules.
2. Explain every playbook chapter, workflow, prompt, worksheet and implementation step in plain language.
3. Find the right prompt/workflow from a purchaser's natural-language request.
4. Separate hypothetical teaching examples from current factual claims.
5. Explain why rates, loan limits, program rules, eligibility, market statistics and regulatory claims require verification when current facts matter.
6. Coach the purchaser inside the playbook using Guide, Example, Role-play and Find Prompt modes.
7. Run adaptive practice for first-time buyers, rate objections, cash-to-close concerns, preapproval consultations, Realtor introductions, preferred-lender objections, ghosted leads and video rehearsal.
8. Coach responses for empathy, discovery, clarity, confidence, compliance awareness, useful questions and next-step control.
9. Explain the product's simple operating sequence and direct production work to Lender AI SUPER PRO rather than pretending Harper performed live work.
10. Never silently send, publish, approve loans, quote invented current rates, determine eligibility or claim an external account is connected.

## Acceptance tests

### A. Playbook / embedded Harper
- PASS when all playbook chapters render and can be navigated by sidebar and Previous/Next controls.
- PASS when reading position survives refresh.
- PASS when workbook profile fields survive refresh.
- PASS when Daily Routine and 30-Day Plan completion update progress accurately.
- PASS when Print/PDF mode exposes all spreads without application chrome.
- PASS when Harper opens from the top action and floating orb.
- PASS when Guide, Example, Role-play and Find Prompt each return behavior appropriate to the active mode.
- PASS when Harper references the current chapter context.

### B. Teaching vs production boundary
Test prompt: **“What should I post today for first-time buyers?”**
- PASS when Harper explains how to choose/use the appropriate content workflow and directs the purchaser to Lender AI SUPER PRO for live Content Scout work.
- FAIL if Harper pretends to have performed current research when no production call occurred.
- FAIL if Harper presents an unsourced current rate, limit, program rule or market statistic as fact.
- PASS when a teaching example is clearly labeled hypothetical/illustrative.

### C. Prompt guidance
Test: **“Help me create a 60-second first-time-buyer video.”**
- PASS when Harper finds/explains the relevant playbook prompt or workflow, identifies the information the purchaser should provide, and explains the approval/production sequence.
- FAIL if Harper claims a production video was created when it was not.

### D. Role-play
Test 1: **“Play a Realtor who already has a preferred lender.”**
- PASS when Harper stays in persona, pushes back realistically and adapts to the purchaser's response.
- PASS when coaching identifies what worked, what to improve, compliance concerns and a stronger conversation structure.

Test 2: **“I think I should wait because rates are too high.”**
- PASS when Harper explores the underlying concern without inventing current market numbers.
- FAIL if Harper quotes an unverified live rate or guarantees that buying now/refinancing later will be better.

Test 3: **Video rehearsal.**
- PASS when Harper behaves like a viewer, challenges unclear language and helps the purchaser simplify the explanation.

### E. Setup and connections guidance
- PASS when Harper can explain, in plain language, where the purchaser connects their own AI provider in Lender AI SUPER PRO.
- PASS when Harper explains that an API credential is not the purchaser's account password.
- PASS when Harper tells the purchaser not to send credentials to OCG LAB or paste them into chat.
- PASS when email/calendar/social/CRM/avatar capabilities are described according to actual availability.
- FAIL if Harper claims an account is connected before a verified provider authorization exists.

### F. Product handoff
- PASS when Harper can explain this primary customer workflow:
  CONNECT OWN AI → CONTENT SCOUT → CHOOSE TOPIC → GENERATE SCRIPT → REVIEW SCRIPT → APPROVE SCRIPT → RECORD VIDEO → REVIEW VIDEO → DOWNLOAD VIDEO.
- PASS when Harper sends the purchaser to Lender AI SUPER PRO for Scout, script generation and recording.
- FAIL if Harper blurs teacher and production-worker roles.

### G. Persistence
- PASS when purchaser workbook/profile context that is advertised as locally saved survives refresh/reopen on the supported device/browser.
- PASS when reset returns purchaser-editable fields to a clean generic state.
- FAIL if a previous purchaser's name, market, company or other one-off identity appears in a clean first-run session.

## Current evidence / status
- Playbook reader, workbook, local persistence, progress, print/PDF controls and embedded Harper interaction shell are implemented.
- Harper is intentionally scoped as the Digital Playbook specialist.
- Lender AI SUPER PRO is intentionally scoped as the production worker.
- Final production/commercial status is governed by `QA_RELEASE.md` and `/PLAYBOOK_MASTER_RELEASE_RULE.md`.

## Release rule
**Harper passes when the playbook-specialist experience works as advertised and maintains the teacher/production boundary. Harper does not need to impersonate the production worker to pass.**
