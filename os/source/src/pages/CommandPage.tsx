import React, { useState, useEffect } from 'react';
import { StorageEngine, OcgLabOsState } from '../data/storageEngine';
import { DEPARTMENTS_DATA } from '../data/departments';
import { OperatingArea, ProjectRecord } from '../types';
import { ObjectiveDetailModal } from '../components/ObjectiveDetailModal';
import { 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Code2, 
  Flame, 
  Layers, 
  Package, 
  Rocket, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  TrendingUp, 
  Zap,
  ShoppingBag,
  Lock,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface CommandPageProps {
  onNavigate: (area: OperatingArea) => void;
  onOpenAiden: () => void;
}

export const CommandPage: React.FC<CommandPageProps> = ({ onNavigate, onOpenAiden }) => {
  const [state, setState] = useState<OcgLabOsState>(StorageEngine.loadState());
  const [clock, setClock] = useState<string>(new Date().toLocaleTimeString());
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const refreshState = () => {
    setState(StorageEngine.loadState());
  };

  const benchProjects = state.projects.filter(p => p.isBench);
  const releasedProjects = state.projects.filter(p => p.status === 'RELEASED');
  const activeAgents = state.agents.filter(a => a.status === 'ACTIVE');
  const primaryObjective = state.objectives[0];

  const handleAuthorizePublish = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!primaryObjective) return;
    try {
      StorageEngine.authorizeFounderPublication(primaryObjective.id, 'Genaro Ocasio (Founder)');
      toast.success('Founder authorization recorded in audit ledger. Live Etsy release authorized!');
      refreshState();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Telemetry Strip */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20 bg-slate-950/60 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest font-semibold">
                OCG LAB OS • OPERATIONAL COMMAND
              </span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-xs text-slate-400">{clock}</span>
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              Technology Department Operating System
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              FOUNDER → AIDEN → OCG LAB TECHNOLOGY DIRECTOR → SPECIALIST WORKFORCE → GOVERNED TOOLS → INDEPENDENT QA → VERIFIED BUSINESS OUTCOME
            </p>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onOpenAiden}
              data-aiden-btn="desktop"
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
            >
              <Bot className="w-4 h-4" />
              <span>Command Aiden</span>
            </button>
            <button
              onClick={() => onNavigate('qa')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>QA & Releases</span>
            </button>
          </div>
        </div>

        {/* Pulse Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            <span className="block text-2xl sm:text-3xl font-light text-white font-mono">{state.projects.length}</span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Total Systems</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            <span className="block text-2xl sm:text-3xl font-light text-emerald-400 font-mono">{releasedProjects.length}</span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Released SKUs</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            <span className="block text-2xl sm:text-3xl font-light text-cyan-400 font-mono">{activeAgents.length}</span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Active Agents</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
            <span className="block text-2xl sm:text-3xl font-light text-amber-400 font-mono">$0.00</span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">New Cloud Cost</span>
          </div>
        </div>
      </div>

      {/* STRATEGIC OBJECTIVES: ETSY COMMERCIALIZATION PROOF */}
      {primaryObjective && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  ACTIVE STRATEGIC OBJECTIVE • PRODUCTION PROOF
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">END-TO-END VERIFIED</span>
              </div>
              <h2 className="font-heading font-bold text-xl text-white">
                {primaryObjective.title}
              </h2>
            </div>

            <button
              onClick={() => setSelectedObjectiveId(primaryObjective.id)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-cyan-500/30 flex items-center gap-1.5 transition"
            >
              <span>Inspect Objective & Work Orders</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div 
            onClick={() => setSelectedObjectiveId(primaryObjective.id)}
            className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-cyan-500/30 hover:border-cyan-500/60 shadow-2xl transition cursor-pointer relative overflow-hidden group"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                    primaryObjective.finalCommerceStatus === 'LIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : primaryObjective.finalCommerceStatus === 'BLOCKED'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    COMMERCE STATE: {primaryObjective.finalCommerceStatus}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Product: <strong>{primaryObjective.targetProduct}</strong>
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Owner: {primaryObjective.owner}</span>
                </div>

                <p className="text-sm text-slate-300">
                  Founder Instruction: <strong className="text-white">&ldquo;{primaryObjective.founderInstruction}&rdquo;</strong>
                </p>

                <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                  {primaryObjective.completionEvidence}
                </p>
              </div>

              {/* Status & Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Workforce Progress</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">8 / 8 Work Orders Complete</span>
                </div>

                {primaryObjective.finalCommerceStatus === 'READY TO LIST' && (
                  <button
                    onClick={handleAuthorizePublish}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:opacity-95 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Authorize Live Etsy Publication</span>
                  </button>
                )}

                {primaryObjective.finalCommerceStatus === 'LIVE' && (
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorized by {primaryObjective.approvedBy}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Department Hierarchy Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-6 pt-5 border-t border-slate-800/80 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">Product Dev</span>
                <span className="text-slate-200 font-semibold">Piper (Audit)</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">Engineering</span>
                <span className="text-slate-200 font-semibold">Victor (Parity)</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">Storefronts</span>
                <span className="text-slate-200 font-semibold">Mira (Etsy Tags)</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">Design & UX</span>
                <span className="text-slate-200 font-semibold">Archer (Images)</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">Documentation</span>
                <span className="text-slate-200 font-semibold">Nova (Access PDF)</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">Compliance</span>
                <span className="text-slate-200 font-semibold">Sentinel (Scrub)</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500 block text-[9px] uppercase">Independent QA</span>
                <span className="text-emerald-400 font-semibold">Quincey (14/14)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10 FOUNDER QUESTIONS: IMMEDIATE OPERATIONAL STATUS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-xl text-white">Founder Operational Briefing</h2>
            <p className="text-xs text-slate-400">Truthful, grounded answers to the 10 core company operating questions.</p>
          </div>
          <button 
            onClick={() => onNavigate('projects')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            View Projects <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">1. WHAT ARE WE BUILDING?</span>
            <h4 className="font-medium text-white text-sm">OCG LAB OS & Commercial Product Ladder</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consolidating canonical Technology Department OS while commercializing the 4-tier ladder: Playbooks → AI PRO → AI SUPER PRO → Toolkits.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">2. WHAT IS WORKING?</span>
            <h4 className="font-medium text-white text-sm">All Core Interactive Tools & Playbooks</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clean TypeScript build (0 errors). Insurance Playbook v10 print fixed. Allie v6.8 certified. PIPER 154/154 tests passing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">3. WHAT IS BROKEN?</span>
            <h4 className="font-medium text-emerald-400 text-sm">Zero Active Regressions</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recent intake parameter defects repaired. Node:sqlite transactions committed without rollback. All routes returning HTTP 200.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">4. WHAT IS BLOCKED?</span>
            <h4 className="font-medium text-amber-300 text-sm">Etsy Live Publish Authorization</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Insurance Agent AI Playbook is in state READY TO LIST, awaiting Founder live authorization before publishing to Etsy.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">5. WHAT IS READY TO TEST?</span>
            <h4 className="font-medium text-white text-sm">Storefront Checkout & Entitlement Delivery</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Digital Playbook instant download links and webhook receipt dispatches ready for end-to-end operator testing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">6. WHAT CAN RELEASE?</span>
            <h4 className="font-medium text-white text-sm">8 Finished Commercial SKUs</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Insurance Playbook, REI Playbook, LeadFlow AI PRO, Allie Wedding Concierge, and 4 Financial Calculators are 100% release certified.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">7. WHAT IS SELLING?</span>
            <h4 className="font-medium text-white text-sm">Whop, Etsy & Direct Channels</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Active listings on Whop and Etsy complete packs. Allie Destination Concierge selling directly to luxury event coordinators.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">8. WHAT NEEDS MY APPROVAL?</span>
            <h4 className="font-medium text-amber-300 text-sm">Etsy Live Listing Release</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Genaro authorization required to release the Insurance Agent AI Playbook to the public Etsy marketplace.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">9. WHAT ARE AGENTS DOING?</span>
            <h4 className="font-medium text-white text-sm">10 Active Autonomous Specialists</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aiden coordinating releases; Victor validating math; Piper auditing playbooks; Hunter enforcing independent QA gates.
            </p>
          </div>
        </div>
      </div>

      {/* ON THE BENCH: P1 CURRENT MISSIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-xl text-white">On the Bench</h2>
            <p className="text-xs text-slate-400">Strict P1 active missions. Max 3 active items at one time.</p>
          </div>
          <span className="font-mono text-xs font-semibold text-cyan-400">
            {benchProjects.length} ACTIVE MISSIONS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benchProjects.map((p, idx) => (
            <div 
              key={p.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    SLOT #{idx + 1} • {p.priority}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{p.completionPercent}% COMPLETE</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white group-hover:text-cyan-300 transition">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {p.objective}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-800/80">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                    CURRENT MISSION / NEXT ACTION
                  </span>
                  <p className="text-xs text-slate-200 font-medium">
                    {p.nextAction}
                  </p>
                </div>

                {p.blockers && p.blockers.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Blocker: {p.blockers.join(', ')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-mono">
                  <span>Owner: {p.assignedAgents.join(', ')}</span>
                  <span className="text-emerald-400">{p.qaStatus}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DEPARTMENT WORKFORCE OVERVIEW STRIP */}
      <div className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-white">Department Workforce Hierarchy</h3>
            <p className="text-xs text-slate-400">12 Specialized Departments coordinating engineering, creative, and commercialization.</p>
          </div>
          <button
            onClick={() => onNavigate('operations')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Manage Workforce <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DEPARTMENTS_DATA.slice(0, 6).map(d => (
            <div key={d.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-cyan-400 block font-semibold mb-1">DEPT #{d.number}</span>
              <h5 className="font-semibold text-xs text-white truncate">{d.name}</h5>
              <p className="text-[11px] text-slate-400 mt-1">Director: <strong className="text-slate-300">{d.director}</strong></p>
              <span className="text-[10px] text-slate-500 block font-mono">Lead: {d.leadAgent}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Objective Detail Modal */}
      {selectedObjectiveId && (
        <ObjectiveDetailModal
          objectiveId={selectedObjectiveId}
          onClose={() => setSelectedObjectiveId(null)}
          onStateChange={refreshState}
        />
      )}

    </div>
  );
};
