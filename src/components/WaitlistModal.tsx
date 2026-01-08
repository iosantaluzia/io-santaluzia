import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Phone, FileText, Clock, Calendar, Plus, X, Upload, Edit, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { bulkInsertWaitlistPatients } from '@/utils/bulkInsertWaitlist';
import { getDoctorDisplayName } from '@/utils/doctorNames';
import {
  getLocalWaitlistEntries,
  addLocalWaitlistEntry,
  incrementLocalContactAttempts,
  updateLocalWaitlistEntry,
  initializeLocalWaitlist
} from '@/utils/localWaitlistStorage';

interface WaitlistEntry {
  id: string;
  patient_name: string;
  phone: string;
  observations?: string;
  contact_attempts: number;
  status: string;
  patient_id?: string;
  created_at: string;
}

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleComplete?: () => void;
}

export function WaitlistModal({ isOpen, onClose, onScheduleComplete }: WaitlistModalProps) {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [schedulingEntry, setSchedulingEntry] = useState<WaitlistEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  
  const [newEntry, setNewEntry] = useState({
    patient_name: '',
    phone: '',
    observations: ''
  });
  const [editingEntry, setEditingEntry] = useState<WaitlistEntry | null>(null);
  const [editForm, setEditForm] = useState({
    patient_name: '',
    phone: '',
    observations: ''
  });

  const availableTimes = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const formatPhone = (phone: string) => {
    // Remover espaços extras e normalizar
    let cleanPhone = phone.trim().replace(/\s+/g, '');
    
    // Se já está formatado, manter
    if (cleanPhone.includes('(') && cleanPhone.includes(')')) {
      return cleanPhone;
    }
    
    const numbers = cleanPhone.replace(/\D/g, '');
    
    // Telefone internacional (começa com +)
    if (cleanPhone.startsWith('+')) {
      return cleanPhone;
    }
    
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length === 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const fetchWaitlist = useCallback(async () => {
    try {
      setLoading(true);
      
      // Tentar buscar do Supabase primeiro
      try {
        const { data, error } = await supabase
          .from('waitlist')
          .select('*')
          .eq('status', 'waiting')
          .order('created_at', { ascending: true });

        if (error) {
          throw error; // Vai para o catch para usar localStorage
        }

        if (data && data.length > 0) {
          setEntries(data);
          return;
        }
      } catch (supabaseError: any) {
        // Se Supabase não estiver disponível, usar localStorage
        if (supabaseError?.code === 'PGRST205' || supabaseError?.message?.includes('Could not find the table')) {
          console.log('⚠️  Supabase não disponível. Usando armazenamento local...');
        }
      }

      // Fallback para localStorage
      const localEntries = getLocalWaitlistEntries()
        .filter(e => e.status === 'waiting')
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      
      setEntries(localEntries);
      
    } catch (error: any) {
      console.error('Erro ao carregar lista de espera:', error);
      // Tentar localStorage como último recurso
      const localEntries = getLocalWaitlistEntries()
        .filter(e => e.status === 'waiting')
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      setEntries(localEntries);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvailableSlots = useCallback(async (date: Date, doctor: string) => {
    if (!doctor) return;

    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data: consultations } = await supabase
        .from('consultations')
        .select('consultation_date')
        .gte('consultation_date', startOfDay.toISOString())
        .lte('consultation_date', endOfDay.toISOString())
        .like('doctor_name', `%${doctor}%`);

      const bookedTimes = new Set(
        (consultations || []).map(c => {
          const d = new Date(c.consultation_date);
          return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        })
      );

      const available = availableTimes.filter(time => !bookedTimes.has(time));
      setAvailableSlots(available);
      
      if (available.length > 0 && !selectedTime) {
        setSelectedTime(available[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
    }
  }, [availableTimes, selectedTime]);

  useEffect(() => {
    if (isOpen) {
      // Inicializar lista de espera local (adiciona pacientes se ainda não foram adicionados)
      initializeLocalWaitlist();
      
      // Tentar inserir pacientes no Supabase primeiro
      const autoInsertPatients = async () => {
        try {
          // Tentar Supabase primeiro
          const result = await bulkInsertWaitlistPatients(false);
          if (result.success && !result.tableNotFound) {
            await fetchWaitlist();
            return;
          }
        } catch (error: any) {
          // Se Supabase não estiver disponível, não é problema
          if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table')) {
            console.log('⚠️  Usando armazenamento local (Supabase não disponível)');
          }
        }
        
        // Usar localStorage como fallback
        fetchWaitlist();
      };

      autoInsertPatients();
      setShowAddForm(false);
      setSchedulingEntry(null);
      setEditingEntry(null); // Limpar edição ao abrir/fechar modal
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // fetchWaitlist é memoizado, não precisa estar nas dependências

  useEffect(() => {
    if (schedulingEntry && selectedDoctor) {
      fetchAvailableSlots(selectedDate, selectedDoctor);
    }
  }, [schedulingEntry, selectedDoctor, selectedDate, fetchAvailableSlots]);

  const handleBulkInsert = async () => {
    if (!confirm('Deseja adicionar todos os pacientes padrão à lista de espera? Esta operação pode demorar alguns segundos.')) {
      return;
    }

    try {
      const result = await bulkInsertWaitlistPatients(true);
      if (result.success) {
        fetchWaitlist();
      }
    } catch (error) {
      console.error('Erro ao inserir em lote:', error);
      toast.error('Erro ao inserir pacientes em lote');
    }
  };

  const handleAddEntry = async () => {
    if (!newEntry.patient_name || !newEntry.phone) {
      toast.error('Preencha nome e telefone');
      return;
    }

    try {
      // Tentar Supabase primeiro
      try {
        const { error } = await supabase
          .from('waitlist')
          .insert({
            patient_name: newEntry.patient_name,
            phone: formatPhone(newEntry.phone),
            observations: newEntry.observations || null,
            status: 'waiting',
            contact_attempts: 0
          });

        if (!error) {
          toast.success('Paciente adicionado à lista de espera');
          setNewEntry({ patient_name: '', phone: '', observations: '' });
          setShowAddForm(false);
          fetchWaitlist();
          return;
        }
        
        throw error;
      } catch (supabaseError: any) {
        // Se Supabase não estiver disponível, usar localStorage
        if (supabaseError?.code === 'PGRST205' || supabaseError?.message?.includes('Could not find the table')) {
          // Usar localStorage
          addLocalWaitlistEntry({
            patient_name: newEntry.patient_name,
            phone: formatPhone(newEntry.phone),
            observations: newEntry.observations || undefined,
            status: 'waiting',
            contact_attempts: 0
          });
          
          toast.success('Paciente adicionado à lista de espera (armazenamento local)');
          setNewEntry({ patient_name: '', phone: '', observations: '' });
          setShowAddForm(false);
          fetchWaitlist();
          return;
        }
        
        throw supabaseError;
      }
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error('Erro ao adicionar à lista de espera: ' + (error?.message || 'Erro desconhecido'));
    }
  };

  const handleIncrementContact = async (entry: WaitlistEntry) => {
    try {
      // Tentar Supabase primeiro
      try {
        const { error } = await supabase
          .from('waitlist')
          .update({ contact_attempts: entry.contact_attempts + 1 })
          .eq('id', entry.id);

        if (!error) {
          fetchWaitlist();
          return;
        }
        
        throw error;
      } catch (supabaseError: any) {
        // Se Supabase não estiver disponível, usar localStorage
        if (supabaseError?.code === 'PGRST205' || supabaseError?.message?.includes('Could not find the table')) {
          incrementLocalContactAttempts(entry.id);
          fetchWaitlist();
          return;
        }
        
        throw supabaseError;
      }
    } catch (error: any) {
      console.error('Erro:', error);
      // Tentar localStorage como fallback
      if (incrementLocalContactAttempts(entry.id)) {
        fetchWaitlist();
      }
    }
  };

  const handleEditClick = (entry: WaitlistEntry) => {
    setEditingEntry(entry);
    setEditForm({
      patient_name: entry.patient_name,
      phone: entry.phone,
      observations: entry.observations || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
    setEditForm({ patient_name: '', phone: '', observations: '' });
  };

  const handleSaveEdit = async () => {
    if (!editingEntry) return;

    if (!editForm.patient_name || !editForm.phone) {
      toast.error('Preencha nome e telefone');
      return;
    }

    try {
      // Tentar Supabase primeiro
      try {
        const { error } = await supabase
          .from('waitlist')
          .update({
            patient_name: editForm.patient_name,
            phone: formatPhone(editForm.phone),
            observations: editForm.observations || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEntry.id);

        if (!error) {
          toast.success('Paciente atualizado com sucesso');
          setEditingEntry(null);
          setEditForm({ patient_name: '', phone: '', observations: '' });
          fetchWaitlist();
          return;
        }
        
        throw error;
      } catch (supabaseError: any) {
        // Se Supabase não estiver disponível, usar localStorage
        if (supabaseError?.code === 'PGRST205' || supabaseError?.message?.includes('Could not find the table')) {
          updateLocalWaitlistEntry(editingEntry.id, {
            patient_name: editForm.patient_name,
            phone: formatPhone(editForm.phone),
            observations: editForm.observations || undefined
          });
          
          toast.success('Paciente atualizado com sucesso (armazenamento local)');
          setEditingEntry(null);
          setEditForm({ patient_name: '', phone: '', observations: '' });
          fetchWaitlist();
          return;
        }
        
        throw supabaseError;
      }
    } catch (error: any) {
      console.error('Erro ao atualizar paciente:', error);
      toast.error('Erro ao atualizar paciente: ' + (error?.message || 'Erro desconhecido'));
    }
  };

  const handleSchedule = async () => {
    if (!schedulingEntry || !selectedDoctor || !selectedTime || !selectedDate) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      // Buscar ou criar paciente
      let patientId = schedulingEntry.patient_id;
      
      if (!patientId) {
        // Buscar por telefone
        const phoneNumbers = schedulingEntry.phone.replace(/\D/g, '');
        const { data: existingPatient } = await supabase
          .from('patients')
          .select('id')
          .eq('phone', schedulingEntry.phone)
          .single();

        if (existingPatient) {
          patientId = existingPatient.id;
        } else {
          // Criar novo paciente com CPF temporário
          // Gerar CPF temporário único
          const generateTempCPF = () => {
            const timestamp = Date.now().toString();
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const numbers = (timestamp.slice(-8) + random).padStart(11, '0').slice(0, 11);
            return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
          };
          
          const { data: newPatient, error: patientError } = await supabase
            .from('patients')
            .insert({
              name: schedulingEntry.patient_name,
              phone: schedulingEntry.phone,
              cpf: generateTempCPF(), // CPF temporário único
              date_of_birth: '1990-01-01' // Data padrão
            })
            .select('id')
            .single();

          if (patientError || !newPatient) {
            toast.error('Erro ao criar paciente');
            return;
          }

          patientId = newPatient.id;
        }
      }

      // Criar consulta
      const consultationDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      consultationDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const doctorName = getDoctorDisplayName(selectedDoctor);

      const { data: consultation, error: consultationError } = await supabase
        .from('consultations')
        .insert({
          patient_id: patientId,
          doctor_name: doctorName,
          consultation_date: consultationDateTime.toISOString(),
          status: 'pending',
          observations: schedulingEntry.observations || null
        })
        .select('id')
        .single();

      if (consultationError || !consultation) {
        toast.error('Erro ao criar consulta');
        return;
      }

      // Atualizar entrada da lista de espera
      try {
        const { error: updateError } = await supabase
          .from('waitlist')
          .update({
            status: 'scheduled',
            patient_id: patientId,
            scheduled_consultation_id: consultation.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', schedulingEntry.id);

        if (!updateError) {
          toast.success('Consulta agendada com sucesso!');
        } else {
          throw updateError;
        }
      } catch (updateError: any) {
        // Se Supabase não estiver disponível, usar localStorage
        if (updateError?.code === 'PGRST205' || updateError?.message?.includes('Could not find the table')) {
          // Atualizar no localStorage
          updateLocalWaitlistEntry(schedulingEntry.id, {
            status: 'scheduled',
            patient_id: patientId,
            scheduled_consultation_id: consultation?.id,
            updated_at: new Date().toISOString()
          });
          toast.success('Consulta agendada com sucesso! (armazenamento local)');
        } else {
          console.error('Erro ao atualizar lista:', updateError);
          toast.warning('Consulta criada, mas houve erro ao atualizar lista de espera: ' + updateError?.message);
        }
      }

      setSchedulingEntry(null);
      setSelectedTime('');
      setSelectedDoctor('');
      fetchWaitlist();

      if (onScheduleComplete) {
        onScheduleComplete();
      }
    } catch (error: any) {
      console.error('Erro ao agendar:', error);
      if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table')) {
        toast.error('Tabela waitlist não encontrada. Execute o script SQL no Supabase Dashboard.');
      } else {
        toast.error('Erro ao agendar consulta: ' + (error?.message || 'Erro desconhecido'));
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden" style={{ pointerEvents: 'auto' }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-medical-primary">
            Lista de Espera
          </DialogTitle>
          <DialogDescription>
            Gerencie pacientes aguardando agendamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-hidden flex flex-col">
          {/* Botões para adicionar */}
          {!schedulingEntry && (
            <div className="flex justify-end gap-2">
              <Button
                onClick={handleBulkInsert}
                variant="outline"
                className="border-marrom-acentuado text-marrom-acentuado hover:bg-marrom-acentuado/10"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar Pacientes
              </Button>
              <Button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-marrom-acentuado hover:bg-marrom-acentuado/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Paciente
              </Button>
            </div>
          )}

          {/* Formulário de adicionar */}
          {showAddForm && !schedulingEntry && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <Label htmlFor="new-name">Nome *</Label>
                <Input
                  id="new-name"
                  value={newEntry.patient_name}
                  onChange={(e) => setNewEntry({ ...newEntry, patient_name: e.target.value })}
                  placeholder="Nome do paciente"
                />
              </div>
              <div>
                <Label htmlFor="new-phone">Telefone *</Label>
                <Input
                  id="new-phone"
                  value={newEntry.phone}
                  onChange={(e) => setNewEntry({ ...newEntry, phone: formatPhone(e.target.value) })}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>
              <div>
                <Label htmlFor="new-observations">Observações</Label>
                <Textarea
                  id="new-observations"
                  value={newEntry.observations}
                  onChange={(e) => setNewEntry({ ...newEntry, observations: e.target.value })}
                  placeholder="Observações sobre o paciente"
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddEntry} className="bg-marrom-acentuado hover:bg-marrom-acentuado/90">
                  Adicionar
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Formulário de agendamento */}
          {schedulingEntry && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-700">
                  Agendar: {schedulingEntry.patient_name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSchedulingEntry(null);
                    setSelectedTime('');
                    setSelectedDoctor('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Médico *</Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o médico" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matheus">Dr. Matheus</SelectItem>
                      <SelectItem value="fabiola">Dra. Fabíola</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Data *</Label>
                  <Input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {selectedDoctor && (
                  <div className="col-span-2">
                    <Label>Horário Disponível *</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSlots.length > 0 ? (
                          availableSlots.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            Nenhum horário disponível nesta data
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedDate && (
                  <div className="col-span-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {formatDate(selectedDate)}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSchedule}
                  disabled={!selectedDoctor || !selectedTime || availableSlots.length === 0}
                  className="bg-marrom-acentuado hover:bg-marrom-acentuado/90"
                >
                  Confirmar Agendamento
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSchedulingEntry(null);
                    setSelectedTime('');
                    setSelectedDoctor('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {/* Lista de espera */}
          <ScrollArea className="flex-1 pr-4">
            {loading ? (
              <div className="flex justify-center items-center h-full py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bege-principal"></div>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum paciente na lista de espera
              </div>
            ) : (
              <div className="space-y-2">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    {editingEntry?.id === entry.id ? (
                      // Modo de edição
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="edit-name">Nome *</Label>
                          <Input
                            id="edit-name"
                            value={editForm.patient_name}
                            onChange={(e) => setEditForm({ ...editForm, patient_name: e.target.value })}
                            placeholder="Nome do paciente"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-phone">Telefone *</Label>
                          <Input
                            id="edit-phone"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: formatPhone(e.target.value) })}
                            placeholder="(00) 00000-0000"
                            maxLength={15}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-observations">Observações</Label>
                          <Textarea
                            id="edit-observations"
                            value={editForm.observations}
                            onChange={(e) => setEditForm({ ...editForm, observations: e.target.value })}
                            placeholder="Informações adicionais..."
                            rows={2}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            className="bg-marrom-acentuado hover:bg-marrom-acentuado/90 text-white"
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Modo de visualização
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-gray-600" />
                            <h4 className="font-semibold text-gray-800">{entry.patient_name}</h4>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-700">{entry.phone}</span>
                          </div>

                          {entry.observations && (
                            <div className="flex items-start gap-2 mb-2">
                              <FileText className="h-4 w-4 text-gray-600 mt-0.5" />
                              <span className="text-sm text-gray-600">{entry.observations}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gray-500" />
                              <span className="text-xs text-gray-500">
                                Tentativas de contato: {entry.contact_attempts}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {(() => {
                                const createdDate = new Date(entry.created_at);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const entryDate = new Date(createdDate);
                                entryDate.setHours(0, 0, 0, 0);
                                
                                // Se for hoje, mostrar "Hoje"
                                if (entryDate.getTime() === today.getTime()) {
                                  return 'Adicionado: Hoje';
                                }
                                // Caso contrário, mostrar a data formatada
                                return `Adicionado em: ${createdDate.toLocaleDateString('pt-BR')}`;
                              })()}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(entry)}
                            className="text-xs"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleIncrementContact(entry)}
                            className="text-xs"
                          >
                            + Tentativa
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setSchedulingEntry(entry)}
                            className="bg-marrom-acentuado hover:bg-marrom-acentuado/90 text-white text-xs"
                          >
                            Agendar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

