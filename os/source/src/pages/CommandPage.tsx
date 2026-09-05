import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Orbit,
  Play,
  Radio,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap
} from 'lucide-react';
import { StorageEngine, OcgLabOsState } from '../data/storageEngine';
import { PUBLIC_SITE_INTEGRATION_BOUNDARY } from '../data/publicSiteBoundary';
import { OperatingArea, ProjectRecord } from '../types';
import { ObjectiveDetailModal } from '../components/ObjectiveDetailModal';

interface CommandPageProps {
  onNavigate: (area: OperatingArea) => void;
  onOpenAiden: () => void;
}

const statusTone = (status: ProjectRecord['status']) => {
  if (['PRODUCTION', 'RELEASED', 'QA PASSED'].includes(status)) return 'emerald';
  if (['BLOCKED', 'QA FAILED'].includes(status)) return 'rose';
  if (['BUILDING', 'TESTING', 'PREVIEW'].includes(status)) return 'cyan';
  return 'slate';
};

const toneClasses: Record<string, string> = {
  emerald: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  rose: 'border-rose-400/30 bg-rose-400/10 text-rose-300',
  cyan: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
  slate: 'border-white/10 bg-white/5 text-slate-300'
};

export const CommandPage: React.FC<CommandPageProps> = ({ onNavigate, onOpenAiden }) => {
  const [state, setState] = useState<OcgLabOsState>(StorageEngine.loadState());
  const [clock, setClock] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const refreshState = () => setState(StorageEngine.loadState());
  const publicBoundary = PUBLIC_SITE_INTEGRATION_BOUNDARY;

  const activeAgents = useMemo(() => state.agents.filter(agent => agent.status === 'ACTIVE'), [state.agents]);
  const attentionProjects = useMemo(
    () => state.projects.filter(project => ['BLOCKED', 'QA FAILED', 'TESTING', 'BUILDING'].includes(project.status)).slice(0, 5),
    [state.projects]
  );
  const systemProjects = useMemo(() => state.projects.filter(project => !project.isBench).slice(0, 8), [state.projects]);
  const primaryObjective = state.objectives[0];
  const blockedCount = state.projects.filter(project => ['BLOCKED', 'QA FAILED'].includes(project.status)).length;
  const releasedCount = state.projects.filter(project => ['PRODUCTION', 'RELEASED'].includes(project.status)).length;

  const flow = [
    { label: 'REQUEST', icon: Sparkles },
    { label: 'AIDEN', icon: Bot },
    { label: 'ASSIGN', icon: Workflow },
    { label: 'BUILD', icon: Cpu },
    { label: 'QA', icon: ShieldCheck },
    { label: 'RELEASE', icon: Zap }
  ];

  return (
    <div className="relative max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-[-180px] h-[520px] bg-[radial-gradient(circle_at_22%_30%,rgba(37,99,235,.20),transparent_35%),radial-gradient(circle_at_72%_24%,rgba(6,182,212,.14),transparent_34%),radial-gradient(circle_at_84%_52%,rgba(16,185,129,.14),transparent_30%)] blur-2xl" />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/80 shadow-2xl"
      >
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400" />
        <div className="grid lg:grid-cols-[1.35fr_.65fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-mono uppercase tracking-[0.18em] text-slate-400">
              <span className="inline-flex items-center gap-2 text-emerald-300">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                OCG LAB TECHNOLOGY
              </span>
              <span className="text-slate-700">•</span>
              <span>{clock}</span>
            </div>

            <div className="mt-5 max-w-4xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Founder Command Center</p>
              <h1 className="mt-3 font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.98] tracking-tight text-white">
                Run the department.
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">See what is actually moving.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-400">
                A single operating view for systems, agents, work in motion, QA, release readiness and founder decisions. No decorative status theater—only recorded OCG LAB state.
              </p>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onOpenAiden}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-[0_12px_40px_rgba(6,182,212,.18)] transition hover:scale-[1.01]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Bot className="h-4 w-4" /> Command Aiden <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
              <button
                onClick={() => onNavigate('operations')}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06]"
              >
                Open Operations
              </button>
            </div>
          </div>

          <div className="relative border-t border-white/10 bg-white/[0.025] p-6 sm:p-8 lg:border-l lg:border-t-0">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-emerald-400/20 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Aiden orchestration</p>
                  <h2 className="mt-1 text-xl font-bold text-white">Command presence</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-blue-500/15 to-emerald-400/10 text-cyan-300">
                  <Orbit className="h-6 w-6 animate-[spin_9s_linear_infinite]" />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 text-slate-950 shadow-lg">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Aiden</p>
                      <p className="text-xs text-slate-500">OCG LAB orchestration layer</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-300">COMMAND READY</span>
                </div>
                <button onClick={onOpenAiden} className="mt-4 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-left text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-white">
                  <span>Tell Aiden what needs to happen next</span>
                  <ChevronRight className="h-4 w-4 text-cyan-300" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  ['ACTIVE', activeAgents.length],
                  ['RELEASED', releasedCount],
                  ['ATTENTION', blockedCount]
                ].map(([label, value]) => (
                  <div key={String(label)} className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
                    <p className="text-xl font-semibold text-white">{value}</p>
                    <p className="mt-1 text-[9px] font-mono tracking-[0.14em] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4 }}
        className="rounded-[26px] border border-white/10 bg-white/[0.025] p-4 sm:p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-300">Operating flow</p>
            <h2 className="mt-1 text-lg font-bold text-white">How work moves through OCG LAB</h2>
          </div>
          <button onClick={() => onNavigate('agents')} className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white">
            Workforce <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {flow.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.12 + index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/8 bg-slate-950/60 p-3 sm:p-4"
                >
                  <div className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-transform duration-500 group-hover:scale-x-100" />
                  <Icon className="h-4 w-4 text-cyan-300" />
                  <p className="mt-3 text-[10px] sm:text-xs font-mono font-bold tracking-[0.12em] text-slate-300">{step.label}</p>
                </motion.div>
                {index < flow.length - 1 && <div className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-2 bg-gradient-to-r from-cyan-400/50 to-emerald-400/20 sm:block" />}
              </div>
            );
          })}
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.4 }}
          className="rounded-[28px] border border-white/10 bg-slate-950/65 p-5 sm:p-6"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300">System constellation</p>
              <h2 className="mt-1 text-xl font-bold text-white">Canonical systems</h2>
              <p className="mt-1 text-xs text-slate-500">State is read from the existing OCG LAB registry.</p>
            </div>
            <button onClick={() => onNavigate('projects')} className="flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-white">
              All systems <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {systemProjects.map((project, index) => {
              const tone = statusTone(project.status);
              return (
                <motion.button
                  key={project.id}
                  onClick={() => onNavigate('projects')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + index * 0.04 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-400/25 hover:bg-cyan-400/[0.035]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{project.name}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{project.currentPhase}</p>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-mono font-bold ${toneClasses[tone]}`}>{project.status}</span>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(2, Math.min(project.completionPercent || 0, 100))}%` }}
                      transition={{ delay: 0.24 + index * 0.04, duration: 0.7 }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{project.priority}</span>
                    <span>{project.completionPercent}%</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        <div className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="rounded-[28px] border border-white/10 bg-slate-950/65 p-5 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-300">Needs attention</p>
                <h2 className="mt-1 text-lg font-bold text-white">Founder queue</h2>
              </div>
              <Activity className="h-5 w-5 text-amber-300" />
            </div>

            <div className="mt-4 space-y-2.5">
              {attentionProjects.length === 0 ? (
                <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4 text-sm text-emerald-200">
                  No recorded blocked, failed, testing or building projects in the current registry.
                </div>
              ) : attentionProjects.map(project => (
                <button key={project.id} onClick={() => onNavigate('projects')} className="flex w-full items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.025] p-3.5 text-left transition hover:border-cyan-400/20">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${['BLOCKED', 'QA FAILED'].includes(project.status) ? 'bg-rose-400/10 text-rose-300' : 'bg-cyan-400/10 text-cyan-300'}`}>
                    {['BLOCKED', 'QA FAILED'].includes(project.status) ? <AlertTriangle className="h-4 w-4" /> : <Radio className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{project.name}</p>
                    <p className="truncate text-[11px] text-slate-500">{project.nextAction || project.currentPhase}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </button>
              ))}
            </div>
          </motion.section>

          {primaryObjective && (
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.4 }}
              className="relative overflow-hidden rounded-[28px] border border-cyan-400/20 bg-gradient-to-br from-blue-500/[0.07] via-cyan-400/[0.04] to-emerald-400/[0.06] p-5 sm:p-6"
            >
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[9px] font-mono font-bold text-cyan-200">ACTIVE OBJECTIVE</span>
                  <span className="text-[10px] font-mono text-emerald-300">{primaryObjective.finalCommerceStatus}</span>
                </div>
                <h2 className="mt-4 text-lg font-bold text-white">{primaryObjective.title}</h2>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-400">{primaryObjective.description}</p>
                <button onClick={() => setSelectedObjectiveId(primaryObjective.id)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.07]">
                  <Play className="h-4 w-4 text-emerald-300" /> Inspect work in motion
                </button>
              </div>
            </motion.section>
          )}
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="rounded-[28px] border border-white/10 bg-white/[0.02] p-5 sm:p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-300">Technology workforce</p>
            <h2 className="mt-1 text-xl font-bold text-white">Agents with recorded active state</h2>
          </div>
          <button onClick={() => onNavigate('agents')} className="flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-white">
            Open workforce <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {activeAgents.length ? activeAgents.slice(0, 10).map(agent => (
            <div key={agent.id} className="min-w-[210px] rounded-2xl border border-white/8 bg-slate-950/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-emerald-400/15 text-cyan-300"><Bot className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{agent.name}</p>
                  <p className="truncate text-[11px] text-slate-500">{agent.role}</p>
                </div>
              </div>
              <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-slate-400">{agent.currentTask || agent.specialty}</p>
              <div className="mt-4 flex items-center gap-2 text-[9px] font-mono text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" /> RECORDED ACTIVE</div>
            </div>
          )) : (
            <div className="rounded-2xl border border-white/8 bg-slate-950/60 p-4 text-sm text-slate-400">No agents are currently recorded as ACTIVE.</div>
          )}
        </div>
      </motion.section>

      <div data-public-boundary="active" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/8 bg-slate-950/50 px-4 py-3 text-[10px] font-mono text-slate-500">
        <span>Public Surface: Request Only</span>
        <span>{publicBoundary.publicSurface.mayRequest.length} scoped capabilities • {publicBoundary.forbiddenPublicScopes.length} internal scopes blocked</span>
        <span className="sr-only">FOUNDER → AIDEN → OCG LAB TECHNOLOGY DIRECTOR → SPECIALIST WORKFORCE → GOVERNED TOOLS → INDEPENDENT QA • {publicBoundary.forbiddenPublicScopes.join(' | ')}</span>
      </div>

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
