/**
 * TED Phase 2.3 — "Your Products" inventory.
 *
 * Founder-facing product inventory. NOT a storefront. NOT a dashboard.
 * Clean, calm cards answering: WHAT IS IT? / WHERE ARE WE? / WHAT'S NEXT?
 * TED/chat remains the primary surface; this is secondary.
 */

import React from 'react';
import { INTELLIGENCE_PRODUCT } from '../intelligenceProduct';
import { getProductCardSummaries, FounderProductStatus } from '../productMemory';

const STATUS_STYLES: Record<FounderProductStatus, { bg: string; text: string; dot: string }> = {
  IDEA: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  BUILDING: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'NEEDS ATTENTION': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'READY TO REVIEW': { bg: 'bg-violet-50', text: 'text-violet-700', dot: 'bg-violet-500' },
  READY: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  LIVE: { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-600' },
  'STATUS UNAVAILABLE': { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-300' },
};

function StatusBadge({ status }: { status: FounderProductStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
      {status}
    </span>
  );
}

export interface TedProductsProps {
  onOpenProduct: (productId: string) => void;
  onContinueWithTed: (productId: string) => void;
  /** Opens the focused OCG INTELLIGENCE workspace inside TED. */
  onOpenIntelligence?: () => void;
}

export const TedProducts: React.FC<TedProductsProps> = ({ onOpenProduct, onContinueWithTed, onOpenIntelligence }) => {
  const products = getProductCardSummaries();

  return (
    <section aria-label="Your Products" className="border-t border-slate-200/80 bg-slate-50/50 px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-[760px]">
        <h2 className="font-heading text-[18px] font-extrabold tracking-tight text-slate-900">
          Your Products
        </h2>
        <p className="mt-1 text-[13px] text-slate-500">
          OCG LAB's product inventory — what we're building, where it stands, what's next.
        </p>

        <div aria-label="OCG INTELLIGENCE development overview" className="mt-5 rounded-2xl border border-blue-200 bg-white p-5">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-700">In development · OCG LAB research</p>
          <h3 className="mt-2 font-heading text-[16px] font-bold text-slate-900">{INTELLIGENCE_PRODUCT.title}</h3>
          <p className="mt-1 text-[13px] text-slate-600">{INTELLIGENCE_PRODUCT.whatIsIt}</p>
          <p className="mt-3 text-[12.5px] text-slate-600">Market Radar: preview only. Signal, Watchtower and Strategist: planned.</p>
          <p className="mt-2 text-[12px] text-slate-600">Next: {INTELLIGENCE_PRODUCT.whatsNext}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {onOpenIntelligence && (
              <button
                onClick={onOpenIntelligence}
                className="inline-flex min-h-[40px] items-center rounded-xl bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
              >
                Open Intelligence workspace
              </button>
            )}
            <a href={INTELLIGENCE_PRODUCT.pullRequest} target="_blank" rel="noopener noreferrer"
               className="inline-flex rounded-xl border border-blue-200 px-4 py-2 text-[13px] font-semibold text-blue-800 hover:bg-blue-50">
              View development progress
            </a>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {products.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_-6px_rgba(15,23,42,0.12)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-heading text-[15px] font-bold tracking-tight text-slate-900">
                    {p.title}
                  </h3>
                  <p className="mt-0.5 text-[13px] leading-snug text-slate-600">
                    {p.whatIsIt}
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </div>

              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  What's next
                </p>
                <p className="mt-1 text-[13px] text-slate-700">{p.whatsNext}</p>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => onOpenProduct(p.id)}
                  className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
                >
                  Open Product
                </button>
                <button
                  onClick={() => onContinueWithTed(p.id)}
                  className="min-h-[40px] rounded-xl bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
                >
                  Continue with TED
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
