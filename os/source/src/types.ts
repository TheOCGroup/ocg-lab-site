export type OperatingArea = 
  | 'command'
  | 'portfolio'
  | 'projects'
  | 'agents'
  | 'operations'
  | 'engineering'
  | 'qa'
  | 'releases'
  | 'infrastructure'
  | 'security'
  | 'product-studio'
  | 'storefronts'
  | 'client-solutions'
  | 'knowledge'
  | 'rd'
  // Public & commercial storefront tabs
  | 'home'
  | 'storefront'
  | 'my-ocg'
  | 'admin'
  | 'about'
  | 'resources'
  | 'pricing'
  | 'contact';

export type Page = OperatingArea;

export type DepartmentId = 
  | 'ai-agent-engineering'
  | 'software-engineering'
  | 'product-development'
  | 'innovation-rd'
  | 'ux-product-design'
  | 'infrastructure-devops'
  | 'qa-testing-release'
  | 'security-compliance'
  | 'data-knowledge-intelligence'
  | 'commercialization-storefronts'
  | 'client-solutions'
  | 'technical-documentation';

export interface Department {
  id: DepartmentId;
  number: number;
  name: string;
  director: string;
  leadAgent: string;
  coreMission: string;
  activeProjects: number;
  kpiHeadline: string;
  iconName: string;
}

export type ExecutionStatus = 
  | 'PROPOSED'
  | 'APPROVED'
  | 'QUEUED'
  | 'ASSIGNED'
  | 'EXECUTING'
  | 'WAITING'
  | 'BLOCKED'
  | 'QA'
  | 'CORRECTION_REQUIRED'
  | 'READY_TO_LIST'
  | 'COMPLETED'
  | 'FAILED';

export type CommerceStatus = 
  | 'READY TO LIST'
  | 'BLOCKED'
  | 'NEEDS FOUNDER APPROVAL'
  | 'IN PROGRESS'
  | 'LIVE';

export interface OperatingArtifact {
  id: string;
  name: string;
  type: 'FILE' | 'IMAGE' | 'COPY' | 'LISTING' | 'REPORT' | 'PACKAGE' | 'URL';
  pathOrUrl: string;
  size?: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  summary: string;
  metadata?: Record<string, any>;
}

export interface WorkOrderQaResult {
  inspectorAgent: string;
  verdict: 'PASS' | 'REJECT' | 'VERIFY';
  checkpointsPassed: number;
  totalCheckpoints: number;
  evidence: string;
  timestamp: string;
}

