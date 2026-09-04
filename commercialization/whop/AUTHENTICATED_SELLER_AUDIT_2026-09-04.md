# OCG LAB Whop — Authenticated Seller Audit

Date: 2026-09-04
Seller account: `biz_1s3AzoabzwjpqM` — The OCG LAB
Owner: Genaro Ocasio / `the-ocg-lab`

## Authenticated product / plan read-back

- Real Estate Investor AI Playbook — product `prod_rjqgwvr66ZSkX`; plan `plan_FoJYDwiCXxEd9`; visible; one-time; buy-now; USD $19.99.
- Real Estate Investor AI PRO — product `prod_EEmswqofRNOpM`; plan `plan_ep13hdJeMHRfW`; visible; one-time; buy-now; USD $29.00.
- LEADFLOW AI PRO — product `prod_Kma1MiZdJXFBv`; plan `plan_PhwwSWqwyRCQq`; visible; one-time; buy-now; USD $99.99.

## Fulfillment result

Authenticated `GET /experiences` filtered to each product returned zero attached experiences for all three products. Seller QA therefore remains **PENDING / FULFILLMENT BLOCKED**. No storefront may be promoted to `VERIFIED LIVE` until the intended post-purchase Whop experience is attached, access is verified, and independent non-builder QA passes.

## Insurance Agent AI Playbook

No authenticated Whop product exists for Insurance Agent AI Playbook as of this audit. Its correct state remains **READY TO PUBLISH**, with the certified $19 one-time publication package prepared separately.

## Integrity rule

Product visibility, valid checkout, and correct pricing do not constitute fulfillment certification. A paid product must have a verified post-purchase access path before seller QA can pass.


## Fulfillment remediation — 2026-09-04

- Real Estate Investor AI PRO: private Courses experience `exp_cGOclvtvus6YrC` attached only to `prod_EEmswqofRNOpM`; course `cors_zZYNylj5nJqBy`; one visible launch lesson to `https://ocg-lab-products.vercel.app/real-estate-investor-ai-pro/`. Configuration read-back passed. Purchaser entitlement QA remains pending.
- LEADFLOW AI PRO: private Courses experience `exp_jd9jmW0lZv3AxY` attached only to `prod_Kma1MiZdJXFBv`; course `cors_pG8yONGEUWb3N`; one visible launch lesson to `https://ocg-lab-products.vercel.app/leadflow-ai-pro/`. Configuration read-back passed. Purchaser entitlement QA remains pending.
- Real Estate Investor AI Playbook: still has zero attached experiences. The repository currently has no separate Playbook delivery path; its portfolio URL points at the AI PRO path and must not be used as Playbook fulfillment without source recovery/correction.
