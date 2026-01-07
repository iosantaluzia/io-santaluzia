
import React, { useState, useEffect } from 'react';
import { TestTube, Calendar, Filter, Eye, Upload, FileText, AlertCircle, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ExamFileUpload } from './ExamFileUpload';
import { getExamFiles, deleteExamFile } from '@/utils/examUpload';

interface PatientExam {
  id: string;
  exam_type: string;
  exam_date: string;
  doctor_name?: string;
  description?: string;
  results?: string;
  status: string;
  created_at: string;
}

interface PatientExamsProps {
  patientId: string;
}

const examTypeLabels = {
  'pentacam': 'Pentacam',
  'campimetria': 'Campimetria',
  'topografia': 'Topografia de Córnea',
  'microscopia_especular': 'Microscopia Especular',
  'oct': 'OCT',
  'retinografia': 'Retinografia',
  'angiofluoresceinografia': 'Angiofluoresceinografia',
  'ultrassom_ocular': 'Ultrassom Ocular'
};

const statusLabels = {
  'pending': 'Pendente',
  'in_progress': 'Em Andamento',
  'completed': 'Concluído',
  'cancelled': 'Cancelado'
};

interface ExamFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_at: string;
}

export function PatientExams({ patientId }: PatientExamsProps) {
  const [exams, setExams] = useState<PatientExam[]>([]);
  const [filteredExams, setFilteredExams] = useState<PatientExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [selectedExam, setSelectedExam] = useState<PatientExam | null>(null);
  const [examFiles, setExamFiles] = useState<ExamFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [filters, setFilters] = useState({
    examType: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const { appUser } = useAuth();

  useEffect(() => {
    fetchExams();
  }, [patientId]);

  useEffect(() => {
    applyFilters();
  }, [exams, filters]);

  useEffect(() => {
    if (selectedExam) {
      loadExamFiles(selectedExam.id);
    }
  }, [selectedExam]);

  // SECURITY FIX: Validate user access before fetching exams
  const validateAccess = async (): Promise<boolean> => {
    if (!appUser) {
      return false;
    }

    // Admins and doctors can access all patients
    if (appUser.role === 'admin' || appUser.role === 'doctor') {
      return true;
    }

    // Secretaries can only access patients they created or have exams with
    if (appUser.role === 'secretary') {
      // Check if this secretary has any relation to this patient via exams
      const { data: hasAccess } = await supabase
        .from('patient_exams')
        .select('id')
        .eq('patient_id', patientId)
        .eq('created_by', appUser.username)
        .limit(1)
        .maybeSingle();

      if (hasAccess) {
        return true;
      }

      // Also check if secretary created the patient
      const { data: patient } = await supabase
        .from('patients')
        .select('created_by')
        .eq('id', patientId)
        .single();

      return patient?.created_by === appUser.username;
    }

    return false;
  };

  const fetchExams = async () => {
    try {
      setLoading(true);
      setAccessDenied(false);

      // SECURITY FIX: Validate access before fetching
      const hasAccess = await validateAccess();
      if (!hasAccess) {
        setAccessDenied(true);
        toast.error('Acesso negado: você não tem permissão para ver este paciente');
        return;
      }

      const { data, error } = await supabase
        .from('patient_exams')
        .select('*')
        .eq('patient_id', patientId)
        .order('exam_date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar exames:', error);
        toast.error('Erro ao carregar exames');
        return;
      }

      setExams(data || []);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
      toast.error('Erro ao carregar exames');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...exams];

    if (filters.examType !== 'all') {
      filtered = filtered.filter(exam => exam.exam_type === filters.examType);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(exam => exam.status === filters.status);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(exam => 
        new Date(exam.exam_date) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filtered = filtered.filter(exam => 
        new Date(exam.exam_date) <= new Date(filters.dateTo)
      );
    }

    setFilteredExams(filtered);
  };

  const loadExamFiles = async (examId: string) => {
    setLoadingFiles(true);
    try {
      const files = await getExamFiles(examId);
      setExamFiles(files as ExamFile[]);
    } catch (error) {
      console.error('Erro ao carregar arquivos:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleDeleteFile = async (fileId: string, filePath: string) => {
    if (!confirm('Tem certeza que deseja excluir este arquivo?')) {
      return;
    }

    try {
      const success = await deleteExamFile(fileId, filePath);
      if (success) {
        toast.success('Arquivo excluído com sucesso');
        if (selectedExam) {
          loadExamFiles(selectedExam.id);
        }
      } else {
        toast.error('Erro ao excluir arquivo');
      }
    } catch (error) {
      console.error('Erro ao excluir arquivo:', error);
      toast.error('Erro ao excluir arquivo');
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center h-32 p-4">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-red-600 font-medium">Acesso Negado</p>
        <p className="text-sm text-gray-600 text-center">
          Você não tem permissão para visualizar exames deste paciente.
        </p>
      </div>
    );
  }

  if (selectedExam) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-cinza-escuro">Detalhes do Exame</h3>
          <Button variant="outline" onClick={() => setSelectedExam(null)}>
            Voltar
          </Button>
        </div>
        
        <div className="bg-white border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Informações do Exame</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Tipo:</span> {examTypeLabels[selectedExam.exam_type as keyof typeof examTypeLabels]}</p>
                <p><span className="font-medium">Data:</span> {new Date(selectedExam.exam_date).toLocaleString('pt-BR')}</p>
                <p><span className="font-medium">Status:</span> {getStatusBadge(selectedExam.status)}</p>
                {selectedExam.doctor_name && (
                  <p><span className="font-medium">Médico:</span> {selectedExam.doctor_name}</p>
                )}
              </div>
            </div>
          </div>
          
          {selectedExam.description && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Descrição</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedExam.description}</p>
            </div>
          )}
          
          {selectedExam.results && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Resultados</h4>
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">{selectedExam.results}</p>
            </div>
          )}
          
          {/* Seção de Arquivos */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-700">Arquivos Anexados</h4>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowUpload(!showUpload)}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {showUpload ? 'Cancelar' : 'Adicionar Arquivo'}
              </Button>
            </div>

            {showUpload && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <ExamFileUpload
                  patientExamId={selectedExam.id}
                  patientId={patientId}
                  onUploadSuccess={() => {
                    loadExamFiles(selectedExam.id);
                    setShowUpload(false);
                  }}
                />
              </div>
            )}

            {loadingFiles ? (
              <div className="text-center py-4 text-gray-500">Carregando arquivos...</div>
            ) : examFiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum arquivo anexado</p>
              </div>
            ) : (
              <div className="space-y-2">
                {examFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.file_name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.file_size)} • {new Date(file.uploaded_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(file.file_path, '_blank')}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = file.file_path;
                          link.download = file.file_name;
                          link.click();
                        }}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-4 w-4" />
                        Baixar
                      </Button>
                      {(appUser?.role === 'admin' || appUser?.role === 'doctor') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFile(file.id, file.file_path)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-cinza-escuro">Exames do Paciente</h3>
        <Button className="bg-bege-principal hover:bg-bege-principal/90 text-white flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Novo Exame
        </Button>
      </div>
      
      {/* Filtros */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Exame</label>
            <Select value={filters.examType} onValueChange={(value) => setFilters({...filters, examType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {Object.entries(examTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
            />
          </div>
        </div>
      </div>
      
      {/* Lista de Exames */}
      {filteredExams.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {exams.length === 0 
              ? 'Nenhum exame registrado para este paciente.' 
              : 'Nenhum exame encontrado com os filtros aplicados.'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setSelectedExam(exam)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <TestTube className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-cinza-escuro">
                        {examTypeLabels[exam.exam_type as keyof typeof examTypeLabels]}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(exam.exam_date).toLocaleDateString('pt-BR')}
                        {exam.doctor_name && <span>• {exam.doctor_name}</span>}
                      </p>
                    </div>
                  </div>
                  
                  {exam.description && (
                    <div className="ml-11">
                      <p className="text-sm text-gray-600 truncate">{exam.description}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusBadge(exam.status)}
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Ver
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
