import { ExperimentRecord } from '../types';

export const EXPERIMENTS_DATA: ExperimentRecord[] = [
  {
    id: 'exp-cindy',
    name: 'CINDY — AI Research & Learning Partner',
    problem: 'Business operators cannot keep up with weekly generative AI developments and practical tooling shifts.',
    who: 'Helena & Small Business Owners',
    idea: 'A conversational research partner that tracks relevant AI tools and drafts practical implementation steps for specific businesses.',
    why: 'Validated demand with real user Helena. It is the only new concept currently permitted to advance toward active MVP testing.',
    notes: 'Initial validation user: Helena. Strict scope boundary enforced.',
    createdDate: '2026-01-19',
    stage: 'INCUBATOR'
  },
  {
    id: 'exp-maestro-diy',
    name: 'MAESTRO DIY — Computer Vision Apprenticeship',
    problem: 'DIYers lack real-time feedback when performing complex physical cuts, drilling, and joint alignments.',
    who: 'Woodworkers, Remodelers, Makers',
    idea: 'Smartphone camera computer vision coaching overlay validating cut kerfs and dado depths before irreversible actions.',
    why: 'Heirloom craftsmanship coaching at zero marginal cost.',
    notes: 'Remains incubated until core OCG LAB releases are fully commercialized.',
    createdDate: '2026-02-02',
    stage: 'INCUBATOR'
  },
  {
    id: 'exp-business-builder',
    name: 'Business Builder — AI Entrepreneurship Studio',
    problem: 'First-time founders struggle to move from domain expertise to validated business models, storefronts, and automated workflows.',
    who: 'Aspiring Entrepreneurs & Trade Specialists',
    idea: 'Guided 5-stage studio: Discover -> Validate -> Build -> Launch -> Grow with dedicated AI advisors.',
    why: 'Scalable commercial incubation engine for non-technical creators.',
    notes: 'Remains incubated until Phase 5 release gates clear.',
    createdDate: '2026-02-02',
    stage: 'INCUBATOR'
  }
];
