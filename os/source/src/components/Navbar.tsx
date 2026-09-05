import React, { useState } from "react";
import { Page } from "../types";
import { 
  Building2, 
  Layers, 
  BookOpen, 
  ShieldCheck, 
  ShoppingCart, 
  Sliders, 
  Bot, 
  Activity, 
  FolderGit2, 
  Zap,
  Menu,
  X,
  Target,
  Cloud
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

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  onOpenAiden
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<'SYNCED' | 'OFFLINE_CACHED' | 'AUTH_REQUIRED'>('AUTH_REQUIRED');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleCloudSync = async () => {
    if (!StorageEngine.getFounderKey()) {
      const entered = window.prompt('Enter the Founder cloud-sync key for this session. It is kept in sessionStorage only and is never bundled into OCG LAB OS.');
      if (!entered) { setCloudStatus('AUTH_REQUIRED'); return; }
      StorageEngine.setFounderKey(entered);
    }
    setIsSyncing(true);
    const result = await StorageEngine.syncWithCloud();
    setIsSyncing(false);
    setCloudStatus(result.status === 'OFFLINE_CACHED' ? 'OFFLINE_CACHED' : result.status === 'AUTH_REQUIRED' ? 'AUTH_REQUIRED' : 'SYNCED');
  };

  const isOsMode = [
    "command", "portfolio", "projects", "operations", "qa", "engineering", "storefronts", "knowledge", "agents", "releases"
  ].includes(activePage);

  const osNavItems: { id: Page; label: string; icon: any }[] = [
    { id: "command", label: "Command", icon: Activity },
    { id: "portfolio", label: "Portfolio", icon: Layers },
    { id: "projects", label: "Projects", icon: Target },
    { id: "operations", label: "Agents & Ops", icon: Bot },
    { id: "qa", label: "QA & Releases", icon: ShieldCheck },
    { id: "engineering", label: "Engineering", icon: FolderGit2 },
    { id: "storefronts", label: "Storefronts", icon: ShoppingCart },
    { id: "knowledge", label: "Knowledge & R&D", icon: BookOpen }
  ];

  const publicNavItems: { id: Page; label: string; icon: any }[] = [
    { id: "home", label: "Home", icon: Building2 },
    { id: "storefront", label: "Public Storefront", icon: ShoppingCart },
    { id: "my-ocg", label: "MY OCG Hub", icon: Zap },
    { id: "about", label: "About", icon: ShieldCheck },
    { id: "resources", label: "SOP Kits", icon: BookOpen },
    { id: "pricing", label: "Pricing", icon: Sliders },
    { id: "admin", label: "Admin Portal", icon: Sliders }
  ];

  const activeNavItems = isOsMode ? osNavItems : publicNavItems;

  return (
    <header className="sticky top-0 z-40 w-full max-w-full overflow-x-clip border-b border-slate-800/80 bg-[#030712]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto w-full min-w-0 px-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center justify-between gap-2 h-16 sm:h-20">
          
          <button
            type="button"
            className="flex min-w-0 items-center gap-2.5 sm:gap-3 text-left group"
            onClick={() => setActivePage("command")}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-cyan-500 via-emerald-500 to-amber-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                <span className="font-heading font-extrabold text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">OCG</span>
              </div>
            </div>
            <div className="min-w-0 flex flex-col">
              <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                <span className="truncate font-heading font-extrabold text-base sm:text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">The OCG Lab</span>
                <span className={"hidden min-[390px]:inline-flex shrink-0 text-[9px] sm:text-[10px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-full border " + (
                  isOsMode 
                    ? "bg-cyan-950/80 text-cyan-300 border-cyan-700/50" 
                    : "bg-emerald-950/80 text-emerald-300 border-emerald-700/50"
                )}>
                  {isOsMode ? "LAB OS" : "STORE"}
                </span>
              </div>
              <span className="hidden sm:block truncate text-xs text-slate-400 font-medium tracking-wide">BUILD | AUTOMATE | CREATE | SCALE</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-slate-800/60">
            {activeNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={"relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer " + (
                    isActive 
                      ? "text-white font-bold" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 rounded-full shadow-inner shadow-cyan-500/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className={"w-3.5 h-3.5 relative z-10 " + (isActive ? "text-cyan-400" : "")} />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {isOsMode && (
              <button
                data-cloud-sync-btn="true"
                onClick={handleCloudSync}
                title="Canonical cloud persistence; Founder key is session-only"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono transition"
              >
                <Cloud className={"w-3.5 h-3.5 " + (isSyncing ? "animate-pulse" : "")} />
                <span>{isSyncing ? "SYNCING..." : cloudStatus === 'OFFLINE_CACHED' ? 'OFFLINE CACHED' : cloudStatus === 'AUTH_REQUIRED' ? 'SYNC AUTH' : 'CLOUD SYNCED'}</span>
              </button>
            )}
            <button
              data-aiden-btn="desktop"
              onClick={onOpenAiden}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold shadow-lg shadow-cyan-500/10 transition"
            >
              <Bot className="w-4 h-4 animate-pulse" />
              <span>AIDEN</span>
            </button>

            <button
              onClick={() => setActivePage(isOsMode ? "storefront" : "command")}
              className="px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-[11px] font-mono border border-slate-700 transition"
            >
              {isOsMode ? "View Storefront" : "Switch to OS"}
            </button>
          </div>

          <div className="lg:hidden flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              data-aiden-btn="mobile"
              aria-label="Open Aiden"
              onClick={onOpenAiden}
              className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
            >
              <Bot className="w-5 h-5" />
            </button>
            <button
              data-menu-toggle="mobile"
              aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-slate-800 py-3 sm:py-4">
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2 text-xs">
              {activeNavItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    data-nav-mobile={item.id}
                    onClick={() => {
                      setActivePage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={"flex min-w-0 items-center gap-2 p-3 rounded-xl border text-left " + (
                      activePage === item.id ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" : "bg-slate-900 border-slate-800 text-slate-300"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="min-w-0 break-words">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 grid grid-cols-1 min-[360px]:grid-cols-2 gap-2">
              {isOsMode && (
                <button
                  onClick={handleCloudSync}
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-xs font-mono text-emerald-300"
                >
                  <Cloud className={"w-4 h-4 " + (isSyncing ? "animate-pulse" : "")} />
                  {isSyncing ? "SYNCING..." : "CLOUD SYNC"}
                </button>
              )}
              <button
                onClick={() => {
                  setActivePage(isOsMode ? "storefront" : "command");
                  setMobileMenuOpen(false);
                }}
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-xs font-mono text-slate-300"
              >
                {isOsMode ? "View Storefront" : "Switch to OS"}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
