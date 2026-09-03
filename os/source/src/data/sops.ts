import { SOPItem } from '../types';

export const SOPS_DATA: SOPItem[] = [
  {
    id: 'sop-underwriting-70-arv',
    code: 'SOP-UW-001',
    title: '70% ARV Maximum Allowable Offer (MAO) Standard',
    category: 'Underwriting',
    readingTime: '4 min read',
    lastUpdated: 'August 2026',
    summary: 'Standardized procedure for evaluating single-family and small multi-family deals in Wichita & Kansas markets.',
    checklistItems: [
      'Pull minimum 3 comparable sales within 0.75 miles sold in the last 180 days.',
      'Verify After Repair Value (ARV) using square footage median price basis.',
      'Conduct 14-point exterior foundation & roof visual assessment.',
      'Calculate MAO = (ARV × 0.70) - Estimated Rehab - $3,000 Risk Reserve Buffer.',
      'Confirm Debt Service Coverage Ratio (DSCR) is above 1.25 for buy-and-hold projects.'
    ],
    sections: [
      {
        title: '1. Objective & Scope',
        content: 'This procedure establishes the required math and verification steps for all preliminary purchase offers issued by OCG acquisition agents.'
      },
      {
        title: '2. Calculation Formula',
        content: 'MAO = (ARV × 0.70) - Estimated Rehab - $3,000 Risk Reserve Buffer. No agent is authorized to override this formula without Managing Director approval.'
      },
      {
        title: '3. Physical Walkthrough Verification',
        content: 'All offers generated under this SOP are preliminary and must contain the disclaimer: "Subject to physical walkthrough verification and final scope agreement."'
      }
    ]
  },
  {
    id: 'sop-ops-intake-state-machine',
    code: 'SOP-OPS-002',
    title: 'Lead Intake & SLA Escalation Protocol',
    category: 'Operations',
    readingTime: '6 min read',
    lastUpdated: 'July 2026',
    summary: 'Workflow for processing seller inquiries, automated ticket creation, and 15-minute response SLA tracking.',
    checklistItems: [
      'Confirm receipt of intake inquiry and verify contact phone/email.',
      'Generate unique ticket reference ID (OCG-XXXXXX).',
      'Assign intake ticket to designated regional acquisition rep within 5 minutes.',
      'Log preliminary property address in Deal Analyzer for 70% ARV check.',
      'Send preliminary offer or schedule walkthrough within 15 minutes.'
    ],
    sections: [
      {
        title: '1. Intake Pipeline Overview',
        content: 'Every inbound inquiry must transition from NEW to PRELIMINARY_OFFER_READY within 15 minutes during standard operating hours.'
      },
      {
        title: '2. SLA Violations',
        content: 'Inquiries unassigned after 10 minutes trigger an automated SMS notification to the Operations Director.'
      }
    ]
  },
  {
    id: 'sop-ai-vision-inspection',
    code: 'SOP-AI-003',
    title: 'Multimodal Photo Inspection & Rehab Classification',
    category: 'AI & Automation',
    readingTime: '5 min read',
    lastUpdated: 'August 2026',
    summary: 'Guidelines for running walkthrough photos through Westin AI Vision for automated repair estimate generation.',
    checklistItems: [
      'Capture minimum 2 photos per room + foundation walls + main electrical panel.',
      'Upload image batch to Property Evaluator AI Vision tab.',
      'Review AI repair category tags (Foundation, Roof, Cosmetic, HVAC, Electrical).',
      'Cross-check AI cost estimate against local contractor benchmark matrix.',
      'Export verified Rehab Scope into Deal Analyzer input panel.'
    ],
    sections: [
      {
        title: '1. Human-in-the-Loop Safeguards',
        content: 'AI photo classification provides an initial estimate range. An acquisition rep must review and confirm category tags before finalizing the underwriting brief.'
      }
    ]
  },
  {
    id: 'sop-growth-scale-playbook',
    code: 'SOP-GRO-004',
    title: 'Multi-Market Acquisition Scaling Framework',
    category: 'Growth',
    readingTime: '7 min read',
    lastUpdated: 'June 2026',
    summary: 'Step-by-step playbook for expanding OCG deal analyzer tools into adjacent county submarkets.',
    checklistItems: [
      'Ingest county tax assessor parcel data into local database cache.',
      'Calibrate median price per sqft thresholds by ZIP code.',
      'Recalibrate regional contractor labor rate multipliers.',
      'Test 50 historical sample deals against deterministic underwriting engine.',
      'Grant regional team access to custom submarket portal.'
    ],
    sections: [
      {
        title: '1. Market Expansion Criteria',
        content: 'A new submarket is approved for expansion once historical deal backtesting achieves 100% mathematical consistency with ground-truth closing records.'
      }
    ]
  }
];
