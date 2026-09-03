import { Product, PricingTier } from '../types';

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'distressed-property-finder',
    title: 'Distressed Property Finder',
    subtitle: 'Automated deal sourcing & distressed asset discovery engine',
    type: 'SaaS',
    outcomeCategory: 'Find Customers',
    iconName: 'Search',
    status: 'Published',
    summary: 'Continuously monitors county records, tax delinquencies, and off-market property distress signals to surface high-equity acquisition opportunities.',
    problemSolved: 'Acquisition teams spend 30+ hours per week manually searching parcel data and off-market leads.',
    intendedAudience: 'Real Estate Investors, Wholesalers, Acquisition Managers',
    expectedResult: 'Instantly identifies off-market sellers with verified equity and distress triggers.',
    howItWorks: [
      'Connect county assessor API data feeds.',
      'Apply automated 70% ARV distress scoring algorithm.',
      'Receive real-time lead alerts with owner contact details.'
    ],
    features: [
      'Automated daily county parcel data sync',
      'Distress scoring algorithm (Pre-foreclosure, Tax Delinquent, Vacant)',
      'Built-in skip tracing & contact enrichment',
      '1-click export to CRM or Deal Analyzer'
    ],
    whatsIncluded: [
      'Distressed Property Finder SaaS Access',
      'Up to 2,500 property lead exports / mo',
      'Standard CRM Webhook Integration',
      'Documentation & Quickstart Guide'
    ],
    integrations: ['Deal Analyzer', 'HubSpot', 'Podio', 'Zapier', 'Webhooks'],
    price: 297,
    billingModel: 'monthly',
    fulfillmentOptions: ['DIY', 'INSTALL IT FOR ME', 'MANAGED FOR YOU'],
    downloadUrl: '/downloads/distressed-property-finder-spec.pdf',
    specs: {
      language: 'TypeScript / Node.js',
      architecture: 'GCP Data Pipeline',
      deployment: 'Cloud Run',
      latency: '< 50ms API response'
    },
    techStack: ['Node.js', 'PostgreSQL', 'GCP', 'React'],
    featured: true
  },
  {
    id: 'deal-analyzer',
    title: 'Deal Analyzer',
    subtitle: 'Real-time deterministic commercial & residential underwriting engine',
    type: 'SaaS',
    outcomeCategory: 'Analyze Deals',
    iconName: 'Calculator',
    status: 'Published',
    summary: 'Rapid property valuation platform for 70% ARV basis, rehab budget stress testing, Cap Rates, and structured underwriting briefs.',
    problemSolved: 'Manual spreadsheet underwriting is slow, prone to formula errors, and hard to share with lenders.',
    intendedAudience: 'Acquisition Agents, Private Lenders, Fund Managers',
    expectedResult: 'Complete thorough deal underwriting in under 60 seconds with 100% math precision.',
    howItWorks: [
      'Input Purchase Price, Rehab Scope, and Monthly Rent.',
      'Deterministic engine calculates Cap Rate, Cash-on-Cash, and DSCR.',
      'Generate one-click PDF Underwriting Brief.'
    ],
    features: [
      'Deterministic math engine executed in sub-milliseconds',
      '70% ARV valuation basis and rehab budget stress testing',
      'Cap Rate, Cash-on-Cash Return, & DSCR coverage ratio calculation',
      'Professional PDF Underwriting Brief export'
    ],
    whatsIncluded: [
      'Deal Analyzer SaaS Application Access',
      'Unlimited saved deal underwriting briefs',
      'PDF Export Engine',
      'Standard Customer Support'
    ],
    integrations: ['Distressed Property Finder', 'Investor Acquisition System'],
    price: 99,
    billingModel: 'monthly',
    fulfillmentOptions: ['DIY', 'INSTALL IT FOR ME'],
    specs: {
      language: 'TypeScript / React 19',
      architecture: 'Client-side Math Engine',
      deployment: 'Vite SPA static build',
      latency: '< 1ms execution'
    },
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS', 'Recharts'],
    featured: true
  },
  {
    id: 'ai-acquisition-analyst',
    title: 'AI Acquisition Analyst',
    subtitle: 'Specialized AI worker for document synthesis & walkthrough inspection parsing',
    type: 'AI Worker',
    outcomeCategory: 'Analyze Deals',
    iconName: 'Bot',
    status: 'Published',
    summary: 'Domain-trained AI worker that parses walkthrough inspection photos, contractor scope bids, and seller disclosures into structured rehab budgets.',
    problemSolved: 'Reviewing 40-page inspection reports and contractor bid PDFs takes hours of manual effort.',
    intendedAudience: 'Real Estate Underwriters, Managing Directors, Rehab Managers',
    expectedResult: 'Automatically extracts repair itemization and attaches structural risk flags.',
    howItWorks: [
      'Upload inspection photos or contractor bid PDFs.',
      'AI worker categorizes repairs (Foundation, Roof, HVAC, Electrical).',
      'Exports verified repair scope directly into Deal Analyzer.'
    ],
    features: [
      'Multimodal photo inspection repair categorization',
      'Contractor bid PDF key-value line item extractor',
      'Automated structural risk flag detection',
      'Streaming commentary on deal viability'
    ],
    whatsIncluded: [
      'AI Acquisition Analyst Worker License',
      'Up to 500 document/photo inspection runs / mo',
      'Direct Deal Analyzer Integration',
      'Priority Support'
    ],
    integrations: ['Deal Analyzer', 'Google Drive', 'Dropbox', 'Email'],
    price: 149,
    billingModel: 'monthly',
    fulfillmentOptions: ['DIY', 'INSTALL IT FOR ME', 'MANAGED FOR YOU'],
    specs: {
      language: 'Python / TypeScript',
      architecture: 'Gemini Agent Framework',
      deployment: 'GCP Cloud Run',
      latency: 'Streaming (~80 tokens/sec)'
    },
    techStack: ['Gemini 3.6 Flash', 'Python', 'FastAPI', 'Node.js'],
    featured: true
  },
  {
    id: 'nova-operating-engine',
    title: 'Nova AI Operating Engine',
    subtitle: 'Custom AI Workforce & Business Operating Environment',
    type: 'AI Worker',
    outcomeCategory: 'Automate Operations',
    iconName: 'Sparkles',
    status: 'Published',
    summary: 'Central AI workforce coordinator managing incoming lead discovery, automated SLA timers, customer intake, and team escalation triggers.',
    problemSolved: 'Businesses lose qualified leads due to slow intake responses and unmonitored team SLAs.',
    intendedAudience: 'Business Owners, Service Companies, Operations Directors',
    expectedResult: 'Guarantees sub-15 minute lead engagement 24/7 with zero human burnout.',
    howItWorks: [
      'Connect inbound web forms, messaging, and emails.',
      'Nova AI agents qualify leads via progressive discovery.',
      'Triggers team SMS/email escalation if SLAs are breached.'
    ],
    features: [
      'Multi-agent role coordination (Receptionist, Qualifier, Estimator)',
      'Conversational progressive intake discovery',
      'Automated SLA timers & escalation alerts',
      'Seamless CRM & messaging integration'
    ],
    whatsIncluded: [
      'Nova AI Operating Engine Environment',
      '3 Configured AI Worker Roles',
      'SLA Tracker & SMS Alert Gateway',
      'Implementation Onboarding Session'
    ],
    integrations: ['Twilio', 'HubSpot', 'Slack', 'Gmail', 'Webhooks'],
    price: 199,
    billingModel: 'monthly',
    fulfillmentOptions: ['DIY', 'INSTALL IT FOR ME', 'DONE FOR YOU', 'MANAGED FOR YOU'],
    specs: {
      language: 'TypeScript / Python',
      architecture: 'Multi-Agent Framework',
      deployment: 'Dedicated Serverless Container',
      latency: 'Real-time'
    },
    techStack: ['Gemini 3.6', 'TypeScript', 'Node.js', 'PostgreSQL'],
    featured: true
  },
  {
    id: 'rental-roi-calculator-pro',
    title: 'Rental ROI Calculator Pro',
    subtitle: '10-year cash flow & property appreciation projection tool',
    type: 'Calculator',
    outcomeCategory: 'Analyze Deals',
    iconName: 'TrendingUp',
    status: 'Published',
    summary: 'Interactive financial modeling tool for projecting 10-year Net Operating Income (NOI), cumulative cash flows, Cap Rates, and DSCR ratios.',
    problemSolved: 'Investors lack fast visual charts to show private lenders projected 10-year returns.',
    intendedAudience: 'Rental Investors, Commercial Lenders, Property Managers',
    expectedResult: 'Generates dynamic multi-year cash flow charts for pitch decks and underwriting.',
    howItWorks: [
      'Enter purchase price, rent, financing terms, and op-ex reserve.',
      'Adjust annual rent growth and property appreciation sliders.',
      'Export interactive chart summary for investor decks.'
    ],
    features: [
      'Dynamic 10-year Recharts multi-bar visualizer',
      'Cap Rate & Debt Service Coverage Ratio (DSCR) stress testing',
      'Adjustable annual rent appreciation & inflation rates',
      'One-click summary copy to clipboard'
    ],
    whatsIncluded: [
      'Rental ROI Calculator Pro License',
      'Standalone web tool access',
      'Exportable financial data model',
      'Lifetime updates'
    ],
    integrations: ['Deal Analyzer', 'Excel Export'],
    price: 29,
    billingModel: 'one-time',
    fulfillmentOptions: ['DIY'],
    downloadUrl: '/downloads/rental-roi-calculator-pro.json',
    specs: {
      language: 'TypeScript / React',
      architecture: 'Client-side Math Engine',
      deployment: 'Vite SPA static build',
      latency: '< 1ms execution'
    },
    techStack: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS']
  },
  {
    id: 'seller-followup-workflow',
    title: 'Seller Follow-Up Workflow System',
    subtitle: 'Automated 14-day multi-touch prospect nurture sequence',
    type: 'Workflow',
    outcomeCategory: 'Close More Sales',
    iconName: 'Send',
    status: 'Published',
    summary: 'Prebuilt automated workflow system that nurtures off-market seller leads via scheduled SMS, email briefs, and phone callback reminders.',
    problemSolved: 'Over 60% of real estate deals are lost due to lack of systematic follow-up after initial offer.',
    intendedAudience: 'Wholesalers, Acquisition Reps, Sales Teams',
    expectedResult: 'Increases contract conversion rates by maintaining consistent, professional touchpoints.',
    howItWorks: [
      'Import prospect lead contact into the workflow engine.',
      'Triggers automated day 1, 3, 7, and 14 text & email follow-ups.',
      'Alerts agent immediately when seller responds.'
    ],
    features: [
      '14-day pre-written high-converting message sequence',
      'Automated SMS & email delivery schedules',
      'Stop-on-reply logic to prevent unwanted texts',
      'Agent mobile push notifications on lead reply'
    ],
    whatsIncluded: [
      'Complete Workflow Blueprint & JSON Package',
      'Pre-written SMS & Email Copy Templates',
      'Installation Guide & Webhook Setup',
      'Email Support'
    ],
    integrations: ['Twilio', 'SendGrid', 'Zapier', 'Make', 'HubSpot'],
    price: 397,
    billingModel: 'one-time',
    fulfillmentOptions: ['DIY', 'INSTALL IT FOR ME'],
    downloadUrl: '/downloads/seller-followup-workflow.zip',
    specs: {
      language: 'JSON / Webhook Engine',
      architecture: 'Event-Driven Workflow',
      deployment: 'Make / Zapier / Direct API',
      latency: 'Instant event trigger'
    },
    techStack: ['JSON', 'Webhooks', 'Twilio API']
  },
  {
    id: 'investor-acquisition-system',
    title: 'Investor Acquisition System',
    subtitle: 'Complete bundled ecosystem for real estate acquisition teams',
    type: 'Business System',
    outcomeCategory: 'Run My Business',
    iconName: 'Building2',
    status: 'Published',
    summary: 'All-in-one business system bundling Distressed Property Finder, Deal Analyzer, AI Acquisition Analyst, and Seller Follow-Up Workflow into one unified pipeline.',
    problemSolved: 'Managing fragmented separate software tools creates data silos and operational chaos.',
    intendedAudience: 'Acquisition Team Leads, Real Estate Fund Managers, Scaling Wholesalers',
    expectedResult: 'Unifies lead discovery, underwriting, AI photo synthesis, and seller follow-up into one seamless operating system.',
    howItWorks: [
      'Distressed Property Finder feeds leads into Deal Analyzer.',
      'AI Analyst parses walkthrough photos and bids.',
      'Seller Follow-Up Workflow automatically engages prospects.',
      'Managing Director monitors entire pipeline inside MY OCG.'
    ],
    features: [
      'Includes Distressed Property Finder + Deal Analyzer + AI Analyst + Follow-Up Workflow',
      'Unified MY OCG Command Center pipeline dashboard',
      'Custom CRM webhook routing & SLA escalation timers',
      'Dedicated installation & 1-on-1 onboarding session'
    ],
    whatsIncluded: [
      'Full Investor Acquisition System License',
      'All 4 Core System Applications Included',
      'Done-For-You Installation & Setup Included',
      'Priority 1-on-1 Support & Quarterly Strategy Reviews'
    ],
    integrations: ['All OCG Products', 'HubSpot', 'Podio', 'Google Workspace'],
    price: 597,
    billingModel: 'monthly',
    fulfillmentOptions: ['DONE FOR YOU', 'MANAGED FOR YOU'],
    specs: {
      language: 'Full-Stack TypeScript',
      architecture: 'Unified Microservices',
      deployment: 'GCP Private Instance',
      latency: '< 50ms'
    },
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Gemini 3.6'],
    featured: true
  },
  {
    id: 'workflow-installation-service',
    title: 'Workflow Installation & Setup',
    subtitle: 'White-glove technical installation & CRM integration service',
    type: 'Service',
    outcomeCategory: 'Automate Operations',
    iconName: 'Layers',
    status: 'Published',
    summary: 'The OCG Lab engineering team personally installs, configures, and tests your purchased OCG workflows and AI workers inside your company.',
    problemSolved: 'Business owners lack time to configure webhooks, API keys, and custom domain settings.',
    intendedAudience: 'Busy Founders, Managing Directors, Non-Technical Operators',
    expectedResult: 'Your new software/workflow is 100% installed, tested, and ready for your team in under 48 hours.',
    howItWorks: [
      'Submit your company CRM & API credentials securely.',
      'OCG engineers configure webhooks, triggers, and templates.',
      'We conduct live end-to-end testing and deliver video walkthrough.'
    ],
    features: [
      'Full white-glove technical setup by OCG Lab engineers',
      'API key & CRM webhook integration',
      'End-to-end workflow verification testing',
      '30-minute team training session & recorded video manual'
    ],
    whatsIncluded: [
      'White-Glove Installation Service',
      '48-Hour Delivery Guarantee',
      'Custom Video Operations Guide',
      '14-Day Post-Launch Support Warranty'
    ],
    integrations: ['All CRM & Workflow Systems'],
    price: 950,
    billingModel: 'one-time',
    fulfillmentOptions: ['DONE FOR YOU'],
    specs: {
      language: 'Engineering Service',
      architecture: 'Custom Implementation',
      deployment: 'Client Environment',
      latency: '48-Hour Turnaround'
    },
    techStack: ['APIs', 'Webhooks', 'CRM Integration']
  },
  {
    id: 'custom-ai-system-development',
    title: 'Custom AI System Development',
    subtitle: 'Tailored AI workforce & custom software application build',
    type: 'Service',
    outcomeCategory: 'Run My Business',
    iconName: 'Cpu',
    status: 'Published',
    summary: 'Custom engineering engagement where The OCG Lab builds a tailored AI workforce or software solution designed specifically for your business bottlenecks.',
    problemSolved: 'Off-the-shelf software doesn\'t match your proprietary business rules or specialized industry workflows.',
    intendedAudience: 'Trade Contractors, Service Agencies, Enterprises, Specialized Firms',
    expectedResult: 'A proprietary AI system owned by your company that automates your exact operational friction.',
    howItWorks: [
      'Discovery session with founder Genaro Ocasio & engineering team.',
      'Architecture design & custom AI agent prompt tuning.',
      'Full deployment on dedicated GCP instance with team training.'
    ],
    features: [
      'Tailored discovery of your current manual business friction',
      'Custom-trained AI agents configured with your business rules',
      'Private enterprise GCP hosting with strict data security',
      'Direct API integrations & custom reporting dashboards'
    ],
    whatsIncluded: [
      'Full Custom AI Architecture & Software Development',
      'Dedicated Project Manager & Founder Discovery Sessions',
      'Source Code & IP Rights Provisioning Options',
      '30-Day Post-Launch SLA Warranty'
    ],
    integrations: ['Custom Enterprise Stack'],
    price: 5000,
    billingModel: 'one-time',
    fulfillmentOptions: ['DONE FOR YOU', 'MANAGED FOR YOU'],
    specs: {
      language: 'Python / TypeScript',
      architecture: 'Enterprise Multi-Agent Pipeline',
      deployment: 'Dedicated Private GCP Cloud Run',
      latency: 'Real-time streaming'
    },
    techStack: ['Gemini 3.6', 'Python', 'React', 'PostgreSQL', 'Docker']
  },
  {
    id: 'sop-master-blueprint-kit',
    title: 'Standard Operating Procedure (SOP) Master Kit',
    subtitle: 'Standardized operational checklists & battle-tested playbooks',
    type: 'SOP Kit',
    outcomeCategory: 'Save Time',
    iconName: 'BookOpen',
    status: 'Published',
    summary: 'Turnkey operational playbooks and interactive checklists for real estate underwriting, lead intake SLA management, and walkthrough photo inspections.',
    problemSolved: 'New team hires require weeks of manual training due to unwritten operational procedures.',
    intendedAudience: 'Operations Managers, Team Leads, Onboarding Specialists',
    expectedResult: 'Reduces employee onboarding time by 75% with clear, auditable checklist steps.',
    howItWorks: [
      'Download SOP Markdown & interactive HTML checklists.',
      'Share links with new team hires or embed in company wiki.',
      'Track checklist execution status in real-time.'
    ],
    features: [
      '4 Complete Battle-Tested Operating Procedures',
      'Interactive HTML checklist steps with state persistence',
      'Print-ready PDF & Markdown versions',
      'Lifetime updates as OCG Lab refines playbooks'
    ],
    whatsIncluded: [
      'SOP Master Blueprint Kit Download Package',
      'Interactive HTML Reader Files',
      'Editable Word & Markdown Docs',
      'Team Distribution Rights'
    ],
    integrations: ['Notion', 'Google Docs', 'Company Wiki'],
    price: 49,
    billingModel: 'one-time',
    fulfillmentOptions: ['DIY'],
    downloadUrl: '/downloads/sop-master-blueprint-kit.zip',
    specs: {
      language: 'HTML / Markdown',
      architecture: 'Static Document Package',
      deployment: 'Instant Download',
      latency: 'Zero latency'
    },
    techStack: ['Markdown', 'HTML5', 'CSS3']
  }
];

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    title: 'Product Early Access',
    priceMonthly: 49,
    priceAnnual: 39,
    subtitle: 'Access approved OCG Lab software tools like Deal Analyzer and Nova Beta.',
    features: [
      'Access to Deal Analyzer & Nova Beta',
      'Standard product support & updates',
      'Join product-specific waitlists',
      'Subscription to The OCG Lab — AI Weekly'
    ],
    ctaText: 'Join Product Waitlist'
  },
  {
    id: 'custom-dev',
    title: 'Custom AI Workforce',
    priceMonthly: 299,
    priceAnnual: 249,
    subtitle: 'A dedicated custom AI system built specifically for your business operations.',
    badge: 'Most Popular',
    highlighted: true,
    features: [
      'Full AI project discovery with OCG Lab engineers',
      'Custom AI Workforce designed for your industry (Estimating, Leads, Intake)',
      'Integrations with your current software & CRM',
      'Continuous refinement & agent performance tuning',
      'Priority direct support & SLA guarantees'
    ],
    ctaText: 'Request Custom AI Project'
  },
  {
    id: 'enterprise',
    title: 'Enterprise AI Ecosystem',
    priceMonthly: 899,
    priceAnnual: 749,
    subtitle: 'Dedicated private cloud infrastructure, custom multi-agent suites, and full proving ground support.',
    features: [
      'Everything in Custom AI Workforce, plus:',
      'Private dedicated GCP Cloud Run instance',
      'Multi-department AI agent workforces',
      'Direct API integrations & custom data pipelines',
      'Founder discovery sessions with Genaro Ocasio'
    ],
    ctaText: 'Schedule Enterprise Discovery'
  }
];
