import React, { useState } from "react";
import { DECISIONS_DATA } from "../data/decisions";
import { EXPERIMENTS_DATA } from "../data/experiments";
import { SOPS_DATA } from "../data/sops";
import { StorageEngine } from "../data/storageEngine";
import { 
  BookOpen, 
  Lightbulb, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Calendar,
  Layers
} from "lucide-react";
import { toast } from "sonner";

export const KnowledgePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"decisions" | "incubator" | "sops">("decisions");
  const [experiments, setExperiments] = useState(StorageEngine.loadState().experiments);
  const [isAddExpOpen, setIsAddExpOpen] = useState(false);

  const [expName, setExpName] = useState("");
  const [expProblem, setExpProblem] = useState("");
  const [expWho, setExpWho] = useState("");
  const [expIdea, setExpIdea] = useState("");
  const [expWhy, setExpWhy] = useState("");

  const handleAddExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expName.trim() || !expProblem.trim()) {
      toast.error("Experiment title and problem statement required.");
      return;
    }

    const newExp = {
      id: "exp-" + Date.now(),
      name: expName,
      problem: expProblem,
      who: expWho,
      idea: expIdea,
      why: expWhy,
      notes: "Contained in Incubator. Guardrail: Does not reach the bench automatically.",
      createdDate: new Date().toISOString().split("T")[0],
      stage: "INCUBATOR" as const
    };

    const state = StorageEngine.loadState();
    const updated = [newExp, ...state.experiments];
    StorageEngine.saveState({ experiments: updated });
    setExperiments(updated);
    setIsAddExpOpen(false);
    setExpName("");
    setExpProblem("");
    setExpWho("");
    setExpIdea("");
    setExpWhy("");
    toast.success("Saved " + newExp.name + " to Incubator.");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-cyan-400 font-semibold uppercase tracking-wider">
              KNOWLEDGE & R&D
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-emerald-400 font-medium font-mono">INCUBATOR • DECISIONS • SOPS</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-white">
            Architecture Decisions & Incubator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Permanent decision ledger, operational SOPs, and contained R&D incubator ideas.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab("decisions")}
            className={"px-4 py-2 rounded-xl text-xs font-semibold transition " + (
              activeTab === "decisions" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            )}
          >
            Decisions ({DECISIONS_DATA.length})
          </button>
          <button
            onClick={() => setActiveTab("incubator")}
            className={"px-4 py-2 rounded-xl text-xs font-semibold transition " + (
              activeTab === "incubator" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            )}
          >
            Incubator / R&D ({experiments.length})
          </button>
          <button
            onClick={() => setActiveTab("sops")}
            className={"px-4 py-2 rounded-xl text-xs font-semibold transition " + (
              activeTab === "sops" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            )}
          >
            Standard SOPs ({SOPS_DATA.length})
          </button>
        </div>
      </div>

      {activeTab === "decisions" && (
        <div className="space-y-4">
          <div className="relative pl-6 space-y-4 border-l-2 border-cyan-500/30">
            {DECISIONS_DATA.map(d => (
              <div 
                key={d.id}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 relative"
              >
                <div className="absolute -left-[31px] top-6 w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  <span>{d.date}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-cyan-400 font-semibold">{d.scope}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white">{d.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{d.why}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "incubator" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 max-w-2xl">
              Strict Rule: Ideas land in the Incubator and stay there. Nothing reaches the active bench without explicit founder authorization.
            </p>
            <button
              onClick={() => setIsAddExpOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Capture to Incubator</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments.map(exp => (
              <div 
                key={exp.id}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    INCUBATOR • R&D
                  </span>
                  <h3 className="font-heading font-bold text-lg text-white mt-3">{exp.name}</h3>
                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <strong className="text-slate-400 font-mono text-[10px] block">PROBLEM:</strong>
                      <span className="text-slate-300">{exp.problem}</span>
                    </div>
                    <div>
                      <strong className="text-slate-400 font-mono text-[10px] block">WHO:</strong>
                      <span className="text-slate-300">{exp.who}</span>
                    </div>
                    <div>
                      <strong className="text-slate-400 font-mono text-[10px] block">IDEA:</strong>
                      <span className="text-slate-300">{exp.idea}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                  <span>Created: {exp.createdDate}</span>
                  <span className="text-amber-400">Contained</span>
                </div>
              </div>
            ))}
          </div>

          {isAddExpOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="w-full max-w-xl bg-[#090e18] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
                <h3 className="font-heading font-bold text-xl text-white">Capture Idea to Incubator</h3>
                <form onSubmit={handleAddExperiment} className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="text-slate-400 block mb-1">WORKING TITLE</label>
                    <input
                      type="text"
                      value={expName}
                      onChange={e => setExpName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">PROBLEM TO SOLVE</label>
                    <textarea
                      rows={2}
                      value={expProblem}
                      onChange={e => setExpProblem(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">WHO IS IT FOR?</label>
                    <input
                      type="text"
                      value={expWho}
                      onChange={e => setExpWho(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">THE CORE IDEA</label>
                    <textarea
                      rows={2}
                      value={expIdea}
                      onChange={e => setExpIdea(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddExpOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                    >
                      Save to Incubator
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "sops" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SOPS_DATA.map(sop => (
            <div key={sop.id} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">{sop.code}</span>
                <span className="text-slate-500">{sop.readingTime}</span>
              </div>
              <h3 className="font-heading font-bold text-base text-white">{sop.title}</h3>
              <p className="text-xs text-slate-400">{sop.summary}</p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-emerald-400">
                <span>{sop.checklistItems.length} Checklist Items</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
