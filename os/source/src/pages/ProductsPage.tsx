import React, { useState } from 'react';
import { Product, ProductType, OutcomeCategory } from '../types';
import { PRODUCTS_DATA } from '../data/products';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { CartCheckoutModal } from '../components/CartCheckoutModal';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Bot, 
  Calculator, 
  Building2, 
  Filter,
  ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductsPageProps {
  onNavigateToMyOCG: () => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigateToMyOCG }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState<OutcomeCategory>('All Outcomes');
  const [selectedType, setSelectedType] = useState<string>('All Types');
  
  // Modals state
  const [activeProductDetail, setActiveProductDetail] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const outcomes: OutcomeCategory[] = [
    'All Outcomes',
    'Find Customers',
    'Close More Sales',
    'Automate Operations',
    'Analyze Deals',
    'Save Time',
    'Run My Business'
  ];

  const productTypes = [
    'All Types',
    'SaaS',
    'AI Worker',
    'Workflow',
    'Calculator',
    'Business System',
    'Service',
    'SOP Kit'
  ];

  const filteredProducts = PRODUCTS_DATA.filter(product => {
    const matchesOutcome = selectedOutcome === 'All Outcomes' || product.outcomeCategory === selectedOutcome;
    const matchesType = selectedType === 'All Types' || product.type === selectedType;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.problemSolved.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOutcome && matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Outcome-First Storefront Banner */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
          The OCG Lab Storefront & Marketplace
        </span>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white">
          What do you want to accomplish?
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Browse software applications, custom AI workers, automated workflows, calculators, and implementation services by business outcome.
        </p>
      </div>

      {/* Outcome Category Navigator Buttons */}
      <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold px-2">
          <Sparkles className="w-4 h-4" />
          <span>Shop By Desired Business Outcome:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {outcomes.map((outcome) => (
            <button
              key={outcome}
              onClick={() => setSelectedOutcome(outcome)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedOutcome === outcome
                  ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {outcome}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Search & Type Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Type selector */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {productTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedType === type
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-800 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by problem or tool (e.g. follow-up, distressed)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>

      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`glass-card p-6 rounded-3xl space-y-5 border flex flex-col justify-between relative transition-all duration-300 ${
              product.featured 
                ? 'border-cyan-500/80 bg-slate-900/90 shadow-xl shadow-cyan-950/40' 
                : 'border-slate-800'
            }`}
          >
            {product.featured && (
              <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                FEATURED SYSTEM
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between pt-1">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-slate-950 text-cyan-400 border border-slate-800 font-bold">
                  {product.type}
                </span>
                <span className="text-[11px] font-mono font-extrabold text-white">
                  ${product.price}
                  <span className="text-[10px] text-slate-400 font-normal">
                    {product.billingModel === 'monthly' ? '/mo' : ''}
                  </span>
                </span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-xl text-white">{product.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.subtitle}</p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-mono text-amber-400 block font-bold">BUSINESS RESULT:</span>
                <p className="text-[11px] text-slate-300 line-clamp-2">{product.expectedResult}</p>
              </div>

              {/* Fulfillment tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {product.fulfillmentOptions.map((opt, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-950 text-slate-400 border border-slate-800">
                    {opt}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveProductDetail(product)}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Learn More & Specs
              </button>

              <button
                onClick={() => setActiveProductDetail(product)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold text-xs shadow-md"
              >
                View Details
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeProductDetail}
        onClose={() => setActiveProductDetail(null)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Cart Checkout Modal */}
      <CartCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onNavigateToMyOCG={onNavigateToMyOCG}
      />

    </div>
  );
};
