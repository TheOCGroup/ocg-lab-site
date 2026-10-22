/**
 * OCG INTELLIGENCE — focused workspace inside TED.
 *
 * Market Radar is the only implemented module: a read-only view over the
 * reviewed OCG-ONE intelligence logic (src/tedexperience/intelligence/,
 * ported from TheOCGroup/OCG-ONE PR #20) and its source-backed evidence
 * dataset (2026-10-20 baseline). Signal, Watchtower, and Strategist are
 * PLANNED — they render an honest planned state, never fake data.
 *
 * Truth rules (charter): nothing here is LIVE. Evidence without a rubric
 * score is reported as "Not scored", never as zero. Pricing is shown
 * only through the fail-closed gate, or as clearly labeled illustrative
 * scenario arithmetic. No network calls are made by this workspace.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ExternalLink, Radar, ShieldAlert } from 'lucide-react';
import { INTELLIGENCE_PRODUCT } from '../intelligenceProduct';
import {
  buildIntelligenceDashboard,
  compareReceptionistPricing,
  evaluatePricingEvidence,
  COMPETITOR_PROFILES,
  DEFAULT_PRICING_SCENARIO,
  EVIDENCE_CATEGORIES,
  EVIDENCE_RESEARCHED_AT,
  isSafeExternalUrl,
  PRICING_EVIDENCE_CANDIDATES,
  type IntelligenceDashboard,
} from '../intelligence';

type ModuleId = 'market-radar' | 'signal' | 'watchtower' | 'strategist';

const PLANNED_NOTES: Record<Exclude<ModuleId, 'market-radar'>, string> = {
  signal:
    'Signal will normalize external evidence and provenance. It is planned only — no sources are collected or monitored today.',
  watchtower:
    'Watchtower will monitor competitor pricing, features, and messaging for changes. It is planned only — no monitoring is running today.',
  strategist:
    'Strategist will turn verified evidence into recommendations that require your approval. It is planned only — no recommendations are generated today.',
};

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toISOString().slice(0, 10);
}

function Chip({ children, tone = 'slate' }: { children: React.ReactNode; tone?: 'slate' | 'blue' | 'amber' | 'red' | 'emerald' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${tones[tone]}`}>
      {children}
    </span>
  );
}

export interface TedIntelligenceWorkspaceProps {
  onBackToChat: () => void;
  /** Test seam: injects an alternate dashboard (empty/failure states). */
  dashboardOverride?: IntelligenceDashboard | null;
}

