import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import { SyncProvider } from "@/hooks/useSyncContext";
import Dashboard from "./pages/Dashboard";
import Aquariums from "./pages/Aquariums";
import AquariumDetail from "./pages/AquariumDetail";
import Journal from "./pages/Journal";
import Events from "./pages/Events";
import Inventory from "./pages/Inventory";
import Lexicon from "./pages/Lexicon";
import Tools from "./pages/Tools";
import FertilizerCalculator from "./pages/FertilizerCalculator";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <SyncProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/aquariums" element={<Aquariums />} />
              <Route path="/aquariums/:id" element={<AquariumDetail />} />
              <Route path="/aquariums/:id/journal" element={<Journal />} />
              <Route path="/events" element={<Events />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/lexicon" element={<Lexicon />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/tools/fertilizer-calculator" element={<FertilizerCalculator />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </SyncProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
