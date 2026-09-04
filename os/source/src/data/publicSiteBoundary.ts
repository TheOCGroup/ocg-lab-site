export type PublicSiteCapability =
  | 'PRODUCT_CATALOG_READ'
  | 'PRODUCT_ACCESS_REQUEST'
  | 'COMMERCIAL_STATUS_READ'
  | 'SUPPORT_REQUEST_CREATE';

export const PUBLIC_SITE_INTEGRATION_BOUNDARY = {
  publicSurface: {
    role: 'OCG LAB PUBLIC SITE / COMMERCIAL PRODUCT SURFACE',
    canonicalRepository: 'TheOCGroup/ocg-lab-site',
    canonicalProductionOrigin: 'https://ocg-lab-products.vercel.app',
    mayRequest: [
      'PRODUCT_CATALOG_READ',
      'PRODUCT_ACCESS_REQUEST',
      'COMMERCIAL_STATUS_READ',
      'SUPPORT_REQUEST_CREATE',
    ] as PublicSiteCapability[],
  },
  internalSystem: {
    role: 'OCG LAB TECHNOLOGY DEPARTMENT OPERATING SYSTEM',
    route: '/os/',
    hierarchy: ['FOUNDER', 'AIDEN', 'OCG LAB TECHNOLOGY DIRECTOR', 'SPECIALIST WORKFORCE', 'GOVERNED TOOLS', 'INDEPENDENT QA'],
  },
  integrationRules: [
    'Public commercial surfaces integrate through explicit APIs, registries, or shared services only.',
    'Public clients never receive unrestricted internal workspace, audit-ledger, or orchestration permissions.',
    'Service identities are least-privilege and scoped to an explicit capability.',
    'Plaintext secrets, provider credentials, founder keys, and broad agent context never cross into public UI payloads.',
    'Consequential service-to-service writes require authenticated identity, authorization policy, audit evidence, and read-back verification.',
    'The public site may request work; it may not impersonate Aiden, the Technology Director, or a specialist.',
  ],
  forbiddenPublicScopes: [
    'INTERNAL_STATE_READ_ALL',
    'INTERNAL_STATE_WRITE_ALL',
    'AUDIT_LEDGER_WRITE_DIRECT',
    'FOUNDER_AUTH_MATERIAL',
    'PROVIDER_SECRET_READ',
    'UNRESTRICTED_TOOL_EXECUTION',
    'WORKFORCE_ADMIN',
  ],
  accountability: [
    'repositories',
    'deployments',
    'APIs/MCPs',
    'databases',
    'integration architecture',
    'security posture',
    'secrets handling',
    'QA',
    'observability',
    'technical debt',
    'workforce currency',
  ],
} as const;

export function isPublicCapabilityAllowed(capability: string): capability is PublicSiteCapability {
  return (PUBLIC_SITE_INTEGRATION_BOUNDARY.publicSurface.mayRequest as readonly string[]).includes(capability);
}
