import React from 'react';
import { Boxes, MessageSquarePlus, Trash2, X } from 'lucide-react';
import type { TedConversation } from '../tedHistory';

interface TedNavProps {
  conversations: TedConversation[];
  activeId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onOpenProducts: () => void;
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
 * TED navigation: New chat + Previous Work. Nothing else.
 * The rest of OCG LAB stays reachable through TED's conversation, not buttons.
 */
export const TedNav: React.FC<TedNavProps> = ({
  conversations,
  activeId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onOpenProducts,
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
          className="flex w-full items-center gap-2.5 rounded-xl bg-slate-900 px-3.5 py-2.5 text-left text-[13px] font-semibold text-white shadow-sm transition hover:bg-slate-700"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New chat
        </button>
      </div>

      <div className="mt-3 px-3">
        <button
          onClick={onOpenProducts}
          className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-semibold text-slate-700 transition hover:bg-slate-900/[0.05]"
        >
          <Boxes className="h-4 w-4" />
          Products
        </button>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto px-3">
        <p className="px-1 pb-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Previous Work
        </p>
        {conversations.length === 0 ? (
          <p className="px-1 py-3 text-[12px] leading-relaxed text-slate-400">
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
                  className="min-w-0 flex-1 px-3 py-2 text-left"
                >
                  <span className="block truncate text-[13px] font-medium text-slate-700">{c.title}</span>
                  <span className="block text-[10.5px] text-slate-400">{timeAgo(c.updatedAt)}</span>
                </button>
                <button
                  aria-label={`Delete ${c.title}`}
                  onClick={() => onDeleteConversation(c.id)}
                  className="mr-1 shrink-0 rounded-lg p-1.5 text-slate-300 opacity-0 transition hover:bg-slate-200/60 hover:text-slate-600 focus:opacity-100 group-hover:opacity-100"
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
