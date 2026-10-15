import { TED_COMMERCIAL_LIFECYCLE, TedLifecycleStage } from './tedDepartment';

/**
 * TED Knowledge Base — verified OCG LAB product, deployment, and commerce truth.
 *
 * Grounding rule (fail-closed): every claim below is traceable to a verified
 * source. Anything without a verified source is reported as
 * 'STATUS UNAVAILABLE', 'DEPLOYMENT UNVERIFIED', 'PRODUCTION UNVERIFIED', or
 * 'BLOCKED'. TED must never substitute unverified page text (for example '$0'
 * placeholders or 'Purchase' mentions scraped from marketing pages) for real
 * prices, checkout, or fulfillment.
 */

export type VerificationState = 'VERIFIED' | 'STATUS UNAVAILABLE' | 'UNVERIFIED' | 'BLOCKED' | 'DEPLOYMENT UNVERIFIED' | 'PRODUCTION UNVERIFIED';

export const TED_KNOWLEDGE_BASE_VERSION = '1.0.0';
export const TED_KNOWLEDGE_BASE_AS_OF = '2026-09-20';

/* ------------------------------------------------------------------ */
/* (a) Canonical identity                                              */
/* ------------------------------------------------------------------ */

export const TED_CANONICAL_IDENTITY = {
  repo: 'TheOCGroup/ocg-lab-site',
  repoBranch: 'main',
  repoHeadCommit: 'f9f92c319c8c902ebcc914c8e0a1f63295b9e0fe',
  site: 'https://ocg-lab-os.netlify.app',
  netlifyPublishedDeployId: '6aa6c8a7f91990de791a0128',
  netlifyDeployCreatedAt: '2026-09-13T16:00:39.588Z',
  netlifyDeployRepublishedAt: '2026-09-13T22:56:29.403Z',
  netlifyDeployFileCount: 283,
} as const;

/* ------------------------------------------------------------------ */
/* (b) Products — 8 verified live pages, no verified checkout anywhere */
/* ------------------------------------------------------------------ */

export type TedProductStatus = 'LIVE_PAGE' | 'NOT_ON_SITE';
export type TedCheckoutStatus = 'NO_VERIFIED_CHECKOUT' | 'VERIFIED_CHECKOUT';

export interface TedProductRecord {
  productId: string;
  productName: string;
  productType: 'AI PRO' | 'AI SUPER PRO' | 'PLAYBOOK' | 'CALCULATOR / TOOL';
  route: string;
  pageStatus: TedProductStatus;
  checkoutStatus: TedCheckoutStatus;
  readiness: VerificationState;
  price: 'STATUS UNAVAILABLE';
  priceNote: string;
  embeddedSpecialist?: string;
}

