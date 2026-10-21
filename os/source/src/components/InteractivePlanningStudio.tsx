import React, { useMemo, useState } from 'react';
import { Activity, ArrowRight, Calculator, CheckCircle2, Film, ShieldAlert } from 'lucide-react';

type Scenario = 'product' | 'media';
const money = (n: number) => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
const money2 = (n: number) => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
function Range({label,value,min,max,step,onChange,unit=''}:{label:string;value:number;min:number;max:number;step:number;onChange:(n:number)=>void;unit?:string}) {
 return <label className="block space-y-2">
   <span className="flex items-center justify-between gap-2 text-sm font-medium text-slate-700"><span>{label}</span><strong className="tabular-nums text-slate-900">{unit==='money'?money(value):unit==='money2'?money2(value):value.toLocaleString()+' '+unit}</strong></span>
   <input className="w-full accent-blue-600" aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))} />
 </label>;
}
export function InteractivePlanningStudio() {
 const [scenario,setScenario]=useState<Scenario>('product');
 const [subscribers,setSubscribers]=useState(100);
 const [price,setPrice]=useState(49);
 const [churn,setChurn]=useState(5);
 const [monthlyCost,setMonthlyCost]=useState(1800);
 const [scenes,setScenes]=useState(8);
 const [attempts,setAttempts]=useState(2);
 const [credits,setCredits]=useState(80);
 const [pricePerCredit,setPricePerCredit]=useState(0.1);
 const [approval,setApproval]=useState(false);
 const revenue=subscribers*price;
 const lostSubscribers=Math.round(subscribers*churn/100);
 const margin=revenue-monthlyCost;
 const renderCredits=scenes*attempts*credits;
 const renderCost=renderCredits*pricePerCredit;
 const summary=useMemo(()=> scenario==='product'
  ? `TED scenario: ${subscribers} subscribers at $${price}/month, estimated MRR ${money(revenue)}, operating surplus ${money(margin)}, and approximately ${lostSubscribers} churned customers/month at ${churn}% churn. Values are hypothetical; validate actual billing and expenses before use.`
  : `ORION scenario: ${scenes} scenes, ${attempts} attempts per scene, ${credits} credits per attempt = ${renderCredits.toLocaleString()} credits at an assumed ${money2(pricePerCredit)} per credit, estimated ${money(renderCost)}. ${approval?'Planning checklist acknowledged; this does not authorize or start rendering.':'Storyboard approval required before any rendering.'}`
 , [scenario,subscribers,price,churn,revenue,margin,lostSubscribers,scenes,attempts,credits,renderCredits,renderCost,pricePerCredit,approval]);
 return <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-label="Interactive planning studio">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div><p className="text-xs font-bold uppercase tracking-widest text-blue-700">Interactive Intelligence · scenario modeling</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Planning Studio</h2></div>
   <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">Illustrative inputs · not live data</span>
  </div>
  <p className="mt-2 text-sm leading-6 text-slate-600">Explore assumptions without changing connected records, approving expenses, or triggering agent actions.</p>
  <div role="tablist" aria-label="Planning scenario" className="mt-5 flex gap-2">
   <button role="tab" aria-selected={scenario==='product'} onClick={()=>setScenario('product')} className={`flex-1 rounded-xl px-3 py-3 text-sm font-semibold ${scenario==='product'?'bg-blue-700 text-white':'bg-slate-100 text-slate-700'}`}><Calculator size={15} className="mr-2 inline"/>TED · Subscriptions</button>
   <button role="tab" aria-selected={scenario==='media'} onClick={()=>setScenario('media')} className={`flex-1 rounded-xl px-3 py-3 text-sm font-semibold ${scenario==='media'?'bg-blue-700 text-white':'bg-slate-100 text-slate-700'}`}><Film size={15} className="mr-2 inline"/>Orion · Render budget</button>
  </div>
  {scenario==='product'? <div role="tabpanel" className="mt-6 grid gap-6 md:grid-cols-2">
   <div className="space-y-5"><Range label="Active paid subscribers" value={subscribers} min={0} max={2000} step={25} onChange={setSubscribers}/><Range label="Monthly subscription price" value={price} min={9} max={299} step={5} unit="money" onChange={setPrice}/><Range label="Monthly churn assumption" value={churn} min={0} max={25} step={1} unit="%" onChange={setChurn}/><Range label="Monthly operating expenses" value={monthlyCost} min={0} max={30000} step={250} unit="money" onChange={setMonthlyCost}/></div>
   <div className="rounded-2xl bg-slate-950 p-5 text-white"><Activity size={22} className="text-cyan-300"/><p className="mt-3 text-sm text-slate-300">Estimated monthly recurring revenue</p><div className="text-3xl font-bold tabular-nums">{money(revenue)}</div><div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-700"><div className="h-full bg-cyan-400" style={{width:`${Math.max(0,Math.min(100,revenue/(revenue+monthlyCost||1)*100))}%`}}/></div><p className="mt-3 text-sm">Operating surplus: <strong className={margin>=0?'text-emerald-300':'text-rose-300'}>{money(margin)}</strong></p><p className="mt-2 text-sm text-slate-300">Estimated monthly churn: {lostSubscribers} subscribers</p><p className="mt-3 text-xs leading-5 text-slate-400">No taxes, acquisition costs, payment fees, refunds or financing included unless modeled within expenses.</p></div>
  </div>: <div role="tabpanel" className="mt-6 grid gap-6 md:grid-cols-2">
   <div className="space-y-5"><Range label="Storyboard scenes" value={scenes} min={1} max={40} step={1} onChange={setScenes}/><Range label="Attempts per scene" value={attempts} min={1} max={8} step={1} onChange={setAttempts}/><Range label="Credits per attempt" value={credits} min={10} max={1000} step={10} onChange={setCredits}/><Range label="Assumed USD per credit" value={pricePerCredit} min={0.01} max={1} step={0.01} unit="money2" onChange={setPricePerCredit}/><label className="flex items-start gap-3 text-sm text-slate-700"><input type="checkbox" checked={approval} onChange={e=>setApproval(e.target.checked)} className="mt-1 accent-blue-600"/>Storyboard, references and continuity checklist reviewed (planning acknowledgment only)</label></div>
   <div className="rounded-2xl bg-slate-950 p-5 text-white"><Film size={22} className="text-cyan-300"/><p className="mt-3 text-sm text-slate-300">Projected render credits</p><div className="text-3xl font-bold tabular-nums">{renderCredits.toLocaleString()}</div><p className="mt-4 text-xl font-semibold tabular-nums">{money(renderCost)} estimated</p><p className="mt-3 flex items-start gap-2 text-sm text-amber-200"><ShieldAlert size={17} className="shrink-0"/>{approval?'Checklist acknowledged. Rendering still requires separate authorization.':'Rendering remains blocked pending storyboard approval.'}</p><p className="mt-3 text-xs leading-5 text-slate-400">Credit rates are assumptions, not provider quotes. No video job is launched.</p></div>
  </div>}
  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"><p className="flex items-center gap-2 text-xs text-slate-600"><CheckCircle2 size={15}/> Runs entirely in your browser; no external charges.</p><button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100" onClick={()=>navigator.clipboard?.writeText(summary)}>Copy scenario summary <ArrowRight size={15}/></button></div>
 </section>;
}
