# OCG Tool Bridge — Protocol & Governance

The Tool Bridge is the governed execution path between TED (running in the
founder's browser) and the founder's own machine. TED is a static web app:
he cannot touch the filesystem or run processes. The bridge is a small,
auditable Node.js server the founder runs explicitly. Without it, TED's
execution tools report "not connected" — honestly.

## Running it

```sh
cd os/tool-bridge
node bridge.js --project /path/to/project [--port 3777]
```

On first run it prints a token. The founder pastes it into TED once (TED
asks in the conversation, stores it in the browser's localStorage). The
bridge binds `127.0.0.1` only — it is unreachable from the network.

## Protocol

All `POST /api/*` calls require the `X-Bridge-Token` header.
`GET /health` needs no token (safe discovery).

| Method | Path | Body | Effect |
|---|---|---|---|
| GET | /health | — | `{ok, version, capabilities[], projectRoot, policy}` |
| POST | /api/inspect | `{path?}` | List files under path (within root) |
| POST | /api/read | `{path}` | File content (100 KB cap, text only) |
| POST | /api/test | — | Run `npm test` in project root, return output |
| POST | /api/build | — | Run `npm run build` in project root, return output |
| POST | /api/edit/propose | `{path, oldText, newText}` | Returns `{confirmationId, diffPreview}`, expires in 10 min |
| POST | /api/edit/confirm | `{confirmationId}` | Applies the proposed edit once |

## Governance (non-negotiable)

1. **Local-only.** Binds `127.0.0.1`. No remote access, ever.
2. **Root jail.** Every path resolves inside the configured project root;
   `..` escapes are rejected.
3. **Command allowlist.** The bridge runs exactly two commands: `npm test`
   and `npm run build`, in the project root. No arbitrary execution.
4. **Two-step mutation.** `edit/propose` never writes. `edit/confirm`
   applies a proposed edit once, then the confirmation dies. The founder
   confirms in the TED conversation ("yes, apply it") before TED calls
   confirm.
5. **No destructive operations.** Delete, deploy, credential access, and
   billing are NOT implemented in the bridge — by design, not by omission.
   TED must never claim them.
6. **Audit log.** Every call is logged to the bridge console with a
   timestamp: who (token prefix), what, and the result.
7. **Token.** Generated on first run, stored beside the script
   (`.bridge-token`, never committed). The founder can rotate it by
   deleting the file and restarting.

## TED's truth standard over this bridge

- "I found…" — only after inspect/read returned.
- "I changed…" — only after edit/confirm returned success.
- "Tests pass…" — only after /api/test returned passing output.
- "Deployed…" — never via the bridge (not implemented).

When the bridge isn't running, TED says exactly that and offers the
one-line command to start it. He never simulates a result.
