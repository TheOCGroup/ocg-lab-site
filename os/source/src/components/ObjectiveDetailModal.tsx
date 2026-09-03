import React, { useState } from 'react';
import { ObjectiveRecord, WorkOrder } from '../types';
import { StorageEngine } from '../data/storageEngine';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Image as ImageIcon, 
  Package, 
  Lock, 
  RotateCcw, 
  AlertCircle, 
  ChevronRight, 
  ExternalLink,
  Bot,
  Zap,
  Tag,
  UserCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface ObjectiveDetailModalProps {
  objectiveId: string;
  onClose: () => void;
  onStateChange: () => void;
}

export const ObjectiveDetailModal: React.FC<ObjectiveDetailModalProps> = ({
  objectiveId,
  onClose,
  onStateChange
}) => {
  const [objective, setObjective] = useState<ObjectiveRecord | undefined>(
    StorageEngine.getObjective(objectiveId)
  );
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(
    StorageEngine.getWorkOrders(objectiveId)
  );
  const [selectedWoId, setSelectedWoId] = useState<string>(workOrders[0]?.id || '');

  const reload = () => {
    const updatedObj = StorageEngine.getObjective(objectiveId);
    const updatedWos = StorageEngine.getWorkOrders(objectiveId);
    setObjective(updatedObj);
    setWorkOrders(updatedWos);
    onStateChange();
  };

  if (!objective) return null;

  const selectedWo = workOrders.find(w => w.id === selectedWoId) || workOrders[0];
  const isBlocked = objective.finalCommerceStatus === 'BLOCKED' || objective.status === 'CORRECTION_REQUIRED';
  const isLive = objective.finalCommerceStatus === 'LIVE';

  const handleSimulateFailure = () => {
    try {
      StorageEngine.simulateControlledFailure('wo-ins-04');
      toast.error('Adversarial QA rejected WO-04. Defect logged & work routed back to Archer.');
      reload();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleResolveCorrection = () => {
    try {
      StorageEngine.resolveCorrection(
        'wo-ins-04',
        'Archer re-rendered Image #3 to 2000x2000 square master standard. Quincey re-inspected and certified PASS.'
      );
      toast.success('Correction accepted! Quincey re-ran QA and confirmed 14/14 checks passed. Objective restored to READY TO LIST.');
      reload();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleFounderApproval = () => {
    try {
      StorageEngine.authorizeFounderPublication(objective.id, 'Genaro Ocasio (Founder)');
      toast.success('Founder authorization recorded in audit ledger. Live Etsy release authorized!');
      reload();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                OBJECTIVE DETAIL
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                isLive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : isBlocked
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}>
                STATUS: {objective.finalCommerceStatus}
              </span>
              <span className="text-xs text-slate-500 font-mono">Owner: {objective.owner}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
              {objective.title}
            </h2>
            <p className="text-xs text-slate-400 italic">
              Founder Instruction: &ldquo;{objective.founderInstruction}&rdquo;
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Operating Model Hierarchy Strip */}
        <div className="bg-slate-950/40 px-6 py-3 border-b border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="text-white font-semibold">Hierarchy:</span>
          <span className="text-cyan-400">Founder</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-cyan-400">Aiden</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-300">Department Directors</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-300">Lead Agents</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-300">Specialist Workforce</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-amber-400">Tools / Systems</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-emerald-400 font-semibold">Independent QA (Quincey & Hunter)</span>
          <ArrowRight className="w-3 h-3 text-slate-600" />
          <span className="text-white font-bold">{objective.finalCommerceStatus}</span>
        </div>

        {/* Failure / Blocked Alert Banner if defect simulated */}
        {isBlocked && (
          <div className="bg-rose-500/15 border-b border-rose-500/30 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Controlled Defect Active:</strong> {objective.blockers.join(' | ')}
              </span>
            </div>
            <button
              onClick={handleResolveCorrection}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition shrink-0"
            >
              Submit Correction & Re-run QA
            </button>
          </div>
        )}

        {/* Modal Body: Two-Column Layout */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto flex-1">
          
          {/* Left Column: Work Order Flow */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                Decomposed Work Orders ({workOrders.length})
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                {workOrders.filter(w => w.status === 'COMPLETED').length} / {workOrders.length} COMPLETE
              </span>
            </div>

            <div className="space-y-2">
              {workOrders.map((wo, idx) => {
                const isSelected = wo.id === selectedWo.id;
                const isWoBlocked = wo.status === 'CORRECTION_REQUIRED' || wo.status === 'FAILED';

                return (
                  <div
                    key={wo.id}
                    onClick={() => setSelectedWoId(wo.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                        : isWoBlocked
                        ? 'bg-rose-500/10 border-rose-500/40'
                        : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        WO #{idx + 1} • {wo.departmentName}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        wo.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : isWoBlocked
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}>
                        {wo.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white line-clamp-1">
                      {wo.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Owner: <strong className="text-slate-200">{wo.assignedAgent}</strong></span>
                      <span className="text-[10px] font-mono text-cyan-400">{wo.artifacts.length} artifacts</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Test Simulation Controls */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                Independent QA & Recovery Test Harness
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSimulateFailure}
                  disabled={isBlocked}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                    isBlocked
                      ? 'bg-slate-800/40 border-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Simulate Controlled Defect</span>
                </button>

                {isBlocked && (
                  <button
                    onClick={handleResolveCorrection}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Submit Fix & Re-run QA</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Work Order Detail & Governance Gate */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Selected Work Order Spec */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block mb-1">
                    WORK ORDER SPECIFICATION • {selectedWo.departmentName}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {selectedWo.title}
                  </h3>
                </div>
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                  selectedWo.status === 'COMPLETED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : selectedWo.status === 'CORRECTION_REQUIRED'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}>
                  {selectedWo.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedWo.description}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-0.5">Department & Lead</span>
                  <span className="font-semibold text-slate-200">{selectedWo.departmentName}</span>
                  <span className="block text-slate-400 text-[11px]">Director: {selectedWo.director} | Agent: {selectedWo.assignedAgent}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-0.5">Connected Tools</span>
                  <span className="font-mono text-[11px] text-cyan-300 block truncate">
                    {selectedWo.toolsUsed.join(', ')}
                  </span>
                </div>
              </div>

              {/* Completion Criteria Checklist */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                  Completion Criteria
                </span>
                {selectedWo.completionCriteria.map((crit, cIdx) => (
                  <div key={cIdx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{crit}</span>
                  </div>
                ))}
              </div>

              {/* Artifacts Produced */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                  Verified Artifacts ({selectedWo.artifacts.length})
                </span>
                <div className="space-y-2">
                  {selectedWo.artifacts.map(art => (
                    <div key={art.id} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                      {art.type === 'PACKAGE' ? (
                        <Package className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : art.type === 'IMAGE' ? (
                        <ImageIcon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      ) : art.type === 'LISTING' ? (
                        <Tag className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <FileText className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-xs text-white truncate">{art.name}</span>
                          <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                            {art.verificationStatus}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{art.summary}</p>
                        <span className="text-[10px] font-mono text-slate-500 block mt-1 truncate">
                          {art.pathOrUrl} {art.size ? `(${art.size})` : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Independent QA Verification Card */}
              {selectedWo.qaResult && (
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      Independent QA Sign-off ({selectedWo.qaResult.inspectorAgent})
                    </span>
                    <span className="font-mono text-[11px] text-emerald-300 font-bold">
                      VERDICT: {selectedWo.qaResult.verdict} ({selectedWo.qaResult.checkpointsPassed}/{selectedWo.qaResult.totalCheckpoints})
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {selectedWo.qaResult.evidence}
                  </p>
                  <span className="text-[10px] font-mono text-slate-500 block">
                    Verified at {new Date(selectedWo.qaResult.timestamp).toLocaleString()} • Non-Self-Approval Enforced
                  </span>
                </div>
              )}

              {/* Defect Log if Rejected */}
              {selectedWo.errorLog && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1 text-xs text-rose-300">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400">
                    <AlertCircle className="w-4 h-4" />
                    Defect Logged & Work Routed Back
                  </div>
                  <p>{selectedWo.errorLog}</p>
                </div>
              )}
            </div>

            {/* Founder Approval Gate (Consequential Action) */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  GOVERNANCE GATE • LIVE ETSY PUBLICATION
                </span>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  isLive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {isLive ? 'AUTHORIZED & LIVE' : 'REQUIRES FOUNDER AUTHORIZATION'}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Publishing live commercial listings to Etsy is a high-consequence external business action. In accordance with OCG LAB governance doctrine, Aiden and specialist agents cannot publish live without explicit Founder authorization.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-800">
                <div className="text-xs">
                  <span className="text-slate-500 block text-[11px]">Commercial State:</span>
                  <strong className="text-white text-sm">{objective.finalCommerceStatus}</strong>
                  {objective.approvedBy && (
                    <span className="text-emerald-400 text-[11px] block mt-0.5">
                      ✓ Authorized by {objective.approvedBy} at {new Date(objective.approvedAt!).toLocaleTimeString()}
                    </span>
                  )}
                </div>

                {!isLive && (
                  <button
                    onClick={handleFounderApproval}
                    disabled={isBlocked}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition flex items-center gap-2 ${
                      isBlocked
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 hover:opacity-95 shadow-cyan-500/20'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Authorize Live Etsy Publication</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">
            OCG LAB OS • VERIFIED OPERATIONAL WORKFLOW
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
          >
            Close Objective Detail
          </button>
        </div>

      </div>
    </div>
  );
};
