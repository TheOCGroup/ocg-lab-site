import { AgentRecord, AgentTaskRun } from '../types';

export const AGENTS_DATA: AgentRecord[] = [
  {
    id: 'agent-aiden',
    name: 'Aiden',
    role: 'Chief Orchestrator & AI Systems Architect',
    departmentId: 'ai-agent-engineering',
    status: 'ACTIVE',
    specialty: 'Orchestrating multi-agent workforces, resolving founder commands, synthesizing company context, and enforcing architectural integrity.',
    skills: [
      'Natural Language Command Resolution',
      'Cross-Department Coordination',
      'Blocker Identification & Escalation',
      'System Health & Dependency Mapping',
      'Autonomy Policy Enforcement'
    ],
    tools: ['Capability Gateway', 'Knowledge Layer', 'Agent Task Queue', 'Release Validator'],
    assignedProjects: ['proj-ocg-lab-os', 'proj-lab-site-launch', 'proj-leadflow-ai-pro'],
    currentTask: 'Consolidating canonical OCG LAB OS workspace and verifying Phase 1-5 execution gates',
    executionStats: {
      totalRuns: 142,
      passCount: 142,
      failCount: 0,
      lastEvidence: 'Successfully audited workstation and mapped all canonical TheOCGroup repositories',
      lastActiveTimestamp: 'Just now'
    }
  },
  {
    id: 'agent-victor',
    name: 'Victor',
    role: 'Lead Underwriter & Software Engineer',
    departmentId: 'software-engineering',
    status: 'ACTIVE',
    specialty: 'Deterministic financial math, 70% ARV valuation formulas, Cap Rate/DSCR computations, and SQLite database integrity.',
    skills: [
      'Deterministic Math Underwriting',
      'Database Schema Enforcement',
      'API Route Hardening',
      'MAO & Rehab Budget Modeling',
      'Contract Assignment Valuation'
    ],
    tools: ['node:sqlite', 'Calculator Engine', 'Underwriting Studio', 'Schema Validator'],
    assignedProjects: ['proj-rei-ai-pro', 'calc-brrrr', 'calc-fix-flip', 'calc-rental', 'calc-wholesaler'],
    currentTask: 'Verifying mathematical precision of client-side calculator engines',
    executionStats: {
      totalRuns: 89,
      passCount: 89,
      failCount: 0,
      lastEvidence: 'Schema migrations 001-007 and Victor analysis contracts verified 100% compliant',
      lastActiveTimestamp: '5m ago'
    }
  },
  {
    id: 'agent-piper',
    name: 'Piper',
    role: 'Product Development & Relationship Intelligence Lead',
    departmentId: 'product-development',
    status: 'ACTIVE',
    specialty: '16-stage product lifecycle management, master Digital Playbook standardization, and seller follow-up intelligence.',
    skills: [
      'Digital Playbook Chassis Architecture',
      '8 Operational Seller Status Derivation',
      '6 Executive Follow-Up Queues',
      'Response Drafting with Human Approval Gates',
      'Prompt Vault Engineering'
    ],
    tools: ['Playbook Router', 'Prompt Vault', 'Follow-Up Queue Engine', 'Draft Workbench'],
    assignedProjects: ['proj-insurance-playbook', 'proj-pipeline-piper'],
    currentTask: 'Maintaining Insurance Agent AI Playbook as the master standard across all product families',
    executionStats: {
      totalRuns: 154,
      passCount: 154,
      failCount: 0,
      lastEvidence: 'PIPER release certification tests passed 154/154 test assertions (100% green)',
      lastActiveTimestamp: '12m ago'
    }
  },
  {
    id: 'agent-hunter',
    name: 'Hunter',
    role: 'Lead QA Engineer & Deal Sourcing Specialist',
    departmentId: 'qa-testing-release',
    status: 'ACTIVE',
    specialty: 'Independent adversarial QA testing, failure-path inspection, cross-device layout verification, and county parcel data evaluation.',
    skills: [
      '14-Point Release Certification Protocol',
      'Playwright & End-to-End Test Authoring',
      'Adversarial Failure Injection',
      'Console Error Interception',
      'Skip Tracing Verification'
    ],
    tools: ['Playwright Test Runner', 'Release Gate Evaluator', 'HTTP Probe Engine', 'Console Monitor'],
    assignedProjects: ['proj-ocg-lab-os', 'proj-lab-site-launch'],
    currentTask: 'Enforcing independent QA sign-off gates prior to any release certification',
    executionStats: {
      totalRuns: 67,
      passCount: 65,
      failCount: 2,
      lastEvidence: 'Caught 2 missing placeholder parameters in intake transaction; verified fix committed',
      lastActiveTimestamp: '18m ago'
    }
  },
  {
    id: 'agent-nova',
    name: 'Nova',
    role: 'Creative Engine & Technical Documentation Lead',
    departmentId: 'technical-documentation',
    status: 'ACTIVE',
    specialty: 'Multimedia generation workflows, publication synthesis, developer documentation, and video onboarding scripts.',
    skills: [
      'AI Media Synthesis (OpenArt, Higgsfield)',
      'The Lab Report Publication Authoring',
      'Video Filming Schedule Generation',
      'Markdown & Technical Manual Authoring',
      'Multi-Format Content Repurposing'
    ],
    tools: ['OCG Creative Services', 'Markdown Engine', 'Video Script Generator', 'Email Publisher'],
    assignedProjects: ['proj-nova-media', 'publication-lab-report'],
    currentTask: 'Curating Issue #002 of The Lab Report and updating implementation walkthroughs',
    executionStats: {
      totalRuns: 53,
      passCount: 53,
      failCount: 0,
      lastEvidence: 'NOVA engine Cloud Run deployment verified live with 6 HTTP 200 routes',
      lastActiveTimestamp: '25m ago'
    }
  },
  {
    id: 'agent-archer',
    name: 'Archer',
    role: 'Lead UX / Product Designer',
    departmentId: 'ux-product-design',
    status: 'ACTIVE',
    specialty: 'OCG Design Language (ODL) Quiet Room spec, dark-mode glassmorphism tokens, and responsive mobile interfaces.',
    skills: [
      'ODL Design System Tokens',
      'Tailwind CSS & Glassmorphism Design',
      'Micro-Interactions & Motion Transitions',
      'Mobile Touch Target Ergonomics',
      'Two-Page Book Chassis Layout'
    ],
    tools: ['ODL Token Library', 'Figma Exporter', 'Tailwind Compiler', 'CSS Audit Tool'],
    assignedProjects: ['proj-ocg-lab-os', 'playbook-roofing'],
    currentTask: 'Refining OCG LAB OS Quiet Room dark glass navigation and operational telemetry cards',
    executionStats: {
      totalRuns: 44,
      passCount: 44,
      failCount: 0,
      lastEvidence: 'Validated CSS backdrop filters and responsive breakpoint transitions across all pages',
      lastActiveTimestamp: '30m ago'
    }
  },
  {
    id: 'agent-atlas',
    name: 'Atlas',
    role: 'Infrastructure & Cloud Operations Lead',
    departmentId: 'infrastructure-devops',
    status: 'ACTIVE',
    specialty: 'Google Cloud Platform, Cloud Run container deployments, Vercel edge networks, and rigorous cloud cost governance.',
    skills: [
      'Docker Containerization',
      'Google Cloud Build & Cloud Run',
      'Vercel Project & DNS Management',
      'Zero-Cost Cloud Architecture',
      'Uptime Monitoring & Rollback Paths'
    ],
    tools: ['gcloud CLI', 'Cloud Run API', 'Docker Engine', 'Cost Audit Monitor'],
    assignedProjects: ['proj-ocg-lab-os', 'proj-nova-media'],
    currentTask: 'Monitoring serverless latency and verifying zero recurring cost policies',
    executionStats: {
      totalRuns: 38,
      passCount: 38,
      failCount: 0,
      lastEvidence: 'Confirmed zero unauthorized new cloud projects or billing line items created',
      lastActiveTimestamp: '45m ago'
    }
  },
  {
    id: 'agent-sentinel',
    name: 'Sentinel',
    role: 'Security & Compliance Officer',
    departmentId: 'security-compliance',
    status: 'ACTIVE',
    specialty: 'Hard Do-Not-Contact (DNC) enforcement, secrets sanitation, RBAC authorization, and append-only audit logging.',
    skills: [
      'Absolute DNC Suppression Verification',
      'Environment Secret Leak Scanning',
      'Append-Only Audit Event Verification',
      'Human-in-the-Loop Gate Enforcement',
      'Data Provenance Lineage Tracking'
    ],
    tools: ['Secret Scanner', 'Audit Logger', 'DNC Guardrail Filter', 'RBAC Evaluator'],
    assignedProjects: ['proj-ocg-lab-os', 'proj-pipeline-piper'],
    currentTask: 'Ensuring zero sensitive credentials appear in public client bundles or git logs',
    executionStats: {
      totalRuns: 31,
      passCount: 31,
      failCount: 0,
      lastEvidence: 'Verified all API keys stored in environment variables, placeholders in examples',
      lastActiveTimestamp: '1h ago'
    }
  },
  {
    id: 'agent-mira',
    name: 'Mira',
    role: 'Commercialization & Conversion Intelligence Lead',
    departmentId: 'commercialization-storefronts',
    status: 'ACTIVE',
    specialty: 'Multi-channel storefront operations, Whop/Etsy listing optimization, checkout funnel analytics, and delivery link validation.',
    skills: [
      'Whop & Etsy Listing Asset Packaging',
      'Instant Download Delivery Verification',
      'Pricing Model Elasticity Analysis',
      'Checkout Webhook Integration',
      'Customer Onboarding Flow Verification'
    ],
    tools: ['Whop API', 'Etsy Listing Manager', 'Asset Packager', 'Funnel Telemetry'],
    assignedProjects: ['proj-whop-storefront'],
    currentTask: 'Auditing instant-delivery download links for all 8 launch-ready SKUs',
    executionStats: {
      totalRuns: 29,
      passCount: 29,
      failCount: 0,
      lastEvidence: 'Verified OCG_LAB_Combined_Etsy_Listing_Pack.zip integrity and PDF access guides',
      lastActiveTimestamp: '1h ago'
    }
  },
  {
    id: 'agent-allie',
    name: 'Allie',
    role: 'Specialist AI Concierge (Wedding & Destination)',
    departmentId: 'client-solutions',
    status: 'ACTIVE',
    specialty: 'Multi-vendor negotiation, destination wedding itinerary scheduling, guest RSVP concierge, and budget reconciliation.',
    skills: [
      'Guest Inquiry Parsing',
      'Vendor Contract Briefing',
      'Destination Timeline Generation',
      'Budget Stress Testing',
      'VIP Concierge Protocol'
    ],
    tools: ['Wedding Concierge Engine', 'PDF Access Guide Builder', 'Vendor Matrix'],
    assignedProjects: ['proj-wedding-concierge'],
    currentTask: 'Serving certified v6.8 release on canonical GitHub pages',
    executionStats: {
      totalRuns: 42,
      passCount: 42,
      failCount: 0,
      lastEvidence: 'Allie v6.8 18-part payload certified passing on GitHub Pages',
      lastActiveTimestamp: '2h ago'
    }
  }
];

