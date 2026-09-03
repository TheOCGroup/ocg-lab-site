import React, { useState } from 'react';
import { SOPItem } from '../types';
import { SOPS_DATA } from '../data/sops';
import { Search, BookOpen, Clock, CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface ResourcesPageProps {
  onOpenSOPReader: (sop: SOPItem) => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onOpenSOPReader }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Underwriting', 'Operations', 'AI & Automation', 'Growth'];

  const filteredSOPs = SOPS_DATA.filter(sop => {
    const matchesCategory = selectedCategory === 'All' || sop.category === selectedCategory;
    const matchesSearch = sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sop.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sop.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
          The OCG Blueprint Engine
        </span>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white">
          Standard Operating Procedures & Playbooks
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Living, interactive playbooks for real estate acquisition, lead intake state machines, and AI walkthrough photo classification.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SOPs or codes (e.g. SOP-UW-001)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* SOP Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredSOPs.map((sop) => (
          <div
            key={sop.id}
            className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-800 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {sop.code}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {sop.readingTime}
                </span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-xl text-white">{sop.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{sop.summary}</p>
              </div>

              {/* Checklist Highlights */}
              <div className="space-y-2 pt-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                <span className="text-[11px] font-mono text-cyan-400 font-semibold block">Interactive Checklist Highlights:</span>
                {sop.checklistItems.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Updated: {sop.lastUpdated}</span>
              <button
                onClick={() => onOpenSOPReader(sop)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-all"
              >
                <span>Read Full SOP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
