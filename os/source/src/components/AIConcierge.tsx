import React, { useState, useEffect, useRef } from 'react';
import { Page, Product } from '../types';
import { FOUNDER_INFO, ECOSYSTEM_STRUCTURE, COMPANY_INFO } from '../data/company';
import { PRODUCTS_DATA } from '../data/products';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  User, 
  Building2, 
  Calendar, 
  Mail, 
  Copy, 
  Maximize2, 
  Minimize2,
  BrainCircuit,
  MessageSquareText,
  ShoppingCart
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

export const AIConcierge: React.FC<AIConciergeProps> = ({ 
  activePage, 
  onOpenWaitlist, 
  onNavigateToStorefront 
}) => {
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
    if (messages.length === 0) {
      let welcomeText = `Hello! I'm **The OCG Lab AI Storefront Concierge**. I can help you find the exact software tool, AI worker, or workflow system for your business outcomes.`;

      if (activePage === 'storefront') {
        welcomeText = `Welcome to The OCG Lab Storefront! Tell me what you want to accomplish (e.g. *"I need to automate customer follow-up"* or *"I need off-market deals"*), and I will retrieve the exact product for you.`;
      } else if (activePage === 'about') {
        welcomeText = `Welcome! I can share details about our founder **Genaro Ocasio**, the **Ocasio Collective** parent structure, or our operator-tested engineering philosophy.`;
      }

      setMessages([
        {
          id: 'welcome-1',
          sender: 'concierge',
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: [
            { label: 'What should I buy for deal sourcing?', action: () => handleRecommendProduct('distressed-property-finder') },
            { label: 'How do I automate lead follow-up?', action: () => handleRecommendProduct('seller-followup-workflow') },
            { label: 'Who is Genaro Ocasio?', action: () => handlePresetQuery('who_is_genaro') },
            { label: 'Browse Storefront', action: onNavigateToStorefront },
          ]
        }
      ]);
    }
  }, [activePage]);

  const handlePresetQuery = (queryType: string) => {
    if (queryType === 'who_is_genaro') {
      addUserMessage('Who is Genaro Ocasio?');
      simulateResponse(
        `**Genaro Ocasio** is the founder and managing principal of **The OCG Lab**.\n\nHe combines hands-on background in real estate acquisitions (**The OC Group**), architectural design & renovation management, business consulting, and custom AI agent engineering.\n\nHis core philosophy: *"Powerful systems should feel simple. Technology must solve tangible operational bottlenecks—not add administrative noise."*`
      );
    }
  };

  const handleRecommendProduct = (productId: string) => {
    const matched = PRODUCTS_DATA.find(p => p.id === productId);
    if (!matched) return;

    addUserMessage(`Tell me about ${matched.title}`);
    simulateResponse(
      `Here is the verified catalog information for **${matched.title}** (${matched.type}):\n\n• **Problem Solved:** ${matched.problemSolved}\n• **Expected Result:** ${matched.expectedResult}\n• **Pricing:** $${matched.price} (${matched.billingModel})\n• **Fulfillment Modes:** ${matched.fulfillmentOptions.join(', ')}`,
      [
        { label: 'View Product Details in Store', action: onNavigateToStorefront }
      ],
      matched
    );
  };

  const addUserMessage = (text: string) => {
    const newMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const simulateResponse = (text: string, actions?: Message['actions'], recommendedProduct?: Product) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const newMsg: Message = {
        id: `cnc-${Date.now()}`,
        sender: 'concierge',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions,
        recommendedProduct
      };
      setMessages(prev => [...prev, newMsg]);
    }, 800);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    addUserMessage(userText);

    const lower = userText.toLowerCase();

    // Live catalog lookup logic
    if (lower.includes('deal') || lower.includes('underwrit')) {
      handleRecommendProduct('deal-analyzer');
    } else if (lower.includes('distress') || lower.includes('off-market') || lower.includes('find customer')) {
      handleRecommendProduct('distressed-property-finder');
    } else if (lower.includes('follow') || lower.includes('nurture') || lower.includes('seller')) {
      handleRecommendProduct('seller-followup-workflow');
    } else if (lower.includes('nova') || lower.includes('operating engine') || lower.includes('sla')) {
      handleRecommendProduct('nova-operating-engine');
    } else if (lower.includes('calculator') || lower.includes('roi')) {
      handleRecommendProduct('rental-roi-calculator-pro');
    } else if (lower.includes('system') || lower.includes('investor acquisition')) {
      handleRecommendProduct('investor-acquisition-system');
    } else if (lower.includes('genaro') || lower.includes('founder')) {
      handlePresetQuery('who_is_genaro');
    } else {
      simulateResponse(
        `I checked our live product catalog. Based on your input, I recommend exploring our **Storefront Outcomes** where you can filter systems by *Find Customers, Close More Sales, Automate Operations,* and *Analyze Deals*.\n\nWould you like to browse the full storefront or submit a custom project request?`,
        [
          { label: 'Browse Storefront Catalog', action: onNavigateToStorefront },
          { label: 'Request Custom AI Project', action: onOpenWaitlist }
        ]
      );
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500 text-slate-950 font-extrabold shadow-2xl shadow-cyan-500/30 border border-cyan-300/40 cursor-pointer group"
          >
            <div className="relative">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </span>
            </div>
            <span className="text-xs font-mono tracking-wide">AI Store Assistant</span>
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`fixed bottom-6 right-6 z-50 bg-[#090d16] border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
              isExpanded 
                ? 'w-[90vw] md:w-[680px] h-[80vh]' 
                : 'w-[92vw] sm:w-[420px] h-[560px]'
            }`}
          >
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-0.5 shadow-md">
                  <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white">AI Storefront Assistant</h3>
                  <p className="text-[11px] text-slate-400">Catalog & Outcome Advisor</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white">
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40 text-xs">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-3.5 rounded-2xl space-y-2 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                        {msg.actions.map((act, idx) => (
                          <button
                            key={idx}
                            onClick={act.action}
                            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-cyan-800/80 text-cyan-400 font-semibold text-[11px] flex items-center gap-1 transition-all"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-500 text-xs italic p-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  <span>Searching live product catalog...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What do you want to accomplish?"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
