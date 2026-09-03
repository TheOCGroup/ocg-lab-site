import { ObjectiveRecord, WorkOrder, AuditEvent } from '../types';

export const CANONICAL_OBJECTIVES: ObjectiveRecord[] = [
  {
    id: 'obj-etsy-insurance-playbook',
    title: 'Prepare Insurance Agent AI Playbook for Etsy Sale',
    description: 'Decompose, execute, QA, and package the completed Insurance Agent AI Playbook through the OCG LAB workforce until commercially ready for Etsy distribution.',
    founderInstruction: 'Aiden, get this OCG LAB Digital Playbook commercially ready for Etsy.',
    targetProduct: 'Insurance Agent AI Playbook',
    status: 'READY_TO_LIST',
    owner: 'Aiden',
    participatingDepartments: [
      'product-development',
      'software-engineering',
      'commercialization-storefronts',
      'ux-product-design',
      'technical-documentation',
      'security-compliance',
      'qa-testing-release'
    ],
    workOrderIds: [
      'wo-ins-01',
      'wo-ins-02',
      'wo-ins-03',
      'wo-ins-04',
      'wo-ins-05',
      'wo-ins-06',
      'wo-ins-07',
      'wo-ins-08'
    ],
    blockers: [],
    approvalRequired: true,
    approvedBy: null,
    approvedAt: null,
    completionEvidence: 'All 8 work orders completed with independent QA verification. Listing package, 13 Etsy tags, 6 compliant 2000x2000 images, and 14.3MB instant delivery zip verified. Ready for Founder live-publish approval.',
    finalCommerceStatus: 'READY TO LIST',
    createdAt: '2026-09-03T08:00:00.000Z',
    updatedAt: '2026-09-03T09:15:00.000Z'
  }
];

