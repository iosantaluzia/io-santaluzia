// Componente de Agendamentos - Última atualização: 2025-10-20
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, Columns, PanelLeft, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AppointmentForm } from './AppointmentForm';
import { PatientDetailsModal } from './PatientDetailsModal';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useRealtimeAppointments } from '@/hooks/useRealtimeAppointments';

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
    'pending': 'Aguardando',
    'in_progress': 'Em atendimento',
    'in_attendance': 'Em atendimento',
    'completed': 'Realizado',
    'confirmed': 'Confirmado',
    'cancelled': 'Cancelado',
    'rescheduled': 'Remarcado',
    'agendado': 'Agendado',
    'aguardando_pagamento': 'Aguardando',
    'aguardando': 'Aguardando',
    'em_atendimento': 'Em atendimento',
    'realizado': 'Realizado',
    'cancelado': 'Cancelado',
    'remarcado': 'Remarcado',
    'Confirmado': 'Confirmado',
    'Pendente': 'Aguardando'
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
  if (statusLower === 'rescheduled' || statusLower === 'remarcado') {
    return 'bg-blue-100 text-blue-800';
  }
  return 'bg-gray-100 text-gray-800';
};

export function AgendamentosSection({ onSectionChange, onOpenPatientConsultation, onOpenConsultationForPatient }: AgendamentosSectionProps) {
  const { appUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Médicos veem automaticamente apenas sua própria agenda
  const getInitialViewMode = (): 'all' | 'matheus' | 'fabiola' => {
    if (appUser?.role === 'doctor') {
      const username = appUser.username?.toLowerCase();
      if (username === 'matheus') return 'matheus';
      if (username === 'fabiola') return 'fabiola';
    }
    return 'all';
  };
  
  const [viewMode, setViewMode] = useState<'all' | 'matheus' | 'fabiola'>(getInitialViewMode());
  
  // Atualizar viewMode quando appUser mudar
  useEffect(() => {
    if (appUser?.role === 'doctor') {
      const username = appUser.username?.toLowerCase();
      if (username === 'matheus') {
        setViewMode('matheus');
      } else if (username === 'fabiola') {
        setViewMode('fabiola');
      }
    } else {
      setViewMode('all');
    }
  }, [appUser]);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [timeSlotsMatheus, setTimeSlotsMatheus] = useState<AppointmentSlot[]>([]);
  const [timeSlotsFabiola, setTimeSlotsFabiola] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [openStatusPopover, setOpenStatusPopover] = useState<string | null>(null);
  const [monthAppointments, setMonthAppointments] = useState<{ [dateKey: string]: { hasMatheus: boolean; hasFabiola: boolean } }>({});
  const [initialPatientData, setInitialPatientData] = useState<{
    name?: string;
    cpf?: string;
    date_of_birth?: string;
    phone?: string;
    email?: string;
    address?: string;
    cep?: string;
    city?: string;
  } | undefined>(undefined);
  const [initialAppointmentType, setInitialAppointmentType] = useState<string | undefined>(undefined);

  // Refs para controle de scroll automático
  const matheusScrollRef = useRef<HTMLDivElement>(null);
  const fabiolaScrollRef = useRef<HTMLDivElement>(null);

  // Função para encontrar o horário mais próximo ao atual
  const findClosestAppointmentIndex = useCallback((timeSlots: AppointmentSlot[]): number => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // minutos desde meia-noite

    let closestIndex = 0;
    let smallestDiff = Infinity;

    timeSlots.forEach((slot, index) => {
      const [hours, minutes] = slot.time.split(':').map(Number);
      const slotTime = hours * 60 + minutes;
      const diff = Math.abs(currentTime - slotTime);

      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestIndex = index;
      }
    });

    return closestIndex;
  }, []);

  // Função para fazer scroll automático para o horário mais próximo
  const scrollToClosestAppointment = useCallback((scrollRef: React.RefObject<HTMLDivElement>, timeSlots: AppointmentSlot[]) => {
    if (!scrollRef.current || timeSlots.length === 0) return;

    const closestIndex = findClosestAppointmentIndex(timeSlots);

    // Aguardar um pouco para garantir que o DOM esteja renderizado
    setTimeout(() => {
      if (scrollRef.current) {
        const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          // Cada item tem aproximadamente 80px de altura (incluindo margem)
          const itemHeight = 80;
          const scrollTop = closestIndex * itemHeight;

          scrollContainer.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        }
      }
    }, 100);
  }, [findClosestAppointmentIndex]);

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
      // Médicos veem apenas suas próprias consultas (RLS já filtra, mas adicionamos filtro adicional no frontend)
      let query = supabase
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
        .lte('consultation_date', endOfDay.toISOString());
      
      // Filtrar por médico se for médico
      if (appUser?.role === 'doctor') {
        const username = appUser.username?.toLowerCase();
        if (username === 'matheus') {
          query = query.or('doctor_name.ilike.%matheus%');
        } else if (username === 'fabiola') {
          query = query.or('doctor_name.ilike.%fabiola%,doctor_name.ilike.%fabíola%');
        }
      }
      
      const { data: consultations, error } = await query.order('consultation_date', { ascending: true });

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

  // Buscar agendamentos do mês inteiro para marcar o calendário
  const fetchMonthAppointments = useCallback(async (date: Date) => {
    try {
      const year = date.getFullYear();
      const month = date.getMonth();
      const startOfMonth = new Date(year, month, 1);
      startOfMonth.setHours(0, 0, 0, 0);
      const endOfMonth = new Date(year, month + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);

      // Buscar agendamentos do mês - médicos veem apenas os seus
      let query = supabase
        .from('consultations')
        .select('consultation_date, doctor_name')
        .gte('consultation_date', startOfMonth.toISOString())
        .lte('consultation_date', endOfMonth.toISOString());
      
      // Filtrar por médico se for médico
      if (appUser?.role === 'doctor') {
        const username = appUser.username?.toLowerCase();
        if (username === 'matheus') {
          query = query.or('doctor_name.ilike.%matheus%');
        } else if (username === 'fabiola') {
          query = query.or('doctor_name.ilike.%fabiola%,doctor_name.ilike.%fabíola%');
        }
      }
      
      const { data: consultations, error } = await query.order('consultation_date', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendamentos do mês:', error);
        return;
      }

      // Agrupar por data
      const appointmentsByDate: { [dateKey: string]: { hasMatheus: boolean; hasFabiola: boolean } } = {};

      if (consultations) {
        consultations.forEach((consultation: any) => {
          const consultationDate = new Date(consultation.consultation_date);
          // Usar a mesma lógica de formatação de data para garantir consistência com o timezone local
          const year = consultationDate.getFullYear();
          const month = String(consultationDate.getMonth() + 1).padStart(2, '0');
          const day = String(consultationDate.getDate()).padStart(2, '0');
          const dateKey = `${year}-${month}-${day}`;
          
          if (!appointmentsByDate[dateKey]) {
            appointmentsByDate[dateKey] = { hasMatheus: false, hasFabiola: false };
          }

          const doctorName = consultation.doctor_name?.toLowerCase() || '';
          if (doctorName.includes('matheus')) {
            appointmentsByDate[dateKey].hasMatheus = true;
          } else if (doctorName.includes('fabiola') || doctorName.includes('fabíola')) {
            appointmentsByDate[dateKey].hasFabiola = true;
          }
        });
      }

      setMonthAppointments(appointmentsByDate);
    } catch (error) {
      console.error('Erro ao buscar agendamentos do mês:', error);
    }
  }, []);

  // Buscar agendamentos do mês quando o mês mudar
  useEffect(() => {
    const monthYear = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}`;
    fetchMonthAppointments(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate.getFullYear(), selectedDate.getMonth(), fetchMonthAppointments]);

  // Estado para controlar recarregamento automático
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [refetchType, setRefetchType] = useState<'INSERT' | 'UPDATE' | 'DELETE' | null>(null);

  // Callback para quando houver mudanças em tempo real nos agendamentos
  const handleRealtimeAppointmentChange = useCallback((change: { type: 'INSERT' | 'UPDATE' | 'DELETE'; data: any }) => {
    console.log('🔄 Mudança detectada em agendamento:', change);

    // Definir flag para recarregar dados
    setShouldRefetch(true);
    setRefetchType(change.type);
  }, []);

  // Effect para recarregar dados quando shouldRefetch for true
  useEffect(() => {
    if (shouldRefetch) {
      console.log('🔄 Recarregando dados após mudança realtime...');

      // Recarregar dados automaticamente quando houver qualquer mudança
      fetchAppointments(selectedDate);

      // Também recarregar dados do mês para atualizar o calendário
      fetchMonthAppointments(selectedDate);

      // Mostrar toast de confirmação
      if (refetchType === 'UPDATE') {
        toast.success('Agendamento atualizado automaticamente');
      } else if (refetchType === 'INSERT') {
        toast.success('Novo agendamento adicionado automaticamente');
      }

      // Resetar flags
      setShouldRefetch(false);
      setRefetchType(null);
    }
  }, [shouldRefetch, refetchType, selectedDate, fetchAppointments, fetchMonthAppointments]);

  // Effect para fazer scroll automático quando os dados são carregados
  useEffect(() => {
    if (!loading && selectedDate.toDateString() === new Date().toDateString()) {
      // Só fazer scroll automático se for o dia atual
      if (timeSlotsMatheus.length > 0) {
        scrollToClosestAppointment(matheusScrollRef, timeSlotsMatheus);
      }
      if (timeSlotsFabiola.length > 0) {
        scrollToClosestAppointment(fabiolaScrollRef, timeSlotsFabiola);
      }
    }
  }, [loading, timeSlotsMatheus, timeSlotsFabiola, selectedDate, scrollToClosestAppointment]);

  // Configurar realtime para monitorar mudanças nos agendamentos
  useRealtimeAppointments(handleRealtimeAppointmentChange);

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

  // Função para atualizar o status de uma consulta
  const handleUpdateStatus = async (consultationId: string, newStatus: string) => {
    try {
      // Mapear status em português para valores do banco
      const statusMap: { [key: string]: string } = {
        'Aguardando': 'pending',
        'Cancelado': 'cancelled',
        'Remarcado': 'scheduled', // Remarcado volta para agendado
        'Realizado': 'completed'
      };

      const dbStatus = statusMap[newStatus] || newStatus.toLowerCase();

      const { error } = await supabase
        .from('consultations')
        .update({ status: dbStatus })
        .eq('id', consultationId);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast.error('Erro ao atualizar status da consulta');
        return;
      }

      toast.success(`Status alterado para "${newStatus}"`);
      setOpenStatusPopover(null);
      
      // Recarregar agendamentos do dia e do mês
      await fetchAppointments(selectedDate);
      await fetchMonthAppointments(selectedDate);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status da consulta');
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
    
   // Verificar primeiro nos dados do mês carregados do banco
    // Usar a mesma lógica de formatação de data para garantir consistência com o timezone local
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    if (monthAppointments[dateKey]) {
      return {
        hasMatheus: monthAppointments[dateKey].hasMatheus,
        hasFabiola: monthAppointments[dateKey].hasFabiola,
        hasAny: monthAppointments[dateKey].hasMatheus || monthAppointments[dateKey].hasFabiola
      };
    }
    
    // Verificar nos dados carregados do banco (para a data selecionada)
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
    const appointments = defaultAppointmentsByDate[dateKey];
    if (appointments) {
      return {
        hasMatheus: false, // Dr. Matheus não usa dados fake
        hasFabiola: (appointments.fabiola?.length > 0) || false,
        hasAny: (appointments.fabiola?.length > 0) || false
      };
    }
    
    return { hasMatheus: false, hasFabiola: false, hasAny: false };
  }, [selectedDate, timeSlotsMatheus, timeSlotsFabiola, monthAppointments]);

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
        {/* Médicos não podem alternar entre agendas - veem apenas a sua */}
        {appUser?.role !== 'doctor' && (
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
        )}
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
                    ${isToday ? 'bg-marrom-acentuado text-white font-semibold' : ''}
                    ${isSelected ? 'bg-medical-primary text-white font-semibold' : ''}
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
                  {shouldShowDot(day) && (isSelected || isToday) && (
                    <span className="absolute bottom-1 w-1.5 h-1.5 bg-white rounded-full"></span>
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
              size="sm"
              className="h-6 text-xs bg-medical-primary hover:bg-marrom-acentuado text-white hover:text-white"
            >
              Hoje
            </Button>
          </div>
          
          {/* Novo botão para criar agendamento */}
          <Button 
            onClick={() => setShowAppointmentForm(true)}
            className="mt-4 bg-medical-primary hover:bg-marrom-acentuado"
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
              <ScrollArea ref={matheusScrollRef} className="h-[350px]">
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
                      {slot.consultationId ? (
                        <Popover open={openStatusPopover === slot.consultationId} onOpenChange={(open) => setOpenStatusPopover(open ? slot.consultationId! : null)}>
                          <PopoverTrigger asChild>
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1 transition-all duration-200 hover:scale-105 ${getStatusColor(slot.status)} group`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenStatusPopover(openStatusPopover === slot.consultationId ? null : slot.consultationId!);
                              }}
                            >
                              <span className="transition-all duration-200">{translateStatus(slot.status)}</span>
                              <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </span>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2" onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-2">
                              <button
                                onClick={() => handleUpdateStatus(slot.consultationId!, 'Aguardando')}
                                className="w-full flex items-center justify-center hover:scale-105 transition-transform duration-150"
                              >
                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor('pending')}`}>
                                  Aguardando
                                </span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(slot.consultationId!, 'Cancelado')}
                                className="w-full flex items-center justify-center hover:scale-105 transition-transform duration-150"
                              >
                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor('cancelled')}`}>
                                  Cancelado
                                </span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(slot.consultationId!, 'Remarcado')}
                                className="w-full flex items-center justify-center hover:scale-105 transition-transform duration-150"
                              >
                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor('scheduled')}`}>
                                  Remarcado
                                </span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(slot.consultationId!, 'Realizado')}
                                className="w-full flex items-center justify-center hover:scale-105 transition-transform duration-150"
                              >
                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor('completed')}`}>
                                  Realizado
                                </span>
                              </button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(slot.status)}`}>
                          {translateStatus(slot.status)}
                        </span>
                      )}
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
              <ScrollArea ref={fabiolaScrollRef} className="h-[350px]">
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
                      {slot.consultationId ? (
                        <Popover open={openStatusPopover === slot.consultationId} onOpenChange={(open) => setOpenStatusPopover(open ? slot.consultationId! : null)}>
                          <PopoverTrigger asChild>
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer flex items-center gap-1 transition-all duration-200 hover:scale-105 ${getStatusColor(slot.status)} group`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenStatusPopover(openStatusPopover === slot.consultationId ? null : slot.consultationId!);
                              }}
                            >
                              <span className="transition-all duration-200">{translateStatus(slot.status)}</span>
                              <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </span>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2" onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-2">
                              <button
                                onClick={() => handleUpdateStatus(slot.consultationId!, 'Aguardando')}
                                className="w-full flex items-center justify-center hover:scale-105 transition-transform duration-150"
                              >
                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor('pending')}`}>
                                  Aguardando
                                </span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(slot.consultationId!, 'Cancelado')}
                                className="w-full flex items-center justify-center hover:scale-105 transition-transform duration-150"
                              >
                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor('cancelled')}`}>
                                  Cancelado
                                </span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(slot.consultationId!, 'Remarcado')}
                                className="w-full flex items-center justify-center hover:scale-105 transition-transform duration-150"
                              >
                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor('scheduled')}`}>
                                  Remarcado
                                </span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(slot.consultationId!, 'Realizado')}
                                className="w-full flex items-center justify-center hover:scale-105 transition-transform duration-150"
                              >
                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor('completed')}`}>
                                  Realizado
                                </span>
                              </button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(slot.status)}`}>
                          {translateStatus(slot.status)}
                        </span>
                      )}
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
        onClose={() => {
          setShowAppointmentForm(false);
          setInitialPatientData(undefined);
          setInitialAppointmentType(undefined);
        }}
        selectedDate={selectedDate}
        initialPatientData={initialPatientData}
        initialAppointmentType={initialAppointmentType}
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
          onScheduleReturn={(patientData) => {
            // Fechar modal de detalhes
            setShowPatientDetails(false);
            setSelectedPatient(null);
            
            // Definir dados iniciais do paciente e tipo de agendamento
            setInitialPatientData(patientData);
            setInitialAppointmentType('retorno');
            
            // Abrir formulário de agendamento
            setShowAppointmentForm(true);
          }}
        />
      )}
    </div>
  );
}
