import { PORTFOLIO_DATA } from './portfolio';
import { STOREFRONT_ITEMS_DATA } from './storefronts';
import { PRODUCT_COMMERCIALIZATION_TEMPLATES } from './productCommercializationTemplates';

export type ProductReadinessState = 'LIVE' | 'CHANNEL VERIFICATION' | 'CHANNEL PUBLISH' | 'CHANNEL REGISTRATION' | 'FOUNDATION BLOCKED';
export type ProductCommercializationType = 'PLAYBOOK' | 'AI PRO' | 'AI SUPER PRO' | 'CALCULATOR / TOOL';

export interface ProductChannelReadiness {
  channel: 'Whop' | 'Etsy' | 'Direct';
  state: 'VERIFIED LIVE' | 'PUBLIC / SELLER QA PENDING' | 'READY TO PUBLISH' | 'DRAFT' | 'NOT REGISTERED';
}

export interface ProductCommercializationReadiness {
  productId: string;
  productName: string;
  productType: ProductCommercializationType;
  leadAgent: string;
  state: ProductReadinessState;
  channels: ProductChannelReadiness[];
  blockers: string[];
  nextAction: string;
}

const typeForLadder = (ladder: string): ProductCommercializationType | null => {
  if (ladder === 'PLAYBOOK') return 'PLAYBOOK';
  if (ladder === 'AI PRO') return 'AI PRO';
  if (ladder === 'AI SUPER PRO') return 'AI SUPER PRO';
  if (ladder === 'CALCULATOR') return 'CALCULATOR / TOOL';
  return null;
};

export const PRODUCT_COMMERCIALIZATION_READINESS: ProductCommercializationReadiness[] = PORTFOLIO_DATA.flatMap(item => {
  const productType = typeForLadder(item.ladder);
  if (!productType) return [];

  const template = PRODUCT_COMMERCIALIZATION_TEMPLATES.find(candidate => candidate.productType === productType);
  if (!template) return [];

  const blockers: string[] = [];
  if (!item.deliveryAsset?.trim()) blockers.push('Delivery asset is missing.');
  if (!item.productionUrl?.trim() || item.productionUrl.includes('localhost')) blockers.push('Public production URL is missing or not production-safe.');

  const targetChannels = item.channels.filter((channel): channel is 'Whop' | 'Etsy' | 'Direct' => channel !== 'Bundle');
  const channels: ProductChannelReadiness[] = targetChannels.map(channel => {
    const record = STOREFRONT_ITEMS_DATA.find(storefront => storefront.productId === item.id && storefront.channel === channel);
    if (!record) return { channel, state: 'NOT REGISTERED' };
    if (record.status === 'Live' && record.buyerQaStatus === 'VERIFIED' && (record.sellerQaStatus === 'VERIFIED' || record.sellerQaStatus === 'NOT_APPLICABLE')) return { channel, state: 'VERIFIED LIVE' };
    if (record.buyerQaStatus === 'VERIFIED' && record.sellerQaStatus === 'PENDING') return { channel, state: 'PUBLIC / SELLER QA PENDING' };
    if (record.status === 'Ready' && record.buyerQaStatus === 'PENDING') return { channel, state: 'READY TO PUBLISH' };
    if (record.status === 'Live') return { channel, state: 'PUBLIC / SELLER QA PENDING' };
    return { channel, state: 'DRAFT' };
  });

  const missingRegistration = channels.find(channel => channel.state === 'NOT REGISTERED');
  const draftChannel = channels.find(channel => channel.state === 'DRAFT');
  const verificationChannel = channels.find(channel => channel.state === 'PUBLIC / SELLER QA PENDING');
  const publishChannel = channels.find(channel => channel.state === 'READY TO PUBLISH');
  const allLive = channels.length > 0 && channels.every(channel => channel.state === 'VERIFIED LIVE');

  let state: ProductReadinessState;
  let nextAction: string;

  if (blockers.length > 0) {
    state = 'FOUNDATION BLOCKED';
    nextAction = blockers[0];
  } else if (verificationChannel) {
    state = 'CHANNEL VERIFICATION';
    nextAction = `Perform authenticated seller-side verification for ${verificationChannel.channel}; only then may it be marked Live.`;
  } else if (publishChannel) {
    state = 'CHANNEL PUBLISH';
    nextAction = `Publish or recover the ${publishChannel.channel} listing using the certified channel package, then capture the public product URL for seller-side verification.`;
  } else if (draftChannel) {
    state = 'CHANNEL VERIFICATION';
    nextAction = `Complete ${draftChannel.channel} channel package and QA before external verification.`;
  } else if (missingRegistration) {
    state = 'CHANNEL REGISTRATION';
    nextAction = `Register ${missingRegistration.channel} commercialization record using the ${template.productType} template; do not infer external live state.`;
  } else if (allLive) {
    state = 'LIVE';
    nextAction = 'Run buyer-experience QA, analytics, support, and optimization without fabricating commerce metrics.';
  } else {
    state = 'CHANNEL VERIFICATION';
    nextAction = 'Complete channel QA and public verification for the remaining approved channels.';
  }

  return [{
    productId: item.id,
    productName: item.name,
    productType,
    leadAgent: item.leadAgent,
    state,
    channels,
    blockers,
    nextAction
  }];
});
