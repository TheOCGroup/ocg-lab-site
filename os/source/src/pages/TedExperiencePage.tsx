import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { TedNav } from '../tedexperience/components/TedNav';
import { TedChat, TedAttachment, TedMessage, TedVoiceUiState } from '../tedexperience/components/TedChat';
import { TedArtifactPanel, TedArtifact } from '../tedexperience/components/TedArtifactPanel';
import {
  TedPersonaState,
  initialPersonaState,
  tedPersonaRespond,
} from '../tedexperience/tedPersona';
// PHASE 2.1 — OCG Super Voice Core: persistent voice sessions, automatic
// turn-taking, barge-in. Provider-independent; Web Speech is the fallback
// provider until the shared realtime voice infrastructure lands.
import {
  SuperVoiceSession,
  VoiceSessionState,
} from '../tedexperience/voice/voiceCore';
import { WebSpeechVoiceProvider } from '../tedexperience/voice/webSpeechProvider';
import { TED_VOICE_AGENT_CONFIG } from '../tedexperience/voice/tedVoiceAgent';
import { browserVoiceRuntime } from '../tedexperience/tedVoice';
import { makeProactiveEvent, renderProactiveText } from '../tedexperience/voice/proactive';
import { formatResearchResult, requestResearch } from '../tedexperience/tedResearch';
import { initLiveResearch } from '../tedexperience/research/liveProviders';
import { toolBridge } from '../tedexperience/tedToolBridge';
import { syncBridgeTools } from '../tedexperience/tedTools';
import { VoiceLatencyTracker } from '../tedexperience/voice/latency';
import { TedBridgeOp } from '../tedexperience/tedPersona';
import { TedProducts } from '../tedexperience/components/TedProducts';
import { TedProductDetail } from '../tedexperience/components/TedProductDetail';
import { getProductMemory, clearMemoryOverlay } from '../tedexperience/productMemory';
import {
  TedConversation,
  deleteConversation,
  deriveTitle,
  loadConversations,
  newConversationId,
  saveConversation,
} from '../tedexperience/tedHistory';

let messageSeq = 0;
const nextId = () => `ted-msg-${Date.now()}-${messageSeq++}`;

/** Map session states to the composer's mic UI. Ended/error return to idle. */
const sessionStateToUi = (s: VoiceSessionState): TedVoiceUiState =>
  s === 'idle' || s === 'ended' || s === 'error' ? 'idle' : s;

interface TurnOptions {
  /** Voice-session turn: fast latency, reply is spoken by the session. */
  viaSession?: boolean;
}

const ATTACHMENT_NOTE =
  `Got it — file received. I can see the name and size, but I can't open or analyze attached files in this build yet, so I won't pretend I looked inside.\n\n` +
  `Tell me what I'm looking at — a screenshot of what, a doc about what — and I'll work with your description. If it's an error, paste the exact text; that's worth more than any screenshot.`;

/**
 * TED's room: radically simple on the surface, all power underneath.
 *
 * The founder sees: TED, the conversation, and a composer. Everything else
 * (previous work, inspectable artifacts) appears only when useful.
 *
 * EXPERIENCE LAYER ONLY. Intelligence and governance stay in src/ted/ and
 * src/data/, untouched.
 */
