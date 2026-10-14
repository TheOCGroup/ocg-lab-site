import React from 'react';
import { ArrowLeft, ArrowUpRight, Boxes, Building2, Clapperboard, ClipboardList, ShieldCheck, Workflow } from 'lucide-react';

type Workspace = { id:string; name:string; lead:string; detail:string; status:string; href?:string; local?: 'projects'|'command'|'operations' };
const workspaces:Workspace[] = [
 {id:'aiden',name:'MY COO',lead:'AIDEN / CHIEF',detail:'Founder command, assignments, priorities, and approvals.',status:'Existing command workspace · cross-app actions unverified',local:'command'},
 {id:'acquisitions',name:'ACQUISITIONS',lead:'HUNTER / VICTOR',detail:'Deal discovery, underwriting, and approval before seller handoff.',status:'Separate build passed local QA · live connection not certified'},
 {id:'pipeline',name:'SELLER OPERATIONS',lead:'PIPER / PIPELINE',detail:'Seller history, tasks, offer review, and governed follow-ups.',status:'Separate service · authenticated connection not certified'},
 {id:'media',name:'OCG MEDIA',lead:'ORION / NOVA',detail:'Renovation renderings, creative briefs, video and campaign workflows.',status:'Separate build passed local QA · connection not certified'},
 {id:'lab',name:'OCG LAB',lead:'TED',detail:'Client discovery, products, software development and fulfillment.',status:'Current workspace · cloud sync certification pending',local:'projects'},
 {id:'workforce',name:'WORKFORCE',lead:'CHIEF / QUINCEY',detail:'Approvals, cost-aware execution, quality evidence and audit trail.',status:'Governance interfaces exist · orchestration not certified',local:'operations'},
];
const icons=[Workflow,Building2,ClipboardList,Clapperboard,Boxes,ShieldCheck];
export function UnifiedWorkspacePage({onBack,onNavigate}:{onBack:()=>void;onNavigate:(page:'projects'|'command'|'operations')=>void}){
 return <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
  <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
   <button onClick={onBack} className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700"><ArrowLeft size={16}/> Back to TED</button>
   <span className="font-mono text-xs font-semibold uppercase tracking-[.22em] text-blue-700">The OC Group · Founder workspace</span>
   <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">One platform. Six workspaces.</h1>
   <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">The existing OCG systems are organized here in TED's clean interface. Verified internal workspaces open directly. External systems remain identified as separate until authenticated integrations are proven—no simulated connections or fabricated statuses.</p>
   <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {workspaces.map((w,i)=>{const Icon=icons[i];return <section key={w.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon size={21}/></div>
      <h2 className="text-xl font-bold">{w.name}</h2><div className="mt-1 text-xs font-semibold uppercase tracking-widest text-blue-700">{w.lead}</div>
      <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{w.detail}</p>
      <div className="my-5 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">{w.status}</div>
      {w.local ? <button onClick={()=>onNavigate(w.local!)} className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-blue-800">Open existing workspace <ArrowUpRight size={16}/></button> :
       <div className="rounded-xl border border-slate-200 px-4 py-3 text-xs font-medium text-slate-500">Integration pending · source application preserved</div>}
    </section>})}
   </div>
   <p className="mt-8 text-xs leading-6 text-slate-500">Integration policy: share canonical IDs and verified activity receipts; protect seller and client data; require approval for consequential actions. A navigation hub is not evidence that remote systems share data yet.</p>
  </div>
 </div>;
}
