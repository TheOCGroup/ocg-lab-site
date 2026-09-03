import React, { useState } from 'react';
import { Page, Product, OutcomeCategory } from '../types';
import { PHILOSOPHY_PILLARS, FOUNDER_INFO, ECOSYSTEM_STRUCTURE } from '../data/company';
import { PRODUCTS_DATA } from '../data/products';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { CartCheckoutModal } from '../components/CartCheckoutModal';
import { 
  ArrowRight, 
  ShieldCheck, 
  Target, 
  Bot, 
  Zap, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  Layers, 
  ChevronRight,
  User,
  Sliders,
  Cpu,
  Calculator,
  Search,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface HomePageProps {
  setActivePage: (page: Page) => void;
  onOpenWaitlist: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActivePage, onOpenWaitlist }) => {
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeCategory>('All Outcomes');
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const outcomes: OutcomeCategory[] = [
    'Find Customers',
    'Close More Sales',
    'Automate Operations',
    'Analyze Deals',
    'Save Time',
    'Run My Business'
  ];

  const featuredProducts = PRODUCTS_DATA.filter(p => p.featured);
  const aiWorkers = PRODUCTS_DATA.filter(p => p.type === 'AI Worker');
  const calculators = PRODUCTS_DATA.filter(p => p.type === 'Calculator' || p.type === 'SOP Kit');

  return (
    <div className="space-y-24 py-8">
      
      {/* 1. Immersive Hero Section */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-cyan-500/10 via-emerald-500/10 to-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-cyan-400 shadow-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>The OCG Lab Commerce & Product Ecosystem</span>
              </div>

              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.1]">
                Powerful Systems. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400">
                  Real Results.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Everything you need to find opportunities, automate operations, make better decisions, close more business, and grow—all in one practical ecosystem.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setActivePage('storefront')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Browse Product Storefront</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActivePage('about')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-semibold text-sm transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Founder Vision & Story</span>
                </button>
              </div>

              {/* Trust Metric Row */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-left">
                <div>
                  <span className="font-mono text-xl font-extrabold text-cyan-400 block">10+</span>
                  <span className="text-xs text-slate-400">Commercial Products</span>
                </div>
                <div>
                  <span className="font-mono text-xl font-extrabold text-emerald-400 block">100%</span>
                  <span className="text-xs text-slate-400">Operator Tested</span>
                </div>
                <div>
                  <span className="font-mono text-xl font-extrabold text-amber-400 block">1 Account</span>
                  <span className="text-xs text-slate-400">MY OCG Ecosystem</span>
                </div>
              </div>

            </div>

            {/* Hero Right Visual Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-slate-700/80 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-white text-sm">Investor Acquisition System</h3>
                      <p className="text-[11px] text-slate-400">Bundled Business System • $597/mo</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 font-bold">
                    BUNDLED
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">Distressed Property Finder</span>
                    <span className="font-mono text-cyan-400 font-bold">SaaS</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">Deal Analyzer</span>
                    <span className="font-mono text-cyan-400 font-bold">SaaS</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">AI Acquisition Analyst</span>
                    <span className="font-mono text-emerald-400 font-bold">AI Worker</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                    <span className="text-slate-300">Seller Follow-Up Workflow</span>
                    <span className="font-mono text-amber-400 font-bold">Workflow</span>
                  </div>
                </div>

                <button
                  onClick={() => setActivePage('storefront')}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md cursor-pointer"
                >
                  Explore Bundled Systems in Store
                </button>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* 2. WHAT DO YOU WANT TO ACCOMPLISH? (Outcome Navigator Bar) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Customer-First Discovery</span>
            <h2 className="font-heading font-extrabold text-3xl text-white">What do you want to accomplish?</h2>
            <p className="text-slate-400 text-xs">Select your goal below to filter practical systems built for that outcome.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {outcomes.map((outcome) => (
              <button
                key={outcome}
                onClick={() => {
                  setSelectedOutcome(outcome);
                  setActivePage('storefront');
                }}
                className="p-4 rounded-2xl bg-slate-900 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/50 text-center space-y-2 transition-all cursor-pointer group"
              >
                <Sparkles className="w-5 h-5 text-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 block">{outcome}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Storefront Catalogue</span>
            <h2 className="font-heading font-extrabold text-3xl text-white mt-1">Featured Business Systems</h2>
          </div>
          <button
            onClick={() => setActivePage('storefront')}
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="glass-card p-6 rounded-3xl border border-slate-800 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                    {product.type}
                  </span>
                  <span className="font-mono text-sm font-extrabold text-white">
                    ${product.price}{product.billingModel === 'monthly' ? '/mo' : ''}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl text-white">{product.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{product.summary}</p>

                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-cyan-400 block font-mono">OUTCOME:</strong>
                  {product.expectedResult}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProductDetail(product)}
                  className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => setSelectedProductDetail(product)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  Get System
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. AI WORKERS & AUTOMATION SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Specialized AI Workforce</span>
          <h2 className="font-heading font-extrabold text-3xl text-white">AI Workers Built for Business Roles</h2>
          <p className="text-slate-400 text-xs">Configure AI worker agents to handle lead discovery, walkthrough photo parsing, and intake tasks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiWorkers.map((worker) => (
            <div key={worker.id} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-emerald-400" />
                  <span className="font-mono text-xs text-emerald-400 font-bold">AI WORKER AGENT</span>
                </div>
                <span className="font-mono text-sm font-bold text-white">${worker.price}/mo</span>
              </div>

              <h3 className="font-heading font-bold text-xl text-white">{worker.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{worker.summary}</p>

              <div className="space-y-1.5 pt-2">
                {worker.features.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button onClick={() => setSelectedProductDetail(worker)} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs">
                  Deploy AI Worker
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOW THE OCG LAB WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Simple Customer Journey</span>
          <h2 className="font-heading font-extrabold text-3xl text-white">How The OCG Lab Works</h2>
          <p className="text-slate-400 text-sm">From outcome discovery to instant entitlement access in MY OCG.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Discover', desc: 'Choose your desired business outcome.' },
            { step: '02', title: 'Choose', desc: 'Select product & fulfillment mode (DIY / Installed / Managed).' },
            { step: '03', title: 'Purchase', desc: 'Secure server-verified purchase transaction.' },
            { step: '04', title: 'Access', desc: 'Instant entitlement access inside MY OCG.' },
            { step: '05', title: 'Scale', desc: 'Automate operations & add compatible tools.' },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                {item.step}
              </span>
              <h4 className="font-heading font-bold text-sm text-white">{item.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FOUNDER SPOTLIGHT & CREDIBILITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-mono text-cyan-400">Founder Governance</span>
            <h3 className="font-heading font-extrabold text-2xl text-white">Genaro Ocasio — Managing Principal</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              {FOUNDER_INFO.bio}
            </p>
            <p className="text-slate-400 text-xs italic">
              "{FOUNDER_INFO.philosophy}"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button onClick={() => setActivePage('about')} className="px-6 py-3 rounded-xl bg-slate-800 text-white font-bold text-xs">
              Read Ocasio Collective Vision
            </button>
            <button onClick={() => setActivePage('storefront')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg">
              Explore Products
            </button>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CartCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onNavigateToMyOCG={() => setActivePage('my-ocg')}
      />

    </div>
  );
};
