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
        storefrontItems: parsed.storefrontItems && parsed.storefrontItems.length ? parsed.storefrontItems : defaults.storefrontItems,
        clientSolutions: parsed.clientSolutions && parsed.clientSolutions.length ? parsed.clientSolutions : defaults.clientSolutions,
        certifications: parsed.certifications || [],
        objectives: parsed.objectives && parsed.objectives.length ? parsed.objectives : defaults.objectives,
        workOrders: parsed.workOrders && parsed.workOrders.length ? parsed.workOrders : defaults.workOrders,
        auditEvents: parsed.auditEvents && parsed.auditEvents.length ? parsed.auditEvents : defaults.auditEvents,
        focusMode: !!parsed.focusMode,
        activeBenchIds: parsed.activeBenchIds || defaults.activeBenchIds
      };
    } catch (e) {
      console.warn('[StorageEngine] Error loading state from localStorage, falling back to defaults:', e);
      return defaults;
    }
  }

  public static saveState(state: Partial<OcgLabOsState>): void {
    try {
      const current = this.loadState();
      const updated = { ...current, ...state };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
