// Componente de Agendamentos - Última atualização: 2025-10-20
import React, { useState } from 'react';
import { ChevronRight, Columns, PanelLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppointmentForm } from './AppointmentForm';
import { PatientDetailsModal } from './PatientDetailsModal';
import { toast } from 'sonner';

interface AgendamentosSectionProps {
  onSectionChange?: (section: string) => void;
}

export function AgendamentosSection({ onSectionChange }: AgendamentosSectionProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('double');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);

  const timeSlotsMatheus = [
    { 
      time: '09:00', 
      name: 'Ana Silva', 
      status: 'Confirmado',
      cpf: '123.456.789-00',
      phone: '(66) 99999-1234',
      email: 'ana.silva@email.com',
      address: 'Rua das Flores, 123 - Centro',
      birthDate: '15/05/1985',
      observations: 'Paciente com histórico de miopia'
    },
    { 
      time: '10:00', 
      name: 'Bruno Costa', 
      status: 'Confirmado',
      cpf: '234.567.890-11',
      phone: '(66) 99888-5678',
      email: 'bruno.costa@email.com',
      address: 'Av. Principal, 456 - Jardim',
      birthDate: '20/08/1990',
      observations: 'Retorno pós-cirurgia de catarata'
    },
    { 
      time: '11:30', 
      name: 'Carla Dias', 
      status: 'Pendente',
      cpf: '345.678.901-22',
      phone: '(66) 99777-9012',
      email: 'carla.dias@email.com',
      birthDate: '10/03/1978'
    },
    { 
      time: '14:00', 
      name: 'Daniel Rocha', 
      status: 'Confirmado',
      cpf: '456.789.012-33',
      phone: '(66) 99666-3456',
      birthDate: '25/11/1992'
    },
    { 
      time: '15:00', 
      name: 'Elisa Ferreira', 
      status: 'Cancelado',
      cpf: '567.890.123-44',
      phone: '(66) 99555-7890',
      birthDate: '08/07/1988'
    },
  ];

  const timeSlotsFabiola = [
    { 
      time: '09:30', 
      name: 'Fernanda Gomes', 
      status: 'Confirmado',
      cpf: '678.901.234-55',
      phone: '(66) 99444-2345',
      email: 'fernanda.gomes@email.com',
      birthDate: '12/09/1982'
    },
    { 
      time: '10:30', 
      name: 'Gustavo Lima', 
      status: 'Pendente',
      cpf: '789.012.345-66',
      phone: '(66) 99333-6789',
      birthDate: '30/01/1995'
    },
    { 
      time: '13:00', 
      name: 'Helena Souza', 
      status: 'Confirmado',
      cpf: '890.123.456-77',
      phone: '(66) 99222-0123',
      email: 'helena.souza@email.com',
      birthDate: '18/06/1987',
      observations: 'Primeira consulta - avaliação geral'
    },
    { 
      time: '14:30', 
      name: 'Igor Pereira', 
      status: 'Confirmado',
      cpf: '901.234.567-88',
      phone: '(66) 99111-4567',
      birthDate: '05/12/1993'
    },
  ];

  const handlePatientClick = (patient: any) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleOpenConsultation = () => {
    setShowPatientDetails(false);
    if (onSectionChange) {
      onSectionChange('consultas');
      toast.success(`Abrindo consulta de ${selectedPatient?.name}`);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const calendarDays = generateCalendarDays(selectedDate);
  const monthName = selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const goToPreviousMonth = () => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-cinza-escuro">Agendamentos</h2>
        <Button
          onClick={() => setViewMode(viewMode === 'single' ? 'double' : 'single')}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {viewMode === 'single' ? <Columns className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          {viewMode === 'single' ? 'Ver Duas Listas' : 'Ver Uma Lista'}
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[500px] flex flex-col lg:flex-row gap-6">
        {/* Coluna do Calendário */}
        <div className="w-full lg:w-1/3 flex flex-col p-4 border border-gray-200 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <Button onClick={goToPreviousMonth} variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5 rotate-180" />
            </Button>
            <h3 className="text-lg font-semibold text-cinza-escuro capitalize">{monthName}</h3>
            <Button onClick={goToNextMonth} variant="ghost" size="icon">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-2">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                onClick={() => day && setSelectedDate(day)}
                className={`p-2 rounded-full text-sm
                  ${day ? 'hover:bg-gray-100' : 'cursor-default'}
                  ${day && day.toDateString() === new Date().toDateString() ? 'bg-bege-principal text-white' : ''}
                  ${day && selectedDate.toDateString() === day.toDateString() && day.toDateString() !== new Date().toDateString() ? 'bg-marrom-acentuado text-white' : ''}
                  ${day && day.getMonth() !== selectedDate.getMonth() ? 'text-gray-400' : 'text-cinza-escuro'}
                `}
                disabled={!day}
              >
                {day ? day.getDate() : ''}
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-gray-600 font-semibold">
            Agendamentos para: {formatDate(selectedDate)}
          </p>
          
          {/* Novo botão para criar agendamento */}
          <Button 
            onClick={() => setShowAppointmentForm(true)}
            className="mt-4 bg-bege-principal hover:bg-marrom-acentuado"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Agendamento
          </Button>
        </div>

        {/* Colunas de Agendamento */}
        <div className={`w-full ${viewMode === 'double' ? 'lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6' : 'lg:w-2/3'}`}>
          {/* Lista de Agendamentos Dr. Matheus */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-cinza-escuro mb-4">Dr. Matheus</h3>
            <ScrollArea className="h-[350px]">
              {timeSlotsMatheus.length > 0 ? (
                timeSlotsMatheus.map((slot, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => handlePatientClick(slot)}
                    className="flex justify-between items-center p-3 mb-2 bg-white rounded-md shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{slot.time}</p>
                      <p className="text-sm text-gray-600 hover:text-medical-primary transition-colors">{slot.name}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${slot.status === 'Confirmado' ? 'bg-green-100 text-green-800' :
                        slot.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {slot.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center mt-8">Nenhum agendamento para este dia.</p>
              )}
            </ScrollArea>
          </div>

          {/* Lista de Agendamentos Dra. Fabíola (visível apenas em modo 'double') */}
          {viewMode === 'double' && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-cinza-escuro mb-4">Dra. Fabíola</h3>
              <ScrollArea className="h-[350px]">
                {timeSlotsFabiola.length > 0 ? (
                  timeSlotsFabiola.map((slot, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handlePatientClick(slot)}
                      className="flex justify-between items-center p-3 mb-2 bg-white rounded-md shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{slot.time}</p>
                        <p className="text-sm text-gray-600 hover:text-medical-primary transition-colors">{slot.name}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${slot.status === 'Confirmado' ? 'bg-green-100 text-green-800' :
                          slot.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                        {slot.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center mt-8">Nenhum agendamento para este dia.</p>
                )}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      <AppointmentForm 
        isOpen={showAppointmentForm}
        onClose={() => setShowAppointmentForm(false)}
        selectedDate={selectedDate}
      />

      {selectedPatient && (
        <PatientDetailsModal
          isOpen={showPatientDetails}
          onClose={() => {
            setShowPatientDetails(false);
            setSelectedPatient(null);
          }}
          patient={selectedPatient}
          onOpenConsultation={handleOpenConsultation}
        />
      )}
    </div>
  );
}
