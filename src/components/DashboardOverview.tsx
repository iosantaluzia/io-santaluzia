
import React, { useState } from 'react';
import {
  Plus,
  ClipboardPen,
  Tag,
  Clock
} from 'lucide-react';
import { WaitlistModal } from './WaitlistModal';
import { UsefulCodesModal } from './UsefulCodesModal';
import { AppointmentForm } from './AppointmentForm';
import { PersonalNotes } from './PersonalNotes';
import { useAuth } from '@/hooks/useAuth';
import { User } from 'lucide-react';

interface DashboardOverviewProps {
  onSectionChange: (section: string) => void;
}

export function DashboardOverview({ onSectionChange }: DashboardOverviewProps) {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showUsefulCodes, setShowUsefulCodes] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const { appUser } = useAuth();


  return (
    <div className="flex flex-col gap-8 pb-8 pt-8">
      {/* Layout em duas colunas: Esquerda (conteúdo) e Direita (cards) */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Coluna Esquerda: Título, Pesquisa e Botões */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Seção Superior: Título, Status e Informações */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-12 w-12 rounded-xl border-2 border-bege-principal/20 bg-white shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={appUser?.avatar_url || `https://api.dicebear.com/9.x/micah/svg?seed=${appUser?.username}&backgroundColor=b6e3f4`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-cinza-escuro">Olá, {appUser?.display_name || appUser?.username || 'Usuário'}</h1>
                  <div className="flex items-center text-xs font-semibold text-cinza-escuro/60 uppercase tracking-wider">
                    <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse mr-1"></span>Sistema Online
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start mb-4">
                <div className="items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-bege-principal text-white shadow">
                  Gestão Integrada
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-xl font-bold text-cinza-escuro">Instituto Santa Luzia</span>
                </div>
              </div>
            </div>

            {/* Botões de Ação Rápida */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-center lg:justify-start gap-2">
                <button
                  onClick={() => setShowWaitlist(true)}
                  className="bg-marrom-acentuado hover:bg-marrom-acentuado/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 min-w-[160px] justify-center lg:justify-start"
                >
                  <Clock className="h-4 w-4" />
                  Lista de Espera
                </button>
                <button
                  onClick={() => setShowUsefulCodes(true)}
                  className="bg-medical-primary hover:bg-medical-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 min-w-[160px] justify-center lg:justify-start"
                >
                  <Tag className="h-4 w-4" />
                  Códigos Úteis
                </button>
              </div>
              <div className="flex justify-center lg:justify-start gap-2">
                <button
                  onClick={() => setShowAppointmentForm(true)}
                  className="bg-bege-principal hover:bg-bege-principal/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 min-w-[160px] justify-center lg:justify-start"
                >
                  <Plus className="h-4 w-4" />
                  Novo Agendamento
                </button>
                {(appUser?.role === 'doctor' || appUser?.role === 'financeiro' || appUser?.role === 'admin') && (
                  <button
                    onClick={() => onSectionChange('financeiro')}
                    className="bg-cinza-escuro/80 hover:bg-cinza-escuro text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 min-w-[160px] justify-center lg:justify-start"
                  >
                    <ClipboardPen className="h-4 w-4" />
                    Relatórios
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Notas Personalizadas */}
          <div className="lg:col-span-2">
            <PersonalNotes />
          </div>
        </div>
      </div>

      <WaitlistModal
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
        onScheduleComplete={() => {
          // Recarregar dados se necessário
        }}
      />

      <UsefulCodesModal
        isOpen={showUsefulCodes}
        onClose={() => setShowUsefulCodes(false)}
      />

      <AppointmentForm
        isOpen={showAppointmentForm}
        onClose={() => {
          setShowAppointmentForm(false);
          // Opcional: mudar para a seção de agendamentos após criar
          // onSectionChange('agendamentos');
        }}
        selectedDate={new Date()}
      />
    </div>
  );
}
