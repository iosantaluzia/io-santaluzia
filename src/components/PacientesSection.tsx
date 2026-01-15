
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, HardDrive, Plus, Eye, Camera, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { patientFormSchema } from '@/utils/validationSchemas';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { PatientDetails } from './PatientDetails';
import { NewConsultationForm } from './NewConsultationForm';
import { PatientDetailsModal } from './PatientDetailsModal';

interface PacientesSectionProps {
  patientToOpenConsultation?: { patientId: string; consultationId?: string } | null;
  onConsultationOpened?: () => void;
  onSectionChange?: (section: string) => void;
}

export function PacientesSection({ patientToOpenConsultation, onConsultationOpened, onSectionChange }: PacientesSectionProps = {}) {
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

  const formatCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
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

  const patientsData = [
    { 
      id: 1, 
      name: 'João da Silva', 
      dob: '15/03/1980', 
      cpf: '123.456.789-00',
      phone: '(11) 99999-9999',
      lastVisit: '10/01/2024',
      condition: 'Miopia',
      visualAcuity: { right: '20/40', left: '20/30' },
      pressure: { right: '14 mmHg', left: '15 mmHg' },
      allergies: 'Nenhuma conhecida'
    },
    { 
      id: 2, 
      name: 'Maria Oliveira', 
      dob: '22/07/1992', 
      cpf: '987.654.321-00',
      phone: '(11) 88888-8888',
      lastVisit: '05/12/2023',
      condition: 'Astigmatismo',
      visualAcuity: { right: '20/25', left: '20/20' },
      pressure: { right: '16 mmHg', left: '17 mmHg' },
      allergies: 'Penicilina'
    },
    { 
      id: 3, 
      name: 'Pedro Santos', 
      dob: '01/11/1975', 
      cpf: '456.789.123-00',
      phone: '(11) 77777-7777',
      lastVisit: '20/02/2024',
      condition: 'Presbiopia',
      visualAcuity: { right: '20/60', left: '20/50' },
      pressure: { right: '18 mmHg', left: '19 mmHg' },
      allergies: 'Sulfamida'
    },
  ];


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
                <div className="flex mb-4 gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Buscar paciente por nome, CPF ou telefone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    onClick={() => setShowNewPatientForm(true)}
                    className="bg-marrom-acentuado hover:bg-marrom-acentuado/90 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Paciente
                  </Button>
                </div>
                <div className="bg-gray-100 rounded-md p-4">
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
                    </div>
                  ) : filteredPatients.length > 0 ? (
                    <div className="w-full">
                      <h3 className="text-xl font-semibold text-cinza-escuro mb-4">Pacientes Cadastrados</h3>
                      <div className="overflow-x-auto">
                        <div className="max-h-96 overflow-y-auto">
                          <table className="min-w-full bg-white rounded-md shadow-sm">
                          <thead>
                            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                              <th className="py-3 px-6 text-left">Nome</th>
                              <th className="py-3 px-6 text-left">CPF</th>
                              <th className="py-3 px-6 text-left">Nascimento</th>
                              <th className="py-3 px-6 text-left">Telefone</th>
                              <th className="py-3 px-6 text-center">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-600 text-sm font-light">
                            {filteredPatients.map(patient => (
                              <tr 
                                key={patient.id} 
                                className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                                onClick={(e) => {
                                  // Não abrir modal se clicar nos botões
                                  if ((e.target as HTMLElement).closest('button')) {
                                    return;
                                  }
                                  setSelectedPatientForModal(patient);
                                  setShowPatientDetailsModal(true);
                                }}
                              >
                                <td className="py-3 px-6 text-left font-medium">{patient.name}</td>
                                <td className="py-3 px-6 text-left">{patient.cpf}</td>
                                <td className="py-3 px-6 text-left">
                                  {(() => {
                                    if (!patient.date_of_birth) return '-';
                                    const date = new Date(patient.date_of_birth);
                                    const today = new Date();
                                    let age = today.getFullYear() - date.getFullYear();
                                    const monthDiff = today.getMonth() - date.getMonth();
                                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
                                      age--;
                                    }
                                    return `${date.toLocaleDateString('pt-BR')} (${age} anos)`;
                                  })()}
                                </td>
                                <td className="py-3 px-6 text-left">{patient.phone || '-'}</td>
                                <td className="py-3 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-center gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        setSelectedPatientForModal(patient);
                                        setShowPatientDetailsModal(true);
                                      }}
                                    >
                                      Ver Detalhes
                                    </Button>
                                    {/* Secretários e financeiro não podem ver prontuários médicos */}
                                    {(appUser?.role === 'admin' || appUser?.role === 'doctor') && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setSelectedPatient(patient)}
                                      >
                                        Ver Prontuário
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {/* Elemento de observação para scroll infinito */}
                        {searchTerm.trim() && (
                          <>
                            <div ref={observerTarget} className="h-4" />
                            {isLoadingMore && (
                              <div className="flex justify-center items-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
                                <span className="ml-2 text-sm text-gray-600">Carregando mais pacientes...</span>
                              </div>
                            )}
                            {!hasMore && patients.length > ITEMS_PER_PAGE && (
                              <div className="text-center py-4 text-sm text-gray-500">
                                Todos os pacientes foram carregados
                              </div>
                            )}
                          </>
                        )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center mt-8">
                      {searchTerm ? 'Nenhum paciente encontrado para a busca.' : 'Nenhum paciente cadastrado.'}
                    </p>
                  )}
                </div>
              </>
            ) : showNewConsultation && selectedPatient ? (
              /* Nova Consulta - Abrir formulário de nova consulta */
              <NewConsultationForm
                patient={selectedPatient}
                onBack={() => {
                  setShowNewConsultation(false);
                  setSelectedPatient(null);
                  setExistingConsultation(null);
                }}
                onSaved={() => {
                  console.log('🔄 onSaved chamado - redirecionando para agendamentos');
                  setShowNewConsultation(false);
                  setSelectedPatient(null);
                  setExistingConsultation(null);
                  fetchPatients(0, true); // Recarregar lista de pacientes

                  // Redirecionar para agendamentos após salvar consulta
                  if (onSectionChange) {
                    console.log('✅ onSectionChange disponível, chamando setActiveSection("agendamentos")');
                    onSectionChange('agendamentos');
                  } else {
                    console.log('❌ onSectionChange não disponível');
                  }
                }}
                existingConsultation={existingConsultation}
              />
            ) : (
              /* Prontuário Detalhado - Usando componente PatientDetails completo */
              <PatientDetails
                patient={selectedPatient}
                onBack={() => setSelectedPatient(null)}
                onSectionChange={onSectionChange}
              />
            )}
          </div>
        )}

        {patientSubSection === 'backup' && (
          <div>
            <h3 className="text-xl font-semibold text-cinza-escuro mb-4">Gerenciamento de Backup de Dados</h3>
            <div className="bg-gray-100 h-96 flex flex-col items-center justify-center text-gray-500 text-lg rounded-md p-4 text-center">
              <HardDrive className="h-16 w-16 text-gray-400 mb-4" />
              <p className="mb-4">Realize backups regulares para garantir a segurança dos dados dos seus pacientes.</p>
              <button className="bg-bege-principal text-white px-6 py-3 rounded-md hover:bg-marrom-acentuado transition flex items-center gap-2">
                <Plus className="h-5 w-5" /> Iniciar Backup Agora
              </button>
              <p className="text-sm mt-4 text-gray-600">Último backup: 01/08/2024 às 10:30</p>
              <p className="text-sm text-green-600">Status: Sincronizado e Seguro</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Novo Paciente */}
      <Dialog open={showNewPatientForm} onOpenChange={setShowNewPatientForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Novo Paciente
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitPatient} className="space-y-4">
            {/* Dados Básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nome do paciente"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>

              <div>
                <Label htmlFor="date_of_birth">Data de Nascimento</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Rua, número, bairro"
                />
              </div>
            </div>

            {/* Contato de Emergência */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Contato de Emergência</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergency_contact">Nome do Contato</Label>
                  <Input
                    id="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                    placeholder="Nome do contato de emergência"
                  />
                </div>

                <div>
                  <Label htmlFor="emergency_phone">Telefone de Emergência</Label>
                  <Input
                    id="emergency_phone"
                    value={formData.emergency_phone}
                    onChange={(e) => handleInputChange('emergency_phone', e.target.value)}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                </div>
              </div>
            </div>

            {/* Informações Médicas */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Informações Médicas</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="medical_history">Histórico Médico</Label>
                  <Textarea
                    id="medical_history"
                    value={formData.medical_history}
                    onChange={(e) => handleInputChange('medical_history', e.target.value)}
                    placeholder="Histórico médico do paciente..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="allergies">Alergias</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    placeholder="Alergias conhecidas..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="medications">Medicações</Label>
                  <Textarea
                    id="medications"
                    value={formData.medications}
                    onChange={(e) => handleInputChange('medications', e.target.value)}
                    placeholder="Medicações em uso..."
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                Cadastrar Paciente
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowNewPatientForm(false)} 
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes do Paciente */}
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
