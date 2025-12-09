import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

// Versão standalone para Electron - apenas Admin Dashboard
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/adminio" element={<AdminDashboard />} />
          <Route path="*" element={<AdminDashboard />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

