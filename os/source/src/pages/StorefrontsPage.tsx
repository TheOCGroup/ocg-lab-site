import React, { useState } from "react";
import { STOREFRONT_ITEMS_DATA } from "../data/storefronts";
import { COMMERCIALIZATION_LIFECYCLE, COMMERCIAL_WORKFLOWS } from "../data/commercializationWorkflows";
import { PRODUCT_COMMERCIALIZATION_TEMPLATES } from "../data/productCommercializationTemplates";
import { StorefrontItem } from "../types";
import { CheckCircle2, CircleDot, ExternalLink, ShieldCheck } from "lucide-react";

export const StorefrontsPage: React.FC = () => {
  const [filterChannel, setFilterChannel] = useState<string>("ALL");

  const filtered = STOREFRONT_ITEMS_DATA.filter(item => {
    return filterChannel === "ALL" || item.channel === filterChannel;
  });

  const liveItems = STOREFRONT_ITEMS_DATA.filter(i => i.status === 'Live').length;
  const readyItems = STOREFRONT_ITEMS_DATA.filter(i => i.status === 'Ready').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-cyan-400 font-semibold uppercase tracking-wider">COMMERCIAL OPERATING SYSTEM</span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-emerald-400 font-medium font-mono">DIRECT • ETSY • WHOP</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-white">Storefronts & Commercialization</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Verified channel state, fulfillment, buyer access, and the reusable workflows that move products from release to revenue without fabricating metrics.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 min-w-[230px]">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 font-mono block">VERIFIED LIVE</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{liveItems}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 font-mono block">READY / QA</span>
            <span className="text-lg font-bold font-mono text-cyan-400">{readyItems}</span>
          </div>
        </div>
      </div>

      <section className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-white font-bold">Universal Commercialization Lifecycle</h2>
            <p className="text-xs text-slate-400">A channel is not complete at “published.” Buyer verification, support, analytics, and optimization are part of done.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMERCIALIZATION_LIFECYCLE.map((stage, index) => (
            <div key={stage} className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300">{stage}</span>
              {index < COMMERCIALIZATION_LIFECYCLE.length - 1 && <span className="text-slate-600">→</span>}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-white font-bold text-lg">Workflow Registry</h2>
          <p className="text-xs text-slate-400">Reusable operating workflows for every product after product QA.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {COMMERCIAL_WORKFLOWS.map(workflow => (
            <div key={workflow.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{workflow.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">{workflow.purpose}</p>
                </div>
                <span className={`text-[9px] px-2 py-1 rounded-full font-mono border ${workflow.status === 'CERTIFIED' || workflow.status === 'CONNECTED' ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' : workflow.status === 'BLOCKED' ? 'text-rose-300 border-rose-500/30 bg-rose-500/10' : 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10'}`}>{workflow.status}</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">Owner: <span className="text-slate-200">{workflow.owner}</span> · QA: <span className="text-slate-200">{workflow.qaOwner}</span></div>
              <div className="space-y-1.5">
                {workflow.stages.map(stage => (
                  <div key={stage} className="flex items-center gap-2 text-[10px] text-slate-300"><CircleDot className="w-3 h-3 text-slate-600" />{stage}</div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500"><span className="text-slate-400 font-semibold">Done when:</span> {workflow.completionGate}</div>
            </div>
          ))}
        </div>
      </section>


      <section className="space-y-3">
        <div>
          <h2 className="text-white font-bold text-lg">Product-Type Playbooks</h2>
          <p className="text-xs text-slate-400">The fulfillment and QA path changes by product class; channels reuse these templates instead of inventing a new process.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {PRODUCT_COMMERCIALIZATION_TEMPLATES.map(template => (
            <div key={template.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-white">{template.productType}</h3>
                <p className="text-[10px] font-mono text-slate-400 mt-1">Owner: {template.owner} · QA: {template.qaOwner}</p>
              </div>
              <div className="space-y-1.5">
                {template.stages.map(stage => (
                  <div key={stage} className="flex items-center gap-2 text-[10px] text-slate-300"><CircleDot className="w-3 h-3 text-slate-600" />{stage}</div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500"><span className="font-semibold text-slate-400">Done when:</span> {template.completionGate}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-white font-bold text-lg">Channel Inventory</h2>
            <p className="text-xs text-slate-400">Only independently verified external listings are marked Live.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {["ALL", "Whop", "Etsy", "Direct"].map(ch => (
              <button key={ch} onClick={() => setFilterChannel(ch)} className={"px-4 py-2 rounded-xl text-xs font-semibold transition border " + (filterChannel === ch ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" : "bg-slate-900/60 hover:bg-slate-800 text-slate-400 border-slate-800")}>{ch === "ALL" ? "All Channels" : ch}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item: StorefrontItem) => (
            <div key={item.id} className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">{item.channel}</span>
                  <span className="text-base font-bold font-mono text-white">${item.price}</span>
                </div>
                <h3 className="font-heading font-bold text-base text-white">{item.productName}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.listingTitle}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400"><span>Status:</span><span className={item.status === 'Live' ? 'text-emerald-400 font-bold' : 'text-cyan-300 font-bold'}>{item.status}</span></div>
                <div className="flex items-center justify-between text-slate-400 gap-3"><span>Asset Pack:</span><span className="text-slate-200 truncate max-w-[180px]">{item.listingAssetPack}</span></div>
                <div className="flex items-center justify-between text-slate-400 gap-3"><span>Format:</span><span className="text-slate-200 truncate max-w-[180px]">{item.deliveryFormat}</span></div>
                <div className="flex items-center justify-between text-slate-400"><span>Orders:</span><span className="text-slate-300">Not displayed without verified source</span></div>

                {item.fulfillmentUrl ? (
                  <a href={item.fulfillmentUrl} target="_blank" rel="noreferrer" className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700"><span>{item.status === 'Live' ? 'Verify Public Listing' : 'Verify Access URL'}</span><ExternalLink className="w-3.5 h-3.5" /></a>
                ) : (
                  <div className="w-full py-2 rounded-xl bg-slate-950 text-slate-500 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-800"><CheckCircle2 className="w-3.5 h-3.5" /><span>External channel verification required</span></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
