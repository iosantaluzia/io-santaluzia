import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Phone, Mail, MapPin, Calendar, FileText, Stethoscope, Eye, Clock, Edit, Save, X, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  };
  onOpenConsultation?: () => void;
  onPatientUpdate?: () => void;
}

interface Consultation {
  id: string;
  consultation_date: string;
  doctor_name: string;
  diagnosis?: string;
  status?: string;
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

export function PatientDetailsModal({ isOpen, onClose, patient, onOpenConsultation, onPatientUpdate }: PatientDetailsModalProps) {
  const { appUser } = useAuth();
  const isDoctor = appUser?.role === 'doctor';
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
        .select('id, consultation_date, doctor_name, diagnosis, status')
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

  const handleCancel = () => {
    setIsEditing(false);
    // Restaurar dados originais
    fetchPatientData();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-medical-primary">
            Detalhes do Paciente
          </DialogTitle>
          <DialogDescription className="text-center">
            Informações do agendamento
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
                      <p className="font-semibold text-gray-700">{editingPatient.name || patient.name}</p>
                      {(editingPatient.cpf || patient.cpf) && (
                        <p className="text-sm text-gray-600">CPF: {editingPatient.cpf || patient.cpf}</p>
                      )}
                    </div>
                  </div>

                  {(editingPatient.phone || patient.phone) && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <p className="text-sm text-gray-700">{editingPatient.phone || patient.phone}</p>
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
                            <div key={consultation.id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-medium text-gray-700">
                                  {new Date(consultation.consultation_date).toLocaleDateString('pt-BR')}
                                </p>
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold
                                  ${consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'}`}>
                                  {consultation.status === 'completed' ? 'Concluída' :
                                   consultation.status === 'pending' ? 'Pendente' :
                                   consultation.status || 'Agendada'}
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
                            <div key={exam.id} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-medium text-gray-700">
                                  {new Date(exam.exam_date).toLocaleDateString('pt-BR')}
                                </p>
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold
                                  ${exam.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    exam.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    exam.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'}`}>
                                  {exam.status === 'completed' ? 'Concluído' :
                                   exam.status === 'pending' ? 'Pendente' :
                                   exam.status === 'in_progress' ? 'Em Andamento' :
                                   exam.status === 'cancelled' ? 'Cancelado' :
                                   exam.status || 'Agendado'}
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

          {/* Informações do Agendamento */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="font-semibold text-gray-700">Agendamento:</span>
            </div>
            <p className="text-sm text-gray-600 ml-6">Horário: {patient.time}</p>
            <div className="ml-6 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block
                ${patient.status === 'Confirmado' ? 'bg-green-100 text-green-800' :
                  patient.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'}`}>
                {patient.status}
              </span>
            </div>
          </div>

          {/* Botão para Acessar Consulta (Só para Médicos) */}
          {isDoctor && onOpenConsultation && (
            <div className="pt-4 border-t">
              <Button
                onClick={onOpenConsultation}
                className="w-full bg-medical-primary hover:bg-medical-primary/90"
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Acessar Dados da Consulta
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Acesso exclusivo para médicos
              </p>
            </div>
          )}

          {!isDoctor && (
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                <Stethoscope className="h-3 w-3 inline mr-1" />
                Dados de consulta disponíveis apenas para médicos
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