export interface WorkOrder {
  id: string;
  objectiveId: string;
  departmentId: DepartmentId;
  departmentName: string;
  director: string;
  assignedAgent: string;
  title: string;
  description: string;
  dependencies: string[];
  status: ExecutionStatus;
  toolsUsed: string[];
  completionCriteria: string[];
  artifacts: OperatingArtifact[];
  qaResult: WorkOrderQaResult | null;
  errorLog?: string;
  correctionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ObjectiveRecord {
  id: string;
  title: string;
  description: string;
  founderInstruction: string;
  targetProduct: string;
  status: ExecutionStatus;
  owner: string;
  participatingDepartments: DepartmentId[];
  workOrderIds: string[];
  blockers: string[];
  approvalRequired: boolean;
  approvedBy: string | null;
  approvedAt: string | null;
  completionEvidence: string | null;
  finalCommerceStatus: CommerceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  result: string;
  evidence: string;
}


export type CanonicalStatus = 
  | 'DISCOVERED'
  | 'RECOVERED'
  | 'SPECIFIED'
  | 'DESIGNED'
  | 'BUILDING'
  | 'BLOCKED'
  | 'TESTING'
  | 'QA FAILED'
  | 'QA PASSED'
  | 'PREVIEW'
  | 'PRODUCTION'
  | 'RELEASED'
  | 'PAUSED'
  | 'ARCHIVED';

export type CommercialLadder = 
  | 'PLAYBOOK'
  | 'AI PRO'
  | 'AI SUPER PRO'
  | 'TOOLKITS';

export type ProductPipelineStage = 
  | 'IDEA'
  | 'RESEARCH'
  | 'VALIDATION'
  | 'SPECIFICATION'
  | 'DESIGN'
  | 'BUILD'
  | 'INTERNAL QA'
  | 'INDEPENDENT QA'
  | 'FIX'
  | 'RETEST'
  | 'PREVIEW'
  | 'PRODUCTION'
  | 'PRODUCTION QA'
  | 'RELEASE'
  | 'COMMERCIALIZATION'
  | 'PERFORMANCE / LEARNING';

export interface ProjectRecord {
  id: string;
  name: string;
  productSystem: string;
  owningCompany: string; // 'OCG LAB'
  productCategory: CommercialLadder | 'INTERNAL OS' | 'CALCULATOR' | 'TOOL' | 'PUBLICATION' | 'PLATFORM';
  customerUser: string;
  objective: string;
  status: CanonicalStatus;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  currentPhase: ProductPipelineStage;
  completionPercent: number;
  sourceRepository: string;
  activeBranch: string;
  latestCommit: string;
  database: string;
  deployment: string;
  productionUrl: string;
  assignedAgents: string[];
  dependencies: string[];
  blockers: string[];
  acceptanceCriteria: string[];
  qaStatus: 'NOT TESTED' | 'TESTING' | 'QA FAILED' | 'QA PASSED';
  securityStatus: 'UNAUDITED' | 'IN REVIEW' | 'CERTIFIED';
  latestVerifiedOutput: string;
  nextAction: string;
  releaseStatus: 'NOT RELEASED' | 'PREVIEW' | 'STAGED' | 'RELEASE CERTIFIED';
  isBench?: boolean;
  benchSlot?: number;
  whyItMatters?: string;
  notes?: string;
}

export interface AgentRecord {
  id: string;
  name: string;
  role: string;
  departmentId: DepartmentId;
  status: 'IDLE' | 'ACTIVE' | 'STANDBY' | 'BLOCKED' | 'PAUSED';
  specialty: string;
  skills: string[];
  tools: string[];
  assignedProjects: string[];
  currentTask?: string;
  executionStats: {
    totalRuns: number;
    passCount: number;
    failCount: number;
    lastEvidence?: string;
    lastActiveTimestamp?: string;
  };
}

export interface AgentTaskRun {
  id: string;
  taskId: string;
  agentId: string;
  agentName: string;
  taskName: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'HALTED';
  initiatedBy: 'GENARO' | 'AIDEN' | 'SCHEDULE' | 'EVENT';
  startTime: string;
  endTime?: string;
  toolsUsed: string[];
  approvalsRequired: boolean;
  approvedBy?: string;
  evidence: string;
  errorLog?: string;
}

export interface ReleaseCertification {
  id: string;
  projectId: string;
  projectName: string;
  canonicalRepo: string;
  targetBranch: string;
  commitSha: string;
  productionDeployment: string;
  deploymentId: string;
  publicProductionUrl: string;
  httpSuccessStatus: boolean;
  appVersion: string;
  criticalWorkflowVerified: boolean;
  crossDeviceVerified: boolean;
  integrationsVerified: boolean;
  zeroConsoleErrors: boolean;
  envVarsConfirmed: boolean;
  rollbackPathDocumented: boolean;
  qaPassEvidence: string;
  certifiedDate?: string;
  certifiedBy?: string;
  isReleased: boolean;
}

export interface DecisionRecord {
  id: string;
  title: string;
  why: string;
  date: string;
  scope: string;
}

export interface ExperimentRecord {
  id: string;
  name: string;
  problem: string;
  who: string;
  idea: string;
  why: string;
  notes: string;
  createdDate: string;
  stage: 'INCUBATOR';
}

export interface SharedCapability {
  id: string;
  name: string;
  type: 'GATEWAY' | 'KNOWLEDGE' | 'CREATIVE' | 'SUPER_AGENT_CORE';
  description: string;
  status: 'ACTIVE' | 'DEVELOPMENT' | 'INTEGRATED';
  providers: string[];
  fallbackStrategy: string;
  healthMetrics: string;
}

export interface StorefrontItem {
  id: string;
  productId: string;
  productName: string;
  channel: 'Whop' | 'Etsy' | 'Direct' | 'Bundle';
  listingTitle: string;
  price: number;
  status: 'Draft' | 'Ready' | 'Live' | 'Sold Out';
  fulfillmentUrl: string;
  listingAssetPack: string;
  orderCount: number;
  deliveryFormat: string;
}

export interface ClientSolutionRecord {
  id: string;
  clientName: string;
  systemName: string;
  vertical: string;
  status: CanonicalStatus;
  deliveryDate: string;
  accessUrl: string;
  leadAgent: string;
  summary: string;
}

export type OutcomeCategory = 
  | 'All Outcomes'
  | 'Find Customers'
  | 'Close More Sales'
  | 'Automate Operations'
  | 'Analyze Deals'
  | 'Create Content'
  | 'Manage Customers'
  | 'Save Time'
  | 'Run My Business';

export type ProductType = 
  | 'SaaS'
  | 'Micro-SaaS'
  | 'AI Worker'
  | 'Workflow'
  | 'Automation Pack'
  | 'Connector'
  | 'Calculator'
  | 'Dashboard'
  | 'AI Assessment'
  | 'Template'
  | 'SOP Kit'
  | 'AI Prompt System'
  | 'Business System'
  | 'Service'
  | 'Licensing'
  | 'Membership';

export type FulfillmentOption = 
  | 'DIY'
  | 'INSTALL IT FOR ME'
  | 'DONE FOR YOU'
  | 'MANAGED FOR YOU';

export type ProductStatus = 'Published' | 'Draft' | 'Coming Soon' | 'Private' | 'Archived';

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  type: ProductType;
  outcomeCategory: OutcomeCategory;
  iconName: string;
  status: ProductStatus;
  summary: string;
  problemSolved: string;
  intendedAudience: string;
  expectedResult: string;
  howItWorks: string[];
  features: string[];
  whatsIncluded: string[];
  integrations: string[];
  requirements?: string[];
  price: number;
  billingModel: 'one-time' | 'monthly' | 'annual' | 'custom';
  fulfillmentOptions: FulfillmentOption[];
  downloadUrl?: string;
  category?: string;
  specs: {
    language: string;
    architecture: string;
    deployment: string;
    latency: string;
  };
  techStack: string[];
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedFulfillment: FulfillmentOption;
  quantity: number;
}

