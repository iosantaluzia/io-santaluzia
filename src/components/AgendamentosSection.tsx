// Componente de Agendamentos - Última atualização: 2025-10-20
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Columns, PanelLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppointmentForm } from './AppointmentForm';
import { PatientDetailsModal } from './PatientDetailsModal';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AgendamentosSectionProps {
  onSectionChange?: (section: string) => void;
  onOpenPatientConsultation?: (patientName: string) => void;
  onOpenConsultationForPatient?: (patientId: string, consultationId?: string) => void;
}

interface AppointmentSlot {
  time: string;
  name: string;
  status: string;
  cpf?: string;
  phone?: string;
  email?: string;
  address?: string;
  birthDate?: string;
  observations?: string;
  patientId?: string;
  appointmentDate?: string;
  appointmentType?: string;
  consultationId?: string;
}

const appointmentTypeLabels: { [key: string]: string } = {
  'consulta': 'Consulta',
  'retorno': 'Retorno',
  'exame': 'Exame',
  'pagamento_honorarios': 'Pagamento de Honorários'
};

// Função para traduzir status para português
const translateStatus = (status: string | null | undefined): string => {
  if (!status) return 'Agendado';
  
  const statusMap: { [key: string]: string } = {
    'scheduled': 'Agendado',
    'pending': 'Aguardando Pagamento',
    'in_progress': 'Em atendimento',
    'in_attendance': 'Em atendimento',
    'completed': 'Realizado',
    'confirmed': 'Confirmado',
    'cancelled': 'Cancelado',
    'agendado': 'Agendado',
    'aguardando_pagamento': 'Aguardando Pagamento',
    'em_atendimento': 'Em atendimento',
    'realizado': 'Realizado',
    'Confirmado': 'Confirmado',
    'Pendente': 'Aguardando Pagamento'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

// Função para obter cor do status
const getStatusColor = (status: string | null | undefined): string => {
  if (!status) return 'bg-blue-100 text-blue-800';
  
  const statusLower = status.toLowerCase();
  if (statusLower === 'scheduled' || statusLower === 'agendado' || statusLower === 'confirmado') {
    return 'bg-blue-100 text-blue-800';
  }
  if (statusLower === 'pending' || statusLower === 'aguardando_pagamento' || statusLower === 'aguardando pagamento' || statusLower === 'pendente') {
    return 'bg-yellow-100 text-yellow-800';
  }
  if (statusLower === 'in_progress' || statusLower === 'in_attendance' || statusLower === 'em_atendimento' || statusLower === 'em atendimento') {
    return 'bg-purple-100 text-purple-800';
  }
  if (statusLower === 'completed' || statusLower === 'realizado') {
    return 'bg-green-100 text-green-800';
  }
  if (statusLower === 'confirmed' || statusLower === 'confirmado') {
    return 'bg-green-100 text-green-800';
  }
  if (statusLower === 'cancelled' || statusLower === 'cancelado') {
    return 'bg-red-100 text-red-800';
  }
  return 'bg-gray-100 text-gray-800';
};

export function AgendamentosSection({ onSectionChange, onOpenPatientConsultation, onOpenConsultationForPatient }: AgendamentosSectionProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'all' | 'matheus' | 'fabiola'>('all');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [timeSlotsMatheus, setTimeSlotsMatheus] = useState<AppointmentSlot[]>([]);
  const [timeSlotsFabiola, setTimeSlotsFabiola] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Dados estáticos de fallback (usados quando não há dados no banco)
  // NOTA: Dados fake removidos para Dr. Matheus - apenas dados reais serão exibidos
  const defaultAppointmentsByDate: { [key: string]: { matheus: AppointmentSlot[], fabiola: AppointmentSlot[] } } = {
    // Exemplo: agendamentos para hoje (apenas Dra. Fabíola)
    [new Date().toISOString().split('T')[0]]: {
      matheus: [], // Sem dados fake para Dr. Matheus
      fabiola: [
        { 
          time: '09:30', 
          name: 'Fernanda Gomes', 
          status: 'Confirmado',
          cpf: '678.901.234-55',
          phone: '(66) 99444-2345',
          email: 'fernanda.gomes@email.com',
          birthDate: '12/09/1982',
          appointmentType: 'consulta'
        },
        { 
          time: '10:30', 
          name: 'Gustavo Lima', 
          status: 'Pendente',
          cpf: '789.012.345-66',
          phone: '(66) 99333-6789',
          birthDate: '30/01/1995',
          appointmentType: 'exame'
        },
        { 
          time: '13:00', 
          name: 'Helena Souza', 
          status: 'Confirmado',
          cpf: '890.123.456-77',
          phone: '(66) 99222-0123',
          email: 'helena.souza@email.com',
          birthDate: '18/06/1987',
          observations: 'Primeira consulta - avaliação geral',
          appointmentType: 'consulta'
        },
        { 
          time: '14:30', 
          name: 'Igor Pereira', 
          status: 'Confirmado',
          cpf: '901.234.567-88',
          phone: '(66) 99111-4567',
          birthDate: '05/12/1993',
          appointmentType: 'retorno'
        },
      ]
    }
  };

  // Adicionar mais dados fake para outras datas (apenas Dra. Fabíola)
  const addFakeAppointments = () => {
    const today = new Date();
    const dates: { [key: string]: { matheus: AppointmentSlot[], fabiola: AppointmentSlot[] } } = {};
    
    // Adicionar agendamentos para os próximos 7 dias (apenas Dra. Fabíola)
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      
      dates[dateKey] = {
        matheus: [], // Sem dados fake para Dr. Matheus
        fabiola: i % 3 === 0 ? [
          { 
            time: '10:00', 
            name: `Paciente ${i}C`, 
            status: 'Confirmado',
            cpf: `333.444.555-${String(i).padStart(2, '0')}`,
            phone: `(66) 97777-${String(i).padStart(4, '0')}`,
            birthDate: '01/01/1990',
            appointmentType: 'exame'
          }
        ] : []
      };
    }
    
    // Adicionar alguns agendamentos para datas passadas também (apenas Dra. Fabíola)
    for (let i = 1; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      dates[dateKey] = {
        matheus: [], // Sem dados fake para Dr. Matheus
        fabiola: []
      };
    }
    
    return dates;
  };

  const fakeAppointments = addFakeAppointments();
  Object.assign(defaultAppointmentsByDate, fakeAppointments);

  // Função para usar dados estáticos de fallback (apenas Dra. Fabíola)
  const useFallbackData = useCallback((date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    const fallbackData = defaultAppointmentsByDate[dateKey] || { matheus: [], fabiola: [] };
    
    // Dr. Matheus: sempre usar apenas dados reais do banco (sem fallback)
    setTimeSlotsMatheus([]);
    // Dra. Fabíola: usar dados fake se disponíveis
    setTimeSlotsFabiola(fallbackData.fabiola || []);
  }, []);

  // Função para buscar agendamentos do banco de dados
  const fetchAppointments = useCallback(async (date: Date) => {
    try {
      setLoading(true);
      
      // Formatar data para buscar (início e fim do dia)
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      console.log('Buscando agendamentos para:', date.toLocaleDateString('pt-BR'));

      // Buscar consultas/agendamentos do banco de dados
      // Adicionar timestamp para evitar cache
      const { data: consultations, error } = await supabase
        .from('consultations')
        .select(`
          *,
          patients (
            id,
            name,
            cpf,
            phone,
            email,
            address,
            date_of_birth
          )
        `)
        .gte('consultation_date', startOfDay.toISOString())
        .lte('consultation_date', endOfDay.toISOString())
        .order('consultation_date', { ascending: true });

      console.log('Consultas encontradas:', consultations?.length || 0);
      if (consultations && consultations.length > 0) {
        console.log('IDs das consultas encontradas:', consultations.map(c => c.id));
      }

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        // Em caso de erro: Dr. Matheus sem dados, Dra. Fabíola pode usar fallback
        setTimeSlotsMatheus([]);
        useFallbackData(date);
        return;
      }

      if (!consultations || consultations.length === 0) {
        // Se não houver dados no banco: limpar tudo
        console.log('Nenhuma consulta encontrada, limpando slots');
        setTimeSlotsMatheus([]);
        setTimeSlotsFabiola([]);
        // Não usar fallback após remoção - apenas limpar
        setLoading(false);
        return;
      }

      // Processar dados do banco
      const matheusSlots: AppointmentSlot[] = [];
      const fabiolaSlots: AppointmentSlot[] = [];

      consultations.forEach((consultation: any) => {
        const consultationDate = new Date(consultation.consultation_date);
        const time = consultationDate.toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });

        const patient = consultation.patients;
        const slot: AppointmentSlot = {
          time,
          name: patient?.name || 'Paciente',
          status: consultation.status || 'scheduled',
          cpf: patient?.cpf || '',
          phone: patient?.phone || '',
          email: patient?.email || '',
          address: patient?.address || '',
          birthDate: patient?.date_of_birth 
            ? new Date(patient.date_of_birth).toLocaleDateString('pt-BR')
            : '',
          observations: consultation.observations || '',
          patientId: consultation.patient_id,
          appointmentDate: consultation.consultation_date,
          appointmentType: consultation.appointment_type || 'consulta',
          consultationId: consultation.id
        };

        // Filtrar por médico
        const doctorName = consultation.doctor_name?.toLowerCase() || '';
        if (doctorName.includes('matheus')) {
          matheusSlots.push(slot);
        } else if (doctorName.includes('fabiola') || doctorName.includes('fabíola')) {
          fabiolaSlots.push(slot);
        }
      });

      // Ordenar por horário
      matheusSlots.sort((a, b) => a.time.localeCompare(b.time));
      fabiolaSlots.sort((a, b) => a.time.localeCompare(b.time));

      console.log('Slots Matheus:', matheusSlots.length, 'Slots Fabiola:', fabiolaSlots.length);

      // Limpar estados primeiro para garantir atualização
      setTimeSlotsMatheus([]);
      setTimeSlotsFabiola([]);
      
      // Aguardar um tick para garantir que o estado foi limpo
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Atualizar com novos dados
      setTimeSlotsMatheus(matheusSlots);
      setTimeSlotsFabiola(fabiolaSlots);

    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      // Em caso de erro: Dr. Matheus sem dados, Dra. Fabíola pode usar fallback
      setTimeSlotsMatheus([]);
      useFallbackData(date);
    } finally {
      setLoading(false);
    }
  }, [useFallbackData]);

  // Buscar agendamentos quando a data selecionada mudar
  useEffect(() => {
    // Limpar dados anteriores imediatamente ao mudar a data
    setTimeSlotsMatheus([]);
    setTimeSlotsFabiola([]);
    setLoading(true);
    // Buscar novos agendamentos
    fetchAppointments(selectedDate);
  }, [selectedDate, fetchAppointments]);

  const handlePatientClick = (patient: any) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleOpenConsultation = () => {
    setShowPatientDetails(false);
    if (onOpenPatientConsultation && selectedPatient) {
      onOpenPatientConsultation(selectedPatient.name);
      toast.success(`Abrindo prontuário de ${selectedPatient.name}`);
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

  // Função para verificar quais médicos têm agendamentos em uma data
  const getAppointmentsInfo = useCallback((date: Date | null): { hasMatheus: boolean; hasFabiola: boolean; hasAny: boolean } => {
    if (!date) return { hasMatheus: false, hasFabiola: false, hasAny: false };
    
    // Verificar primeiro nos dados carregados do banco (para a data selecionada)
    const dateStr = date.toDateString();
    const selectedDateStr = selectedDate.toDateString();
    if (dateStr === selectedDateStr) {
      return {
        hasMatheus: timeSlotsMatheus.length > 0, // Apenas dados reais do banco
        hasFabiola: timeSlotsFabiola.length > 0,
        hasAny: (timeSlotsMatheus.length > 0) || (timeSlotsFabiola.length > 0)
      };
    }
    
    // Verificar nos dados estáticos (apenas Dra. Fabíola)
    const dateKey = date.toISOString().split('T')[0];
    const appointments = defaultAppointmentsByDate[dateKey];
    if (appointments) {
      return {
        hasMatheus: false, // Dr. Matheus não usa dados fake
        hasFabiola: (appointments.fabiola?.length > 0) || false,
        hasAny: (appointments.fabiola?.length > 0) || false
      };
    }
    
    return { hasMatheus: false, hasFabiola: false, hasAny: false };
  }, [selectedDate, timeSlotsMatheus, timeSlotsFabiola]);

  // Função para verificar se uma data tem consultas e retornar a cor (sempre vermelho quando há consultas)
  const getCalendarColor = (date: Date | null): string => {
    if (!date) return '';
    const apptsInfo = getAppointmentsInfo(date);
    
    // No modo "all", mostrar vermelho para qualquer consulta
    if (viewMode === 'all') {
      if (apptsInfo.hasAny) {
        return 'text-red-600 font-semibold';
      }
      return '';
    }
    
    // No modo "matheus", mostrar apenas consultas do Matheus
    if (viewMode === 'matheus') {
      if (apptsInfo.hasMatheus) {
        return 'text-red-600 font-semibold';
      }
      return '';
    }
    
    // No modo "fabiola", mostrar apenas consultas da Fabiola
    if (viewMode === 'fabiola') {
      if (apptsInfo.hasFabiola) {
        return 'text-red-600 font-semibold';
      }
      return '';
    }
    
    return '';
  };

  // Função para verificar se deve mostrar o ponto marrom
  const shouldShowDot = (date: Date | null): boolean => {
    if (!date) return false;
    const apptsInfo = getAppointmentsInfo(date);
    
    // No modo "all", mostrar ponto para qualquer consulta
    if (viewMode === 'all') {
      return apptsInfo.hasAny;
    }
    
    // No modo "matheus", mostrar apenas consultas do Matheus
    if (viewMode === 'matheus') {
      return apptsInfo.hasMatheus;
    }
    
    // No modo "fabiola", mostrar apenas consultas da Fabiola
    if (viewMode === 'fabiola') {
      return apptsInfo.hasFabiola;
    }
    
    return false;
  };

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
          onClick={() => {
            if (viewMode === 'all') {
              setViewMode('matheus');
            } else if (viewMode === 'matheus') {
              setViewMode('fabiola');
            } else {
              setViewMode('all');
            }
          }}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {viewMode === 'all' && <Columns className="h-4 w-4" />}
          {viewMode === 'matheus' && <PanelLeft className="h-4 w-4" />}
          {viewMode === 'fabiola' && <PanelLeft className="h-4 w-4" />}
          {viewMode === 'all' && 'Todas as Agendas'}
          {viewMode === 'matheus' && 'Agenda Matheus'}
          {viewMode === 'fabiola' && 'Agenda Fabiola'}
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
            {calendarDays.map((day, index) => {
              const isToday = day && day.toDateString() === new Date().toDateString();
              const isSelected = day && selectedDate.toDateString() === day.toDateString() && !isToday;
              const apptsInfo = getAppointmentsInfo(day);
              const isOtherMonth = day && day.getMonth() !== selectedDate.getMonth();
              const calendarColor = getCalendarColor(day);
              
              // Determinar a cor do texto baseada nos agendamentos (exceto quando é hoje ou selecionado)
              let textColor = '';
              if (!isToday && !isSelected) {
                if (isOtherMonth) {
                  textColor = 'text-gray-400';
                } else if (calendarColor) {
                  textColor = calendarColor;
                } else {
                  textColor = 'text-cinza-escuro';
                }
              }
              
              return (
                <button
                  key={index}
                  onClick={() => day && setSelectedDate(day)}
                  className={`p-2 rounded-full text-sm relative flex flex-col items-center justify-center
                    ${day ? 'hover:bg-gray-100' : 'cursor-default'}
                    ${isToday ? 'bg-bege-principal text-white font-semibold' : ''}
                    ${isSelected ? 'bg-marrom-acentuado text-white font-semibold' : ''}
                    ${textColor}
                  `}
                  disabled={!day}
                  title={
                    apptsInfo.hasAny 
                      ? `Agendamentos: ${apptsInfo.hasMatheus ? 'Dr. Matheus' : ''}${apptsInfo.hasMatheus && apptsInfo.hasFabiola ? ' e ' : ''}${apptsInfo.hasFabiola ? 'Dra. Fabíola' : ''}`
                      : 'Sem agendamentos'
                  }
                >
                  {day ? day.getDate() : ''}
                  {shouldShowDot(day) && !isToday && !isSelected && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 bg-marrom-acentuado rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-start gap-3">
            <p className="text-left text-gray-600 font-semibold">
              Agendamentos para: {formatDate(selectedDate)}
            </p>
            <Button 
              onClick={() => setSelectedDate(new Date())}
              variant="ghost" 
              size="sm"
              className="h-6 text-xs text-gray-600 hover:text-bege-principal border border-black bg-transparent hover:bg-transparent"
            >
              Hoje
            </Button>
          </div>
          
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
        <div className={`w-full ${viewMode === 'all' ? 'lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6' : 'lg:w-2/3'}`}>
          {/* Lista de Agendamentos Dr. Matheus */}
          {(viewMode === 'all' || viewMode === 'matheus') && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-cinza-escuro">Dr. Matheus</h3>
                <img
                  src="/uploads/drmatheus.png"
                  alt="Dr. Matheus"
                  className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-sm bg-amber-50"
                />
              </div>
              <ScrollArea className="h-[350px]">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
                  </div>
                ) : timeSlotsMatheus.length > 0 ? (
                  timeSlotsMatheus.map((slot, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handlePatientClick(slot)}
                      className="flex justify-between items-center p-3 mb-2 bg-white rounded-md shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{slot.time}</p>
                        <p className="text-sm text-gray-600 hover:text-medical-primary transition-colors">{slot.name}</p>
                        {slot.appointmentType && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {appointmentTypeLabels[slot.appointmentType] || slot.appointmentType}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(slot.status)}`}>
                        {translateStatus(slot.status)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center mt-8">Nenhum agendamento para este dia.</p>
                )}
              </ScrollArea>
            </div>
          )}

          {/* Lista de Agendamentos Dra. Fabíola */}
          {(viewMode === 'all' || viewMode === 'fabiola') && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-cinza-escuro">Dra. Fabíola</h3>
                <img
                  src="/uploads/drafabiola.png"
                  alt="Dra. Fabíola"
                  className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-sm bg-amber-50"
                />
              </div>
              <ScrollArea className="h-[350px]">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
                  </div>
                ) : timeSlotsFabiola.length > 0 ? (
                  timeSlotsFabiola.map((slot, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handlePatientClick(slot)}
                      className="flex justify-between items-center p-3 mb-2 bg-white rounded-md shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{slot.time}</p>
                        <p className="text-sm text-gray-600 hover:text-medical-primary transition-colors">{slot.name}</p>
                        {slot.appointmentType && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {appointmentTypeLabels[slot.appointmentType] || slot.appointmentType}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(slot.status)}`}>
                        {translateStatus(slot.status)}
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
          onPatientUpdate={async () => {
            // Recarregar agendamentos quando dados do paciente forem atualizados
            console.log('onPatientUpdate chamado, recarregando agendamentos...');
            await fetchAppointments(selectedDate);
            console.log('Agendamentos recarregados');
          }}
          onSectionChange={onSectionChange}
          onOpenConsultationForPatient={onOpenConsultationForPatient}
        />
      )}
    </div>
  );
}
