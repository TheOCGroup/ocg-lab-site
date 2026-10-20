# TED / OCG INTELLIGENCE — Independent QA Gate

Date: 2026-10-20. Scope: draft PR #82 stacked on draft PR #81. **Development only.**

## Evidence verified
- Commit `4b339c479df83145baa6b858e2a73fa9050ada23` includes left sidebar entry and focus wiring for desktop and mobile TED.
- Local tests 230/230, TypeScript, build, generated bundle security scan passed.
- GitHub Actions run 39487663656 passed install, tests, typecheck, build and generated security scan; failed checked-in `/os` parity; subsequent production scan skipped.
- The link opens existing Products with the OCG INTELLIGENCE development overview. It does **not** prove live Market Radar, Signal, Watchtower or Strategist integration.

## Independent reviewer acceptance (NOT YET EXECUTED)
1. Open isolated preview of the exact PR #82 build; verify the TED sidebar entry is visible on desktop and mobile.
2. Click OCG INTELLIGENCE: Products opens, the intelligence overview is brought into view, and status says development/preview, not live.
3. Click Products: normal product inventory opens; verify New chat, Previous Work, TED conversation, voice controls and history remain available.
4. Repeat after navigating between TED chat, Products, and Intelligence; check repeated clicks and mobile drawer dismissal.
5. Check keyboard navigation, focus visibility, reduced-motion accessibility and narrow screens.
6. Reconcile PR #70 workspace changes and PR #81 parent against the actual integration base, without overwriting either branch.
7. Rebuild from canonical `os/source`, reconcile checked-in `/os` assets on the approved branch only, rerun parity and security scans.
8. Verify actual target host, deployed asset hashes, rollback and production approval before any release.

## Stop conditions
No approval to merge, promote, deploy, change DNS, secrets, or production settings. A passing local test is not a browser test. Independent reviewer must attach actual evidence and mark PASS/FAIL for each acceptance item. Grant-ready record: source commits, commands, outputs, limitations and corrective actions retained in PR #82.

## Builder-run browser evidence (2026-10-20; not independent certification)
- Isolated local Vite preview, Playwright Chromium, desktop viewport 1440x900: sidebar OCG INTELLIGENCE button present, overview visible and focused after click, Products inventory available. PASS.
- Isolated local Vite preview, Playwright Chromium, mobile viewport 390x844: opening drawer shows intelligence button, clicking opens overview and closes drawer; reopening drawer and clicking Products opens inventory and closes drawer; New chat returns to TED conversation. PASS.
- No production host or real backend was exercised; TED voice, persistence, reduced-motion emulation and independent reviewer sign-off remain NOT VERIFIED.
- CI run 39487663656 on earlier commit failed only `/os` parity; source tests, typecheck, build and generated security scan passed. Latest source commit should be checked separately.

## Builder-run TED navigation regression (2026-10-20)
- Isolated Playwright Chromium desktop viewport 1440x900 with `reducedMotion: reduce`: TED chat textbox visible before and after Intelligence -> Products -> New chat; voice-related controls present (2 matching controls) before/after; Intelligence overview received keyboard focus; Products inventory visible; no page JavaScript exceptions. PASS.
- This verifies control visibility and browser navigation only, **not** actual microphone input, live speech synthesis, session persistence, production API or independent certification.
