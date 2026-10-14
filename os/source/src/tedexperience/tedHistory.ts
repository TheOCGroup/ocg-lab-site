import type { TedMessage } from './components/TedChat';

/**
 * TED conversation history — real, local persistence.
 *
 * Conversations live in this browser's localStorage. Nothing is faked:
 * if a conversation is here, the founder actually had it. Titles come
 * from the founder's own first message.
 */

export interface TedConversation {
  id: string;
  title: string;
  messages: TedMessage[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'ted.conversations.v1';
const MAX_CONVERSATIONS = 50;

function readStorage(): TedConversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (c): c is TedConversation =>
        c && typeof c.id === 'string' && Array.isArray(c.messages),
    );
  } catch {
    return [];
  }
}

function writeStorage(conversations: TedConversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations.slice(0, MAX_CONVERSATIONS)));
  } catch {
    // Storage full or unavailable — history is best-effort, the conversation itself still works.
  }
}

export function loadConversations(): TedConversation[] {
  return readStorage().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveConversation(conversation: TedConversation): void {
  const all = readStorage().filter((c) => c.id !== conversation.id);
  writeStorage([{ ...conversation, updatedAt: Date.now() }, ...all]);
}

export function deleteConversation(id: string): void {
  writeStorage(readStorage().filter((c) => c.id !== id));
}

export function newConversationId(): string {
  return `ted-conv-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

/** Plain-English title from the founder's first message. */
export function deriveTitle(firstText: string): string {
  const clean = firstText.replace(/\s+/g, ' ').trim();
  if (!clean) return 'New conversation';
  return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean;
}
