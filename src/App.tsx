import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/lib/i18n";
import Dashboard from "./pages/Dashboard";
import Aquariums from "./pages/Aquariums";
import AquariumDetail from "./pages/AquariumDetail";
import Journal from "./pages/Journal";
import Inventory from "./pages/Inventory";
import Lexicon from "./pages/Lexicon";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/aquariums" element={<Aquariums />} />
            <Route path="/aquariums/:id" element={<AquariumDetail />} />
            <Route path="/aquariums/:id/journal" element={<Journal />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/lexicon" element={<Lexicon />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
