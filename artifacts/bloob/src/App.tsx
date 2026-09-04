import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SmsWallet from "@/pages/SmsWallet";
import RoadmapPage from "@/pages/RoadmapPage";
import NetworkPage from "@/pages/NetworkPage";
import WalletOnboarding from "@/pages/WalletOnboarding";
import WalletApp from "@/pages/WalletApp";
import TokenDetail from "@/pages/TokenDetail";
import BetaPage from "@/pages/BetaPage";
import DocsPage from "@/pages/DocsPage";
import StocksPage from "@/pages/StocksPage";
import GalleryPage from "@/pages/GalleryPage";
import AnalyzerPage from "@/pages/AnalyzerPage";
import QuickStartPage from "@/pages/QuickStartPage";
import MerchantApiPage from "@/pages/MerchantApiPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import CookiePage from "@/pages/CookiePage";
import LicensesPage from "@/pages/LicensesPage";
import { WalletProvider } from "@/contexts/WalletContext";
import { useEffect } from "react";

import { useLocation } from "wouter";

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ScrollToTop />
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/stocks" component={StocksPage} />
              <Route path="/gallery" component={GalleryPage} />
              <Route path="/analyzer" component={AnalyzerPage} />
              <Route path="/sms-wallet" component={SmsWallet} />
              <Route path="/roadmap" component={RoadmapPage} />
              <Route path="/network" component={NetworkPage} />
              <Route path="/wallet" component={WalletOnboarding} />
              <Route path="/wallet/app" component={WalletApp} />
              <Route path="/wallet/token/:address" component={TokenDetail} />
              <Route path="/beta" component={BetaPage} />
              <Route path="/docs" component={DocsPage} />
              <Route path="/quickstart" component={QuickStartPage} />
              <Route path="/merchant-api" component={MerchantApiPage} />
              <Route path="/terms" component={TermsPage} />
              <Route path="/privacy" component={PrivacyPage} />
              <Route path="/cookies" component={CookiePage} />
              <Route path="/licenses" component={LicensesPage} />
              <Route component={NotFound} />
            </Switch>
          </WouterRouter>
        </WalletProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
