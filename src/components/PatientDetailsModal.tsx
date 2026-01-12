import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Phone, Mail, MapPin, Calendar, FileText, Stethoscope, Eye, Clock, Edit, Save, X, Settings, CalendarIcon, MessageCircle, Play, RotateCcw, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatCurrencyInput, getNumericValue } from '@/utils/currency';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { getDoctorDisplayName } from '@/utils/doctorNames';

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    name: string;
    time: string;
    status: string;
    cpf?: string;
    phone?: string;
    email?: string;
    address?: string;
    birthDate?: string;
    observations?: string;
    patientId?: string;
    consultationId?: string;
    appointmentDate?: string;
    appointmentType?: string;
  };
  onOpenConsultation?: () => void;
  onPatientUpdate?: () => void;
  onSectionChange?: (section: string) => void;
  onOpenConsultationForPatient?: (patientId: string, consultationId?: string) => void;
  onScheduleReturn?: (patientData: {
    name?: string;
    cpf?: string;
    date_of_birth?: string;
    phone?: string;
    email?: string;
    address?: string;
    cep?: string;
    city?: string;
  }) => void;
}

interface Consultation {
  id: string;
  consultation_date: string;
  doctor_name: string;
  diagnosis?: string;
  status?: string;
  observations?: string;
  amount?: number | null;
  payment_received?: boolean | null;
  anamnesis?: string;
  prescription?: string;
  started_at?: string | null;
  saved_at?: string | null;
}

interface Exam {
  id: string;
  exam_date: string;
  exam_type: string;
  doctor_name?: string;
  status?: string;
}

const examTypeLabels: { [key: string]: string } = {
  'pentacam': 'Pentacam',
  'campimetria': 'Campimetria',
  'topografia': 'Topografia',
  'microscopia_especular': 'Microscopia Especular',
  'oct': 'OCT',
  'retinografia': 'Retinografia',
  'angiofluoresceinografia': 'Angiofluoresceinografia',
  'ultrassom_ocular': 'Ultrassom Ocular'
};

// Dados fake de histórico para pacientes dos agendamentos
const fakeHistoryData: { [key: string]: { consultations: Consultation[], exams: Exam[] } } = {
  '12345678900': { // Ana Silva
    consultations: [
      {
        id: '1',
        consultation_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        doctor_name: 'Dr. Matheus',
        diagnosis: 'Miopia estável',
        status: 'completed'
      },
      {
        id: '2',
        consultation_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        doctor_name: 'Dr. Matheus',
        diagnosis: 'Avaliação de rotina',
        status: 'completed'
      }
    ],
    exams: [
      {
        id: '1',
        exam_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        exam_type: 'pentacam',
        doctor_name: 'Dr. Matheus',
        status: 'completed'
      }
    ]
  },
  '23456789011': { // Bruno Costa
    consultations: [
      {
        id: '3',
        consultation_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        doctor_name: 'Dr. Matheus',
        diagnosis: 'Retorno pós-cirurgia de catarata',
        status: 'completed'
      },
      {
        id: '4',
        consultation_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        doctor_name: 'Dr. Matheus',
        diagnosis: 'Avaliação pré-cirúrgica',
        status: 'completed'
      }
    ],
    exams: [
      {
        id: '2',
        exam_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        exam_type: 'oct',
        doctor_name: 'Dr. Matheus',
        status: 'completed'
      },
      {
        id: '3',
        exam_date: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
        exam_type: 'campimetria',
        doctor_name: 'Dr. Matheus',
        status: 'completed'
      }
    ]
  },
  '34567890122': { // Carla Dias
    consultations: [
      {
        id: '5',
        consultation_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        doctor_name: 'Dr. Matheus',
        diagnosis: 'Avaliação inicial',
        status: 'completed'
      }
    ],
    exams: []
  },
  '45678901233': { // Daniel Rocha
    consultations: [
      {
        id: '6',
        consultation_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        doctor_name: 'Dr. Matheus',
        diagnosis: 'Consulta de rotina',
        status: 'completed'
      }
    ],
    exams: [
      {
        id: '4',
        exam_date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        exam_type: 'topografia',
        doctor_name: 'Dr. Matheus',
        status: 'completed'
      }
    ]
  },
  '56789012344': { // Elisa Ferreira
    consultations: [
      {
        id: '7',
        consultation_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        doctor_name: 'Dr. Matheus',
        diagnosis: 'Avaliação de rotina',
        status: 'completed'
      }
    ],
    exams: []
  },
  '67890123455': { // Fernanda Gomes
    consultations: [
      {
        id: '8',
        consultation_date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        doctor_name: 'Dra. Fabíola',
        diagnosis: 'Primeira consulta',
        status: 'completed'
      }
    ],
    exams: [
      {
        id: '5',
        exam_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        exam_type: 'retinografia',
        doctor_name: 'Dra. Fabíola',
        status: 'completed'
      }
    ]
  },
  '78901234566': { // Gustavo Lima
    consultations: [
      {
        id: '9',
        consultation_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        doctor_name: 'Dra. Fabíola',
        diagnosis: 'Avaliação inicial',
        status: 'completed'
      }
    ],
    exams: []
  },
  '89012345677': { // Helena Souza
    consultations: [
      {
        id: '10',
        consultation_date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
        doctor_name: 'Dra. Fabíola',
        diagnosis: 'Primeira consulta - avaliação geral',
        status: 'completed'
      }
    ],
    exams: [
      {
        id: '6',
        exam_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        exam_type: 'microscopia_especular',
        doctor_name: 'Dra. Fabíola',
        status: 'completed'
      },
      {
        id: '7',
        exam_date: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
        exam_type: 'pentacam',
        doctor_name: 'Dra. Fabíola',
        status: 'completed'
      }
    ]
  },
  '90123456788': { // Igor Pereira
    consultations: [
      {
        id: '11',
        consultation_date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        doctor_name: 'Dra. Fabíola',
        diagnosis: 'Consulta de rotina',
        status: 'completed'
      }
    ],
    exams: []
  }
};

