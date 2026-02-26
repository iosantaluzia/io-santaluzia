import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Columns, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/utils/logger';
import { useRealtimeAppointments } from '@/hooks/useRealtimeAppointments';
import { AppointmentForm } from './AppointmentForm';
import { PatientDetailsModal } from './PatientDetailsModal';
import { DoctorAgendaList } from './agendamentos/DoctorAgendaList';
import { CalendarSidePanel } from './agendamentos/CalendarSidePanel';

interface AgendamentosSectionProps {
  onSectionChange?: (section: string) => void;
  onOpenPatientConsultation?: (patientName: string) => void;
  onOpenConsultationForPatient?: (patientId: string, consultationId?: string) => void;
  onOpenPatientRecord?: (patientId: string) => void;
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

export function AgendamentosSection({ onSectionChange, onOpenPatientConsultation, onOpenConsultationForPatient, onOpenPatientRecord }: AgendamentosSectionProps) {
  const { appUser } = useAuth();
  const isAdmin = appUser?.role === 'admin' || appUser?.username?.toLowerCase() === 'matheus';
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Médicos veem automaticamente apenas sua própria agenda
  const getInitialViewMode = (): 'all' | 'matheus' | 'fabiola' => {
    const username = appUser?.username?.toLowerCase();
    if (username === 'matheus') return 'matheus';
    if (username === 'fabiola') return 'fabiola';

    if (appUser?.role === 'doctor') {
      if (username === 'matheus') return 'matheus';
      if (username === 'fabiola') return 'fabiola';
    }
    return 'all';
  };

  const [viewMode, setViewMode] = useState<'all' | 'matheus' | 'fabiola'>(getInitialViewMode());

  // Atualizar viewMode quando appUser mudar e travar se for médico
  useEffect(() => {
    const username = appUser?.username?.toLowerCase();
    if (username === 'matheus') {
      setViewMode('matheus');
    } else if (username === 'fabiola') {
      setViewMode('fabiola');
    } else if (appUser?.role === 'doctor') {
      if (username === 'matheus') {
        setViewMode('matheus');
      } else if (username === 'fabiola') {
        setViewMode('fabiola');
      }
    } else {
      setViewMode('all');
    }
  }, [appUser, setViewMode]);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [timeSlotsMatheus, setTimeSlotsMatheus] = useState<AppointmentSlot[]>([]);
  const [timeSlotsFabiola, setTimeSlotsFabiola] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [openStatusPopover, setOpenStatusPopover] = useState<string | null>(null);
  const [monthAppointments, setMonthAppointments] = useState<{ [dateKey: string]: { hasMatheus: boolean; hasFabiola: boolean; hasBlock: boolean; hasPatients: boolean } }>({});
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

  // Função para buscar agendamentos do banco de dados
  const fetchAppointments = useCallback(async (date: Date) => {
    try {
      setLoading(true);

      // Formatar data para buscar (início e fim do dia)
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

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

      if (error) {
        logger.error('Erro ao buscar agendamentos:', error);
        setTimeSlotsMatheus([]);
        setTimeSlotsFabiola([]);
        return;
      }

      if (!consultations || consultations.length === 0) {
        setTimeSlotsMatheus([]);
        setTimeSlotsFabiola([]);
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

      // Função para agrupar slots bloqueados consecutivos
      const groupBlockedSlots = (slots: AppointmentSlot[]): AppointmentSlot[] => {
        if (slots.length === 0) return [];

        const grouped: AppointmentSlot[] = [];
        let currentBlock: { slot: AppointmentSlot; endTime: string } | null = null;

        const getMinutes = (timeStr: string) => {
          const [h, m] = timeStr.split(':').map(Number);
          return h * 60 + m;
        };

        const formatTime = (minutes: number) => {
          const h = Math.floor(minutes / 60).toString().padStart(2, '0');
          const m = (minutes % 60).toString().padStart(2, '0');
          return `${h}:${m}`;
        };

        slots.forEach((slot, index) => {
          if (slot.status === 'blocked') {
            const slotStart = getMinutes(slot.time);

            if (currentBlock) {
              // Verifica se é consecutivo (30 min de diferença)
              // Considerando que slots são de 30 min por padrão na criação do bloqueio
              const prevEnd = getMinutes(currentBlock.endTime);

              if (slotStart === prevEnd) {
                // É consecutivo, estender o bloco
                currentBlock.endTime = formatTime(slotStart + 30);

                // Atualizar o texto do horário - verificando se é dia todo
                const start = getMinutes(currentBlock.slot.time.split(' - ')[0]); // Pega o início original
                const end = slotStart + 30;

                // Se cobrir o dia todo (ex: 00:00 até 23:59 ou 08:00 ate 18:00 como "dia de trabalho")
                // O usuário pediu "Dia todo" quando for o dia todo. 
                // Vamos considerar dia todo se começar <= 08:00 e terminar >= 18:00? 
                // Ou melhor, se for explicitamente 00:00 - 23:59.
                // Mas o modal de bloqueio permite "Dia todo" setando 00:00 - 23:59.
                // Vamos checar esse range.
                if (start === 0 && end >= 1439) { // 23:59
                  currentBlock.slot.time = "Dia todo";
                } else {
                  // Formato normal de intervalo
                  currentBlock.slot.time = `${formatTime(start)} - ${formatTime(end)}`;
                }
                return; // Pula a adição deste slot pois foi mesclado
              } else {
                // Não é consecutivo, finaliza o anterior e inicia novo
                grouped.push(currentBlock.slot);
                currentBlock = { slot: { ...slot, time: `${slot.time} - ${formatTime(slotStart + 30)}` }, endTime: formatTime(slotStart + 30) };
              }
            } else {
              // Início de um novo bloco
              currentBlock = { slot: { ...slot, time: `${slot.time} - ${formatTime(slotStart + 30)}` }, endTime: formatTime(slotStart + 30) };
            }
          } else {
            // Se tiver um bloco pendente, adiciona ele antes
            if (currentBlock) {
              grouped.push(currentBlock.slot);
              currentBlock = null;
            }
            grouped.push(slot); // Adiciona slot normal
          }
        });

        // Adicionar o último bloco se existir
        if (currentBlock) {
          grouped.push(currentBlock.slot);
        }

        return grouped;
      };


      // Ordenar por horário
      matheusSlots.sort((a, b) => a.time.localeCompare(b.time));
      fabiolaSlots.sort((a, b) => a.time.localeCompare(b.time));

      // Agrupar slots bloqueados
      const groupedMatheus = groupBlockedSlots(matheusSlots);
      const groupedFabiola = groupBlockedSlots(fabiolaSlots);

      // Limpar estados primeiro para garantir atualização
      setTimeSlotsMatheus([]);
      setTimeSlotsFabiola([]);

      // Aguardar um tick para garantir que o estado foi limpo
      await new Promise(resolve => setTimeout(resolve, 0));

      // Atualizar com novos dados
      setTimeSlotsMatheus(groupedMatheus);
      setTimeSlotsFabiola(groupedFabiola);

    } finally {
      setLoading(false);
    }
  }, []);

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
        .select('consultation_date, doctor_name, status')
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
        logger.error('Erro ao buscar agendamentos do mês:', error);
        return;
      }

      // Agrupar por data
      const appointmentsByDate: { [dateKey: string]: { hasMatheus: boolean; hasFabiola: boolean; hasBlock: boolean; hasPatients: boolean } } = {};

      if (consultations) {
        consultations.forEach((consultation: any) => {
          const consultationDate = new Date(consultation.consultation_date);
          // Usar a mesma lógica de formatação de data para garantir consistência com o timezone local
          const year = consultationDate.getFullYear();
          const month = String(consultationDate.getMonth() + 1).padStart(2, '0');
          const day = String(consultationDate.getDate()).padStart(2, '0');
          const dateKey = `${year}-${month}-${day}`;

          if (!appointmentsByDate[dateKey]) {
            appointmentsByDate[dateKey] = { hasMatheus: false, hasFabiola: false, hasBlock: false, hasPatients: false };
          }

          if (consultation.status === 'blocked') {
            appointmentsByDate[dateKey].hasBlock = true;
          } else {
            appointmentsByDate[dateKey].hasPatients = true;
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
      logger.error('Erro ao buscar agendamentos do mês:', error);
    }
  }, []);

  // Buscar agendamentos do mês quando o mês mudar
  useEffect(() => {
    fetchMonthAppointments(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate.getFullYear(), selectedDate.getMonth(), fetchMonthAppointments]);

  // Estado para controlar atualizações em tempo real
  const lastUpdateRef = useRef<string>('');

  // Callback otimizado para mudanças em tempo real nos agendamentos
  const handleRealtimeAppointmentChange = useCallback((change: { type: 'INSERT' | 'UPDATE' | 'DELETE'; data: any }) => {
    const updateKey = `${change.type}_${change.data.id}_${Date.now()}`;

    // Evitar processamento duplicado da mesma atualização
    if (lastUpdateRef.current === updateKey) {
      return;
    }
    lastUpdateRef.current = updateKey;

    // Verificar se a mudança é relevante para a data selecionada
    const consultationDate = new Date(change.data.consultation_date);
    const selectedDateStr = selectedDate.toDateString();
    const consultationDateStr = consultationDate.toDateString();

    if (selectedDateStr === consultationDateStr) {
      // Recarregar dados da data selecionada
      fetchAppointments(selectedDate);

      // Mostrar toast apenas para atualizações feitas por outros usuários
      if (change.type === 'UPDATE') {
        toast.success('Status do agendamento atualizado');
      } else if (change.type === 'INSERT') {
        toast.success('Novo agendamento adicionado');
      }
    } else {
      // Mesmo que não seja a data selecionada, atualizar calendário do mês
      fetchMonthAppointments(selectedDate);
    }
  }, [selectedDate, fetchAppointments, fetchMonthAppointments]);

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
        'Agendado': 'scheduled',
        'Aguardando': 'pending',
        'Cancelado': 'cancelled',
        'Remarcado': 'rescheduled',
        'Realizado': 'completed'
      };

      const dbStatus = statusMap[newStatus] || newStatus.toLowerCase();

      // Marcar que esta atualização foi feita localmente para evitar conflito com realtime
      const localUpdateKey = `LOCAL_UPDATE_${consultationId}_${Date.now()}`;
      lastUpdateRef.current = localUpdateKey;

      const { error } = await supabase
        .from('consultations')
        .update({ status: dbStatus })
        .eq('id', consultationId);

      if (error) {
        logger.error('Erro ao atualizar status:', error);
        toast.error('Erro ao atualizar status da consulta');
        return;
      }

      toast.success(`Status alterado para "${newStatus}"`);
      setOpenStatusPopover(null);

      // Recarregar dados imediatamente após atualização manual
      await fetchAppointments(selectedDate);
      await fetchMonthAppointments(selectedDate);
    } catch (error) {
      logger.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status da consulta');
    }
  };

