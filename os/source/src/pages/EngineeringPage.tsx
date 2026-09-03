import React from "react";
import { SHARED_CAPABILITIES_DATA } from "../data/sharedInfrastructure";
import { 
  FolderGit2, 
  GitBranch, 
  GitCommit, 
  Server, 
  ExternalLink, 
  ShieldCheck, 
  Network, 
  Cpu, 
  BookOpen, 
  Sparkles, 
  KeyRound
} from "lucide-react";

export const EngineeringPage: React.FC = () => {
  const canonicalRepos = [
    {
      name: "TheOCGroup/ocg-lab-site",
      system: "OCG LAB Site & Interactive Products",
      branch: "aiden/ocg-lab-product-organization",
      commit: "b7adbaf",
      deployment: "GitHub Pages",
      url: "https://theocgroup.github.io/ocg-lab-site/",
      status: "PRODUCTION"
    },
    {
      name: "TheOCGroup/nova",
      system: "OCG MEDIA OS (NOVA Engine)",
      branch: "release/ocg-media-v4.0.0",
      commit: "2cb8c67",
      deployment: "Google Cloud Run",
      url: "https://nova-engine-438680341626.us-central1.run.app",
      status: "RELEASED"
    },
    {
      name: "TheOCGroup/maestro",
      system: "MAESTRO — AI Apprenticeship System",
      branch: "main",
      commit: "ee03472",
      deployment: "Vercel Edge",
      url: "https://maestro-six-peach.vercel.app/",
      status: "RELEASED"
    },
    {
      name: "TheOCGroup/PIPELINE",
      system: "OCG PIPELINE & PIPER",
      branch: "main",
      commit: "c4e912a",
      deployment: "Local Node.js 22 / Render",
      url: "http://localhost:3000",
      status: "RELEASED"
    },
    {
      name: "TheOCGroup/chief",
      system: "Chief OS — AI Day Operating System",
      branch: "main",
      commit: "a8190fe",
      deployment: "Local Node.js",
      url: "http://localhost:4000",
      status: "PRODUCTION"
    },
    {
      name: "TheOCGroup/the-ocg-lab-report",
      system: "The Lab Report Publication",
      branch: "main",
      commit: "71c08f4",
      deployment: "GitHub Pages",
      url: "https://theocgroup.github.io/ocg-lab-site/newsletter/",
      status: "PRODUCTION"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs text-cyan-400 font-semibold uppercase tracking-wider">
            ENGINEERING OPERATIONS
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-emerald-400 font-medium font-mono">CANONICAL SYSTEM MAP</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl text-white">
          Repositories & Shared Infrastructure
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Authoritative technical registry across TheOCGroup repositories, branches, commits, and shared service contracts.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-cyan-400" />
          <span>Living Canonical Repository Map</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {canonicalRepos.map((repo, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {repo.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{repo.deployment}</span>
                </div>

                <h3 className="font-heading font-bold text-base text-white">{repo.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{repo.system}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1"><GitBranch className="w-3.5 h-3.5 text-emerald-400" /> Branch:</span>
                  <span className="text-slate-200">{repo.branch}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1"><GitCommit className="w-3.5 h-3.5 text-amber-400" /> Commit:</span>
                  <span className="text-slate-200">{repo.commit}</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700"
                >
                  <span>Inspect Endpoint</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
          <Network className="w-5 h-5 text-cyan-400" />
          <span>OCG Shared Infrastructure & Capability Contracts</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SHARED_CAPABILITIES_DATA.map(cap => (
            <div 
              key={cap.id}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {cap.type}
                </span>
                <span className="text-[10px] font-mono text-emerald-400">{cap.status}</span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-lg text-white">{cap.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cap.description}</p>
              </div>

              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Active Providers</span>
                  <span className="text-slate-300">{cap.providers.join(", ")}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Fallback Policy</span>
                  <span className="text-amber-300">{cap.fallbackStrategy}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Telemetry</span>
                  <span className="text-emerald-400">{cap.healthMetrics}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