export const INITIAL_TASK_RUNS: AgentTaskRun[] = [
  {
    id: 'run-101',
    taskId: 'task-audit-01',
    agentId: 'agent-aiden',
    agentName: 'Aiden',
    taskName: 'Workstation & GitHub Forensic Takeover Audit',
    status: 'COMPLETED',
    initiatedBy: 'GENARO',
    startTime: '2026-09-02T20:18:34Z',
    endTime: '2026-09-02T20:34:00Z',
    toolsUsed: ['File Scanner', 'GitHub CLI', 'Process Manager'],
    approvalsRequired: false,
    evidence: 'Discovered canonical scratch/ocg-lab repository, recovered 8 GitHub repositories, and cataloged 50 commercial products in Downloads.',
    errorLog: undefined
  },
  {
    id: 'run-102',
    taskId: 'task-build-02',
    agentId: 'agent-hunter',
    agentName: 'Hunter',
    taskName: 'Clean TypeScript Production Build Verification',
    status: 'COMPLETED',
    initiatedBy: 'AIDEN',
    startTime: '2026-09-02T20:33:25Z',
    endTime: '2026-09-02T20:33:38Z',
    toolsUsed: ['tsc', 'vite build'],
    approvalsRequired: false,
    evidence: 'Vite v6.4.3 production build finished in 5.87s with 2001 modules transformed and 0 errors.',
    errorLog: undefined
  },
  {
    id: 'run-103',
    taskId: 'task-auth-03',
    agentId: 'agent-sentinel',
    agentName: 'Sentinel',
    taskName: 'Zero Unauthorized Cost & Credentials Verification',
    status: 'COMPLETED',
    initiatedBy: 'AIDEN',
    startTime: '2026-09-02T20:35:10Z',
    endTime: '2026-09-02T20:36:00Z',
    toolsUsed: ['Secret Scanner', 'Cost Policy Engine'],
    approvalsRequired: false,
    evidence: 'Zero cloud instances spun up, zero recurring subscriptions added, existing infrastructure preserved.',
    errorLog: undefined
  },
  {
    id: 'run-104',
    taskId: 'task-storefront-04',
    agentId: 'agent-mira',
    agentName: 'Mira',
    taskName: 'Etsy & Whop Complete Listing Pack Verification',
    status: 'RUNNING',
    initiatedBy: 'AIDEN',
    startTime: '2026-09-02T20:37:00Z',
    toolsUsed: ['Asset Packager', 'Zip Verifier'],
    approvalsRequired: true,
    approvedBy: 'Genaro Ocasio',
    evidence: 'Auditing OCG_LAB_Insurance_Agent_ETSY_COMPLETE_PACKAGE_FINAL.zip (14.3MB) for instant fulfillment compatibility.',
    errorLog: undefined
  }
];
