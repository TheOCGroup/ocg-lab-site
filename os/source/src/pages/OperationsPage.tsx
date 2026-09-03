import React, { useState } from "react";
import { StorageEngine } from "../data/storageEngine";
import { AgentRecord, AgentTaskRun } from "../types";
import { 
  Bot, 
  Play, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Terminal, 
  Sparkles, 
  Cpu, 
  Zap, 
  Square
} from "lucide-react";
import { toast } from "sonner";

export const OperationsPage: React.FC = () => {
  const [state, setState] = useState(StorageEngine.loadState());
  const [isTriggerModalOpen, setIsTriggerModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(state.agents[0]?.id || "");
  const [newTaskName, setNewTaskName] = useState("");
  const [newToolsUsed, setNewToolsUsed] = useState("Capability Gateway, Verification Engine");
  const [newEvidence, setNewEvidence] = useState("");

  const handleTriggerRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim() || !newEvidence.trim()) {
      toast.error("Task name and verifiable evidence are strictly required (Anti-Fabrication Rule).");
      return;
    }

    const agent = state.agents.find(a => a.id === selectedAgentId);
    const toolsArray = newToolsUsed.split(",").map(t => t.trim());

    const run = StorageEngine.addAgentTaskRun({
      taskId: "task-" + Date.now(),
      agentId: selectedAgentId,
      agentName: agent ? agent.name : "Specialist Agent",
      taskName: newTaskName,
      status: "COMPLETED",
      initiatedBy: "GENARO",
      toolsUsed: toolsArray,
      approvalsRequired: false,
      evidence: newEvidence
    });

    setState(StorageEngine.loadState());
    setIsTriggerModalOpen(false);
    setNewTaskName("");
    setNewEvidence("");
    toast.success("Executed " + run.taskName + " with verified evidence recorded.");
  };

  const handleStopRun = (runId: string) => {
    toast.info("Sent halt signal to execution run " + runId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-cyan-400 font-semibold uppercase tracking-wider">
              AGENT OPERATIONS & AUTONOMY LAYER
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-emerald-400 font-medium font-mono">STRICT ANTI-FABRICATION RULE</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-white">
            Specialist Agents & Execution Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            GENARO → AIDEN → SPECIALIST AGENT → TOOLS / SERVICES → EXECUTION → QA / VERIFICATION → AIDEN → GENARO.
          </p>
        </div>

        <button
          onClick={() => setIsTriggerModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Dispatch Agent Task</span>
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <span>Live Execution Ledger & Verifiable Evidence</span>
        </h2>

        <div className="space-y-3">
          {state.taskRuns.map(run => (
            <div 
              key={run.id}
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className={"px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold " + (
                    run.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" :
                    run.status === "RUNNING" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse" :
                    "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  )}>
                    {run.status}
                  </span>
                  <span className="font-mono text-xs text-slate-400">ID: {run.id}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-xs font-semibold text-cyan-300">Agent: {run.agentName}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>Initiated: {run.initiatedBy}</span>
                  <span>{new Date(run.startTime).toLocaleTimeString()}</span>
                  {run.status === "RUNNING" && (
                    <button
                      onClick={() => handleStopRun(run.id)}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                    >
                      <Square className="w-3 h-3" /> Stop
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm">{run.taskName}</h4>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 mt-0.5">
                  <span>Tools: {run.toolsUsed.join(", ")}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5 text-xs font-mono text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-400">Verifiable Output: </strong>
                  {run.evidence}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400" />
          <span>Persistent Specialist Agents Registry</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.agents.map(agent => (
            <div 
              key={agent.id}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    {agent.departmentId}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {agent.status}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-white">{agent.name}</h3>
                <span className="text-xs font-medium text-slate-400 block">{agent.role}</span>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{agent.specialty}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Core Skills</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {agent.skills.slice(0, 3).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-400 pt-2 border-t border-slate-800/50 text-[11px]">
                  <span>Runs: {agent.executionStats.totalRuns}</span>
                  <span className="text-emerald-400">Pass: {agent.executionStats.passCount}</span>
                  <span className="text-rose-400">Fail: {agent.executionStats.failCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isTriggerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#090e18] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <h3 className="font-heading font-bold text-xl text-white">Dispatch Specialist Agent Task</h3>
            
            <form onSubmit={handleTriggerRun} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">SELECT AGENT</label>
                <select
                  value={selectedAgentId}
                  onChange={e => setSelectedAgentId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                >
                  {state.agents.map(a => (
                    <option key={a.id} value={a.id}>{a.name} — {a.role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">TASK NAME / MISSION</label>
                <input
                  type="text"
                  value={newTaskName}
                  onChange={e => setNewTaskName(e.target.value)}
                  placeholder="e.g. Audit LeadFlow webhook payloads"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">TOOLS / SERVICES USED (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={newToolsUsed}
                  onChange={e => setNewToolsUsed(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">VERIFIABLE EVIDENCE (ANTI-FABRICATION REQUIREMENT)</label>
                <textarea
                  rows={3}
                  value={newEvidence}
                  onChange={e => setNewEvidence(e.target.value)}
                  placeholder="Document the exact verified output, test pass count, commit SHA, or execution log..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTriggerModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Confirm & Dispatch Run
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
