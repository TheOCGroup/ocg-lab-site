import { DecisionRecord } from '../types';

export const DECISIONS_DATA: DecisionRecord[] = [
  {
    id: 'd1',
    title: 'OCG LAB OS is the internal Technology Department Operating System.',
    why: 'Distinct from parent OCG OS, OCG MEDIA OS (NOVA), MAESTRO, and PIPELINE. It runs engineering, portfolio, agents, QA, and releases.',
    date: '2026-09-02',
    scope: 'Architecture'
  },
  {
    id: 'd2',
    title: 'The OCG Lab is the primary commercial priority.',
    why: 'The OC Group larger internal systems remain paused while The OCG Lab products commercialize and generate immediate capital.',
    date: '2026-01-12',
    scope: 'Company'
  },
  {
    id: 'd3',
    title: 'Strict Recovery Before Creation rule enforced across all systems.',
    why: 'Prevents fragmentation, eliminates parallel duplicate apps, and reuses existing GitHub repositories, Vercel projects, and databases.',
    date: '2026-09-02',
    scope: 'Engineering'
  },
  {
    id: 'd4',
    title: 'Insurance Agent AI Playbook is the master digital playbook chassis.',
    why: 'All subsequent playbooks must inherit its book-style cover, two-page layout, prompt vault, and implementation guidance.',
    date: '2026-08-25',
    scope: 'Product'
  },
  {
    id: 'd5',
    title: 'Independent QA must test and verify before any release certification.',
    why: 'Builders do not self-approve important work. Releases require commit SHAs, public HTTPS verification, and evidence.',
    date: '2026-08-30',
    scope: 'QA & Release'
  },
  {
    id: 'd6',
    title: 'Cost Control & Capital Protection mandate.',
    why: 'Zero new paid subscriptions or cloud resources without prior founder authorization. Reuses existing Cloud Run, Vercel, and GitHub resources.',
    date: '2026-09-02',
    scope: 'Governance'
  }
];
