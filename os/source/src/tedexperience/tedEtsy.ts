/**
 * TED Super Agent — Etsy and e-commerce knowledge (Phase 2).
 *
 * EXPERIENCE LAYER ONLY. Stable structural knowledge about how Etsy and
 * e-commerce storefronts work (listing anatomy, digital delivery mechanics,
 * SEO principles, fulfillment, checkout flow). This knowledge is structural
 * and changes slowly, so TED can answer it directly.
 *
 * Two hard routings:
 * - Current policy / fee / feature questions -> live research (fail closed
 *   when unavailable). TED never invents current platform status.
 * - Actual seller-account actions (change my listing, publish, update my
 *   shop) -> require real authenticated access. Unavailable here, stated
 *   plainly.
 */

const normalized = (value: string): string =>
  value.toLowerCase().replace(/[’]/g, "'").replace(/\s+/g, ' ').trim();

export const ETSY_STRUCTURAL_KNOWLEDGE = {
  listingAnatomy: [
    'Title: the primary search surface — front-load the terms a buyer would actually type.',
    'Description: the conversion surface — what it is, what they get, how delivery works, what to do if something goes wrong.',
    'Tags (13 on Etsy): alternative search terms and use-cases, not repeats of the title.',
    'Images/thumbnails: the click decision happens here before a single word is read.',
    'Variants: options like size, format, or license tier where the product genuinely differs.',
    'Digital delivery: the buyer gets a download link after purchase — no shipping, no tracking number.',
  ],
  digitalDelivery: [
    'Digital products deliver as files the buyer downloads from their purchase record.',
    'Fulfillment is instant and automatic once payment clears — your job is making the files correct, complete, and clearly named.',
    'Support load comes from unclear delivery expectations, not from the platform: say exactly what the buyer receives.',
  ],
  listingSeo: [
    'Etsy search matches buyer queries against titles, tags, and descriptions — relevance first, then listing quality signals.',
    'Write titles for humans first, search terms second; keyword stuffing reads as spam to both.',
    'Renewing, favorites, and conversion history are quality signals you influence through the product and presentation, not tricks.',
  ],
  storeOrganization: [
    'Sections organize the shop for browsing buyers; they do not change search behavior much.',
    'A coherent shop (one promise, one buyer) converts better than a general store.',
  ],
  fulfillment: [
    'Digital: automatic download on cleared payment. Physical: you or your production partner ships; tracking expectations are set at the listing.',
    'Customer access problems are almost always: wrong email on the order, download link confusion, or file-format mismatch — in that order.',
  ],
  platformLimitations: [
    'Etsy owns the checkout and the customer relationship mechanics — you rent the marketplace, you do not own the rails.',
    'Policy and fee specifics change; TED treats anything current as research-required, never as stored fact.',
  ],
  pricingConcepts: [
    'Price against the value of the outcome, not the cost of the file — digital goods have near-zero marginal cost, so positioning carries the price.',
    'Test pricing in small steps; watch conversion, not just views.',
  ],
  checkoutFlow: [
    'Buyer searches or clicks -> listing page -> add to cart -> Etsy checkout (payment, confirmation) -> digital download or shipping flow.',
    'Abandonment happens at: unclear delivery, surprise costs, weak reviews, confusing variants.',
  ],
  analytics: [
    'Watch: views, favorites, conversion rate (orders/views), search terms bringing traffic, and which listings earn favorites but not orders.',
    'A listing with views but no orders is a conversion problem (presentation, price, clarity). A listing with no views is a discovery problem (title, tags, thumbnails).',
  ],
  publishingWorkflow: [
    'Draft -> complete every field (title, description, tags, images, delivery files) -> preview as a buyer -> publish -> verify the live listing renders and downloads correctly.',
    'Never mark a listing done without opening the live page and, for digital products, confirming the download works.',
  ],
} as const;

export const ECOMMERCE_ARCHITECTURE_NOTES = [
  'Etsy: rented marketplace — discovery built in, platform owns checkout and policy, limited control.',
  'Shopify: owned storefront on rented rails — you own the brand and customer list, you drive the traffic.',
  'Whop: digital-product and community commerce — built for selling access, files, and memberships.',
  'Direct: full control, full responsibility — checkout, fulfillment, fraud, and traffic are all yours.',
  'The pattern across all four: separate discovery (how buyers find you), transaction (how money moves), and fulfillment (how value is delivered). Most store problems are one of those three breaking, not all three.',
];

