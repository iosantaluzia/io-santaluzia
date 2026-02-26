
import React, { useState, useEffect } from 'react';
import { Bell, Settings, User, LogOut, AlertTriangle, RotateCcw } from 'lucide-react';
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
import { FloatingChat } from '@/components/FloatingChat';
import { GlobalSearch } from '@/components/GlobalSearch';
import { AvatarPicker } from '@/components/AvatarPicker';
import { useAuth } from '@/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { isAuthenticated, appUser, signOut, loading, error, retry, user } = useAuth();
  const [activeSection, setActiveSection] = useState('agendamentos');
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [patientToOpenConsultation, setPatientToOpenConsultation] = useState<{ patientId: string; consultationId?: string } | null>(null);
  const [patientIdToOpen, setPatientIdToOpen] = useState<string | null>(null);
  const [patientIdToOpenRecord, setPatientIdToOpenRecord] = useState<string | null>(null);
  const [initialSectionSet, setInitialSectionSet] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const isAdmin = appUser?.role === 'admin' || appUser?.username?.toLowerCase() === 'matheus';

  // Definir seção inicial quando appUser for carregado pela primeira vez
  useEffect(() => {
    if (appUser && isAuthenticated && !initialSectionSet) {
      const role = appUser.role;
      const username = appUser.username?.toLowerCase();

      // Médicos (incluindo Matheus) e secretaria abrem em agendamentos
      if (role === 'doctor' || role === 'secretary' || username === 'matheus') {
        setActiveSection('agendamentos');
      } else {
        setActiveSection('overview');
      }
      setInitialSectionSet(true);
    }
  }, [appUser, isAuthenticated, initialSectionSet]);

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
      // Limpar estados locais primeiro
      setActiveSection('overview');

      // Fazer logout do Supabase
      await signOut();

      // Aguardar um pouco mais para garantir que o logout seja completamente processado
      // e que o estado seja atualizado
      await new Promise(resolve => setTimeout(resolve, 500));

      // Forçar reload completo da página para garantir que tudo seja limpo
      // Usar replace para não deixar histórico e forçar reload completo
      // Adicionar timestamp para evitar cache
      window.location.replace(`/adminio?logout=${Date.now()}`);
    } catch (error) {
      // Mesmo em caso de erro, forçar redirecionamento
      window.location.replace(`/adminio?logout=${Date.now()}`);
    }
  };

  const handleRetry = () => {
    setLoadingTimeout(false);
    retry();
  };

  const handleUpdateAvatar = async (url: string) => {
    if (!appUser) return;

    try {
      const { error } = await supabase
        .from('app_users')
        .update({ avatar_url: url })
        .eq('id', appUser.id);

      if (error) throw error;

      toast.success('Avatar atualizado com sucesso!');
      setShowAvatarPicker(false);
      // Recarregar dados do usuário no hook useAuth
      retry();
    } catch (err) {
      console.error('Erro ao atualizar avatar:', err);
      toast.error('Erro ao salvar avatar no servidor.');
    }
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
      documentos: 'Documentos',
      estoque: 'Estoque',
      financeiro: 'Financeiro',
      email: 'Email',
      fornecedores: 'Fornecedores',
      usuarios: isAdmin ? 'Gerenciar Usuários' : 'Minha Conta'
    };
    return titles[section as keyof typeof titles] || 'Painel';
  };

  const getRoleName = (role: string) => {
    if (appUser?.username?.toLowerCase() === 'matheus') return 'Médico';
    const roles = {
      admin: 'Médico',
      doctor: 'Médico',
      secretary: 'Secretária',
      financeiro: 'Financeiro'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const renderContent = () => {
    try {
      switch (activeSection) {
        case 'usuarios':
          return <LazyComponents.UserManagement />;
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
            onOpenPatientRecord={(patientId) => {
              setPatientIdToOpenRecord(patientId);
              setActiveSection('pacientes');
            }}
          />;
        case 'pacientes':
          return <LazyComponents.PacientesSection
            patientToOpenConsultation={patientToOpenConsultation}
            patientIdToOpen={patientIdToOpen}
            patientIdToOpenRecord={patientIdToOpenRecord}
            onConsultationOpened={() => {
              setPatientToOpenConsultation(null);
              setPatientIdToOpen(null);
              setPatientIdToOpenRecord(null);
            }}
            onPatientOpened={() => {
              setPatientIdToOpen(null);
              setPatientIdToOpenRecord(null);
            }}
            onSectionChange={setActiveSection}
          />;
        case 'exames':
          return <LazyComponents.ExamesSection />;
        case 'documentos':
          return <LazyComponents.DocumentsSection />;
        case 'estoque':
          return <LazyComponents.EstoqueSection />;
        case 'financeiro':
          return <LazyComponents.FinanceiroSection />;
        case 'email':
          return <LazyComponents.EmailSection />;
        case 'fornecedores':
          return <LazyComponents.SuppliersSection />;
        default:
          return <LazyComponents.DashboardOverview onSectionChange={setActiveSection} />;
      }
    } catch (error) {
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
          <header className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center px-2 sm:px-4 sticky top-0 z-40 gap-2">
            {/* Esquerda: SidebarTrigger + Breadcrumb */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <SidebarTrigger />
              <Breadcrumb className="hidden sm:block">
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
                        <BreadcrumbPage>
                          {getSectionTitle(activeSection)}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
              {/* Mobile: apenas nome da seção */}
              <span className="sm:hidden text-sm font-medium text-cinza-escuro">
                {getSectionTitle(activeSection)}
              </span>
            </div>

            {/* Central: Busca Global */}
            <div className="flex-1 flex justify-center px-1 sm:px-4">
              <div className="w-full max-w-2xl">
                <GlobalSearch
                  onSectionChange={(section) => {
                    setActiveSection(section);
                    if (section !== 'pacientes') {
                      setPatientIdToOpen(null);
                      setPatientToOpenConsultation(null);
                    }
                  }}
                  onResultClick={(result) => {
                    if (result.type === 'patient') {
                      setPatientIdToOpenRecord(result.id);
                      setActiveSection('pacientes');
                    } else if (result.type === 'exam') {
                      const examData = result.data;
                      const patientId = examData?.patient_id || examData?.patients?.id;
                      if (patientId) {
                        setPatientIdToOpen(patientId);
                        setActiveSection('pacientes');
                      } else {
                        setActiveSection('exames');
                      }
                    } else if (result.type === 'stock') {
                      setActiveSection('estoque');
                    }
                  }}
                />
              </div>
            </div>

            {/* Direita: Notificações + Usuário */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="p-2 text-gray-600 hover:text-cinza-escuro relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none">
                    <div className="h-9 w-9 rounded-xl border-2 border-bege-principal/20 bg-white shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={appUser?.avatar_url || `https://api.dicebear.com/9.x/micah/svg?seed=${appUser?.username}&backgroundColor=b6e3f4`}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Nome e role só em telas maiores */}
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-sm font-medium text-cinza-escuro capitalize">{appUser?.username}</span>
                      <span className="text-xs text-gray-500">{getRoleName(appUser?.role || '')}</span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setShowAvatarPicker(true)}>
                    <User className="h-4 w-4 mr-2" />
                    Escolher Avatar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveSection('usuarios')}>
                    <Settings className="h-4 w-4 mr-2" />
                    {isAdmin ? 'Gerenciar Usuários' : 'Minha Conta'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
          <FloatingChat currentUsername={appUser.username?.toLowerCase() || null} />
        )}

        {/* Modal do Avatar Picker */}
        <Dialog open={showAvatarPicker} onOpenChange={setShowAvatarPicker}>
          <DialogContent
            className="sm:max-w-2xl p-0 overflow-hidden border-none bg-transparent shadow-none"
            aria-describedby={undefined}
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              <DialogHeader className="p-6 bg-gradient-to-r from-bege-principal/10 to-transparent">
                <DialogTitle className="text-2xl font-bold text-cinza-escuro">Personalize seu Avatar</DialogTitle>
              </DialogHeader>
              <AvatarPicker
                currentAvatarUrl={appUser?.avatar_url}
                onAvatarSelect={handleUpdateAvatar}
              />
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </SidebarProvider >
  );
};

export default AdminDashboard;
