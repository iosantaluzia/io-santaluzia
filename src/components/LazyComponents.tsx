
import React, { lazy, Suspense } from 'react';

const AgendamentosSectionLazy = lazy(() => import('./AgendamentosSection').then(module => ({ default: module.AgendamentosSection })));
const PacientesSectionLazy = lazy(() => import('./PacientesSection').then(module => ({ default: module.PacientesSection })));
const ExamesSectionLazy = lazy(() => import('./ExamesSection').then(module => ({ default: module.ExamesSection })));
const DocumentsSectionLazy = lazy(() => import('./DocumentsSection').then(module => ({ default: module.DocumentsSection })));
const EstoqueSectionLazy = lazy(() => import('./EstoqueSection').then(module => ({ default: module.EstoqueSection })));
const FinanceiroSectionLazy = lazy(() => import('./FinanceiroSection').then(module => ({ default: module.FinanceiroSection })));
const DashboardOverviewLazy = lazy(() => import('./DashboardOverview').then(module => ({ default: module.DashboardOverview })));
const UserManagementLazy = lazy(() => import('./UserManagement').then(module => ({ default: module.UserManagement })));
const EmailSectionLazy = lazy(() => import('./EmailSection').then(module => ({ default: module.EmailSection })));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bege-principal"></div>
    <span className="ml-2 text-gray-600">Carregando...</span>
  </div>
);

const ErrorFallback = ({ error, retry }: { error: Error; retry?: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <p className="text-red-600 mb-4">Erro ao carregar seção</p>
    <p className="text-sm text-gray-500 mb-4">{error.message}</p>
    {retry && (
      <button 
        onClick={retry}
        className="px-4 py-2 bg-bege-principal text-white rounded hover:bg-marrom-acentuado"
      >
        Tentar Novamente
      </button>
    )}
  </div>
);

export const LazyComponents = {
  AgendamentosSection: ({ 
    onSectionChange, 
    onOpenPatientConsultation,
    onOpenConsultationForPatient
  }: { 
    onSectionChange?: (section: string) => void;
    onOpenPatientConsultation?: (patientName: string) => void;
    onOpenConsultationForPatient?: (patientId: string, consultationId?: string) => void;
  }) => (
    <Suspense fallback={<LoadingSpinner />}>
      <AgendamentosSectionLazy 
        onSectionChange={onSectionChange}
        onOpenPatientConsultation={onOpenPatientConsultation}
        onOpenConsultationForPatient={onOpenConsultationForPatient}
      />
    </Suspense>
  ),
  
  PacientesSection: ({
    patientToOpenConsultation,
    onConsultationOpened,
    onSectionChange
  }: {
    patientToOpenConsultation?: { patientId: string; consultationId?: string } | null;
    onConsultationOpened?: () => void;
    onSectionChange?: (section: string) => void;
  }) => (
    <Suspense fallback={<LoadingSpinner />}>
      <PacientesSectionLazy
        patientToOpenConsultation={patientToOpenConsultation}
        onConsultationOpened={onConsultationOpened}
        onSectionChange={onSectionChange}
      />
    </Suspense>
  ),
  
  ExamesSection: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <ExamesSectionLazy />
    </Suspense>
  ),
  
  DocumentsSection: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <DocumentsSectionLazy />
    </Suspense>
  ),
  
  EstoqueSection: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <EstoqueSectionLazy />
    </Suspense>
  ),
  
  FinanceiroSection: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <FinanceiroSectionLazy />
    </Suspense>
  ),
  
  DashboardOverview: ({ onSectionChange }: { onSectionChange: (section: string) => void }) => (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardOverviewLazy onSectionChange={onSectionChange} />
    </Suspense>
  ),
  
  UserManagement: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <UserManagementLazy />
    </Suspense>
  ),
  
  EmailSection: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <EmailSectionLazy />
    </Suspense>
  ),
};
