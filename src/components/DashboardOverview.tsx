
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

interface DashboardOverviewProps {
  onSectionChange: (section: string) => void;
}

export function DashboardOverview({ onSectionChange }: DashboardOverviewProps) {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showUsefulCodes, setShowUsefulCodes] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);


  return (
    <div className="flex flex-col gap-8 pb-8 pt-8">
      {/* Layout em duas colunas: Esquerda (conteúdo) e Direita (cards) */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Coluna Esquerda: Título, Pesquisa e Botões */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Botões de Ação Rápida - Topo */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowAppointmentForm(true)}
                className="bg-gradient-to-b from-white to-gray-50 text-cinza-escuro h-8 relative inline-flex items-center px-3 py-1.5 group text-sm font-medium leading-5 rounded-md shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bege-principal/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Plus className="size-3.5 mr-1.5" /> Novo Agendamento
              </button>
              <button
                onClick={() => onSectionChange('financeiro')}
                className="text-cinza-escuro hover:text-bege-principal flex items-center h-8 px-3 py-1.5 text-sm font-medium"
              >
                <ClipboardPen className="size-3.5 mr-1.5" /> Relatórios
              </button>
            </div>

            {/* Seção Superior: Título, Status e Informações */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-5xl font-black text-cinza-escuro">Painel Clínico</h1>
                <div className="items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-cinza-escuro border border-bege-principal/10 hidden md:flex">
                  <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse mr-1"></span>Online
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

              <p className="text-gray-600 text-sm md:text-base max-w-2xl">
                Seu centro de comando para uma gestão eficiente e focada no paciente.
              </p>
            </div>

            {/* Lista de Espera e Códigos Úteis */}
            <div className="flex justify-center lg:justify-start gap-2">
              <button
                onClick={() => setShowWaitlist(true)}
                className="bg-marrom-acentuado hover:bg-marrom-acentuado/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Lista de Espera
              </button>
              <button
                onClick={() => setShowUsefulCodes(true)}
                className="bg-medical-primary hover:bg-medical-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Tag className="h-4 w-4" />
                Códigos Úteis
              </button>
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
