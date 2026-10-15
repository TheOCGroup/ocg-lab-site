/**
 * TED Super Agent — action/tool layer (Phase 2).
 *
 * EXPERIENCE LAYER ONLY. Clean interfaces for technical execution, with one
 * load-bearing rule: TED never claims an action completed without evidence.
 *
 * Every tool declares whether it is actually connected. When a tool is not
 * connected, TED exposes the action as unavailable — "I know how to make
 * that change, but X is not connected yet" — and never simulates completion.
 *
 * In this static build, no execution tool is connected (there is no backend,
 * no repo access, no authenticated platform sessions from the browser). The
 * registry is real and providers can be registered later; until then every
 * execution request fails closed honestly.
 */

export type TedToolCategory =
  | 'repository'
  | 'build-test'
  | 'deployment'
  | 'site-verification'
  | 'database-api'
  | 'ecommerce'
  | 'etsy'
  | 'file-artifact'
  | 'research';

export interface TedToolDefinition {
  id: string;
  category: TedToolCategory;
  label: string;
  description: string;
  /** True only when the tool can actually execute right now. */
  available: boolean;
  /** Founder-facing reason shown when the tool is unavailable. */
  unavailableReason: string;
  requiresAuth: boolean;
}

export const TED_TOOL_REGISTRY: TedToolDefinition[] = [
  {
    id: 'repo-code',
    category: 'repository',
    label: 'Repository / code operations',
    description: 'Read and change code in a connected repository.',
    available: false,
    unavailableReason:
      'no repository access is connected in this build — TED runs in your browser with no path to your repos.',
    requiresAuth: true,
  },
  {
    id: 'local-build-test',
    category: 'build-test',
    label: 'Local build and test',
    description: 'Run builds and test suites, report real results.',
    available: false,
    unavailableReason:
      'no build/test runner is connected in this build — TED cannot execute code from here.',
    requiresAuth: false,
  },
  {
    id: 'deployment',
    category: 'deployment',
    label: 'Deployment',
    description: 'Deploy builds and verify the deployment is reachable.',
    available: false,
    unavailableReason:
      'no deployment pipeline is connected in this build — TED cannot ship or verify deploys from here.',
    requiresAuth: true,
  },
  {
    id: 'site-verification',
    category: 'site-verification',
    label: 'Browser / site verification',
    description: 'Load a URL and verify what actually renders.',
    available: false,
    unavailableReason:
      'no browsing agent is connected in this build — TED cannot open sites to verify them from here.',
    requiresAuth: false,
  },
  {
    id: 'database-api',
    category: 'database-api',
    label: 'Database / API operations',
    description: 'Query databases and call APIs with credentials.',
    available: false,
    unavailableReason:
      'no database or API credentials are connected in this build — TED will not touch data stores blind.',
    requiresAuth: true,
  },
  {
    id: 'ecommerce-platform',
    category: 'ecommerce',
    label: 'E-commerce platform operations',
    description: 'Operate storefronts (Shopify, Whop, direct) via platform APIs.',
    available: false,
    unavailableReason:
      'no storefront API connection exists in this build.',
    requiresAuth: true,
  },
  {
    id: 'etsy-ops',
    category: 'etsy',
    label: 'Etsy operations',
    description: 'Read and manage Etsy listings, shop settings, and orders via the Etsy API.',
    available: false,
    unavailableReason:
      'Etsy write access is not connected yet — no authenticated Etsy session exists in this build.',
    requiresAuth: true,
  },
  {
    id: 'file-artifact',
    category: 'file-artifact',
    label: 'File / artifact creation',
    description: 'Create files or documents for download.',
    available: false,
    unavailableReason:
      'file creation is not wired in this build — TED can show you recorded data, but cannot generate new files from here yet.',
    requiresAuth: false,
  },
  {
    id: 'live-research',
    category: 'research',
    label: 'Live research',
    description: 'Search the live web and cite sources.',
    available: false,
    unavailableReason:
      'no live research provider is connected in this build.',
    requiresAuth: false,
  },
];

export function getTool(id: string): TedToolDefinition | null {
  return TED_TOOL_REGISTRY.find((t) => t.id === id) ?? null;
}

export function listAvailableTools(): TedToolDefinition[] {
  return TED_TOOL_REGISTRY.filter((t) => t.available);
}

/** Test/embedding hook: flip a tool's availability (e.g. a mock in tests). */
export function setToolAvailability(id: string, available: boolean): boolean {
  const tool = getTool(id);
  if (!tool) return false;
  tool.available = available;
  return true;
}

/**
 * Sync tool availability with the Tool Bridge connection state.
 * When the bridge handshake succeeded, the governed local operations it
 * exposes become genuinely available: project inspect/read (repo-code) and
 * test/build runs (local-build-test). Everything else stays as-is —
 * deployment, deletion, credentials, and billing are not bridge operations
 * and remain honestly unavailable.
 */
