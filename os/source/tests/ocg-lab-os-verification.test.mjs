import test from "node:test";
import assert from "node:assert/strict";

// Mock localStorage for node environment
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}
globalThis.localStorage = new LocalStorageMock();

// Dynamically import data & engine modules
import { DEPARTMENTS_DATA } from "../src/data/departments.ts";
import { PORTFOLIO_DATA } from "../src/data/portfolio.ts";
import { PROJECTS_DATA } from "../src/data/projects.ts";
import { AGENTS_DATA, INITIAL_TASK_RUNS } from "../src/data/agents.ts";
import { DECISIONS_DATA } from "../src/data/decisions.ts";
import { EXPERIMENTS_DATA } from "../src/data/experiments.ts";
import { STOREFRONT_ITEMS_DATA } from "../src/data/storefronts.ts";
import { CLIENT_SOLUTIONS_DATA } from "../src/data/clientSolutions.ts";
import { SHARED_CAPABILITIES_DATA } from "../src/data/sharedInfrastructure.ts";
import { StorageEngine } from "../src/data/storageEngine.ts";
import { AidenEngine } from "../src/components/aiden/aidenEngine.ts";

test("1. Department Architecture Integrity (12 Departments)", (t) => {
  assert.equal(DEPARTMENTS_DATA.length, 12, "Must contain exactly 12 established departments");
  const expectedDepartments = [
    "AI & Agent Engineering",
    "Software Engineering",
    "Product Development",
    "Innovation / R&D",
    "UX / Product Design",
    "Infrastructure / DevOps",
    "QA / Testing / Release",
    "Security / Compliance",
    "Data / Knowledge / Intelligence",
    "Commercialization & Storefronts",
    "Client Solutions / Custom Builds",
    "Technical Documentation"
  ];
  expectedDepartments.forEach((name, idx) => {
    assert.equal(DEPARTMENTS_DATA[idx].name, name, `Department name at index ${idx} must match spec`);
    assert.ok(DEPARTMENTS_DATA[idx].leadAgent, "Department must have an assigned lead agent");
    assert.ok(DEPARTMENTS_DATA[idx].coreMission, "Department must have a defined core mission");
    assert.ok(DEPARTMENTS_DATA[idx].kpiHeadline, "Department must have a KPI headline");
  });
});

test("2. Commercial Product Ladder Integrity (4 Tiers)", (t) => {
  const ladders = new Set(PORTFOLIO_DATA.map(p => p.ladder));
  assert.ok(ladders.has("PLAYBOOK"), "Must contain PLAYBOOK tier");
  assert.ok(ladders.has("AI PRO"), "Must contain AI PRO tier");
  assert.ok(ladders.has("AI SUPER PRO"), "Must contain AI SUPER PRO tier");
  assert.ok(ladders.has("CALCULATOR"), "Must contain CALCULATOR tier");

  // Master Standard Check: Insurance Agent Playbook
  const insurancePlaybook = PORTFOLIO_DATA.find(p => p.id === "playbook-insurance");
  assert.ok(insurancePlaybook, "Insurance Agent AI Playbook must be present");
  assert.equal(insurancePlaybook.status, "RELEASED", "Insurance Agent Playbook must be RELEASED");
  assert.ok(insurancePlaybook.deliveryAsset.includes(".zip"), "Insurance Playbook must reference zip package");
});

test("3. Canonical Project Records & System Boundaries", (t) => {
  assert.ok(PROJECTS_DATA.length >= 8, "Must contain all major active projects and connected systems");
  
  // Boundary check: External OSs remain distinct
  const externalSystems = ["OCG MEDIA OS", "MAESTRO", "OCG PIPELINE"];
  externalSystems.forEach(sys => {
    const record = PROJECTS_DATA.find(p => p.productSystem === sys);
    assert.ok(record, `System record for ${sys} must exist with boundary intact`);
    assert.notEqual(record.productSystem, "OCG LAB OS", `${sys} must NOT be merged into OCG LAB OS`);
  });

  // Bench check: Max 3 active bench items
  const benchItems = PROJECTS_DATA.filter(p => p.isBench);
  assert.ok(benchItems.length <= 3, "On the bench must contain max 3 active P1 missions");
});

