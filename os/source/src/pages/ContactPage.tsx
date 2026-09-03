import React, { useState } from 'react';
import { ContactFormData, SupportTicket } from '../types';
import { 
  Send, 
  CheckCircle2, 
  Copy, 
  Clock, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin,
  Ticket
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    category: 'General Inquiry',
    phone: '',
    message: '',
  });

  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please complete all required fields.');
      return;
    }

    const refNumber = `OCG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTicket: SupportTicket = {
      ticketRef: refNumber,
      timestamp: new Date().toLocaleString(),
      category: formData.category,
      status: 'Queued for Evaluation',
    };

    setTicket(newTicket);
    toast.success(`Ticket generated successfully! Ref: ${refNumber}`);
  };

  const handleCopyTicket = () => {
    if (!ticket) return;
    navigator.clipboard.writeText(ticket.ticketRef);
    setCopied(true);
    toast.success('Ticket reference code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
          Client Intake & Support Operations
        </span>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white">
          Direct Operating Communication
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Submit product inquiries, enterprise GCP deployment requests, or custom system specifications directly to our engineering team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          {ticket ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="font-heading font-bold text-2xl text-white">Intake Ticket Generated</h3>
                <p className="text-xs text-slate-400">Our operations team responds within 15 minutes during trading hours.</p>
              </div>

              {/* Generated Ticket Box */}
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Reference ID:</span>
                  <span className="font-mono text-cyan-400 font-extrabold text-base">{ticket.ticketRef}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-semibold text-white">{ticket.category}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {ticket.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopyTicket}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                  <span>{copied ? 'Copied!' : 'Copy Reference Code'}</span>
                </button>
                <button
                  onClick={() => setTicket(null)}
                  className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-heading font-bold text-xl text-white">Client Inquiry Form</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jordan Vance"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jordan@vancecapital.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Vance Capital Group"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Category Routing *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 outline-none"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Product Demo">Product Demo</option>
                    <option value="Custom Enterprise System">Custom Enterprise System</option>
                    <option value="Technical Support">Technical Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Message Detail *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your deal volume, custom workflow requirements, or technical questions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Transmit Inquiry & Generate Ticket</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Info Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white">Direct Contacts</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block">Engineering & Inquiries:</span>
                  <span className="font-mono text-white font-semibold">support@ocglab.com</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block">Headquarters:</span>
                  <span className="text-white font-semibold">Wichita, Sedgwick County, Kansas</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block">SLA Commitment:</span>
                  <span className="text-white font-semibold">Sub-15 Minute Ticket Response</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <h4 className="font-heading font-bold text-sm text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Proving Ground Guarantee
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every inquiry sent through this portal is routed to active operators at The OC Group. We don't employ outsourced sales reps or automated chat bots.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
