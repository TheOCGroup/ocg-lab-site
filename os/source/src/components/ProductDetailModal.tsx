import React, { useState } from 'react';
import { Product, FulfillmentOption } from '../types';
import { CartStore } from '../utils/cartStore';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Clock, 
  Zap,
  ShoppingCart,
  Building2,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenCheckout
}) => {
  const [selectedFulfillment, setSelectedFulfillment] = useState<FulfillmentOption>('DIY');

  if (!product) return null;

  const handleAddToCart = () => {
    CartStore.addToCart(product, selectedFulfillment);
    toast.success(`Added ${product.title} (${selectedFulfillment}) to your cart!`);
  };

  const handleDirectBuy = () => {
    CartStore.addToCart(product, selectedFulfillment);
    onClose();
    onOpenCheckout();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 1, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header & Badges */}
          <div className="space-y-3 border-b border-slate-800 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                {product.type}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                {product.outcomeCategory}
              </span>
              <span className="text-xs font-mono text-slate-400">Status: {product.status}</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              {product.title}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {product.subtitle}
            </p>
          </div>

          {/* Core Outcome & Problem Solved Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* What problem does it solve? */}
            <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block font-bold">
                The Problem Solved
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {product.problemSolved}
              </p>
            </div>

            {/* What result does it create? */}
            <div className="p-5 bg-slate-950/80 rounded-2xl border border-cyan-800/60 space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block font-bold">
                Expected Business Result
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {product.expectedResult}
              </p>
            </div>

          </div>

          {/* How It Works & What's Included */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* How does it work? */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-lg text-white">How It Works</h3>
              <div className="space-y-2">
                {product.howItWorks.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-mono font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What is included? */}
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-lg text-white">What's Included</h3>
              <div className="space-y-2">
                {product.whatsIncluded.map((inc, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>

              {/* Integrations */}
              <div className="pt-3 border-t border-slate-800 space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 block">Connects With:</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.integrations.map((integ, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-950 text-slate-300 border border-slate-800">
                      {integ}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Fulfillment Mode Selector (DIY / Installed / Managed) */}
          <div className="space-y-3 bg-slate-950/90 p-5 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center">
              <h4 className="font-heading font-bold text-sm text-white">Choose Fulfillment Mode</h4>
              <span className="text-[11px] text-slate-400 font-mono">Customer Choice</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {product.fulfillmentOptions.map((opt) => {
                const isSelected = selectedFulfillment === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setSelectedFulfillment(opt)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold text-cyan-400 block">{opt}</span>
                    <span className="text-[11px] font-medium mt-1">
                      {opt === 'DIY' && 'Self Setup'}
                      {opt === 'INSTALL IT FOR ME' && '+ $950 Setup'}
                      {opt === 'DONE FOR YOU' && 'Turnkey Build'}
                      {opt === 'MANAGED FOR YOU' && '24/7 Managed'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing & Checkout Footer Bar */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-extrabold text-white">${product.price}</span>
              <span className="text-xs text-slate-400">
                {product.billingModel === 'monthly' ? '/ month' : product.billingModel === 'annual' ? '/ year' : 'one-time purchase'}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleAddToCart}
                className="w-1/2 sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700"
              >
                <ShoppingCart className="w-4 h-4 text-cyan-400" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleDirectBuy}
                className="w-1/2 sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 text-slate-950 font-extrabold text-xs shadow-xl shadow-cyan-500/20 hover:opacity-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Buy & Access Now</span>
              </button>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
