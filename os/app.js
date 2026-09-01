const RECOVERED_AT = "2026-09-01";
const products = [
  {
    id: "lab-site",
    name: "OCG LAB Product Library",
    purpose: "Commercial product delivery and storefront infrastructure",
    status: "production",
    repo: "TheOCGroup/ocg-lab-site",
    deployment: "ocg-lab-products",
    owner: "OCG LAB",
    classification: "Commercial",
    evidence: "GitHub + Vercel linked",
    next: "Extend without replacing canonical delivery paths",
  },
  {
    id: "maestro",
    name: "MAESTRO",
    purpose: "Adaptive skill-learning operating application",
    status: "verified",
    repo: "TheOCGroup/maestro",
    deployment: "maestro",
    owner: "Product Engineering",
    classification: "Commercial candidate",
    evidence: "Production QA recorded",
    next: "Monitor production and complete remaining disciplines",
  },
  {
    id: "nova",
    name: "NOVA",
    purpose: "Creative production and multimodal studio",
    status: "production",
    repo: "TheOCGroup/nova",
    deployment: "nova",
    owner: "AI Engineering",
    classification: "Internal / Commercial candidate",
    evidence: "Repository and production project recovered",
    next: "Reconcile latest production alias and canonical release",
  },
  {
    id: "insurance",
    name: "Insurance Agent AI PRO",
    purpose: "Insurance agent AI operating product",
    status: "production",
    repo: "TheOCGroup/Insurance-Agent-AI-PRO",
    deployment: "insurance-agent-ai-pro",
    owner: "Product Engineering",
    classification: "Commercial",
    evidence: "GitHub + Vercel linked",
    next: "Independent product-family QA",
  },
  {
    id: "rei",
    name: "Real Estate Investor AI SUPER PRO",
    purpose: "Real estate investor workflow product",
    status: "review",
    repo: "TheOCGroup/real-estate-investor-ai-super-pro",
    deployment: "real-estate-investor-ai-super-pro",
    owner: "Product Engineering",
    classification: "Commercial",
    evidence: "GitHub + Vercel linked",
    next: "Verify release and customer workflow",
  },
  {
    id: "leadflow",
    name: "LeadFlow AI PRO",
    purpose: "Lead workflow and AI employee product",
    status: "qa",
    repo: "TheOCGroup/ocg-lab-site",
    deployment: "ocg-lab-products / leadflow-ai-pro",
    owner: "QA",
    classification: "Commercial",
    evidence: "Release QA files recovered",
    next: "Rendered visual and production QA",
  },
  {
    id: "aiden-mobile",
    name: "Aiden Mobile",
    purpose: "Executive mobile AI runtime",
    status: "review",
    repo: "TheOCGroup/bryan-os",
    deployment: "Firebase App Distribution",
    owner: "Mobile Engineering",
    classification: "Internal",
    evidence: "Canonical repository recovered",
    next: "Reconcile latest distributed build evidence",
  },
  {
    id: "report",
    name: "The OCG LAB Report",
    purpose: "Public AI intelligence publication",
    status: "production",
    repo: "TheOCGroup/the-ocg-lab-report",
    deployment: "Netlify / OCG LAB site mirror",
    owner: "OCG MEDIA integration",
    classification: "Commercial support",
    evidence: "Repository and Issue 003 route recovered",
    next: "Preserve same public link; publication is not this OS",
  },
];
const infrastructure = [
  {
    name: "OCG LAB Products",
    type: "Vercel project",
    relation: "TheOCGroup/ocg-lab-site",
    state: "CANONICAL",
    detail: "prj_KzPT5VKcYdi8YrHd4ulXzBuxQeng",
  },
  {
    name: "OCG LAB Site",
    type: "GitHub repository",
    relation: "Product library + OS foundation",
    state: "CANONICAL",
    detail: "main @ 1b07b89 recovered baseline",
  },
  {
    name: "OCG LAB Products Test Pathdata",
    type: "Vercel project",
    relation: "Unlinked test project",
    state: "REVIEW",
    detail: "Potential duplicate / cleanup candidate",
  },
  {
    name: "OCG LAB Site",
    type: "Vercel project",
    relation: "Unlinked older project",
    state: "REVIEW",
    detail: "Compare domains before retirement",
  },
  {
    name: "Insurance Playbook Test",
    type: "Vercel project",
    relation: "Unlinked test project",
    state: "REVIEW",
    detail: "Potential cleanup candidate",
  },
  {
    name: "Allie product projects",
    type: "Vercel project group",
    relation: "Multiple unlinked variants",
    state: "REVIEW",
    detail: "Do not delete until canonical Netlify handoff is reconciled",
  },
];
const navItems = [
  ["home", "◈", "LAB Home"],
  ["products", "▦", "Products"],
  ["build", "↗", "Build"],
  ["workforce", "◎", "Workforce"],
  ["technology", "◇", "Technology"],
  ["qa", "✓", "QA & Releases"],
  ["infrastructure", "⌁", "Infrastructure"],
  ["incidents", "!", "Incidents"],
  ["commercial", "◆", "Commercialization"],
];
const app = document.querySelector("#app"),
  nav = document.querySelector("#nav");
