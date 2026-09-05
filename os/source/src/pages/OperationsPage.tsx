import React from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  CloudCog,
  Code2,
  Database,
  Network,
  Radar,
  ShieldCheck,
  Sparkles,
  TestTube2,
  Wrench,
} from 'lucide-react';
import { TECHNOLOGY_AGENTS, TECHNOLOGY_FLOW } from '../data/technologyAgents';

interface OperationsPageProps {
  onOpenAiden?: () => void;
}

const iconForLayer = (layer: string) => {
  if (layer === 'BUILD') return Code2;
  if (layer === 'CONNECT') return Network;
  if (layer === 'TOOLS') return Wrench;
  if (layer === 'RUN') return CloudCog;
  if (layer === 'DATA') return Database;
  if (layer === 'PROTECT') return ShieldCheck;
  if (layer === 'VERIFY') return TestTube2;
  if (layer === 'EXPERIENCE') return Sparkles;
  return Bot;
};

const stateTone = (readiness: 'RUNTIME_ACTIVE' | 'ROLE_READY') =>
  readiness === 'RUNTIME_ACTIVE'
    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
    : 'border-cyan-400/25 bg-cyan-400/8 text-cyan-200';

export const OperationsPage: React.FC<OperationsPageProps> = ({ onOpenAiden }) => {
  const activeCount = TECHNOLOGY_AGENTS.filter(agent => agent.readiness === 'RUNTIME_ACTIVE').length;
  const roleReadyCount = TECHNOLOGY_AGENTS.filter(agent => agent.readiness === 'ROLE_READY').length;

  return (
    <div className="relative mx-auto w-full max-w-[1480px] overflow-hidden px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-[-220px] h-[560px] bg-[radial-gradient(circle_at_18%_28%,rgba(37,99,235,.22),transparent_32%),radial-gradient(circle_at_62%_22%,rgba(6,182,212,.15),transparent_30%),radial-gradient(circle_at_86%_38%,rgba(16,185,129,.14),transparent_26%)] blur-3xl" />

      <div className="relative space-y-6 sm:space-y-8">
        <section className="overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/85 shadow-2xl">
          <div className="h-[2px] bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400" />
          <div className="grid gap-0 lg:grid-cols-[1.25fr_.75fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 sm:text-xs">
                <span className="text-cyan-300">OCG LAB TECHNOLOGY DEPARTMENT</span>
                <span className="text-slate-700">•</span>
                <span>Governed technical operations</span>
              </div>

              <h1 className="mt-4 max-w-4xl font-heading text-4xl font-extrabold leading-[.98] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Build. Connect. Protect. Verify.
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                  One department. One operating truth.
                </span>
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Aiden directs a governed set of technical specialist roles across software, integrations, tooling, infrastructure, data, security, QA and product experience. No duplicate public personas. No fake activity. No system is called operational until its full runtime path is verified.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={onOpenAiden}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-[0_12px_40px_rgba(6,182,212,.18)] transition hover:scale-[1.01]"
                >
                  <Bot className="h-4 w-4" /> Command Aiden <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <a
                  href="https://chatbot-seven-tau-23.vercel.app/workforce"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.06]"
                >
                  Open Workforce <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/[0.025] p-6 sm:p-8 lg:border-l lg:border-t-0">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Department state</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
                  <p className="text-3xl font-bold text-white">{activeCount}</p>
                  <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.15em] text-emerald-300">Runtime active</p>
                </div>
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05] p-4">
                  <p className="text-3xl font-bold text-white">{roleReadyCount}</p>
                  <p className="mt-1 text-[10px] font-mono uppercase tracking-[0.15em] text-cyan-300">Role ready</p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                  <div>
                    <p className="text-xs font-semibold text-white">Truth boundary</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      Specialist roles remain STANDBY until a real Aiden/Workforce execution is bound to them. The OS will not manufacture “working” indicators.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[26px] border border-white/10 bg-white/[0.025] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-300">Operating loop</p>
              <h2 className="mt-1 text-lg font-bold text-white">How a technical request moves</h2>
            </div>
            <Radar className="h-5 w-5 text-cyan-300" />
          </div>

          <div className="flex snap-x gap-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-7 sm:overflow-visible sm:pb-0">
            {TECHNOLOGY_FLOW.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="min-w-[150px] snap-start rounded-2xl border border-white/8 bg-slate-950/65 p-3 sm:min-w-0"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-[10px] font-mono font-bold text-cyan-200">
                    {index + 1}
                  </span>
                  <p className="text-[10px] font-mono font-bold tracking-[0.12em] text-slate-300">{step}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300">Technical workforce</p>
              <h2 className="mt-1 text-2xl font-bold text-white">All technology agent roles</h2>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-400">
                These are governed execution roles behind Aiden. They are deliberately descriptive instead of inventing another layer of characters.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" /> 9 roles defined
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {TECHNOLOGY_AGENTS.map((agent, index) => {
              const Icon = iconForLayer(agent.operatingLayer);
              return (
                <motion.article
                  key={agent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + index * 0.035 }}
                  className="group overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/70 p-5 transition hover:border-cyan-400/25"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-blue-500/15 via-cyan-400/10 to-emerald-400/10 text-cyan-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-mono uppercase tracking-[0.18em] text-cyan-300">{agent.operatingLayer}</p>
                        <h3 className="mt-1 truncate text-base font-bold text-white">{agent.name}</h3>
                        <p className="text-xs text-slate-400">{agent.role}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-mono font-bold ${stateTone(agent.readiness)}`}>
                      {agent.readiness === 'RUNTIME_ACTIVE' ? 'ACTIVE' : 'ROLE READY'}
                    </span>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-slate-300">{agent.specialty}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {agent.skills.slice(0, 4).map(skill => (
                      <span key={skill} className="rounded-lg border border-white/8 bg-white/[0.035] px-2 py-1 text-[9px] text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-white/8 pt-4">
                    <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-slate-500">Truth note</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{agent.truthNote}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section className="rounded-[26px] border border-white/10 bg-slate-950/70 p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-300">Release rule</p>
              <h2 className="mt-1 text-xl font-bold text-white">HTTP 200 is not “working.”</h2>
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-2 sm:grid-cols-5">
                {['SOURCE', 'AUTH / TOOLS', 'DATA', 'USER FLOW', 'RECOVERY'].map(label => (
                  <div key={label} className="rounded-xl border border-white/8 bg-white/[0.025] px-3 py-3 text-center text-[9px] font-mono font-bold tracking-[0.12em] text-slate-300">
                    {label}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                Production certification requires evidence across the complete dependency path, independent QA where applicable, and a verified recovery path. Green CI alone cannot close a release.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
