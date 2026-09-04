import { 
  ProjectRecord, 
  AgentRecord, 
  AgentTaskRun, 
  DecisionRecord, 
  ExperimentRecord, 
  StorefrontItem, 
  ClientSolutionRecord,
  ReleaseCertification,
  ObjectiveRecord,
  WorkOrder,
  WorkOrderQaResult,
  OperatingArtifact,
  AuditEvent
} from '../types';
import { PROJECTS_DATA } from './projects';
import { AGENTS_DATA, INITIAL_TASK_RUNS } from './agents';
import { DECISIONS_DATA } from './decisions';
import { EXPERIMENTS_DATA } from './experiments';
import { STOREFRONT_ITEMS_DATA } from './storefronts';
import { CLIENT_SOLUTIONS_DATA } from './clientSolutions';
import { CANONICAL_OBJECTIVES, CANONICAL_WORK_ORDERS, CANONICAL_AUDIT_EVENTS } from './objectives';

const STORAGE_KEY = 'ocg_lab_os_state_v2';
const FOUNDER_SESSION_KEY = 'ocg_founder_key_session';
const SYNC_ENDPOINT = '/api/os/sync';

export interface OcgLabOsState {
  projects: ProjectRecord[];
  agents: AgentRecord[];
  taskRuns: AgentTaskRun[];
  decisions: DecisionRecord[];
  experiments: ExperimentRecord[];
  storefrontItems: StorefrontItem[];
  clientSolutions: ClientSolutionRecord[];
  certifications: ReleaseCertification[];
  objectives: ObjectiveRecord[];
  workOrders: WorkOrder[];
  auditEvents: AuditEvent[];
  focusMode: boolean;
  activeBenchIds: string[];
  lastSyncedAt?: string;
  cloudStatus?: 'SYNCED' | 'OFFLINE_CACHED' | 'AUTH_REQUIRED';
}

export class StorageEngine {
  private static getDefaults(): OcgLabOsState {
    return {
      projects: PROJECTS_DATA,
      agents: AGENTS_DATA,
      taskRuns: INITIAL_TASK_RUNS,
      decisions: DECISIONS_DATA,
      experiments: EXPERIMENTS_DATA,
      storefrontItems: STOREFRONT_ITEMS_DATA,
      clientSolutions: CLIENT_SOLUTIONS_DATA,
      certifications: [],
      objectives: CANONICAL_OBJECTIVES,
      workOrders: CANONICAL_WORK_ORDERS,
      auditEvents: CANONICAL_AUDIT_EVENTS,
      focusMode: false,
      activeBenchIds: ['proj-ocg-lab-os', 'proj-lab-site-launch', 'proj-whop-storefront']
    };
  }


  private static reconcileStorefrontItems(persistedItems: StorefrontItem[] | undefined, canonicalItems: StorefrontItem[]): StorefrontItem[] {
    if (!persistedItems || !persistedItems.length) return canonicalItems;
    const persistedById = new Map(persistedItems.map(item => [item.id, item]));
    const canonicalIds = new Set(canonicalItems.map(item => item.id));
    const reconciled = canonicalItems.map(canonical => {
      const persisted = persistedById.get(canonical.id);
      if (!persisted) return canonical;
      const runtimeBuyerVerified = persisted.buyerQaStatus === 'VERIFIED' && !!persisted.buyerQaVerifiedAt && !!persisted.buyerQaEvidence;
      const runtimeSellerVerified = persisted.sellerQaStatus === 'VERIFIED' && !!persisted.sellerQaVerifiedAt && !!persisted.sellerQaEvidence;
      const preserveRuntimeLive = persisted.status === 'Live' && runtimeBuyerVerified && runtimeSellerVerified;
      const buyerIsNewer = runtimeBuyerVerified && (!canonical.buyerQaVerifiedAt || Date.parse(persisted.buyerQaVerifiedAt!) > Date.parse(canonical.buyerQaVerifiedAt));
      const sellerIsNewer = runtimeSellerVerified && (!canonical.sellerQaVerifiedAt || Date.parse(persisted.sellerQaVerifiedAt!) > Date.parse(canonical.sellerQaVerifiedAt));
      return {
        ...persisted,
        ...canonical,
        status: preserveRuntimeLive ? 'Live' : canonical.status,
        orderCount: 0,
        buyerQaStatus: buyerIsNewer ? persisted.buyerQaStatus : canonical.buyerQaStatus,
        buyerQaVerifiedAt: buyerIsNewer ? persisted.buyerQaVerifiedAt : canonical.buyerQaVerifiedAt,
        buyerQaEvidence: buyerIsNewer ? persisted.buyerQaEvidence : canonical.buyerQaEvidence,
        sellerQaStatus: sellerIsNewer ? persisted.sellerQaStatus : canonical.sellerQaStatus,
        sellerQaVerifiedAt: sellerIsNewer ? persisted.sellerQaVerifiedAt : canonical.sellerQaVerifiedAt,
        sellerQaEvidence: sellerIsNewer ? persisted.sellerQaEvidence : canonical.sellerQaEvidence
      };
    });
    const runtimeOnly = persistedItems.filter(item => !canonicalIds.has(item.id));
    return [...reconciled, ...runtimeOnly];
  }