export function syncBridgeTools(bridgeConnected: boolean): void {
  setToolAvailability('repo-code', bridgeConnected);
  setToolAvailability('local-build-test', bridgeConnected);
  if (bridgeConnected) {
    const repo = getTool('repo-code');
    if (repo) {
      repo.unavailableReason = '';
    }
    const build = getTool('local-build-test');
    if (build) {
      build.unavailableReason = '';
    }
  } else {
    const repo = getTool('repo-code');
    if (repo) {
      repo.unavailableReason =
        'the Tool Bridge is not running — start it (`node bridge.js --project <path>` in os/tool-bridge) and TED can inspect the project for real.';
    }
    const build = getTool('local-build-test');
    if (build) {
      build.unavailableReason =
        'the Tool Bridge is not running — TED cannot execute code from the browser alone.';
    }
  }
}

export interface TedExecutionEvidence {
  /** Machine-checkable proof the action happened: test output, HTTP status, API response id, etc. */
  proof: string;
  verifiedAt: string;
}

export type TedExecutionOutcome =
  | { status: 'unavailable'; tool: TedToolDefinition; message: string }
  | { status: 'executed'; tool: TedToolDefinition; evidence: TedExecutionEvidence; message: string }
  | { status: 'failed'; tool: TedToolDefinition; message: string };

/**
 * Request execution of a tool. Fails closed when the tool is not connected.
 * An 'executed' outcome ALWAYS carries evidence — a completion claim without
 * evidence is never produced by this function.
 */
export function requestExecution(
  toolId: string,
  actionSummary: string,
  evidence?: TedExecutionEvidence,
): TedExecutionOutcome {
  const tool = getTool(toolId);
  if (!tool) {
    return {
      status: 'failed',
      tool: {
        id: toolId,
        category: 'repository',
        label: 'Unknown tool',
        description: '',
        available: false,
        unavailableReason: 'no such tool is registered.',
        requiresAuth: false,
      },
      message: `There's no "${toolId}" tool registered, so there's nothing to execute. I won't pretend otherwise.`,
    };
  }
  if (!tool.available) {
    return {
      status: 'unavailable',
      tool,
      message:
        `I know how to ${actionSummary}, but ${tool.unavailableReason} ` +
        `Tell me when the connection exists and I'll do it for real — with proof, not promises.`,
    };
  }
  if (!evidence || !evidence.proof) {
    return {
      status: 'failed',
      tool,
      message:
        `The ${tool.label} path ran but produced no verifiable evidence, so I'm not calling it done. ` +
        `A completion claim without proof is exactly what I don't do.`,
    };
  }
  return {
    status: 'executed',
    tool,
    evidence,
    message: `Done — and verified (${evidence.proof}, checked ${evidence.verifiedAt}).`,
  };
}

/**
 * Map a founder's action request to the tool that would perform it.
 * Returns null when the request isn't an action TED can map.
 */
export function mapActionToTool(message: string): TedToolDefinition | null {
  const q = message.toLowerCase();
  const has = (...words: string[]) => words.some((w) => q.includes(w));
  if (has('etsy') && has('listing', 'shop', 'order', 'inventory')) return getTool('etsy-ops');
  if (has('deploy', 'ship it', 'push to prod', 'go live', 'publish the site')) return getTool('deployment');
  if (has('build', 'compile', 'test suite', 'run the tests')) return getTool('local-build-test');
  if (has('repo', 'repository', 'commit', 'pull request', 'merge', 'branch', 'codebase')) return getTool('repo-code');
  if (has('verify the site', 'check the site', 'is the site up', 'does the page load')) return getTool('site-verification');
  if (has('database', 'supabase', 'postgres', 'query the db')) return getTool('database-api');
  if (has('shopify', 'whop', 'storefront', 'store ')) return getTool('ecommerce-platform');
  if (has('research', 'look it up', 'search the web')) return getTool('live-research');
  return null;
}

const ACTION_VERBS = /\b(build|fix|update|deploy|change|publish|connect|ship|migrate|refactor|create|delete|remove|push|launch|set up|setup|install|configure)\b/;

/** True when the founder is asking TED to DO something, not asking about something. */
export function isExecutionRequest(message: string): boolean {
  const q = message.toLowerCase().replace(/[’]/g, "'");
  if (!ACTION_VERBS.test(q)) return false;
  // Questions seeking understanding, not action.
  if (/^(how|what|why|when|which|should|can you explain|tell me about)/.test(q.trim())) return false;
  if (q.includes('how do i') || q.includes('how would') || q.includes('best way to')) return false;
  return true;
}
