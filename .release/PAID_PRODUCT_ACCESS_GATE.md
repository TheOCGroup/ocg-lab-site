# OCG LAB — Paid Product Access Gate

Status: BLOCKING PRODUCTION RELEASE
Date: 2026-08-31

## Purpose
Prevent paid OCG LAB products from being exposed as free public routes.

## Current finding
The storefront currently links directly to product application routes. No working checkout + entitlement verification layer was found in the OCG LAB repository during the 2026-08-31 audit. Hiding navigation links is not sufficient protection because direct URLs remain discoverable.

## Required public flow
Public website -> product sales/detail page -> checkout -> verified payment/entitlement -> protected product application.

## Product access classification

### Must be protected before production
- Real Estate Investor AI PRO
- LeadFlow AI PRO
- Wedding & Destination Concierge AI SUPER PRO
- Insurance Agent AI Playbook (unless intentionally released as a free sample)
- Any future paid AI PRO, AI SUPER PRO, Digital Playbook, toolkit, course, or downloadable product

### May remain public only by explicit commercial decision
- Fix & Flip Calculator
- BRRRR Calculator
- Wholesaler Deal Calculator
- Rental Property Calculator
- Deliberate demos, previews, samples, and lead magnets

A public calculator is not automatically free forever. Its access status must be explicitly recorded in the product catalog before production.

## Non-negotiable release checks
1. No paid product application is reachable anonymously by typing its application URL directly.
2. Product cards never link straight into a paid application for unauthenticated users.
3. Checkout uses the canonical OCG LAB commerce provider. Do not invent or hard-code placeholder payment links.
4. Payment success alone is not trusted from a browser redirect. Access must be granted from a verified server-side provider event or equivalent trusted entitlement source.
5. Entitlements are product-scoped, user-scoped, revocable, and fail closed.
6. Protected routes verify entitlement on every protected session/request boundary appropriate to the runtime.
7. Expired, refunded, disputed, revoked, or canceled access is handled according to the product's commercial policy.
8. No secret keys, webhook secrets, entitlement tokens, or private product assets are embedded in public HTML/JavaScript.
9. Search engines must not index protected application content.
10. Preview/demo content must be intentionally separated from full paid content.
11. Access-control tests include anonymous direct URL, authenticated-without-entitlement, entitled user, revoked entitlement, forged client state, and replayed/invalid provider event cases.
12. Production release requires evidence of a real end-to-end test purchase (or provider test-mode equivalent) proving checkout -> entitlement -> protected access.

## Storefront behavior until commerce is connected
- Public product cards may show product name, outcome, capabilities, screenshots/renders, demo/sample content, and pricing when approved.
- Paid-product CTA must be treated as sales/checkout intent, not direct application access.
- Do not mark the storefront production-ready while paid application URLs remain publicly reachable.

## Release decision
FAIL CLOSED.

If no canonical OCG LAB commerce provider and verified entitlement service are connected, the paid storefront cannot be certified for production.
