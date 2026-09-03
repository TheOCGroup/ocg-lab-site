import { CommercialLadder, CanonicalStatus, ProductPipelineStage } from '../types';

export interface PortfolioItem {
  id: string;
  name: string;
  ladder: CommercialLadder | 'CALCULATOR' | 'PLATFORM' | 'PUBLICATION';
  vertical: string;
  summary: string;
  status: CanonicalStatus;
  currentPhase: ProductPipelineStage;
  targetAudience: string;
  pricing: {
    tier: 'FREE' | 'LOW' | 'MID' | 'HIGH' | 'ENTERPRISE';
    amount: number;
    billing: 'one-time' | 'monthly' | 'custom';
  };
  channels: ('Whop' | 'Etsy' | 'Direct' | 'Bundle')[];
  deliveryAsset: string;
  productionUrl?: string;
  leadAgent: string;
  featured?: boolean;
}

export const PORTFOLIO_DATA: PortfolioItem[] = [
  // LADDER 1: DIGITAL PLAYBOOKS (Insurance Agent is Master Standard)
  {
    id: 'playbook-insurance',
    name: 'Insurance Agent AI Playbook',
    ladder: 'PLAYBOOK',
    vertical: 'Insurance',
    summary: 'Master standard digital playbook for modern insurance agencies: automated policy inquiries, client onboarding, and lead nurturing.',
    status: 'RELEASED',
    currentPhase: 'COMMERCIALIZATION',
    targetAudience: 'Independent Insurance Agents & Brokerages',
    pricing: { tier: 'LOW', amount: 47, billing: 'one-time' },
    channels: ['Etsy', 'Whop', 'Direct'],
    deliveryAsset: 'OCG_LAB_Insurance_Agent_ETSY_COMPLETE_PACKAGE_FINAL.zip',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/insurance-agent-playbook/',
    leadAgent: 'Piper',
    featured: true
  },
  {
    id: 'playbook-rei',
    name: 'Real Estate Investor AI Playbook',
    ladder: 'PLAYBOOK',
    vertical: 'Real Estate Investing',
    summary: 'Practical implementation playbook for distressed property sourcing, skip tracing prompts, and automated seller follow-up workflows.',
    status: 'RELEASED',
    currentPhase: 'COMMERCIALIZATION',
    targetAudience: 'Real Estate Wholesalers, Flippers & Buy-and-Hold Investors',
    pricing: { tier: 'LOW', amount: 47, billing: 'one-time' },
    channels: ['Etsy', 'Whop', 'Direct'],
    deliveryAsset: 'OCG_LAB_ALL_50_PRODUCTS_ONE_FOLDER.zip',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/real-estate-investor-ai-pro/',
    leadAgent: 'Victor',
    featured: true
  },
  {
    id: 'playbook-realtor',
    name: 'Realtor AI Playbook',
    ladder: 'PLAYBOOK',
    vertical: 'Real Estate Sales',
    summary: 'High-converting listing descriptions, buyer nurture sequences, and market update automations for real estate agents.',
    status: 'RELEASED',
    currentPhase: 'COMMERCIALIZATION',
    targetAudience: 'Licensed Real Estate Agents & Brokers',
    pricing: { tier: 'LOW', amount: 47, billing: 'one-time' },
    channels: ['Etsy', 'Whop'],
    deliveryAsset: 'OCG_LAB_ALL_50_PRODUCTS_ONE_FOLDER.zip',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/playbooks/',
    leadAgent: 'Piper'
  },
  {
    id: 'playbook-roofing',
    name: 'Roofing Contractor AI Playbook',
    ladder: 'PLAYBOOK',
    vertical: 'Trade & Construction',
    summary: 'Storm damage inspection workflows, insurance claim correspondence, and rapid homeowner estimating prompt systems.',
    status: 'RELEASED',
    currentPhase: 'COMMERCIALIZATION',
    targetAudience: 'Roofing Contractors & Exterior Specialists',
    pricing: { tier: 'LOW', amount: 47, billing: 'one-time' },
    channels: ['Etsy', 'Whop'],
    deliveryAsset: 'OCG_LAB_ALL_50_PRODUCTS_ONE_FOLDER.zip',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/playbooks/',
    leadAgent: 'Archer'
  },
  {
    id: 'playbook-content-creator',
    name: 'Content Creator Business Playbook',
    ladder: 'PLAYBOOK',
    vertical: 'Digital Media',
    summary: 'Sponsorship pitching templates, multi-platform repurposing matrices, and audience monetisation strategies.',
    status: 'RELEASED',
    currentPhase: 'COMMERCIALIZATION',
    targetAudience: 'YouTubers, Podcasters & Independent Creators',
    pricing: { tier: 'LOW', amount: 47, billing: 'one-time' },
    channels: ['Etsy', 'Whop'],
    deliveryAsset: 'OCG_LAB_Content_Creator_Business_Playbook_V2_QA.zip',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/playbooks/',
    leadAgent: 'Nova'
  },
  {
    id: 'playbook-gamer-streaming',
    name: 'Gamer & Streaming AI Playbook',
    ladder: 'PLAYBOOK',
    vertical: 'Gaming & Streaming',
    summary: 'Live stream audience engagement, Discord bot prompts, clip highlights curation, and channel growth system.',
    status: 'RELEASED',
    currentPhase: 'COMMERCIALIZATION',
    targetAudience: 'Twitch & YouTube Streamers',
    pricing: { tier: 'LOW', amount: 47, billing: 'one-time' },
    channels: ['Etsy', 'Whop'],
    deliveryAsset: 'OCG_LAB_Gamer_Streaming_AI_Playbook_FINAL_MASTER_FAMILY.html',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/playbooks/',
    leadAgent: 'Nova'
  },

  // LADDER 2: AI PRO SYSTEMS
  {
    id: 'aipro-insurance',
    name: 'Insurance Agent AI PRO',
    ladder: 'AI PRO',
    vertical: 'Insurance',
    summary: 'Interactive AI Assistant configured with insurance guidelines, coverage explanation models, and customer intake scripts.',
    status: 'RELEASED',
    currentPhase: 'PRODUCTION',
    targetAudience: 'Insurance Agency Teams & Customer Support',
    pricing: { tier: 'MID', amount: 147, billing: 'one-time' },
    channels: ['Whop', 'Direct'],
    deliveryAsset: 'OCG_Lab_Insurance_Agent_AI_PRO_Access_Guide_FINAL.pdf',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/insurance/',
    leadAgent: 'Piper',
    featured: true
  },
  {
    id: 'aipro-rei',
    name: 'Real Estate Investor AI PRO',
    ladder: 'AI PRO',
    vertical: 'Real Estate Investing',
    summary: 'Deterministic underwriting terminal with instant Cap Rate, DSCR, cash-on-cash calculations, and risk flagging.',
    status: 'RELEASED',
    currentPhase: 'PRODUCTION',
    targetAudience: 'Active Real Estate Underwriters & Asset Managers',
    pricing: { tier: 'MID', amount: 147, billing: 'one-time' },
    channels: ['Whop', 'Direct'],
    deliveryAsset: 'OCG_LAB_AI_PRO_FAMILY_PREDEPLOYMENT.zip',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/real-estate-investor-ai-pro/',
    leadAgent: 'Victor',
    featured: true
  },
  {
    id: 'aipro-leadflow',
    name: 'LeadFlow AI PRO',
    ladder: 'AI PRO',
    vertical: 'Sales & Inbound Automation',
    summary: 'Autonomous lead qualification engine: captures leads from ads/web, scores intent in real-time, and schedules appointments.',
    status: 'RELEASED',
    currentPhase: 'COMMERCIALIZATION',
    targetAudience: 'Local Service Businesses & Sales Teams',
    pricing: { tier: 'MID', amount: 197, billing: 'one-time' },
    channels: ['Whop', 'Direct'],
    deliveryAsset: 'LeadFlow_DIY_OCG_LAB_REVISED_V4.html',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/leadflow-ai-pro/',
    leadAgent: 'Aiden',
    featured: true
  },
  {
    id: 'aipro-roofing',
    name: 'Roofing AI PRO',
    ladder: 'AI PRO',
    vertical: 'Trade & Construction',
    summary: 'Field inspection assistant and insurance supplemental estimate synthesizer for roofing sales reps.',
    status: 'RELEASED',
    currentPhase: 'PRODUCTION',
    targetAudience: 'Roofing Contractors & Field Project Managers',
    pricing: { tier: 'MID', amount: 147, billing: 'one-time' },
    channels: ['Whop', 'Direct'],
    deliveryAsset: 'OCG_LAB_AI_PRO_FAMILY_PREDEPLOYMENT.zip',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/go/',
    leadAgent: 'Archer'
  },

  // LADDER 3: AI SUPER PRO SYSTEMS
  {
    id: 'superpro-wedding-allie',
    name: 'Allie — Wedding & Destination Concierge',
    ladder: 'AI SUPER PRO',
    vertical: 'Event & Hospitality',
    summary: 'Complete autonomous concierge and planning workforce for luxury destination weddings and venue coordinators.',
    status: 'RELEASED',
    currentPhase: 'PRODUCTION',
    targetAudience: 'Wedding Planners, Venues & Couples',
    pricing: { tier: 'HIGH', amount: 997, billing: 'one-time' },
    channels: ['Direct', 'Whop'],
    deliveryAsset: 'OCG_LAB_Wedding_Destination_Concierge_AI_SUPER_PRO_Access_Guide.pdf',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/wedding-destination-concierge/',
    leadAgent: 'Allie',
    featured: true
  },
  {
    id: 'superpro-rei',
    name: 'Real Estate Investor AI SUPER PRO',
    ladder: 'AI SUPER PRO',
    vertical: 'Real Estate Investing',
    summary: 'End-to-end investment acquisition operating system: integrates lead intake, Victor underwriting, Piper follow-up, and deal packaging.',
    status: 'RELEASED',
    currentPhase: 'PRODUCTION',
    targetAudience: 'Private Equity Real Estate Firms & Syndicators',
    pricing: { tier: 'HIGH', amount: 1497, billing: 'one-time' },
    channels: ['Direct'],
    deliveryAsset: 'Real_Estate_Investor_AI_SUPER_PRO_The_OCG_Lab_Setup_Instructions.txt',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/real-estate-investor-ai-pro/',
    leadAgent: 'Victor'
  },

  // LADDER 4: TOOLKITS & CALCULATORS
  {
    id: 'calc-brrrr',
    name: 'BRRRR Cash Flow & Refinance Calculator',
    ladder: 'CALCULATOR',
    vertical: 'Real Estate Finance',
    summary: 'Deterministic calculator modeling Buy, Rehab, Rent, Refinance, Repeat equity recovery and infinite return metrics.',
    status: 'RELEASED',
    currentPhase: 'PRODUCTION',
    targetAudience: 'Buy-and-Hold Real Estate Investors',
    pricing: { tier: 'LOW', amount: 27, billing: 'one-time' },
    channels: ['Etsy', 'Whop', 'Bundle'],
    deliveryAsset: 'OCG_LAB_ADVANCED_BRRRR_CALCULATOR.html',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/brrrr-calculator/',
    leadAgent: 'Victor'
  },
  {
    id: 'calc-fix-flip',
    name: 'Fix & Flip 70% Rule Calculator',
    ladder: 'CALCULATOR',
    vertical: 'Real Estate Finance',
    summary: 'Instant Maximum Authorized Offer (MAO) calculator with holding cost schedules and target ROI margin thresholds.',
    status: 'RELEASED',
    currentPhase: 'PRODUCTION',
    targetAudience: 'Flippers & Rehab Investors',
    pricing: { tier: 'LOW', amount: 27, billing: 'one-time' },
    channels: ['Etsy', 'Whop', 'Bundle'],
    deliveryAsset: 'OCG_LAB_ADVANCED_FIX_FLIP_70_RULE_MASTER.html',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/fix-flip-calculator/',
    leadAgent: 'Victor'
  },
  {
    id: 'calc-rental',
    name: 'Rental Property Cash Flow Calculator',
    ladder: 'CALCULATOR',
    vertical: 'Real Estate Finance',
    summary: 'Comprehensive multi-unit rental property financial model with vacancy, maintenance reserves, and 10-year equity growth.',
    status: 'RELEASED',
    currentPhase: 'PRODUCTION',
    targetAudience: 'Landlords & Property Managers',
    pricing: { tier: 'LOW', amount: 27, billing: 'one-time' },
    channels: ['Etsy', 'Whop', 'Bundle'],
    deliveryAsset: 'OCG_LAB_ADVANCED_RENTAL_PROPERTY_CALCULATOR.html',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/rental-property-calculator/',
    leadAgent: 'Victor'
  },
  {
    id: 'calc-wholesaler',
    name: 'Wholesaler Deal & Assignment Calculator',
    ladder: 'CALCULATOR',
    vertical: 'Real Estate Wholesaling',
    summary: 'Calculates contract purchase price, assignment fee spreads, and end-buyer investment yield analysis in real time.',
    status: 'RELEASED',
    currentPhase: 'PRODUCTION',
    targetAudience: 'Real Estate Wholesalers',
    pricing: { tier: 'LOW', amount: 27, billing: 'one-time' },
    channels: ['Etsy', 'Whop', 'Bundle'],
    deliveryAsset: 'OCG_LAB_ALL_50_PRODUCTS_ONE_FOLDER.zip',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/wholesaler-deal-calculator/',
    leadAgent: 'Victor'
  },

  // PUBLICATIONS & PLATFORMS
  {
    id: 'publication-lab-report',
    name: 'The Lab Report',
    ladder: 'PUBLICATION',
    vertical: 'Applied AI Publishing',
    summary: 'Weekly curated AI publication delivering practical tools, automation blueprints, and business strategy directly to operators.',
    status: 'RELEASED',
    currentPhase: 'PRODUCTION',
    targetAudience: 'Founders, Operators & Business Owners',
    pricing: { tier: 'FREE', amount: 0, billing: 'one-time' },
    channels: ['Direct'],
    deliveryAsset: 'OCG_Lab_Report_001_With_Share_Bar.html',
    productionUrl: 'https://theocgroup.github.io/ocg-lab-site/newsletter/',
    leadAgent: 'Nova'
  },
  {
    id: 'platform-ocg-lab-storefront',
    name: 'The OCG Lab Storefront & Site',
    ladder: 'PLATFORM',
    vertical: 'Technology Infrastructure',
    summary: 'Public web storefront, AI concierge, catalog administration, and client entitlement delivery engine.',
    status: 'PRODUCTION',
    currentPhase: 'PRODUCTION QA',
    targetAudience: 'Business Owners & Technical Buyers',
    pricing: { tier: 'MID', amount: 99, billing: 'monthly' },
    channels: ['Direct'],
    deliveryAsset: 'ocg-lab (React 19 / Vite)',
    productionUrl: 'http://localhost:5173',
    leadAgent: 'Aiden',
    featured: true
  }
];