export const TED_PRODUCTS: TedProductRecord[] = [
  {
    productId: 'aipro-rei',
    productName: 'Real Estate Investor AI PRO',
    productType: 'AI PRO',
    route: '/real-estate-investor-ai-pro/',
    pageStatus: 'LIVE_PAGE',
    checkoutStatus: 'NO_VERIFIED_CHECKOUT',
    readiness: 'UNVERIFIED',
    price: 'STATUS UNAVAILABLE',
    priceNote: 'Live page shows no price; "purchase" text is unverified page content, not a confirmed offer.',
  },
  {
    productId: 'calc-fix-flip',
    productName: 'Fix & Flip Calculator',
    productType: 'CALCULATOR / TOOL',
    route: '/fix-flip-calculator/',
    pageStatus: 'LIVE_PAGE',
    checkoutStatus: 'NO_VERIFIED_CHECKOUT',
    readiness: 'UNVERIFIED',
    price: 'STATUS UNAVAILABLE',
    priceNote: 'Live page renders "$0"; this is page content, not a confirmed price or offer.',
  },
  {
    productId: 'calc-wholesaler',
    productName: 'Wholesaler Deal Calculator',
    productType: 'CALCULATOR / TOOL',
    route: '/wholesaler-deal-calculator/',
    pageStatus: 'LIVE_PAGE',
    checkoutStatus: 'NO_VERIFIED_CHECKOUT',
    readiness: 'UNVERIFIED',
    price: 'STATUS UNAVAILABLE',
    priceNote: 'Live page renders "$0"; this is page content, not a confirmed price or offer.',
  },
  {
    productId: 'calc-brrrr',
    productName: 'BRRRR Calculator',
    productType: 'CALCULATOR / TOOL',
    route: '/brrrr-calculator/',
    pageStatus: 'LIVE_PAGE',
    checkoutStatus: 'NO_VERIFIED_CHECKOUT',
    readiness: 'UNVERIFIED',
    price: 'STATUS UNAVAILABLE',
    priceNote: 'Live page renders "$0" with a "Purchase" mention; neither is a confirmed price nor a verified checkout.',
  },
  {
    productId: 'calc-rental',
    productName: 'Rental Property Calculator',
    productType: 'CALCULATOR / TOOL',
    route: '/rental-property-calculator/',
    pageStatus: 'LIVE_PAGE',
    checkoutStatus: 'NO_VERIFIED_CHECKOUT',
    readiness: 'UNVERIFIED',
    price: 'STATUS UNAVAILABLE',
    priceNote: 'Live page renders "$0" with a "Purchase" mention; neither is a confirmed price nor a verified checkout.',
  },
  {
    productId: 'playbook-insurance',
    productName: 'Insurance Agent AI Playbook',
    productType: 'PLAYBOOK',
    route: '/playbooks/insurance-agent/',
    pageStatus: 'LIVE_PAGE',
    checkoutStatus: 'NO_VERIFIED_CHECKOUT',
    readiness: 'UNVERIFIED',
    price: 'STATUS UNAVAILABLE',
    priceNote: 'Live page shows no price and no buy signals. Registry-recorded channel prices exist (see registry below) but have no current live verification.',
    embeddedSpecialist: 'Avery',
  },
  {
    productId: 'playbook-rei',
    productName: 'Real Estate Investor AI Playbook',
    productType: 'PLAYBOOK',
    route: '/playbooks/real-estate-investor/',
    pageStatus: 'LIVE_PAGE',
    checkoutStatus: 'NO_VERIFIED_CHECKOUT',
    readiness: 'UNVERIFIED',
    price: 'STATUS UNAVAILABLE',
    priceNote: 'Live page shows no price and no buy signals. Registry-recorded channel prices exist (see registry below) but have no current live verification.',
    embeddedSpecialist: 'Grant',
  },
  {
    productId: 'superpro-lender',
    productName: 'Lender AI SUPER PRO',
    productType: 'AI SUPER PRO',
    route: '/playbooks/lender-ai-super-pro/',
    pageStatus: 'LIVE_PAGE',
    checkoutStatus: 'NO_VERIFIED_CHECKOUT',
    readiness: 'UNVERIFIED',
    price: 'STATUS UNAVAILABLE',
    priceNote: 'Live page shows no price and no buy signals.',
    embeddedSpecialist: 'Harper',
  },
];

/**
 * Registry-recorded channel prices. These are values recorded in the repo's
 * canonical storefront registry (storefronts.ts) with their recorded
 * verification dates — they are recorded evidence, NOT current live price
 * verification. Current live price verification for every product remains
 * STATUS UNAVAILABLE until a fresh read-back succeeds.
 */
export interface TedRegistryPriceRecord {
  productId: string;
  productName: string;
  channel: 'Etsy' | 'Whop' | 'Direct';
  recordedPriceUsd: number;
  recordedVerification: string;
  currentLivePrice: 'STATUS UNAVAILABLE';
}