export interface Entitlement {
  id: string;
  productId: string;
  productTitle: string;
  productType: ProductType;
  fulfillmentOption: FulfillmentOption;
  purchaseDate: string;
  status: 'Active' | 'Pending Installation' | 'Expired';
  licenseKey?: string;
  accessUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: {
    productTitle: string;
    productType: ProductType;
    price: number;
    fulfillmentOption: FulfillmentOption;
  }[];
  totalAmount: number;
  status: 'Completed' | 'Processing' | 'Refunded';
}

export interface SOPItem {
  id: string;
  code: string;
  title: string;
  category: 'Underwriting' | 'Operations' | 'AI & Automation' | 'Growth';
  readingTime: string;
  lastUpdated: string;
  summary: string;
  checklistItems: string[];
  sections: {
    title: string;
    content: string;
  }[];
}

export interface PricingTier {
  id: string;
  title: string;
  priceMonthly: number;
  priceAnnual: number;
  subtitle: string;
  badge?: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  category: 'General Inquiry' | 'Product Demo' | 'Custom Enterprise System' | 'Technical Support';
  phone?: string;
  message: string;
}

export interface SupportTicket {
  ticketRef: string;
  timestamp: string;
  category: string;
  status: 'Queued for Evaluation' | 'Assigned' | 'In Review';
}

export interface UnderwritingInputs {
  purchasePrice: number;
  rehabCost: number;
  monthlyRent: number;
  downPaymentPercent: number;
  interestRate: number;
  opExPercent: number;
}

export interface YearlyProjection {
  year: number;
  noi: number;
  annualCashFlow: number;
  cumulativeCashFlow: number;
  propertyValue: number;
}

export interface UnderwritingOutputs {
  totalInvestment: number;
  loanAmount: number;
  downPayment: number;
  monthlyDebtService: number;
  grossAnnualIncome: number;
  annualOpEx: number;
  netOperatingIncome: number;
  annualPreTaxCashFlow: number;
  capRate: number;
  cashOnCashReturn: number;
  dscr: number;
  multiYearProjections: YearlyProjection[];
}
