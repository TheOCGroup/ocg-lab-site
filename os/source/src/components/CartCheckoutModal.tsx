import React, { useState } from 'react';
import { CartStore } from '../utils/cartStore';
import { Page } from '../types';
import { X, CheckCircle2, Lock, ShieldCheck, ArrowRight, ShoppingCart, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface CartCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMyOCG: () => void;
}

export const CartCheckoutModal: React.FC<CartCheckoutModalProps> = ({
  isOpen,
  onClose,
  onNavigateToMyOCG
}) => {
  const [email, setEmail] = useState('operator@company.com');
  const [name, setName] = useState('Alex Mercer');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const cart = CartStore.getCart();
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setIsProcessing(true);
    toast.info('Verifying secure payment transaction...');

    setTimeout(() => {
      try {
        const { order, newEntitlements } = CartStore.checkoutCart();
        setIsProcessing(false);
        toast.success(`Payment verified! Granted ${newEntitlements.length} entitlement(s).`);
        onClose();
        onNavigateToMyOCG();
      } catch (err) {
        setIsProcessing(false);
        toast.error('Checkout failed. Please try again.');
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 1, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-heading font-bold text-xl text-white">Secure E-Commerce Checkout</h3>
          </div>
          <p className="text-xs text-slate-400">Server-verified entitlement provisioning via OCG Engine.</p>
        </div>

        {/* Cart Item Summary */}
        <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 max-h-48 overflow-y-auto">
          <span className="text-[11px] font-mono text-cyan-400 block font-semibold">Order Summary ({cart.length} items):</span>
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-slate-800/60">
              <div>
                <span className="font-semibold text-white block">{item.product.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">Fulfillment: {item.selectedFulfillment}</span>
              </div>
              <span className="font-mono font-bold text-cyan-400">${item.product.price}</span>
            </div>
          ))}
          <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-800">
            <span className="text-slate-300">Total Investment:</span>
            <span className="font-mono text-base text-emerald-400">${total}</span>
          </div>
        </div>

        {/* Customer Information */}
        <form onSubmit={handleCompletePayment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Account Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>Simulated Payment Gateway</span>
            </div>
            <span className="font-mono text-emerald-400 text-[10px]">256-BIT ENCRYPTED</span>
          </div>

          <button
            type="submit"
            disabled={isProcessing || cart.length === 0}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Processing Transaction...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Complete Purchase (${total}) & Access Products</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
