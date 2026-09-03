import React, { useState } from 'react';
import { Page } from '../types';
import { Building2, ShieldCheck, ArrowRight, CheckCircle2, Lock, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface FooterProps {
  setActivePage: (page: Page) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActivePage,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    toast.success('Subscribed to The OCG Lab — AI Weekly dispatch!');
    setEmail('');
  };

  return (
    <footer className="border-t border-slate-800 bg-[#030712] text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActivePage('home')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5">
                <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                  <span className="font-heading font-extrabold text-sm text-cyan-400">OCG</span>
                </div>
              </div>
              <span className="font-heading font-bold text-xl text-white">The OCG Lab</span>
            </div>

            <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
              Powerful Systems. Real Results. Storefront and commercial ecosystem for software, AI workers, workflows, tools, and digital business products.
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Storefront Active
              </span>
              <span>•</span>
              <span>Ocasio Collective Ecosystem</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-white text-base">Storefront Categories</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActivePage('storefront')} className="hover:text-cyan-400 transition-colors">
                  Software Applications
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('storefront')} className="hover:text-cyan-400 transition-colors">
                  AI Workers & Agents
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('storefront')} className="hover:text-cyan-400 transition-colors">
                  Workflow Automation
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('resources')} className="hover:text-cyan-400 transition-colors">
                  Calculators & SOP Kits
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation & Company */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-white text-base">Ecosystem</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActivePage('about')} className="hover:text-cyan-400 transition-colors">
                  About Genaro Ocasio
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('my-ocg')} className="hover:text-cyan-400 transition-colors">
                  MY OCG Command Center
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('pricing')} className="hover:text-cyan-400 transition-colors">
                  Pricing Matrix
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('contact')} className="hover:text-cyan-400 transition-colors">
                  Implementation Support
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-white text-base">The OCG Lab — AI Weekly</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Practical weekly AI developments, business automation ideas, and release announcements.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Subscribed! Welcome to AI Weekly.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@company.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar & Legal */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} The OCG Lab. Powered by Ocasio Collective. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <button 
              onClick={onOpenPrivacy}
              className="flex items-center gap-1 hover:text-slate-300 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Privacy Policy</span>
            </button>
            <button 
              onClick={onOpenTerms}
              className="flex items-center gap-1 hover:text-slate-300 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Terms of Service</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
