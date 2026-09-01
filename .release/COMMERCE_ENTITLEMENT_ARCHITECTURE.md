# OCG LAB — Commerce and Entitlement Architecture

Status: `NOT CONNECTED`  
Decision date: 2026-09-01  
Scope: OCG LAB paid products only

## Executive decision

Keep every paid application fail-closed until OCG LAB can prove the complete chain from canonical checkout to authenticated, product-scoped access. Whop is the recovered provider reference, but no canonical OCG LAB Whop company/store identity, checkout configuration, credentials, webhook endpoint, customer authentication system, or entitlement store was recovered from the inspected OCG repositories.

This document defines the minimum production architecture. It does not claim that any component is connected.

## Required trust boundary

1. A public product page starts checkout using a product mapping recovered into the canonical OCG LAB product record.
2. The commerce provider sends a server-to-server event to a public HTTPS webhook endpoint.
3. The endpoint verifies the provider signature against the raw request body before parsing or acting on the event.
4. Valid events are handled idempotently using the provider event identifier and acknowledged quickly with a 2xx response.
5. A durable worker maps provider customer + product/membership identifiers to an authenticated OCG LAB user and a product-scoped entitlement.
6. Protected applications check that entitlement at the server/session boundary. Browser redirects, local storage, query strings, and client claims never grant access.
7. Deactivation, expiration, cancellation, payment failure policy, refund, and dispute events suspend or revoke access according to the product's recorded commercial policy.
8. Every grant or revocation produces auditable evidence without logging secrets or unnecessary customer data.

## Canonical records required

| Record | Minimum fields | Current state |
| --- | --- | --- |
| Commerce provider | Provider, company/store ID, account owner, environment | `MISSING` |
| Product mapping | OCG product ID, provider product/plan/checkout IDs, access policy | `MISSING` |
| Customer identity | Internal user ID, verified email/identity link, auth provider | `MISSING` |
| Entitlement | User ID, product ID, state, source, effective/expiry timestamps | `MISSING` |
| Webhook receipt | Provider event ID/type, received/processed timestamps, outcome | `MISSING` |
| Release evidence | Test purchase, access check, revocation test, rollback point | `MISSING` |

## Event policy baseline

| Provider event/state | OCG LAB action |
| --- | --- |
| Membership activated / valid paid access | Grant or refresh the mapped product entitlement after signature, identity, and product checks pass |
| Membership deactivated, expired, or canceled at effective end | Revoke the mapped entitlement |
| Past due or payment failed | Apply the product's explicit grace/suspension policy; never silently preserve indefinite access |
| Refund or dispute | Suspend or revoke according to the recorded commercial policy and flag for review |
| Duplicate/replayed event | Return safely without applying the state transition twice |
| Invalid signature, unknown product, or unmapped customer | Reject or quarantine; do not grant access |

## Security and reliability requirements

- Store `WHOP_WEBHOOK_SECRET` and API credentials only in the canonical server environment/secret manager.
- Verify the webhook signature on the unmodified raw body using the provider-supported SDK/helper.
- Apply least-privilege credentials and separate test from production.
- Return 2xx promptly after safe receipt; move durable state processing off the request path when required.
- Encrypt data in transit and at rest; minimize retained customer and payment data.
- Rate-limit and observe the endpoint without exposing payloads or secrets in logs.
- Maintain idempotency, retry handling, an error/dead-letter path, and a documented replay procedure.
- Deny protected access when identity, mapping, entitlement state, or the entitlement service is unavailable.

## Production release gates

All gates must carry evidence, not assertions:

- Canonical Whop company/store identity recovered and approved.
- Provider product/plan IDs mapped to one canonical OCG LAB product record.
- Customer authentication and identity-linking verified.
- Signed webhook verified with valid and invalid test events.
- Durable, idempotent entitlement grant verified.
- Server-side protected-route enforcement verified.
- Cancellation/expiration revocation verified.
- Refund/dispute behavior verified.
- End-to-end provider test purchase verified.
- Rollback point, monitoring, incident owner, and security review recorded.

Until every applicable gate passes, paid application routes remain fail-closed.

## Provider references

The design above follows current official Whop documentation recovered on 2026-09-01:

- [Webhooks guide](https://docs.whop.com/developer/guides/webhooks)
- [Webhook troubleshooting](https://docs.whop.com/developer/troubleshooting)
- [Create webhook and supported events](https://docs.whop.com/api-reference/webhooks/create-webhook)
- [Membership lifecycle schema](https://docs.whop.com/api-reference/memberships/membership)
- [Membership activated event](https://docs.whop.com/api-reference/memberships/membership-activated)
- [Payment succeeded event](https://docs.whop.com/api-reference/payments/payment-succeeded)

## Explicit non-decisions

- No new database, authentication provider, Vercel project, or paid service is authorized by this architecture.
- No provider IDs, customer counts, order totals, revenue, conversion, or webhook health are inferred from hardcoded interface copy.
- OCG OS, OCG MEDIA, and OCG HOME OS remain outside this implementation scope.
