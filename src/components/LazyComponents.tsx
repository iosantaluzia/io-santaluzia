import React, { lazy } from 'react';
import { useLazyComponent } from '@/hooks/useLazyComponent';

const AgendamentosSectionLazy = lazy(() => import('./AgendamentosSection').then(module => ({ default: module.AgendamentosSection })));
const PacientesSectionLazy = lazy(() => import('./PacientesSection').then(module => ({ default: module.PacientesSection })));
const ConsultasSectionLazy = lazy(() => import('./ConsultasSection').then(module => ({ default: module.ConsultasSection })));
const ExamesSectionLazy = lazy(() => import('./ExamesSection').then(module => ({ default: module.ExamesSection })));
const EstoqueSectionLazy = lazy(() => import('./EstoqueSection').then(module => ({ default: module.EstoqueSection })));
const FinanceiroSectionLazy = lazy(() => import('./FinanceiroSection').then(module => ({ default: module.FinanceiroSection })));
const DashboardOverviewLazy = lazy(() => import('./DashboardOverview').then(module => ({ default: module.DashboardOverview })));
const UserManagementLazy = lazy(() => import('./UserManagement').then(module => ({ default: module.UserManagement })));

const EmailSectionLazy = lazy(() => import('./EmailSection').then(module => ({ default: module.EmailSection })));

export const LazyComponents = {
  AgendamentosSection: () => useLazyComponent(AgendamentosSectionLazy),
  PacientesSection: () => useLazyComponent(PacientesSectionLazy),
  ConsultasSection: () => useLazyComponent(ConsultasSectionLazy),
  ExamesSection: () => useLazyComponent(ExamesSectionLazy),
  EstoqueSection: () => useLazyComponent(EstoqueSectionLazy),
  FinanceiroSection: () => useLazyComponent(FinanceiroSectionLazy),
  DashboardOverview: () => useLazyComponent(DashboardOverviewLazy),
  UserManagement: () => useLazyComponent(UserManagementLazy),
  EmailSection: () => useLazyComponent(EmailSectionLazy),
};