export const TED_REGISTRY_RECORDED_PRICES: TedRegistryPriceRecord[] = [
  { productId: 'playbook-insurance', productName: 'Insurance Agent AI Playbook', channel: 'Etsy', recordedPriceUsd: 19, recordedVerification: '2026-09-03 (repo registry)', currentLivePrice: 'STATUS UNAVAILABLE' },
  { productId: 'playbook-insurance', productName: 'Insurance Agent AI Playbook', channel: 'Whop', recordedPriceUsd: 19, recordedVerification: '2026-09-04 (repo registry)', currentLivePrice: 'STATUS UNAVAILABLE' },
  { productId: 'playbook-rei', productName: 'Real Estate Investor AI Playbook', channel: 'Whop', recordedPriceUsd: 19.99, recordedVerification: '2026-09-04 (repo registry)', currentLivePrice: 'STATUS UNAVAILABLE' },
  { productId: 'aipro-rei', productName: 'Real Estate Investor AI PRO', channel: 'Whop', recordedPriceUsd: 29, recordedVerification: '2026-09-04 (repo registry)', currentLivePrice: 'STATUS UNAVAILABLE' },
  { productId: 'aipro-leadflow', productName: 'LeadFlow AI PRO', channel: 'Whop', recordedPriceUsd: 99.99, recordedVerification: '2026-09-04 (repo registry)', currentLivePrice: 'STATUS UNAVAILABLE' },
  { productId: 'calc-bundle', productName: 'Real Estate Investor Calculator Bundle (3-in-1)', channel: 'Etsy', recordedPriceUsd: 67, recordedVerification: '2026-09-04 (repo registry)', currentLivePrice: 'STATUS UNAVAILABLE' },
];

/* ------------------------------------------------------------------ */
/* (c) Deployments                                                     */
/* ------------------------------------------------------------------ */

export interface TedDeploymentRecord {
  name: string;
  state: VerificationState | 'BLOCKED';
  detail: string;
}

export const TED_DEPLOYMENTS: TedDeploymentRecord[] = [
  {
    name: 'Production site (ocg-lab-os.netlify.app)',
    state: 'VERIFIED',
    detail:
      'Published deploy 6aa6c8a7f91990de791a0128 serves HTTP 200 at / and /os/; ' +
      'anonymous /api/os/sync returns 401 UNAUTHORIZED_FOUNDER_ACCESS. Serving 283 files. ' +
      'The live frontend bundle has NO frontend AbortSignal timeout patch.',
  },
  {
    name: 'Sync-timeout patch (approved)',
    state: 'BLOCKED',
    detail:
      'Approved artifact verified byte-identical: function source os-sync.js sha256:' +
      '7bc534149e73c451843c2602ad6e7aff6a2277701f06dca3fefb2430919f77b0 (commit 087d70a5), ' +
      'envelope bd485d209937 (625 bytes), frontend bundle index-DAtRr9ge.js with 2x AbortSignal.timeout. ' +
      'Deploy creation failed 2026-09-20 ~15:50 CDT: HTTP 403 "Account credit usage exceeded — new deploys are blocked until credits are added". ' +
      'Founder-only fix: add credits to the existing Netlify account, then rerun deploy_approved_patch.py.',
  },
];

/* ------------------------------------------------------------------ */
/* (d) Commerce                                                        */
/* ------------------------------------------------------------------ */

export interface TedCommerceRecord {
  channel: string;
  catalogState: VerificationState;
  ordersState: VerificationState;
  revenueState: VerificationState;
  customersState: VerificationState;
  subscriptionsState: VerificationState;
  detail: string;
}

