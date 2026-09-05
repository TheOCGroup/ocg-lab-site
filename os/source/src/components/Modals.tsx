import React, { useState } from 'react';
import { Product, SOPItem } from '../types';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  UserCheck, 
  BookOpen, 
  ShieldCheck, 
  Cpu, 
  ArrowRight,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

/* 1. Product Specs Modal */
interface ProductSpecsModalProps {
  product: Product | null;
  onClose: () => void;
  onJoinWaitlist: () => void;
}

export const ProductSpecsModal: React.FC<ProductSpecsModalProps> = ({
  product,
  onClose,
  onJoinWaitlist,
}) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 1, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
              {product.category} • {product.status}
            </span>
            <h3 className="font-heading font-bold text-2xl text-white">{product.title}</h3>
            <p className="text-slate-400 text-sm">{product.subtitle}</p>
          </div>

          {/* Technical Specifications Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-500 block">Core Language</span>
              <span className="font-mono text-xs font-bold text-slate-200">{product.specs.language}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Architecture</span>
              <span className="font-mono text-xs font-bold text-cyan-400">{product.specs.architecture}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Deployment</span>
              <span className="font-mono text-xs font-bold text-emerald-400">{product.specs.deployment}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Latency</span>
              <span className="font-mono text-xs font-bold text-amber-400">{product.specs.latency}</span>
            </div>
          </div>

          {/* Key Features List */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-slate-200 text-sm">Key System Capabilities</h4>
            <div className="space-y-2">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTAs */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Close Brief
            </button>
            <button
              onClick={() => {
                onClose();
                onJoinWaitlist();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Early Access</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* 2. Waitlist / Try Free Modal */
interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error('Please complete name and email.');
      return;
    }
    const ref = `OCG-WL-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketRef(ref);
    setSubmitted(true);
    toast.success('Early access registered! Try your first deal free.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 1, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-white">Access Approved</h3>
            <p className="text-xs text-slate-400">
              Your early access reservation has been confirmed. Use your reference code below for your first deal calculation.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-cyan-400 font-bold text-sm">
              Ref: {ticketRef}
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
            >
              Back to Platform
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-cyan-400">Try Your First Deal 100% Free</span>
              <h3 className="font-heading font-bold text-xl text-white">Join OCG Lab Early Access</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@acmeinvestments.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Company / Organization (Optional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Real Estate Group"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-300 hover:to-emerald-300 transition-all"
            >
              Get Free Early Access Pass
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

/* 3. Customer Portal Login Modal */
interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Logged into OCG Customer Portal workspace!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 1, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-2">
            <UserCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white">Customer Portal Login</h3>
          <p className="text-xs text-slate-400">Access saved deal briefs and active OCG OS pipelines.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@company.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md"
          >
            Authenticate Session
          </button>
        </form>
      </motion.div>
    </div>
  );
};

/* 4. SOP Blueprint Reader Modal */
interface SOPReaderModalProps {
  sop: SOPItem | null;
  onClose: () => void;
}

export const SOPReaderModal: React.FC<SOPReaderModalProps> = ({ sop, onClose }) => {
  if (!sop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 1, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
              {sop.code}
            </span>
            <span className="text-xs text-slate-400">• {sop.readingTime}</span>
          </div>
          <h3 className="font-heading font-bold text-2xl text-white">{sop.title}</h3>
          <p className="text-xs text-slate-400">{sop.summary}</p>
        </div>

        {/* Interactive Checklist Highlights */}
        <div className="space-y-3 bg-slate-950/70 p-5 rounded-2xl border border-slate-800">
          <h4 className="font-heading font-bold text-sm text-cyan-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Standard Checklist Steps
          </h4>
          <div className="space-y-2">
            {sop.checklistItems.map((item, idx) => (
              <label key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" className="mt-0.5 accent-cyan-500 rounded" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sop.sections.map((sec, idx) => (
            <div key={idx} className="space-y-1.5">
              <h5 className="font-heading font-bold text-white text-sm">{sec.title}</h5>
              <p className="text-xs text-slate-300 leading-relaxed">{sec.content}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl"
          >
            Close SOP Reader
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* 5. Privacy Modal */
export const PrivacyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-slate-300">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-heading font-bold text-lg text-white">Privacy Policy</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400"><X className="w-4 h-4" /></button>
        </div>
        <p>The OCG Lab respects operator privacy. We strictly do not sell, license, or expose user deal underwriting data or financial calculations to third parties.</p>
        <p>Calculations executed inside the Deal Analyzer run 100% deterministically within your browser workspace.</p>
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-white font-semibold rounded-xl">Accept</button>
        </div>
      </div>
    </div>
  );
};

/* 6. Terms Modal */
export const TermsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-4 text-xs text-slate-300">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="font-heading font-bold text-lg text-white">Terms of Service</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400"><X className="w-4 h-4" /></button>
        </div>
        <p>All preliminary underwriting calculations provided by The OCG Lab are for financial evaluation purposes. Official deal contracts remain subject to physical walkthrough verification and final scope agreement.</p>
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-white font-semibold rounded-xl">Accept</button>
        </div>
      </div>
    </div>
  );
};
