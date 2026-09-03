export interface ProductCommercializationTemplate {
  id: string;
  productType: 'PLAYBOOK' | 'AI PRO' | 'AI SUPER PRO' | 'CALCULATOR / TOOL';
  owner: string;
  qaOwner: string;
  stages: string[];
  completionGate: string;
}

export const PRODUCT_COMMERCIALIZATION_TEMPLATES: ProductCommercializationTemplate[] = [
  {
    id: 'pt-playbook',
    productType: 'PLAYBOOK',
    owner: 'Piper / Mira',
    qaOwner: 'Quincey / Hunter',
    stages: ['Master parity', 'Reader QA', 'Access guide / fulfillment', 'Listing package', 'Channel adaptation', 'Buyer access QA'],
    completionGate: 'Interactive reader and buyer fulfillment are verified on every approved live channel.'
  },
  {
    id: 'pt-ai-pro',
    productType: 'AI PRO',
    owner: 'Victor / Piper',
    qaOwner: 'Quincey / Sentinel',
    stages: ['Application QA', 'Onboarding', 'Authentication / credentials', 'Entitlement', 'Pricing model', 'Support route', 'Production health'],
    completionGate: 'Buyer can purchase, onboard, authenticate safely, reach the working product, and obtain support.'
  },
  {
    id: 'pt-ai-super-pro',
    productType: 'AI SUPER PRO',
    owner: 'Aiden / Victor',
    qaOwner: 'Quincey / Sentinel',
    stages: ['Premium product QA', 'Install / configuration', 'Integrations', 'Persistent agent behavior', 'Privacy / security', 'Entitlement', 'Support / update policy'],
    completionGate: 'Configured customer environment works end-to-end with verified integrations, governance, privacy, and support.'
  },
  {
    id: 'pt-calculator-tool',
    productType: 'CALCULATOR / TOOL',
    owner: 'Victor / Piper',
    qaOwner: 'Hunter / Quincey',
    stages: ['Calculation correctness', 'Input validation', 'Mobile usability', 'Output clarity', 'Disclaimer', 'Buyer access', 'Version policy'],
    completionGate: 'Calculations are independently verified and the buyer can use the tool reliably on supported devices.'
  }
];
