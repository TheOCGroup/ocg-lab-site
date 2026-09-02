# Lender AI SUPER PRO — Production AI Workflow

## Product promise
One operating flow: research what matters → recommend what to post → produce an accurate lender-safe script → choose on-camera or avatar → produce → independently QA → prepare publishing package.

## 1. AI Content Scout
The Scout should run against current authoritative/public information and lender content history. It must rank opportunities, not just return generic ideas.

Research categories:
- Federal Reserve / macro developments that materially affect borrower education
- FHFA / Fannie Mae / Freddie Mac conforming-loan information
- FHA / HUD guidance
- VA home-loan guidance
- USDA Rural Development housing guidance
- CFPB consumer mortgage education and rule changes
- State/local housing developments and market data where credible sources exist
- Recurring borrower FAQs and Realtor-partner education opportunities
- User content history so the same topic is not repeated unnecessarily

Scout output contract per idea:
- topic
- audience
- opportunity_score 0-100
- why_now
- source_evidence[]
- freshness timestamp
- claims_requiring_verification[]
- compliance_risk: low | medium | high
- recommended hook
- recommended CTA

If live evidence is unavailable, the Scout must label the recommendation evergreen rather than pretending it is current.

## 2. Source-of-truth research
Any time-sensitive rate, program, eligibility, loan-limit, market-statistic or regulatory claim must have source evidence before the script can reach release status. The research agent and script agent are separate roles.

## 3. Script agent
Input: approved Scout item + lender profile + audience + duration + source packet + prior content.
Output:
- spoken_script
- hook
- on_screen_headline
- lower_third
- CTA
- B-roll plan
- caption plan
- required disclosures
- source references
- risk flags

The model must never invent current rates, eligibility, savings, approvals, or program requirements.

## 4. Human approval gate
No script goes to recording/avatar generation until approved by the lender. Company/compliance review can remain a second release gate where required.

## 5A. Record Myself
- teleprompter
- camera capture
- audio cleanup
- optional eye-contact correction
- dynamic captions
- brand/logo/lower third
- contextual B-roll
- vertical master by default

## 5B. Create With My Avatar
Preferred provider route: HeyGen-compatible avatar service.

Required state before render:
- private avatar identity created for the lender
- provider consent completed by the lender
- avatar_id stored server-side
- approved voice or avatar default voice
- approved script

Render contract:
- avatar_id
- approved spoken script
- aspect ratio (default 9:16)
- resolution target
- caption settings
- lender brand background / composition
- callback/job id

Avatar generation must never be enabled by simply entering someone else's identity. Consent is mandatory.

## 6. Independent QA
QA agent cannot be the same role that generated the script/video plan.
Checks:
- cited facts support spoken claims
- no outdated or uncited time-sensitive claim
- no guarantee or misleading approval language
- company/NMLS disclosure requirements present
- spoken/script consistency
- caption spelling and mortgage terminology
- logo/lower-third safe areas
- avatar/on-camera output matches approved identity and script
- duration/platform framing
- CTA correctness

## 7. Publish package
Output platform-specific title/caption/description/hashtags/thumbnail text for Instagram Reels, Facebook, TikTok and YouTube Shorts. Auto-publishing remains off until account permissions and lender approval are explicitly configured.

## 8. Memory
Server-side production memory should retain lender profile, brand rules, approved disclosures, avatar ID/provider reference, voice preferences, prior topics, scripts, performance signals and preferred CTAs. Browser localStorage is pilot-only and must not be treated as final client memory.
