
import React, { lazy, Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

const LazyDashboardOverview = lazy(() => import('./DashboardOverview').then(module => ({ default: module.DashboardOverview })));
const LazyAgendamentosSection = lazy(() => import('./AgendamentosSection').then(module => ({ default: module.AgendamentosSection })));
const LazyPacientesSection = lazy(() => import('./PacientesSection').then(module => ({ default: module.PacientesSection })));
const LazyConsultasSection = lazy(() => import('./ConsultasSection').then(module => ({ default: module.ConsultasSection })));
const LazyExamesSection = lazy(() => import('./ExamesSection').then(module => ({ default: module.ExamesSection })));
const LazyEstoqueSection = lazy(() => import('./EstoqueSection').then(module => ({ default: module.EstoqueSection })));
const LazyFinanceiroSection = lazy(() => import('./FinanceiroSection').then(module => ({ default: module.FinanceiroSection })));
const LazyUserManagement = lazy(() => import('./UserManagement').then(module => ({ default: module.UserManagement })));

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
  </div>
);

interface LazyWrapperProps {
  children: React.ReactNode;
  sectionName: string;
}

const LazyWrapper = ({ children, sectionName }: LazyWrapperProps) => (
  <ErrorBoundary sectionName={sectionName}>
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export const LazyComponents = {
  DashboardOverview: (props: any) => (
    <LazyWrapper sectionName="Visão Geral">
      <LazyDashboardOverview {...props} />
    </LazyWrapper>
  ),
  AgendamentosSection: () => (
    <LazyWrapper sectionName="Agendamentos">
      <LazyAgendamentosSection />
    </LazyWrapper>
  ),
  PacientesSection: () => (
    <LazyWrapper sectionName="Pacientes">
      <LazyPacientesSection />
    </LazyWrapper>
  ),
  ConsultasSection: () => (
    <LazyWrapper sectionName="Consultas">
      <LazyConsultasSection />
    </LazyWrapper>
  ),
  ExamesSection: () => (
    <LazyWrapper sectionName="Exames">
      <LazyExamesSection />
    </LazyWrapper>
  ),
  EstoqueSection: () => (
    <LazyWrapper sectionName="Estoque">
      <LazyEstoqueSection />
    </LazyWrapper>
  ),
  FinanceiroSection: () => (
    <LazyWrapper sectionName="Financeiro">
      <LazyFinanceiroSection />
    </LazyWrapper>
  ),
  UserManagement: () => (
    <LazyWrapper sectionName="Gerenciar Usuários">
      <LazyUserManagement />
    </LazyWrapper>
  )
};
