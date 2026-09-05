import React, { useEffect, useState } from "react";
import { Page, SOPItem } from "./types";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AIConcierge } from "./components/AIConcierge";
import { AidenOrchestratorModal } from "./components/aiden/AidenOrchestratorModal";

import { CommandPage } from "./pages/CommandPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { OperationsPage } from "./pages/OperationsPage";
import { QAReleasesPage } from "./pages/QAReleasesPage";
import { EngineeringPage } from "./pages/EngineeringPage";
import { StorefrontsPage } from "./pages/StorefrontsPage";
import { KnowledgePage } from "./pages/KnowledgePage";

import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { MyOCGPage } from "./pages/MyOCGPage";
import { AdminCatalogPage } from "./pages/AdminCatalogPage";
import { AboutPage } from "./pages/AboutPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { PricingPage } from "./pages/PricingPage";
import { ContactPage } from "./pages/ContactPage";

import { CartCheckoutModal } from "./components/CartCheckoutModal";
import {
  WaitlistModal,
  LoginModal,
  SOPReaderModal,
  PrivacyModal,
  TermsModal,
} from "./components/Modals";
import { Toaster } from "sonner";

const OS_PAGES: Page[] = [
  "command",
  "portfolio",
  "projects",
  "operations",
  "qa",
  "engineering",
  "storefronts",
  "knowledge",
  "agents",
  "releases",
];

const ROUTES: Page[] = [...OS_PAGES, 'home', 'storefront', 'my-ocg', 'admin', 'about', 'resources', 'pricing', 'contact', 'rd'];
const readRoute = (): Page => { const route = location.hash.slice(1) as Page; return ROUTES.includes(route) ? route : 'command'; };

export function App() {
  const [activePage, updateActivePage] = useState<Page>(() => readRoute());
  const setActivePage = (page: Page) => { location.hash = page; updateActivePage(page); window.scrollTo(0, 0); };
  useEffect(() => { const sync = () => updateActivePage(readRoute()); window.addEventListener('hashchange', sync); return () => window.removeEventListener('hashchange', sync); }, []);
  const [isAidenOpen, setIsAidenOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [selectedSOP, setSelectedSOP] = useState<SOPItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const clearTransientOverlays = () => {
    setIsAidenOpen(false);
    setSelectedSOP(null);
    setIsCheckoutOpen(false);
    setIsWaitlistOpen(false);
    setIsLoginOpen(false);
    setIsPrivacyOpen(false);
    setIsTermsOpen(false);
  };

  useEffect(() => {
    clearTransientOverlays();
  }, [activePage]);

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) clearTransientOverlays();
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const handleOpenWaitlist = () => setIsWaitlistOpen(true);
  const handleOpenLogin = () => setIsLoginOpen(true);
  const handleOpenCheckout = () => setIsCheckoutOpen(true);

  return (
    <div className="relative flex min-h-screen w-full min-w-0 max-w-full flex-col overflow-x-clip bg-[#020711] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-100">
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        toastOptions={{
          style: {
            background: "#07101c",
            border: "1px solid rgba(148,163,184,.14)",
            color: "#f8fafc",
            borderRadius: "14px",
            fontSize: "12px",
          },
        }}
      />

      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenLogin={handleOpenLogin}
        onOpenWaitlist={handleOpenWaitlist}
        onOpenCheckout={handleOpenCheckout}
        onOpenAiden={() => setIsAidenOpen(true)}
        isFocusMode={isFocusMode}
        onToggleFocus={() => setIsFocusMode(!isFocusMode)}
      />

      <main className="w-full min-w-0 max-w-full flex-grow overflow-x-clip">
        <div key={activePage} className="w-full min-w-0 max-w-full overflow-x-clip">
          {activePage === "command" && (
            <CommandPage onNavigate={setActivePage} onOpenAiden={() => setIsAidenOpen(true)} />
          )}
          {activePage === "portfolio" && <PortfolioPage />}
          {activePage === "projects" && <ProjectsPage />}
          {(activePage === "operations" || activePage === "agents") && <OperationsPage />}
          {(activePage === "qa" || activePage === "releases") && <QAReleasesPage />}
          {activePage === "engineering" && <EngineeringPage />}
          {activePage === "storefronts" && <StorefrontsPage />}
          {(activePage === "knowledge" || activePage === "rd") && <KnowledgePage />}

          {activePage === "home" && (
            <HomePage setActivePage={setActivePage} onOpenWaitlist={handleOpenWaitlist} />
          )}
          {activePage === "storefront" && (
            <ProductsPage onNavigateToMyOCG={() => setActivePage("my-ocg")} />
          )}
          {activePage === "my-ocg" && (
            <MyOCGPage setActivePage={setActivePage} onOpenStorefront={() => setActivePage("storefront")} />
          )}
          {activePage === "admin" && <AdminCatalogPage />}
          {activePage === "about" && <AboutPage />}
          {activePage === "resources" && <ResourcesPage onOpenSOPReader={setSelectedSOP} />}
          {activePage === "pricing" && <PricingPage onOpenWaitlist={handleOpenWaitlist} />}
          {activePage === "contact" && <ContactPage />}
        </div>
      </main>

      {OS_PAGES.includes(activePage) ? <footer className="mx-auto w-full max-w-7xl border-t border-white/15 px-5 py-6 text-sm text-slate-300"><p>OCG LAB · Operating System</p><p className="mt-2">Registry records describe saved work. Runtime health requires current verification.</p><button className="mt-4 text-cyan-200" onClick={() => setActivePage("storefront")}>Open public storefront →</button></footer> : <Footer
        setActivePage={setActivePage}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />}

      <AidenOrchestratorModal
        isOpen={isAidenOpen}
        onClose={() => setIsAidenOpen(false)}
        onNavigate={setActivePage}
      />

      {!OS_PAGES.includes(activePage) && (
        <AIConcierge
          activePage={activePage}
          onOpenWaitlist={handleOpenWaitlist}
          onNavigateToStorefront={() => setActivePage("storefront")}
        />
      )}

      <CartCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onNavigateToMyOCG={() => setActivePage("my-ocg")}
      />
      <WaitlistModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SOPReaderModal sop={selectedSOP} onClose={() => setSelectedSOP(null)} />
      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </div>
  );
}

export default App;
