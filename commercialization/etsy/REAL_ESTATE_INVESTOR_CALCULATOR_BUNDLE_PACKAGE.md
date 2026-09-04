# OCG LAB — Real Estate Investor Calculator Bundle — Etsy Release Package

## Canonical product identity

- Product ID: `calc-bundle`
- Product name: **Real Estate Investor Calculator Bundle (3-in-1)**
- Channel: Etsy
- Current canonical price: **$67 one-time**
- State: **READY TO PUBLISH / CHANNEL QA PENDING**
- Buyer delivery page: `https://ocg-lab-products.vercel.app/real-estate-investor-calculator-bundle/`

## Included products

This bundle contains exactly three independently deployed OCG LAB calculators:

1. **Fix & Flip Calculator** — `https://ocg-lab-products.vercel.app/fix-flip-calculator/`
2. **Rental Property Calculator** — `https://ocg-lab-products.vercel.app/rental-property-calculator/`
3. **BRRRR Calculator** — `https://ocg-lab-products.vercel.app/brrrr-calculator/`

Do not advertise this product as 4-in-1. No standalone fourth/DSCR calculator has been verified as part of this bundle. Rental Property and BRRRR include DSCR analysis where applicable, but that does not constitute a fourth product.

## Pricing integrity

Historical merchandising creative shows an earlier `$25` bundle price. That creative is retained as historical evidence only. The current canonical storefront registry specifies `$67`, so the release package preserves `$67` unless the Founder explicitly approves a new price.

## Etsy publication gate

Before publication:

1. Dedicated bundle delivery page returns HTTP 200 in production.
2. All three calculator routes return HTTP 200 and identify the correct OCG LAB product.
3. Customer delivery PDF points only to the dedicated bundle page.
4. Listing title and media say **3-in-1**, not 4-in-1.
5. Listing price is `$67` unless a new Founder-approved price is recorded.
6. Listing is a digital item and contains no shipping requirement.
7. Buyer file and every embedded link pass QA.
8. Desktop/mobile listing preview, 13 tags, first image crop, description and fulfillment are independently checked.
9. Only then may the storefront record advance from `Ready/PENDING` to a public verification state.

## Evidence

Recovered product-family assets and access guides establish the bundle as Fix & Flip + Rental Property + BRRRR. The individual public calculator routes were independently checked before this release package was prepared.

## OS promotion evidence

Canonical OCG LAB OS promotion workflow run `33906345463` completed **SUCCESS** from source commit `db3b3119b1e0273a5c3f826a0e6f38ac67ce4c6d` and committed regenerated `/os/` assets at `b0fbc8cbf70c0f06b58deb1d60b9b719931730f4`. Standard owner-controlled PR CI/review remains required before merge.
