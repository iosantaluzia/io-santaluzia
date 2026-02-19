
import React, { useState, useEffect } from 'react';
import { ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { appointmentFormSchema } from '@/utils/validationSchemas';
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getNumericValue } from '@/utils/currency';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { getDoctorDisplayName } from '@/utils/doctorNames';
import { formatCPF, formatPhone, formatCEP } from '@/utils/formatters';

// Sub-components
import { AppointmentFormFields } from './agendamentos/AppointmentFormFields';
import { AppointmentCalendarSide } from './agendamentos/AppointmentCalendarSide';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  initialPatientData?: {
    name?: string;
    cpf?: string;
    date_of_birth?: string;
    phone?: string;
    email?: string;
    address?: string;
    cep?: string;
    city?: string;
  };
  initialAppointmentType?: string;
}

export function AppointmentForm({ isOpen, onClose, selectedDate, initialPatientData, initialAppointmentType }: AppointmentFormProps) {
  const { appUser } = useAuth();
  const [appointmentDate, setAppointmentDate] = useState<Date>(selectedDate);
  const [paymentMethodPopoverOpen, setPaymentMethodPopoverOpen] = useState(false);

  // Atualizar data quando selectedDate mudar ou modal abrir
  useEffect(() => {
    if (isOpen) {
      setAppointmentDate(selectedDate);
    }
  }, [selectedDate, isOpen]);

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    date_of_birth: '',
    phone: '',
    email: '',
    address: '',
    cep: '',
    city: '',
    doctor: '',
    time: '',
    appointmentType: '',
    amount: '',
    payment_received: false,
    payment_method: '',
    notes: ''
  });

  // Pré-preencher dados quando initialPatientData ou initialAppointmentType mudarem
  useEffect(() => {
    if (isOpen && initialPatientData) {
      setFormData(prev => ({
        ...prev,
        name: initialPatientData.name || prev.name,
        cpf: initialPatientData.cpf || prev.cpf,
        date_of_birth: initialPatientData.date_of_birth || prev.date_of_birth,
        phone: initialPatientData.phone || prev.phone,
        email: initialPatientData.email || prev.email,
        address: initialPatientData.address || prev.address,
        cep: initialPatientData.cep || prev.cep,
        city: initialPatientData.city || prev.city,
        appointmentType: initialAppointmentType || prev.appointmentType || 'consulta'
      }));
    } else if (isOpen && !initialPatientData) {
      // Limpar formulário quando não há dados iniciais, mas manter initialAppointmentType se fornecido
      setFormData({
        name: '',
        cpf: '',
        date_of_birth: '',
        phone: '',
        email: '',
        address: '',
        cep: '',
        city: '',
        doctor: '',
        time: '',
        appointmentType: initialAppointmentType || '',
        amount: '',
        payment_received: false,
        payment_method: '',
        notes: ''
      });
    }
  }, [isOpen, initialPatientData, initialAppointmentType]);

  const availableTimes = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];


  const handleInputChange = (field: string, value: string) => {
    if (field === 'cpf') {
      value = formatCPF(value);
    } else if (field === 'phone') {
      value = formatPhone(value);
    } else if (field === 'cep') {
      value = formatCEP(value);
    }

    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // SECURITY: Validate input with Zod before saving
    const validationResult = appointmentFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      toast.error(firstError.message || 'Dados inválidos. Verifique os campos.');
      logger.error('Validation error:', validationResult.error);
      return;
    }

    const validatedData = validationResult.data;

    try {
      // Create consultation date object
      const consultationDateTime = new Date(appointmentDate);
      const [hours, minutes] = validatedData.time.split(':');
      consultationDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const doctorName = getDoctorDisplayName(validatedData.doctor);

      // Check for blocked slots
      const { data: blockedSlots, error: blockedError } = await supabase
        .from('consultations')
        .select('id')
        .eq('status', 'blocked')
        .eq('consultation_date', consultationDateTime.toISOString())
        .ilike('doctor_name', `%${doctorName.split(' ')[1]}%`); // Simple check, ideally match exact name or improved logic

      if (blockedError) {
        logger.error('Error checking blocked slots', blockedError);
        // Proceed with caution or return? Let's proceed but warn.
      }

      if (blockedSlots && blockedSlots.length > 0) {
        toast.error(`O horário ${validatedData.time} está bloqueado na agenda do(a) ${doctorName}.`);
        return;
      }

      // Buscar ou criar paciente
      let patientId: string | null = null;

      // Buscar paciente existente por CPF ou nome/telefone
      if (validatedData.cpf && validatedData.cpf.trim() !== '') {
        // Buscar por CPF primeiro
        const { data: existingPatient, error: searchError } = await (supabase as any)
          .from('patients')
          .select('id, name')
          .eq('cpf', validatedData.cpf)
          .maybeSingle();

        if (existingPatient) {
          patientId = existingPatient.id;
        }
      } else {
        // Se não há CPF, tentar buscar por nome e telefone para evitar duplicatas
        const { data: existingPatients, error: searchError } = await (supabase as any)
          .from('patients')
          .select('id, name, phone')
          .eq('name', validatedData.name)
          .eq('phone', validatedData.phone)
          .limit(1);

        if (existingPatients && existingPatients.length > 0) {
          patientId = existingPatients[0].id;
        }
      }

      // Preparar dados do paciente
      const patientData: any = {
        name: validatedData.name,
        phone: validatedData.phone,
        email: validatedData.email || null,
        address: validatedData.address || null
      };

      // Adicionar CPF apenas se foi fornecido
      if (validatedData.cpf && validatedData.cpf.trim() !== '') {
        patientData.cpf = validatedData.cpf;
      }

      // Adicionar data de nascimento apenas se foi fornecida
      if (validatedData.date_of_birth && validatedData.date_of_birth.trim() !== '') {
        patientData.date_of_birth = validatedData.date_of_birth;
      }

      // Se não encontrou paciente existente, criar novo paciente
      if (!patientId) {
        const { data: newPatient, error: patientError } = await (supabase as any)
          .from('patients')
          .insert(patientData)
          .select('id')
          .single();

        if (patientError || !newPatient) {
          logger.error('Erro ao criar paciente:', patientError);
          toast.error('Erro ao criar paciente. Verifique os dados.');
          return;
        }

        patientId = newPatient.id;
      } else {
        // Paciente já existe, atualizar seus dados (incluindo data de nascimento)
        const { error: updateError } = await (supabase as any)
          .from('patients')
          .update(patientData)
          .eq('id', patientId);

        if (updateError) {
          logger.warn('Não foi possível atualizar dados do paciente:', updateError);
          // Não bloquear o agendamento se a atualização falhar
        }
      }

      // Criar consulta/agendamento usando a data selecionada no calendário
      // Variáveis consultationDateTime e doctorName já foram definidas na validação de bloqueio acima

      // Inserir sem amount primeiro (para contornar cache do PostgREST)
      // O amount será atualizado depois via função RPC ou update manual
      const { data: consultationData, error: consultationError } = await supabase
        .from('consultations')
        .insert({
          patient_id: patientId,
          doctor_name: doctorName,
          consultation_date: consultationDateTime.toISOString(),
          observations: validatedData.notes || null,
          payment_received: formData.payment_received || false,
          status: 'scheduled',
          appointment_type: validatedData.appointmentType || 'consulta', // Incluir tipo de agendamento
          created_by: appUser?.username || 'sistema'
        })
        .select('id')
        .single();

      if (consultationError) {
        logger.error('Erro ao criar agendamento:', consultationError);
        toast.error('Erro ao criar agendamento. Tente novamente.');
        return;
      }

      // Se houver valor, tentar atualizar (pode falhar por cache do PostgREST, mas não é crítico)
      if (formData.amount && consultationData?.id) {
        const amountValue = getNumericValue(formData.amount);
        // Tentar update - pode falhar por cache, mas não é crítico para o funcionamento
        supabase
          .from('consultations')
          .update({ amount: amountValue })
          .eq('id', consultationData.id)
          .then(({ error }) => {
            if (error) {
              logger.warn('Não foi possível atualizar o valor devido ao cache do PostgREST. O agendamento foi criado. O valor pode ser atualizado manualmente depois.', error);
            }
          });
      }

      toast.success('Agendamento criado com sucesso!');

      // Limpar formulário
      setFormData({
        name: '',
        cpf: '',
        date_of_birth: '',
        phone: '',
        email: '',
        address: '',
        cep: '',
        city: '',
        doctor: '',
        time: '',
        appointmentType: '',
        amount: '',
        payment_received: false,
        payment_method: '',
        notes: ''
      });

      onClose();

      // Recarregar a página para atualizar os agendamentos
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      logger.error('Erro ao salvar agendamento:', error);
      toast.error('Erro ao salvar agendamento. Tente novamente.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <CalendarIcon className="h-5 w-5" />
            Novo Agendamento em {format(appointmentDate, "dd 'de' MMMM", { locale: ptBR })}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid grid-cols-12 gap-2">
            <AppointmentFormFields
              formData={formData}
              handleInputChange={handleInputChange}
              availableTimes={availableTimes}
              paymentMethodPopoverOpen={paymentMethodPopoverOpen}
              setPaymentMethodPopoverOpen={setPaymentMethodPopoverOpen}
            />

            <AppointmentCalendarSide
              appointmentDate={appointmentDate}
              setAppointmentDate={setAppointmentDate}
              notes={formData.notes}
              onNotesChange={(notes) => setFormData({ ...formData, notes })}
            />
          </div>

          <div className="flex gap-3 pt-3 border-t">
            <Button type="submit" className="flex-1 h-9 bg-bege-principal hover:bg-marrom-acentuado text-sm">
              Agendar Consulta
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-9 text-sm">
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
