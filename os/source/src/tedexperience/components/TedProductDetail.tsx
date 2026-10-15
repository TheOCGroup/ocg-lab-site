/**
 * TED Phase 2.3 — Product detail / Product Memory view.
 *
 * A clean product record the founder can absorb in 20-30 seconds:
 * what are we building, what does it do, what's finished, what's left,
 * what did we decide, what should we do next.
 *
 * Displayed as a focused overlay (not permanent clutter beside TED).
 */

import React from 'react';
import { getProductMemoryWithOverlay, ProductMemory } from '../productMemory';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
      <h4 className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {title}
      </h4>
      <div className="mt-2 text-[14px] leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}

function EvidenceTag({ level }: { level: string }) {
  const color =
    level === 'VERIFIED'
      ? 'bg-emerald-50 text-emerald-700'
      : level === 'IMPLEMENTED'
        ? 'bg-blue-50 text-blue-700'
        : 'bg-slate-100 text-slate-500';
  return (
    <span className={`ml-2 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${color}`}>
      {level}
    </span>
  );
}

export interface TedProductDetailProps {
  productId: string;
  onClose: () => void;
  onContinueWithTed: (productId: string) => void;
}

export const TedProductDetail: React.FC<TedProductDetailProps> = ({
  productId,
  onClose,
  onContinueWithTed,
}) => {
  const memory: ProductMemory | null = getProductMemoryWithOverlay(productId);

  if (!memory) {
    return (
      <div className="p-6 text-center">
        <p className="text-[14px] text-slate-600">Product not found in the records.</p>
        <button onClick={onClose} className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-[13px] font-semibold">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-200/80 p-5">
        <div>
          <h3 className="font-heading text-[18px] font-extrabold tracking-tight text-slate-900">
            {memory.title}
          </h3>
          {memory.subtitle && (
            <p className="mt-0.5 text-[13px] text-slate-500">{memory.subtitle}</p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close product detail"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2}>
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Body — the 13-section memory */}
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
        <Section title="1 · What are we building?">
          <p>{memory.vision}</p>
        </Section>

        <Section title="2 · Who is it for?">
          <p>{memory.audience}</p>
        </Section>

        <Section title="3 · Problem it solves">
          <p>{memory.problem}</p>
        </Section>

        <Section title="4 · What it does">
          {memory.functions.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5">
              {memory.functions.map((f, i) => (
                <li key={i}>
                  {f.name}
                  <EvidenceTag level={f.evidence} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">Not recorded.</p>
          )}
        </Section>

        <Section title="5 · The experience">
          <p className="whitespace-pre-line">{memory.experience}</p>
        </Section>

        <Section title="6 · Key components">
          {memory.components.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {memory.components.map((c, i) => (
                <span key={i} className="rounded-lg bg-slate-100 px-2.5 py-1 text-[12px] font-medium text-slate-600">
                  {c}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">Not recorded.</p>
          )}
        </Section>

        <Section title="7 · What's finished">
          {memory.finished.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5">
              {memory.finished.map((f, i) => (
                <li key={i}>
                  {f.item}
                  <EvidenceTag level={f.evidence} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">Nothing verified finished yet.</p>
          )}
        </Section>

        <Section title="8 · What's left">
          <ul className="list-disc space-y-1 pl-5">
            {memory.remaining.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </Section>

        <Section title="9 · Business model">
          <dl className="space-y-1">
            <div className="flex gap-2">
              <dt className="font-semibold text-slate-500">Price:</dt>
              <dd>{memory.businessModel.price}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold text-slate-500">Billing:</dt>
              <dd>{memory.businessModel.billing}</dd>
            </div>
            {memory.businessModel.fulfillment.length > 0 && (
              <div className="flex gap-2">
                <dt className="font-semibold text-slate-500">Fulfillment:</dt>
                <dd>{memory.businessModel.fulfillment.join(', ')}</dd>
              </div>
            )}
          </dl>
        </Section>

        <Section title="10 · Important decisions">
          {memory.decisions.length > 0 ? (
            <ul className="space-y-2">
              {memory.decisions.map((d, i) => (
                <li key={i} className="rounded-xl bg-slate-50 p-3">
                  <p className="font-semibold text-slate-800">{d.title}</p>
                  {d.why && <p className="mt-0.5 text-[13px] text-slate-600">{d.why}</p>}
                  {d.date && (
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                      {d.date} · {d.scope}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">No recorded decisions for this product yet.</p>
          )}
        </Section>

        <Section title="11 · Files & builds">
          {memory.assets.length > 0 ? (
            <ul className="space-y-1">
              {memory.assets.map((a, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-semibold text-slate-500">{a.label}:</span>
                  <span className="break-all font-mono text-[12px]">{a.value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500">No verified assets recorded.</p>
          )}
        </Section>

        <Section title="12 · Next move">
          <ol className="list-decimal space-y-1 pl-5">
            {memory.nextMoves.map((n, i) => (
              <li key={i} className="font-medium text-slate-800">{n}</li>
            ))}
          </ol>
        </Section>
      </div>

      {/* 13 · Continue with TED — primary action */}
      <div className="border-t border-slate-200/80 p-4">
        <button
          onClick={() => onContinueWithTed(productId)}
          className="w-full rounded-xl bg-slate-900 py-3 text-[14px] font-bold text-white transition hover:bg-slate-700"
        >
          Continue with TED
        </button>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          TED will pick up this product — vision, progress, decisions, next work.
        </p>
      </div>
    </div>
  );
};
