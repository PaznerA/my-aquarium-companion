import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { SyncProvider } from "@/hooks/useSyncContext";
import { AppDataProvider } from "@/contexts";
import Dashboard from "./pages/Dashboard";
import Aquariums from "./pages/Aquariums";
import AquariumDetail from "./pages/AquariumDetail";
import Journal from "./pages/Journal";
import Events from "./pages/Events";
import Inventory from "./pages/Inventory";
import Lexicon from "./pages/Lexicon";
import Tools from "./pages/Tools";
import FertilizerCalculator from "./pages/FertilizerCalculator";
import DosageCalculator from "./pages/DosageCalculator";
import WaterMixCalculator from "./pages/WaterMixCalculator";
import TDSCalculator from "./pages/TDSCalculator";
import Settings from "./pages/Settings";
import WaterSources from "./pages/WaterSources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <SyncProvider>
        <AppDataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <HashRouter>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/aquariums" element={<Aquariums />} />
                <Route path="/aquariums/:id" element={<AquariumDetail />} />
                <Route path="/water-sources" element={<WaterSources />} />
                <Route path="/aquariums/:id/journal" element={<Journal />} />
                <Route path="/events" element={<Events />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/lexicon" element={<Lexicon />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/tools/fertilizer-calculator" element={<FertilizerCalculator />} />
                <Route path="/tools/dosage-calculator" element={<DosageCalculator />} />
                <Route path="/tools/water-mix" element={<WaterMixCalculator />} />
                <Route path="/tools/tds-calculator" element={<TDSCalculator />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </HashRouter>
          </TooltipProvider>
        </AppDataProvider>
      </SyncProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