export const TedExperiencePage: React.FC<{ onOpenProjects?: () => void }> = ({ onOpenProjects }) => {
  const [conversations, setConversations] = useState<TedConversation[]>(() => loadConversations());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<TedMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [researching, setResearching] = useState(false);
  const [persona, setPersona] = useState<TedPersonaState>(initialPersonaState);
  const [artifact, setArtifact] = useState<TedArtifact | null>(null);
  const [navOpen, setNavOpen] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth >= 1024,
  );
  // PHASE 2.1 voice session: one click opens a persistent conversation.
  // The founder never presses the mic per turn; the session auto-listens.
  const [voiceUiState, setVoiceUiState] = useState<TedVoiceUiState>('unsupported');
  const [voiceTranscript, setVoiceTranscript] = useState<string | null>(null);
  const sessionRef = useRef<SuperVoiceSession | null>(null);
  const providerRef = useRef<WebSpeechVoiceProvider | null>(null);
  const latencyRef = useRef<VoiceLatencyTracker | null>(null);
  if (!latencyRef.current) latencyRef.current = new VoiceLatencyTracker();
  const [bridgeStatus, setBridgeStatus] = useState<'unknown' | 'connected' | 'unavailable'>('unknown');
  // Phase 2.3 — product inventory state.
  const [productsOpen, setProductsOpen] = useState(false);
  const [openProductId, setOpenProductId] = useState<string | null>(null);
  const personaRef = useRef(persona);
  personaRef.current = persona;
  const convoRef = useRef<{ id: string | null; messages: TedMessage[] }>({ id: null, messages: [] });
  convoRef.current = { id: activeId, messages };

  const persist = useCallback((id: string | null, msgs: TedMessage[]) => {
    if (!id || msgs.length === 0) return;
    const firstFounder = msgs.find((m) => m.role === 'founder');
    const existing = loadConversations().find((c) => c.id === id);
    saveConversation({
      id,
      title: existing?.title ?? deriveTitle(firstFounder?.text ?? 'Shared a file'),
      messages: msgs,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    });
    setConversations(loadConversations());
  }, []);

  /** Append a TED message outside the normal send flow (voice errors, research results). */
  const appendTedMessage = useCallback(
    (text: string) => {
      const { id, messages: msgs } = convoRef.current;
      const tedMsg: TedMessage = { id: nextId(), role: 'ted', text, timestamp: Date.now() };
      const finalMessages = [...msgs, tedMsg];
      setMessages(finalMessages);
      if (id) persist(id, finalMessages);
    },
    [persist],
  );

  /**
   * Phase 2.3 — Continue with TED. Loads the product as active context:
   * TED understands which product, its vision, progress, decisions, and
   * next work. "Let's finish this" will know what "this" means.
   */
  const continueWithTed = useCallback((productId: string) => {
    const memory = getProductMemory(productId);
    if (!memory) return;
    setOpenProductId(null);
    const current = personaRef.current;
    if (current) {
      const next = { ...current, activeProductId: productId };
      personaRef.current = next;
      setPersona(next);
    }
    appendTedMessage(
      `Got it — we're now working on **${memory.title}**.\n\n` +
      `What it is: ${memory.subtitle || memory.vision.slice(0, 120)}\n` +
      `Status: ${memory.status}\n` +
      `Next: ${memory.nextMoves[0] || 'Not recorded.'}\n\n` +
      `Say "let's finish this" and I'll pick up where we left off.`
    );
    // Scroll back to the conversation.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [appendTedMessage]);

  // PHASE 2.2 — live research + Tool Bridge discovery. The bridge handshake
  // is real: tools flip available only after /health answers.
  useEffect(() => {
    initLiveResearch();
    let cancelled = false;
    (async () => {
      const health = await toolBridge.discover();
      if (cancelled) return;
      const connected = !!health;
      setBridgeStatus(connected ? 'connected' : 'unavailable');
      syncBridgeTools(connected);
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const runTurnRef = useRef<(text: string, attachments: TedAttachment[], opts?: TurnOptions) => Promise<string>>(
    () => Promise.resolve(''),
  );

  // Voice session lifecycle: provider + orchestrator, created once.
  // One mic tap opens a persistent conversation; the founder never taps per turn.
  useEffect(() => {
    const latency = latencyRef.current!;
    const provider = new WebSpeechVoiceProvider(browserVoiceRuntime(), {
      onTranscript: (interim, final) => {
        setVoiceTranscript(final || interim || null);
      },
      onTurnComplete: (transcript) => {
        void sessionRef.current?.handleTurnComplete(transcript);
      },
      onBargeIn: (transcript) => {
        void sessionRef.current?.handleBargeIn(transcript);
      },
      onSpeechStarted: () => {
        /* session state drives the UI */
      },
      onSpeechEnded: () => {
        sessionRef.current?.handleSpeechEnded();
      },
      onError: (_kind, message) => {
        appendTedMessage(`Voice note: ${message}`);
      },
      onConnectionLost: () => {
        void sessionRef.current?.handleConnectionLost();
      },
      onConnectionRestored: () => {
        /* the session resumes listening itself */
      },
    }, latency);
    providerRef.current = provider;
    const session = new SuperVoiceSession(provider, TED_VOICE_AGENT_CONFIG, {
      onStateChange: (s: VoiceSessionState) => {
        setVoiceUiState(sessionStateToUi(s));
        if (s === 'listening') setVoiceTranscript(null);
      },
      onUserTurn: async (transcript: string) => {
        const reply = await runTurnRef.current(transcript, [], { viaSession: true });
        return reply;
      },
      onSessionEnded: (reason: string) => {
        setVoiceUiState('idle');
        if (/fail|could not|lost|blocked/i.test(reason)) {
          appendTedMessage(`Voice session ended: ${reason} Text chat still works.`);
        }
      },
    }, latency);
    sessionRef.current = session;
    const supported = provider.support.recognition;
    setVoiceUiState(supported ? 'idle' : 'unsupported');
    return () => {
      session.end('Page unmounted.');
      sessionRef.current = null;
      providerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appendTedMessage]);

  const handleMicTap = useCallback(() => {
    const session = sessionRef.current;
    const provider = providerRef.current;
    if (!provider?.support.recognition || !session) return;
    const s = session.state;
    if (s === 'speaking') {
      // Barge-in via UI: stop TED mid-sentence, resume listening.
      session.interruptToListen();
      return;
    }
    if (session.isActive) {
      // Explicit end-conversation control.
      session.end();
      return;
    }
    setVoiceTranscript(null);
    void session.start();
  }, []);

  const handleEndSession = useCallback(() => {
    sessionRef.current?.end();
  }, []);

  /** Speak text aloud when synthesis is available; otherwise say so honestly. */
  const speakAloud = useCallback(
    (text: string) => {
      const provider = providerRef.current;
      if (!provider || !provider.support.synthesis) {
        appendTedMessage(
          `I'd read that aloud, but this browser can't do speech output — here's the text instead.`,
        );
        return;
      }
      provider.speak(text);
    },
    [appendTedMessage],
  );

  const startNewChat = useCallback(() => {
    const { id, messages: msgs } = convoRef.current;
    if (id && msgs.length > 0) {
      const firstFounder = msgs.find((m) => m.role === 'founder');
      const existing = loadConversations().find((c) => c.id === id);
      saveConversation({
        id,
        title: existing?.title ?? deriveTitle(firstFounder?.text ?? 'Shared a file'),
        messages: msgs,
        createdAt: existing?.createdAt ?? Date.now(),
        updatedAt: Date.now(),
      });
    }
    setConversations(loadConversations());
    setActiveId(null);
    setMessages([]);
    convoRef.current = { id: null, messages: [] };
    const fresh = initialPersonaState();
    personaRef.current = fresh;
    setPersona(fresh);
    setArtifact(null);
    setProductsOpen(false);
    setOpenProductId(null);
    clearMemoryOverlay(); // Phase 2.3 — new chat starts with a clean product memory slate.
    setNavOpen((v) => (typeof window !== 'undefined' && window.innerWidth < 1024 ? false : v));
  }, []);

  const openConversation = useCallback((id: string) => {
    const { id: curId, messages: msgs } = convoRef.current;
    if (curId && msgs.length > 0 && curId !== id) {
      const firstFounder = msgs.find((m) => m.role === 'founder');
      const existing = loadConversations().find((c) => c.id === curId);
      saveConversation({
        id: curId,
        title: existing?.title ?? deriveTitle(firstFounder?.text ?? 'Shared a file'),
        messages: msgs,
        createdAt: existing?.createdAt ?? Date.now(),
        updatedAt: Date.now(),
      });
    }
    const conv = loadConversations().find((c) => c.id === id);
    if (!conv) return;
    setConversations(loadConversations());
    setActiveId(id);
    setMessages(conv.messages);
    const fresh = initialPersonaState();
    personaRef.current = fresh;
    setPersona(fresh);
    setArtifact(null);
    setProductsOpen(false);
    setOpenProductId(null);
    clearMemoryOverlay(); // Phase 2.3 — switching conversations clears product context too.
    if (typeof window !== 'undefined' && window.innerWidth < 1024) setNavOpen(false);
  }, []);

  const removeConversation = useCallback(
    (id: string) => {
      deleteConversation(id);
      setConversations(loadConversations());
      if (convoRef.current.id === id) startNewChat();
    },
    [startNewChat],
  );

  /** Run live research for a turn. In a voice session, the result is spoken
   *  proactively (if genuinely useful); otherwise it's appended as text. */
  const runResearch = useCallback(
    async (query: string, viaSession = false) => {
      setResearching(true);
      const outcome = await requestResearch(query);
      setResearching(false);
      if (outcome.status === 'ok') {
        const session = sessionRef.current;
        if (viaSession && session?.isActive) {
          session.notifyProactive(
            makeProactiveEvent(
              'research-finished',
              renderProactiveText('research-finished', outcome.result.summary),
              `research-${query.slice(0, 40)}`,
            ),
          );
        } else {
          appendTedMessage(formatResearchResult(outcome.result));
        }
      } else {
        appendTedMessage(`I tried to research that live, but hit a wall: ${outcome.reason}`);
      }
    },
    [appendTedMessage],
  );

  /**
   * Execute a Tool Bridge operation from the persona. Every outcome is
   * reported with evidence; nothing is claimed without it. Meaningful
   * completions during a voice session are announced proactively.
   */
  const runBridgeOp = useCallback(
    async (op: TedBridgeOp) => {
      const session = sessionRef.current;
      const announce = (text: string) => {
        if (session?.isActive) {
          session.notifyProactive(
            makeProactiveEvent('operation-complete', text, `bridge-${op.kind}-${Date.now()}`),
          );
        } else {
          appendTedMessage(text);
        }
      };

      if (op.kind === 'inspect') {
        const r = await toolBridge.inspect(op.path ?? '.');
        if (!r.ok) return appendTedMessage(`Inspect failed: ${r.error}`);
        const entries = (r.entries as { name: string; dir: boolean }[])
          .map((e) => `${e.dir ? '📁' : '📄'} ${e.name}`)
          .join('\n');
        return appendTedMessage(`Project structure (${r.path}):\n\n${entries}`);
      }
      if (op.kind === 'read') {
        const r = await toolBridge.readFile(op.path ?? '');
        if (!r.ok) return appendTedMessage(`Read failed: ${r.error}`);
        const content = String(r.content ?? '');
        return appendTedMessage(
          `**${op.path}** (${content.length} chars):\n\n\`\`\`\n${content.slice(0, 4000)}${content.length > 4000 ? '\n…(truncated)' : ''}\n\`\`\``,
        );
      }
      if (op.kind === 'test' || op.kind === 'build') {
        appendTedMessage(`${op.label} — running now, this takes a bit.`);
        const r = op.kind === 'test' ? await toolBridge.runTests() : await toolBridge.runBuild();
        if (!r.ok) return appendTedMessage(`${op.label} failed to run: ${r.error}`);
        const output = String(r.output ?? '');
        const passed = r.exitCode === 0;
        const tail = output.slice(-1500);
        const summary = passed
          ? `✅ ${op.label} passed (exit 0).`
          : `❌ ${op.label} failed (exit ${r.exitCode}).`;
        const detail = `Output (tail):\n\n\`\`\`\n${tail}\n\`\`\``;
        if (op.kind === 'test' && !passed) {
          // Proactive: a failed build/test is genuinely useful news.
          if (session?.isActive) {
            session.notifyProactive(
              makeProactiveEvent('build-failed', `${op.label} failed — exit ${r.exitCode}.`, `bridge-${op.kind}-fail-${Date.now()}`, 'urgent'),
            );
          }
        } else if (passed) {
          announce(`${summary}\n\n${detail}`);
          return;
        }
        return appendTedMessage(`${summary}\n\n${detail}`);
      }
      if (op.kind === 'edit-propose') {
        const r = await toolBridge.proposeEdit(op.path ?? '', op.oldText ?? '', op.newText ?? '');
        if (!r.ok) return appendTedMessage(`Couldn't propose the edit: ${r.error}`);
        // Store the confirmation so "apply it" works — founder confirms in chat.
        const current = personaRef.current;
        if (current) {
          const nextPersona = {
            ...current,
            pendingEdit: {
              confirmationId: String(r.confirmationId),
              path: op.path ?? '',
              diffPreview: String(r.diffPreview ?? ''),
            },
          };
          personaRef.current = nextPersona;
          setPersona(nextPersona);
        }
        return appendTedMessage(
          `Here's the proposed change to **${op.path}**:\n\n\`\`\`diff\n${r.diffPreview}\n\`\`\`\n\nSay "apply it" and I'll write it.`,
        );
      }
      if (op.kind === 'edit-confirm') {
        const r = await toolBridge.confirmEdit(op.confirmationId ?? '');
        if (!r.ok) {
          const current = personaRef.current;
          if (current) {
            const cleared = { ...current, pendingEdit: null };
            personaRef.current = cleared;
            setPersona(cleared);
          }
          return appendTedMessage(`Couldn't apply the edit: ${r.error}`);
        }
        const current = personaRef.current;
        if (current) {
          const cleared = { ...current, pendingEdit: null };
          personaRef.current = cleared;
          setPersona(cleared);
        }
        announce(`✅ Change applied to **${op.path}** — verified by the bridge.`);
        return;
      }
    },
    [appendTedMessage],
  );

  /**
   * Run one conversation turn and resolve with the text TED should speak
   * (voice sessions) — the thread update happens the same way for every
   * modality, so text and voice share one continuous conversation.
   */
  const runTurn = useCallback(
    (text: string, attachments: TedAttachment[], opts: TurnOptions = {}): Promise<string> => {
      return new Promise((resolve) => {
        const trimmed = text.trim();
        if ((!trimmed && attachments.length === 0) || personaRef.current === null) {
          resolve('');
          return;
        }
        if (thinking) {
          resolve('');
          return;
        }
        // Text turn while TED is speaking: the founder moved on — stop speech
        // immediately and answer in text. The session keeps listening.
        if (!opts.viaSession && sessionRef.current?.state === 'speaking') {
          sessionRef.current.interruptToListen();
        }

        let convId = convoRef.current.id;
        if (!convId) {
          convId = newConversationId();
          setActiveId(convId);
          convoRef.current.id = convId;
        }

        const current = personaRef.current;
        const recentQueries = [...current.recentQueries, trimmed].filter(Boolean).slice(-6);

        // Bridge token paste: "token <hex>" or a bare 48-hex-char paste.
        const tokenMatch = trimmed.match(/^(?:bridge token|token)[:\s]+([0-9a-f]{32,128})$/i)
          ?? trimmed.match(/^([0-9a-f]{48})$/i);
        if (tokenMatch && !opts.viaSession) {
          toolBridge.saveCredentials('http://127.0.0.1:3777', tokenMatch[1]);
          void (async () => {
            const health = await toolBridge.discover();
            const connected = !!health;
            setBridgeStatus(connected ? 'connected' : 'unavailable');
            syncBridgeTools(connected);
            setThinking(false);
            if (connected) {
              appendTedMessage(
                `Connected — Tool Bridge v${health.version}, project: ${health.projectRoot}. ` +
                `I can now inspect, read, test, build, and propose edits — all with proof.`,
              );
            } else {
              appendTedMessage(
                `That token is saved, but I can't reach the bridge at http://127.0.0.1:3777. ` +
                `Make sure it's running, then say "retry bridge".`,
              );
            }
          })();
          return;
        }

        const founderMsg: TedMessage = { id: nextId(), role: 'founder', text: trimmed, attachments, timestamp: Date.now() };
        const nextMessages = [...convoRef.current.messages, founderMsg];
        setMessages(nextMessages);
        setThinking(true);

        // Natural conversational latency: voice turns answer fast.
        const delay = opts.viaSession ? 150 : 650;
        window.setTimeout(() => {
          let result = tedPersonaRespond(trimmed || '(attachment sent)', { ...current, recentQueries }, {
            voiceSupported: providerRef.current?.support.recognition,
            bridgeConnected: toolBridge.isConnected,
          });
          try {
          if (attachments.length > 0 && !trimmed) {
            result = { ...result, reply: ATTACHMENT_NOTE };
          } else if (attachments.length > 0) {
            result = {
              ...result,
              reply: `${ATTACHMENT_NOTE}\n\n---\n\nAnd on your message:\n\n${result.reply}`,
            };
          }
          const next: TedPersonaState = {
            context: result.context ?? current.context,
            recentQueries,
            operation: result.operation,
            ideaDraft:
              result.context?.kind === 'idea'
                ? `${current.ideaDraft ? `${current.ideaDraft} ` : ''}${trimmed}`.slice(0, 500)
                : current.ideaDraft,
            build: result.build !== undefined ? result.build : current.build,
            pendingEdit: result.pendingEdit !== undefined ? result.pendingEdit : current.pendingEdit,
            activeProductId: current.activeProductId,
          };
          personaRef.current = next;
          setPersona(next);

          const tedMsg: TedMessage = { id: nextId(), role: 'ted', text: result.reply, timestamp: Date.now() };
          const finalMessages = [...nextMessages, tedMsg];
          setMessages(finalMessages);
          // Keep the ref synchronous: follow-up appends read convoRef and
          // must see the reply we just added, before re-render.
          convoRef.current = { id: convId, messages: finalMessages };
          setThinking(false);

          // What the voice session should speak: the reply, or the prior TED
          // message for "read that to me".
          let spokenText = tedMsg.text;
          if (result.speak === 'last') {
            const priorTed = [...nextMessages].reverse().find((m) => m.role === 'ted');
            spokenText = priorTed ? priorTed.text : result.reply;
          }
          resolve(spokenText);

          if (!opts.viaSession && result.speak === 'last') {
            // Text turn asking for speech: read the prior reply aloud once.
            const priorTed = [...nextMessages].reverse().find((m) => m.role === 'ted');
            if (priorTed) speakAloud(priorTed.text);
            else appendTedMessage(`There's nothing of mine to read yet — say something first and I'll read it back.`);
          }
          if (result.researchQuery) {
            void runResearch(result.researchQuery, opts.viaSession);
          }
          if (result.bridgeOp) {
            void runBridgeOp(result.bridgeOp);
          }

          if (result.artifact === 'project' && result.context?.kind === 'project') {
            setArtifact({ kind: 'project', project: result.context.project });
          } else if (result.artifact === 'product' && result.context?.kind === 'product') {
            setArtifact({ kind: 'product', product: result.context.product });
          } else if (result.artifact === 'projects') {
            setArtifact({ kind: 'projects' });
          } else if (result.artifact === 'products') {
            setArtifact({ kind: 'products' });
          }

          if (convId) persist(convId, finalMessages);
          } catch (e) {
            // Never let a render-path error swallow the turn silently.
            appendTedMessage('Something glitched on my end — say that again?');
          }
        }, delay);
      });
    },
    [persist, thinking, speakAloud, appendTedMessage, runResearch, runBridgeOp],
  );

  const send = useCallback(
    (text: string, attachments: TedAttachment[]) => {
      void runTurn(text, attachments);
    },
    [runTurn],
  );

  // Latest turn runner, for the voice session (which lives outside render flow).
  runTurnRef.current = runTurn;

  const askTed = useCallback(
    (message: string) => {
      send(message, []);
    },
    [send],
  );

  useEffect(() => {
    setConversations(loadConversations());
  }, []);

  const nav = (
    <TedNav
      conversations={conversations}
      activeId={activeId}
      onNewChat={startNewChat}
      onSelectConversation={openConversation}
      onDeleteConversation={removeConversation}
      onOpenProducts={() => {
        setProductsOpen(true);
        setOpenProductId(null);
      }}
    />
  );

  return (
    <div className="flex min-h-dvh flex-col bg-white font-sans text-slate-900 antialiased">
      {/* Minimal top strip */}
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2.5 border-b border-slate-200/80 bg-white px-3 sm:px-5">
        <button
          aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => setNavOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-900/[0.05] hover:text-slate-800"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={1.8}>
            <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
          </svg>
        </button>
        <span className="font-heading text-[14px] font-extrabold tracking-tight">OCG LAB</span>
        <span className="h-4 w-px bg-slate-200" aria-hidden />
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500" aria-hidden />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            TED · Ready
          </span>
        </span>
        {onOpenProjects && <button type="button" onClick={onOpenProjects} className="ml-auto rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100" aria-label="Open Project Workbench">Project Workbench</button>}
      </header>

      <div className="flex h-[calc(100dvh-3.5rem)] min-h-0">
        {/* Minimal sidebar (desktop) */}
        {navOpen && (
          <aside className="hidden w-[280px] shrink-0 border-r border-slate-200/80 bg-slate-50/70 lg:block">
            {nav}
          </aside>
        )}

        {/* TED conversation or founder product inventory */}
        <main className="min-w-0 flex-1 overflow-y-auto bg-white">
          {productsOpen ? (
            <TedProducts
              onOpenProduct={setOpenProductId}
              onContinueWithTed={(productId) => {
                setProductsOpen(false);
                continueWithTed(productId);
              }}
            />
          ) : (
            <TedChat
              messages={messages}
              thinking={thinking}
              researching={researching}
              onSend={send}
              voice={{ state: voiceUiState, onMicTap: handleMicTap, onEndSession: handleEndSession }}
              voiceTranscript={voiceTranscript}
            />
          )}
        </main>

        {/* Artifact workspace — only when something is worth inspecting */}
        {artifact && (
          <aside className="hidden w-[380px] shrink-0 border-l border-slate-200/80 lg:block">
            <TedArtifactPanel artifact={artifact} onClose={() => setArtifact(null)} onAskTed={askTed} />
          </aside>
        )}
      </div>

      {/* Product detail drawer — focused overlay, not permanent clutter. */}
      {openProductId && (
        <div className="fixed inset-0 z-50" role="dialog" aria-label="Product detail">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setOpenProductId(null)}
          />
          <div className="absolute inset-y-0 right-0 w-[480px] max-w-[94vw] bg-white shadow-2xl">
            <TedProductDetail
              productId={openProductId}
              onClose={() => setOpenProductId(null)}
              onContinueWithTed={continueWithTed}
            />
          </div>
        </div>
      )}

      {/* Navigation drawer (mobile / tablet) */}
      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-label="TED navigation">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setNavOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[300px] max-w-[86vw] bg-white shadow-2xl">
            <TedNav
              conversations={conversations}
              activeId={activeId}
              onNewChat={startNewChat}
              onSelectConversation={openConversation}
              onDeleteConversation={removeConversation}
              onOpenProducts={() => {
                setProductsOpen(true);
                setOpenProductId(null);
                setNavOpen(false);
              }}
              onClose={() => setNavOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Artifact drawer (mobile / tablet) */}
      {artifact && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-label="TED panel">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" onClick={() => setArtifact(null)} />
          <div className="absolute inset-y-0 right-0 w-[340px] max-w-[92vw] bg-white shadow-2xl">
            <TedArtifactPanel artifact={artifact} onClose={() => setArtifact(null)} onAskTed={askTed} />
          </div>
        </div>
      )}
    </div>
  );
};