  const handleBlockSchedule = async (date: Date, startTime: string, endTime: string, reason: string) => {
    // Wrapper para compatibilidade se necessário, mas idealmente usamos createBlock
    // Identificar o médico com base no viewMode ou usuário logado
    const doctorName = appUser?.role === 'doctor' ? appUser.username : (viewMode === 'matheus' ? 'Dr. Matheus' : (viewMode === 'fabiola' ? 'Dra. Fabíola' : ''));

    if (!doctorName || viewMode === 'all') {
      // Se não conseguir determinar o médico (ex: admin vendo tudo), não bloqueia
      // Ou poderíamos disparar um toast pedindo para selecionar uma agenda específica
      if (viewMode === 'all') {
        toast.error("Selecione uma agenda específica (Matheus ou Fabíola) para bloquear horários.");
        return;
      }
    }

    if (doctorName) {
      await createBlock(date, startTime, endTime, reason, doctorName);
    }
  };

  // Função auxiliar para obter ou criar o paciente de bloqueio
  const getOrCreateBlockPatient = async () => {
    try {
      const blockPatientName = "BLOQUEIO DE AGENDA";

      // Tentar encontrar o paciente de bloqueio
      const { data: existingPatient, error: searchError } = await supabase
        .from('patients')
        .select('id')
        .eq('name', blockPatientName)
        .maybeSingle();

      if (searchError) throw searchError;

      if (existingPatient) {
        return existingPatient.id;
      }

      // Se não existir, criar novo
      const { data: newPatient, error: createError } = await supabase
        .from('patients')
        .insert({
          name: blockPatientName,
          cpf: '000.000.000-00', // CPF fictício para passar na validação se houver
          phone: '(00) 00000-0000',
          date_of_birth: new Date().toISOString().split('T')[0]
        })
        .select('id')
        .single();

      if (createError) throw createError;

      return newPatient.id;
    } catch (error) {
      logger.error('Erro ao obter/criar paciente de bloqueio:', error);
      throw error;
    }
  };

