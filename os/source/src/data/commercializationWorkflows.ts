export type CommercialWorkflowStatus = 'CERTIFIED' | 'READY' | 'CONNECTED' | 'MANUAL' | 'BLOCKED' | 'PLANNED';

export interface CommercialWorkflow {
  id: string;
  name: string;
  owner: string;
  qaOwner: string;
  status: CommercialWorkflowStatus;
  purpose: string;
  stages: string[];
  completionGate: string;
}

export const COMMERCIALIZATION_LIFECYCLE = [
  'PRODUCT READY',
  'PRODUCT QA',
  'COMMERCIAL PACKAGE',
  'CHANNEL ADAPTATION',
  'CHANNEL QA',
  'FOUNDER APPROVAL',
  'PUBLISH',
  'PUBLIC VERIFICATION',
  'BUYER EXPERIENCE QA',
  'MARKETING LAUNCH',
  'ANALYTICS',
  'CUSTOMER SUPPORT',
  'OPTIMIZATION'
] as const;

export const COMMERCIAL_WORKFLOWS: CommercialWorkflow[] = [
  {
    id: 'wf-etsy',
    name: 'Etsy Marketplace',
    owner: 'Mira / Mark',
    qaOwner: 'Quincey / Hunter',
    status: 'CERTIFIED',
    purpose: 'Digital marketplace listing and instant-download fulfillment.',
    stages: ['Listing package', '13 tags', 'Media QA', 'Digital fulfillment', 'Founder gate', 'Publish', 'Buyer verification'],
    completionGate: 'Public listing live, correct price/media, and buyer files verified.'
  },
  {
    id: 'wf-whop',
    name: 'Whop Storefront',
    owner: 'Mira / Mark',
    qaOwner: 'Quincey / Hunter',
    status: 'READY',
    purpose: 'Premium product page, checkout, entitlement/access, and marketplace readiness.',
    stages: ['Store audit', 'Product page', 'Pricing plan', 'Gallery/video', 'Features/FAQ', 'Checkout', 'Access entitlement', 'Buyer verification'],
    completionGate: 'Public Whop product and checkout verified against the approved package.'
  },
  {
    id: 'wf-direct',
    name: 'OCG LAB Direct',
    owner: 'Mira / Victor',
    qaOwner: 'Quincey',
    status: 'CONNECTED',
    purpose: 'Canonical owned product page and direct access surface.',
    stages: ['Production URL', 'CTA/access', 'Product QA', 'Public verification'],
    completionGate: 'Canonical product URL is public and the buyer access path works.'
  },
  {
    id: 'wf-onboarding',
    name: 'Customer Onboarding',
    owner: 'Nova / Syndee',
    qaOwner: 'Hunter',
    status: 'READY',
    purpose: 'Ensure every buyer immediately knows what they bought, where to access it, and what to do first.',
    stages: ['Purchase handoff', 'Access instructions', 'First-run guidance', 'Requirements', 'Support route', 'Update policy'],
    completionGate: 'New buyer can reach and use the product without internal assistance.'
  },
  {
    id: 'wf-support',
    name: 'Customer Support',
    owner: 'Syndee',
    qaOwner: 'Quincey',
    status: 'READY',
    purpose: 'Route and resolve access, billing, download, setup, product, and account issues.',
    stages: ['Classify', 'Assign', 'Reproduce', 'Resolve', 'Verify', 'Close', 'Knowledge update'],
    completionGate: 'Issue resolution verified and reusable knowledge captured when applicable.'
  },
  {
    id: 'wf-refunds',
    name: 'Refunds / Disputes / Risk',
    owner: 'Sentinel / Mira',
    qaOwner: 'Quincey',
    status: 'READY',
    purpose: 'Govern refunds, failed payments, chargebacks, duplicate purchases, policy warnings, and account limitations.',
    stages: ['Intake', 'Evidence', 'Platform policy check', 'Founder gate when consequential', 'Action', 'Audit record'],
    completionGate: 'Financial/platform action completed under actual policy with audit evidence.'
  },
  {
    id: 'wf-updates',
    name: 'Product Updates',
    owner: 'Piper / Victor',
    qaOwner: 'Quincey / Hunter',
    status: 'READY',
    purpose: 'Keep delivered products and all storefront descriptions/access paths synchronized after releases.',
    stages: ['Change request', 'Build', 'Independent QA', 'Release', 'Storefront sync', 'Customer communication', 'Verify'],
    completionGate: 'New version live with no channel or fulfillment drift.'
  },
  {
    id: 'wf-marketing',
    name: 'Marketing Launch',
    owner: 'Mark',
    qaOwner: 'Mira / Quincey',
    status: 'READY',
    purpose: 'Create post-publication launch work rather than treating publication as completion.',
    stages: ['Positioning', 'Social', 'Short-form video', 'Demo', 'Newsletter/email', 'SEO/GEO/AEO', 'Cross-sell'],
    completionGate: 'Approved launch assets distributed to selected channels and linked to the live product.'
  },
  {
    id: 'wf-analytics',
    name: 'Commercial Analytics',
    owner: 'Orion / Mark',
    qaOwner: 'Hunter',
    status: 'READY',
    purpose: 'Separate real retrieved commerce metrics from manual or unsupported metrics.',
    stages: ['Views', 'Checkout starts', 'Purchases', 'Revenue', 'Refunds', 'Support', 'Reviews', 'Conversion analysis'],
    completionGate: 'Aiden can report only verified metrics with source and freshness.'
  },
  {
    id: 'wf-reviews',
    name: 'Reviews / Feedback',
    owner: 'Mark / Syndee',
    qaOwner: 'Sentinel',
    status: 'READY',
    purpose: 'Turn real buyer feedback into product fixes, testimonials, and follow-up actions without fabricated social proof.',
    stages: ['Capture', 'Sentiment', 'Classify', 'Product issue/testimonial', 'Action', 'Follow-up'],
    completionGate: 'Feedback has a documented disposition and any product issue is routed.'
  },
  {
    id: 'wf-affiliate',
    name: 'Affiliate / Partner',
    owner: 'Mark / Mira',
    qaOwner: 'Sentinel',
    status: 'PLANNED',
    purpose: 'Controlled affiliate activation where an approved channel supports it.',
    stages: ['Eligibility', 'Commission proposal', 'Founder approval', 'Assets', 'Tracking', 'Performance review'],
    completionGate: 'No financial commitment is activated without approved terms and tracking.'
  }
];
