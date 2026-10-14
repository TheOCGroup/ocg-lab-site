#!/usr/bin/env node
/**
 * OCG Tool Bridge — governed local execution for TED.
 *
 * The founder runs this explicitly: `node bridge.js --project /path/to/project`.
 * Binds 127.0.0.1 only. See PROTOCOL.md for the governance contract.
 *
 * Node 18+. No dependencies.
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const VERSION = '0.1.0';
const DEFAULT_PORT = 3777;
const TOKEN_FILE = path.join(__dirname, '.bridge-token');
const READ_CAP_BYTES = 100 * 1024;
const CONFIRM_TTL_MS = 10 * 60 * 1000;

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

/**
 * P10 (Phase 2.3) — smart project root default.
 *
 * Previously defaulted to process.cwd(), which jailed TED to the
 * tool-bridge directory when run from there. Now: if --project is given,
 * use it. Otherwise walk up from the bridge location looking for a
 * project marker (.git or package.json). Fall back to cwd with a warning.
 */
function findProjectRoot() {
  const explicit = arg('project', null);
  if (explicit) return { root: path.resolve(explicit), source: '--project' };
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    if (fs.existsSync(path.join(dir, '.git')) || fs.existsSync(path.join(dir, 'package.json'))) {
      return { root: dir, source: 'auto-detected' };
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return { root: process.cwd(), source: 'cwd (no project marker found — pass --project explicitly)' };
}

const { root: PROJECT_ROOT, source: ROOT_SOURCE } = findProjectRoot();
const PORT = parseInt(arg('port', String(DEFAULT_PORT)), 10);

function getToken() {
  try {
    return fs.readFileSync(TOKEN_FILE, 'utf8').trim();
  } catch {
    const token = crypto.randomBytes(24).toString('hex');
    fs.writeFileSync(TOKEN_FILE, token, { mode: 0o600 });
    return token;
  }
}
const TOKEN = getToken();
const TOKEN_IS_NEW = !fs.existsSync(TOKEN_FILE + '.seen');

function log(who, what, result) {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${who} ${what} -> ${result}`);
}

/** Resolve a client path inside the project root; null on escape. */
function safePath(p) {
  if (typeof p !== 'string' || p.length === 0) return PROJECT_ROOT;
  const resolved = path.resolve(PROJECT_ROOT, p);
  if (resolved !== PROJECT_ROOT && !resolved.startsWith(PROJECT_ROOT + path.sep)) return null;
  return resolved;
}

function send(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Bridge-Token',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => {
      data += c;
      if (data.length > 1024 * 1024) reject(new Error('body too large'));
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error('invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const pendingEdits = new Map(); // confirmationId -> {path, oldText, newText, expiresAt}

function runNpm(args, timeoutMs) {
  return new Promise((resolve) => {
    const child = spawn('npm', args, { cwd: PROJECT_ROOT, shell: false });
    let out = '';
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      out += '\n[TIMED OUT after ' + timeoutMs + 'ms]';
    }, timeoutMs);
    child.stdout.on('data', (d) => { out += d.toString(); });
    child.stderr.on('data', (d) => { out += d.toString(); });
    child.on('close', (code) => {
      clearTimeout(timer);
      // Cap output: enough for diagnosis, not a log firehose.
      if (out.length > 20000) out = out.slice(0, 20000) + '\n[TRUNCATED]';
      resolve({ exitCode: code, output: out });
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ exitCode: -1, output: 'Failed to start npm: ' + err.message });
    });
  });
}

function simpleDiff(oldText, newText) {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const preview = [];
  const max = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < max && preview.length < 40; i++) {
    if (oldLines[i] !== newLines[i]) {
      if (oldLines[i] !== undefined) preview.push('- ' + oldLines[i].slice(0, 120));
      if (newLines[i] !== undefined) preview.push('+ ' + newLines[i].slice(0, 120));
    }
  }
  return preview.join('\n');
}

const server = http.createServer(async (req, res) => {
  const who = 'token:' + (req.headers['x-bridge-token'] || 'none').toString().slice(0, 6);
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, X-Bridge-Token',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      });
      return res.end();
    }

    const url = new URL(req.url, 'http://127.0.0.1');

    if (req.method === 'GET' && url.pathname === '/health') {
      log(who, 'GET /health', 'ok');
      return send(res, 200, {
        ok: true,
        version: VERSION,
        capabilities: ['inspect', 'read', 'test', 'build', 'edit(propose+confirm)'],
        projectRoot: PROJECT_ROOT,
        policy: 'local-only; root-jailed; allowlisted commands; two-step edits; no delete/deploy/credentials',
      });
    }

    if (!url.pathname.startsWith('/api/')) {
      return send(res, 404, { ok: false, error: 'not found' });
    }

    // Auth for everything under /api/.
    if (req.headers['x-bridge-token'] !== TOKEN) {
      log(who, `${req.method} ${url.pathname}`, '401');
      return send(res, 401, { ok: false, error: 'invalid or missing bridge token' });
    }

    const body = req.method === 'POST' ? await readBody(req) : {};

    if (url.pathname === '/api/inspect') {
      const dir = safePath(body.path || '');
      if (!dir) return send(res, 400, { ok: false, error: 'path escapes project root' });
      const entries = fs.readdirSync(dir, { withFileTypes: true }).map((e) => ({
        name: e.name,
        dir: e.isDirectory(),
      }));
      log(who, `inspect ${body.path || '.'}`, `${entries.length} entries`);
      return send(res, 200, { ok: true, path: path.relative(PROJECT_ROOT, dir) || '.', entries });
    }

    if (url.pathname === '/api/read') {
      const file = safePath(body.path);
      if (!file) return send(res, 400, { ok: false, error: 'path escapes project root' });
      const stat = fs.statSync(file);
      if (!stat.isFile()) return send(res, 400, { ok: false, error: 'not a file' });
      if (stat.size > READ_CAP_BYTES) return send(res, 400, { ok: false, error: 'file too large' });
      const content = fs.readFileSync(file, 'utf8');
      log(who, `read ${body.path}`, `${content.length} chars`);
      return send(res, 200, { ok: true, path: body.path, content });
    }

    if (url.pathname === '/api/test' || url.pathname === '/api/build') {
      const cmd = url.pathname === '/api/test' ? ['test'] : ['run', 'build'];
      log(who, `run npm ${cmd.join(' ')}`, 'started');
      const result = await runNpm(cmd, 5 * 60 * 1000);
      log(who, `run npm ${cmd.join(' ')}`, `exit ${result.exitCode}`);
      return send(res, 200, { ok: true, exitCode: result.exitCode, output: result.output });
    }

    if (url.pathname === '/api/edit/propose') {
      const file = safePath(body.path);
      if (!file) return send(res, 400, { ok: false, error: 'path escapes project root' });
      if (typeof body.oldText !== 'string' || typeof body.newText !== 'string') {
        return send(res, 400, { ok: false, error: 'oldText and newText required' });
      }
      let current = '';
      try {
        current = fs.readFileSync(file, 'utf8');
      } catch {
        return send(res, 400, { ok: false, error: 'cannot read target file' });
      }
      if (!current.includes(body.oldText)) {
        return send(res, 409, { ok: false, error: 'oldText not found — file changed since proposal' });
      }
      const confirmationId = crypto.randomBytes(16).toString('hex');
      pendingEdits.set(confirmationId, {
        path: file,
        rel: body.path,
        oldText: body.oldText,
        newText: body.newText,
        expiresAt: Date.now() + CONFIRM_TTL_MS,
      });
      log(who, `edit/propose ${body.path}`, `confirmation ${confirmationId.slice(0, 8)}`);
      return send(res, 200, {
        ok: true,
        confirmationId,
        diffPreview: simpleDiff(body.oldText, body.newText),
        expiresInSec: CONFIRM_TTL_MS / 1000,
      });
    }

    if (url.pathname === '/api/edit/confirm') {
      const pending = pendingEdits.get(body.confirmationId);
      if (!pending || pending.expiresAt < Date.now()) {
        pendingEdits.delete(body.confirmationId);
        return send(res, 410, { ok: false, error: 'confirmation expired or unknown' });
      }
      pendingEdits.delete(body.confirmationId);
      const current = fs.readFileSync(pending.path, 'utf8');
      if (!current.includes(pending.oldText)) {
        log(who, `edit/confirm ${pending.rel}`, 'conflict');
        return send(res, 409, { ok: false, error: 'file changed since proposal — edit NOT applied' });
      }
      fs.writeFileSync(pending.path, current.replace(pending.oldText, pending.newText));
      log(who, `edit/confirm ${pending.rel}`, 'applied');
      return send(res, 200, { ok: true, applied: true, path: pending.rel });
    }

    return send(res, 404, { ok: false, error: 'unknown endpoint' });
  } catch (err) {
    log(who, `${req.method} ${req.url}`, 'error: ' + err.message);
    return send(res, 500, { ok: false, error: err.message });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`OCG Tool Bridge v${VERSION} listening on 127.0.0.1:${PORT}`);
  console.log(`Project root: ${PROJECT_ROOT} (${ROOT_SOURCE})`);
  if (TOKEN_IS_NEW) {
    console.log('');
    console.log('FIRST RUN — your bridge token (paste into TED once):');
    console.log('');
    console.log('    ' + TOKEN);
    console.log('');
  } else {
    console.log('Token loaded from .bridge-token (delete it to rotate).');
  }
  console.log('Policy: local-only · root-jailed · allowlisted commands · two-step edits · no delete/deploy.');
});
