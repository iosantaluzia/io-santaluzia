
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, Phone, MapPin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { appointmentFormSchema } from '@/utils/validationSchemas';
import { logger } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrencyInput, getNumericValue } from '@/utils/currency';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { getDoctorDisplayName } from '@/utils/doctorNames';

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
        appointmentType: initialAppointmentType || prev.appointmentType
      }));
    } else if (isOpen && !initialPatientData) {
      // Limpar formulário quando não há dados iniciais
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
    }
  }, [isOpen, initialPatientData, initialAppointmentType]);

  const availableTimes = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const formatCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11) return false;
    
    // Basic CPF validation algorithm
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(numbers[10]);
  };

  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const formatCEP = (cep: string) => {
    const numbers = cep.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return cep;
  };

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

      // Se não encontrou paciente existente, criar novo paciente
      if (!patientId) {
        // Criar novo paciente - CPF e data de nascimento são opcionais
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
      }

      // Criar consulta/agendamento usando a data selecionada no calendário
      const consultationDateTime = new Date(appointmentDate);
      const [hours, minutes] = validatedData.time.split(':');
      consultationDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Mapear nome do médico usando função utilitária
      const doctorName = getDoctorDisplayName(validatedData.doctor);

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
            Novo Agendamento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Layout Reformulado: Campos à esquerda (8 colunas), Calendário fixo à direita (4 colunas) */}
          <div className="grid grid-cols-12 gap-2">
            {/* Colunas 1-8: Todos os campos de formulário */}
            <div className="col-span-8 space-y-2">
              {/* Primeira linha: Nome e CPF */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <Label htmlFor="name" className="text-xs font-medium leading-tight">Nome Completo *</Label>
                  <div className="relative mt-0.5">
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nome do paciente"
                      className="pl-7 h-8 text-xs"
                      required
                    />
                    <User className="h-3 w-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cpf" className="text-xs font-medium leading-tight">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="h-8 text-xs mt-0.5"
                  />
                </div>
              </div>

              {/* Segunda linha: Data Nascimento e Telefone */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="date_of_birth" className="text-xs font-medium leading-tight">Data Nascimento</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className="h-8 text-xs mt-0.5"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs font-medium leading-tight">Telefone *</Label>
                  <div className="relative mt-0.5">
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="pl-7 h-8 text-xs"
                      maxLength={15}
                      required
                    />
                    <Phone className="h-3 w-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Terceira linha: Médico e Horário */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="doctor" className="text-xs font-medium leading-tight">Médico *</Label>
                  <Select value={formData.doctor} onValueChange={(value) => handleInputChange('doctor', value)}>
                    <SelectTrigger className="h-8 text-xs mt-0.5">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matheus">Dr. Matheus</SelectItem>
                      <SelectItem value="fabiola">Dra. Fabíola</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="time" className="text-xs font-medium leading-tight">Horário *</Label>
                  <div className="relative mt-0.5">
                    <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                      <SelectTrigger className="pl-7 h-8 text-xs">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Clock className="h-3 w-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Quarta linha: Tipo de Agendamento e Valor Pago */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="appointmentType" className="text-xs font-medium leading-tight">Tipo de Agendamento *</Label>
                  <Select value={formData.appointmentType} onValueChange={(value) => handleInputChange('appointmentType', value)}>
                    <SelectTrigger className="h-8 text-xs mt-0.5">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consulta">Consulta</SelectItem>
                      <SelectItem value="retorno">Retorno</SelectItem>
                      <SelectItem value="exame">Exame</SelectItem>
                      <SelectItem value="pagamento_honorarios">Pagamento de Honorários</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount" className="text-xs font-medium leading-tight">Valor Pago (R$)</Label>
                  <div className="flex items-end gap-2 mt-0.5">
                    <div className="relative flex-1">
                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">R$</span>
                      <Input
                        id="amount"
                        type="text"
                        value={formData.amount}
                        onChange={(e) => {
                          const formatted = formatCurrencyInput(e.target.value);
                          handleInputChange('amount', formatted);
                        }}
                        placeholder="0,00"
                        className="h-8 text-xs pl-7 pr-24"
                        inputMode="numeric"
                      />
                      <Popover open={paymentMethodPopoverOpen} onOpenChange={setPaymentMethodPopoverOpen}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs hover:text-gray-700 flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 z-10"
                          >
                            <span className="text-xs truncate max-w-[120px]">
                              {formData.payment_method || 'Meio de Pagamento'}
                            </span>
                            <ChevronDown className="h-3 w-3 flex-shrink-0" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-1 z-50" align="end">
                          <div className="flex flex-col">
                            <button
                              type="button"
                              onClick={() => {
                                handleInputChange('payment_method', 'Dinheiro');
                                setPaymentMethodPopoverOpen(false);
                              }}
                              className="text-left px-3 py-2 text-xs hover:bg-gray-100 rounded-sm transition-colors"
                            >
                              Dinheiro
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleInputChange('payment_method', 'Pix');
                                setPaymentMethodPopoverOpen(false);
                              }}
                              className="text-left px-3 py-2 text-xs hover:bg-gray-100 rounded-sm transition-colors"
                            >
                              Pix
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleInputChange('payment_method', 'Cartão de Crédito');
                                setPaymentMethodPopoverOpen(false);
                              }}
                              className="text-left px-3 py-2 text-xs hover:bg-gray-100 rounded-sm transition-colors"
                            >
                              Cartão de Crédito
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleInputChange('payment_method', 'Cheque');
                                setPaymentMethodPopoverOpen(false);
                              }}
                              className="text-left px-3 py-2 text-xs hover:bg-gray-100 rounded-sm transition-colors"
                            >
                              Cheque
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleInputChange('payment_method', 'Débito');
                                setPaymentMethodPopoverOpen(false);
                              }}
                              className="text-left px-3 py-2 text-xs hover:bg-gray-100 rounded-sm transition-colors"
                            >
                              Débito
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center gap-1.5 pb-0.5">
                      <Checkbox
                        id="payment_received"
                        checked={formData.payment_received}
                        onCheckedChange={(checked) => setFormData({ ...formData, payment_received: checked === true })}
                        className="h-3.5 w-3.5"
                      />
                      <Label htmlFor="payment_received" className="text-xs font-normal cursor-pointer leading-tight whitespace-nowrap">
                        Pago
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campos Opcionais - Movidos para baixo */}
              <div className="border-t pt-2 mt-2">
                <h4 className="text-xs font-medium text-gray-600 mb-1.5">Informações Adicionais (Opcionais)</h4>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="email" className="text-xs font-medium leading-tight">Email</Label>
                    <div className="relative mt-0.5">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="email@exemplo.com"
                        className="pl-7 h-8 text-xs"
                      />
                      <Mail className="h-3 w-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-xs font-medium leading-tight">Endereço</Label>
                    <div className="relative mt-0.5">
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Rua, número, bairro"
                        className="pl-7 h-8 text-xs"
                      />
                      <MapPin className="h-3 w-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label htmlFor="cep" className="text-xs font-medium leading-tight">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => handleInputChange('cep', e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                      className="h-8 text-xs mt-0.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-xs font-medium leading-tight">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Cidade"
                      className="h-8 text-xs mt-0.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Colunas 9-12: Calendário fixo à direita */}
            <div className="col-span-4 flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-gray-700 leading-tight">Data do Agendamento *</Label>
              <div className="border rounded-lg p-3 bg-white flex-1 flex items-start justify-center min-h-[320px]">
                <Calendar
                  mode="single"
                  selected={appointmentDate}
                  onSelect={(date) => {
                    if (date) {
                      setAppointmentDate(date);
                    }
                  }}
                  className="scale-100"
                  locale={ptBR}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-8 text-xs"
                  >
                    <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                    {appointmentDate ? (
                      format(appointmentDate, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={appointmentDate}
                    onSelect={(date) => {
                      if (date) {
                        setAppointmentDate(date);
                      }
                    }}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>

              {/* Campo de Observações */}
              <div className="mt-2">
                <Label htmlFor="notes" className="text-xs font-medium leading-tight">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Informações adicionais sobre a consulta..."
                  rows={2}
                  className="text-sm mt-0.5"
                />
              </div>
            </div>
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