/** True when the question is about Etsy's current policies, fees, or features. */
export function isEtsyPolicyQuestion(message: string): boolean {
  const q = normalized(message);
  if (!q.includes('etsy')) return false;
  return /(policy|policies|fee|fees|change|changes|new|update|announc|ban|suspend|allowed|prohibited|right now|current)/.test(q);
}

/** True when the founder asks TED to act on their actual Etsy account. */
export function isEtsyAccountAction(message: string): boolean {
  const q = normalized(message);
  if (!q.includes('etsy')) return false;
  const mine = /(my|our|the)\s+(listing|shop|store|order|inventory)/.test(q) || q.includes('my etsy');
  const action = /(update|change|edit|publish|create|delete|remove|renew|cancel|refund|message the buyer|respond)/.test(q);
  return mine && action;
}

/** True when the message is about Etsy/e-commerce structurally (answerable from stored knowledge). */
export function isEtsyStructuralQuestion(message: string): boolean {
  const q = normalized(message);
  return (
    q.includes('etsy') ||
    q.includes('shopify') ||
    q.includes('whop') ||
    (q.includes('listing') && /(seo|tag|title|description|optimiz|structure|improve)/.test(q)) ||
    (q.includes('digital product') && /(sell|deliver|fulfill|publish)/.test(q))
  );
}

function section(title: string, items: readonly string[]): string {
  return `**${title}**\n${items.map((i) => `• ${i}`).join('\n')}`;
}

/** Structural Etsy/e-commerce guidance from stored knowledge. */
export function etsyGuidanceReply(message: string): string {
  const q = normalized(message);
  const parts: string[] = [];
  if (/seo|tag|title|search|discover|views/.test(q)) {
    parts.push(section('Listing SEO (how Etsy discovery works)', ETSY_STRUCTURAL_KNOWLEDGE.listingSeo));
  }
  if (/digital|download|deliver|fulfill/.test(q)) {
    parts.push(section('Digital delivery mechanics', ETSY_STRUCTURAL_KNOWLEDGE.digitalDelivery));
    parts.push(section('Fulfillment', ETSY_STRUCTURAL_KNOWLEDGE.fulfillment));
  }
  if (/variant/.test(q)) {
    parts.push(section('Listing anatomy', ETSY_STRUCTURAL_KNOWLEDGE.listingAnatomy));
  }
  if (/price|pricing/.test(q)) {
    parts.push(section('Pricing (concepts, not current fee schedules)', ETSY_STRUCTURAL_KNOWLEDGE.pricingConcepts));
    parts.push('Note: actual Etsy fee numbers change — I will not quote them from memory. Ask and I\'ll tell you whether I can verify them live right now.');
  }
  if (/checkout|conversion|abandon/.test(q)) {
    parts.push(section('Checkout flow', ETSY_STRUCTURAL_KNOWLEDGE.checkoutFlow));
  }
  if (/analytic|stat|traffic/.test(q)) {
    parts.push(section('Analytics (what to watch)', ETSY_STRUCTURAL_KNOWLEDGE.analytics));
  }
  if (/publish|launch the/.test(q)) {
    parts.push(section('Publishing workflow', ETSY_STRUCTURAL_KNOWLEDGE.publishingWorkflow));
  }
  if (/shopify|whop|direct|storefront|platform/.test(q)) {
    parts.push(section('How the platforms compare', ECOMMERCE_ARCHITECTURE_NOTES));
  }
  if (!parts.length) {
    parts.push(section('Listing anatomy', ETSY_STRUCTURAL_KNOWLEDGE.listingAnatomy));
    parts.push(section('Digital delivery mechanics', ETSY_STRUCTURAL_KNOWLEDGE.digitalDelivery));
  }
  return (
    `Here's the structural picture — this is how the platform works, not today's policy snapshot:\n\n` +
    parts.join('\n\n') +
    `\n\nIf your question is really "what changed recently" — fees, policies, new features — ` +
    `say so and I'll check whether I can verify it live right now instead of guessing.`
  );
}

/** Honest reply when the founder asks TED to act on their Etsy account. */
export function etsyAccountActionReply(): string {
  return (
    `I know exactly how to make that change — but Etsy write access is not connected yet. ` +
    `There's no authenticated Etsy session in this build, so I can't touch your listings, shop, or orders from here, and I'm not going to pretend I did.\n\n` +
    `What I *can* do right now:\n\n` +
    `• Draft the exact new title, tags, and description for you to paste in\n` +
    `• Walk through the listing field by field and tell you what I'd change and why\n` +
    `• Lay out the publishing checklist so the update goes live cleanly\n\n` +
    `Tell me which listing and what you want changed, and I'll prep everything so it's a two-minute job on your end.`
  );
}