  const createBlock = async (date: Date, startTime: string, endTime: string, reason: string, doctorName: string) => {
    try {
      // Obter ID do paciente de bloqueio para satisfazer a constraint NOT NULL
      const blockPatientId = await getOrCreateBlockPatient();

      // Converter horários para Date
      const start = new Date(date);
      const [sh, sm] = startTime.split(':').map(Number);
      start.setHours(sh, sm, 0, 0);

      const end = new Date(date);
      const [eh, em] = endTime.split(':').map(Number);
      end.setHours(eh, em, 0, 0);

      // Gerar slots de 30 min entre inicio e fim
      const slots = [];
      let current = new Date(start);

      // Se for o mesmo horário (ex: bloqueio de 1 slot), garantir que cria pelo menos um
      if (current.getTime() === end.getTime()) {
        slots.push(new Date(current));
      } else {
        while (current < end) {
          slots.push(new Date(current));
          current.setMinutes(current.getMinutes() + 30);
        }
      }

      // Se a lista estiver vazia (fim antes do início), não faz nada
      if (slots.length === 0) return;

      // Verificar conflitos antes de bloquear
      const { count: conflictCount, error: conflictError } = await supabase
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'blocked') // Ignorar outros bloqueios
        .gte('consultation_date', start.toISOString())
        .lt('consultation_date', end.toISOString())
        .ilike('doctor_name', `%${doctorName.replace('Dr. ', '').replace('Dra. ', '')}%`);

      if (conflictCount && conflictCount > 0) {
        toast.warning(`Atenção: Existem ${conflictCount} agendamentos neste período! O bloqueio criará um conflito.`);
      }

      // Inserir bloqueios no Supabase
      const { error } = await supabase
        .from('consultations')
        .insert(slots.map(slotTime => ({
          doctor_name: doctorName,
          consultation_date: slotTime.toISOString(),
          status: 'blocked',
          observations: reason,
          patient_id: blockPatientId,
          created_by: appUser?.username || 'sistema'
        })));

      if (error) throw error;

      toast.success(`Bloqueio realizado para ${date.toLocaleDateString()}`);

      // Atualizar a lista (pode ser otimizado para fazer apenas uma vez se for chamado em loop)
      // Como o ScheduleBlockModal chama 'onBlock' em loop, vamos ter múltiplas chamadas aqui.
      // O ideal seria fazer o refresh apenas no final, mas aqui não sabemos se é o último.
      // O realtime deve cuidar da atualização visual, ou podemos forçar.
      fetchAppointments(selectedDate);
      fetchMonthAppointments(selectedDate);

    } catch (error) {
      logger.error('Erro ao bloquear horário:', error);
      toast.error('Erro ao bloquear horário: ' + (error as any).message);
    }
  };

  const handleRemoveBlock = async (consultationId: string) => {
    try {
      const { error } = await supabase
        .from('consultations')
        .delete()
        .eq('id', consultationId);

      if (error) throw error;

      toast.success('Bloqueio removido');
      fetchAppointments(selectedDate);
      fetchMonthAppointments(selectedDate);
    } catch (error) {
      logger.error('Erro ao remover bloqueio:', error);
      toast.error('Erro ao remover bloqueio');
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
  const getAppointmentsInfo = useCallback((date: Date | null): { hasMatheus: boolean; hasFabiola: boolean; hasAny: boolean; hasBlock: boolean; hasPatients: boolean } => {
    if (!date) return { hasMatheus: false, hasFabiola: false, hasAny: false, hasBlock: false, hasPatients: false };

    // Verificar primeiro nos dados do mês carregados do banco
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    if (monthAppointments[dateKey]) {
      return {
        hasMatheus: monthAppointments[dateKey].hasMatheus,
        hasFabiola: monthAppointments[dateKey].hasFabiola,
        hasAny: monthAppointments[dateKey].hasMatheus || monthAppointments[dateKey].hasFabiola,
        hasBlock: !!monthAppointments[dateKey].hasBlock,
        hasPatients: !!monthAppointments[dateKey].hasPatients
      };
    }

    // Verificar nos dados carregados do banco (para a data selecionada)
    const dateStr = date.toDateString();
    const selectedDateStr = selectedDate.toDateString();
    if (dateStr === selectedDateStr) {
      return {
        hasMatheus: timeSlotsMatheus.length > 0,
        hasFabiola: timeSlotsFabiola.length > 0,
        hasAny: (timeSlotsMatheus.length > 0) || (timeSlotsFabiola.length > 0),
        hasBlock: timeSlotsMatheus.some(s => s.status === 'blocked') || timeSlotsFabiola.some(s => s.status === 'blocked'),
        hasPatients: timeSlotsMatheus.some(s => s.status !== 'blocked') || timeSlotsFabiola.some(s => s.status !== 'blocked')
      };
    }

    return { hasMatheus: false, hasFabiola: false, hasAny: false, hasBlock: false, hasPatients: false };
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
        {/* Médicos não podem alternar entre agendas - veem apenas a sua (exceto Matheus que é admin) */}
        {(appUser?.role !== 'doctor' || isAdmin) && (
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
        <CalendarSidePanel
          monthName={monthName}
          calendarDays={calendarDays}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          goToPreviousMonth={goToPreviousMonth}
          goToNextMonth={goToNextMonth}
          getAppointmentsInfo={getAppointmentsInfo}
          getCalendarColor={getCalendarColor}
          shouldShowDot={shouldShowDot}
          formatDate={formatDate}
          setShowAppointmentForm={setShowAppointmentForm}
        />

        <div className={`w-full ${viewMode === 'all' ? 'lg:w-2/3 flex flex-col md:grid md:grid-cols-2 gap-6' : 'lg:w-2/3'}`}>
          {(viewMode === 'all' || viewMode === 'matheus') && (
            <DoctorAgendaList
              ref={matheusScrollRef}
              doctorName="Dr. Matheus"
              doctorPhoto="/uploads/drmatheus.png"
              timeSlots={timeSlotsMatheus}
              loading={loading}
              selectedDate={selectedDate}
              onPatientClick={handlePatientClick}
              onUpdateStatus={handleUpdateStatus}
              openStatusPopover={openStatusPopover}
              setOpenStatusPopover={setOpenStatusPopover}
              onBlockSchedule={(d, s, e, r) => createBlock(d, s, e, r, 'Dr. Matheus')}
              onRemoveBlock={handleRemoveBlock}
            />
          )}

          {(viewMode === 'all' || viewMode === 'fabiola') && (
            <DoctorAgendaList
              ref={fabiolaScrollRef}
              doctorName="Dra. Fabíola"
              doctorPhoto="/uploads/drafabiola.png"
              timeSlots={timeSlotsFabiola}
              loading={loading}
              selectedDate={selectedDate}
              onPatientClick={handlePatientClick}
              onUpdateStatus={handleUpdateStatus}
              openStatusPopover={openStatusPopover}
              setOpenStatusPopover={setOpenStatusPopover}
              onBlockSchedule={(d, s, e, r) => createBlock(d, s, e, r, 'Dra. Fabíola')}
              onRemoveBlock={handleRemoveBlock}
            />
          )}
        </div>
      </div>

      {showAppointmentForm && (
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
      )}

      {selectedPatient && (
        <PatientDetailsModal
          isOpen={showPatientDetails}
          onClose={() => {
            setShowPatientDetails(false);
            setSelectedPatient(null);
          }}
          patient={selectedPatient}
          onOpenConsultation={handleOpenConsultation}
          onPatientUpdate={() => fetchAppointments(selectedDate)}
          onSectionChange={onSectionChange}
          onOpenConsultationForPatient={onOpenConsultationForPatient}
          onOpenPatientRecord={onOpenPatientRecord}
          onScheduleReturn={(patientData) => {
            setShowPatientDetails(false);
            setSelectedPatient(null);
            setInitialPatientData(patientData);
            setInitialAppointmentType('retorno');
            setShowAppointmentForm(true);
          }}
        />
      )}
    </div>
  );
}