export function PatientDetailsModal({ isOpen, onClose, patient, onOpenConsultation, onPatientUpdate, onSectionChange, onOpenConsultationForPatient, onScheduleReturn }: PatientDetailsModalProps) {
  const { appUser } = useAuth();
  const isDoctor = appUser?.role === 'doctor' || appUser?.role === 'admin';
  const isSecretary = appUser?.role === 'secretary';
  
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
      'realizado': 'Realizado'
    };
    
    return statusMap[status.toLowerCase()] || status;
  };

  // Função para formatar número de telefone para WhatsApp
  const formatPhoneForWhatsApp = (phone: string): string => {
    if (!phone) return '';
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, '');
    // Se já começa com 55 (código do Brasil), retorna como está
    if (numbers.startsWith('55')) {
      return numbers;
    }
    // Se começa com 0, remove o 0 e adiciona 55
    if (numbers.startsWith('0')) {
      return '55' + numbers.substring(1);
    }
    // Se tem 11 dígitos (DDD + número), adiciona 55
    if (numbers.length === 11) {
      return '55' + numbers;
    }
    // Se tem 10 dígitos (DDD + número sem 9), adiciona 55
    if (numbers.length === 10) {
      return '55' + numbers;
    }
    // Caso padrão, adiciona 55
    return '55' + numbers;
  };

  // Função para abrir WhatsApp
  const openWhatsApp = (phone: string) => {
    if (!phone) return;
    const formattedPhone = formatPhoneForWhatsApp(phone);
    const whatsappUrl = `https://wa.me/${formattedPhone}`;
    window.open(whatsappUrl, '_blank');
  };

  // Função para verificar se o agendamento é da data atual
  const isTodayAppointment = (): boolean => {
    if (!patient.appointmentDate) return false;
    const today = new Date();
    const appointmentDate = new Date(patient.appointmentDate);
    return (
      today.getFullYear() === appointmentDate.getFullYear() &&
      today.getMonth() === appointmentDate.getMonth() &&
      today.getDate() === appointmentDate.getDate()
    );
  };

  // Função para verificar se a consulta pode ser editada (até 12h após o primeiro salvamento)
  const canEditCurrentConsultation = (): boolean => {
    if (!patient.consultationId) return true; // Se não tem consulta ainda, pode criar

    // Buscar a consulta relacionada ao agendamento
    const consultation = consultations.find(c => c.id === patient.consultationId);
    if (!consultation) return true; // Se não encontrou, pode criar

    if (!consultation.anamnesis) return true; // Se não tem anamnese, ainda não foi salva

    // Usar a data da consulta como referência
    const consultationDate = new Date(consultation.consultation_date);
    const now = new Date();
    const hoursDiff = (now.getTime() - consultationDate.getTime()) / (1000 * 60 * 60);

    return hoursDiff <= 12;
  };

  // Função para verificar se a consulta do dia já foi iniciada
  const isConsultationStarted = (): boolean => {
    if (!patient.consultationId || !isTodayAppointment()) return false;

    // Buscar a consulta relacionada ao agendamento
    const consultation = consultations.find(c => c.id === patient.consultationId);
    if (!consultation) return false;

    // Verificar se já foi iniciada (tem started_at ou status in_progress)
    return consultation.started_at !== null || consultation.status === 'in_progress';
  };

  // Função para iniciar consulta do agendamento atual
  const handleStartCurrentConsultation = async () => {
    if (!patient.patientId) {
      toast.error('ID do paciente não encontrado');
      return;
    }
    
    // Se houver consultationId, registrar o início do atendimento
    if (patient.consultationId) {
      try {
        const { error } = await supabase
          .from('consultations')
          .update({
            started_at: new Date().toISOString(),
            status: 'in_progress'
          })
          .eq('id', patient.consultationId);

        if (error) {
          console.error('Erro ao registrar início da consulta:', error);
          // Não bloquear o fluxo, apenas logar o erro
        }
      } catch (error) {
        console.error('Erro ao registrar início da consulta:', error);
        // Não bloquear o fluxo, apenas logar o erro
      }
    }
    
    // Fechar o modal de detalhes do paciente
    onClose();
    
    // Navegar para a seção de pacientes e abrir a consulta
    if (onOpenConsultationForPatient) {
      onOpenConsultationForPatient(patient.patientId, patient.consultationId);
      if (onSectionChange) {
        onSectionChange('pacientes');
      }
      toast.success('Abrindo janela de nova consulta');
    } else if (onSectionChange) {
      onSectionChange('pacientes');
      toast.info('Navegue para a seção de Pacientes e abra a consulta manualmente');
    } else if (onOpenConsultation) {
      onOpenConsultation();
      toast.info('Navegue para a seção de Pacientes e abra a consulta manualmente');
    }
  };

  // Função para agendar retorno do paciente
  const handleScheduleReturn = () => {
    if (!onScheduleReturn) {
      toast.error('Função de agendamento não disponível');
      return;
    }

    // Preparar dados do paciente para o formulário de agendamento
    const patientData = {
      name: patient.name,
      cpf: patient.cpf,
      date_of_birth: patient.birthDate,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      cep: undefined, // Não temos CEP no modal atual
      city: undefined // Não temos cidade no modal atual
    };

    // Fechar o modal de detalhes
    onClose();

    // Chamar callback para abrir formulário de agendamento com dados pré-preenchidos
    onScheduleReturn(patientData);
    toast.success('Abrindo formulário de agendamento de retorno');
  };

  // Função para obter cor do status
  const getStatusColor = (status: string | null | undefined): string => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusLower = status.toLowerCase();
    if (statusLower === 'scheduled' || statusLower === 'agendado') {
      return 'bg-blue-100 text-blue-800';
    }
    if (statusLower === 'pending' || statusLower === 'aguardando_pagamento' || statusLower === 'aguardando pagamento') {
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
  const [patientId, setPatientId] = useState<string | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPatient, setEditingPatient] = useState<{
    name: string;
    cpf: string;
    phone: string;
    email: string;
    address: string;
    cep: string;
    city: string;
    date_of_birth: string;
  }>({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    address: '',
    cep: '',
    city: '',
    date_of_birth: ''
  });
  const [saving, setSaving] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<{
    date: Date;
    time: string;
    doctor: string;
    appointmentType: string;
    amount: string;
    payment_received: boolean;
    payment_method: string;
    observations: string;
    status: string;
  }>({
    date: new Date(),
    time: '',
    doctor: '',
    appointmentType: '',
    amount: '',
    payment_received: false,
    payment_method: '',
    observations: '',
    status: 'scheduled'
  });
  const [paymentMethodPopoverOpen, setPaymentMethodPopoverOpen] = useState(false);
  const [savingAppointment, setSavingAppointment] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showConsultationDetails, setShowConsultationDetails] = useState(false);

  const availableTimes = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const fetchPatientData = useCallback(async () => {
    try {
      let foundPatientId: string | null = null;
      let patientData: any = null;

      // Se já temos o patientId, buscar dados completos
      if (patient.patientId) {
        foundPatientId = patient.patientId;
        const { data, error } = await supabase
          .from('patients')
          .select('id, name, cpf, phone, email, address, date_of_birth')
          .eq('id', patient.patientId)
          .single();
        
        if (data && !error) {
          patientData = data;
        }
      } 
      // Caso contrário, buscar pelo CPF
      else if (patient.cpf) {
        const { data, error } = await supabase
          .from('patients')
          .select('id, name, cpf, phone, email, address, date_of_birth')
          .eq('cpf', patient.cpf.replace(/\D/g, ''))
          .single();

        if (data && !error) {
          foundPatientId = data.id;
          patientData = data;
        }
      }

      // Atualizar estado com dados do banco ou dados iniciais do prop
      const addressData = patientData?.address || patient.address || '';
      const parsedAddress = parseAddress(addressData);
      
      if (patientData) {
        setEditingPatient({
          name: patientData.name || patient.name,
          cpf: patientData.cpf || patient.cpf || '',
          phone: patientData.phone || patient.phone || '',
          email: patientData.email || patient.email || '',
          address: parsedAddress.address,
          cep: parsedAddress.cep,
          city: parsedAddress.city,
          date_of_birth: patientData.date_of_birth 
            ? new Date(patientData.date_of_birth).toISOString().split('T')[0]
            : patient.birthDate 
              ? patient.birthDate.split('/').reverse().join('-')
              : ''
        });
      } else {
        // Se não encontrou no banco, usar dados do prop
        setEditingPatient({
          name: patient.name,
          cpf: patient.cpf || '',
          phone: patient.phone || '',
          email: patient.email || '',
          address: parsedAddress.address,
          cep: parsedAddress.cep,
          city: parsedAddress.city,
          date_of_birth: patient.birthDate 
            ? patient.birthDate.split('/').reverse().join('-')
            : ''
        });
      }

      return foundPatientId;
    } catch (error) {
      console.error('Erro ao buscar dados do paciente:', error);
      // Em caso de erro, usar dados do prop
      const addressData = patient.address || '';
      const parsedAddress = parseAddress(addressData);
      setEditingPatient({
        name: patient.name,
        cpf: patient.cpf || '',
        phone: patient.phone || '',
        email: patient.email || '',
        address: parsedAddress.address,
        cep: parsedAddress.cep,
        city: parsedAddress.city,
        date_of_birth: patient.birthDate 
          ? patient.birthDate.split('/').reverse().join('-')
          : ''
      });
      return null;
    }
  }, [patient]);

  const fetchPatientHistory = useCallback(async () => {
    // Função auxiliar para obter dados fake
    const getFakeHistory = () => {
      if (!patient.cpf) return { consultations: [], exams: [] };
      const cpfKey = patient.cpf.replace(/\D/g, '');
      return fakeHistoryData[cpfKey] || { consultations: [], exams: [] };
    };
    try {
      setLoading(true);
      
      const foundPatientId = await fetchPatientData();
      
      if (!foundPatientId) {
        // Sem patientId, usar dados fake
        const fakeData = getFakeHistory();
        setConsultations(fakeData.consultations);
        setExams(fakeData.exams);
        setLoading(false);
        return;
      }

      setPatientId(foundPatientId);

      // Buscar consultas do paciente
      const { data: consultationsData, error: consultationsError } = await supabase
        .from('consultations')
        .select('id, consultation_date, doctor_name, diagnosis, status, observations, amount, payment_received, anamnesis, prescription, started_at, saved_at')
        .eq('patient_id', foundPatientId)
        .order('consultation_date', { ascending: false })
        .limit(10);

      if (consultationsError) {
        console.error('Erro ao buscar consultas:', consultationsError);
      }

      // Buscar exames do paciente
      const { data: examsData, error: examsError } = await supabase
        .from('patient_exams')
        .select('id, exam_date, exam_type, doctor_name, status')
        .eq('patient_id', foundPatientId)
        .order('exam_date', { ascending: false })
        .limit(10);

      if (examsError) {
        console.error('Erro ao buscar exames:', examsError);
      }

      // Se houver dados reais, usar eles. Caso contrário, usar dados fake
      const fakeData = getFakeHistory();
      if (consultationsData && consultationsData.length > 0) {
        setConsultations(consultationsData);
      } else {
        setConsultations(fakeData.consultations);
      }

      if (examsData && examsData.length > 0) {
        setExams(examsData);
      } else {
        setExams(fakeData.exams);
      }

    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  }, [patient.patientId, patient.cpf, fetchPatientData]);

  // Buscar dados do paciente quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      fetchPatientData();
      fetchPatientHistory();
      setIsEditing(false);
    } else {
      // Limpar dados quando o modal fechar
      setConsultations([]);
      setExams([]);
      setPatientId(null);
      setIsEditing(false);
    }
  }, [isOpen, fetchPatientHistory, fetchPatientData]);

  // Formatação de CPF
  const formatCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  };

  // Formatação de telefone
  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  // Formatação de CEP
  const formatCEP = (cep: string) => {
    const numbers = cep.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return cep;
  };

  // Parsear endereço existente (tenta extrair CEP e cidade se estiverem no formato antigo)
  const parseAddress = (address: string) => {
    if (!address) return { address: '', cep: '', city: '' };
    
    // Tentar extrair CEP (formato: 00000-000 ou 00000000 ou "CEP: 00000-000")
    const cepMatch = address.match(/(?:CEP[:\s]*)?(\d{5}-?\d{3})\b/i);
    const cep = cepMatch ? cepMatch[1].replace(/\D/g, '') : '';
    
    // Remover CEP do endereço
    let cleanAddress = address.replace(/(?:CEP[:\s]*)?\d{5}-?\d{3}/gi, '').trim();
    
    // Tentar extrair cidade (geralmente após vírgula ou hífen, no final)
    // Procura por padrões como ", Cidade" ou "- Cidade" no final
    const cityMatch = cleanAddress.match(/[-,\s]+([A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]{2,})$/);
    const city = cityMatch ? cityMatch[1].trim() : '';
    
    // Remover cidade do endereço
    if (city) {
      cleanAddress = cleanAddress.replace(new RegExp(`[-,\\s]+${city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), '').trim();
    }
    
    // Limpar vírgulas e espaços extras no final
    cleanAddress = cleanAddress.replace(/[,\s]+$/, '').trim();
    
    return {
      address: cleanAddress,
      cep: cep,
      city: city
    };
  };

  const handleInputChange = (field: keyof typeof editingPatient, value: string) => {
    if (field === 'cpf') {
      value = formatCPF(value);
    } else if (field === 'phone') {
      value = formatPhone(value);
    } else if (field === 'cep') {
      value = formatCEP(value);
    }
    setEditingPatient({ ...editingPatient, [field]: value });
  };

  const handleSave = async () => {
    // Validação básica
    if (!editingPatient.name || editingPatient.name.trim() === '') {
      toast.error('O nome do paciente é obrigatório');
      return;
    }

    // Validação de CPF (se fornecido, deve ter 11 dígitos)
    if (editingPatient.cpf) {
      const cpfNumbers = editingPatient.cpf.replace(/\D/g, '');
      if (cpfNumbers.length > 0 && cpfNumbers.length !== 11) {
        toast.error('CPF deve conter 11 dígitos');
        return;
      }
    }

    // Validação de CEP (se fornecido, deve ter 8 dígitos)
    if (editingPatient.cep) {
      const cepNumbers = editingPatient.cep.replace(/\D/g, '');
      if (cepNumbers.length > 0 && cepNumbers.length !== 8) {
        toast.error('CEP deve conter 8 dígitos');
        return;
      }
    }

    if (!patientId) {
      toast.error('Não foi possível identificar o paciente no banco de dados. É necessário que o paciente esteja cadastrado para editar os dados.');
      return;
    }

    try {
      setSaving(true);

      // Combinar endereço, CEP e cidade em um único campo para compatibilidade
      let fullAddress = editingPatient.address?.trim() || '';
      if (editingPatient.cep) {
        fullAddress = fullAddress ? `${fullAddress}, CEP: ${editingPatient.cep}` : `CEP: ${editingPatient.cep}`;
      }
      if (editingPatient.city) {
        fullAddress = fullAddress ? `${fullAddress}, ${editingPatient.city}` : editingPatient.city;
      }

      // Preparar dados para atualização
      const updateData: any = {
        name: editingPatient.name.trim(),
        cpf: editingPatient.cpf?.replace(/\D/g, '') || null,
        phone: editingPatient.phone?.trim() || null,
        email: editingPatient.email?.trim() || null,
        address: fullAddress || null,
        updated_at: new Date().toISOString()
      };

      // Adicionar data de nascimento se fornecida
      if (editingPatient.date_of_birth) {
        updateData.date_of_birth = editingPatient.date_of_birth;
      }

      // Atualizar no banco
      const { error } = await supabase
        .from('patients')
        .update(updateData)
        .eq('id', patientId);

      if (error) {
        console.error('Erro ao atualizar paciente:', error);
        toast.error('Erro ao salvar alterações: ' + (error.message || 'Erro desconhecido'));
        return;
      }

      toast.success('Dados do paciente atualizados com sucesso!');
      setIsEditing(false);
      
      // Atualizar dados no componente pai se callback fornecido
      if (onPatientUpdate) {
        onPatientUpdate();
      }

      // Recarregar dados
      await fetchPatientData();
      await fetchPatientHistory();

    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar alterações: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setSaving(false);
    }
  };

  const handleEditAppointment = async () => {
    if (!patient.consultationId) {
      toast.error('ID da consulta não encontrado');
      return;
    }

    try {
      setLoading(true);

      // Buscar dados atuais da consulta
      const { data: consultation, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('id', patient.consultationId)
        .single();

      if (error || !consultation) {
        toast.error('Erro ao carregar dados do agendamento');
        return;
      }

      // Preparar dados para edição
      const consultationDate = new Date(consultation.consultation_date);
      const time = consultationDate.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });

      const doctorValue = consultation.doctor_name?.toLowerCase().includes('matheus') 
        ? 'matheus' 
        : consultation.doctor_name?.toLowerCase().includes('fabiola') || consultation.doctor_name?.toLowerCase().includes('fabíola')
        ? 'fabiola'
        : '';

      setEditingAppointment({
        date: consultationDate,
        time: time,
        doctor: doctorValue,
        appointmentType: (consultation as any).appointment_type || 'consulta',
        amount: consultation.amount ? consultation.amount.toFixed(2).replace('.', ',') : '',
        payment_received: consultation.payment_received || false,
        payment_method: (consultation as any).payment_method || '',
        observations: consultation.observations || '',
        status: consultation.status || 'scheduled'
      });

      setShowEditModal(true);
    } catch (error: any) {
      console.error('Erro ao carregar agendamento:', error);
      toast.error('Erro ao carregar dados do agendamento');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAppointment = async () => {
    if (!patient.consultationId) {
      toast.error('ID da consulta não encontrado');
      return;
    }

    try {
      setSavingAppointment(true);

      // Preparar data e horário
      const consultationDateTime = new Date(editingAppointment.date);
      const [hours, minutes] = editingAppointment.time.split(':');
      consultationDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Mapear nome do médico usando função utilitária
      const doctorName = getDoctorDisplayName(editingAppointment.doctor);

      // Preparar dados para atualização
      const updateData: any = {
        doctor_name: doctorName,
        consultation_date: consultationDateTime.toISOString(),
        appointment_type: editingAppointment.appointmentType || null,
        observations: editingAppointment.observations || null,
        payment_received: editingAppointment.payment_received || false,
        payment_method: editingAppointment.payment_method || null,
        status: editingAppointment.status || 'scheduled'
      };

      // Adicionar amount se fornecido
      if (editingAppointment.amount) {
        updateData.amount = getNumericValue(editingAppointment.amount);
      }

      // Atualizar no banco
      const { error } = await supabase
        .from('consultations')
        .update(updateData)
        .eq('id', patient.consultationId);

      if (error) {
        console.error('Erro ao atualizar agendamento:', error);
        console.error('Dados enviados:', updateData);
        toast.error('Erro ao atualizar agendamento: ' + (error.message || JSON.stringify(error)));
        return;
      }

      toast.success('Agendamento atualizado com sucesso!');
      setShowEditModal(false);
      
      // Atualizar dados no componente pai se callback fornecido
      if (onPatientUpdate) {
        onPatientUpdate();
      }

      // Fechar modal principal também para recarregar dados
      onClose();

    } catch (error: any) {
      console.error('Erro ao salvar agendamento:', error);
      toast.error('Erro ao salvar alterações: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setSavingAppointment(false);
    }
  };

  const handleDeleteAppointment = () => {
    if (!patient.consultationId) {
      toast.error('ID da consulta não encontrado');
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAppointment = async () => {
    if (!patient.consultationId) {
      console.error('ID da consulta não encontrado');
      return;
    }

    try {
      setLoading(true);
      setShowDeleteConfirm(false);

      console.log('Removendo consulta com ID:', patient.consultationId);
      console.log('Dados do paciente:', { name: patient.name, consultationId: patient.consultationId });

      // Verificar se a consulta existe antes de remover
      const { data: checkData } = await supabase
        .from('consultations')
        .select('id')
        .eq('id', patient.consultationId)
        .single();
      
      console.log('Consulta encontrada antes da remoção:', checkData);

      // Remover consulta do banco
      const { data, error } = await supabase
        .from('consultations')
        .delete()
        .eq('id', patient.consultationId)
        .select();

      console.log('Resultado da remoção:', { data, error, rowsDeleted: data?.length || 0 });

      if (error) {
        console.error('Erro ao remover agendamento:', error);
        toast.error('Erro ao remover agendamento: ' + (error.message || 'Erro desconhecido'));
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        console.warn('Nenhuma linha foi removida. Verifique se o ID está correto.');
        toast.error('Não foi possível remover o agendamento. Verifique se ele ainda existe.');
        setLoading(false);
        return;
      }

      console.log('Consulta removida com sucesso:', data);
      toast.success('Agendamento removido com sucesso!');
      
      // Aguardar um pouco mais para garantir que o banco foi atualizado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Atualizar dados no componente pai se callback fornecido
      if (onPatientUpdate) {
        console.log('Chamando onPatientUpdate para atualizar lista de agendamentos');
        await onPatientUpdate();
        // Aguardar mais um pouco após a atualização
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Recarregar histórico do paciente
      await fetchPatientHistory();

      // Fechar modal após garantir que tudo foi atualizado
      setLoading(false);
      onClose();

    } catch (error: any) {
      console.error('Erro ao remover agendamento:', error);
      toast.error('Erro ao remover agendamento: ' + (error.message || 'Erro desconhecido'));
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restaurar dados originais
    fetchPatientData();
  };

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-medical-primary">
            Detalhes do Paciente
          </DialogTitle>
          <DialogDescription className="text-center">
            {patient.consultationId || patient.time || patient.appointmentDate 
              ? 'Informações do agendamento' 
              : 'Informações do paciente'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-hidden flex flex-col">
          {/* Layout em duas colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
            {/* Coluna Esquerda: Dados do Paciente */}
            <div className="space-y-3 relative">
              {/* Botão de Editar */}
              <div className="absolute top-0 right-0">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="h-8 w-8 p-0 bg-marrom-acentuado hover:bg-white text-white hover:text-marrom-acentuado border border-transparent hover:border-marrom-acentuado transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="h-8 w-8 p-0 bg-marrom-acentuado hover:bg-white text-white hover:text-marrom-acentuado border border-transparent hover:border-marrom-acentuado transition-colors disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleCancel}
                      disabled={saving}
                      className="h-8 w-8 p-0 bg-marrom-acentuado hover:bg-white text-white hover:text-marrom-acentuado border border-transparent hover:border-marrom-acentuado transition-colors disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {!isEditing ? (
                <>
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-gray-600 mt-1" />
                    <div>
                      <p className="font-semibold text-marrom-acentuado">{editingPatient.name || patient.name}</p>
                      {(editingPatient.cpf || patient.cpf) && (
                        <p className="text-sm text-gray-600">CPF: {editingPatient.cpf || patient.cpf}</p>
                      )}
                    </div>
                  </div>

                  {(editingPatient.phone || patient.phone) && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <p className="text-sm text-gray-700">{editingPatient.phone || patient.phone}</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openWhatsApp(editingPatient.phone || patient.phone || '')}
                        className="h-7 px-2 text-xs bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                        title="Abrir WhatsApp"
                      >
                        <MessageCircle className="h-3.5 w-3.5 mr-1" />
                        WhatsApp
                      </Button>
                    </div>
                  )}

                  {(editingPatient.email || patient.email) && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <p className="text-sm text-gray-700">{editingPatient.email || patient.email}</p>
                    </div>
                  )}

                  {(editingPatient.date_of_birth || patient.birthDate) && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <p className="text-sm text-gray-700">
                        Data de Nascimento: {
                          editingPatient.date_of_birth 
                            ? new Date(editingPatient.date_of_birth).toLocaleDateString('pt-BR')
                            : patient.birthDate
                        }
                      </p>
                    </div>
                  )}

                  {(editingPatient.address || editingPatient.cep || editingPatient.city || patient.address) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-gray-600 mt-1" />
                      <div className="text-sm text-gray-700">
                        {editingPatient.address && <p>{editingPatient.address}</p>}
                        {(editingPatient.cep || editingPatient.city) && (
                          <p className="text-gray-600">
                            {editingPatient.cep && `CEP: ${editingPatient.cep}`}
                            {editingPatient.cep && editingPatient.city && ' • '}
                            {editingPatient.city}
                          </p>
                        )}
                        {!editingPatient.address && !editingPatient.cep && !editingPatient.city && patient.address && (
                          <p>{patient.address}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {patient.observations && (
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-gray-600 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-700 text-sm">Observações:</p>
                        <p className="text-sm text-gray-600">{patient.observations}</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3 pt-6">
                  <div>
                    <Label htmlFor="edit-name">Nome Completo *</Label>
                    <Input
                      id="edit-name"
                      value={editingPatient.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nome do paciente"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-cpf">CPF</Label>
                    <Input
                      id="edit-cpf"
                      value={editingPatient.cpf}
                      onChange={(e) => handleInputChange('cpf', e.target.value)}
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-phone">Telefone</Label>
                    <Input
                      id="edit-phone"
                      value={editingPatient.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingPatient.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-birthdate">Data de Nascimento</Label>
                    <Input
                      id="edit-birthdate"
                      type="date"
                      value={editingPatient.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-address">Endereço</Label>
                    <Input
                      id="edit-address"
                      value={editingPatient.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Rua, número, bairro"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-cep">CEP</Label>
                      <Input
                        id="edit-cep"
                        value={editingPatient.cep}
                        onChange={(e) => handleInputChange('cep', e.target.value)}
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-city">Cidade</Label>
                      <Input
                        id="edit-city"
                        value={editingPatient.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Cidade"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Coluna Direita: Histórico de Consultas e Exames */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 text-sm mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Histórico
              </h3>
              
              <ScrollArea className="h-[300px] pr-4">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Consultas */}
                    {consultations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 text-xs mb-2 flex items-center gap-2">
                          <Stethoscope className="h-3 w-3" />
                          Consultas ({consultations.length})
                        </h4>
                        <div className="space-y-2">
                          {consultations.map((consultation) => (
                            <div 
                              key={consultation.id} 
                              className="bg-marrom-acentuado/5 p-3 rounded-md border border-marrom-acentuado/20 cursor-pointer hover:bg-marrom-acentuado/10 transition-colors"
                              onClick={() => {
                                setSelectedConsultation(consultation);
                                setShowConsultationDetails(true);
                              }}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-medium text-gray-700">
                                  {new Date(consultation.consultation_date).toLocaleDateString('pt-BR')}
                                </p>
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(consultation.status)}`}>
                                  {translateStatus(consultation.status)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">{consultation.doctor_name}</p>
                              {consultation.diagnosis && (
                                <p className="text-xs text-gray-500 mt-1">{consultation.diagnosis}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Exames */}
                    {exams.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-700 text-xs mb-2 flex items-center gap-2 mt-4">
                          <Eye className="h-3 w-3" />
                          Exames ({exams.length})
                        </h4>
                        <div className="space-y-2">
                          {exams.map((exam) => (
                            <div key={exam.id} className="bg-marrom-acentuado/5 p-3 rounded-md border border-marrom-acentuado/20">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-medium text-gray-700">
                                  {new Date(exam.exam_date).toLocaleDateString('pt-BR')}
                                </p>
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(exam.status)}`}>
                                  {translateStatus(exam.status)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-700 font-medium">
                                {examTypeLabels[exam.exam_type] || exam.exam_type}
                              </p>
                              {exam.doctor_name && (
                                <p className="text-xs text-gray-600">{exam.doctor_name}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!loading && consultations.length === 0 && exams.length === 0 && (
                      <p className="text-xs text-gray-500 text-center py-4">
                        Nenhum histórico encontrado
                      </p>
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>

          {/* Informações do Agendamento - Só mostrar se houver dados de agendamento */}
          {(patient.consultationId || patient.time || patient.appointmentDate) && (
          <div className="bg-marrom-acentuado/10 p-4 rounded-lg relative border border-marrom-acentuado/20">
            <div className="absolute top-3 right-3 flex gap-2">
              {patient.consultationId && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditAppointment}
                    className="h-7 px-2 text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteAppointment}
                    className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remover
                  </Button>
                </>
              )}
              {/* Botão "Iniciar Consulta" para médicos quando o agendamento é da data atual */}
              {isDoctor && isTodayAppointment() && (
                <Button
                  size="sm"
                  onClick={handleStartCurrentConsultation}
                  className="h-7 px-3 text-xs bg-bege-principal hover:bg-bege-principal/90 text-white"
                  disabled={!canEditCurrentConsultation()}
                >
                  <Play className="h-3 w-3 mr-1" />
                  {canEditCurrentConsultation()
                    ? (isConsultationStarted() ? 'Acessar Consulta' : 'Iniciar Consulta')
                    : 'Consulta não pode ser editada (após 12h)'
                  }
                </Button>
              )}
              {/* Botão "Agendar Retorno" - disponível para pacientes já cadastrados, visível para médicos e secretárias */}
              {patient.patientId && onScheduleReturn && (isDoctor || isSecretary) && (
                <Button
                  size="sm"
                  onClick={handleScheduleReturn}
                  variant="outline"
                  className="h-7 px-3 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Agendar Retorno
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="font-semibold text-gray-700">Agendamento:</span>
            </div>
            {patient.time && (
            <p className="text-sm text-gray-600 ml-6">Horário: {patient.time}</p>
            )}
            {patient.appointmentDate && (
              <p className="text-sm text-gray-600 ml-6">
                Data: {new Date(patient.appointmentDate).toLocaleDateString('pt-BR')}
              </p>
            )}
            {patient.appointmentType && (
              <p className="text-sm text-gray-600 ml-6">
                Tipo: {patient.appointmentType === 'consulta' ? 'Consulta' :
                       patient.appointmentType === 'retorno' ? 'Retorno' :
                       patient.appointmentType === 'exame' ? 'Exame' :
                       patient.appointmentType === 'pagamento_honorarios' ? 'Pagamento de Honorários' :
                       patient.appointmentType}
              </p>
            )}
            <div className="ml-6 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(patient.status)}`}>
                {translateStatus(patient.status)}
              </span>
            </div>
          </div>
          )}

        </div>
      </DialogContent>
    </Dialog>

    {/* Modal de Edição de Agendamento */}
    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
          <DialogDescription>
            Edite as informações do agendamento de {patient.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Data e Horário */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Data do Agendamento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-10"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editingAppointment.date ? (
                      format(editingAppointment.date, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={editingAppointment.date}
                    onSelect={(date) => {
                      if (date) {
                        setEditingAppointment({ ...editingAppointment, date });
                      }
                    }}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label className="text-sm font-medium">Horário *</Label>
              <Select 
                value={editingAppointment.time} 
                onValueChange={(value) => setEditingAppointment({ ...editingAppointment, time: value })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map(time => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Médico e Tipo de Agendamento */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Médico *</Label>
              <Select 
                value={editingAppointment.doctor} 
                onValueChange={(value) => setEditingAppointment({ ...editingAppointment, doctor: value })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione o médico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matheus">Dr. Matheus</SelectItem>
                  <SelectItem value="fabiola">Dra. Fabíola</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Tipo de Agendamento</Label>
              <Select 
                value={editingAppointment.appointmentType} 
                onValueChange={(value) => setEditingAppointment({ ...editingAppointment, appointmentType: value })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consulta">Consulta</SelectItem>
                  <SelectItem value="retorno">Retorno</SelectItem>
                  <SelectItem value="exame">Exame</SelectItem>
                  <SelectItem value="pagamento_honorarios">Pagamento de Honorários</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Valor e Status de Pagamento */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Valor Pago (R$)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">R$</span>
                <Input
                  type="text"
                  value={editingAppointment.amount}
                  onChange={(e) => {
                    const formatted = formatCurrencyInput(e.target.value);
                    setEditingAppointment({ ...editingAppointment, amount: formatted });
                  }}
                  placeholder="0,00"
                  className="pl-10 pr-24 h-10"
                  inputMode="numeric"
                />
                <Popover open={paymentMethodPopoverOpen} onOpenChange={setPaymentMethodPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs hover:text-gray-700 flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 z-10"
                    >
                      <span className="text-xs">
                        {editingAppointment.payment_method || 'Meio de Pagamento'}
                      </span>
                      <ChevronDown className="h-3 w-3 flex-shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-1 z-50" align="end">
                    <button
                      onClick={() => {
                        setEditingAppointment({ ...editingAppointment, payment_method: 'Dinheiro' });
                        setPaymentMethodPopoverOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 rounded-sm transition-colors"
                    >
                      Dinheiro
                    </button>
                    <button
                      onClick={() => {
                        setEditingAppointment({ ...editingAppointment, payment_method: 'Pix' });
                        setPaymentMethodPopoverOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 rounded-sm transition-colors"
                    >
                      Pix
                    </button>
                    <button
                      onClick={() => {
                        setEditingAppointment({ ...editingAppointment, payment_method: 'Cartão de Crédito' });
                        setPaymentMethodPopoverOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 rounded-sm transition-colors"
                    >
                      Cartão de Crédito
                    </button>
                    <button
                      onClick={() => {
                        setEditingAppointment({ ...editingAppointment, payment_method: 'Cheque' });
                        setPaymentMethodPopoverOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 rounded-sm transition-colors"
                    >
                      Cheque
                    </button>
                    <button
                      onClick={() => {
                        setEditingAppointment({ ...editingAppointment, payment_method: 'Débito' });
                        setPaymentMethodPopoverOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 rounded-sm transition-colors"
                    >
                      Débito
                    </button>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-8">
              <Checkbox
                id="payment_received_edit"
                checked={editingAppointment.payment_received}
                onCheckedChange={(checked) => 
                  setEditingAppointment({ ...editingAppointment, payment_received: checked === true })
                }
              />
              <Label htmlFor="payment_received_edit" className="text-sm font-normal cursor-pointer">
                Pagamento realizado
              </Label>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label className="text-sm font-medium">Status</Label>
            <Select 
              value={editingAppointment.status} 
              onValueChange={(value) => setEditingAppointment({ ...editingAppointment, status: value })}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Agendado</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Observações */}
          <div>
            <Label className="text-sm font-medium">Observações</Label>
            <Textarea
              value={editingAppointment.observations}
              onChange={(e) => setEditingAppointment({ ...editingAppointment, observations: e.target.value })}
              placeholder="Observações sobre o agendamento..."
              rows={3}
              className="mt-1"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={handleSaveAppointment} 
              disabled={savingAppointment || !editingAppointment.time || !editingAppointment.doctor}
              className="flex-1 bg-medical-primary hover:bg-medical-primary/90"
            >
              {savingAppointment ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowEditModal(false)}
              disabled={savingAppointment}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Modal de Confirmação de Exclusão */}
    <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover este agendamento?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Paciente: {patient.name}</p>
            {patient.appointmentDate && (
              <p className="text-sm text-gray-600">
                Data: {new Date(patient.appointmentDate).toLocaleDateString('pt-BR')}
              </p>
            )}
            <p className="text-sm text-gray-600">Horário: {patient.time}</p>
            {patient.appointmentType && (
              <p className="text-sm text-gray-600">
                Tipo: {patient.appointmentType === 'consulta' ? 'Consulta' :
                       patient.appointmentType === 'retorno' ? 'Retorno' :
                       patient.appointmentType === 'exame' ? 'Exame' :
                       patient.appointmentType === 'pagamento_honorarios' ? 'Pagamento de Honorários' :
                       patient.appointmentType}
              </p>
            )}
          </div>

          <p className="text-sm text-red-600 font-medium">
            ⚠️ Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button 
            onClick={confirmDeleteAppointment} 
            disabled={loading}
            variant="destructive"
            className="flex-1"
          >
            {loading ? 'Removendo...' : 'Sim, Remover'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowDeleteConfirm(false)}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    {/* Modal de Detalhes da Consulta */}
    <Dialog open={showConsultationDetails} onOpenChange={setShowConsultationDetails}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Consulta</DialogTitle>
          <DialogDescription>
            Informações da consulta de {patient.name}
          </DialogDescription>
        </DialogHeader>

        {selectedConsultation && (
          <div className="space-y-4">
            {/* Informações Básicas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Data e Horário</Label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(selectedConsultation.consultation_date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Médico</Label>
                <p className="text-sm text-gray-900 mt-1">{selectedConsultation.doctor_name}</p>
              </div>
            </div>

            {/* Linha com Status e Pagamento lado a lado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status */}
              <div>
                <Label className="text-sm font-medium text-gray-600">Status</Label>
                <div className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(selectedConsultation.status)}`}>
                    {translateStatus(selectedConsultation.status)}
                  </span>
                </div>
                {selectedConsultation.saved_at && (
                  <p className="text-xs text-gray-500 mt-2">
                    Finalizada em: {new Date(selectedConsultation.saved_at).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>

              {/* Valor e Pagamento lado a lado */}
              {(selectedConsultation.amount !== null && selectedConsultation.amount !== undefined) || selectedConsultation.payment_received !== null ? (
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  {selectedConsultation.amount !== null && selectedConsultation.amount !== undefined && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Valor Pago</Label>
                      <p className="text-sm text-gray-900 mt-1">
                        R$ {selectedConsultation.amount.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  )}
                  {selectedConsultation.payment_received !== null && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Pagamento</Label>
                      <p className="text-sm text-gray-900 mt-1">
                        {selectedConsultation.payment_received ? 'Realizado' : 'Pendente'}
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Diagnóstico */}
            {selectedConsultation.diagnosis && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Diagnóstico</Label>
                <p className="text-sm text-gray-900 mt-1">{selectedConsultation.diagnosis}</p>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex gap-2 pt-4">
              {/* Botão para Abrir Consulta Completa */}
              {isDoctor && onOpenConsultationForPatient && patientId && (
                <Button
                  size="sm"
                  onClick={() => {
                    setShowConsultationDetails(false);
                    onOpenConsultationForPatient(patientId, selectedConsultation.id);
                    if (onSectionChange) {
                      onSectionChange('pacientes');
                    }
                  }}
                  className="flex-1 bg-medical-primary hover:bg-medical-primary/90"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Abrir Consulta Completa
                </Button>
              )}

              {/* Botão para Acessar Prontuário Completo (Fallback) */}
              {isDoctor && !onOpenConsultationForPatient && onOpenConsultation && (
                <Button
                  size="sm"
                  onClick={() => {
                    setShowConsultationDetails(false);
                    if (onOpenConsultation) {
                      onOpenConsultation();
                    }
                  }}
                  className="flex-1 bg-medical-primary hover:bg-medical-primary/90"
                >
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Acessar Prontuário Completo
                </Button>
              )}

              {/* Botão Fechar */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowConsultationDetails(false)}
                className="px-4"
              >
                Fechar
              </Button>
            </div>

            {/* Seção de Anamnese, Prescrição e Observações com Scroll Fixo */}
            {(selectedConsultation.anamnesis || selectedConsultation.prescription || selectedConsultation.observations) && (
              <div className="border rounded-lg bg-gray-50">
                <Label className="text-sm font-medium text-gray-600 mb-3 block p-4 pb-0">Detalhes da Consulta</Label>
                <div className="px-4 pb-4 h-[250px] overflow-y-auto">
                  <div className="space-y-4">
                    {/* Anamnese */}
                    {selectedConsultation.anamnesis && isDoctor && (
                      <div>
                        <Label className="text-xs font-medium text-gray-500 uppercase">Anamnese</Label>
                        <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{selectedConsultation.anamnesis}</p>
                      </div>
                    )}

                    {/* Prescrição */}
                    {selectedConsultation.prescription && isDoctor && (
                      <div>
                        <Label className="text-xs font-medium text-gray-500 uppercase">Prescrição</Label>
                        <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{selectedConsultation.prescription}</p>
                      </div>
                    )}

                    {/* Observações */}
                    {selectedConsultation.observations && (
                      <div>
                        <Label className="text-xs font-medium text-gray-500 uppercase">Observações</Label>
                        <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{selectedConsultation.observations}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}

