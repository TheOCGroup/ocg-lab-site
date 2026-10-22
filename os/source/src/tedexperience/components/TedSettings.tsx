/**
 * TED Settings — a truthful status-and-data-controls surface.
 *
 * Everything shown here is read from real state in this browser:
 * conversation history (tedHistory), the Tool Bridge client, Web Speech
 * capability detection, the OCG LAB OS storage engine's sync fields, and
 * the product-memory overlay. Every control acts on that same real state:
 * deleting all conversations really deletes them, forgetting the bridge
 * token really forgets it, removing the founder key really removes it
 * from this session. There are no decorative toggles: where the product
 * deliberately offers no control (product decisions persist across chats
 * by design), this page says so instead of rendering a dead switch.
 */
import React, { useState } from 'react';
import { ArrowLeft, Boxes, Cloud, KeyRound, MessagesSquare, Mic, Plug, Settings, Volume2 } from 'lucide-react';
import { clearAllConversations, loadConversations } from '../tedHistory';
import { getMemoryOverlayCount } from '../productMemory';
import { toolBridge } from '../tedToolBridge';
import { browserVoiceRuntime, detectVoiceSupport } from '../tedVoice';
import { StorageEngine } from '../../data/storageEngine';

interface TedSettingsProps {
  bridgeStatus: 'unknown' | 'connected' | 'unavailable';
  onBackToChat: () => void;
  onConversationsCleared: () => void;
  onBridgeTokenForgotten: () => void;
}

interface SettingsSnapshot {
  conversationCount: number;
  bridgeHasToken: boolean;
  bridgeConnected: boolean;
  bridgeVersion: string | null;
  bridgeProject: string | null;
  voiceRecognition: boolean;
  voiceSynthesis: boolean;
  cloudStatus: string | null;
  lastSyncedAt: string | null;
  founderKeyPresent: boolean;
  productNoteCount: number;
}

function readSnapshot(bridgeStatus: TedSettingsProps['bridgeStatus']): SettingsSnapshot {
  const osState = StorageEngine.loadState();
  const health = toolBridge.bridgeHealth;
  const voice = detectVoiceSupport(browserVoiceRuntime());
  return {
    conversationCount: loadConversations().length,
    bridgeHasToken: toolBridge.hasToken,
    bridgeConnected: bridgeStatus === 'connected' && toolBridge.isConnected,
    bridgeVersion: health?.version ?? null,
    bridgeProject: health?.projectRoot ?? null,
    voiceRecognition: voice.recognition,
    voiceSynthesis: voice.synthesis,
    cloudStatus: osState.cloudStatus ?? null,
    lastSyncedAt: osState.lastSyncedAt ?? null,
    founderKeyPresent: !!StorageEngine.getFounderKey(),
    productNoteCount: getMemoryOverlayCount(),
  };
}

