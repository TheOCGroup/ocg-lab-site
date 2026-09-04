# OCG LAB Whop — Authenticated Seller Audit

Date: 2026-09-04
Seller account: `biz_1s3AzoabzwjpqM` — The OCG LAB
Owner: Genaro Ocasio / `the-ocg-lab`

## Authenticated product / plan read-back

- Real Estate Investor AI Playbook — product `prod_rjqgwvr66ZSkX`; plan `plan_FoJYDwiCXxEd9`; visible; one-time; buy-now; USD $19.99.
- Real Estate Investor AI PRO — product `prod_EEmswqofRNOpM`; plan `plan_ep13hdJeMHRfW`; visible; one-time; buy-now; USD $29.00.
- LEADFLOW AI PRO — product `prod_Kma1MiZdJXFBv`; plan `plan_PhwwSWqwyRCQq`; visible; one-time; buy-now; USD $99.99.

## Initial fulfillment result

Authenticated `GET /experiences` filtered to each product initially returned zero attached experiences for all three products. Seller QA therefore remained **PENDING / FULFILLMENT BLOCKED**. No storefront may be promoted to `VERIFIED LIVE` until the intended post-purchase Whop experience is attached, access is verified, and independent non-builder QA passes.

## Insurance Agent AI Playbook

No authenticated Whop product exists for Insurance Agent AI Playbook as of this audit. Its correct state remains **READY TO PUBLISH**, with the certified $19 one-time publication package prepared separately.

## Integrity rule

Product visibility, valid checkout, and correct pricing do not constitute fulfillment certification. A paid product must have a verified post-purchase access path before seller QA can pass.

## Fulfillment remediation — 2026-09-04

- Real Estate Investor AI PRO: private Courses experience `exp_cGOclvtvus6YrC` attached only to `prod_EEmswqofRNOpM`; course `cors_zZYNylj5nJqBy`; one visible launch lesson to `https://ocg-lab-products.vercel.app/real-estate-investor-ai-pro/`. Configuration read-back passed. Purchaser entitlement QA remains pending.
- LEADFLOW AI PRO: private Courses experience `exp_jd9jmW0lZv3AxY` attached only to `prod_Kma1MiZdJXFBv`; course `cors_pG8yONGEUWb3N`; one visible launch lesson to `https://ocg-lab-products.vercel.app/leadflow-ai-pro/`. Configuration read-back passed. Purchaser entitlement QA remains pending.
- Real Estate Investor AI Playbook: dedicated standalone route restored at `https://ocg-lab-products.vercel.app/playbooks/real-estate-investor/` and returned HTTP 200 after merge `5c51e0e4f9e14fafb6840ee34018d29150cf7a2c`. Private Courses experience `exp_cGgH7TuG35pn1K` is attached only to `prod_rjqgwvr66ZSkX`; course `cors_vP4HkHqbziimp` contains one `Access Your Purchase` chapter and one launch lesson to the dedicated Playbook. Purchaser entitlement QA remains pending.

## OS asset promotion

The canonical OS promotion workflow passed after the fulfillment-state test correction and regenerated the checked-in `/os/` assets from this branch's canonical `os/source`. Production-parity and bundle-scan gates are required again on this owner-controlled head before merge.


## Insurance Agent AI Playbook — public release reconciliation (03:20 UTC)

- Product: `prod_R5E61gns17el5` — `Insurance Agent AI Playbook`
- Public route: `https://whop.com/the-ocg-lab/insurance-agent-ai-playbook/` — HTTP 200 verified after publication.
- Plan: `plan_J0CgGcDHZl59l` — visible `one_time` / `buy_now` / `$19.00 USD`; hosted checkout `https://whop.com/checkout/plan_J0CgGcDHZl59l` returned HTTP 200.
- Gallery: public file `file_7ZzwOCQLblxO8`, generated from the canonical certified Playbook and attached before publication.
- Fulfillment: private Courses experience `exp_ZZyLbvtTb11enK` attached to this product; course `cors_r0pU0GE9FN4wP` contains one `Access Your Purchase` chapter and one launch lesson to `https://ocg-lab-products.vercel.app/playbooks/insurance-agent/`.
- Canonical product target: HTTP 200 verified before publication.
- Public product and seller configuration are verified. Purchaser entitlement execution has not been tested with a real/complimentary member because the connected Whop tool surface exposes membership read operations but no supported complimentary-membership creation path. Final state therefore remains **PUBLIC / SELLER QA PENDING**, not `VERIFIED LIVE`.
- Marketplace status returned `not_available`; this release is a Whop company/store product and must not be represented as Whop Marketplace-listed unless that status changes and is externally verified.

- OCG LAB OS canonical promotion workflow run `33833181312` completed SUCCESS after regression correction; generated `/os/` assets and parity checks were promoted before final PR CI.

## Final four-product fulfillment inventory

Authenticated seller read-back on 2026-09-04 confirms all four visible OCG LAB Whop products now have exactly one private product-gated Courses experience attached:

- Insurance Agent AI Playbook — `prod_R5E61gns17el5` / `plan_J0CgGcDHZl59l` / `exp_ZZyLbvtTb11enK`.
- Real Estate Investor AI Playbook — `prod_rjqgwvr66ZSkX` / `plan_FoJYDwiCXxEd9` / `exp_cGgH7TuG35pn1K`.
- Real Estate Investor AI PRO — `prod_EEmswqofRNOpM` / `plan_ep13hdJeMHRfW` / `exp_cGOclvtvus6YrC`.
- LEADFLOW AI PRO — `prod_Kma1MiZdJXFBv` / `plan_PhwwSWqwyRCQq` / `exp_jd9jmW0lZv3AxY`.

All four plans remain visible one-time buy-now offers at their authenticated prices. No product is promoted to final purchaser-entitlement certification until a real or supported complimentary buyer entitlement is exercised.

- Final commerce closeout canonical promotion run `33882431532` completed SUCCESS from source head `b1dbd5c586e5d041a810f3109470cdbd351d6d58` and committed rebuilt `/os/` production assets as `73d2fc821667e82a6965d8b20a16ce459909dafe`. Standard owner-controlled PR CI/review is required on the promoted tree before merge.
