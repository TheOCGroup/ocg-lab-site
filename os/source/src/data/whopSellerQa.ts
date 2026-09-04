import { STOREFRONT_ITEMS_DATA } from './storefronts';

export interface WhopSellerQaTarget {
  storefrontId: string;
  productId: string;
  productName: string;
  publicUrl: string;
  expectedPrice: number;
  requiredReadback: string[];
  sellerEvidence: string;
}

const REQUIRED_WHOP_SELLER_READBACK = [
  'Company/store identity',
  'Product identity and visibility',
  'Active plan identity',
  'Initial price and currency',
  'One-time vs recurring billing behavior',
  'Entitlement/access configuration',
  'Fulfillment destination or access app',
  'Duplicate active plan check',
  'Stock/availability configuration',
  'No unintended trial or renewal charge'
];

export const WHOP_SELLER_QA_TARGETS: WhopSellerQaTarget[] = STOREFRONT_ITEMS_DATA
  .filter(item => item.channel === 'Whop' && item.buyerQaStatus === 'VERIFIED' && item.sellerQaStatus === 'PENDING')
  .map(item => ({
    storefrontId: item.id,
    productId: item.productId,
    productName: item.productName,
    publicUrl: item.fulfillmentUrl,
    expectedPrice: item.price,
    requiredReadback: REQUIRED_WHOP_SELLER_READBACK,
    sellerEvidence: item.sellerQaEvidence
  }));

export const WHOP_ENTITLEMENT_QA_PENDING = WHOP_SELLER_QA_TARGETS.length > 0;
