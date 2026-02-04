import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatCurrencyInput } from '@/utils/currency';
import { translateStatus, getStatusColor, examTypeLabels } from '@/utils/statusUtils';
import { PatientSummaryHeader } from './patient-details/PatientSummaryHeader';
import { ConsultationHistoryList } from './patient-details/ConsultationHistoryList';
import { AppointmentDetails } from './patient-details/AppointmentDetails';
import { ConsultationDetailsModal } from './patient-details/ConsultationDetailsModal';
import { EditAppointmentModal } from './patient-details/EditAppointmentModal';

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

export function PatientDetailsModal({
  isOpen,
  onClose,
  patient,
  onOpenConsultation,
  onPatientUpdate,
  onSectionChange,
  onOpenConsultationForPatient,
  onScheduleReturn
}: PatientDetailsModalProps) {
  const { appUser } = useAuth();
  const isDoctor = appUser?.role === 'doctor' || appUser?.role === 'admin';
  const isSecretary = appUser?.role === 'secretary';

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
    cep?: string;
    city?: string;
    date_of_birth?: string;
  }>({
    name: patient.name,
    cpf: patient.cpf || '',
    phone: patient.phone || '',
    email: patient.email || '',
    address: patient.address || '',
  });

  const [saving, setSaving] = useState(false);
  const [showConsultationDetails, setShowConsultationDetails] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  // Estados para edição de agendamento
  const [showEditModal, setShowEditModal] = useState(false);
  const [savingAppointment, setSavingAppointment] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>({});
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [paymentMethodPopoverOpen, setPaymentMethodPopoverOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Função para parsear endereço completo
  const parseAddress = (addressStr: string) => {
    if (!addressStr) return { address: '', cep: '', city: '' };

    // Tentar extrair CEP
    const cepMatch = addressStr.match(/(\d{5}-?\d{3})/);
    const cep = cepMatch ? cepMatch[0] : '';

    // Tentar extrair cidade (assumindo formato comum: Rua, Num, Bairro - Cidade/UF)
    let city = '';
    const cityParts = addressStr.split(' - ');
    if (cityParts.length > 1) {
      city = cityParts[cityParts.length - 1].split('/')[0].trim();
    }

    // Tentar limpar a rua
    let address = addressStr.split(',')[0].trim();

    return { address, cep, city };
  };

  const fetchPatientData = useCallback(async () => {
    // 1. Priorizar busca pelo ID se disponível
    if (patient.patientId) {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('id, name, cpf, phone, email, address, date_of_birth')
          .eq('id', patient.patientId)
          .maybeSingle();

        if (data) {
          setPatientId(data.id);
          const parsedAddress = parseAddress(data.address || '');
          setEditingPatient({
            name: data.name,
            cpf: data.cpf || '',
            phone: data.phone || '',
            email: data.email || '',
            address: parsedAddress.address || data.address || '',
            cep: parsedAddress.cep,
            city: parsedAddress.city,
            date_of_birth: data.date_of_birth || ''
          });
          return data.id;
        }
      } catch (error) {
        console.error('Erro ao buscar por ID:', error);
      }
    }

    // 2. Fallback para CPF
    if (patient.cpf) {
      try {
        const cleanCPF = patient.cpf.replace(/\D/g, '');
        const { data, error } = await supabase
          .from('patients')
          .select('id, name, cpf, phone, email, address, date_of_birth')
          .or(`cpf.eq."${patient.cpf}",cpf.eq."${cleanCPF}"`)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setPatientId(data.id);
          const parsedAddress = parseAddress(data.address || '');
          setEditingPatient({
            name: data.name,
            cpf: data.cpf || '',
            phone: data.phone || '',
            email: data.email || '',
            address: parsedAddress.address || data.address || '',
            cep: parsedAddress.cep,
            city: parsedAddress.city,
            date_of_birth: data.date_of_birth || ''
          });
          return data.id;
        }
      } catch (error) {
        console.error('Erro ao buscar por CPF:', error);
      }
    }

    // 3. Fallback final para os dados do prop
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
    return patient.patientId || null;
  }, [patient]);

  const fetchPatientHistory = useCallback(async () => {
    try {
      setLoading(true);

      const foundPatientId = await fetchPatientData();

      if (!foundPatientId) {
        setConsultations([]);
        setExams([]);
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

      if (consultationsError) throw consultationsError;
      setConsultations(consultationsData || []);

      // Buscar exames do paciente
      const { data: examsData, error: examsError } = await supabase
        .from('patient_exams')
        .select('id, exam_date, exam_type, doctor_name, status')
        .eq('patient_id', foundPatientId)
        .order('exam_date', { ascending: false })
        .limit(5);

      if (examsError) throw examsError;
      setExams(examsData || []);

    } catch (error) {
      console.error('Erro ao buscar histórico do paciente:', error);
      toast.error('Erro ao carregar histórico');
    } finally {
      setLoading(false);
    }
  }, [fetchPatientData]);

  useEffect(() => {
    if (isOpen) {
      fetchPatientHistory();
      setIsEditing(false);
      setShowConsultationDetails(false);
      setShowEditModal(false);
      setShowDeleteConfirm(false);
    }
  }, [isOpen, fetchPatientHistory]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const fullAddress = `${editingPatient.address}${editingPatient.cep ? `, CEP: ${editingPatient.cep}` : ''}${editingPatient.city ? ` - ${editingPatient.city}` : ''}`;

      if (patientId) {
        const { error } = await supabase
          .from('patients')
          .update({
            name: editingPatient.name,
            cpf: editingPatient.cpf,
            phone: editingPatient.phone,
            email: editingPatient.email,
            address: fullAddress,
            date_of_birth: editingPatient.date_of_birth || null
          })
          .eq('id', patientId);

        if (error) throw error;
        toast.success('Dados atualizados com sucesso!');
      } else {
        // Se não tem ID, criar novo paciente
        const { data, error } = await supabase
          .from('patients')
          .insert({
            name: editingPatient.name,
            cpf: editingPatient.cpf,
            phone: editingPatient.phone,
            email: editingPatient.email,
            address: fullAddress,
            date_of_birth: editingPatient.date_of_birth || null
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setPatientId(data.id);
        toast.success('Paciente cadastrado com sucesso!');
      }

      setIsEditing(false);
      if (onPatientUpdate) onPatientUpdate();
      await fetchPatientHistory();
    } catch (error: any) {
      console.error('Erro ao salvar paciente:', error);
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditAppointment = async () => {
    if (!patient.consultationId) {
      toast.error('Agendamento não encontrado para edição');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('id', patient.consultationId)
        .single();

      if (error) throw error;

      if (data) {
        setEditingAppointment({
          id: data.id,
          date: new Date(data.consultation_date),
          time: new Date(data.consultation_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          doctor: data.doctor_name.toLowerCase().includes('matheus') ? 'matheus' : 'fabiola',
          appointmentType: data.appointment_type || (data.diagnosis === 'Exame' ? 'exame' : 'consulta'),
          amount: data.amount ? data.amount.toFixed(2).replace('.', ',') : '',
          payment_received: data.payment_received || false,
          status: data.status,
          observations: data.observations || ''
        });

        // Gerar horários disponíveis
        const times = [];
        for (let h = 8; h <= 18; h++) {
          times.push(`${h.toString().padStart(2, '0')}:00`);
          times.push(`${h.toString().padStart(2, '0')}:30`);
        }
        setAvailableTimes(times);
        setShowEditModal(true);
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados do agendamento:', error);
      toast.error('Erro ao carregar agendamento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAppointment = async () => {
    try {
      setSavingAppointment(true);

      const [hours, minutes] = editingAppointment.time.split(':');
      const consultationDate = new Date(editingAppointment.date);
      consultationDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const numericAmount = editingAppointment.amount ? parseFloat(editingAppointment.amount.replace('.', '').replace(',', '.')) : null;

      const { error } = await supabase
        .from('consultations')
        .update({
          consultation_date: consultationDate.toISOString(),
          doctor_name: editingAppointment.doctor === 'matheus' ? 'Dr. Matheus' : 'Dra. Fabíola',
          appointment_type: editingAppointment.appointmentType,
          amount: numericAmount,
          payment_received: editingAppointment.payment_received,
          status: editingAppointment.status,
          observations: editingAppointment.observations
        })
        .eq('id', editingAppointment.id);

      if (error) throw error;

      toast.success('Agendamento atualizado com sucesso!');
      setShowEditModal(false);

      if (onPatientUpdate) await onPatientUpdate();
      await fetchPatientHistory();
    } catch (error: any) {
      console.error('Erro ao salvar agendamento:', error);
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setSavingAppointment(false);
    }
  };

  const handleDeleteAppointment = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAppointment = async () => {
    if (!patient.consultationId) return;

    try {
      setLoading(true);
      setShowDeleteConfirm(false);

      const { data, error } = await supabase
        .from('consultations')
        .delete()
        .eq('id', patient.consultationId)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        toast.error('Não foi possível remover o agendamento.');
        return;
      }

      toast.success('Agendamento removido com sucesso!');
      if (onPatientUpdate) await onPatientUpdate();
      await fetchPatientHistory();
      onClose();

    } catch (error: any) {
      console.error('Erro ao remover agendamento:', error);
      toast.error('Erro ao remover: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneForWhatsApp = (phone: string): string => {
    if (!phone) return '';
    const numbers = phone.replace(/\D/g, '');
    if (numbers.startsWith('55')) return numbers;
    return '55' + numbers;
  };

  const openWhatsApp = (phone: string) => {
    const formattedPhone = formatPhoneForWhatsApp(phone);
    const message = `Olá! Gostaria de falar sobre o agendamento no Instituto de Olhos Santa Luzia.`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const isTodayAppointment = (): boolean => {
    const today = new Date();
    const apptDate = patient.appointmentDate ? new Date(patient.appointmentDate) : new Date();

    return (
      today.getDate() === apptDate.getDate() &&
      today.getMonth() === apptDate.getMonth() &&
      today.getFullYear() === apptDate.getFullYear()
    );
  };

  const canEditCurrentConsultation = (): boolean => {
    if (!consultations.some(c => c.status === 'in_progress' || c.status === 'completed')) return true;

    const today = new Date();
    const todayConsultation = consultations.find(c => {
      const apptDate = new Date(c.consultation_date);
      return (
        apptDate.getDate() === today.getDate() &&
        apptDate.getMonth() === today.getMonth() &&
        apptDate.getFullYear() === today.getFullYear()
      );
    });

    if (!todayConsultation || !todayConsultation.started_at) return true;
    const startedAt = new Date(todayConsultation.started_at);
    const twelveHoursLater = new Date(startedAt.getTime() + 12 * 60 * 60 * 1000);
    return new Date() < twelveHoursLater;
  };

  const isConsultationStarted = (): boolean => {
    const today = new Date();
    return consultations.some(c => {
      const apptDate = new Date(c.consultation_date);
      return (
        apptDate.getDate() === today.getDate() &&
        apptDate.getMonth() === today.getMonth() &&
        apptDate.getFullYear() === today.getFullYear() &&
        (c.status === 'in_progress' || c.status === 'completed' || c.status === 'in_attendance')
      );
    });
  };

  const handleStartCurrentConsultationAction = () => {
    if (!patientId || !onOpenConsultationForPatient) return;
    const today = new Date();
    const todayConsultation = consultations.find(c => {
      const apptDate = new Date(c.consultation_date);
      return (
        apptDate.getDate() === today.getDate() &&
        apptDate.getMonth() === today.getMonth() &&
        apptDate.getFullYear() === today.getFullYear()
      );
    });
    onClose();
    onOpenConsultationForPatient(patientId, todayConsultation ? todayConsultation.id : patient.consultationId);
    if (onSectionChange) onSectionChange('pacientes');
  };

  const handleScheduleReturnAction = () => {
    if (!onScheduleReturn) return;
    const pData = {
      name: editingPatient.name || patient.name,
      cpf: editingPatient.cpf || patient.cpf,
      date_of_birth: editingPatient.date_of_birth || (patient.birthDate ? patient.birthDate.split('/').reverse().join('-') : ''),
      phone: editingPatient.phone || patient.phone,
      email: editingPatient.email || patient.email,
      address: editingPatient.address || patient.address,
    };
    onClose();
    onScheduleReturn(pData);
    toast.success('Abrindo formulário de agendamento de retorno');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
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
            <div className={`grid overflow-hidden ${isEditing ? 'grid-cols-1 gap-3' : 'grid-cols-1 md:grid-cols-2 gap-6'}`}>

              <PatientSummaryHeader
                isEditing={isEditing}
                editingPatient={editingPatient}
                setEditingPatient={setEditingPatient}
                patient={patient}
                setIsEditing={setIsEditing}
                handleSave={handleSave}
                handleCancel={handleCancelEdit}
                saving={saving}
                openWhatsApp={openWhatsApp}
              />

              {!isEditing && (
                <ConsultationHistoryList
                  loading={loading}
                  consultations={consultations}
                  exams={exams}
                  setSelectedConsultation={setSelectedConsultation}
                  setShowConsultationDetails={setShowConsultationDetails}
                  getStatusColor={getStatusColor}
                  translateStatus={translateStatus}
                  examTypeLabels={examTypeLabels}
                />
              )}
            </div>

            {!isEditing && (patient.consultationId || patient.time || patient.appointmentDate) && (
              <AppointmentDetails
                patient={patient}
                isDoctor={isDoctor}
                isSecretary={isSecretary}
                isTodayAppointment={isTodayAppointment}
                canEditCurrentConsultation={canEditCurrentConsultation}
                isConsultationStarted={isConsultationStarted}
                handleEditAppointment={handleEditAppointment}
                handleDeleteAppointment={handleDeleteAppointment}
                handleStartCurrentConsultation={handleStartCurrentConsultationAction}
                handleScheduleReturn={onScheduleReturn ? handleScheduleReturnAction : undefined}
                getStatusColor={getStatusColor}
                translateStatus={translateStatus}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <EditAppointmentModal
        isOpen={showEditModal}
        onOpenChange={setShowEditModal}
        patientName={patient.name}
        editingAppointment={editingAppointment}
        setEditingAppointment={setEditingAppointment}
        availableTimes={availableTimes}
        paymentMethodPopoverOpen={paymentMethodPopoverOpen}
        setPaymentMethodPopoverOpen={setPaymentMethodPopoverOpen}
        formatCurrencyInput={formatCurrencyInput}
        handleSaveAppointment={handleSaveAppointment}
        savingAppointment={savingAppointment}
      />

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
            </div>
            <p className="text-sm text-red-600 font-medium">⚠️ Esta ação não pode ser desfeita.</p>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={confirmDeleteAppointment} disabled={loading} variant="destructive" className="flex-1">
              {loading ? 'Removendo...' : 'Sim, Remover'}
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={loading} className="flex-1">
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConsultationDetailsModal
        isOpen={showConsultationDetails}
        onOpenChange={setShowConsultationDetails}
        patientName={patient.name}
        selectedConsultation={selectedConsultation}
        getStatusColor={getStatusColor}
        translateStatus={translateStatus}
        isDoctor={isDoctor}
        onOpenConsultationForPatient={onOpenConsultationForPatient}
        onOpenConsultation={onOpenConsultation}
        onSectionChange={onSectionChange}
        patientId={patientId}
      />
    </>
  );
}