export const TED_COMMERCE: TedCommerceRecord[] = [
  {
    channel: 'Etsy',
    catalogState: 'STATUS UNAVAILABLE',
    ordersState: 'STATUS UNAVAILABLE',
    revenueState: 'STATUS UNAVAILABLE',
    customersState: 'STATUS UNAVAILABLE',
    subscriptionsState: 'STATUS UNAVAILABLE',
    detail:
      '2026-09-20: Etsy API returned 403 (requests lacked the separate x-api-key; the prior transient key ' +
      'must not be recovered or reused). Historical (2026-09-12): listing 4570937150 (Real Estate Investor AI ' +
      'Playbook) draft/non-active. DO NOT TOUCH listings 4568082033, 4554940134, 4567698713.',
  },
  {
    channel: 'Whop',
    catalogState: 'STATUS UNAVAILABLE',
    ordersState: 'STATUS UNAVAILABLE',
    revenueState: 'STATUS UNAVAILABLE',
    customersState: 'STATUS UNAVAILABLE',
    subscriptionsState: 'STATUS UNAVAILABLE',
    detail:
      'No verified Whop API, storefront, order, customer, subscription, or revenue source recovered as of ' +
      '2026-09-20. Registry records (seller QA pending for Whop items) are recorded evidence only; no current ' +
      'live read-back exists.',
  },
  {
    channel: 'Direct (ocg-lab-os pages)',
    catalogState: 'STATUS UNAVAILABLE',
    ordersState: 'STATUS UNAVAILABLE',
    revenueState: 'STATUS UNAVAILABLE',
    customersState: 'STATUS UNAVAILABLE',
    subscriptionsState: 'STATUS UNAVAILABLE',
    detail:
      'All 8 product pages render but expose no verified checkout path. No order, customer, subscription, ' +
      'or revenue source exists.',
  },
];

/* ------------------------------------------------------------------ */
/* (e) Commercial lifecycle — TED's accountable stages                 */
/* ------------------------------------------------------------------ */

export interface TedLifecycleStageRecord {
  stage: TedLifecycleStage;
  dataSource: 'NONE_VERIFIED' | string;
  currentState: VerificationState;
  note: string;
}

export const TED_LIFECYCLE_STATE: TedLifecycleStageRecord[] = TED_COMMERCIAL_LIFECYCLE.map((stage) => ({
  stage,
  dataSource: 'NONE_VERIFIED',
  currentState: 'STATUS UNAVAILABLE' as VerificationState,
  note:
    'No verified source feeds this stage yet. ' +
    (stage === 'OFFER' || stage === 'PURCHASED' || stage === 'ACTIVE CUSTOMER' || stage === 'UPSELL/RENEWAL'
      ? 'No verified checkout, order, customer, or subscription source exists.'
      : 'No verified lead, conversation, or onboarding source exists.'),
}));

/* ------------------------------------------------------------------ */
/* (f) Governance — never-fabricate rules                              */
/* ------------------------------------------------------------------ */

export const TED_NEVER_FABRICATE: string[] = [
  'Never claim a price is live unless a verified source read it back.',
  'Never claim checkout exists because page text says "Purchase" or renders "$0".',
  'Never claim readiness, fulfillment, or "LIVE" state without end-to-end verification evidence.',
  'Never report sales, orders, customers, subscriptions, or revenue without a verified commerce source.',
  'Never claim a deployment succeeded unless the provider confirms the published deploy.',
  'Never claim agent activity or integrations without executed, evidenced runs.',
  'Use STATUS UNAVAILABLE, DEPLOYMENT UNVERIFIED, PRODUCTION UNVERIFIED, or BLOCKED whenever evidence is missing.',
  'Registry-recorded prices are recorded evidence with dates — never present them as current live prices.',
  'TED coordinates MARK, ORION, and NOVA; he never impersonates them or absorbs their lanes.',
  'TED owns the OCG LAB commercial workspace; PIPER\'s real-estate CRM data is out of scope.',
];

/* ------------------------------------------------------------------ */
/* Summary helpers                                                     */
/* ------------------------------------------------------------------ */

export function tedProductCount(): number {
  return TED_PRODUCTS.length;
}

export function tedProductsWithVerifiedCheckout(): TedProductRecord[] {
  return TED_PRODUCTS.filter((p) => p.checkoutStatus === 'VERIFIED_CHECKOUT');
}

export function tedCommerceMetricStates(): string[] {
  return TED_COMMERCE.flatMap((c) => [c.ordersState, c.revenueState, c.customersState, c.subscriptionsState]);
}
