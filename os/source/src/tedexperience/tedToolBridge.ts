/**
 * TED Super Agent — Tool Bridge client (Phase 2.2).
 *
 * Browser-side client for the OCG Tool Bridge (os/tool-bridge/bridge.js),
 * the governed local execution path. The bridge is a server the founder runs
 * explicitly; TED connects only after a REAL handshake.
 *
 * Truth contract: every method returns what the bridge actually did.
 * "Connected" is true only after /health answered. When the bridge isn't
 * running, TED says exactly that — never a simulated result.
 */

export interface BridgeHealth {
  ok: boolean;
  version: string;
  capabilities: string[];
  projectRoot: string;
  policy: string;
}

export interface BridgeCallResult {
  ok: boolean;
  error?: string;
  [key: string]: any;
}

const BRIDGE_URL_KEY = 'ted-tool-bridge-url';
const BRIDGE_TOKEN_KEY = 'ted-tool-bridge-token';
const DEFAULT_BRIDGE_URL = 'http://127.0.0.1:3777';

function storage(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

export class ToolBridgeClient {
  private baseUrl: string;
  private token: string | null = null;
  private health: BridgeHealth | null = null;

  constructor(baseUrl?: string) {
    const store = storage();
    this.baseUrl = baseUrl ?? store?.getItem(BRIDGE_URL_KEY) ?? DEFAULT_BRIDGE_URL;
    this.token = store?.getItem(BRIDGE_TOKEN_KEY) ?? null;
  }

  get isConnected(): boolean {
    return this.health !== null && this.health.ok;
  }

  get bridgeHealth(): BridgeHealth | null {
    return this.health;
  }

  get hasToken(): boolean {
    return !!this.token;
  }

  /** Remember the bridge URL and token (founder pastes the token once). */
  saveCredentials(baseUrl: string, token: string): void {
    this.baseUrl = baseUrl;
    this.token = token;
    const store = storage();
    store?.setItem(BRIDGE_URL_KEY, baseUrl);
    store?.setItem(BRIDGE_TOKEN_KEY, token);
  }

  forget(): void {
    this.token = null;
    this.health = null;
    const store = storage();
    store?.removeItem(BRIDGE_TOKEN_KEY);
  }

  /** Real handshake: GET /health. True only when the bridge answers. */
  async discover(): Promise<BridgeHealth | null> {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 3000);
      const res = await fetch(`${this.baseUrl}/health`, { signal: ctrl.signal });
      clearTimeout(timer);
      if (!res.ok) {
        this.health = null;
        return null;
      }
      const data = await res.json();
      this.health = data.ok ? (data as BridgeHealth) : null;
      return this.health;
    } catch {
      this.health = null;
      return null;
    }
  }

  private async call(path: string, body: Record<string, any>): Promise<BridgeCallResult> {
    if (!this.token) {
      return { ok: false, error: 'no bridge token — paste the token from the bridge console' };
    }
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 6 * 60 * 1000);
      const res = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Bridge-Token': this.token,
        },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { ok: false, error: data.error || `bridge HTTP ${res.status}`, ...data };
      }
      return { ok: true, ...data };
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'bridge unreachable' };
    }
  }

  inspect(path = '.'): Promise<BridgeCallResult> {
    return this.call('/api/inspect', { path });
  }

  readFile(path: string): Promise<BridgeCallResult> {
    return this.call('/api/read', { path });
  }

  runTests(): Promise<BridgeCallResult> {
    return this.call('/api/test', {});
  }

  runBuild(): Promise<BridgeCallResult> {
    return this.call('/api/build', {});
  }

  proposeEdit(path: string, oldText: string, newText: string): Promise<BridgeCallResult> {
    return this.call('/api/edit/propose', { path, oldText, newText });
  }

  confirmEdit(confirmationId: string): Promise<BridgeCallResult> {
    return this.call('/api/edit/confirm', { confirmationId });
  }
}

/** Shared client instance for the app. */
export const toolBridge = new ToolBridgeClient();
