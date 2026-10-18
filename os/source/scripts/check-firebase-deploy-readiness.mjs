import { readFileSync } from 'node:fs';
const config = JSON.parse(readFileSync(new URL('../firebase.json', import.meta.url), 'utf8'));
const hosting = config.hosting;
const rewrites = hosting.rewrites || [];
const apiRoute = rewrites.find(rule => rule.source === '/api/os/sync');
if (!apiRoute || !apiRoute.run?.serviceId) {
  console.error('BLOCKED: Firebase Hosting has no verified /api/os/sync Cloud Run routing.');
  console.error('A catch-all SPA rewrite would return HTML for API requests.');
  console.error('Do not deploy OCG LAB OS until the read-only API and identity are verified.');
  process.exit(1);
}
if (apiRoute.run.serviceId === 'ocg-os-acquisitions-api') {
  console.error('BLOCKED: Acquisition API is not the canonical-state gateway.');
  process.exit(1);
}
console.log('Firebase API route configured; independently verify IAM and live reads before promotion.');
