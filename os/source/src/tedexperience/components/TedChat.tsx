import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, ImagePlus, Mic, Paperclip, Square, X } from 'lucide-react';
import { TedMarkdown } from '../TedMarkdown';

export type TedVoiceUiState =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'reconnecting'
  | 'unsupported';

export interface TedVoiceUi {
  state: TedVoiceUiState;
  onMicTap: () => void;
  onEndSession: () => void;
}

export interface TedAttachment {
  id: string;
  name: string;
  size: number;
  mime: string;
  previewUrl?: string;
}

export interface TedMessage {
  id: string;
  role: 'founder' | 'ted';
  text: string;
  attachments?: TedAttachment[];
  timestamp: number;
}

interface TedChatProps {
  messages: TedMessage[];
  thinking: boolean;
  /** Background research running — shows activity, never blocks sending. */
  researching?: boolean;
  onSend: (text: string, attachments: TedAttachment[]) => void;
  /** Real two-way voice. Omitted/null = voice UI hidden. */
  voice?: TedVoiceUi | null;
  /** Live transcript from the voice controller; fills the draft when set. */
  voiceTranscript?: string | null;
}

const SUGGESTIONS = [
  { label: 'I have an idea', send: 'I have an idea.' },
  { label: "Continue something I'm working on", send: 'What are we working on?' },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const TedAvatar: React.FC = () => (
  <div
    aria-hidden
    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-500 shadow-[0_6px_18px_-8px_rgba(37,99,235,.7)]"
  >
    <span className="font-heading text-[11px] font-extrabold tracking-tight text-white">T</span>
  </div>
);

export const TedChat: React.FC<TedChatProps> = ({ messages, thinking, researching, onSend, voice, voiceTranscript }) => {
  const [draft, setDraft] = useState('');
  const [attachments, setAttachments] = useState<TedAttachment[]>([]);
  const [attachOpen, setAttachOpen] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const noticeTimer = useRef<number | null>(null);

  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
    }
  }, [draft]);

  // Live voice transcript flows into the draft as the founder speaks.
  // An empty string clears the draft (used after a voice turn is sent).
  useEffect(() => {
    if (typeof voiceTranscript === 'string') {
      setDraft(voiceTranscript);
    }
  }, [voiceTranscript]);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    };
  }, []);

  const flashNotice = (text: string) => {
    setVoiceNotice(text);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setVoiceNotice(null), 3200);
  };

  const pickFiles = (accept: string) => {
    if (fileRef.current) {
      fileRef.current.accept = accept;
      fileRef.current.click();
    }
    setAttachOpen(false);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const next: TedAttachment[] = [];
    for (const file of Array.from(files).slice(0, 4)) {
      next.push({
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        size: file.size,
        mime: file.type,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      });
    }
    setAttachments((prev) => [...prev, ...next].slice(0, 4));
    textareaRef.current?.focus();
  };

  const submit = () => {
    const text = draft.trim();
    if ((!text && attachments.length === 0) || thinking) return;
    onSend(text, attachments);
    setDraft('');
    setAttachments([]);
  };

  /** Mic tap: real voice when supported, honest notice when not. */
  const handleMic = () => {
    if (!voice) return;
    if (voice.state === 'unsupported') {
      flashNotice("Voice isn't available in this browser — Chrome or Edge on desktop work best.");
      return;
    }
    voice.onMicTap();
  };

  const voiceState: TedVoiceUiState = voice?.state ?? 'unsupported';
  const sessionActive =
    voiceState === 'listening' ||
    voiceState === 'thinking' ||
    voiceState === 'speaking' ||
    voiceState === 'connecting' ||
    voiceState === 'reconnecting';
  const micAriaLabel =
    voiceState === 'listening' ? 'End voice session'
    : voiceState === 'thinking' ? 'End voice session'
    : voiceState === 'speaking' ? 'Interrupt TED and talk'
    : voiceState === 'connecting' ? 'Connecting voice session'
    : voiceState === 'reconnecting' ? 'Reconnecting voice session'
    : voiceState === 'unsupported' ? 'Voice not available in this browser'
    : 'Start a voice conversation with TED';
  const micClassName =
    voiceState === 'listening'
      ? 'bg-red-500 text-white shadow-md animate-pulse'
      : voiceState === 'speaking'
        ? 'bg-slate-900 text-white shadow-md'
        : voiceState === 'thinking' || voiceState === 'connecting' || voiceState === 'reconnecting'
          ? 'bg-blue-100 text-blue-700 animate-pulse'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800';
  const voiceStatusText =
    voiceState === 'connecting' ? 'Connecting…'
    : voiceState === 'listening' ? 'Listening — just talk'
    : voiceState === 'thinking' ? 'Thinking…'
    : voiceState === 'speaking' ? 'Speaking — mic interrupts'
    : voiceState === 'reconnecting' ? 'Reconnecting…'
    : null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={threadRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8" aria-live="polite">
        <div className="mx-auto w-full max-w-[760px]">
          {messages.length === 0 && !thinking && (
            <div className="flex min-h-[46vh] flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-500 shadow-[0_18px_44px_-16px_rgba(37,99,235,.65)]">
                <span className="font-heading text-xl font-extrabold text-white">T</span>
              </div>
              <h2 className="mt-5 font-heading text-[26px] font-extrabold tracking-tight text-slate-900">TED</h2>
              <p className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Technology Super Agent
              </p>
              <p className="mt-4 max-w-[420px] font-heading text-[19px] font-bold tracking-tight text-slate-800">
                What do you want to build?
              </p>
              <p className="mt-2 max-w-[420px] text-[14px] leading-relaxed text-slate-500">
                Tell me what you want to create. I'll handle the rest — and I'll tell you plainly when I don't know something.
              </p>
              <div className="mt-6 flex max-w-[520px] flex-wrap items-center justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => onSend(s.send, [])}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[12.5px] font-medium text-slate-600 shadow-sm transition hover:border-blue-600/30 hover:text-slate-900"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((m) =>
              m.role === 'founder' ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[85%] sm:max-w-[75%]">
                    {m.attachments && m.attachments.length > 0 && (
                      <div className="mb-2 flex flex-wrap justify-end gap-2">
                        {m.attachments.map((a) => (
                          <div key={a.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                            {a.previewUrl ? (
                              <img src={a.previewUrl} alt={a.name} className="h-24 w-auto object-cover" />
                            ) : (
                              <div className="flex items-center gap-2 px-3 py-2 text-[11px] text-slate-500">
                                <Paperclip className="h-3.5 w-3.5" />
                                <span className="max-w-[140px] truncate">{a.name}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {m.text && (
                      <div className="rounded-[20px] rounded-br-[8px] bg-slate-900 px-[18px] py-3 text-[13.5px] leading-relaxed text-white">
                        {m.text}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex gap-3.5">
                  <div className="pt-0.5"><TedAvatar /></div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 font-heading text-[12px] font-bold tracking-wide text-slate-900">
                      TED <span className="ml-1 font-sans font-normal text-slate-400">· Technology Super Agent</span>
                    </p>
                    <div className="max-w-full">
                      <TedMarkdown text={m.text} />
                    </div>
                  </div>
                </div>
              ),
            )}

            {(thinking || researching) && (
              <div className="flex gap-3.5">
                <div className="pt-0.5"><TedAvatar /></div>
                <div className="flex items-center gap-1.5 pt-2" aria-label="TED is thinking">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: `${i * 160}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 px-4 pb-4 pt-1 sm:px-8 sm:pb-6">
        <div className="mx-auto w-full max-w-[760px]">
          {attachments.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {attachments.map((a) => (
                <div key={a.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-2 pr-1.5 shadow-sm">
                  {a.previewUrl ? (
                    <img src={a.previewUrl} alt={a.name} className="h-9 w-9 rounded-lg object-cover" />
                  ) : (
                    <Paperclip className="h-4 w-4 text-slate-400" />
                  )}
                  <div className="leading-tight">
                    <p className="max-w-[150px] truncate text-[11.5px] font-medium text-slate-700">{a.name}</p>
                    <p className="text-[10px] text-slate-400">{formatBytes(a.size)}</p>
                  </div>
                  <button
                    aria-label={`Remove ${a.name}`}
                    onClick={() => setAttachments((prev) => prev.filter((x) => x.id !== a.id))}
                    className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            {attachOpen && (
              <div className="absolute bottom-full left-0 z-10 mb-2 w-52 overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-[0_18px_50px_-16px_rgba(2,6,23,.25)]">
                {[
                  { label: 'Image / screenshot', accept: 'image/*', icon: ImagePlus },
                  { label: 'Document', accept: '.pdf,.doc,.docx,.txt,.md', icon: Paperclip },
                  { label: 'Code / project file', accept: '.ts,.tsx,.js,.jsx,.json,.py,.zip', icon: Paperclip },
                ].map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => pickFiles(opt.accept)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Icon className="h-4 w-4 text-slate-400" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex items-end gap-1.5 rounded-[26px] border border-slate-200 bg-white p-2 shadow-[0_18px_50px_-20px_rgba(2,6,23,.22)] transition focus-within:border-blue-600/40 focus-within:shadow-[0_18px_50px_-16px_rgba(37,99,235,.3)]">
              <button
                aria-label="Attach a file"
                onClick={() => setAttachOpen((v) => !v)}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${attachOpen ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
              >
                <Paperclip className="h-[18px] w-[18px]" />
              </button>
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                placeholder="Tell TED what you want to create..."
                rows={1}
                aria-label="Tell TED what you want to create"
                className="max-h-[140px] min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2.5 text-[14px] leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                aria-label={micAriaLabel}
                title={micAriaLabel}
                onClick={handleMic}
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${micClassName}`}
              >
                {voiceState === 'speaking' ? (
                  <Square className="h-[16px] w-[16px]" />
                ) : (
                  <Mic className="h-[18px] w-[18px]" />
                )}
              </button>
              <button
                aria-label="Send message"
                onClick={submit}
                disabled={(!draft.trim() && attachments.length === 0) || thinking}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-md transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-25"
              >
                <ArrowUp className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
          {voiceStatusText && (
            <p className="mt-2 flex items-center justify-center gap-2 text-center text-[12px] font-medium text-slate-500" aria-live="polite">
              <span>{voiceStatusText}</span>
              {sessionActive && voice && (
                <button
                  onClick={voice.onEndSession}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
                >
                  End session
                </button>
              )}
            </p>
          )}
          {voiceNotice && (
            <div className="pointer-events-none absolute -top-11 right-14 z-10 max-w-[260px] whitespace-normal rounded-xl bg-slate-900 px-3 py-1.5 text-[12px] font-medium text-white shadow-lg">
              {voiceNotice}
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>
      </div>
    </div>
  );
};
