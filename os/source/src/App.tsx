import React, { useState } from "react";
import { Page, Product, SOPItem } from "./types";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AIConcierge } from "./components/AIConcierge";
import { AidenOrchestratorModal } from "./components/aiden/AidenOrchestratorModal";

// OCG LAB OS Operating Workspaces
import { CommandPage } from "./pages/CommandPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { OperationsPage } from "./pages/OperationsPage";
import { QAReleasesPage } from "./pages/QAReleasesPage";
import { EngineeringPage } from "./pages/EngineeringPage";
import { StorefrontsPage } from "./pages/StorefrontsPage";
import { KnowledgePage } from "./pages/KnowledgePage";

// Public & Storefront Pages (Preserved)
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
  TermsModal 
} from "./components/Modals";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export function App() {
  const [activePage, setActivePage] = useState<Page>("command");
  const [isAidenOpen, setIsAidenOpen] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  
  // Modals state
  const [selectedSOP, setSelectedSOP] = useState<SOPItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const handleOpenWaitlist = () => setIsWaitlistOpen(true);
  const handleOpenLogin = () => setIsLoginOpen(true);
  const handleOpenCheckout = () => setIsCheckoutOpen(true);

  return (
    <div className="min-h-screen w-full min-w-0 max-w-full overflow-x-clip flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 bg-ambient-grid relative">
      
      <Toaster 
        position="top-right" 
        theme="dark" 
        richColors 
        toastOptions={{
          style: {
            background: "#090d16",
            border: "1px solid #1e293b",
            color: "#f8fafc",
            borderRadius: "12px",
            fontSize: "12px",
          }
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

      <main className="flex-grow w-full min-w-0 max-w-full overflow-x-clip">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            className="w-full min-w-0 max-w-full overflow-x-clip"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {/* OCG LAB OS Workspaces */}
            {activePage === "command" && (
              <CommandPage 
                onNavigate={setActivePage} 
                onOpenAiden={() => setIsAidenOpen(true)} 
              />
            )}
            {activePage === "portfolio" && <PortfolioPage />}
            {activePage === "projects" && <ProjectsPage />}
            {(activePage === "operations" || activePage === "agents") && <OperationsPage />}
            {(activePage === "qa" || activePage === "releases") && <QAReleasesPage />}
            {activePage === "engineering" && <EngineeringPage />}
            {activePage === "storefronts" && <StorefrontsPage />}
            {(activePage === "knowledge" || activePage === "rd") && <KnowledgePage />}

            {/* Public Storefront & Client Pages */}
            {activePage === "home" && (
              <HomePage
                setActivePage={setActivePage}
                onOpenWaitlist={handleOpenWaitlist}
              />
            )}
            {activePage === "storefront" && (
              <ProductsPage
                onNavigateToMyOCG={() => setActivePage("my-ocg")}
              />
            )}
            {activePage === "my-ocg" && (
              <MyOCGPage
                setActivePage={setActivePage}
                onOpenStorefront={() => setActivePage("storefront")}
              />
            )}
            {activePage === "admin" && <AdminCatalogPage />}
            {activePage === "about" && <AboutPage />}
            {activePage === "resources" && (
              <ResourcesPage onOpenSOPReader={setSelectedSOP} />
            )}
            {activePage === "pricing" && (
              <PricingPage onOpenWaitlist={handleOpenWaitlist} />
            )}
            {activePage === "contact" && <ContactPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer
        setActivePage={setActivePage}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* Aiden Technology Orchestrator Modal */}
      <AidenOrchestratorModal
        isOpen={isAidenOpen}
        onClose={() => setIsAidenOpen(false)}
        onNavigate={setActivePage}
      />

      {/* Storefront AI Concierge (Public Storefront mode only) */}
      {!["command", "portfolio", "projects", "operations", "qa", "engineering", "storefronts", "knowledge", "agents", "releases"].includes(activePage) && (
        <AIConcierge 
          activePage={activePage} 
          onOpenWaitlist={handleOpenWaitlist}
          onNavigateToStorefront={() => setActivePage("storefront")}
        />
      )}

      {/* Modals & Dialogs */}
      <CartCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onNavigateToMyOCG={() => setActivePage("my-ocg")}
      />

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      <SOPReaderModal
        sop={selectedSOP}
        onClose={() => setSelectedSOP(null)}
      />

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

    </div>
  );
}

export default App;
