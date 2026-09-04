# OCG LAB — Whop Product Page & Buyer Journey Standard

## Purpose

This is the reusable release gate for every OCG LAB product sold through Whop. It converts the successful public Whop patterns already in market into a consistent publication, buyer-experience, seller-read-back, and independent-QA standard.

A Whop product is never considered verified merely because a page exists.

## Lifecycle

`READY TO PUBLISH` → `PUBLIC / SELLER QA PENDING` → `VERIFIED LIVE`

- **READY TO PUBLISH**: certified package exists; no verified public Whop product URL exists yet.
- **PUBLIC / SELLER QA PENDING**: a real public Whop product URL and buyer purchase control exist, but authenticated seller-side configuration and independent QA have not both passed.
- **VERIFIED LIVE**: public buyer page, authenticated seller-side configuration, fulfillment/access, and independent QA all pass.

## Page-quality gate

Every product must have:

1. Correct OCG LAB company/store identity.
2. Canonical product name with no stale version naming.
3. Clear outcome-oriented headline that does not make unsupported claims.
4. Full buyer-facing description adapted to Whop rather than copied blindly from another marketplace.
5. Correct buyer-visible price and billing model.
6. Product gallery using approved assets in intentional order.
7. Promotional video when an approved compatible video exists.
8. Buyer-understandable feature list.
9. FAQs covering delivery, access, third-party subscriptions, device/browser use, support, and material limitations.
10. Active purchase / Order now control.
11. No shipping configuration for digital-only products.
12. Clear post-purchase access path.
13. No internal notes, credentials, source paths, secrets, or developer instructions exposed.
14. Mobile buyer experience checked.
15. Public URL captured in OCG LAB OS.

## Price gate

The Whop page must reflect the product's currently approved channel price and billing model.

If Whop shows a promotional/discounted price, OCG LAB OS must distinguish the current buyer-visible price from the product's base/reference price rather than silently rewriting product economics.

No recurring billing may be added to a one-time Playbook merely because Whop supports subscriptions.

## Media gate

- Use approved OCG LAB branding.
- Preserve the correct OCG LAB logo.
- Use the strongest approved cover/hero asset first.
- Gallery assets must represent the actual product.
- Do not generate replacement media simply because an approved binary asset is stored outside the Git repository.
- Do not publish broken, stretched, low-resolution, placeholder, or occupationally mismatched media.

## Copy gate

Copy must answer:

- What is this?
- Who is it for?
- What does the buyer receive?
- What problem does it help organize or solve?
- How does access work?
- Is it one-time or recurring?
- Are third-party AI subscriptions/API fees included?
- What professional/compliance limitations remain?

Do not make unsupported income, performance, licensing, regulatory, or guaranteed-outcome claims.

## Public buyer QA

An independent reviewer must open the real public Whop page and verify:

- correct company
- correct product identity
- displayed price/billing
- headline/description
- gallery
- video when expected
- features
- FAQs
- active purchase control
- no shipping for digital product
- mobile usability
- no broken outbound product/access URLs

Public-page QA alone cannot promote the channel to VERIFIED LIVE.

## Seller-side authenticated QA

Authenticated read-back must verify:

- company/store ID
- product ID
- plan ID
- active visibility state
- price in platform-native units
- currency
- one-time vs recurring billing
- trial/renewal configuration
- stock/unlimited configuration
- entitlement/access configuration
- fulfillment destination
- duplicate product/plan risk
- internal notes contain no secrets

## Fulfillment gate

For hosted OCG LAB products:

1. Buyer purchases through Whop.
2. Whop entitlement/access points to the intended buyer-access path.
3. Canonical OCG LAB product resolves publicly where the product model requires public hosted access.
4. Any Access Guide or download package is the certified release artifact.
5. A test buyer can understand what to do next without internal assistance.

## Independent QA gate

The builder/publisher cannot self-approve.

Independent QA must record:

- inspector identity
- PASS / REJECT verdict
- checkpoints passed / total
- public URL
- seller-side evidence reference
- buyer-access evidence
- timestamp

A REJECT routes the work back for correction and blocks Live state.

## Anti-fabrication rules

- No fabricated orders, revenue, conversion, ratings, reviews, subscribers, or checkout events.
- No `Live` status inferred from a draft, package, screenshot, or internal record.
- No seller-side verification inferred from a public page.
- No public listing inferred from a canonical OCG LAB product URL.
- A product absent from the public Whop catalog remains READY TO PUBLISH, not "verification pending."

## Existing public Whop benchmark

The OCG LAB public storefront currently establishes the minimum presentation pattern with dedicated product pages, visible pricing, buyer-facing descriptions/FAQs, and an active purchase control. New releases should meet or exceed that buyer-facing quality without copying stale pricing or product-specific claims from another offer.

## Completion gate

A Whop work order may close only when:

1. Exact public Whop product URL is recorded.
2. Buyer-visible page passes public QA.
3. Authenticated seller-side plan/configuration passes read-back.
4. Buyer access/fulfillment passes.
5. Independent non-builder QA returns PASS.
6. OCG LAB OS writes evidence to the audit ledger.
7. Storefront state transitions to VERIFIED LIVE only after all above conditions are satisfied.
