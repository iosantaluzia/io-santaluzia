
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { patientFormSchema } from '@/utils/validationSchemas';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { PatientDetails } from './PatientDetails';
import { NewConsultationForm } from './NewConsultationForm';
import { PatientDetailsModal } from './PatientDetailsModal';
import { formatCPF, formatPhone } from '@/utils/formatters';

// Sub-components
import { PatientFilterBar } from './pacientes/PatientFilterBar';
import { PatientTable } from './pacientes/PatientTable';
import { NewPatientModal } from './pacientes/NewPatientModal';
import { BackupSection } from './pacientes/BackupSection';

interface PacientesSectionProps {
  patientToOpenConsultation?: { patientId: string; consultationId?: string } | null;
  patientIdToOpen?: string | null;
  patientIdToOpenRecord?: string | null;
  onConsultationOpened?: () => void;
  onPatientOpened?: () => void;
  onSectionChange?: (section: string) => void;
}

export function PacientesSection({
  patientToOpenConsultation,
  patientIdToOpen,
  patientIdToOpenRecord,
  onConsultationOpened,
  onPatientOpened,
  onSectionChange
}: PacientesSectionProps = {}) {
  const { appUser } = useAuth();
  const [patientSubSection, setPatientSubSection] = useState('prontuarios');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [showNewConsultation, setShowNewConsultation] = useState(false);
  const [existingConsultation, setExistingConsultation] = useState<any>(null);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const [selectedPatientForModal, setSelectedPatientForModal] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 20;
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    date_of_birth: '',
    phone: '',
    email: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    medical_history: '',
    allergies: '',
    medications: ''
  });

  useEffect(() => {
    if (patientSubSection === 'prontuarios') {
      fetchPatients(0, true);
    }
  }, [patientSubSection]);

  // Quando o termo de busca mudar, fazer busca no banco de dados
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (patientSubSection === 'prontuarios') {
        searchPatients(searchTerm);
      }
    }, 300); // Debounce de 300ms para não fazer muitas requisições

    return () => clearTimeout(timeoutId);
  }, [searchTerm, patientSubSection]);

  // Efeito para abrir automaticamente a consulta quando patientToOpenConsultation for fornecido
  useEffect(() => {
    const openConsultation = async () => {
      if (!patientToOpenConsultation?.patientId) return;

      // Primeiro, tentar encontrar o paciente na lista atual
      let patient = patients.find(p => p.id === patientToOpenConsultation.patientId);

      // Se não encontrou na lista, buscar diretamente do banco
      if (!patient) {
        try {
          const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', patientToOpenConsultation.patientId)
            .single();

          if (error) {
            console.error('Erro ao buscar paciente:', error);
            toast.error('Erro ao carregar dados do paciente');
            return;
          }

          if (data) {
            patient = data;
            // Adicionar o paciente à lista se não estiver lá
            if (!patients.find(p => p.id === patient.id)) {
              setPatients(prev => [...prev, patient]);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar paciente:', error);
          toast.error('Erro ao carregar dados do paciente');
          return;
        }
      }

      if (patient) {
        setSelectedPatient(patient);
        setPatientSubSection('prontuarios'); // Garantir que estamos na subseção correta

        // Se houver consultationId, buscar a consulta existente
        if (patientToOpenConsultation.consultationId) {
          try {
            const { data, error } = await supabase
              .from('consultations')
              .select('*')
              .eq('id', patientToOpenConsultation.consultationId)
              .single();

            if (!error && data) {
              setExistingConsultation(data);
            }
          } catch (error) {
            console.error('Erro ao buscar consulta:', error);
          }
        } else {
          setExistingConsultation(null);
        }

        setShowNewConsultation(true);
        if (onConsultationOpened) {
          onConsultationOpened();
        }
      }
    };

    openConsultation();
  }, [patientToOpenConsultation, patients, onConsultationOpened]);

  // Efeito para abrir automaticamente o prontuário completo quando patientIdToOpenRecord for fornecido
  useEffect(() => {
    const openPatientRecord = async () => {
      if (!patientIdToOpenRecord) return;

      // Primeiro, tentar encontrar o paciente na lista atual
      let patient = patients.find(p => p.id === patientIdToOpenRecord);

      // Se não encontrou na lista, buscar diretamente do banco
      if (!patient) {
        try {
          const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', patientIdToOpenRecord)
            .single();

          if (error) {
            console.error('Erro ao buscar paciente:', error);
            toast.error('Erro ao carregar dados do paciente');
            return;
          }

          if (data) {
            patient = data;
            // Adicionar o paciente à lista se não estiver lá
            if (!patients.find(p => p.id === patient.id)) {
              setPatients(prev => [...prev, patient]);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar paciente:', error);
          toast.error('Erro ao carregar dados do paciente');
          return;
        }
      }

      if (patient) {
        setSelectedPatient(patient);

        // Notificar que o prontuário foi aberto
        if (onPatientOpened) {
          onPatientOpened();
        }
      }
    };

    openPatientRecord();
  }, [patientIdToOpenRecord, patients, onPatientOpened]);

  // Efeito para abrir automaticamente o prontuário (modal) quando patientIdToOpen for fornecido
  useEffect(() => {
    const openPatient = async () => {
      if (!patientIdToOpen) return;

      // Primeiro, tentar encontrar o paciente na lista atual
      let patient = patients.find(p => p.id === patientIdToOpen);

      // Se não encontrou na lista, buscar diretamente do banco
      if (!patient) {
        try {
          const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', patientIdToOpen)
            .single();

          if (error) {
            console.error('Erro ao buscar paciente:', error);
            toast.error('Erro ao carregar dados do paciente');
            return;
          }

          if (data) {
            patient = data;
            // Adicionar o paciente à lista se não estiver lá
            if (!patients.find(p => p.id === patient.id)) {
              setPatients(prev => [...prev, patient]);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar paciente:', error);
          toast.error('Erro ao carregar dados do paciente');
          return;
        }
      }

      if (patient) {
        // Mapear id para patientId para compatibilidade com o modal
        const patientData = { ...patient, patientId: patient.id };
        setSelectedPatientForModal(patientData);
        setShowPatientDetailsModal(true);

        // Notificar que o paciente foi aberto
        if (onPatientOpened) {
          onPatientOpened();
        }
      }
    };

    openPatient();
  }, [patientIdToOpen, patients, onPatientOpened]);

  const fetchPatients = async (pageNum: number = 0, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(0);
        setHasMore(true);
      } else {
        setIsLoadingMore(true);
      }

      let query = (supabase as any)
        .from('patients')
        .select('*', { count: 'exact' })
        .order('name');

      // Se não há termo de busca, carrega todos os dados para melhor scroll
      // Se há busca, usa paginação para performance
      if (!searchTerm.trim()) {
        // Carrega todos os dados quando não há busca
        const { data, error } = await query;

        if (error) {
          console.error('Erro ao buscar pacientes:', error);
          toast.error('Erro ao carregar pacientes');
          return;
        }

        setPatients(data || []);
        setHasMore(false); // Todos os dados já foram carregados
      } else {
        // Mantém paginação quando há busca para performance
        const from = pageNum * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { data, error, count } = await query.range(from, to);

        if (error) {
          console.error('Erro ao buscar pacientes:', error);
          toast.error('Erro ao carregar pacientes');
          return;
        }

        if (reset) {
          setPatients(data || []);
        } else {
          setPatients(prev => [...prev, ...(data || [])]);
        }

        // Verificar se há mais itens para carregar
        setHasMore((data?.length || 0) === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      toast.error('Erro ao carregar pacientes');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Buscar pacientes por termo de busca
  const searchPatients = async (term: string) => {
    try {
      setLoading(true);
      setPatients([]);

      const searchTerm = term.toLowerCase().trim();
      if (!searchTerm) {
        // Se não há termo de busca, carregar pacientes normais
        fetchPatients(0, true);
        return;
      }

      // Buscar por nome usando ILIKE (case insensitive e busca por partes)
      const { data: nameResults, error: nameError } = await supabase
        .from('patients')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .order('name')
        .limit(500); // Aumentar limite para resultados mais completos

      if (nameError) {
        console.error('Erro ao buscar por nome:', nameError);
      }

      // Buscar por CPF (remover formatação)
      const searchClean = term.replace(/\D/g, '');
      let cpfResults: any[] = [];
      if (searchClean) {
        const { data: cpfData, error: cpfError } = await supabase
          .from('patients')
          .select('*')
          .like('cpf', `%${searchClean}%`)
          .order('name')
          .limit(500);

        if (cpfError) {
          console.error('Erro ao buscar por CPF:', cpfError);
        } else {
          cpfResults = cpfData || [];
        }
      }

      // Buscar por telefone (remover formatação)
      let phoneResults: any[] = [];
      if (searchClean) {
        const { data: phoneData, error: phoneError } = await supabase
          .from('patients')
          .select('*')
          .like('phone', `%${searchClean}%`)
          .order('name')
          .limit(500);

        if (phoneError) {
          console.error('Erro ao buscar por telefone:', phoneError);
        } else {
          phoneResults = phoneData || [];
        }
      }

      // Combinar resultados e remover duplicatas
      const allResults = [...(nameResults || []), ...cpfResults, ...phoneResults];
      const uniqueResults = allResults.filter((patient, index, self) =>
        index === self.findIndex(p => p.id === patient.id)
      );

      setPatients(uniqueResults);
      setHasMore(false); // Desabilitar scroll infinito durante busca

    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      toast.error('Erro ao buscar pacientes');
    } finally {
      setLoading(false);
    }
  };

  // Carregar mais pacientes quando chegar ao final
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !searchTerm) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPatients(nextPage, false);
    }
  }, [page, hasMore, isLoadingMore, searchTerm]);

  // Observer para scroll infinito - só usado quando há busca
  useEffect(() => {
    // Só usar scroll infinito quando há busca (todos os dados já são carregados quando não há busca)
    if (!searchTerm.trim()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, searchTerm, loadMore]);


  const handleInputChange = (field: string, value: string) => {
    if (field === 'cpf') {
      value = formatCPF(value);
    } else if (field === 'phone' || field === 'emergency_phone') {
      value = formatPhone(value);
    }

    setFormData({ ...formData, [field]: value });
  };

  const handleSubmitPatient = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validar dados
      const validationResult = patientFormSchema.safeParse(formData);

      if (!validationResult.success) {
        const firstError = validationResult.error.errors[0];
        toast.error(firstError.message || 'Dados inválidos. Verifique os campos.');
        logger.error('Validation error:', validationResult.error);
        return;
      }

      const validatedData = validationResult.data;

      // Verificar se CPF já existe (apenas se CPF foi fornecido)
      if (validatedData.cpf && validatedData.cpf.trim() !== '') {
        const { data: existingPatient } = await (supabase as any)
          .from('patients')
          .select('id')
          .eq('cpf', validatedData.cpf)
          .maybeSingle();

        if (existingPatient) {
          toast.error('CPF já cadastrado. Use a busca para encontrar o paciente.');
          return;
        }
      }

      // Criar paciente
      const patientData: any = {
        name: validatedData.name,
        phone: validatedData.phone || null,
        email: validatedData.email || null,
        address: validatedData.address || null,
        emergency_contact: validatedData.emergency_contact || null,
        emergency_phone: validatedData.emergency_phone || null,
        medical_history: validatedData.medical_history || null,
        allergies: validatedData.allergies || null,
        medications: validatedData.medications || null,
        created_by: appUser?.username || 'sistema'
      };

      // Adicionar CPF apenas se foi fornecido
      if (validatedData.cpf && validatedData.cpf.trim() !== '') {
        patientData.cpf = validatedData.cpf;
      }

      // Adicionar data de nascimento apenas se foi fornecida
      if (validatedData.date_of_birth && validatedData.date_of_birth.trim() !== '') {
        patientData.date_of_birth = validatedData.date_of_birth;
      }

      const { error } = await (supabase as any)
        .from('patients')
        .insert(patientData);

      if (error) {
        logger.error('Erro ao criar paciente:', error);
        toast.error('Erro ao criar paciente. Tente novamente.');
        return;
      }

      toast.success('Paciente cadastrado com sucesso!');

      // Limpar formulário
      setFormData({
        name: '',
        cpf: '',
        date_of_birth: '',
        phone: '',
        email: '',
        address: '',
        emergency_contact: '',
        emergency_phone: '',
        medical_history: '',
        allergies: '',
        medications: ''
      });

      setShowNewPatientForm(false);
      fetchPatients(0, true);
    } catch (error) {
      logger.error('Erro ao salvar paciente:', error);
      toast.error('Erro ao salvar paciente. Tente novamente.');
    }
  };

  // Usar diretamente os pacientes carregados (já filtrados pela busca no banco)
  const filteredPatients = patients;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-cinza-escuro mb-4">Base de Dados de Pacientes</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
        {/* Abas para Prontuários e Backup - Ocultar quando paciente está selecionado */}
        {!selectedPatient && (
          <div className="flex border-b border-gray-200 mb-4">
            <button
              onClick={() => setPatientSubSection('prontuarios')}
              className={`py-2 px-4 text-sm font-medium ${patientSubSection === 'prontuarios' ? 'border-b-2 border-bege-principal text-bege-principal' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Prontuários Eletrônicos
            </button>
            <button
              onClick={() => setPatientSubSection('backup')}
              className={`py-2 px-4 text-sm font-medium ${patientSubSection === 'backup' ? 'border-b-2 border-bege-principal text-bege-principal' : 'text-gray-600 hover:text-gray-800'}`}
            >
              Gerenciamento de Backup
            </button>
          </div>
        )}

        {patientSubSection === 'prontuarios' && (
          <div>
            {!selectedPatient ? (
              <>
                <PatientFilterBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  onNewPatient={() => setShowNewPatientForm(true)}
                />

                <div className="bg-gray-100 rounded-md p-4">
                  <PatientTable
                    patients={patients}
                    loading={loading}
                    searchTerm={searchTerm}
                    onViewDetails={(patient) => {
                      setSelectedPatientForModal(patient);
                      setShowPatientDetailsModal(true);
                    }}
                    onViewMedicalRecord={(patient) => setSelectedPatient(patient)}
                    appUser={appUser}
                    observerTarget={observerTarget}
                    isLoadingMore={isLoadingMore}
                    hasMore={hasMore}
                    itemsPerPage={ITEMS_PER_PAGE}
                  />
                </div>
              </>
            ) : showNewConsultation && selectedPatient ? (
              <NewConsultationForm
                patient={selectedPatient}
                onBack={() => {
                  setShowNewConsultation(false);
                  setSelectedPatient(null);
                  setExistingConsultation(null);
                }}
                onSaved={() => {
                  setShowNewConsultation(false);
                  setSelectedPatient(null);
                  setExistingConsultation(null);
                  fetchPatients(0, true);
                  if (onSectionChange) {
                    onSectionChange('agendamentos');
                  }
                }}
                existingConsultation={existingConsultation}
              />
            ) : (
              <PatientDetails
                patient={selectedPatient}
                onBack={() => setSelectedPatient(null)}
                onSectionChange={onSectionChange}
              />
            )}
          </div>
        )}

        {patientSubSection === 'backup' && <BackupSection />}
      </div>

      <NewPatientModal
        isOpen={showNewPatientForm}
        onClose={() => setShowNewPatientForm(false)}
        onSubmit={handleSubmitPatient}
        formData={formData}
        onInputChange={handleInputChange}
      />

      {selectedPatientForModal && (
        <PatientDetailsModal
          isOpen={showPatientDetailsModal}
          onClose={() => {
            setShowPatientDetailsModal(false);
            setSelectedPatientForModal(null);
          }}
          patient={{
            name: selectedPatientForModal.name,
            time: '',
            status: '',
            cpf: selectedPatientForModal.cpf,
            phone: selectedPatientForModal.phone,
            email: selectedPatientForModal.email,
            address: selectedPatientForModal.address,
            birthDate: selectedPatientForModal.date_of_birth
              ? new Date(selectedPatientForModal.date_of_birth).toLocaleDateString('pt-BR')
              : undefined,
            patientId: selectedPatientForModal.id,
            consultationId: undefined,
            appointmentDate: undefined,
            appointmentType: undefined
          }}
          onPatientUpdate={async () => {
            await fetchPatients(0, true);
          }}
        />
      )}
    </div>
  );
}
