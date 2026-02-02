
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppWrapper from "@/components/AppWrapper";
import Home from "./pages/Home";
import Instituto from "./pages/Instituto";
import Historia from "./pages/Historia";
import CorpoClinico from "./pages/CorpoClinico";
import Exames from "./pages/Exames";
import Catarata from "./pages/Catarata";
import CirurgiaRefrativa from "./pages/CirurgiaRefrativa";
import Ceratocone from "./pages/Ceratocone";
import Artigos from "./pages/Artigos";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import Admin from "./pages/Admin";

import OftalmologistaSinop from "./pages/OftalmologistaSinop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/instituto" element={<Instituto />} />
            <Route path="/historia" element={<Historia />} />
            <Route path="/corpo-clinico" element={<CorpoClinico />} />
            <Route path="/exames" element={<Exames />} />
            <Route path="/catarata" element={<Catarata />} />
            <Route path="/cirurgia-refrativa" element={<CirurgiaRefrativa />} />
            <Route path="/ceratocone" element={<Ceratocone />} />
            <Route path="/artigos" element={<Artigos />} />

            <Route path="/admin" element={<Admin />} />
            <Route path="/adminio" element={<AdminDashboard />} />
            <Route path="/oftalmologista-sinop" element={<OftalmologistaSinop />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppWrapper>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
