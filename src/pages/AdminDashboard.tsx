
import React, { useState, useEffect } from 'react';
import { Bell, Settings, User, Search, LogOut, AlertTriangle, RotateCcw } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import { LoginForm } from '@/components/LoginForm';
import { AdminSidebar } from '@/components/AdminSidebar';
import { LazyComponents } from '@/components/LazyComponents';
<<<<<<< Updated upstream
import { DownloadExecutableButton } from '@/components/DownloadExecutableButton';
import { FloatingChat } from '@/components/FloatingChat';
=======
import { SyncStatusButton } from '@/components/SyncStatusButton';
>>>>>>> Stashed changes
import { useAuth } from '@/hooks/useAuth';

const AdminDashboard = () => {
  const { isAuthenticated, appUser, signOut, loading, error, retry, user } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState<string>('');
  const [patientToOpenConsultation, setPatientToOpenConsultation] = useState<{ patientId: string; consultationId?: string } | null>(null);

  // Show timeout message after 6 seconds of loading
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 6000);

      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [loading]);

  const handleLogout = async () => {
    try {
      await signOut();
      setActiveSection('overview');
      setShowUserManagement(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleRetry = () => {
    setLoadingTimeout(false);
    retry();
  };

  // Show loading state
  if (loading && !loadingTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bege-principal"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show timeout message
  if (loading && loadingTimeout) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Carregamento Demorado
          </h2>
          <p className="text-gray-600 mb-6">
            Não foi possível carregar seus dados de acesso. Isso pode ser devido a uma conexão lenta ou problemas temporários.
          </p>
          <div className="space-y-3">
            <Button onClick={handleRetry} className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
            <Button variant="outline" onClick={handleLogout} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Erro de Acesso
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            {user && (
              <Button onClick={handleRetry} className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const getSectionTitle = (section: string) => {
    const titles = {
      overview: 'Visão Geral',
      agendamentos: 'Agendamentos',
      pacientes: 'Pacientes',
      exames: 'Exames',
      estoque: 'Estoque',
      financeiro: 'Financeiro',
      email: 'Email'
    };
    return titles[section as keyof typeof titles] || 'Painel';
  };

  const getRoleName = (role: string) => {
    const roles = {
      admin: 'Administrador',
      doctor: 'Médico',
      secretary: 'Secretária'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const renderContent = () => {
    try {
      if (showUserManagement) {
        return <LazyComponents.UserManagement />;
      }

      switch (activeSection) {
        case 'overview':
          return <LazyComponents.DashboardOverview onSectionChange={setActiveSection} />;
        case 'agendamentos':
          return <LazyComponents.AgendamentosSection 
            onSectionChange={setActiveSection}
            onOpenPatientConsultation={(patientName) => {
              // Não navegar mais para consultas - funcionalidade integrada em Pacientes
              setActiveSection('pacientes');
            }}
            onOpenConsultationForPatient={(patientId, consultationId) => {
              setPatientToOpenConsultation({ patientId, consultationId });
              setActiveSection('pacientes');
            }}
          />;
        case 'pacientes':
          return <LazyComponents.PacientesSection 
            patientToOpenConsultation={patientToOpenConsultation}
            onConsultationOpened={() => setPatientToOpenConsultation(null)}
          />;
        case 'exames':
          return <LazyComponents.ExamesSection />;
        case 'estoque':
          return <LazyComponents.EstoqueSection />;
        case 'financeiro':
          return <LazyComponents.FinanceiroSection />;
        case 'email':
          return <LazyComponents.EmailSection />;
        default:
          return <LazyComponents.DashboardOverview onSectionChange={setActiveSection} />;
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <div className="p-4 text-center">
          <p className="text-red-600 mb-4">Erro ao carregar seção</p>
          <Button onClick={() => setActiveSection('overview')}>
            Voltar ao Início
          </Button>
        </div>
      );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <main className="flex-1 flex flex-col relative">
          {/* Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-40">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      className="cursor-pointer"
                      onClick={() => {
                        setActiveSection('overview');
                        setShowUserManagement(false);
                      }}
                    >
                      Admin
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {(activeSection !== 'overview' || showUserManagement) && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>
                          {showUserManagement ? 'Gerenciar Usuários' : getSectionTitle(activeSection)}
                        </BreadcrumbPage>
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
              <SyncStatusButton />
              <button className="p-2 text-gray-600 hover:text-cinza-escuro relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-2 text-gray-600 hover:text-cinza-escuro">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowUserManagement(!showUserManagement)}>
                    <User className="h-4 w-4 mr-2" />
                    Gerenciar Usuários
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-bege-principal flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-cinza-escuro capitalize">{appUser?.username}</span>
                  <span className="text-xs text-gray-500">
                    {getRoleName(appUser?.role || '')}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-auto relative">
            {/* Background circlebg no canto inferior direito - ampliada 1.68x (reduzida 20%) */}
            <div className="fixed bottom-0 right-0 w-[300px] h-[300px] pointer-events-none z-0 overflow-visible">
              <img
                src="/uploads/circlebg.png"
                alt="Background"
                className="w-full h-full object-contain"
                style={{
                  transform: 'scale(1.68)',
                  transformOrigin: 'bottom right'
                }}
              />
            </div>
            <div className="relative z-10">
              {renderContent()}
            </div>
          </div>
        </main>
        
        {/* Chat flutuante para comunicação interna */}
        {isAuthenticated && appUser && (
          <FloatingChat currentUsername={appUser.username} />
        )}
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
