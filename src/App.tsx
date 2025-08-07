
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Instituto from "./pages/Instituto";
import CorpoClinico from "./pages/CorpoClinico";
import Exames from "./pages/Exames";
import Catarata from "./pages/Catarata";
import CirurgiaRefrativa from "./pages/CirurgiaRefrativa";
import Ceratocone from "./pages/Ceratocone";
import Artigos from "./pages/Artigos";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/instituto" element={<Instituto />} />
          <Route path="/corpo-clinico" element={<CorpoClinico />} />
          <Route path="/exames" element={<Exames />} />
          <Route path="/catarata" element={<Catarata />} />
          <Route path="/cirurgia-refrativa" element={<CirurgiaRefrativa />} />
          <Route path="/ceratocone" element={<Ceratocone />} />
          <Route path="/artigos" element={<Artigos />} />
          <Route path="/admin-dashboard-santa-luzia" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