test("4. Specialist Agents & Anti-Fabrication Evidence Invariant", (t) => {
  assert.ok(AGENTS_DATA.length >= 8, "Must contain all persistent specialist agents");
  
  // Test task runs: every task run must carry verifiable evidence
  INITIAL_TASK_RUNS.forEach(run => {
    assert.ok(run.evidence && run.evidence.trim().length > 10, `Run ${run.id} must contain non-empty verifiable evidence`);
    assert.ok(run.toolsUsed.length > 0, `Run ${run.id} must cite tools used`);
    assert.ok(["COMPLETED", "RUNNING", "FAILED", "QUEUED", "HALTED"].includes(run.status), `Run ${run.id} must have valid status`);
  });
});

test("5. Shared Infrastructure Contracts", (t) => {
  assert.equal(SHARED_CAPABILITIES_DATA.length, 4, "Must define all 4 OCG shared capabilities");
  const types = SHARED_CAPABILITIES_DATA.map(c => c.type);
  assert.ok(types.includes("GATEWAY"), "Capability Gateway required");
  assert.ok(types.includes("KNOWLEDGE"), "Knowledge Layer required");
  assert.ok(types.includes("CREATIVE"), "Creative Services required");
  assert.ok(types.includes("SUPER_AGENT_CORE"), "Super Agent Core required");
});

test("6. Commercial Storefronts Inventory", (t) => {
  assert.ok(STOREFRONT_ITEMS_DATA.length >= 5, "Must track active commercial SKUs across Whop and Etsy");
  STOREFRONT_ITEMS_DATA.forEach(item => {
    assert.ok(item.price > 0, `Storefront item ${item.id} must have real price`);
    if (item.status === "Live") {
      assert.ok(item.fulfillmentUrl, `Live storefront item ${item.id} must have verified delivery URL`);
    }
    assert.ok(item.listingAssetPack, `Storefront item ${item.id} must cite listing asset pack`);
  });
});

test("7. Decisions Ledger & Incubator Containment", (t) => {
  assert.ok(DECISIONS_DATA.length >= 4, "Must preserve decision history from Workbench v2");
  assert.ok(EXPERIMENTS_DATA.length >= 2, "Must contain incubator ideas");
  
  EXPERIMENTS_DATA.forEach(exp => {
    assert.equal(exp.stage, "INCUBATOR", `Experiment ${exp.name} must be strictly contained in INCUBATOR`);
  });
});

test("8. StorageEngine Persistence & Project Updates", (t) => {
  const initialState = StorageEngine.loadState();
  assert.ok(initialState.projects.length > 0, "Initial state projects loaded");

  // Update project
  const testId = initialState.projects[0].id;
  const updatedList = StorageEngine.updateProject(testId, {
    nextAction: "Automated test next action verification",
    completionPercent: 99
  });
  const updatedItem = updatedList.find(p => p.id === testId);
  assert.equal(updatedItem.completionPercent, 99, "Project completion percent updated in storage");
  assert.equal(updatedItem.nextAction, "Automated test next action verification", "Project next action updated in storage");
});

test("9. Aiden Natural Language Command Orchestration", (t) => {
  // Test Blockers resolution
  const blockerRes = AidenEngine.processQuery("What is blocking the Lab?");
  assert.equal(blockerRes.category, "BLOCKERS");
  assert.ok(blockerRes.reply.length > 20);

  // Test Launches resolution
  const launchRes = AidenEngine.processQuery("Which products can launch?");
  assert.equal(launchRes.category, "LAUNCHES");
  assert.ok(launchRes.reply.includes("Insurance Agent AI Playbook") || launchRes.reply.includes("Commercial Products Ready"));

  // Test Action: Finish Insurance Product
  const insRes = AidenEngine.processQuery("Finish the Insurance product.");
  assert.equal(insRes.category, "TASK_DISPATCH");
  assert.ok(insRes.actionTaken);
  assert.ok(insRes.evidence);

  // Test Action: QA Trigger
  const qaRes = AidenEngine.processQuery("Have QA test this.");
  assert.equal(qaRes.category, "TASK_DISPATCH");
  assert.ok(qaRes.evidence);
});

