import fs from 'node:fs/promises';
import path from 'node:path';

const registryPath = path.resolve(process.argv[2] || 'ops/tech/dependencies.json');
const reportPath = path.resolve(process.env.TECH_OPS_REPORT || 'tech-ops-report.json');
const timeoutMs = Number(process.env.TECH_OPS_TIMEOUT_MS || 15000);
const retries = Number(process.env.TECH_OPS_RETRIES || 2);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'OCG-LAB-Tech-Ops-Audit/1.0' }
    });
  } finally {
    clearTimeout(timer);
  }
}

async function checkHttp(system, url) {
  const expected = system.health?.expectedStatus ?? 200;
  let lastError = null;
  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    const started = Date.now();
    try {
      const response = await fetchWithTimeout(url);
      const body = await response.text();
      const titleMatch = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : null;
      const titleIncludes = system.health?.titleIncludes;
      const titleOk = !titleIncludes || String(title || '').toLowerCase().includes(String(titleIncludes).toLowerCase());
      const statusOk = response.status === expected;
      if (statusOk && titleOk) {
        return { ok: true, status: response.status, title, latencyMs: Date.now() - started, attempt };
      }
      lastError = `expected status ${expected}${titleIncludes ? ` and title containing ${titleIncludes}` : ''}; got ${response.status}${title ? ` / ${title}` : ''}`;
    } catch (error) {
      lastError = error?.name === 'AbortError' ? `timeout after ${timeoutMs}ms` : String(error?.message || error);
    }
    if (attempt <= retries) await sleep(1000 * attempt);
  }
  return { ok: false, error: lastError };
}

function validateRegistry(registry) {
  const issues = [];
  if (!registry || registry.version !== 1) issues.push('registry.version must be 1');
  if (!Array.isArray(registry?.systems) || registry.systems.length === 0) issues.push('registry.systems must be non-empty');
  for (const system of registry?.systems || []) {
    if (!system.id || !system.name) issues.push('every system requires id and name');
    if (!Array.isArray(system.productionUrls) || system.productionUrls.length === 0) issues.push(`${system.id || 'unknown'} requires productionUrls`);
    for (const dep of system.dependencies || []) {
      if (!dep.provider || !dep.kind || !dep.credentialType) issues.push(`${system.id}: every dependency needs provider, kind, credentialType`);
      if (!Array.isArray(dep.logicalCredentialNames)) issues.push(`${system.id}/${dep.provider}: logicalCredentialNames must be an array`);
      for (const name of dep.logicalCredentialNames || []) {
        if (/\s/.test(name) || /[=:]/.test(name)) issues.push(`${system.id}/${dep.provider}: invalid logical credential name ${name}`);
      }
    }
  }
  return issues;
}

const registry = JSON.parse(await fs.readFile(registryPath, 'utf8'));
const registryIssues = validateRegistry(registry);
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  registryPath: path.relative(process.cwd(), registryPath),
  registryIssues,
  systems: []
};

for (const system of registry.systems || []) {
  const checks = [];
  for (const url of system.productionUrls || []) {
    checks.push({ url, ...(await checkHttp(system, url)) });
  }
  const dependencies = (system.dependencies || []).map((dep) => ({
    provider: dep.provider,
    kind: dep.kind,
    credentialType: dep.credentialType,
    logicalCredentialNames: dep.logicalCredentialNames,
    declaredState: dep.currentState,
    founderActionRequired: Boolean(dep.founderActionRequired),
    note: dep.note || null
  }));
  report.systems.push({
    id: system.id,
    name: system.name,
    checks,
    dependencies,
    ok: checks.every((check) => check.ok)
  });
}

report.summary = {
  systemCount: report.systems.length,
  healthySystems: report.systems.filter((s) => s.ok).length,
  failedSystems: report.systems.filter((s) => !s.ok).map((s) => s.id),
  registryIssueCount: registryIssues.length
};

await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`OCG LAB Tech Ops audit: ${report.summary.healthySystems}/${report.summary.systemCount} systems healthy`);
if (registryIssues.length) console.error('Registry issues:', registryIssues);
for (const system of report.systems) {
  for (const check of system.checks) {
    console.log(`${check.ok ? 'PASS' : 'FAIL'} ${system.id} ${check.url} ${check.status ?? ''} ${check.latencyMs ? `${check.latencyMs}ms` : ''}`.trim());
    if (!check.ok) console.error(`  ${check.error}`);
  }
}

if (registryIssues.length || report.summary.failedSystems.length) process.exitCode = 1;
