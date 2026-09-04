import React, { useState, useEffect, useRef } from 'react';
import { OperatingArea } from '../../types';
import { AidenEngine, AidenResolution } from './aidenEngine';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Layers, 
  Terminal,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface AidenOrchestratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (area: OperatingArea) => void;
}

interface ChatMessage {
  id: string;
  sender: 'aiden' | 'founder';
  text: string;
  timestamp: string;
  resolution?: AidenResolution;
}

export const AidenOrchestratorModal: React.FC<AidenOrchestratorModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'aiden',
      text: `**Aiden Technology Orchestrator Online.**\n\nI have complete contextual visibility into OCG LAB OS, all 12 departments, our 50-product portfolio, the 3 active bench missions, and connected operating systems.\n\nHow can I coordinate the workforce for you right now?`,
      timestamp: '20:18'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (queryText?: string) => {
    const q = (queryText || input).trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'founder',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const recentFounderQueries = messages.filter(message => message.sender === 'founder').slice(-4).map(message => message.text);
    const resolution = AidenEngine.processQuery(q, { recentFounderQueries });

    const aidenMsg: ChatMessage = {
      id: `aiden-${Date.now() + 1}`,
      sender: 'aiden',
      text: resolution.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      resolution
    };

    setMessages(prev => [...prev, userMsg, aidenMsg]);
    setInput('');

    if (resolution.actionTaken) {
      toast.success(resolution.actionTaken);
    }
  };

  const quickPrompts = [
    'Where are we?',
    'What makes us money fastest?',
    'Find the real one.',
    'Check this.',
    'Get this listed.',
    'Build the next product.',
    'Show me.'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl h-[85vh] bg-[#070d18] border border-cyan-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-white text-base">AIDEN ORCHESTRATOR</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  SYSTEM READY
                </span>
              </div>
              <p className="text-xs text-slate-400">Chief Intelligence & Department Coordinator for The OCG Lab</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions Bar */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Terminal className="w-3 h-3 text-cyan-400" /> Directives:
          </span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 hover:border-cyan-500/40 border border-slate-700/60 text-slate-300 font-medium shrink-0 transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map(m => (
            <div 
              key={m.id}
              className={`flex flex-col ${m.sender === 'founder' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {m.sender === 'founder' ? 'Genaro (Founder)' : 'Aiden'}
                </span>
                <span className="text-[10px] text-slate-500">{m.timestamp}</span>
              </div>

              <div 
                className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                  m.sender === 'founder' 
                    ? 'bg-cyan-600 text-white rounded-tr-none shadow-md' 
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                }`}
              >
                {m.text}

                {m.resolution?.skillsUsed && m.resolution.skillsUsed.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5" data-agent-ops-skills="true">
                    {m.resolution.skillsUsed.map(skill => (
                      <span key={skill} className="px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-300">{skill}</span>
                    ))}
                  </div>
                )}

                {/* Evidence Card if task was executed */}
                {m.resolution?.evidence && (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-start gap-2 bg-slate-950/50 p-2.5 rounded-xl text-xs text-emerald-300 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-400">Verified Evidence: </span>
                      {m.resolution.evidence}
                    </div>
                  </div>
                )}

                {/* Direct Navigation Button if workspace suggested */}
                {m.resolution?.suggestedArea && (
                  <button
                    onClick={() => {
                      onNavigate(m.resolution!.suggestedArea!);
                      onClose();
                    }}
                    className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition"
                  >
                    Open {m.resolution.suggestedArea.toUpperCase()} Workspace
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Command Aiden (e.g. 'What is blocking the Lab?', 'Which products can launch?')..."
            className="flex-1 bg-slate-950 border border-slate-700/80 focus:border-cyan-500 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none transition"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition"
          >
            <Send className="w-4 h-4" />
            <span>Execute</span>
          </button>
        </div>

      </div>
    </div>
  );
};