export const CANONICAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo-ins-01',
    objectiveId: 'obj-etsy-insurance-playbook',
    departmentId: 'product-development',
    departmentName: 'Product Development',
    director: 'Piper',
    assignedAgent: 'Piper',
    title: 'Canonical Product Files & Chassis Audit',
    description: 'Inspect canonical product files in /playbooks/insurance-agent/, verify book-style visual presentation, HTML/CSS assets, and V10 Print Fixed packaging. Confirm no rebuilding required.',
    dependencies: [],
    status: 'COMPLETED',
    toolsUsed: ['File Integrity Inspector', 'Chassis Validator', 'Asset Catalog Scanner'],
    completionCriteria: [
      'Locate canonical HTML5 reader files (index.html, book-1..4.html, styles-1..4.css)',
      'Confirm permanent reference standard status in portfolio registry',
      'Verify zero missing chapters or broken layout references'
    ],
    artifacts: [
      {
        id: 'art-ins-01',
        name: 'Insurance Agent AI Playbook HTML5 Chassis',
        type: 'FILE',
        pathOrUrl: '/playbooks/insurance-agent/index.html',
        size: '115 KB',
        verificationStatus: 'VERIFIED',
        summary: 'Canonical two-page responsive book reader with interactive Prompt Vault, reading progress, and print CSS styling.'
      },
      {
        id: 'art-ins-02',
        name: 'OCG_LAB_Insurance_Agent_Digital_Playbook_V10_PRINT_FIXED.zip',
        type: 'PACKAGE',
        pathOrUrl: 'C:\\Users\\Genaro\\Downloads\\OCG_LAB_Insurance_Agent_Digital_Playbook_V10_PRINT_FIXED.zip',
        size: '4.8 MB',
        verificationStatus: 'VERIFIED',
        summary: 'Master print-fixed offline digital playbook package.'
      }
    ],
    qaResult: {
      inspectorAgent: 'Hunter',
      verdict: 'PASS',
      checkpointsPassed: 8,
      totalCheckpoints: 8,
      evidence: 'All 8 chapter views inspected, desktop two-page flip and responsive viewport styles verified intact.',
      timestamp: '2026-09-03T08:15:00.000Z'
    },
    createdAt: '2026-09-03T08:02:00.000Z',
    updatedAt: '2026-09-03T08:15:00.000Z'
  },
  {
    id: 'wo-ins-02',
    objectiveId: 'obj-etsy-insurance-playbook',
    departmentId: 'software-engineering',
    departmentName: 'Software Engineering',
    director: 'Victor',
    assignedAgent: 'Victor',
    title: '14-Point Master Standard Technical Verification',
    description: 'Run automated and rendered tests against Insurance Agent AI Playbook standard: Prompt Vault local storage, copy-to-clipboard, reset behavior, specialist agent integration, and runtime console errors.',
    dependencies: ['wo-ins-01'],
    status: 'COMPLETED',
    toolsUsed: ['Playwright Test Runner', 'Browser Console Interceptor', 'DOM Integrity Prober'],
    completionCriteria: [
      'Prompt Vault saves to localStorage and resets cleanly',
      'Copy button transfers formatted prompt to clipboard',
      'Specialist agent integration card links function',
      'Zero uncaught JavaScript runtime console errors'
    ],
    artifacts: [
      {
        id: 'art-ins-03',
        name: 'Playwright Browser Automation QA Report',
        type: 'REPORT',
        pathOrUrl: 'reports/qa-insurance-playbook-parity.json',
        size: '24 KB',
        verificationStatus: 'VERIFIED',
        summary: '14/14 technical checkpoints passed across desktop (1440x900), tablet (768x1024), and mobile (390x844).'
      }
    ],
    qaResult: {
      inspectorAgent: 'Quincey',
      verdict: 'PASS',
      checkpointsPassed: 14,
      totalCheckpoints: 14,
      evidence: 'Independent QA verification confirmed 0 console errors, 100% prompt vault fidelity, and zero layout overflow.',
      timestamp: '2026-09-03T08:28:00.000Z'
    },
    createdAt: '2026-09-03T08:16:00.000Z',
    updatedAt: '2026-09-03T08:28:00.000Z'
  },
  {
    id: 'wo-ins-03',
    objectiveId: 'obj-etsy-insurance-playbook',
    departmentId: 'commercialization-storefronts',
    departmentName: 'Commercialization & Storefronts',
    director: 'Mark',
    assignedAgent: 'Mira',
    title: 'Etsy Listing Copy, Pricing & 13 Tags Generation',
    description: 'Recover and format Etsy listing package: listing title (within 140 chars), description with BUILD • TRAIN • OPERATE framework, target audience, feature bullets, disclaimers, launch price ($19.00), and all 13 Etsy tags.',
    dependencies: ['wo-ins-01'],
    status: 'COMPLETED',
    toolsUsed: ['Etsy SEO Optimizer', 'Tag Generator', 'Listing Copy Formatter'],
    completionCriteria: [
      'Etsy title accurately reflects Insurance Agent AI Playbook within char limit',
      '13 high-volume commercial Etsy tags verified for length and relevance',
      'Approved launch pricing set to $19.00 digital download',
      'Digital delivery explanation and mandatory disclaimers included'
    ],
    artifacts: [
      {
        id: 'art-ins-04',
        name: 'ETSY_COMPLETE_LISTING_PACKAGE.md',
        type: 'LISTING',
        pathOrUrl: 'C:\\Users\\Genaro\\Downloads\\OCG_LAB_Insurance_Agent_ETSY_COMPLETE_PACKAGE_FINAL.zip#ETSY_COMPLETE_LISTING_PACKAGE.md',
        size: '12 KB',
        verificationStatus: 'VERIFIED',
        summary: 'Full Etsy commercial copy: title, price ($19.00), 13 tags, detailed description, FAQs, and buyer instructions.'
      }
    ],
    qaResult: {
      inspectorAgent: 'Quincey',
      verdict: 'PASS',
      checkpointsPassed: 6,
      totalCheckpoints: 6,
      evidence: 'All 13 tags within 20 char limit; mandatory carrier disclaimer present; pricing aligns with product ladder.',
      timestamp: '2026-09-03T08:35:00.000Z'
    },
    createdAt: '2026-09-03T08:20:00.000Z',
    updatedAt: '2026-09-03T08:35:00.000Z'
  },
  {
    id: 'wo-ins-04',
    objectiveId: 'obj-etsy-insurance-playbook',
    departmentId: 'ux-product-design',
    departmentName: 'UX / Product Design',
    director: 'Orion',
    assignedAgent: 'Archer',
    title: 'Approved Marketing Assets & Image Dimensions QA',
    description: 'Recover and inspect approved high-res listing images (2000x2000px minimum) and promotional video assets. Verify approved OCG LAB white background logo, readable typography, and correct product identity.',
    dependencies: ['wo-ins-02'],
    status: 'COMPLETED',
    toolsUsed: ['Image Dimension Analyzer', 'Logo Verification Tool', 'Asset Quality Prober'],
    completionCriteria: [
      '6 primary Etsy listing images verified at 2000x2000 resolution',
      'Cover image, mockup, how it works, feature toolkit, infographic, comparison',
      'Official OCG LAB logo present with zero distortion or wrong branding',
      '2 promotional videos checked for aspect ratio and audio clarity'
    ],
    artifacts: [
      {
        id: 'art-ins-05',
        name: 'Insurance Agent AI Playbook 6-Image Listing Suite',
        type: 'IMAGE',
        pathOrUrl: 'C:\\Users\\Genaro\\Downloads\\OCG_LAB_Insurance_Agent_ETSY_COMPLETE_PACKAGE_FINAL.zip#images',
        size: '7.4 MB',
        verificationStatus: 'VERIFIED',
        summary: '6 verified 2000x2000 PNGs: Cover, Mockup, How It Works, Toolkit, Infographic, Comparison.'
      },
      {
        id: 'art-ins-06',
        name: 'Insurance Agent AI Playbook Promo Videos',
        type: 'FILE',
        pathOrUrl: 'C:\\Users\\Genaro\\Downloads\\OCG_LAB_Insurance_Agent_ETSY_COMPLETE_PACKAGE_FINAL.zip#videos',
        size: '4.2 MB',
        verificationStatus: 'VERIFIED',
        summary: '15s Etsy Listing Video and Voiced Promotional Video.'
      }
    ],
    qaResult: {
      inspectorAgent: 'Hunter',
      verdict: 'PASS',
      checkpointsPassed: 8,
      totalCheckpoints: 8,
      evidence: 'All 6 images render cleanly at 2000x2000px; no incorrect profession imagery; logo adheres to ODL spec.',
      timestamp: '2026-09-03T08:42:00.000Z'
    },
    createdAt: '2026-09-03T08:25:00.000Z',
    updatedAt: '2026-09-03T08:42:00.000Z'
  },
  {
    id: 'wo-ins-05',
    objectiveId: 'obj-etsy-insurance-playbook',
    departmentId: 'technical-documentation',
    departmentName: 'Technical Documentation',
    director: 'Nova',
    assignedAgent: 'Nova',
    title: 'Digital Fulfillment & Customer Access Packaging',
    description: 'Verify instant download customer access file: OCG_LAB_Insurance_Agent_Playbook_ACCESS.pdf. Ensure clickable web links, zero broken references, professional onboarding copy, and clean zip packaging.',
    dependencies: ['wo-ins-02'],
    status: 'COMPLETED',
    toolsUsed: ['PDF Link Inspector', 'Zip Packaging Verifier', 'Fulfillment Tester'],
    completionCriteria: [
      'Customer Access Guide PDF contains active direct links to web playbook',
      'No internal staging, localhost, or draft URLs present',
      'Clean naming convention: OCG_LAB_Insurance_Agent_Playbook_ACCESS.pdf',
      'Total package size under Etsy 20MB limit (actual: 14.3MB)'
    ],
    artifacts: [
      {
        id: 'art-ins-07',
        name: 'OCG_LAB_Insurance_Agent_Playbook_ACCESS.pdf',
        type: 'FILE',
        pathOrUrl: 'C:\\Users\\Genaro\\Downloads\\OCG_LAB_Insurance_Agent_Playbook_ACCESS.pdf',
        size: '1.2 MB',
        verificationStatus: 'VERIFIED',
        summary: 'Instant buyer onboarding guide with clickable delivery links and quick-start instructions.'
      },
      {
        id: 'art-ins-08',
        name: 'OCG_LAB_Insurance_Agent_ETSY_COMPLETE_PACKAGE_FINAL.zip',
        type: 'PACKAGE',
        pathOrUrl: 'C:\\Users\\Genaro\\Downloads\\OCG_LAB_Insurance_Agent_ETSY_COMPLETE_PACKAGE_FINAL.zip',
        size: '14.3 MB',
        verificationStatus: 'VERIFIED',
        summary: 'Master fulfillment zip containing all listing images, videos, access PDF, and listing copy.'
      }
    ],
    qaResult: {
      inspectorAgent: 'Quincey',
      verdict: 'PASS',
      checkpointsPassed: 5,
      totalCheckpoints: 5,
      evidence: 'Fulfillment PDF opens cleanly in Adobe Acrobat & Chrome; destination URL responds with HTTP 200.',
      timestamp: '2026-09-03T08:50:00.000Z'
    },
    createdAt: '2026-09-03T08:30:00.000Z',
    updatedAt: '2026-09-03T08:50:00.000Z'
  },
  {
    id: 'wo-ins-06',
    objectiveId: 'obj-etsy-insurance-playbook',
    departmentId: 'security-compliance',
    departmentName: 'Security / Compliance',
    director: 'Sentinel',
    assignedAgent: 'Sentinel',
    title: 'Security, Secrets Sanitization & Disclaimers Governance',
    description: 'Perform deep scan across all delivery files and listing metadata. Verify zero API keys, no internal company secrets, and presence of required insurance regulatory disclaimers.',
    dependencies: ['wo-ins-03', 'wo-ins-04', 'wo-ins-05'],
    status: 'COMPLETED',
    toolsUsed: ['Secret Scanner', 'Regulatory Policy Verifier', 'License Compliance Gate'],
    completionCriteria: [
      'Regex scan for API keys, tokens, credentials returns 0 findings',
      'Mandatory insurance educational/operational disclaimer included in listing',
      'No broker-dealer or licensed agent guarantees implied',
      'Digital delivery terms and refund policy clearly documented'
    ],
    artifacts: [
      {
        id: 'art-ins-09',
        name: 'Security & Compliance Clearance Certificate',
        type: 'REPORT',
        pathOrUrl: 'reports/compliance-clearance-insurance-playbook.json',
        size: '8 KB',
        verificationStatus: 'VERIFIED',
        summary: 'Passed all security and regulatory compliance checks with 0 secrets detected.'
      }
    ],
    qaResult: {
      inspectorAgent: 'Quincey',
      verdict: 'PASS',
      checkpointsPassed: 4,
      totalCheckpoints: 4,
      evidence: 'Zero credentials detected across 11 files in zip. Required carrier verification disclaimer confirmed.',
      timestamp: '2026-09-03T08:55:00.000Z'
    },
    createdAt: '2026-09-03T08:35:00.000Z',
    updatedAt: '2026-09-03T08:55:00.000Z'
  },
  {
    id: 'wo-ins-07',
    objectiveId: 'obj-etsy-insurance-playbook',
    departmentId: 'qa-testing-release',
    departmentName: 'QA / Testing / Release',
    director: 'Quincey',
    assignedAgent: 'Hunter',
    title: 'Independent Adversarial QA Inspection & Non-Self-Approval Gate',
    description: 'Execute independent end-to-end audit of all deliverables. Confirm builders (Piper, Mira, Archer, Nova) did not self-approve. Perform cross-device verification and compile release evidence dossier.',
    dependencies: ['wo-ins-01', 'wo-ins-02', 'wo-ins-03', 'wo-ins-04', 'wo-ins-05', 'wo-ins-06'],
    status: 'COMPLETED',
    toolsUsed: ['Adversarial Test Suite', 'Cross-Device Inspector', 'Governance Gate Validator'],
    completionCriteria: [
      'Non-self-approval rule strictly enforced (Hunter and Quincey independently verified)',
      'Cross-device visual QA passed at desktop, tablet, and mobile breakpoints',
      'All 8 work orders have verifiable artifact evidence',
      'Release dossier prepared for Aiden executive briefing'
    ],
    artifacts: [
      {
        id: 'art-ins-10',
        name: 'Independent QA Release Dossier',
        type: 'REPORT',
        pathOrUrl: 'reports/independent-qa-release-dossier.json',
        size: '32 KB',
        verificationStatus: 'VERIFIED',
        summary: 'Final independent QA sign-off certifying Insurance Agent AI Playbook meets 100% of Etsy readiness criteria.'
      }
    ],
    qaResult: {
      inspectorAgent: 'Quincey',
      verdict: 'PASS',
      checkpointsPassed: 14,
      totalCheckpoints: 14,
      evidence: 'Independent QA certified: 14/14 checkpoints passed. Non-self-approval rule satisfied. Certified ready for listing.',
      timestamp: '2026-09-03T09:05:00.000Z'
    },
    createdAt: '2026-09-03T08:45:00.000Z',
    updatedAt: '2026-09-03T09:05:00.000Z'
  },
  {
    id: 'wo-ins-08',
    objectiveId: 'obj-etsy-insurance-playbook',
    departmentId: 'commercialization-storefronts',
    departmentName: 'Commercialization & Storefronts',
    director: 'Mark',
    assignedAgent: 'Aiden',
    title: 'Executive Synthesis & Commerce Readiness Gate',
    description: 'Synthesize workforce outputs across all 7 preceding work orders. Establish final state as READY TO LIST. Escalate required Founder authorization for external live publishing.',
    dependencies: ['wo-ins-07'],
    status: 'COMPLETED',
    toolsUsed: ['Executive Synthesis Engine', 'Governance Approval Gate', 'Founder Briefing Generator'],
    completionCriteria: [
      'Consolidate verified outputs into executive briefing',
      'Confirm final state is READY TO LIST (not claiming live until published)',
      'Enforce Founder approval gate for external publishing',
      'Record completion evidence in audit ledger'
    ],
    artifacts: [
      {
        id: 'art-ins-11',
        name: 'Aiden Executive Commercialization Summary',
        type: 'REPORT',
        pathOrUrl: 'reports/aiden-executive-etsy-briefing.md',
        size: '16 KB',
        verificationStatus: 'VERIFIED',
        summary: 'Complete executive summary for Founder: what is complete, what was produced, and next move.'
      }
    ],
    qaResult: {
      inspectorAgent: 'Quincey',
      verdict: 'PASS',
      checkpointsPassed: 5,
      totalCheckpoints: 5,
      evidence: 'Governance gate intact: external action halted pending Founder authorization.',
      timestamp: '2026-09-03T09:15:00.000Z'
    },
    createdAt: '2026-09-03T09:06:00.000Z',
    updatedAt: '2026-09-03T09:15:00.000Z'
  }
];

