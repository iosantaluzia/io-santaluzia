
import React, { useState, useEffect } from 'react';
import { TestTube, Calendar, Filter, Eye, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

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

export function PatientExams({ patientId }: PatientExamsProps) {
  const [exams, setExams] = useState<PatientExam[]>([]);
  const [filteredExams, setFilteredExams] = useState<PatientExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<PatientExam | null>(null);
  const [filters, setFilters] = useState({
    examType: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchExams();
  }, [patientId]);

  useEffect(() => {
    applyFilters();
  }, [exams, filters]);

  const fetchExams = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_exams')
        .select('*')
        .eq('patient_id', patientId)
        .order('exam_date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar exames:', error);
        return;
      }

      setExams(data || []);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
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
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Visualizar Arquivos
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload de Arquivos
            </Button>
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
