import React, { useState, useEffect, useRef } from 'react';
import { Page, Product } from '../types';
import { FOUNDER_INFO, ECOSYSTEM_STRUCTURE, COMPANY_INFO } from '../data/company';
import { PRODUCTS_DATA } from '../data/products';
import { 
  Bot, X, Send, Sparkles, CheckCircle2, ArrowRight, User, Building2,
  Calendar, Mail, Copy, Maximize2, Minimize2, BrainCircuit,
  MessageSquareText, ShoppingCart
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface AIConciergeProps {
  activePage: Page;
  onOpenWaitlist: () => void;
  onNavigateToStorefront: () => void;
}

interface Message {
  id: string;
  sender: 'concierge' | 'user';
  text: string;
  timestamp: string;
  actions?: { label: string; action: () => void; icon?: React.ReactNode }[];
  recommendedProduct?: Product;
}

export const AIConcierge: React.FC<AIConciergeProps> = ({ activePage, onOpenWaitlist, onNavigateToStorefront }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    // Never carry an open floating panel across route changes on a phone.
    setIsOpen(false);
    setIsExpanded(false);
  }, [activePage]);

  useEffect(() => {
    if (messages.length === 0) {
      let welcomeText = `Hello! I'm **The OCG Lab AI Storefront Concierge**. I can help you find the exact software tool, AI worker, or workflow system for your business outcomes.`;
      if (activePage === 'storefront') welcomeText = `Welcome to The OCG Lab Storefront! Tell me what you want to accomplish, and I will retrieve the exact product for you.`;
      else if (activePage === 'about') welcomeText = `Welcome! I can share details about our founder **Genaro Ocasio**, the **Ocasio Collective** parent structure, or our operator-tested engineering philosophy.`;
      setMessages([{ id: 'welcome-1', sender: 'concierge', text: welcomeText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), actions: [
        { label: 'What should I buy for deal sourcing?', action: () => handleRecommendProduct('distressed-property-finder') },
        { label: 'How do I automate lead follow-up?', action: () => handleRecommendProduct('seller-followup-workflow') },
        { label: 'Who is Genaro Ocasio?', action: () => handlePresetQuery('who_is_genaro') },
        { label: 'Browse Storefront', action: onNavigateToStorefront },
      ] }]);
    }
  }, [activePage]);

  const handlePresetQuery = (queryType: string) => {
    if (queryType === 'who_is_genaro') {
      addUserMessage('Who is Genaro Ocasio?');
      simulateResponse(`**Genaro Ocasio** is the founder and managing principal of **The OCG Lab**.\n\nHe combines hands-on background in real estate acquisitions (**The OC Group**), architectural design & renovation management, business consulting, and custom AI agent engineering.`);
    }
  };

  const handleRecommendProduct = (productId: string) => {
    const matched = PRODUCTS_DATA.find(p => p.id === productId);
    if (!matched) return;
    addUserMessage(`Tell me about ${matched.title}`);
    simulateResponse(`Here is the verified catalog information for **${matched.title}** (${matched.type}):\n\n• **Problem Solved:** ${matched.problemSolved}\n• **Expected Result:** ${matched.expectedResult}\n• **Pricing:** $${matched.price} (${matched.billingModel})\n• **Fulfillment Modes:** ${matched.fulfillmentOptions.join(', ')}`, [{ label: 'View Product Details in Store', action: onNavigateToStorefront }], matched);
  };

  const addUserMessage = (text: string) => setMessages(prev => [...prev, { id: `usr-${Date.now()}`, sender: 'user', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
  const simulateResponse = (text: string, actions?: Message['actions'], recommendedProduct?: Product) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: `cnc-${Date.now()}`, sender: 'concierge', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), actions, recommendedProduct }]);
    }, 800);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');
    addUserMessage(userText);
    const lower = userText.toLowerCase();
    if (lower.includes('deal') || lower.includes('underwrit')) handleRecommendProduct('deal-analyzer');
    else if (lower.includes('distress') || lower.includes('off-market') || lower.includes('find customer')) handleRecommendProduct('distressed-property-finder');
    else if (lower.includes('follow') || lower.includes('nurture') || lower.includes('seller')) handleRecommendProduct('seller-followup-workflow');
    else if (lower.includes('nova') || lower.includes('operating engine') || lower.includes('sla')) handleRecommendProduct('nova-operating-engine');
    else if (lower.includes('calculator') || lower.includes('roi')) handleRecommendProduct('rental-roi-calculator-pro');
    else if (lower.includes('system') || lower.includes('investor acquisition')) handleRecommendProduct('investor-acquisition-system');
    else if (lower.includes('genaro') || lower.includes('founder')) handlePresetQuery('who_is_genaro');
    else simulateResponse(`I checked our live product catalog. Based on your input, I recommend exploring our **Storefront Outcomes** where you can filter systems by outcome.`, [{ label: 'Browse Storefront Catalog', action: onNavigateToStorefront }, { label: 'Request Custom AI Project', action: onOpenWaitlist }]);
  };

  return <>
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-1.5rem)]">
      {!isOpen && <motion.button initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsOpen(true)} className="flex max-w-full items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500 text-slate-950 font-extrabold shadow-2xl shadow-cyan-500/30 border border-cyan-300/40 cursor-pointer">
        <Bot className="w-5 h-5 shrink-0" /><span className="hidden min-[380px]:inline text-xs font-mono tracking-wide whitespace-nowrap">AI Store Assistant</span>
      </motion.button>}
    </div>

    <AnimatePresence>
      {isOpen && <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={{ duration: 0.2 }} className={`fixed z-50 left-3 right-3 bottom-3 sm:left-auto sm:right-6 sm:bottom-6 bg-[#090d16] border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden ${isExpanded ? 'sm:w-[min(680px,calc(100vw-3rem))] h-[min(80dvh,760px)]' : 'sm:w-[420px] h-[min(72dvh,560px)]'} max-w-[calc(100vw-1.5rem)] max-h-[calc(100dvh-1.5rem)]`}>
        <div className="p-3 sm:p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0"><Bot className="w-5 h-5 text-cyan-400 shrink-0"/><div className="min-w-0"><h3 className="font-heading font-bold text-sm text-white truncate">AI Storefront Assistant</h3><p className="text-[11px] text-slate-400 truncate">Catalog & Outcome Advisor</p></div></div>
          <div className="flex items-center gap-1.5 shrink-0"><button onClick={() => setIsExpanded(!isExpanded)} className="hidden sm:block p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white">{isExpanded ? <Minimize2 className="w-4 h-4"/> : <Maximize2 className="w-4 h-4"/>}</button><button onClick={() => setIsOpen(false)} className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white" aria-label="Close AI Storefront Assistant"><X className="w-4 h-4"/></button></div>
        </div>
        <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto overflow-x-hidden space-y-4 bg-slate-950/40 text-xs">
          {messages.map(msg => <div key={msg.id} className={`flex flex-col min-w-0 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}><div className={`max-w-[92%] sm:max-w-[85%] min-w-0 break-words p-3.5 rounded-2xl space-y-2 leading-relaxed ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'}`}><div className="whitespace-pre-wrap break-words">{msg.text}</div>{msg.actions?.length ? <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">{msg.actions.map((act, idx) => <button key={idx} onClick={act.action} className="max-w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-cyan-800/80 text-cyan-400 font-semibold text-[11px] flex items-center gap-1"><span className="break-words">{act.label}</span><ArrowRight className="w-3 h-3 shrink-0"/></button>)}</div> : null}</div><span className="text-[9px] font-mono text-slate-500 mt-1 px-1">{msg.timestamp}</span></div>)}
          {isTyping && <div className="flex items-center gap-2 text-slate-500 text-xs italic p-2"><Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin"/><span>Searching live product catalog...</span></div>}
          <div ref={messagesEndRef}/>
        </div>
        <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 min-w-0"><input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="What do you want to accomplish?" className="min-w-0 flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"/><button type="submit" disabled={!input.trim()} className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold disabled:opacity-40 shrink-0"><Send className="w-4 h-4"/></button></form>
      </motion.div>}
    </AnimatePresence>
  </>;
};
