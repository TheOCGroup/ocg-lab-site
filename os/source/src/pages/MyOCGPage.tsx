import React, { useState } from 'react';
import { CartStore } from '../utils/cartStore';
import { Entitlement, Order, Page } from '../types';
import { 
  UserCheck, 
  Layers, 
  Bot, 
  Calculator, 
  BookOpen, 
  ShieldCheck, 
  CreditCard, 
  HelpCircle, 
  Download, 
  ExternalLink, 
  Key, 
  Clock, 
  CheckCircle2,
  RefreshCw,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface MyOCGPageProps {
  setActivePage: (page: Page) => void;
  onOpenStorefront: () => void;
}

export const MyOCGPage: React.FC<MyOCGPageProps> = ({ setActivePage, onOpenStorefront }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'ai-workers' | 'workflows' | 'tools' | 'orders' | 'support'>('products');
  
  const entitlements = CartStore.getEntitlements();
  const orders = CartStore.getOrders();

  const handleCopyLicenseKey = (key?: string) => {
    if (!key) return;
    navigator.clipboard.writeText(key);
    toast.success('License key copied to clipboard!');
  };

  const handleRunTool = (url?: string) => {
    if (url) {
      setActivePage('resources');
      toast.info('Opening product workspace...');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Account Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-800/60 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 shadow-xl">
            <div className="w-full h-full bg-[#030712] rounded-[14px] flex items-center justify-center font-heading font-extrabold text-xl text-cyan-400">
              OCG
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">MY OCG Command Center</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                VERIFIED ACCOUNT
              </span>
            </div>
            <p className="text-xs text-slate-400">Unified customer account for software, AI workers, workflows, and tools.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenStorefront}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Browse Products Store</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'products', label: 'My Products & Entitlements', icon: <Layers className="w-4 h-4" />, count: entitlements.length },
          { id: 'ai-workers', label: 'My AI Workers', icon: <Bot className="w-4 h-4" />, count: entitlements.filter(e => e.productType === 'AI Worker').length },
          { id: 'workflows', label: 'My Workflows', icon: <RefreshCw className="w-4 h-4" />, count: entitlements.filter(e => e.productType === 'Workflow').length },
          { id: 'tools', label: 'My Tools & Calculators', icon: <Calculator className="w-4 h-4" />, count: entitlements.filter(e => e.productType === 'SaaS' || e.productType === 'Calculator').length },
          { id: 'orders', label: 'Orders & Billing', icon: <CreditCard className="w-4 h-4" />, count: orders.length },
          { id: 'support', label: 'Support & Docs', icon: <HelpCircle className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                activeTab === tab.id ? 'bg-slate-950 text-cyan-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Products & Entitlements */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-xl text-white">Active Product Entitlements</h3>
            <span className="text-xs font-mono text-cyan-400">Server Authorized</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entitlements.map((ent) => (
              <div
                key={ent.id}
                className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
                      {ent.productType}
                    </span>
                    <span className={`text-[11px] font-mono font-bold flex items-center gap-1 ${
                      ent.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${ent.status === 'Active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      {ent.status}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-xl text-white">{ent.productTitle}</h4>
                  
                  <div className="space-y-1.5 text-xs text-slate-400 font-mono pt-1">
                    <div>Fulfillment: <span className="text-slate-200">{ent.fulfillmentOption}</span></div>
                    <div>Purchased: <span className="text-slate-200">{ent.purchaseDate}</span></div>
                  </div>

                  {ent.licenseKey && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <Key className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-300 font-bold">{ent.licenseKey}</span>
                      </div>
                      <button
                        onClick={() => handleCopyLicenseKey(ent.licenseKey)}
                        className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                        title="Copy Key"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">ID: {ent.id}</span>
                  <button
                    onClick={() => handleRunTool(ent.accessUrl)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md"
                  >
                    <span>Launch / Access Product</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: AI Workers */}
      {activeTab === 'ai-workers' && (
        <div className="space-y-6">
          <h3 className="font-heading font-bold text-xl text-white">Active AI Worker Agents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {entitlements.filter(e => e.productType === 'AI Worker').length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-3xl border border-slate-800 col-span-2 space-y-3">
                <Bot className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="font-heading font-bold text-white text-base">No AI Workers Active</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">Explore AI Acquisition Analyst or Nova Operating Engine in the store to deploy specialized AI workers.</p>
                <button onClick={onOpenStorefront} className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">
                  Browse AI Workers
                </button>
              </div>
            ) : (
              entitlements.filter(e => e.productType === 'AI Worker').map(ent => (
                <div key={ent.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-cyan-400 font-bold">AI WORKER AGENT</span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Active 24/7
                    </span>
                  </div>
                  <h4 className="font-heading font-bold text-lg text-white">{ent.productTitle}</h4>
                  <p className="text-xs text-slate-400 font-mono">Fulfillment: {ent.fulfillmentOption}</p>
                  <button onClick={() => toast.info('Agent status panel active.')} className="w-full py-2 bg-slate-800 text-white text-xs font-semibold rounded-xl">
                    View Agent Performance
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Orders & Billing */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="font-heading font-bold text-xl text-white">Purchase History & Billing Invoices</h3>
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Order #</th>
                    <th className="p-3 font-semibold">Date</th>
                    <th className="p-3 font-semibold">Items</th>
                    <th className="p-3 font-semibold">Total</th>
                    <th className="p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-mono font-bold text-cyan-400">{ord.orderNumber}</td>
                      <td className="p-3 text-slate-400 font-mono">{ord.date}</td>
                      <td className="p-3 text-white">
                        {ord.items.map((it, i) => (
                          <div key={i}>{it.productTitle} ({it.fulfillmentOption})</div>
                        ))}
                      </td>
                      <td className="p-3 font-mono font-bold text-white">${ord.totalAmount}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Support & Docs */}
      {activeTab === 'support' && (
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-4 text-center max-w-xl mx-auto">
          <HelpCircle className="w-10 h-10 text-cyan-400 mx-auto" />
          <h3 className="font-heading font-bold text-xl text-white">OCG Implementation Support</h3>
          <p className="text-xs text-slate-300">Need help configuring a workflow or setting up an AI worker? Our engineering team responds within 15 minutes.</p>
          <button onClick={() => setActivePage('contact')} className="px-6 py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">
            Open Support Inquiry Ticket
          </button>
        </div>
      )}

    </div>
  );
};
