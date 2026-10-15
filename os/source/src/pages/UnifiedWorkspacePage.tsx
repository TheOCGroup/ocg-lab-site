import React from 'react';
import { ArrowLeft, ArrowUpRight, BriefcaseBusiness, Boxes, ClipboardList, FlaskConical, ShieldCheck, Wrench } from 'lucide-react';

type Destination = 'ted'|'projects'|'engineering'|'storefronts'|'operations'|'qa';
const areas: {name:string;description:string;owner:string;destination:Destination;icon:typeof Boxes}[] = [
 {name:'Client Projects',description:'Discovery, project stages, next actions, and client deliverables.',owner:'TED',destination:'projects',icon:BriefcaseBusiness},
 {name:'Software & Engineering',description:'Build work, technical decisions, and implementation evidence.',owner:'TED',destination:'engineering',icon:Wrench},
 {name:'Products & Sales',description:'Product catalog, sales channels, and commercialization readiness.',owner:'TED',destination:'storefronts',icon:Boxes},
 {name:'LAB Operations',description:'Team responsibilities, operational workflow, and verified activity.',owner:'TED',destination:'operations',icon:ClipboardList},
 {name:'QA & Releases',description:'Quality checks, release gates, and recorded certification results.',owner:'QUINCEY',destination:'qa',icon:ShieldCheck},
];
export function UnifiedWorkspacePage({onBack,onNavigate}:{onBack:()=>void;onNavigate:(page:Destination)=>void}) {
 return <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
  <div className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
   <button onClick={onBack} className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700"><ArrowLeft size={16}/> Back to TED</button>
   <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-blue-700"><FlaskConical size={16}/> OCG LAB · TED Workspace</div>
   <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Your LAB work, in one place.</h1>
   <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">Open the part of OCG LAB you need. These are LAB tools and work areas—not a replacement for MY COO, OCG OS, or OCG MEDIA. Each destination below opens a real section in this application.</p>
   <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {areas.map(area=>{const Icon=area.icon;return <section key={area.name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
     <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon size={21}/></div>
     <h2 className="text-xl font-bold">{area.name}</h2><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{area.description}</p>
     <div className="my-4 text-xs font-semibold uppercase tracking-widest text-blue-700">Lead · {area.owner}</div>
     <button onClick={()=>onNavigate(area.destination)} className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-left text-sm font-semibold text-white hover:bg-blue-800">Open workspace <ArrowUpRight size={16}/></button>
    </section>})}
   </div>
   <p className="mt-8 text-xs leading-6 text-slate-500">Workspaces show the information their connected data supports. Unavailable integrations and unverified activity must not be presented as live.</p>
  </div>
 </div>;
}
