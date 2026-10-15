# OCG LAB Product Portfolio Matrix — verified 2026-09-20

Source: TheOCGroup/ocg-lab-site main @ f9f92c319c8c902ebcc914c8e0a1f63295b9e0fe
Deployed: https://ocg-lab-os.netlify.app (live pages fetched 2026-09-20)
Netlify published deploy: 6aa6c8a7f91990de791a0128 (created 2026-09-13T16:00:39Z, republished 2026-09-13T22:56:29Z)

| Product | Route | Source branch/commit | Deploy status | Price | Readiness | Storefront | Fulfillment | Blocker |
|---|---|---|---|---|---|---|---|---|
| Real Estate Investor AI PRO | /real-estate-investor-ai-pro/ | main f9f92c31 | LIVE (renders, no price shown; "purchase" mentions, no checkout) | STATUS UNAVAILABLE | UNVERIFIED | Netlify site (static page) | UNVERIFIED | No verified checkout or order source |
| Fix & Flip Calculator | /fix-flip-calculator/ | main f9f92c31 | LIVE (renders, shows $0) | $0 shown on page | UNVERIFIED | Netlify site | UNVERIFIED | No verified checkout; $0 placeholder, not a confirmed offer |
| Wholesaler Deal Calculator | /wholesaler-deal-calculator/ | main f9f92c31 | LIVE (renders, shows $0, no buy signals) | $0 shown on page | UNVERIFIED | Netlify site | UNVERIFIED | No verified checkout |
| BRRRR Calculator | /brrrr-calculator/ | main f9f92c31 | LIVE (renders, shows $0; "Purchase" mention) | $0 shown on page | UNVERIFIED | Netlify site | UNVERIFIED | No verified checkout; $0 placeholder |
| Rental Property Calculator | /rental-property-calculator/ | main f9f92c31 | LIVE (renders, shows $0; "Purchase" mention) | $0 shown on page | UNVERIFIED | Netlify site | UNVERIFIED | No verified checkout |
| Insurance Agent AI Playbook | /playbooks/insurance-agent/ (embedded: Avery) | main f9f92c31 | LIVE (renders, no price, no buy signals) | STATUS UNAVAILABLE | UNVERIFIED | Netlify site | UNVERIFIED | feat/insurance-whop-package branch uninspected — possible Whop packaging intent |
| Real Estate Investor AI Playbook | /playbooks/real-estate-investor/ (embedded: Grant) | main f9f92c31 | LIVE (renders, no price, no buy signals) | STATUS UNAVAILABLE (Etsy draft listing 4570937150 exists, non-active, price unknown) | Playbook file VERIFIED (SHA-256 7d9410b9…) | Etsy draft only; live page has no checkout | UNVERIFIED | No active listing, no orders/revenue source |
| Lender AI SUPER PRO | /playbooks/lender-ai-super-pro/ (embedded: Harper) | main f9f92c31 | LIVE (renders, no price, no buy signals) | STATUS UNAVAILABLE | UNVERIFIED | Netlify site (no checkout) | UNVERIFIED | No verified checkout or fulfillment path |

## Commerce source status (2026-09-20)

- **Etsy**: API returned 403 (missing separate x-api-key; prior transient key not recoverable). Current catalog/order/revenue: STATUS UNAVAILABLE. Historical (2026-09-12): listing 4570937150 draft/non-active; do-not-touch 4568082033, 4554940134, 4567698713.
- **Whop**: no verified API, storefront, order, customer, subscription, or revenue source recovered. All metrics STATUS UNAVAILABLE. `feat/insurance-whop-package` branch exists — uninspected.
- **Sales / customers / subscriptions / revenue / conversions**: STATUS UNAVAILABLE across all products. No claims may be made.

## Key truthfulness rule for TED

TED's knowledge base must surface `$0` placeholders and `Purchase` text as unverified page content — NEVER as confirmed prices, offers, or checkout capability. "Readiness" is UNVERIFIED for every product until a real checkout, order, and fulfillment path is proven end to end.
