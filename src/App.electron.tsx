import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import { offlineStorage } from "@/utils/offlineStorage";
import { syncService } from "@/utils/syncService";

const queryClient = new QueryClient();

// Componente para inicializar serviços offline
const OfflineInitializer = () => {
  useEffect(() => {
    // Inicializar storage offline
    offlineStorage.init().catch(console.error);
    
    // Verificar conexão e sincronizar se necessário
    syncService.checkConnection().then(isOnline => {
      if (isOnline) {
        syncService.sync();
      }
    });
  }, []);
  
  return null;
};

// Versão standalone para Electron - apenas Admin Dashboard
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <OfflineInitializer />
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
