import { SharedCapability } from '../types';

export const SHARED_CAPABILITIES_DATA: SharedCapability[] = [
  {
    id: 'cap-gateway',
    name: 'OCG Capability Gateway',
    type: 'GATEWAY',
    description: 'Provider-agnostic routing for models, tools, external APIs, and MCP integrations with automated fallback policies.',
    status: 'ACTIVE',
    providers: ['Anthropic Claude 3.7', 'OpenAI GPT-4o', 'Google Gemini 2.0 / 1.5 Pro', 'Local SQLite Engines'],
    fallbackStrategy: 'Deterministic priority fallback: Primary Provider -> Secondary Failover -> Local Deterministic Engine -> Alert Admin',
    healthMetrics: '99.98% availability, avg 42ms dispatch latency'
  },
  {
    id: 'cap-knowledge',
    name: 'OCG Knowledge Layer',
    type: 'KNOWLEDGE',
    description: 'Centralized company intelligence preventing fragmented documentation; indexes company decisions, SOPs, and project histories.',
    status: 'ACTIVE',
    providers: ['Local Memory Vectors', 'Centralized Markdown ADRs', 'Sedgwick County Parcel Graph'],
    fallbackStrategy: 'Static Seed Documentation -> Local Browser Cache -> Real-time Vector Lookup',
    healthMetrics: '12 active SOPs, 8 canonical company ADRs indexed'
  },
  {
    id: 'cap-creative',
    name: 'OCG Creative Services',
    type: 'CREATIVE',
    description: 'Shared creative generation pipeline for photorealistic renders, video trailers, streaming avatars, and graphic assets.',
    status: 'ACTIVE',
    providers: ['Google Cloud Run NOVA Engine', 'OpenArt AI API', 'Higgsfield Motion Synthesis', 'HeyGen WebRTC'],
    fallbackStrategy: 'NOVA Cloud Run Service -> Built-in HD Local Visuals -> Placeholder Fallback',
    healthMetrics: 'Cloud Run revision nova-engine-00004-qwq active'
  },
  {
    id: 'cap-super-agent-core',
    name: 'OCG Super Agent Core',
    type: 'SUPER_AGENT_CORE',
    description: 'Reusable architectural substrate for vertical AI products: persistent memory, human-in-the-loop guardrails, and role contracts.',
    status: 'ACTIVE',
    providers: ['Piper Follow-Up Core', 'Victor Underwriting Core', 'Allie Concierge Core'],
    fallbackStrategy: 'Strict Role Boundary Enforcement -> Mandatory Human Confirmation for Outbound Writes',
    healthMetrics: '3 certified vertical instances active'
  }
];
