# OCG LAB Credential & Connection Automation

## Goal

Reduce Founder involvement in routine technical setup. OCG LAB Technology Operations should be able to connect, validate, repair, refresh, and maintain APIs, OAuth integrations, MCP/tool servers, webhooks, service accounts, environment configuration, and deployment credentials without repeatedly asking the Founder to copy keys between dashboards.

The Founder should only be interrupted for actions that truly require account ownership, human consent, legal acceptance, payment, or irreversible security changes.

## Current Baseline Finding

The canonical `TheOCGroup/ocg-lab-site` repository currently exposes no repository-level GitHub Actions secrets and no repository-level Actions variables through the connected GitHub account. This means the repository itself is not yet serving as an operational credential store for the OCG LAB technical agents.

That is not a reason to paste secrets into source control. It is a reason to establish a governed secret-management and delegated-access model.

## Target Architecture

`FOUNDER OWNERSHIP -> GOVERNED SECRET STORE -> SERVICE ACCOUNTS / OAUTH CONNECTIONS -> AGENT TOOL LAYER -> RUNTIME ENVIRONMENTS -> HEALTH CHECKS -> AUTO-REPAIR`

The technical agents should work through controlled credentials, not by asking the Founder for raw secret values on every task.

## Credential Classes

### 1. Managed Connector Credentials
Examples: Composio-connected GitHub, Whop, Gmail, Google Workspace, Slack, Meta, other supported services.

Rules:
- Prefer OAuth or managed connectors over raw API keys when available.
- The Founder completes the initial consent once.
- After connection, agents may use the granted account and scopes for routine reads/writes within approved boundaries.
- Agents should monitor connection state and detect expiry/revocation.
- If re-authentication is needed, surface one precise reconnect action rather than asking for individual secret values.

### 2. Service Accounts
Examples: Google Cloud service accounts, machine users, CI identities, deployment bots.

Rules:
- Use dedicated non-human identities where providers support them.
- Grant only the permissions required for the job.
- Prefer workload identity / short-lived credentials over long-lived downloaded keys.
- Agents may use approved service accounts for deployments, storage, databases, queues, logs, and automation.
- Human personal accounts should not be the default production runtime identity.

### 3. Secret-Store Credentials
Examples: provider API keys, webhook signing secrets, database URLs, encryption keys.

Rules:
- Store secrets only in an approved secret manager or protected runtime secret store.
- Never place raw values in GitHub files, client bundles, browser localStorage, query strings, screenshots, chat transcripts, or ordinary documentation.
- Repository documentation may contain secret *names* and ownership metadata only.
- Agents should reference secrets by logical name and target environment.

### 4. User-Consent OAuth Connections
Examples: Gmail, Calendar, Meta, YouTube, banking/payment services, other user-authorized platforms.

Rules:
- Initial account authorization may require the Founder or account owner.
- Once authorized, agents may maintain and use the connection within the granted scope.
- Refresh-token renewal should be automatic when the provider allows it.
- Revoked or under-scoped connections should be detected automatically.
- Agents should request a new consent click only when the provider requires it.

## Credential Registry

Technology Operations must maintain a non-secret registry with one row per dependency:

- system/product
- provider
- credential type
- logical credential name
- owner account or service identity
- target environment
- required scopes/roles
- connector/tool used
- expiration model
- rotation policy
- current state
- last functional check
- last end-to-end check
- recovery method
- Founder action required: yes/no

Raw secret values never belong in this registry.

## Delegated Agent Authority

Technology agents ARE authorized to perform routine technical maintenance when the necessary access already exists.

This includes:
- inspect configured secret names and environment variables
- connect an already-authorized tool account to the correct workflow
- repair callback URLs, webhook endpoints, scopes, redirect URIs, and configuration drift
- update non-secret environment variables
- test APIs and MCP tools
- retry failed connections
- refresh supported OAuth sessions
- redeploy after configuration repair
- rotate provider-generated non-human credentials when an approved automated rotation mechanism exists
- revoke obsolete machine credentials after replacement is verified
- update webhook signing configuration where both sides are under OCG LAB control
- verify production reads/writes after changes
- maintain logs and evidence

