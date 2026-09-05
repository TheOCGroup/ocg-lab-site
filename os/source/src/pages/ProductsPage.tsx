import React, { useMemo, useState } from "react";
import { OutcomeCategory, Product } from "../types";
import { PRODUCTS_DATA } from "../data/products";
import { ProductDetailModal } from "../components/ProductDetailModal";
import { CartCheckoutModal } from "../components/CartCheckoutModal";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Filter,
  Search,
  Sparkles,
} from "lucide-react";

interface ProductsPageProps {
  onNavigateToMyOCG: () => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigateToMyOCG }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeCategory>("All Outcomes");
  const [selectedType, setSelectedType] = useState("All Types");
  const [activeProductDetail, setActiveProductDetail] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const outcomes: OutcomeCategory[] = [
    "All Outcomes",
    "Find Customers",
    "Close More Sales",
    "Automate Operations",
    "Analyze Deals",
    "Save Time",
    "Run My Business",
  ];

  const productTypes = [
    "All Types",
    "SaaS",
    "AI Worker",
    "Workflow",
    "Calculator",
    "Business System",
    "Service",
    "SOP Kit",
  ];

  const filteredProducts = useMemo(
    () =>
      PRODUCTS_DATA.filter((product) => {
        const matchesOutcome = selectedOutcome === "All Outcomes" || product.outcomeCategory === selectedOutcome;
        const matchesType = selectedType === "All Types" || product.type === selectedType;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          product.title.toLowerCase().includes(q) ||
          product.summary.toLowerCase().includes(q) ||
          product.problemSolved.toLowerCase().includes(q);
        return matchesOutcome && matchesType && matchesSearch;
      }),
    [searchQuery, selectedOutcome, selectedType],
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:space-y-10 sm:px-6 sm:py-10 lg:px-8">
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#07101c] p-5 sm:p-8 lg:p-10">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400" />
        <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-cyan-400/8 blur-3xl" />

        <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-200">
                OCG LAB Storefront
              </span>
              <span className="rounded-full border border-emerald-300/15 bg-emerald-300/8 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-200">
                Practical Software + AI
              </span>
            </div>

            <h1 className="max-w-3xl font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Start with the outcome.
              <span className="mt-1 block bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                Then choose the system.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Find the OCG LAB product that solves the operating problem in front of you. Search by business result, compare the actual system, then open the product details before buying.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
              {["Verified product library", "Outcome-first discovery", "Real system details"].map((label) => (
                <div key={label} className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.025] px-3 py-2.5 text-[11px] font-medium text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-black/20 p-3 sm:p-4">
            <label htmlFor="store-search" className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
              What are you trying to solve?
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-300" />
              <input
                id="store-search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="e.g. find deals, follow up, underwrite..."
                className="w-full rounded-2xl border border-white/10 bg-[#020711] py-3.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40"
              />
            </div>
            <p className="mt-2 text-[10px] leading-4 text-slate-500">Showing {filteredProducts.length} matching product{filteredProducts.length === 1 ? "" : "s"}.</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">1 · Choose the result</p>
            <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">What do you want the system to do?</h2>
          </div>
          <button
            onClick={() => setShowFilters((open) => !open)}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-[10px] font-semibold text-slate-300 md:hidden"
          >
            <Filter className="h-3.5 w-3.5" />
            Type
          </button>
        </div>

        <div className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {outcomes.map((outcome) => {
            const active = selectedOutcome === outcome;
            return (
              <button
                key={outcome}
                onClick={() => setSelectedOutcome(outcome)}
                className={`snap-start whitespace-nowrap rounded-2xl border px-4 py-3 text-xs font-bold transition ${
                  active
                    ? "border-cyan-300/30 bg-gradient-to-r from-blue-500/18 via-cyan-400/16 to-emerald-400/14 text-white shadow-lg shadow-cyan-950/30"
                    : "border-white/8 bg-white/[0.025] text-slate-400 hover:text-white"
                }`}
              >
                {outcome}
              </button>
            );
          })}
        </div>
      </section>

      <section className={`${showFilters ? "block" : "hidden"} md:block`}>
        <div className="rounded-[22px] border border-white/8 bg-white/[0.018] p-3">
          <div className="mb-2 flex items-center gap-2 px-1 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">
            <Filter className="h-3 w-3" />
            2 · Narrow by product type
          </div>
          <div className="flex flex-wrap gap-2">
            {productTypes.map((type) => {
              const active = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`rounded-xl border px-3 py-2 text-[11px] font-semibold transition ${
                    active
                      ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
                      : "border-white/8 bg-[#07101c] text-slate-400 hover:text-white"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-500">3 · Inspect the system</p>
          <h2 className="mt-1 text-xl font-bold text-white">Products that match your goal</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className={`group flex min-w-0 flex-col overflow-hidden rounded-[24px] border bg-[#07101c] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/25 sm:p-6 ${
                product.featured ? "border-cyan-300/25 shadow-xl shadow-cyan-950/20" : "border-white/8"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-cyan-300">{product.type}</span>
                  <h3 className="mt-2 text-xl font-bold text-white">{product.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{product.subtitle}</p>
                </div>
                {product.featured && <Sparkles className="h-4 w-4 shrink-0 text-emerald-300" />}
              </div>

              <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-3.5">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-300">Expected result</p>
                <p className="mt-1 line-clamp-3 text-[11px] leading-5 text-slate-300">{product.expectedResult}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {product.fulfillmentOptions.slice(0, 3).map((option) => (
                  <span key={option} className="rounded-lg border border-white/8 bg-white/[0.025] px-2 py-1 font-mono text-[9px] text-slate-500">
                    {option}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-500">Price</p>
                  <p className="mt-0.5 text-lg font-extrabold text-white">${product.price}{product.billingModel === "monthly" ? <span className="text-xs font-medium text-slate-500">/mo</span> : null}</p>
                </div>
                <button
                  onClick={() => setActiveProductDetail(product)}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 px-4 py-2.5 text-xs font-extrabold text-slate-950 shadow-lg shadow-cyan-950/20"
                >
                  Inspect
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.018] px-5 py-12 text-center">
            <Bot className="mx-auto h-6 w-6 text-cyan-300" />
            <p className="mt-3 text-sm font-bold text-white">No exact match yet.</p>
            <p className="mt-1 text-xs text-slate-500">Clear a filter or try a different business problem.</p>
          </div>
        )}
      </section>

      <ProductDetailModal
        product={activeProductDetail}
        onClose={() => setActiveProductDetail(null)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <CartCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onNavigateToMyOCG={onNavigateToMyOCG}
      />
    </div>
  );
};
