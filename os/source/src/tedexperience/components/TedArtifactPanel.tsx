import React from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import type { TedArtifactKind } from '../tedPersona';
import {
  getWorkspaceProducts,
  getWorkspaceProjects,
  type WorkspaceProduct,
  type WorkspaceProject,
} from '../tedWorkspace';

export interface TedArtifact {
  kind: TedArtifactKind;
  project?: WorkspaceProject;
  product?: WorkspaceProduct;
}

interface TedArtifactPanelProps {
  artifact: TedArtifact;
  onClose: () => void;
  onAskTed: (message: string) => void;
}

/** Plain-English rendering of recorded statuses. Recorded values pass through humanized. */
function plainStatus(status: string): string {
  const map: Record<string, string> = {
    PRODUCTION: 'Live',
    RELEASED: 'Live',
    CERTIFIED: 'Done',
    COMPLETED: 'Done',
    BUILDING: 'Being built',
    EXECUTING: 'In progress',
    ACTIVE: 'In progress',
    RUNNING: 'In progress',
    PLANNED: 'Planned',
    DESIGNED: 'Planned',
    SPECIFIED: 'Planned',
    STANDBY: 'On hold',
    WAITING: 'Waiting',
    BLOCKED: 'Blocked',
    READY: 'Ready',
    READY_TO_LIST: 'Ready',
  };
  return map[status] ?? status.toLowerCase().replace(/_/g, ' ');
}

const PanelShell: React.FC<{ title: string; subtitle: string; onClose: () => void; children: React.ReactNode }> = ({
  title,
  subtitle,
  onClose,
  children,
}) => (
  <div className="flex h-full flex-col overflow-hidden bg-white">
    <div className="flex items-start justify-between gap-3 border-b border-slate-200/80 px-5 py-4">
      <div className="min-w-0">
        <h3 className="font-heading text-[15px] font-bold tracking-tight text-slate-900">{title}</h3>
        <p className="mt-0.5 text-[11.5px] text-slate-400">{subtitle}</p>
      </div>
      <button
        aria-label="Close panel"
        onClick={onClose}
        className="shrink-0 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
  </div>
);

const AskButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-left text-[12.5px] font-medium text-slate-600 transition hover:border-blue-600/30 hover:text-slate-900"
  >
    {label}
    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-slate-400" />
  </button>
);

const ProjectsList: React.FC<{ onAskTed: (m: string) => void }> = ({ onAskTed }) => {
  const projects = getWorkspaceProjects();
  return (
    <div className="space-y-2.5">
      {projects.map((p) => (
        <button
          key={p.id}
          onClick={() => onAskTed(`Tell me about ${p.name}.`)}
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-600/30"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13px] font-semibold leading-snug text-slate-900">{p.name}</p>
            <span className="shrink-0 rounded-full bg-slate-900/[0.05] px-2.5 py-1 text-[10px] font-semibold text-slate-600">
              {plainStatus(p.status)}
            </span>
          </div>
          <p className="mt-1 text-[11.5px] text-slate-400">
            {p.phase} · {p.completionPercent}% complete
          </p>
        </button>
      ))}
    </div>
  );
};

const ProductsList: React.FC<{ onAskTed: (m: string) => void }> = ({ onAskTed }) => {
  const products = getWorkspaceProducts();
  return (
    <div className="space-y-2.5">
      {products.map((p) => (
        <button
          key={p.id}
          onClick={() => onAskTed(`Tell me about ${p.name}.`)}
          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-600/30"
        >
          <p className="text-[13px] font-semibold leading-snug text-slate-900">{p.name}</p>
          <p className="mt-1 text-[11.5px] text-slate-400">
            {p.type} · {p.pageLive ? 'Page is live' : 'Not on the live site'}
          </p>
        </button>
      ))}
    </div>
  );
};

const ProjectDetail: React.FC<{ project: WorkspaceProject; onAskTed: (m: string) => void }> = ({ project: p, onAskTed }) => (
  <div className="space-y-3">
    <div>
      <p className="font-heading text-[16px] font-bold tracking-tight text-slate-900">{p.name}</p>
      <p className="mt-1 text-[12.5px] text-slate-500">
        {plainStatus(p.status)} · {p.phase} · {p.completionPercent}% complete
      </p>
    </div>
    {p.blockers.length > 0 && (
      <div className="rounded-2xl border border-rose-200/70 bg-rose-50/60 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-700">Needs attention</p>
        <p className="mt-1 text-[12.5px] leading-relaxed text-rose-900/80">{p.blockers.join('; ')}</p>
      </div>
    )}
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">What's next</p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-slate-700">{p.nextAction}</p>
    </div>
    <div className="space-y-2">
      <AskButton label="Ask TED what's blocking this" onClick={() => onAskTed(`What are the blockers on ${p.name}?`)} />
      <AskButton label="Ask TED what's next" onClick={() => onAskTed(`What is the next action on ${p.name}?`)} />
    </div>
  </div>
);

const ProductDetail: React.FC<{ product: WorkspaceProduct; onAskTed: (m: string) => void }> = ({ product: p, onAskTed }) => (
  <div className="space-y-3">
    <div>
      <p className="font-heading text-[16px] font-bold tracking-tight text-slate-900">{p.name}</p>
      <p className="mt-1 text-[12.5px] text-slate-500">{p.type}</p>
    </div>
    <dl className="space-y-2 rounded-2xl border border-slate-200 p-4 text-[12.5px]">
      <div className="flex justify-between gap-3">
        <dt className="text-slate-400">Page</dt>
        <dd className="font-medium text-slate-700">{p.pageLive ? 'Live' : 'Not live'}</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-slate-400">Checkout</dt>
        <dd className="font-medium text-slate-700">{p.checkoutVerified ? 'Verified' : 'Not verified'}</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-slate-400">Readiness</dt>
        <dd className="font-medium text-slate-700">{p.readiness}</dd>
      </div>
    </dl>
    <AskButton label="Ask TED about this product" onClick={() => onAskTed(`Tell me about ${p.name}.`)} />
  </div>
);

/**
 * The artifact workspace: appears ONLY when TED produced something worth
 * inspecting beside the chat. Closed = full-screen TED again.
 */
export const TedArtifactPanel: React.FC<TedArtifactPanelProps> = ({ artifact, onClose, onAskTed }) => {
  if (artifact.kind === 'projects') {
    return (
      <PanelShell title="What we're working on" subtitle="From TED's recorded projects — ask about any of them." onClose={onClose}>
        <ProjectsList onAskTed={onAskTed} />
      </PanelShell>
    );
  }
  if (artifact.kind === 'products') {
    return (
      <PanelShell title="Our products" subtitle="From TED's recorded product list." onClose={onClose}>
        <ProductsList onAskTed={onAskTed} />
      </PanelShell>
    );
  }
  if (artifact.kind === 'project' && artifact.project) {
    return (
      <PanelShell title="Project" subtitle="Recorded detail — TED won't guess beyond this." onClose={onClose}>
        <ProjectDetail project={artifact.project} onAskTed={onAskTed} />
      </PanelShell>
    );
  }
  if (artifact.kind === 'product' && artifact.product) {
    return (
      <PanelShell title="Product" subtitle="Recorded detail." onClose={onClose}>
        <ProductDetail product={artifact.product} onAskTed={onAskTed} />
      </PanelShell>
    );
  }
  return null;
};