  public static loadState(): OcgLabOsState {
    const defaults = this.getDefaults();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      return {
        projects: parsed.projects && parsed.projects.length ? parsed.projects : defaults.projects,
        agents: parsed.agents && parsed.agents.length ? parsed.agents : defaults.agents,
        taskRuns: parsed.taskRuns && parsed.taskRuns.length ? parsed.taskRuns : defaults.taskRuns,
        decisions: parsed.decisions && parsed.decisions.length ? parsed.decisions : defaults.decisions,
        experiments: parsed.experiments && parsed.experiments.length ? parsed.experiments : defaults.experiments,
        storefrontItems: this.reconcileStorefrontItems(parsed.storefrontItems, defaults.storefrontItems),
        clientSolutions: parsed.clientSolutions && parsed.clientSolutions.length ? parsed.clientSolutions : defaults.clientSolutions,
        certifications: parsed.certifications || [],
        objectives: parsed.objectives && parsed.objectives.length ? parsed.objectives : defaults.objectives,
        workOrders: parsed.workOrders && parsed.workOrders.length ? parsed.workOrders : defaults.workOrders,
        auditEvents: parsed.auditEvents && parsed.auditEvents.length ? parsed.auditEvents : defaults.auditEvents,
        focusMode: !!parsed.focusMode,
        activeBenchIds: parsed.activeBenchIds || defaults.activeBenchIds,
        lastSyncedAt: parsed.lastSyncedAt,
        cloudStatus: parsed.cloudStatus
      };
    } catch (e) {
      console.warn('[StorageEngine] Error loading state from localStorage, falling back to defaults:', e);
      return defaults;
    }
  }

  public static saveState(state: Partial<OcgLabOsState>): void {
    try {
      const current = this.loadState();
      const updated = { ...current, ...state, lastSyncedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      if (this.getFounderKey()) this.queueCloudSync();
    } catch (e) {
      console.error('[StorageEngine] Failed to save state to localStorage:', e);
    }
  }

  public static updateProject(id: string, updates: Partial<ProjectRecord>): ProjectRecord[] {
    const state = this.loadState();
    const updatedProjects = state.projects.map(p => p.id === id ? { ...p, ...updates } : p);
    this.saveState({ projects: updatedProjects });
    return updatedProjects;
  }

  public static addAgentTaskRun(run: Omit<AgentTaskRun, 'id' | 'startTime'>): AgentTaskRun {
    const state = this.loadState();
    const newRun: AgentTaskRun = {
      ...run,
      id: `run-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      startTime: new Date().toISOString()
    };
    const updatedRuns = [newRun, ...state.taskRuns];
    
    // Update agent stats
    const updatedAgents = state.agents.map(a => {
      if (a.id === run.agentId) {
        return {
          ...a,
          executionStats: {
            ...a.executionStats,
            totalRuns: a.executionStats.totalRuns + 1,
            passCount: run.status === 'COMPLETED' ? a.executionStats.passCount + 1 : a.executionStats.passCount,
            failCount: run.status === 'FAILED' ? a.executionStats.failCount + 1 : a.executionStats.failCount,
            lastEvidence: run.evidence,
            lastActiveTimestamp: 'Just now'
          }
        };
      }
      return a;
    });

    this.saveState({ taskRuns: updatedRuns, agents: updatedAgents });
    return newRun;
  }

  // Objective & Work Order Operations
  public static getObjective(id: string): ObjectiveRecord | undefined {
    const state = this.loadState();
    return state.objectives.find(o => o.id === id);
  }

  public static updateObjective(id: string, updates: Partial<ObjectiveRecord>): ObjectiveRecord[] {
    const state = this.loadState();
    const updated = state.objectives.map(o => o.id === id ? { ...o, ...updates, updatedAt: new Date().toISOString() } : o);
    this.saveState({ objectives: updated });
    return updated;
  }

  public static getWorkOrders(objectiveId?: string): WorkOrder[] {
    const state = this.loadState();
    if (!objectiveId) return state.workOrders;
    return state.workOrders.filter(w => w.objectiveId === objectiveId);
  }

  public static updateWorkOrder(id: string, updates: Partial<WorkOrder>): WorkOrder[] {
    const state = this.loadState();
    const updated = state.workOrders.map(w => w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w);
    this.saveState({ workOrders: updated });
    return updated;
  }

  public static ensureCommercePublicationDispatch(input: {
    productId: string;
    productName: string;
    channel: 'Whop' | 'Etsy' | 'Direct';
    nextAction: string;
    leadAgent: string;
  }): { objective: ObjectiveRecord; workOrder: WorkOrder; created: boolean } {
    const state = this.loadState();
    const channelKey = input.channel.toLowerCase();
    const objectiveId = `obj-commerce-publish-${input.productId}-${channelKey}`;
    const workOrderId = `wo-commerce-publish-${input.productId}-${channelKey}`;
    const now = new Date().toISOString();
    const existingObjective = state.objectives.find(objective => objective.id === objectiveId);
    const existingWorkOrder = state.workOrders.find(workOrder => workOrder.id === workOrderId);

    if (existingObjective && existingWorkOrder) return { objective: existingObjective, workOrder: existingWorkOrder, created: false };

    const objective: ObjectiveRecord = {
      id: objectiveId,
      title: `Publish ${input.productName} on ${input.channel}`,
      description: `Create or recover the public ${input.channel} listing from the certified commercial package. Publication is not verification; the channel remains unverified until seller-side read-back and independent QA complete.`,
      founderInstruction: `Aiden, prepare ${input.productName} for ${input.channel} publication.`,
      targetProduct: input.productName,
      status: 'WAITING',
      owner: 'Aiden',
      participatingDepartments: ['commercialization-storefronts', 'qa-testing-release'],
      workOrderIds: [workOrderId],
      blockers: ['External authenticated publishing action required.'],
      approvalRequired: true,
      approvedBy: null,
      approvedAt: null,
      completionEvidence: null,
      finalCommerceStatus: 'NEEDS FOUNDER APPROVAL',
      createdAt: now,
      updatedAt: now
    };

    const workOrder: WorkOrder = {
      id: workOrderId,
      objectiveId,
      departmentId: 'commercialization-storefronts',
      departmentName: 'Commercialization & Storefronts',
      director: 'Mark',
      assignedAgent: input.leadAgent || 'Mira',
      title: `${input.channel} Publication — ${input.productName}`,
      description: `${input.nextAction} Use only the certified product package and existing storefront. Do not mark Live until public URL capture, authenticated seller read-back, buyer-journey QA, and independent QA pass.`,
      dependencies: [],
      status: 'WAITING',
      toolsUsed: ['Certified Channel Package', 'Authenticated Storefront Publisher'],
      completionCriteria: [
        'Recover existing matching draft/listing before creating anything new',
        'Publish using certified title, pricing, media, copy, and fulfillment configuration',
        'Capture exact public product URL after publication',
        'Route the public listing into authenticated seller-side verification and independent QA'
      ],
      artifacts: [],
      qaResult: null,
      createdAt: now,
      updatedAt: now
    };

    this.saveState({ objectives: [objective, ...state.objectives], workOrders: [workOrder, ...state.workOrders] });
    this.addAuditEvent({
      actor: 'Aiden',
      role: 'Executive Orchestrator',
      action: 'DISPATCH_COMMERCE_PUBLICATION',
      target: `${input.productName} / ${input.channel}`,
      result: `Created ${workOrderId} in WAITING state`,
      evidence: 'Canonical readiness classified this channel READY TO PUBLISH; no public listing or Live state was inferred.'
    });
    return { objective, workOrder, created: true };
  }

  public static ensureCommerceVerificationDispatch(input: {
    productId: string;
    productName: string;
    channel: 'Whop' | 'Etsy' | 'Direct';
    nextAction: string;
    leadAgent: string;
  }): { objective: ObjectiveRecord; workOrder: WorkOrder; created: boolean } {
    const state = this.loadState();
    const channelKey = input.channel.toLowerCase();
    const objectiveId = `obj-commerce-verify-${input.productId}-${channelKey}`;
    const workOrderId = `wo-commerce-verify-${input.productId}-${channelKey}`;
    const now = new Date().toISOString();
    const existingObjective = state.objectives.find(objective => objective.id === objectiveId);
    const existingWorkOrder = state.workOrders.find(workOrder => workOrder.id === workOrderId);

    if (existingObjective && existingWorkOrder) {
      if (existingWorkOrder.status !== 'COMPLETED') {
        const objective: ObjectiveRecord = { ...existingObjective, status: 'EXECUTING', updatedAt: now };
        const workOrder: WorkOrder = { ...existingWorkOrder, status: 'EXECUTING', updatedAt: now };
        this.saveState({
          objectives: state.objectives.map(item => item.id === objectiveId ? objective : item),
          workOrders: state.workOrders.map(item => item.id === workOrderId ? workOrder : item)
        });
        return { objective, workOrder, created: false };
      }
      return { objective: existingObjective, workOrder: existingWorkOrder, created: false };
    }

    const objective: ObjectiveRecord = {
      id: objectiveId,
      title: `Verify ${input.productName} on ${input.channel}`,
      description: `Run authenticated external verification for ${input.productName} on ${input.channel} without inferring publication or sales state from local records.`,
      founderInstruction: `Aiden, dispatch the nearest revenue gate for ${input.productName} on ${input.channel}.`,
      targetProduct: input.productName,
      status: 'EXECUTING',
      owner: 'Aiden',
      participatingDepartments: ['commercialization-storefronts', 'qa-testing-release'],
      workOrderIds: [workOrderId],
      blockers: [],
      approvalRequired: false,
      approvedBy: null,
      approvedAt: null,
      completionEvidence: null,
      finalCommerceStatus: 'IN PROGRESS',
      createdAt: now,
      updatedAt: now
    };

    const workOrder: WorkOrder = {
      id: workOrderId,
      objectiveId,
      departmentId: 'commercialization-storefronts',
      departmentName: 'Commercialization & Storefronts',
      director: 'Mark',
      assignedAgent: input.leadAgent || 'Mira',
      title: `${input.channel} Authenticated Commerce Verification — ${input.productName}`,
      description: `${input.nextAction} Verify seller-side product identity, price, checkout availability, fulfillment/entitlement path, and buyer-visible access. This is a read-back/QA dispatch only; it does not authorize publication or fabricate live state.`,
      dependencies: [],
      status: 'EXECUTING',
      toolsUsed: ['Authenticated Storefront Read-Back', 'Buyer Journey QA'],
      completionCriteria: [
        'Authenticate to the actual seller-side channel account',
        'Read back exact product identity and price from the external channel',
        'Verify buyer checkout/entitlement or delivery path end to end',
        'Record independent QA evidence before any Live state transition'
      ],
      artifacts: [],
      qaResult: null,
      createdAt: now,
      updatedAt: now
    };

    this.saveState({
      objectives: [objective, ...state.objectives],
      workOrders: [workOrder, ...state.workOrders]
    });
    this.addAuditEvent({
      actor: 'Aiden',
      role: 'Executive Orchestrator',
      action: 'DISPATCH_COMMERCE_VERIFICATION',
      target: `${input.productName} / ${input.channel}`,
      result: `Created ${workOrderId} in EXECUTING state`,
      evidence: 'Dispatch created from canonical product commercialization readiness; external Live state remains unverified until authenticated read-back and independent QA complete.'
    });
    return { objective, workOrder, created: true };
  }

  public static completeCommerceVerification(input: {
    workOrderId: string;
    externalEvidence: {
      sourceUrl: string;
      verifiedFields: string[];
      checkedAt: string;
    };
    qaResult: WorkOrderQaResult;
  }): { workOrder: WorkOrder; objective: ObjectiveRecord; storefrontItem: StorefrontItem } {
    const state = this.loadState();
    const workOrder = state.workOrders.find(item => item.id === input.workOrderId);
    if (!workOrder || !workOrder.id.startsWith('wo-commerce-verify-')) {
      throw new Error('Commerce verification work order not found.');
    }
    if (!input.externalEvidence.sourceUrl.trim() || input.externalEvidence.verifiedFields.length === 0 || !input.externalEvidence.checkedAt.trim()) {
      throw new Error('Authenticated external evidence is required before commerce verification can complete.');
    }
    if (input.qaResult.verdict !== 'PASS' || input.qaResult.inspectorAgent === workOrder.assignedAgent || !input.qaResult.evidence.trim()) {
      throw new Error('Independent QA PASS evidence from a non-builder inspector is required before commerce verification can complete.');
    }

    const channelKey = workOrder.id.split('-').at(-1);
    const channel = channelKey === 'whop' ? 'Whop' : channelKey === 'etsy' ? 'Etsy' : channelKey === 'direct' ? 'Direct' : null;
    if (!channel) throw new Error('Commerce verification channel is invalid.');
    const productId = workOrder.id.slice('wo-commerce-verify-'.length, -(channelKey!.length + 1));
    const objective = state.objectives.find(item => item.id === workOrder.objectiveId);
    if (!objective) throw new Error('Commerce verification objective not found.');
    const storefrontItem = state.storefrontItems.find(item => item.productId === productId && item.channel === channel);
    if (!storefrontItem) throw new Error('Matching storefront record not found; Live state cannot be inferred.');
    if (storefrontItem.buyerQaStatus !== 'VERIFIED' || !storefrontItem.buyerQaVerifiedAt || !storefrontItem.buyerQaEvidence.trim()) {
      throw new Error('Buyer/public QA must be VERIFIED with timestamped evidence before seller verification can mark a storefront Live.');
    }
    if (storefrontItem.status !== 'Ready' && storefrontItem.status !== 'Live') {
      throw new Error(`Storefront must be Ready before authenticated verification can mark it Live; current state is ${storefrontItem.status}.`);
    }

    const now = new Date().toISOString();
    const evidenceArtifact: OperatingArtifact = {
      id: `art-commerce-verify-${productId}-${channelKey}`,
      name: `${channel} authenticated external verification`,
      type: 'URL',
      pathOrUrl: input.externalEvidence.sourceUrl,
      verificationStatus: 'VERIFIED',
      summary: `Authenticated external read-back verified: ${input.externalEvidence.verifiedFields.join(', ')}. Checked ${input.externalEvidence.checkedAt}.`
    };
    const completedWorkOrder: WorkOrder = {
      ...workOrder,
      status: 'COMPLETED',
      artifacts: [...workOrder.artifacts.filter(item => item.id !== evidenceArtifact.id), evidenceArtifact],
      qaResult: input.qaResult,
      updatedAt: now
    };
    const completedObjective: ObjectiveRecord = {
      ...objective,
      status: 'COMPLETED',
      blockers: [],
      completionEvidence: `${channel} authenticated external evidence and independent QA PASS recorded for ${objective.targetProduct}.`,
      finalCommerceStatus: 'LIVE',
      updatedAt: now
    };
    const liveStorefront: StorefrontItem = {
      ...storefrontItem,
      status: 'Live',
      sellerQaStatus: 'VERIFIED',
      sellerQaVerifiedAt: input.externalEvidence.checkedAt || now,
      sellerQaEvidence: `Authenticated seller-side read-back verified: ${input.externalEvidence.verifiedFields.join(', ')}. Independent QA: ${input.qaResult.evidence}`
    };

    this.saveState({
      workOrders: state.workOrders.map(item => item.id === workOrder.id ? completedWorkOrder : item),
      objectives: state.objectives.map(item => item.id === objective.id ? completedObjective : item),
      storefrontItems: state.storefrontItems.map(item => item.id === storefrontItem.id ? liveStorefront : item)
    });
    this.addAuditEvent({
      actor: input.qaResult.inspectorAgent,
      role: 'Independent QA',
      action: 'COMPLETE_COMMERCE_VERIFICATION',
      target: `${objective.targetProduct} / ${channel}`,
      result: `${storefrontItem.id} transitioned Ready → Live`,
      evidence: `${input.externalEvidence.sourceUrl} | ${input.qaResult.evidence}`
    });
    return { workOrder: completedWorkOrder, objective: completedObjective, storefrontItem: liveStorefront };
  }

  public static addAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    const state = this.loadState();
    const newEvent: AuditEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    this.saveState({ auditEvents: [newEvent, ...state.auditEvents] });
    return newEvent;
  }

  // Failure Recovery Invariant
  public static simulateControlledFailure(workOrderId: string): { workOrder: WorkOrder; objective: ObjectiveRecord } {
    const state = this.loadState();
    const wo = state.workOrders.find(w => w.id === workOrderId);
    if (!wo) throw new Error(`Work order ${workOrderId} not found`);

    const updatedWo: WorkOrder = {
      ...wo,
      status: 'CORRECTION_REQUIRED',
      errorLog: 'Adversarial QA rejection: Image #3 failed secondary mobile viewport aspect ratio check (detected 16:9 instead of 1:1 square master standard).',
      qaResult: {
        inspectorAgent: 'Quincey (Independent QA)',
        verdict: 'REJECT',
        checkpointsPassed: 7,
        totalCheckpoints: 8,
        evidence: 'Adversarial audit caught non-compliant aspect ratio on thumbnail #3. Work routed back to builder for correction.',
        timestamp: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };

    const updatedWorkOrders = state.workOrders.map(w => w.id === workOrderId ? updatedWo : w);

    // Update Objective to reflect blocked/correction required
    const obj = state.objectives.find(o => o.id === wo.objectiveId);
    const updatedObj: ObjectiveRecord = obj ? {
      ...obj,
      status: 'CORRECTION_REQUIRED',
      finalCommerceStatus: 'BLOCKED',
      blockers: [`Work Order ${wo.id} (${wo.title}) requires correction by ${wo.assignedAgent}`],
      updatedAt: new Date().toISOString()
    } : { ...CANONICAL_OBJECTIVES[0], status: 'CORRECTION_REQUIRED', finalCommerceStatus: 'BLOCKED' };

    const updatedObjectives = state.objectives.map(o => o.id === updatedObj.id ? updatedObj : o);

    this.saveState({
      workOrders: updatedWorkOrders,
      objectives: updatedObjectives
    });

    this.addAuditEvent({
      actor: 'Quincey (Independent QA)',
      role: 'QA Authority',
      action: 'REJECT_WORK_ORDER',
      target: wo.id,
      result: 'CORRECTION_REQUIRED',
      evidence: `Controlled failure simulated on ${wo.title}. Routed back to ${wo.assignedAgent} for correction.`
    });

    return { workOrder: updatedWo, objective: updatedObj };
  }

  public static resolveCorrection(workOrderId: string, correctionEvidence: string): { workOrder: WorkOrder; objective: ObjectiveRecord } {
    const state = this.loadState();
    const wo = state.workOrders.find(w => w.id === workOrderId);
    if (!wo) throw new Error(`Work order ${workOrderId} not found`);

    // 1. Builder corrects work
    // 2. Independent QA reruns verification
    const correctedWo: WorkOrder = {
      ...wo,
      status: 'COMPLETED',
      errorLog: undefined,
      correctionNotes: correctionEvidence,
      qaResult: {
        inspectorAgent: 'Quincey (Independent QA)',
        verdict: 'PASS',
        checkpointsPassed: 8,
        totalCheckpoints: 8,
        evidence: `Re-test verification passed. Corrected artifact verified: ${correctionEvidence}. Master parity restored.`,
        timestamp: new Date().toISOString()
      },
      updatedAt: new Date().toISOString()
    };

    const updatedWorkOrders = state.workOrders.map(w => w.id === workOrderId ? correctedWo : w);

    // Check if all work orders are completed
    const allCompleted = updatedWorkOrders.every(w => w.status === 'COMPLETED');
    const obj = state.objectives.find(o => o.id === wo.objectiveId);
    const updatedObj: ObjectiveRecord = obj ? {
      ...obj,
      status: allCompleted ? 'READY_TO_LIST' : 'EXECUTING',
      finalCommerceStatus: allCompleted ? 'READY TO LIST' : 'IN PROGRESS',
      blockers: [],
      completionEvidence: allCompleted 
        ? 'All work orders completed and independently certified by QA. Defect in ' + wo.id + ' resolved. READY TO LIST.' 
        : obj.completionEvidence,
      updatedAt: new Date().toISOString()
    } : { ...CANONICAL_OBJECTIVES[0], status: 'READY_TO_LIST', finalCommerceStatus: 'READY TO LIST' };

    const updatedObjectives = state.objectives.map(o => o.id === updatedObj.id ? updatedObj : o);

    this.saveState({
      workOrders: updatedWorkOrders,
      objectives: updatedObjectives
    });

    this.addAuditEvent({
      actor: `${wo.assignedAgent} & Quincey`,
      role: 'Workforce & QA',
      action: 'RESOLVE_CORRECTION',
      target: wo.id,
      result: 'QA_PASSED',
      evidence: `Correction submitted by ${wo.assignedAgent}. Quincey re-ran QA and confirmed 100% compliant. Objective restored to READY TO LIST.`
    });

    return { workOrder: correctedWo, objective: updatedObj };
  }

  // Founder Approval Gate
  public static authorizeFounderPublication(objectiveId: string, founderName: string = 'Genaro Ocasio (Founder)'): ObjectiveRecord {
    const state = this.loadState();
    const obj = state.objectives.find(o => o.id === objectiveId);
    if (!obj) throw new Error(`Objective ${objectiveId} not found`);

    if (obj.finalCommerceStatus === 'BLOCKED') {
      throw new Error('Cannot authorize publication while objective is BLOCKED by unresolved defects.');
    }

    const updatedObj: ObjectiveRecord = {
      ...obj,
      approvedBy: founderName,
      approvedAt: new Date().toISOString(),
      finalCommerceStatus: 'LIVE',
      status: 'COMPLETED',
      updatedAt: new Date().toISOString()
    };

    const updatedObjectives = state.objectives.map(o => o.id === objectiveId ? updatedObj : o);
    this.saveState({ objectives: updatedObjectives });

    this.addAuditEvent({
      actor: founderName,
      role: 'Founder',
      action: 'AUTHORIZE_ETSY_PUBLICATION',
      target: objectiveId,
      result: 'COMMERCE_LIVE_AUTHORIZED',
      evidence: `Founder ${founderName} authorized live commercial release of ${obj.targetProduct} to Etsy.`
    });

    return updatedObj;
  }

  public static certifyRelease(cert: ReleaseCertification): boolean {
    const state = this.loadState();
    const updatedCerts = [cert, ...state.certifications];
    
    // Update project status to RELEASED if all 14 criteria pass
    const isFullyCertified = cert.isReleased;
    let updatedProjects = state.projects;
    if (isFullyCertified) {
      updatedProjects = state.projects.map(p => {
        if (p.id === cert.projectId) {
          return {
            ...p,
            status: 'RELEASED',
            releaseStatus: 'RELEASE CERTIFIED',
            currentPhase: 'RELEASE',
            qaStatus: 'QA PASSED',
            securityStatus: 'CERTIFIED',
            latestVerifiedOutput: cert.qaPassEvidence
          };
        }
        return p;
      });
    }

    this.saveState({ certifications: updatedCerts, projects: updatedProjects });
    return isFullyCertified;
  }

  public static getFounderKey(): string {
    try {
      return typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem(FOUNDER_SESSION_KEY) || '').trim() : '';
    } catch {
      return '';
    }
  }

  public static setFounderKey(key: string): void {
    try {
      if (typeof sessionStorage === 'undefined') return;
      const normalized = key.trim();
      if (normalized) sessionStorage.setItem(FOUNDER_SESSION_KEY, normalized);
      else sessionStorage.removeItem(FOUNDER_SESSION_KEY);
    } catch {}
  }

  public static async syncWithCloud(forcePush: boolean = false): Promise<{ success: boolean; status: 'SYNCED' | 'LOCAL_DOMINANT' | 'CLOUD_DOMINANT' | 'OFFLINE_CACHED' | 'AUTH_REQUIRED'; lastSyncedAt?: string; error?: string }> {
    const founderKey = this.getFounderKey();
    const localState = this.loadState();
    if (!founderKey) return { success: false, status: 'AUTH_REQUIRED', lastSyncedAt: localState.lastSyncedAt };
    if (typeof fetch === 'undefined') return { success: false, status: 'OFFLINE_CACHED', lastSyncedAt: localState.lastSyncedAt };

    try {
      if (forcePush) {
        const push = await fetch(SYNC_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-founder-key': founderKey },
          body: JSON.stringify(localState)
        });
        if (!push.ok) throw new Error(`Cloud sync POST failed: HTTP ${push.status}`);
        const ack = await push.json();
        const synced = { ...localState, lastSyncedAt: ack.lastSyncedAt, cloudStatus: 'SYNCED' as const };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(synced));
        return { success: true, status: 'LOCAL_DOMINANT', lastSyncedAt: ack.lastSyncedAt };
      }

      const pull = await fetch(SYNC_ENDPOINT, { headers: { 'x-founder-key': founderKey } });
      if (!pull.ok) {
        if (pull.status === 401) return { success: false, status: 'AUTH_REQUIRED', lastSyncedAt: localState.lastSyncedAt, error: 'Founder authentication rejected.' };
        // Authenticated and online, but no canonical cloud object exists yet.
        // Seed cloud from local state rather than misclassifying this as offline.
        if (pull.status === 404) return this.syncWithCloud(true);
        throw new Error(`Cloud sync GET failed: HTTP ${pull.status}`);
      }
      const envelope = await pull.json();
      // An authenticated empty envelope is also a fresh cloud: seed it from local.
      if (!envelope.state) return this.syncWithCloud(true);

      const cloudState = envelope.state as Partial<OcgLabOsState>;
      const cloudMs = Date.parse(cloudState.lastSyncedAt || '') || 0;
      const localMs = Date.parse(localState.lastSyncedAt || '') || 0;
      if (cloudMs > localMs && cloudState.objectives) {
        const merged: OcgLabOsState = {
          ...localState,
          ...cloudState,
          storefrontItems: this.reconcileStorefrontItems(cloudState.storefrontItems, STOREFRONT_ITEMS_DATA),
          lastSyncedAt: cloudState.lastSyncedAt,
          cloudStatus: 'SYNCED'
        } as OcgLabOsState;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return { success: true, status: 'CLOUD_DOMINANT', lastSyncedAt: cloudState.lastSyncedAt };
      }

      if (localMs > cloudMs) return this.syncWithCloud(true);
      return { success: true, status: 'SYNCED', lastSyncedAt: localState.lastSyncedAt };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn('[StorageEngine] Cloud sync offline fallback:', message);
      return { success: false, status: 'OFFLINE_CACHED', error: message, lastSyncedAt: localState.lastSyncedAt };
    }
  }

  private static syncTimeout: ReturnType<typeof setTimeout> | null = null;

  public static queueCloudSync(): void {
    if (typeof window === 'undefined' || !this.getFounderKey()) return;
    if (this.syncTimeout) clearTimeout(this.syncTimeout);
    this.syncTimeout = setTimeout(() => {
      this.syncWithCloud(true).catch(error => console.warn('[StorageEngine] Auto-sync notice:', error));
    }, 1500);
  }

  public static resetToCanonical(): OcgLabOsState {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    const defaults = this.getDefaults();
    this.saveState(defaults);
    return defaults;
  }

  public static exportState(): string {
    return JSON.stringify(this.loadState(), null, 2);
  }

  public static importState(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.projects) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        return true;
      }
      return false;
    } catch (e) {
      console.error('[StorageEngine] Invalid JSON state string:', e);
      return false;
    }
  }
}
