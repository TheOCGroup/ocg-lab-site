import React from 'react';
import { FOUNDER_INFO, ECOSYSTEM_STRUCTURE, COMPANY_INFO, GOLDEN_DECISION_PRIORITY } from '../data/company';
import { Building2, ShieldCheck, User, Target, Layers, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
          Founder Vision & Governance
        </span>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white">
          Built by Operators, for Operators.
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          The OCG Lab was founded by Genaro Ocasio to bridge the gap between complex artificial intelligence capabilities and the day-to-day realities of running a business.
        </p>
      </div>

      {/* Founder Spotlight Card */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyan-800/60 bg-gradient-to-br from-cyan-950/20 via-slate-900 to-slate-950 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 shadow-xl">
              <div className="w-full h-full bg-[#030712] rounded-[14px] flex items-center justify-center font-heading font-extrabold text-2xl text-cyan-400">
                GO
              </div>
            </div>
            <div>
              <h2 className="font-heading font-bold text-2xl text-white">{FOUNDER_INFO.name}</h2>
              <p className="text-xs text-cyan-400 font-mono">{FOUNDER_INFO.title}</p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3.5 py-1.5 rounded-full border border-emerald-800 self-start md:self-auto">
            FOUNDER & BUILDER
          </span>
        </div>

        <p className="text-slate-300 text-sm leading-relaxed max-w-4xl">
          {FOUNDER_INFO.bio}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {FOUNDER_INFO.background.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ecosystem Architecture Cards */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Organizational Structure</span>
          <h2 className="font-heading font-extrabold text-3xl text-white">The Ocasio Collective Ecosystem</h2>
          <p className="text-slate-400 text-xs">
            Understanding the distinction between parent organization, operating company, and tech lab.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Parent */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="p-3 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800 w-fit">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-slate-500 block">PARENT ORGANIZATION</span>
            <h3 className="font-heading font-bold text-xl text-white">{ECOSYSTEM_STRUCTURE.parent}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {ECOSYSTEM_STRUCTURE.parentDesc}
            </p>
          </div>

          {/* Operating Company */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 w-fit">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-slate-500 block">REAL ESTATE OPERATING CO</span>
            <h3 className="font-heading font-bold text-xl text-white">{ECOSYSTEM_STRUCTURE.operatingCompany}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {ECOSYSTEM_STRUCTURE.operatingCompanyDesc}
            </p>
          </div>

          {/* Technology Lab */}
          <div className="glass-card p-6 rounded-3xl border border-cyan-800/80 bg-cyan-950/20 space-y-3">
            <div className="p-3 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800 w-fit">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-cyan-400 block">SOFTWARE & AI LAB</span>
            <h3 className="font-heading font-bold text-xl text-white">{ECOSYSTEM_STRUCTURE.techLab}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {ECOSYSTEM_STRUCTURE.techLabDesc}
            </p>
          </div>

        </div>
      </div>

      {/* Golden Decision Priority Order Section */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Engineering Governance</span>
          <h2 className="font-heading font-extrabold text-3xl text-white">The Golden Decision Priority Order</h2>
          <p className="text-slate-400 text-xs">
            When engineering trade-offs arise, every member of The OCG Lab team resolves decisions in this strict non-negotiable order:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {GOLDEN_DECISION_PRIORITY.map((item, idx) => (
            <motion.div
              key={item.rank}
              initial={{ opacity: 1, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3 relative group hover:border-cyan-500/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {item.rank} PRIORITY
                </span>
              </div>
              <h4 className="font-heading font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                {item.title}
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};
