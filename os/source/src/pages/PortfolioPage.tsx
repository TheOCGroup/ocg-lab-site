import React, { useState } from 'react';
import { PORTFOLIO_DATA, PortfolioItem } from '../data/portfolio';
import { CommercialLadder, CanonicalStatus } from '../types';
import { 
  BookOpen, 
  Bot, 
  Crown, 
  Wrench, 
  ExternalLink, 
  CheckCircle2, 
  Tag, 
  Filter, 
  Search, 
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const [selectedLadder, setSelectedLadder] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredItems = PORTFOLIO_DATA.filter(item => {
    const matchesLadder = selectedLadder === 'ALL' || item.ladder === selectedLadder;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.vertical.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLadder && matchesSearch;
  });

  const ladders: { key: string; label: string; icon: any; count: number }[] = [
    { key: 'ALL', label: 'All Products', icon: Tag, count: PORTFOLIO_DATA.length },
    { key: 'PLAYBOOK', label: 'Digital Playbooks', icon: BookOpen, count: PORTFOLIO_DATA.filter(p => p.ladder === 'PLAYBOOK').length },
    { key: 'AI PRO', label: 'AI PRO Systems', icon: Bot, count: PORTFOLIO_DATA.filter(p => p.ladder === 'AI PRO').length },
    { key: 'AI SUPER PRO', label: 'AI SUPER PRO', icon: Crown, count: PORTFOLIO_DATA.filter(p => p.ladder === 'AI SUPER PRO').length },
    { key: 'CALCULATOR', label: 'Calculators & Toolkits', icon: Wrench, count: PORTFOLIO_DATA.filter(p => p.ladder === 'CALCULATOR').length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-cyan-400 font-semibold uppercase tracking-wider">
              COMMERCIAL PORTFOLIO
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-emerald-400 font-medium font-mono">CANONICAL LADDER</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-white">
            The OCG LAB Product Ladder
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Truthful inventory: PLAYBOOK → AI PRO → AI SUPER PRO → TOOLKITS.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products, verticals..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
          />
        </div>
      </div>

      {/* Ladder Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ladders.map(l => {
          const Icon = l.icon;
          const isActive = selectedLadder === l.key;
          return (
            <button
              key={l.key}
              onClick={() => setSelectedLadder(l.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                isActive 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-500/10' 
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{l.label}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400">
                {l.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between space-y-4 shadow-lg cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {item.ladder}
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  ${item.pricing.amount} <span className="text-[10px] text-slate-500 font-normal">/{item.pricing.billing}</span>
                </span>
              </div>

              <h3 className="font-heading font-bold text-base text-white group-hover:text-cyan-300 transition">
                {item.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {item.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Vertical: <strong className="text-slate-300 font-medium">{item.vertical}</strong></span>
                <span className="text-emerald-400">{item.status}</span>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>Channels: {item.channels.join(', ')}</span>
                <span className="text-cyan-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                  Details <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal Drawer */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#090e18] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {selectedItem.ladder} • {selectedItem.vertical}
                </span>
                <h2 className="font-heading font-bold text-2xl text-white mt-2">
                  {selectedItem.name}
                </h2>
                <p className="text-xs text-slate-400 mt-1">{selectedItem.targetAudience}</p>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedItem.summary}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">PRICE</span>
                <span className="text-white font-bold">${selectedItem.pricing.amount} ({selectedItem.pricing.billing})</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">LIFECYCLE PHASE</span>
                <span className="text-cyan-400 font-bold">{selectedItem.currentPhase}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">LEAD AGENT</span>
                <span className="text-emerald-400 font-bold">{selectedItem.leadAgent}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                <span className="text-slate-400">Delivery Asset:</span>
                <span className="text-slate-200">{selectedItem.deliveryAsset}</span>
              </div>
              {selectedItem.productionUrl && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                  <span className="text-slate-400">Production URL:</span>
                  <a 
                    href={selectedItem.productionUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {selectedItem.productionUrl} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Close
              </button>
              {selectedItem.productionUrl && (
                <a
                  href={selectedItem.productionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950 flex items-center gap-2"
                >
                  <span>Launch Live Tool</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