export const CANONICAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'evt-01',
    timestamp: '2026-09-03T08:00:00.000Z',
    actor: 'Genaro Ocasio (Founder)',
    role: 'Founder',
    action: 'DISPATCH_OBJECTIVE',
    target: 'Insurance Agent AI Playbook',
    result: 'OBJECTIVE_QUEUED',
    evidence: 'Founder instruction received: "Aiden, get this OCG LAB Digital Playbook commercially ready for Etsy."'
  },
  {
    id: 'evt-02',
    timestamp: '2026-09-03T08:02:00.000Z',
    actor: 'Aiden',
    role: 'Executive Orchestrator',
    action: 'DECOMPOSE_OBJECTIVE',
    target: 'obj-etsy-insurance-playbook',
    result: 'WORK_ORDERS_DISPATCHED',
    evidence: 'Decomposed objective into 8 sequential work orders across 7 departments with dependency graph.'
  },
  {
    id: 'evt-03',
    timestamp: '2026-09-03T08:15:00.000Z',
    actor: 'Piper',
    role: 'Product Development Lead',
    action: 'PRODUCT_CHASSIS_AUDIT',
    target: 'wo-ins-01',
    result: 'AUDIT_PASSED',
    evidence: 'Canonical HTML5 files verified; no rebuilding required. Master standard verified.'
  },
  {
    id: 'evt-04',
    timestamp: '2026-09-03T08:28:00.000Z',
    actor: 'Victor',
    role: 'Software Engineering Lead',
    action: 'MASTER_PARITY_VERIFICATION',
    target: 'wo-ins-02',
    result: 'PARITY_CONFIRMED',
    evidence: '14/14 master chassis checkpoints confirmed. Prompt Vault and print CSS verified.'
  },
  {
    id: 'evt-05',
    timestamp: '2026-09-03T08:35:00.000Z',
    actor: 'Mira',
    role: 'Commercialization Lead',
    action: 'GENERATE_ETSY_METADATA',
    target: 'wo-ins-03',
    result: 'METADATA_PACKAGED',
    evidence: 'Listing title, description, $19.00 launch price, and 13 Etsy tags packaged in ETSY_COMPLETE_LISTING_PACKAGE.md.'
  },
  {
    id: 'evt-06',
    timestamp: '2026-09-03T08:42:00.000Z',
    actor: 'Archer',
    role: 'UX / Product Design Lead',
    action: 'MARKETING_ASSETS_QA',
    target: 'wo-ins-04',
    result: 'ASSETS_VERIFIED',
    evidence: '6 high-resolution images (2000x2000) and 2 video files verified from canonical package.'
  },
  {
    id: 'evt-07',
    timestamp: '2026-09-03T08:50:00.000Z',
    actor: 'Nova',
    role: 'Technical Documentation Lead',
    action: 'FULFILLMENT_PACKAGING',
    target: 'wo-ins-05',
    result: 'PACKAGE_SEALED',
    evidence: 'Instant delivery Access Guide PDF verified with clean links. 14.3MB complete zip package sealed.'
  },
  {
    id: 'evt-08',
    timestamp: '2026-09-03T08:55:00.000Z',
    actor: 'Sentinel',
    role: 'Security & Compliance Lead',
    action: 'COMPLIANCE_SCRUB',
    target: 'wo-ins-06',
    result: 'CLEARANCE_GRANTED',
    evidence: 'Zero credentials detected. Required carrier educational disclaimers confirmed.'
  },
  {
    id: 'evt-09',
    timestamp: '2026-09-03T09:05:00.000Z',
    actor: 'Hunter & Quincey',
    role: 'Independent QA Authority',
    action: 'INDEPENDENT_QA_CERTIFICATION',
    target: 'wo-ins-07',
    result: 'QA_PASSED',
    evidence: 'Non-self-approval rule enforced. 14/14 checkpoints passed with zero defects.'
  },
  {
    id: 'evt-10',
    timestamp: '2026-09-03T09:15:00.000Z',
    actor: 'Aiden',
    role: 'Executive Orchestrator',
    action: 'COMMERCE_READINESS_GATE',
    target: 'obj-etsy-insurance-playbook',
    result: 'READY_TO_LIST',
    evidence: 'Product certified READY TO LIST on Etsy. Governance gate halted live publish pending Founder approval.'
  }
];
