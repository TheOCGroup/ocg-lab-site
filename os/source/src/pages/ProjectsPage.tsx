import React, { useState } from "react";
import { StorageEngine } from "../data/storageEngine";
import { ProjectRecord, CanonicalStatus, ProductPipelineStage } from "../types";
import { 
  FolderGit2, 
  GitBranch, 
  GitCommit, 
  CheckSquare, 
  AlertTriangle, 
  ExternalLink, 
  Save, 
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectRecord[]>(StorageEngine.loadState().projects);
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>("ALL");

  const [editNextAction, setEditNextAction] = useState("");
  const [editStatus, setEditStatus] = useState<CanonicalStatus>("BUILDING");
  const [editCompletion, setEditCompletion] = useState(50);
  const [editBlocker, setEditBlocker] = useState("");

  const handleOpenDetail = (p: ProjectRecord) => {
    setSelectedProject(p);
    setEditNextAction(p.nextAction);
    setEditStatus(p.status);
    setEditCompletion(p.completionPercent);
    setEditBlocker(p.blockers.join(", "));
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    const blockerArray = editBlocker.trim() ? editBlocker.split(",").map(s => s.trim()) : [];

    const updated = StorageEngine.updateProject(selectedProject.id, {
      nextAction: editNextAction,
      status: editStatus,
      completionPercent: editCompletion,
      blockers: blockerArray
    });

    setProjects(updated);
    setSelectedProject(prev => prev ? { ...prev, nextAction: editNextAction, status: editStatus, completionPercent: editCompletion, blockers: blockerArray } : null);
    toast.success("Updated " + selectedProject.name + " successfully.");
  };

  const filteredProjects = projects.filter(p => {
    return filterPriority === "ALL" || p.priority === filterPriority;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-cyan-400 font-semibold uppercase tracking-wider">
              PROJECT WORKBENCH
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-emerald-400 font-medium font-mono">16-STAGE LIFECYCLE</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-white">
            Engineering & Product Projects
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real state tracking: repos, branches, commit SHAs, QA gates, blockers, and next actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="P0">P0 Urgent</option>
            <option value="P1">P1 High</option>
            <option value="P2">P2 Core</option>
            <option value="P3">P3 Ecosystem</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProjects.map(p => (
          <div 
            key={p.id}
            onClick={() => handleOpenDetail(p)}
            className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer group shadow-lg"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {p.priority}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {p.currentPhase}
                </span>
                <span className={"px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold " + (
                  p.status === "RELEASED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" :
                  p.status === "BUILDING" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" :
                  "bg-slate-800 text-slate-400"
                )}>
                  {p.status}
                </span>
                {p.isBench && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    BENCH SLOT #{p.benchSlot}
                  </span>
                )}
              </div>

              <h3 className="font-heading font-bold text-lg text-white group-hover:text-cyan-300 transition">
                {p.name}
              </h3>
              <p className="text-xs text-slate-400 max-w-3xl line-clamp-2">
                {p.objective}
              </p>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                <span>Next: <strong className="text-slate-200 font-medium">{p.nextAction}</strong></span>
              </div>
            </div>

            <div className="flex lg:flex-col items-end justify-between lg:justify-center gap-2 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800">
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-white">{p.completionPercent}%</span>
                <span className="text-[10px] text-slate-500 block font-mono uppercase">COMPLETION</span>
              </div>
              <div className="w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                  style={{ width: p.completionPercent + "%" }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-[#080d18] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  PROJECT RECORD #{selectedProject.id}
                </span>
                <h2 className="font-heading font-bold text-2xl text-white mt-1">
                  {selectedProject.name}
                </h2>
                <p className="text-xs text-slate-400 mt-1">{selectedProject.customerUser}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5"><FolderGit2 className="w-3.5 h-3.5 text-cyan-400" /> Repository:</span>
                <span className="text-slate-200 truncate max-w-md">{selectedProject.sourceRepository}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5"><GitBranch className="w-3.5 h-3.5 text-emerald-400" /> Branch:</span>
                <span className="text-slate-200">{selectedProject.activeBranch}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5"><GitCommit className="w-3.5 h-3.5 text-amber-400" /> Latest Commit:</span>
                <span className="text-slate-200">{selectedProject.latestCommit}</span>
              </div>
              {selectedProject.productionUrl && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Live URL:</span>
                  <a href={selectedProject.productionUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                    {selectedProject.productionUrl} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">
                ACCEPTANCE CRITERIA
              </span>
              <div className="space-y-1.5">
                {selectedProject.acceptanceCriteria.map((c, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 pt-4 border-t border-slate-800">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  CURRENT MISSION / NEXT ACTION
                </label>
                <input
                  type="text"
                  value={editNextAction}
                  onChange={e => setEditNextAction(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    CANONICAL STATUS
                  </label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as CanonicalStatus)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-500 outline-none"
                  >
                    <option value="DISCOVERED">DISCOVERED</option>
                    <option value="RECOVERED">RECOVERED</option>
                    <option value="BUILDING">BUILDING</option>
                    <option value="TESTING">TESTING</option>
                    <option value="QA PASSED">QA PASSED</option>
                    <option value="PREVIEW">PREVIEW</option>
                    <option value="PRODUCTION">PRODUCTION</option>
                    <option value="RELEASED">RELEASED</option>
                    <option value="PAUSED">PAUSED</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    COMPLETION PERCENT ({editCompletion}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editCompletion}
                    onChange={e => setEditCompletion(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  BLOCKERS (COMMA SEPARATED)
                </label>
                <input
                  type="text"
                  value={editBlocker}
                  onChange={e => setEditBlocker(e.target.value)}
                  placeholder="None"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950 flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Record</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};
