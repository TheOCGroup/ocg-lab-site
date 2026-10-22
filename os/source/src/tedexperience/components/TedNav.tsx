import React from 'react';
import { Boxes, MessageSquarePlus, Radar, Trash2, X } from 'lucide-react';
import type { TedConversation } from '../tedHistory';

export type TedActiveView = 'chat' | 'intelligence';

interface TedNavProps {
  conversations: TedConversation[];
  activeId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onOpenProducts: () => void;
  onOpenIntelligence: () => void;
  activeView?: TedActiveView;
  onClose?: () => void;
}

function timeAgo(ts: number): string {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

/**
 * TED navigation: New chat, Products, OCG INTELLIGENCE, Previous Work.
 * Intelligence opens its own focused workspace inside TED; everything
 * else in OCG LAB stays reachable through TED's conversation.
 */
export const TedNav: React.FC<TedNavProps> = ({
  conversations,
  activeId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onOpenProducts,
  onOpenIntelligence,
  activeView = 'chat',
  onClose,
}) => {
  return (
    <nav aria-label="TED navigation" className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <span className="font-heading text-[13px] font-bold tracking-tight text-slate-900">TED</span>
        {onClose && (
          <button
            aria-label="Close navigation"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="px-3">
        <button
          onClick={onNewChat}
          className="flex min-h-[40px] w-full items-center gap-2.5 rounded-xl bg-slate-900 px-3.5 py-2.5 text-left text-[13px] font-semibold text-white shadow-sm transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New chat
        </button>
      </div>

      <div className="mt-3 px-3">
        <button
          onClick={onOpenProducts}
          className="flex min-h-[40px] w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-semibold text-slate-700 transition hover:bg-slate-900/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
        >
          <Boxes className="h-4 w-4" />
          Products
        </button>
      </div>

      <div className="mt-1 px-3">
        <button
          type="button"
          onClick={onOpenIntelligence}
          aria-current={activeView === 'intelligence' ? 'page' : undefined}
          className={`flex min-h-[40px] w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 ${
            activeView === 'intelligence'
              ? 'bg-blue-600/[0.08] text-blue-900 ring-1 ring-inset ring-blue-600/20'
              : 'text-blue-800 hover:bg-blue-50'
          }`}
        >
          <Radar className="h-4 w-4" />
          OCG INTELLIGENCE
          <span className="ml-auto text-[11px] font-medium text-slate-500">Preview</span>
        </button>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto px-3">
        <p className="px-1 pb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Previous Work
        </p>
        {conversations.length === 0 ? (
          <p className="px-1 py-3 text-[12.5px] leading-relaxed text-slate-500">
            Your past conversations with TED will appear here.
          </p>
        ) : (
          <div className="space-y-0.5">
            {conversations.map((c) => (
              <div
                key={c.id}
                className={`group flex items-center gap-1 rounded-xl transition ${
                  c.id === activeId ? 'bg-blue-600/[0.08] ring-1 ring-inset ring-blue-600/20' : 'hover:bg-slate-900/[0.04]'
                }`}
              >
                <button
                  onClick={() => onSelectConversation(c.id)}
                  className="min-w-0 flex-1 rounded-lg px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
                >
                  <span className="block truncate text-[13px] font-medium text-slate-700">{c.title}</span>
                  <span className="block text-[11px] text-slate-500">{timeAgo(c.updatedAt)}</span>
                </button>
                <button
                  aria-label={`Delete ${c.title}`}
                  onClick={() => onDeleteConversation(c.id)}
                  className="mr-1 shrink-0 rounded-lg p-1.5 text-slate-400 opacity-0 transition hover:bg-slate-200/60 hover:text-slate-600 focus:opacity-100 group-hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