function Chip({ children, tone = 'slate' }: { children: React.ReactNode; tone?: 'slate' | 'blue' | 'amber' | 'emerald' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] ${tones[tone]}`}>
      {children}
    </span>
  );
}

function SectionCard({
  icon,
  eyebrow,
  title,
  children,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7" aria-label={title}>
      <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        <span className="text-blue-700" aria-hidden>{icon}</span>
        {eyebrow}
      </p>
      <h3 className="mt-2 font-heading text-[16px] font-bold text-slate-900">{title}</h3>
      <div className="mt-3 space-y-3 text-[13px] leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

function StatusRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="font-medium text-slate-700">{label}</span>
      <span className="flex items-center gap-2">{children}</span>
    </div>
  );
}

const CLOUD_STATUS_LABELS: Record<string, string> = {
  SYNCED: 'Synced',
  OFFLINE_CACHED: 'Offline — cached state',
  AUTH_REQUIRED: 'Founder key required',
};

export const TedSettings: React.FC<TedSettingsProps> = ({
  bridgeStatus,
  onBackToChat,
  onConversationsCleared,
  onBridgeTokenForgotten,
}) => {
  const [snapshot, setSnapshot] = useState<SettingsSnapshot>(() => readSnapshot(bridgeStatus));
  const [confirmingClear, setConfirmingClear] = useState(false);
  const refresh = () => setSnapshot(readSnapshot(bridgeStatus));

  const handleClearConversations = () => {
    clearAllConversations();
    setConfirmingClear(false);
    onConversationsCleared();
    refresh();
  };

  const handleForgetBridge = () => {
    toolBridge.forget();
    onBridgeTokenForgotten();
    refresh();
  };

  const handleRemoveFounderKey = () => {
    StorageEngine.setFounderKey('');
    refresh();
  };

  return (
    <section aria-label="TED settings" className="h-full overflow-y-auto bg-slate-50/50 px-4 py-6 sm:px-8">
      <div className="mx-auto w-full max-w-[880px]">
        <button
          onClick={onBackToChat}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to TED conversation
        </button>

        <div className="mt-5">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            OCG LAB / TED Settings
          </p>
          <h2 className="mt-1.5 flex items-center gap-2.5 font-heading text-[20px] font-extrabold tracking-tight text-slate-900 sm:text-[22px]">
            <Settings className="h-6 w-6 text-blue-700" aria-hidden />
            Settings
          </h2>
          <p className="mt-1 max-w-[560px] text-[13px] leading-relaxed text-slate-600">
            What TED actually keeps in this browser, what it is connected to, and the controls that
            really change it. If a control is not here, it is because it would not do anything real.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <SectionCard icon={<MessagesSquare className="h-4 w-4" />} eyebrow="This browser" title="Conversation history">
            <StatusRow label="Saved conversations">
              <Chip tone={snapshot.conversationCount > 0 ? 'blue' : 'slate'}>
                {snapshot.conversationCount} saved
              </Chip>
            </StatusRow>
            <p>
              Conversations with TED are stored only in this browser (up to 50) and are listed under
              Previous Work in the navigation. They are not uploaded anywhere by this page.
            </p>
            {snapshot.conversationCount === 0 ? (
              <p className="text-slate-500">There are no saved conversations to delete.</p>
            ) : confirmingClear ? (
              <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-50 p-4">
                <p className="w-full font-medium text-slate-800">
                  Delete all {snapshot.conversationCount} saved conversations from this browser? This cannot be undone.
                </p>
                <button
                  onClick={handleClearConversations}
                  className="min-h-[40px] rounded-xl bg-red-600 px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-1"
                >
                  Delete all conversations
                </button>
                <button
                  onClick={() => setConfirmingClear(false)}
                  className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
                >
                  Keep them
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingClear(true)}
                className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
              >
                Delete all conversations…
              </button>
            )}
          </SectionCard>

          <SectionCard icon={<Plug className="h-4 w-4" />} eyebrow="This device" title="Tool Bridge">
            <StatusRow label="Connection">
              {snapshot.bridgeConnected ? (
                <Chip tone="emerald">Connected</Chip>
              ) : snapshot.bridgeHasToken ? (
                <Chip tone="amber">Token saved — bridge not reachable</Chip>
              ) : (
                <Chip tone="slate">Not connected</Chip>
              )}
            </StatusRow>
            {snapshot.bridgeConnected && (
              <p>
                Bridge{snapshot.bridgeVersion ? ` v${snapshot.bridgeVersion}` : ''}
                {snapshot.bridgeProject ? ` · project: ${snapshot.bridgeProject}` : ''}. TED can inspect,
                read, test, build, and propose edits — each result reported with proof.
              </p>
            )}
            {!snapshot.bridgeConnected && (
              <p>
                The Tool Bridge runs on this machine at 127.0.0.1:3777. To connect, paste a bridge token
                into the TED conversation — TED verifies it with a live handshake before any tool is used.
              </p>
            )}
            {snapshot.bridgeHasToken && (
              <button
                onClick={handleForgetBridge}
                className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
              >
                Forget bridge token
              </button>
            )}
          </SectionCard>

          <SectionCard icon={<Mic className="h-4 w-4" />} eyebrow="This browser" title="Voice">
            <StatusRow label="Voice input (speech recognition)">
              <Chip tone={snapshot.voiceRecognition ? 'emerald' : 'slate'}>
                {snapshot.voiceRecognition ? 'Available' : 'Not available'}
              </Chip>
            </StatusRow>
            <StatusRow label="Voice output (speech synthesis)">
              <Chip tone={snapshot.voiceSynthesis ? 'emerald' : 'slate'}>
                {snapshot.voiceSynthesis ? 'Available' : 'Not available'}
              </Chip>
            </StatusRow>
            <p className="flex items-start gap-2">
              <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              <span>
                TED&rsquo;s voice runs on this browser&rsquo;s built-in Web Speech. It is the only voice
                provider in this build, so there is no provider to choose — these rows report what this
                browser can actually do.
              </span>
            </p>
          </SectionCard>

          <SectionCard icon={<Cloud className="h-4 w-4" />} eyebrow="OCG LAB OS" title="Cloud sync & founder key">
            <StatusRow label="Cloud sync status">
              <Chip tone={snapshot.cloudStatus === 'SYNCED' ? 'emerald' : snapshot.cloudStatus ? 'amber' : 'slate'}>
                {snapshot.cloudStatus ? (CLOUD_STATUS_LABELS[snapshot.cloudStatus] ?? snapshot.cloudStatus) : 'Not synced yet'}
              </Chip>
            </StatusRow>
            <StatusRow label="Last synced">
              <span className="text-slate-600">
                {snapshot.lastSyncedAt ? new Date(snapshot.lastSyncedAt).toLocaleString() : 'Never from this browser'}
              </span>
            </StatusRow>
            <StatusRow label="Founder key">
              <Chip tone={snapshot.founderKeyPresent ? 'blue' : 'slate'}>
                {snapshot.founderKeyPresent ? 'Entered for this session' : 'Not entered'}
              </Chip>
            </StatusRow>
            <p>
              Sync itself runs from the OCG LAB OS Navbar SYNC control, and anonymous sync is refused by
              design — the founder key is session-only and is never bundled with the app or shown here.
            </p>
            {snapshot.founderKeyPresent && (
              <button
                onClick={handleRemoveFounderKey}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
              >
                <KeyRound className="h-4 w-4" />
                Remove founder key from this session
              </button>
            )}
          </SectionCard>

          <SectionCard icon={<Boxes className="h-4 w-4" />} eyebrow="This browser" title="Product memory">
            <StatusRow label="Products with session notes">
              <Chip tone={snapshot.productNoteCount > 0 ? 'blue' : 'slate'}>{snapshot.productNoteCount}</Chip>
            </StatusRow>
            <p>
              Decisions and progress notes you record while working on a product are kept in this
              browser and carried across conversations — deliberately: starting a new chat never erases
              product decisions, so there is no erase control for them here. Notes are reviewed and
              updated while working on each product.
            </p>
          </SectionCard>
        </div>
      </div>
    </section>
  );
};
