import { StorefrontItem, StorefrontVerificationStatus } from '../types';

export type VerificationFreshness = 'CURRENT' | 'STALE' | 'PENDING' | 'NOT_APPLICABLE';

export const STOREFRONT_QA_MAX_AGE_DAYS = 7;

export const getVerificationFreshness = (
  status: StorefrontVerificationStatus,
  verifiedAt?: string,
  nowMs: number = Date.now(),
  maxAgeDays: number = STOREFRONT_QA_MAX_AGE_DAYS
): VerificationFreshness => {
  if (status === 'NOT_APPLICABLE') return 'NOT_APPLICABLE';
  if (status !== 'VERIFIED' || !verifiedAt) return 'PENDING';
  const verifiedMs = Date.parse(verifiedAt);
  if (!Number.isFinite(verifiedMs)) return 'STALE';
  const ageMs = Math.max(0, nowMs - verifiedMs);
  return ageMs > maxAgeDays * 24 * 60 * 60 * 1000 ? 'STALE' : 'CURRENT';
};

export interface StorefrontVerificationDebt {
  item: StorefrontItem;
  buyerFreshness: VerificationFreshness;
  sellerFreshness: VerificationFreshness;
  priority: number;
  reason: string;
}

export const getStorefrontVerificationDebt = (
  items: StorefrontItem[],
  nowMs: number = Date.now()
): StorefrontVerificationDebt[] => items.flatMap(item => {
  const buyerFreshness = getVerificationFreshness(item.buyerQaStatus, item.buyerQaVerifiedAt, nowMs);
  const sellerFreshness = getVerificationFreshness(item.sellerQaStatus, item.sellerQaVerifiedAt, nowMs);

  if (item.buyerQaStatus === 'PENDING' && item.status === 'Ready') {
    return [{ item, buyerFreshness, sellerFreshness, priority: 1, reason: 'Buyer/public QA is pending before this channel can be verified.' }];
  }
  if (item.sellerQaStatus === 'PENDING' && item.buyerQaStatus === 'VERIFIED') {
    return [{ item, buyerFreshness, sellerFreshness, priority: 0, reason: 'Public buyer QA exists; authenticated seller-side QA is the nearest remaining verification gate.' }];
  }
  if (buyerFreshness === 'STALE' || sellerFreshness === 'STALE') {
    return [{ item, buyerFreshness, sellerFreshness, priority: 2, reason: 'Previously verified evidence is stale and should be re-checked.' }];
  }
  return [];
}).sort((a, b) => a.priority - b.priority || a.item.productName.localeCompare(b.item.productName));