let page = location.hash.slice(1) || "home",
  filter = "all";
nav.innerHTML = navItems
  .map(
    ([id, icon, label]) =>
      `<button class="nav-btn" data-page="${id}" title="${label}"><i>${icon}</i><span>${label}</span></button>`,
  )
  .join("");
nav.addEventListener("click", (e) => {
  const b = e.target.closest("[data-page]");
  if (b) {
    location.hash = b.dataset.page;
  }
});
window.addEventListener("hashchange", () => {
  page = location.hash.slice(1) || "home";
  render();
});
const status = (s) => `<span class="status ${s}">${s.toUpperCase()}</span>`;
const productRows = (list) =>
  `<div class="table-head"><span>PRODUCT / PURPOSE</span><span>STATE</span><span>EVIDENCE</span><span></span></div><div class="list">${list.map((p) => `<div class="row"><div><b>${p.name}</b><small>${p.purpose}</small></div>${status(p.status)}<div class="evidence">${p.evidence}</div><button data-open="${p.id}" aria-label="Open ${p.name}">→</button></div>`).join("")}</div>`;
function header(title, copy, eyebrow = "OCG LAB") {
  return `<header class="page-head"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1></div><p>${copy}</p></header>`;
}
function home() {
  const active = products.filter((p) =>
    ["qa", "review"].includes(p.status),
  ).length;
  return `${header("Technology,<br>under command.", "Executive clarity across recovered products, releases, infrastructure and risk. All counts below come from this recovered registry—not simulated live telemetry.")}<section class="hero"><div><div class="eyebrow">LAB EXECUTIVE BRIEF</div><h2>The foundation exists. The operating system did not.</h2><p>The canonical OCG LAB repository and deployment are recovered. The next move is to install one product record, build gate and verification model around the technology estate—not create another platform.</p></div><div class="recommendation"><span>RECOMMENDED NEXT ACTION</span><b>Close the paid-product access gap before certifying the storefront, then finish QA on products nearest revenue.</b><small>Executive agent connection: NOT CONNECTED</small></div></section><section class="metric-grid"><div class="metric"><span>RECOVERED PRODUCTS</span><b>${products.length}</b><small>canonical records started</small></div><div class="metric"><span>PRODUCTION / VERIFIED</span><b>${products.filter((p) => ["production", "verified"].includes(p.status)).length}</b><small>evidence requires expansion</small></div><div class="metric"><span>REVIEW / QA</span><b>${active}</b><small>next execution queue</small></div><div class="metric"><span>INFRA RISK</span><b>${infrastructure.filter((i) => i.state === "REVIEW").length}</b><small>duplicate candidates</small></div><div class="metric"><span>RELEASE BLOCKER</span><b>1</b><small>paid access gate</small></div></section><div class="grid-two"><section class="panel"><div class="panel-title"><h3>What requires attention</h3><span>RECOVERED ${RECOVERED_AT}</span></div>${productRows(products.filter((p) => ["qa", "review"].includes(p.status)))}</section><section class="panel"><div class="panel-title"><h3>Infrastructure control</h3><span>NO DELETIONS</span></div><div class="alert"><b>Duplicate project risk detected</b><p>Multiple unlinked Vercel test and handoff projects exist. They are marked for reconciliation, not deletion, until domains and last-known-good releases are verified.</p></div><div class="alert" style="margin-top:10px"><b>Public repository boundary</b><p>The recovered OCG LAB site is public. Secrets, private operating data and production control actions must remain out of this client-only foundation.</p></div></section></div>`;
}
function productsPage() {
  const states = ["all", "production", "verified", "qa", "review"];
  const list =
    filter === "all" ? products : products.filter((p) => p.status === filter);
  return `${header("One product.<br>One record.", "Canonical product identities across repositories and deployments. A repository or deployment is evidence—not a separate product.", "PRODUCT REGISTRY")}<div class="filters">${states.map((s) => `<button class="filter ${filter === s ? "active" : ""}" data-filter="${s}">${s.toUpperCase()}</button>`).join("")}</div><section class="panel">${productRows(list)}</section>`;
}
function buildPage() {
  return `${header("From idea to<br>verified production.", "The first real vertical slice: explicit gates with no “almost done” state. Gate updates persist only in this browser and are labeled local until a secured backend is connected.", "PRODUCT FACTORY")}<section class="panel"><div class="panel-title"><h3>Build pipeline</h3><span>LOCAL WORKSPACE STATE</span></div>${productRows(products.filter((p) => !["production", "verified"].includes(p.status)))}</section>`;
}
function workforce() {
  const roles = [
    "Product & Technology Strategy",
    "Architecture & AI Engineering",
    "Product Engineering",
    "Integration & Mobile",
    "Infrastructure & Security",
    "Independent QA & Release",
    "Commercialization",
  ];
  return `${header("Specialists,<br>not decorations.", "This is the minimum coherent technical organization. Runtime assignments and AI execution remain NOT CONNECTED until a secured orchestration service exists.", "TECHNICAL WORKFORCE")}<section class="panel"><div class="list">${roles.map((r, i) => `<div class="row"><div><b>${r}</b><small>${["Defines outcomes and evaluates current technology", "Owns system design, models, memory, voice, vision and tools", "Builds frontend, backend and production workflows", "Connects external systems and native capabilities", "Controls environments, secrets, reliability and attack surface", "Tests independently and owns release evidence", "Evaluates packaging, cost, distribution and revenue"][i]}</small></div><span class="status recovered">DEFINED</span><div class="evidence">Runtime: NOT CONNECTED</div><span>—</span></div>`).join("")}</div></section>`;
}
function technology() {
  return `${header("Technology<br>intelligence.", "A living decision system will protect continuity and cost. The radar schema is installed; provider evaluation feeds are NOT CONNECTED.", "RADAR & AGENT CAPABILITIES")}<div class="grid-two"><section class="panel"><div class="panel-title"><h3>Technology radar</h3><span>FOUNDATION</span></div>${["ADOPT", "TRIAL", "EVALUATE", "WATCH", "REPLACE", "RETIRE"].map((s, i) => `<div class="row" style="grid-template-columns:120px 1fr"><b>${s}</b><small>${["Approved for production use", "Controlled product experiment", "Evidence gathering", "Monitor without migration", "Migration case required", "Removal after dependency verification"][i]}</small></div>`).join("")}</section><section class="panel"><div class="panel-title"><h3>Agent capability registry</h3><span>NOT CONNECTED</span></div><div class="empty-state">Model, tools, permissions, memory, cost and evaluation records will appear only after the secured agent registry is connected.</div></section></div>`;
}
function qa() {
  return `${header("Evidence before<br>completion.", "Function, visual rendering, responsive behavior, UX, data, AI, integrations, security, performance, recovery and production must be independently reviewed.", "QA & RELEASE CONTROL")}<section class="panel">${productRows(products.filter((p) => ["qa", "review", "production"].includes(p.status)))}</section>`;
}
function infra() {
  return `${header("Know what<br>we already own.", "Recovered relationships make duplicate projects and abandoned services visible before OCG LAB provisions anything new.", "INFRASTRUCTURE REGISTRY")}<section class="panel"><div class="list">${infrastructure.map((i) => `<div class="row"><div><b>${i.name}</b><small>${i.type}</small></div>${status(i.state === "CANONICAL" ? "verified" : "review")}<div class="evidence">${i.relation}</div><button title="${i.detail}">ⓘ</button></div>`).join("")}</div></section>`;
}
function incidents() {
  return `${header("Operational<br>incident command.", "Recovered release risks appear here. Live monitoring remains NOT CONNECTED and no real-time incident activity is simulated.", "INCIDENTS")}<section class="panel"><div class="list"><div class="row"><div><b>Paid product routes lack verified entitlement protection</b><small>Anonymous direct-route access can expose commercial products before checkout and entitlement are connected.</small></div><span class="status failed">P0 BLOCKER</span><div class="evidence">Owner: Security + Commerce<br>Last known safe action: fail closed</div><span>!</span></div></div><div class="alert" style="margin-top:16px"><b>Recovered evidence—not live telemetry</b><p>Source: OCG LAB paid-product access gate, 2026-08-31. Production monitoring and alert ingestion remain NOT CONNECTED.</p></div></section>`;
}
function commercial() {
  return `${header("Build value.<br>Then capture it.", "Commercialization candidates reuse the existing OCG LAB product catalog and commerce infrastructure.", "COMMERCIALIZATION")}<section class="panel">${productRows(products.filter((p) => /Commercial/.test(p.classification)))}</section>`;
}
const views = {
  home,
  products: productsPage,
  build: buildPage,
  workforce,
  technology,
  qa,
  infrastructure: infra,
  incidents,
  commercial,
};
function detail(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  app.innerHTML = `${header(p.name, p.purpose, "CANONICAL PRODUCT RECORD")}<section class="panel"><div class="detail-grid">${[
    ["Classification", p.classification],
    ["Current state", p.status.toUpperCase()],
    ["Owner", p.owner],
    ["Repository", p.repo],
    ["Deployment", p.deployment],
    ["Evidence", p.evidence],
    ["Next action", p.next],
    ["Recovered", RECOVERED_AT],
  ]
    .map(
      ([a, b]) =>
        `<div class="detail"><span>${a.toUpperCase()}</span><b>${b}</b></div>`,
    )
    .join("")}</div></section>`;
  window.scrollTo(0, 0);
}
function render() {
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.page === page));
  app.innerHTML = (views[page] || home)();
  window.scrollTo(0, 0);
}
app.addEventListener("click", (e) => {
  const o = e.target.closest("[data-open]");
  if (o) detail(o.dataset.open);
  const f = e.target.closest("[data-filter]");
  if (f) {
    filter = f.dataset.filter;
    render();
  }
});
const dialog = document.querySelector("#commandDialog"),
  input = document.querySelector("#commandInput"),
  results = document.querySelector("#commandResults");
const commands = [
  ["What are we building?", "build"],
  ["Which products can launch?", "products"],
  ["What needs QA?", "qa"],
  ["Are we paying for duplicates?", "infrastructure"],
  ["What broke?", "incidents"],
  ["What can make money?", "commercial"],
  ["Which technology are we using?", "technology"],
];
function commandResults(q = "") {
  results.innerHTML = commands
    .filter((c) => c[0].toLowerCase().includes(q.toLowerCase()))
    .map(
      (c) =>
        `<button type="button" class="command-result" data-command="${c[1]}">${c[0]}</button>`,
    )
    .join("");
}
document.querySelector("#commandTrigger").onclick = () => {
  dialog.showModal();
  commandResults();
  setTimeout(() => input.focus(), 50);
};
input.oninput = () => commandResults(input.value);
results.onclick = (e) => {
  const b = e.target.closest("[data-command]");
  if (b) {
    dialog.close();
    location.hash = b.dataset.command;
  }
};
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    dialog.showModal();
    commandResults();
    setTimeout(() => input.focus(), 50);
  }
});
render();