## Founder Approval Boundary

The Founder should only be interrupted when an action requires one of the following:

- first-time OAuth/account consent
- MFA, CAPTCHA, passkey, or one-time verification code
- acceptance of provider legal terms
- creation of a paid account or purchase
- increasing billing/spend limits
- domain registrar ownership confirmation
- irreversible account deletion
- destructive production-data actions
- security-sensitive master credential rotation where no automated recovery path exists
- granting materially broader privileged scopes than previously approved

When blocked, the agent reports exactly one required action and continues all other work autonomously.

## No Repeated Secret Copying

Once a credential is placed into the approved secret-management system, the Founder should not have to copy it again for normal operations.

Agents should:
1. identify the logical secret required
2. check whether it exists in the target environment
3. verify the consuming service can read it
4. validate the API/tool connection
5. repair configuration if broken
6. only escalate if the secret truly does not exist or must be reissued by the account owner

## Environment Strategy

At minimum, distinguish:
- production
- preview/staging when genuinely needed
- local development

Do not create unnecessary environments or deployments merely for testing.

Credentials should be scoped by environment. Production secrets must not be automatically exposed to preview deployments unless explicitly required and approved.

## Automatic Connection Health Checks

The technical layer should continuously or routinely verify:

- connector still active
- token accepted
- required scopes present
- API endpoint reachable
- representative read succeeds
- representative safe write succeeds where applicable
- webhook delivery succeeds
- MCP schema loads
- tool execution returns expected shape
- environment variable exists
- runtime can resolve it
- callback/redirect URL still matches deployed domain
- rate-limit/quota status is healthy
- provider version/deprecation notices do not break the integration

## Automatic Repair Actions

Without Founder interruption, agents should be able to:

- refresh reconnectable sessions
- rebind a connector to the correct account
- repair stale callback URLs
- recreate broken non-sensitive webhooks
- resubscribe webhook endpoints
- update endpoint versions
- correct non-secret environment configuration
- restart/redeploy affected services
- roll back a bad deployment
- update MCP schemas/tool mappings after verified provider changes
- re-run migrations or jobs only when safe and non-destructive
- replace expiring machine credentials through approved automation

All repairs must be followed by an actual functional test.

## Secret Rotation

Rotation must be staged:

1. issue replacement credential
2. store replacement securely
3. update consumers
4. verify production functionality
5. revoke old credential
6. record evidence

Never revoke the currently working credential before the replacement path is verified unless the credential is actively compromised.

## Break-Glass Security

For compromised credentials:
- immediately contain exposure
- disable/revoke affected key/token when safe
- identify systems using it
- issue replacement
- redeploy consumers
- verify end to end
- document incident

Security containment takes precedence over normal release flow.

## Agent Experience Standard

The Founder experience should become:

**Normal case:** no interruption.

**Reconnect case:** one consent/reconnect click.

**Security case:** one clearly explained approval/action.

The Founder should not be asked to manually shuttle API keys, copy environment variables between dashboards, interpret OAuth scopes, debug MCP schemas, or repeatedly configure the same integration.

## Implementation Priority

1. Inventory every active OCG LAB system and its external dependencies.
2. Establish one approved secret-management pattern for production credentials.
3. Replace Founder-personal runtime credentials with service accounts where practical.
4. Connect OAuth-capable services through managed connectors.
5. Add connection-state monitoring.
6. Add autonomous repair playbooks.
7. Add end-to-end verification after every credential/config repair.
8. Keep one Founder escalation path only for genuine human-required actions.

## Definition of Done

Credential automation is operational when a routine API/MCP/auth failure can be detected, diagnosed, repaired, redeployed, and verified by the technology agents without asking the Founder to locate or paste a secret, except where the external provider genuinely requires human account-owner participation.
