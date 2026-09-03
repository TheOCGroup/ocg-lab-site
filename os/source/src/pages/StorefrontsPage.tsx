import React, { useState } from "react";
import { STOREFRONT_ITEMS_DATA } from "../data/storefronts";
import { StorefrontItem } from "../types";
import { 
  ShoppingBag, 
  Tag, 
  ExternalLink, 
  CheckCircle2, 
  Package, 
  ArrowUpRight, 
  DollarSign
} from "lucide-react";
import { toast } from "sonner";

export const StorefrontsPage: React.FC = () => {
  const [items, setItems] = useState<StorefrontItem[]>(STOREFRONT_ITEMS_DATA);
  const [filterChannel, setFilterChannel] = useState<string>("ALL");

  const filtered = items.filter(item => {
    return filterChannel === "ALL" || item.channel === filterChannel;
  });

  const totalOrders = items.reduce((acc, i) => acc + i.orderCount, 0);
  const totalRevenue = items.reduce((acc, i) => acc + (i.orderCount * i.price), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-cyan-400 font-semibold uppercase tracking-wider">
              COMMERCIAL STOREFRONTS
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-emerald-400 font-medium font-mono">WHOP • ETSY • DIRECT</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-white">
            Storefront Inventory & Fulfillment
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Active commercial SKUs, instant digital delivery packs, pricing tiers, and checkout links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 font-mono block">SIMULATED REVENUE</span>
            <span className="text-lg font-bold font-mono text-emerald-400">$${totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {["ALL", "Whop", "Etsy", "Direct"].map(ch => (
          <button
            key={ch}
            onClick={() => setFilterChannel(ch)}
            className={"px-4 py-2 rounded-xl text-xs font-semibold transition border " + (
              filterChannel === ch 
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" 
                : "bg-slate-900/60 hover:bg-slate-800 text-slate-400 border-slate-800"
            )}
          >
            {ch === "ALL" ? "All Channels" : ch}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div 
            key={item.id}
            className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {item.channel}
                </span>
                <span className="text-base font-bold font-mono text-white">
                  $${item.price}
                </span>
              </div>

              <h3 className="font-heading font-bold text-base text-white">
                {item.productName}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {item.listingTitle}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Asset Pack:</span>
                <span className="text-slate-200 truncate max-w-[180px]">{item.listingAssetPack}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Format:</span>
                <span className="text-slate-200 truncate max-w-[180px]">{item.deliveryFormat}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Units Sold:</span>
                <span className="text-emerald-400 font-bold">{item.orderCount} units</span>
              </div>

              <div className="pt-2">
                <a
                  href={item.fulfillmentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <span>Verify Delivery URL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
