OCG INTELLIGENCE inside TED — working preview (final certification build)

Revision: branch feat/ted-ocg-intelligence-workspace-20261021
Final commit: e2e5a7ec90a908c9b48284f67a078f120e96e492
Build bundle: dist/assets/index-KUKDz8uk.js (deterministic; reproduced
from a fresh clone during independent QA).

Run it: serve the dist/ folder with any static server
  (e.g. npx serve dist   or   python3 -m http.server -d dist 8080)
and open the printed URL. TED opens on the conversation; OCG
INTELLIGENCE is in the left sidebar.

From source: cd os/source && npm install && npm test && npm run build
Certification battery: node tests-browser/ted-intelligence-certification.browser.mjs
(serve the build first, e.g. npm run preview -- --port 4173)

Nothing here is deployed or merged. Production release is a separate
founder decision.
