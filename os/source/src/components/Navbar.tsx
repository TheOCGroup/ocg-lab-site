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
  Award, 
  Wrench, 
  Terminal, 
  Zap,
  Menu,
  X,
  Target
} from "lucide-react";
import { motion } from "motion/react";

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
  onOpenLogin,
  onOpenWaitlist,
  onOpenCheckout,
  onOpenAiden,
  isFocusMode,
  onToggleFocus
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#030712]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => setActivePage("command")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-emerald-500 to-amber-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                <span className="font-heading font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                  OCG
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  The OCG Lab
                </span>
                <span className={"text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border " + (
                  isOsMode 
                    ? "bg-cyan-950/80 text-cyan-300 border-cyan-700/50" 
                    : "bg-emerald-950/80 text-emerald-300 border-emerald-700/50"
                )}>
                  {isOsMode ? "LAB OS" : "STOREFRONT"}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium tracking-wide">
                BUILD | AUTOMATE | CREATE | SCALE
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-slate-800/60">
            {(isOsMode ? osNavItems : publicNavItems).map((item) => {
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

          <div className="lg:hidden flex items-center gap-2">
            <button
              data-aiden-btn="mobile"
              onClick={onOpenAiden}
              className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
            >
              <Bot className="w-5 h-5" />
            </button>
            <button
              data-menu-toggle="mobile"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
            {osNavItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  data-nav-mobile={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={"flex items-center gap-2 p-2.5 rounded-xl border text-left " + (
                    activePage === item.id ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" : "bg-slate-900 border-slate-800 text-slate-300"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
};
