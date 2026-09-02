# Lender AI SUPER PRO — Release / QA Gate

## Product target
Brandy can open one public product, get a useful lender content recommendation, build an approved lender-safe script, choose self-record or consented avatar production, and use a practical lender prompt/automation playbook without learning an AI stack.

## Source-of-truth review
- [x] Mortgage-specific claims have a source-verification gate.
- [x] Current rates, program rules, eligibility, loan limits and market statistics are never represented as known without verification.
- [x] Human/company compliance approval remains required before release.
- [x] Avatar/voice requires explicit identity/provider consent.
- [x] External connections require explicit scope approval.
- [x] No automatic outbound email/social action is represented as live before a secure provider connection exists.

## Functional review
- [x] Lender profile fields and local pilot memory.
- [x] Recent-topic history.
- [x] Content Scout ranking and topic selection.
- [x] Script workflow and rewrite path.
- [x] Human script approval gate.
- [x] Self-record and avatar mode chooser.
- [x] Teleprompter load and mirror control.
- [x] Publish/QA package.
- [x] Permission toggles unlock connection actions only after opt-in.
- [x] Prompt Vault filters by category and produces personalized prompts.
- [x] Prompt copy control.
- [x] Simple automation cards preserve approval gates.
- [x] BIGVU comparison warns against cancellation until parity is verified.
- [x] Loading/error/no-JavaScript shell states exist.

## Design review
- [x] OCG LAB dark blue/green product-family treatment.
- [x] Clear hero and primary action.
- [x] Progressive numbered workflow.
- [x] Strong visual separation for permissions, prompts, automation, production and comparison.
- [x] Responsive single-column behavior below 760px.
- [x] Buttons/inputs remain full-width where necessary on mobile.
- [x] Text outputs preserve formatting and remain readable.
- [x] Product does not visually imply unavailable integrations are already connected.

## Accessibility / resilience review
- [x] Responsive viewport metadata.
- [x] Theme/color-scheme metadata.
- [x] JavaScript-disabled fallback.
- [x] Body-load failure state.
- [x] App-script failure state.
- [x] Disabled controls visibly distinguish unavailable actions.
- [ ] Full keyboard/screen-reader audit in a browser session.
- [ ] Cross-browser visual screenshots on physical/simulated mobile and desktop.

## Production blockers — must remain explicit
1. Live AI Content Scout internet research endpoint is not connected yet.
2. Live model-generated script endpoint is not connected yet.
3. Email/calendar/social/CRM OAuth connections are not connected yet.
4. Avatar provider credentials/private avatar ID are not connected yet.
5. Real browser recording/upload/media-processing pipeline is not connected yet.
6. Server-side client memory/auth is not connected yet.
7. Final compliance rules must be configured for Brandy's actual company before autonomous use.

## Release classification
**DESIGN/PRODUCT PILOT: PASS**

**PRODUCTION AI EMPLOYEE: NOT YET PASS** until the blockers above are implemented and tested end-to-end.

The product must not be sold or represented as having live research, autonomous integrations, or completed avatar/media generation until those integrations are verified.