test("10. 14-Point Release Certification Protocol", (t) => {
  const state = StorageEngine.loadState();
  const unreleasedProj = state.projects.find(p => p.status !== "RELEASED") || state.projects[0];

  const validCert = {
    id: "cert-test-01",
    projectId: unreleasedProj.id,
    projectName: unreleasedProj.name,
    canonicalRepo: unreleasedProj.sourceRepository,
    targetBranch: unreleasedProj.activeBranch,
    commitSha: unreleasedProj.latestCommit,
    productionDeployment: unreleasedProj.deployment,
    deploymentId: "dpl_test_01",
    publicProductionUrl: unreleasedProj.productionUrl,
    httpSuccessStatus: true,
    appVersion: "1.0.0-test",
    criticalWorkflowVerified: true,
    crossDeviceVerified: true,
    integrationsVerified: true,
    zeroConsoleErrors: true,
    envVarsConfirmed: true,
    rollbackPathDocumented: true,
    qaPassEvidence: "Automated Playwright test passed 14/14 checkpoints with 0 errors.",
    isReleased: true
  };

  const certified = StorageEngine.certifyRelease(validCert);
  assert.equal(certified, true, "Certification must pass when all criteria are met");

  const postState = StorageEngine.loadState();
  const certifiedProj = postState.projects.find(p => p.id === unreleasedProj.id);
  assert.equal(certifiedProj.status, "RELEASED", "Project must transition to RELEASED upon valid certification");
  assert.equal(certifiedProj.releaseStatus, "RELEASE CERTIFIED", "Project releaseStatus must become RELEASE CERTIFIED");
});

test("11. End-to-End Business Proof: Digital Playbook to Etsy Readiness", (t) => {
  const state = StorageEngine.loadState();
  const obj = state.objectives.find(o => o.id === "obj-etsy-insurance-playbook");
  assert.ok(obj, "Canonical Etsy commercialization objective must exist");
  assert.equal(obj.targetProduct, "Insurance Agent AI Playbook");
  assert.equal(obj.founderInstruction, "Aiden, get this OCG LAB Digital Playbook commercially ready for Etsy.");
  assert.equal(obj.finalCommerceStatus, "READY TO LIST", "Product must reach READY TO LIST status");

  // Test Aiden query response for exact founder directive
  const res = AidenEngine.processQuery("Aiden, get this OCG LAB Digital Playbook commercially ready for Etsy.");
  assert.equal(res.category, "EXECUTIVE_BRIEFING");
  assert.ok(res.reply.includes("READY TO LIST"), "Aiden response must confirm READY TO LIST verdict");
  assert.ok(res.reply.includes("Insurance Agent AI Playbook"), "Aiden response must cite target product");
  assert.ok(res.reply.includes("Founder Authorization"), "Aiden response must cite Founder approval requirement");
});

test("12. Workforce Decomposition, Department Hierarchy & Artifact Evidence", (t) => {
  const wos = StorageEngine.getWorkOrders("obj-etsy-insurance-playbook");
  assert.equal(wos.length, 8, "Objective must decompose into exactly 8 discrete work orders");

  // Verify participating departments
  const deptIds = new Set(wos.map(w => w.departmentId));
  assert.ok(deptIds.has("product-development"), "Must include Product Development");
  assert.ok(deptIds.has("software-engineering"), "Must include Software Engineering");
  assert.ok(deptIds.has("commercialization-storefronts"), "Must include Commercialization");
  assert.ok(deptIds.has("ux-product-design"), "Must include UX / Design");
  assert.ok(deptIds.has("technical-documentation"), "Must include Documentation");
  assert.ok(deptIds.has("security-compliance"), "Must include Compliance");
  assert.ok(deptIds.has("qa-testing-release"), "Must include Independent QA");

  // Verify every work order has verified artifacts
  wos.forEach(wo => {
    assert.ok(wo.artifacts.length > 0, `Work order ${wo.id} must have produced artifacts`);
    wo.artifacts.forEach(art => {
      assert.equal(art.verificationStatus, "VERIFIED", `Artifact ${art.id} must be VERIFIED`);
    });
    assert.ok(wo.qaResult, `Work order ${wo.id} must have QA sign-off`);
    assert.equal(wo.qaResult.verdict, "PASS", `Work order ${wo.id} QA verdict must be PASS`);
  });

  // Verify critical commercial assets
  const listingWo = wos.find(w => w.id === "wo-ins-03");
  const listingArt = listingWo.artifacts.find(a => a.type === "LISTING");
  assert.ok(listingArt, "Listing copy package artifact must exist");

  const mediaWo = wos.find(w => w.id === "wo-ins-04");
  const imageArt = mediaWo.artifacts.find(a => a.type === "IMAGE");
  assert.ok(imageArt, "Marketing image suite artifact must exist");

  const packageWo = wos.find(w => w.id === "wo-ins-05");
  const zipArt = packageWo.artifacts.find(a => a.type === "PACKAGE");
  assert.ok(zipArt, "14.3MB distribution zip artifact must exist");
});

