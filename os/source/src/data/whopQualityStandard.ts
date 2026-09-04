export type WhopChannelState = 'READY TO PUBLISH' | 'PUBLIC / SELLER QA PENDING' | 'VERIFIED LIVE';

export const WHOP_QUALITY_STANDARD = {
  lifecycle: ['READY TO PUBLISH', 'PUBLIC / SELLER QA PENDING', 'VERIFIED LIVE'] as WhopChannelState[],
  publicPageGates: [
    'Correct OCG LAB company/store identity',
    'Canonical product name',
    'Outcome-oriented compliant headline',
    'Whop-adapted description',
    'Correct buyer-visible price and billing model',
    'Approved gallery in intentional order',
    'Approved compatible video when available',
    'Buyer-understandable features',
    'Delivery/access/subscription/device/support FAQs',
    'Active purchase / Order now control',
    'No shipping for digital-only product',
    'Clear post-purchase access path',
    'No secrets or internal instructions exposed',
    'Mobile buyer experience verified',
    'Exact public Whop product URL captured'
  ],
  sellerReadbackGates: [
    'Company/store ID verified',
    'Product ID verified',
    'Plan ID verified',
    'Visibility verified',
    'Platform-native price and currency verified',
    'One-time vs recurring billing verified',
    'Trial/renewal configuration verified',
    'Stock configuration verified',
    'Entitlement/access configuration verified',
    'Fulfillment destination verified',
    'Duplicate product/plan risk checked',
    'Internal notes checked for secrets'
  ],
  independentQaGates: [
    'Inspector is not the assigned builder/publisher',
    'Public-page QA PASS',
    'Seller-side authenticated QA PASS',
    'Buyer access/fulfillment PASS',
    'Evidence and timestamp recorded in audit ledger'
  ],
  antiFabricationRules: [
    'Never fabricate orders, revenue, conversion, ratings, reviews, subscribers, or checkout events',
    'Never infer Live from a draft, package, screenshot, or internal record',
    'Never infer seller-side verification from a public page',
    'Never infer a Whop listing from an OCG LAB product URL',
    'If absent from the public Whop catalog, classify READY TO PUBLISH'
  ]
} as const;
