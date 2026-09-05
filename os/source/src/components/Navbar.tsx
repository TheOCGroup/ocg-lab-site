import React, { useState, useEffect } from "react";
import { Page } from "../types";
import {
  Activity,
  BookOpen,
  Bot,
  Cloud,
  FolderGit2,
  Layers,
  Menu,
  ShieldCheck,
  ShoppingCart,
  Target,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { StorageEngine } from "../data/storageEngine";

interface NavbarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  onOpenLogin: () => void;
  onOpenWaitlist: () => void;
  onOpenCheckout: () => void;
  onOpenAiden: () => void;
  isFocusMode: boolean;
  onToggleFocus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, setActivePage, onOpenAiden }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<"SYNCED" | "OFFLINE_CACHED" | "AUTH_REQUIRED">("AUTH_REQUIRED");
  const [isSyncing, setIsSyncing] = useState(false);

  const isOsMode = ["command", "portfolio", "projects", "operations", "qa", "engineering", "storefronts", "knowledge", "agents", "releases"].includes(activePage);

  const osNavItems: { id: Page; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "command", label: "Command", icon: Activity },
    { id: "portfolio", label: "Systems", icon: Layers },
    { id: "projects", label: "Projects", icon: Target },
    { id: "operations", label: "Workforce", icon: Bot },
    { id: "qa", label: "QA & Releases", icon: ShieldCheck },
    { id: "engineering", label: "Engineering", icon: FolderGit2 },
    { id: "storefronts", label: "Commercial", icon: ShoppingCart },
    { id: "knowledge", label: "Knowledge", icon: BookOpen },
  ];

  const publicNavItems: { id: Page; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "storefront", label: "Storefront", icon: ShoppingCart },
    { id: "home", label: "Company", icon: Layers },
    { id: "about", label: "About", icon: BookOpen },
  ];

  const activeNavItems = isOsMode ? osNavItems : publicNavItems;
  const currentLabel = activeNavItems.find((item) => item.id === activePage)?.label ?? (isOsMode ? "Command" : "Storefront");

  useEffect(() => {
    const close = () => setMobileMenuOpen(false);
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    window.addEventListener('pageshow', close);
    window.addEventListener('hashchange', close);
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('pageshow', close); window.removeEventListener('hashchange', close); window.removeEventListener('keydown', key); };
  }, []);

  const goTo = (page: Page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const handleCloudSync = async () => {
    // Founder key is session-only; it is never bundled into the client.
    if (!StorageEngine.getFounderKey()) {
      const entered = window.prompt("Enter the Founder cloud-sync key for this session.");
      if (!entered) {
        setCloudStatus("AUTH_REQUIRED");
        return;
      }
      StorageEngine.setFounderKey(entered);
    }

    setIsSyncing(true);
    const result = await StorageEngine.syncWithCloud();
    setIsSyncing(false);
    setCloudStatus(result.status === "OFFLINE_CACHED" ? "OFFLINE_CACHED" : result.status === "AUTH_REQUIRED" ? "AUTH_REQUIRED" : "SYNCED");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#090d14]">
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400" />
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex min-h-[104px] min-w-0 flex-wrap items-center justify-between gap-3 py-3">
          <button type="button" aria-label="Open OCG LAB command center" onClick={() => goTo("command")} className="group flex min-w-0 items-center gap-3 text-left">
            <div className="flex h-14 w-[128px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#f4f7fa] px-2 shadow-[0_10px_34px_-18px_rgba(34,211,238,.9)] sm:h-14 sm:w-[144px]">
              <img src="/assets/approved-logo.png" alt="OCG LAB" className="max-h-9 w-auto object-contain sm:max-h-10" />
            </div>
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate font-heading text-[15px] font-extrabold tracking-tight text-white sm:text-xl">OCG LAB</span>
                <span className="hidden shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-300 min-[390px]:inline-flex">{isOsMode ? "OS" : "PUBLIC"}</span>
              </div>
              <div className="mt-0.5 flex min-w-0 items-center gap-2">
                <span className="truncate font-mono text-[9px] uppercase tracking-[0.18em] text-slate-300 sm:text-[10px]">{isOsMode ? "Operating System" : "Software + AI"}</span>
                <span className="hidden h-1 w-1 rounded-full bg-cyan-400 min-[420px]:block" />
                <span className="hidden truncate text-[10px] font-semibold text-slate-400 min-[420px]:block">{currentLabel}</span>
              </div>
            </div>
          </button>

          <nav className="hidden w-full order-3 items-center gap-1 rounded-2xl border border-white/8 bg-white/[0.025] p-1 lg:flex">
            {activeNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activePage;
              return (
                <button key={item.id} onClick={() => goTo(item.id)} className={`relative flex whitespace-nowrap items-center gap-1.5 rounded-xl px-3 py-2 text-xs transition ${isActive ? "text-white" : "text-slate-400 hover:bg-white/[0.04] hover:text-white"}`}>
                  {isActive && <motion.div layoutId="ocg-primary-nav" className="absolute inset-0 rounded-xl border border-cyan-400/20 bg-gradient-to-r from-blue-500/14 via-cyan-400/12 to-emerald-400/14" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <Icon className={`relative z-10 h-3.5 w-3.5 ${isActive ? "text-cyan-300" : ""}`} />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            {isOsMode && (
              <button onClick={handleCloudSync} title="Founder key is session-only" className="flex items-center gap-1.5 rounded-xl border border-emerald-400/20 bg-emerald-400/8 px-3 py-2 font-mono text-[10px] text-emerald-300 transition hover:bg-emerald-400/12">
                <Cloud className={`h-3.5 w-3.5 ${isSyncing ? "animate-pulse" : ""}`} />
                {isSyncing ? "SYNCING" : cloudStatus === "SYNCED" ? "SYNCED" : "SYNC"}
              </button>
            )}
            <button data-aiden-btn="desktop" onClick={() => { setMobileMenuOpen(false); onOpenAiden(); }} className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold text-slate-950">
              <Bot className="h-4 w-4" />AIDEN
            </button>
            <button onClick={() => goTo(isOsMode ? "storefront" : "command")} className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 font-mono text-[10px] text-slate-300 transition hover:bg-white/[0.06]">{isOsMode ? "STORE" : "OS"}</button>
          </div>

          <div className="flex w-full items-center justify-end gap-2 lg:hidden">
            <button aria-label="Open Aiden" onClick={() => { setMobileMenuOpen(false); onOpenAiden(); }} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-400/10 px-3 text-sm font-bold text-cyan-200">Aiden</button>
            <button aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"} aria-controls="mobile-navigation" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 px-3 text-sm text-white">Menu {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-navigation" className="lg:hidden pb-4 max-h-[calc(100dvh-160px)] overflow-y-auto overscroll-contain">
            <div className="rounded-[22px] border border-white/10 bg-[#07101c] p-3 shadow-2xl shadow-black/30">
              <div className="mb-3 flex items-center justify-between px-1">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-300">{isOsMode ? "Technology Department" : "OCG LAB"}</p>
                  <p className="mt-1 text-sm font-bold text-white">{currentLabel}</p>
                </div>
                <button onClick={() => goTo(isOsMode ? "storefront" : "command")} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-300">{isOsMode ? "Public Store" : "Open OS"}</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {activeNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.id === activePage;
                  return (
                    <button key={item.id} onClick={() => goTo(item.id)} className={`flex min-w-0 items-center gap-2 rounded-2xl border p-3 text-left text-xs font-semibold transition ${isActive ? "border-cyan-300/25 bg-gradient-to-br from-blue-500/14 to-emerald-400/10 text-white" : "border-white/8 bg-white/[0.025] text-slate-300"}`}>
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-cyan-300" : "text-slate-300"}`} />
                      <span className="min-w-0 break-words">{item.label}</span>
                    </button>
                  );
                })}
              </div>
              {isOsMode && (
                <button onClick={handleCloudSync} className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/8 px-3 py-3 font-mono text-[10px] text-emerald-300">
                  <Cloud className={`h-4 w-4 ${isSyncing ? "animate-pulse" : ""}`} />{isSyncing ? "SYNCING" : "SYNC CANONICAL STATE"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
