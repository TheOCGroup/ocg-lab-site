# The OCG Lab Product Access

Canonical public HTTPS commercial/product-delivery surface for **OCG LAB**.

## System boundary

This repository's public root and commercial product routes are the **OCG LAB public site / commercial surface**. They are not an unrestricted control surface for the internal Technology Department operating system.

The internal OCG LAB OS remains logically isolated under `/os/` and follows this command chain:

**Founder → Aiden → OCG LAB Technology Director → specialist workforce → governed tools → independent QA**

Public product pages may integrate with internal capabilities only through explicit, least-privilege APIs, registries, or shared services. Public clients must never receive founder authentication material, provider secrets, unrestricted internal state, direct audit-ledger writes, workforce-admin access, or unrestricted tool execution.

Canonical executable policy: `os/source/src/data/publicSiteBoundary.ts`.