test("13. Controlled Failure Injection & Workforce Recovery Loop", (t) => {
  // Step 1: Force controlled failure on WO-04
  const { workOrder: failedWo, objective: blockedObj } = StorageEngine.simulateControlledFailure("wo-ins-04");
  assert.equal(failedWo.status, "CORRECTION_REQUIRED", "Failed work order must be set to CORRECTION_REQUIRED");
  assert.equal(blockedObj.status, "CORRECTION_REQUIRED", "Objective must transition to CORRECTION_REQUIRED");
  assert.equal(blockedObj.finalCommerceStatus, "BLOCKED", "Commerce state must transition to BLOCKED");
  assert.ok(blockedObj.blockers.length > 0, "Objective must record active blocker");

  // Verify Aiden identifies the blocker
  const blockerRes = AidenEngine.processQuery("What is blocking the Lab?");
  assert.ok(blockerRes.reply.includes("wo-ins-04") || blockerRes.reply.includes("Archer"), "Aiden must cite the active defect");

  // Verify live publish fails while blocked
  assert.throws(() => {
    StorageEngine.authorizeFounderPublication("obj-etsy-insurance-playbook");
  }, /BLOCKED/, "Must fail closed if live publish attempted while BLOCKED");

  // Step 2: Builder submits correction and Independent QA re-tests
  const { workOrder: correctedWo, objective: restoredObj } = StorageEngine.resolveCorrection(
    "wo-ins-04",
    "Archer re-rendered Image #3 to 2000x2000 compliant square. Quincey certified PASS."
  );

  assert.equal(correctedWo.status, "COMPLETED", "Corrected work order must return to COMPLETED");
  assert.equal(correctedWo.qaResult.verdict, "PASS", "Independent QA must issue PASS on correction");
  assert.equal(restoredObj.finalCommerceStatus, "READY TO LIST", "Objective must return to READY TO LIST");
  assert.equal(restoredObj.blockers.length, 0, "Blockers must be cleared");
});

test("14. Founder Governance Gate & Consequential Action Authorization", (t) => {
  // Ensure starting state is READY TO LIST
  const stateBefore = StorageEngine.loadState();
  const objBefore = stateBefore.objectives.find(o => o.id === "obj-etsy-insurance-playbook");
  assert.equal(objBefore.finalCommerceStatus, "READY TO LIST");
  assert.equal(objBefore.approvedBy, null, "Must not be pre-approved");

  // Authorize publication via Founder governance gate
  const approvedObj = StorageEngine.authorizeFounderPublication(
    "obj-etsy-insurance-playbook",
    "Genaro Ocasio (Founder)"
  );

  assert.equal(approvedObj.finalCommerceStatus, "LIVE", "Status must become LIVE after Founder authorization");
  assert.equal(approvedObj.approvedBy, "Genaro Ocasio (Founder)");
  assert.ok(approvedObj.approvedAt, "Must record authorization timestamp");

  // Verify audit event was logged
  const postState = StorageEngine.loadState();
  const auditEvt = postState.auditEvents.find(e => e.action === "AUTHORIZE_ETSY_PUBLICATION");
  assert.ok(auditEvt, "Audit event for Founder publication authorization must be recorded");
  assert.equal(auditEvt.actor, "Genaro Ocasio (Founder)");
});

test("15. Non-Self-Approval Independent QA Invariant", (t) => {
  const wos = StorageEngine.getWorkOrders("obj-etsy-insurance-playbook");
  wos.forEach(wo => {
    if (wo.qaResult) {
      // The inspector agent must NOT be the assigned agent (builder)
      assert.notEqual(
        wo.assignedAgent,
        wo.qaResult.inspectorAgent,
        `Builder agent ${wo.assignedAgent} cannot self-approve work order ${wo.id}`
      );
      assert.ok(
        ["Quincey", "Hunter", "Sentinel"].some(auditor => wo.qaResult.inspectorAgent.includes(auditor)),
        `Inspector agent must be an authorized QA or compliance authority`
      );
    }
  });
});

