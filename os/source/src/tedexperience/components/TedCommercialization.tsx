import React from 'react';
import { TED_IDENTITY } from '../../data/tedDepartment';

const gates = [
  ['Customer isolation', 'NOT VERIFIED'],
  ['Billing and subscriptions', 'NOT VERIFIED'],
  ['Actual provider cost ingestion', 'NOT VERIFIED'],
  ['$0.50 model-task approval enforcement', 'NOT VERIFIED'],
  ['Receptionist end-to-end call QA', 'NOT VERIFIED'],
  ['Real estate CRM and underwriting QA', 'NOT VERIFIED'],
  ['Independent QUINCEY certification', 'NOT VERIFIED'],
] as const;

const training = [
  ['TED', 'Lead qualification, proposals, onboarding'],
  ['MARK', 'Campaign attribution and approved outreach'],
  ['MUSE', 'Build, test, rollback and release'],
  ['QUINCEY', 'Independent evaluation and evidence'],
  ['PIPER', 'Seller follow-up drafts and approval'],
  ['VICTOR', 'Source-backed property underwriting'],
  ['AIDEN', 'Founder status and escalation'],
] as const;

export const TedCommercialization: React.FC<{onBack: () => void}> = ({onBack}) => (
  <section className="mx-auto max-w-5xl space-y-6 px-5 py-7 text-slate-900" aria-label="Commercialization operations">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="text-xs font-bold uppercase tracking-widest text-emerald-700">OCG LAB / TED</p><h1 className="text-2xl font-bold">Commercialization control</h1><p className="text-sm text-slate-600">Read-only launch readiness. Unconnected metrics are never treated as zero.</p></div>
      <button type="button" onClick={onBack} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-50">Back to TED</button>
    </div>
    <div className="grid gap-3 sm:grid-cols-3">
      {([['Verified monthly spend','STATUS UNAVAILABLE'],['Verified recurring revenue','STATUS UNAVAILABLE'],['Agent executions',String(TED_IDENTITY.executionStats.totalRuns) + ' TED runs recorded']] as const).map(([label,value]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-semibold text-slate-600">{label}</p><p className="mt-2 text-lg font-bold text-blue-800">{value}</p></div>)}
    </div>
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 p-5"><h2 className="font-bold">Release requirements</h2><p className="mt-1 text-xs text-slate-600">Evidence required before any paid customer launch.</p><ul className="mt-3 divide-y divide-slate-100">{gates.map(([name,status]) => <li key={name} className="flex items-center justify-between gap-3 py-2 text-sm"><span>{name}</span><span className="shrink-0 text-xs font-bold text-amber-700">{status}</span></li>)}</ul></div>
      <div className="rounded-xl border border-slate-200 p-5"><h2 className="font-bold">Agent workflow curriculum</h2><p className="mt-1 text-xs text-slate-600">Documented training targets; no certification implied.</p><ul className="mt-3 divide-y divide-slate-100">{training.map(([name,scope]) => <li key={name} className="py-2 text-sm"><span className="font-bold text-blue-800">{name}</span><span className="ml-2 text-slate-700">{scope}</span><div className="text-xs font-semibold text-amber-700">NOT TESTED</div></li>)}</ul></div>
    </div>
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-slate-800"><strong>Cost policy:</strong> Track model tokens, voice minutes, SMS, hosting, storage, payment fees, support time and per-customer margins. The $0.50 per-task approval threshold is a requirement, not verified runtime enforcement. Connect audited provider invoices and usage records before displaying totals.</div>
    <p className="text-xs text-slate-500">Source: OCG LAB productization governance draft (2026-10-14). This panel does not ingest live billing, certify agents or execute tasks.</p>
  </section>
);