export const TedIntelligenceWorkspace: React.FC<TedIntelligenceWorkspaceProps> = ({ onBackToChat, dashboardOverride }) => {
  const [module, setModule] = useState<ModuleId>('market-radar');
  const rootRef = useRef<HTMLElement>(null);

  const [loadError, setLoadError] = useState<string | null>(null);
  const dashboard = useMemo<IntelligenceDashboard | null>(() => {
    if (dashboardOverride !== undefined) return dashboardOverride;
    try {
      return buildIntelligenceDashboard({
        profiles: COMPETITOR_PROFILES,
        pricingScenario: DEFAULT_PRICING_SCENARIO,
        pricingEvidence: PRICING_EVIDENCE_CANDIDATES,
      });
    } catch {
      return null;
    }
  }, [dashboardOverride]);
  useEffect(() => {
    if (dashboardOverride === undefined && dashboard === null) {
      setLoadError('Intelligence data could not be loaded. No data is shown rather than guessed.');
    }
  }, [dashboard, dashboardOverride]);

  // Focus the workspace on open (keyboard users land here, not lost in chat).
  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  // Illustrative pricing scenario (analyst inputs; never a quote).
  const [calls, setCalls] = useState<number>(DEFAULT_PRICING_SCENARIO.calls);
  const [uniqueCustomers, setUniqueCustomers] = useState<number>(DEFAULT_PRICING_SCENARIO.uniqueCustomers);
  const scenarioOutcome = useMemo(() => {
    try {
      return { scenario: compareReceptionistPricing({ calls, uniqueCustomers, smithPlan: 'pro', goodcallPlan: 'starter' }), error: null as string | null };
    } catch (e) {
      return { scenario: null, error: e instanceof Error ? e.message : 'Invalid scenario inputs.' };
    }
  }, [calls, uniqueCustomers]);
  const scenario = scenarioOutcome.scenario;
  const scenarioError = scenarioOutcome.error;

  const pricingReviews = useMemo(
    () => evaluatePricingEvidence(PRICING_EVIDENCE_CANDIDATES),
    [],
  );

  const quality = dashboard?.quality;

  return (
    <section
      ref={rootRef}
      tabIndex={-1}
      aria-label="OCG INTELLIGENCE workspace"
      className="h-full overflow-y-auto bg-slate-50/50 px-4 py-6 outline-none sm:px-8"
    >
      <div className="mx-auto w-full max-w-[880px]">
        <button
          onClick={onBackToChat}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to TED conversation
        </button>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              OCG LAB / OCG INTELLIGENCE
            </p>
            <h2 className="mt-1.5 flex items-center gap-2.5 font-heading text-[20px] font-extrabold sm:text-[22px] tracking-tight text-slate-900">
              <Radar className="h-6 w-6 text-blue-700" aria-hidden />
              {INTELLIGENCE_PRODUCT.title}
            </h2>
            <p className="mt-1 max-w-[560px] text-[13px] leading-relaxed text-slate-600">
              {INTELLIGENCE_PRODUCT.subtitle}. Evidence first: every claim below links to its source.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Chip tone="blue">Preview · Read-only</Chip>
            <span className="text-[12px] text-slate-500">Evidence researched {EVIDENCE_RESEARCHED_AT} · recheck before commercial use</span>
          </div>
        </div>

        {/* Module rail — Market Radar implemented; the rest are PLANNED. */}
        <div role="tablist" aria-label="Intelligence modules" className="mt-6 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
          {INTELLIGENCE_PRODUCT.modules.map((m) => {
            const id = m.id as ModuleId;
            const active = module === id;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={active}
                onClick={() => setModule(id)}
                className={`inline-flex min-h-[40px] shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-[13px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${
                  active ? 'bg-slate-900 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {m.label}
                <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${active ? 'text-blue-200' : m.status === 'PREVIEW' ? 'text-blue-600' : 'text-slate-400'}`}>
                  {m.status}
                </span>
              </button>
            );
          })}
        </div>

        {module !== 'market-radar' ? (
          <div role="tabpanel" className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-6">
            <Chip>Planned</Chip>
            <h3 className="mt-3 font-heading text-[16px] font-bold text-slate-900">
              {INTELLIGENCE_PRODUCT.modules.find((m) => m.id === module)?.label} is not built yet
            </h3>
            <p className="mt-1.5 max-w-[620px] text-[13px] leading-relaxed text-slate-600">
              {PLANNED_NOTES[module as Exclude<ModuleId, 'market-radar'>]}
            </p>
          </div>
        ) : loadError || !dashboard ? (
          <div role="tabpanel" className="mt-5 rounded-2xl border border-red-200 bg-white p-6">
            <Chip tone="red">Unavailable</Chip>
            <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
              {loadError ?? 'Intelligence data could not be loaded. No data is shown rather than guessed.'}
            </p>
          </div>
        ) : (
          <div role="tabpanel" aria-label="Market Radar">
            {/* Evidence quality */}
            <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-5">
              <h3 className="font-heading text-[15px] font-bold text-slate-900">Evidence quality</h3>
              {quality && quality.totalRecords === 0 ? (
                <p className="mt-2 text-[13px] text-slate-500">No evidence loaded yet. Scores and comparisons stay empty until sourced evidence exists.</p>
              ) : quality ? (
                <>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Records</p>
                      <p className="mt-1 text-[18px] font-bold text-slate-900">{quality.totalRecords}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Scored</p>
                      <p className="mt-1 text-[18px] font-bold text-slate-900">{quality.accepted}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Unscored</p>
                      <p className="mt-1 text-[18px] font-bold text-slate-900">{quality.unscored}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Rejected</p>
                      <p className="mt-1 text-[18px] font-bold text-slate-900">{quality.rejected}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
                    {quality.scoringState === 'NOT_SCORED'
                      ? 'Not scored yet — the scoring rubric is not defined, so no competitor scores are shown. Unscored evidence is real evidence; it is never treated as a zero.'
                      : quality.scoringState === 'PARTIAL'
                        ? 'Partially scored — some evidence has rubric scores, some does not. Coverage below shows exactly what is missing.'
                        : 'All accepted evidence carries rubric scores.'}
                  </p>
                  <p className="mt-1.5 text-[12.5px] text-slate-600">
                    Newest evidence: {fmtDate(quality.newestEvidenceAt)}
                    {quality.newestAgeDays !== null ? ` (${quality.newestAgeDays} day${quality.newestAgeDays === 1 ? '' : 's'} old)` : ''}
                    {quality.stale ? ' — older than the 30-day freshness threshold; recheck before use.' : ' — within the 30-day freshness threshold.'}
                  </p>
                  {dashboard.alerts.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {dashboard.alerts.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12.5px] text-amber-800">
                          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                          <span><strong>{a.subject}:</strong> {a.message}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : null}
            </div>

            {/* Competitor comparison */}
            <h3 className="mt-7 font-heading text-[16px] font-bold text-slate-900">Competitor comparison</h3>
            {dashboard.competitors.length === 0 ? (
              <p className="mt-2 rounded-2xl border border-slate-200/80 bg-white p-5 text-[13px] text-slate-500">
                No competitors loaded. Add source-backed evidence before any comparison is shown.
              </p>
            ) : (
              <div className="mt-3 space-y-4">
                {dashboard.competitors.map((c) => (
                  <article key={c.name} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_12px_-6px_rgba(15,23,42,0.12)] sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h4 className="font-heading text-[16px] font-bold text-slate-900">{c.name}</h4>
                        {c.website && isSafeExternalUrl(c.website) ? (
                          <a href={c.website} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-[12px] font-medium text-blue-700 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                            {c.website.replace(/^https?:\/\//, '')}
                            <ExternalLink className="h-3 w-3" aria-hidden />
                          </a>
                        ) : c.website ? (
                          <span className="mt-0.5 block text-[12px] text-slate-500">{c.website}</span>
                        ) : null}
                        <p className="mt-1 text-[12.5px] text-slate-600">Latest evidence: {fmtDate(c.latestEvidenceAt)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        {c.assessment.score !== null ? (
                          <Chip tone="emerald">Score {c.assessment.score} · coverage {c.assessment.coveragePercent}%</Chip>
                        ) : (
                          <Chip tone="amber">Not scored — rubric pending</Chip>
                        )}
                        {c.requiresReview && <Chip>Review required</Chip>}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {EVIDENCE_CATEGORIES.map((cat) => {
                        const scored = c.assessment.categories[cat];
                        const observed = c.classifications.filter(
                          (x) => x.record.category === cat && x.classification.verdict !== 'rejected',
                        ).length;
                        return (
                          <div key={cat} className="rounded-xl bg-slate-50 px-3 py-2.5">
                            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{cat}</p>
                            <p className="mt-0.5 text-[12.5px] font-medium text-slate-700">
                              {scored
                                ? `${scored.score} (${scored.count} scored)`
                                : observed > 0
                                  ? `${observed} observed · unscored`
                                  : 'No observed evidence'}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Evidence</p>
                      <ul className="mt-2 space-y-3">
                        {c.classifications.map((x, i) => (
                          <li key={i} className="text-[13px] leading-relaxed text-slate-600">
                            <span className="flex flex-wrap items-center gap-2">
                              <Chip tone="slate">{x.record.category}</Chip>
                              <Chip tone={x.classification.verdict === 'rejected' ? 'red' : x.classification.verdict === 'unscored' ? 'amber' : 'emerald'}>
                                {x.classification.verdict === 'rejected' ? 'Rejected' : x.record.status}
                              </Chip>
                              {x.classification.verdict === 'unscored' && <span className="text-[12.5px] text-slate-600">Unscored — rubric pending</span>}
                              {x.classification.verdict === 'rejected' && (
                                <span className="text-[12px] text-red-600">{x.classification.reasons.join('; ')}</span>
                              )}
                            </span>
                            <span className="mt-1 block text-slate-700">{x.record.summary}</span>
                            <span className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[12.5px] text-slate-600">
                              {isSafeExternalUrl(x.record.sourceUrl) ? (
                                <a href={x.record.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-blue-700 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                                  Source <ExternalLink className="h-3 w-3" aria-hidden />
                                </a>
                              ) : (
                                <span>Source unavailable (unsafe URL withheld)</span>
                              )}
                              <span>Retrieved {fmtDate(x.record.retrievedAt)}</span>
                              <span>{x.record.usageRights}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pricing — fail-closed gate + illustrative scenario */}
            <h3 className="mt-7 font-heading text-[16px] font-bold text-slate-900">Pricing evidence</h3>
            <div className="mt-3 rounded-2xl border border-slate-200/80 bg-white p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone={dashboard.pricing.status === 'REVIEWED' ? 'emerald' : 'red'}>
                  Gate: {dashboard.pricing.status}
                </Chip>
                <span className="text-[13px] text-slate-600">
                  {dashboard.pricing.status === 'REVIEWED'
                    ? 'Human-reviewed evidence matches the modeled terms.'
                    : 'No unverified price is presented as verified. A human reviewer must sign off the exact source terms first.'}
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {dashboard.pricing.findings.map((f) => (
                  <li key={`${f.provider}-${f.plan}`} className="flex flex-wrap items-center gap-2 text-[13px] text-slate-700">
                    <strong>{f.provider} · {f.plan}</strong>
                    <Chip tone={f.status === 'REVIEWED' ? 'emerald' : 'amber'}>{f.status}</Chip>
                    {f.issues.length > 0 && <span className="text-slate-600">{f.issues.join('; ')}</span>}
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                {PRICING_EVIDENCE_CANDIDATES.map((r, i) => (
                  <p key={i} className="text-[12.5px] leading-relaxed text-slate-600">
                    <strong>{r.provider} · {r.plan}</strong> — ${r.basePrice}/mo, {r.includedUnits} included, ${r.overagePrice} overage, billed per{' '}
                    {r.billingUnit === 'per_call' ? 'call' : 'unique customer'}. Observed {fmtDate(r.verifiedAt)} ·{' '}
                    {pricingReviews[i]?.status === 'REVIEWED' ? 'reviewed' : `human review pending (${(pricingReviews[i]?.issues ?? []).join('; ')})`} ·{' '}
                    {isSafeExternalUrl(r.sourceUrl) ? (
                      <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-700 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">source</a>
                    ) : (
                      <span>source unavailable</span>
                    )}
                  </p>
                ))}
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-[13px] font-semibold text-slate-800">Illustrative scenario — published-plan arithmetic only, not a quote</p>
                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <label className="block">
                    <span className="mb-1 block text-[12.5px] font-medium text-slate-600">Calls / month</span>
                    <input
                      type="number"
                      min={0}
                      value={calls}
                      onChange={(e) => setCalls(Number(e.target.value))}
                      aria-label="Calls per month"
                      className="min-h-[40px] w-32 rounded-xl border border-slate-300 px-3 py-2 text-[13px] text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[12.5px] font-medium text-slate-600">Unique customers / month</span>
                    <input
                      type="number"
                      min={0}
                      value={uniqueCustomers}
                      onChange={(e) => setUniqueCustomers(Number(e.target.value))}
                      aria-label="Unique customers per month"
                      className="min-h-[40px] w-40 rounded-xl border border-slate-300 px-3 py-2 text-[13px] text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                    />
                  </label>
                </div>
                {scenarioError ? (
                  <p role="alert" className="mt-3 text-[13px] font-medium text-red-600">{scenarioError}</p>
                ) : scenario ? (
                  <div className="mt-3 text-[13px] leading-relaxed text-slate-700">
                    <p>Smith.ai ({scenario.smith.plan}, per call): <strong>${scenario.smith.estimate}</strong> · Goodcall ({scenario.goodcall.plan}, per unique customer): <strong>${scenario.goodcall.estimate}</strong></p>
                    <p className="mt-1 text-[12.5px] text-slate-600">{scenario.caveat}</p>
                    <p className="mt-1 flex flex-wrap gap-x-3 text-[12px]">
                      {scenario.sources.filter(isSafeExternalUrl).map((s) => (
                        <a key={s} href={s} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-blue-700 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                          {s.replace('https://', '')} <ExternalLink className="h-3 w-3" aria-hidden />
                        </a>
                      ))}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <p className="mt-5 pb-4 text-[12.5px] leading-relaxed text-slate-500">
              Read-only research preview. No live provider connection, no scraping, no writes. Logic ported from the reviewed
              OCG-ONE Market Radar prototype (PR #20); evidence from the 2026-10-20 public-source baseline — vendor-reported
              claims, not independently verified performance. Source repository: {INTELLIGENCE_PRODUCT.sourceRepository}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
