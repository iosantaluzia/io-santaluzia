
import React, { useState } from 'react';
import { Bell, Settings, User, Search } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { AdminSidebar } from '@/components/AdminSidebar';
import { DashboardOverview } from '@/components/DashboardOverview';
import { AgendamentosSection } from '@/components/AgendamentosSection';
import { PacientesSection } from '@/components/PacientesSection';
import { ExamesSection } from '@/components/ExamesSection';
import { EstoqueSection } from '@/components/EstoqueSection';
import { FinanceiroSection } from '@/components/FinanceiroSection';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const getSectionTitle = (section: string) => {
    const titles = {
      overview: 'Visão Geral',
      agendamentos: 'Agendamentos',
      pacientes: 'Pacientes',
      exames: 'Exames',
      estoque: 'Estoque',
      financeiro: 'Financeiro'
    };
    return titles[section as keyof typeof titles] || 'Painel';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview onSectionChange={setActiveSection} />;
      case 'agendamentos':
        return <AgendamentosSection />;
      case 'pacientes':
        return <PacientesSection />;
      case 'exames':
        return <ExamesSection />;
      case 'estoque':
        return <EstoqueSection />;
      case 'financeiro':
        return <FinanceiroSection />;
      default:
        return <DashboardOverview onSectionChange={setActiveSection} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-40">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      className="cursor-pointer"
                      onClick={() => setActiveSection('overview')}
                    >
                      Admin
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {activeSection !== 'overview' && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{getSectionTitle(activeSection)}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="search"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-bege-principal focus:border-bege-principal"
                />
              </div>
              <button className="p-2 text-gray-600 hover:text-cinza-escuro relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </button>
              <button className="p-2 text-gray-600 hover:text-cinza-escuro">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-bege-principal flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-cinza-escuro">Admin</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
