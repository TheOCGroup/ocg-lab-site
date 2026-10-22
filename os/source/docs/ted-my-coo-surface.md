# TED Surface in My COO — Minimal Truthful Visibility

**Status:** design spec for the execution lane. Scope: `TheOCGroup/chatbot` (My COO). Any routing/contract change needed to add TED is **ASTRA's lane** — this spec describes the visible surface only.

**Reference:** My COO is the canonical founder-facing Aiden surface (PR #82 merged). The Agent Floor already uses a governed 9-term status vocabulary and the 4-field blocked-response standard (`Blocked by / Completed / Solution / Need from Founder`).

---

## 1. What TED is in My COO

TED ("Ted the Tech Guy") appears as the **OCG LAB department head** in the Agent Floor roster, alongside the existing 12 agents. He is one entry with:

- Name: Ted the Tech Guy
- Role: OCG LAB Department Head
- Status: governed vocabulary (STANDBY until a real task executes; ACTIVE only while executing)
- Scope line: "Owns the OCG LAB commercial lifecycle — products, readiness, deployments, commerce truth."
- Coordination line: "Coordinates MARK / ORION / NOVA — never impersonates them."

He does NOT get a developer console, a code editor, a deploy button, or any infrastructure control. My COO stays the founder's operating surface, not a builder IDE.

## 2. Dispatch path (end-to-end acceptance)

```
Founder asks AIDEN → CHIEF routes → TED returns a visible, verified result
```

- Founder language about LAB products, readiness, deployments, or commerce resolves to TED (via `resolveTedIntent` in the query layer).
- TED's replies render in the existing Aiden input/result surface using the 4-field blocked-response standard where applicable.
- TED_TASK intents return a governed QUEUED task object — visible, honest, never claimed as executed.

## 3. What TED surfaces must show

- Product status: from the TED knowledge base (8 products, 0 verified checkouts).
- Commerce status: honest STATUS UNAVAILABLE panels until verified sources exist.
- Deploy status: sync-timeout patch BLOCKED with the founder-only unblock step.
- Blockers: use the exact 4-field standard — `Blocked by / Completed / Solution / Need from Founder`.

## 4. ASTRA-lane items (explicitly not this spec)

- Any change to agent routing architecture, API contracts, auth/session model, or handoff protocols to add TED.
- The `ocg-lab-department` departmentId addition to shared type unions (if the chatbot repo shares the DepartmentId union).
- WebRTC, secrets, or infrastructure changes: none are needed and none are authorized.

## 5. Deliberate non-goals

- TED does not appear as a separate chatbot or persona selector.
- No auto-dispatch of real agent work from TED intents — drafts/routes are visible for founder review (consistent with the existing deliberate choice that intents are drafted, not auto-sent).
- No fabrication: if the LAB workspace has no data, TED says so.
