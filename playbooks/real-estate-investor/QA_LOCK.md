REI COVER QA LOCK

Approved visual source: rei-book-sharp.webp / embedded approved cover master.
Approved source dimensions: 730 x 1120.

Rendering rule:
- Do not stretch the approved cover beyond a 2x-safe CSS footprint.
- Desktop maximum rendered size: 365px wide x 560px high.
- The cover must be centered inside the left page rather than enlarged to fill the page.
- object-fit must remain contain.
- No browser transform, CSS filter, or alternate compressed/fallback cover is allowed.
- Any change that makes the cover visibly soft, blurry, blank, cropped, or replaced is a release-blocking regression.

Release gate:
Visual browser QA of Spread 1 is required before declaring the REI playbook launch-ready.
