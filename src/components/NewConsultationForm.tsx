
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, User, TestTube, Calendar, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { PatientConsultations } from './PatientConsultations';
import { getDoctorFullName } from '@/utils/doctorNames';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  date_of_birth: string;
}

interface ConsultationData {
  id?: string;
  doctor_name?: string;
  consultation_date?: string;
  anamnesis?: string;
  diagnosis?: string;
  prescription?: string;
  visual_acuity_od?: string;
  visual_acuity_oe?: string;
  ocular_pressure_od?: string;
  ocular_pressure_oe?: string;
  biomicroscopy?: string;
  fundus_exam?: string;
  observations?: string;
}

interface NewConsultationFormProps {
  patient: Patient;
  onBack: () => void;
  onSaved: () => void;
  existingConsultation?: ConsultationData | null;
}

interface PatientExam {
  id: string;
  exam_type: string;
  exam_date: string;
  doctor_name?: string;
  description?: string;
  results?: string;
  status: string;
}

const examTypeLabels: { [key: string]: string } = {
  'pentacam': 'Pentacam',
  'campimetria': 'Campimetria',
  'topografia': 'Topografia de Córnea',
  'microscopia_especular': 'Microscopia Especular',
  'oct': 'OCT',
  'retinografia': 'Retinografia',
  'angiofluoresceinografia': 'Angiofluoresceinografia',
  'ultrassom_ocular': 'Ultrassom Ocular'
};

export function NewConsultationForm({ patient, onBack, onSaved, existingConsultation }: NewConsultationFormProps) {
  const { appUser } = useAuth();
  const [loading, setSaving] = useState(false);
  const [consultationText, setConsultationText] = useState('');
  const [exams, setExams] = useState<PatientExam[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);

  // Carregar dados da consulta existente quando fornecido
  useEffect(() => {
    const loadExistingConsultation = async () => {
      if (existingConsultation?.id && !existingConsultation.anamnesis) {
        // Se apenas o ID foi fornecido, buscar os dados completos da consulta
        try {
          const { data, error } = await supabase
            .from('consultations')
            .select('*')
            .eq('id', existingConsultation.id)
            .single();

          if (error) {
            console.error('Erro ao carregar consulta:', error);
            return;
          }

          if (data?.anamnesis) {
            setConsultationText(data.anamnesis);
          }
        } catch (error) {
          console.error('Erro ao carregar consulta:', error);
        }
      } else if (existingConsultation?.anamnesis) {
        // Se a anamnese já foi fornecida, usar diretamente
        setConsultationText(existingConsultation.anamnesis);
      }
    };

    loadExistingConsultation();
  }, [existingConsultation]);

  useEffect(() => {
    fetchPatientExams();
  }, [patient.id]);

  const fetchPatientExams = async () => {
    try {
      setLoadingExams(true);
      const { data, error } = await (supabase as any)
        .from('patient_exams')
        .select('*')
        .eq('patient_id', patient.id)
        .order('exam_date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar exames:', error);
        setExams([]);
        return;
      }

      setExams((data || []) as PatientExam[]);
    } catch (error) {
      console.error('Erro ao carregar exames:', error);
      setExams([]);
    } finally {
      setLoadingExams(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Obter nome completo do médico do appUser
      const doctorName = getDoctorFullName(appUser?.username);
      
      // Usar data/hora atual
      const consultationDate = new Date().toISOString();

      let consultationId: string | null = null;

      // Se existe uma consulta existente fornecida, atualizar ela
      if (existingConsultation?.id) {
        consultationId = existingConsultation.id;
      } else {
        // Verificar se existe uma consulta agendada para este paciente hoje
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { data: scheduledConsultation, error: findError } = await supabase
          .from('consultations')
          .select('id')
          .eq('patient_id', patient.id)
          .eq('status', 'scheduled')
          .gte('consultation_date', today.toISOString())
          .lt('consultation_date', tomorrow.toISOString())
          .maybeSingle();

        if (findError) {
          logger.warn('Erro ao buscar consulta agendada:', findError);
        } else if (scheduledConsultation?.id) {
          consultationId = scheduledConsultation.id;
        }
      }

      // Timestamp de salvamento
      const savedAt = new Date().toISOString();

      // Se encontrou uma consulta existente, atualizar ao invés de criar nova
      if (consultationId) {
        // Ao atualizar uma consulta existente, NÃO alterar o consultation_date
        // para preservar o horário de agendamento original
        const { error } = await supabase
          .from('consultations')
          .update({
            doctor_name: doctorName,
            // consultation_date NÃO é incluído aqui para preservar o horário original
            anamnesis: consultationText || null,
            status: 'completed',
            saved_at: savedAt,
            updated_at: savedAt
          })
          .eq('id', consultationId);

        if (error) {
          logger.error('Erro ao atualizar consulta:', error);
          toast.error('Erro ao atualizar consulta. Tente novamente.');
          return;
        }

        toast.success('Consulta atualizada com sucesso!');
      } else {
        // Criar nova consulta apenas se não houver consulta existente
        const { error } = await supabase
          .from('consultations')
          .insert({
            patient_id: patient.id,
            doctor_name: doctorName,
            consultation_date: consultationDate,
            anamnesis: consultationText || null,
            status: 'completed',
            saved_at: savedAt,
            created_by: appUser?.username || 'sistema'
          });

        if (error) {
          logger.error('Erro ao salvar consulta:', error);
          toast.error('Erro ao salvar consulta. Tente novamente.');
          return;
        }

        toast.success('Consulta salva com sucesso!');
      }

      // Limpar formulário
      setConsultationText('');
      onSaved();
    } catch (error) {
      logger.error('Erro ao salvar consulta:', error);
      toast.error('Erro ao salvar consulta. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-cinza-escuro">Nova Consulta</h2>
            <p className="text-gray-600">Registrar nova consulta para {patient.name}</p>
          </div>
        </div>
        <Button 
          type="submit"
          form="consultation-form"
          disabled={loading}
          className="bg-bege-principal hover:bg-bege-principal/90 text-white flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {loading ? 'Salvando...' : 'Salvar Consulta'}
        </Button>
      </div>

      {/* Informações do Paciente */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-bege-principal flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-cinza-escuro">{patient.name}</h3>
            <p className="text-gray-600">CPF: {patient.cpf} • Nascimento: {new Date(patient.date_of_birth).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>

      {/* Formulário - Layout em duas colunas */}
      <form id="consultation-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Campo de Texto da Consulta */}
          <div className="lg:col-span-2">
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">Consulta</Label>
            <Textarea
              value={consultationText}
              onChange={(e) => setConsultationText(e.target.value)}
              placeholder="Anamnese, Acuidade Visual (OD/OE), Pressão Intraocular (OD/OE), Biomicroscopia, Fundoscopia, Prescrição..."
              rows={20}
              className="bg-white min-h-[500px] resize-none"
            />
          </div>

          {/* Coluna Direita - Exames do Paciente */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 h-full">
              <div className="flex items-center gap-2 mb-4">
                <TestTube className="h-5 w-5 text-gray-600" />
                <Label className="text-sm font-semibold text-gray-700">Exames Cadastrados</Label>
              </div>
              
              {loadingExams ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
                </div>
              ) : exams.length > 0 ? (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {exams.map((exam) => (
                      <div
                        key={exam.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-800">
                                {examTypeLabels[exam.exam_type] || exam.exam_type}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(exam.exam_date).toLocaleDateString('pt-BR')}</span>
                              {exam.doctor_name && (
                                <>
                                  <span>•</span>
                                  <span>{exam.doctor_name}</span>
                                </>
                              )}
                            </div>
                            {exam.description && (
                              <p className="text-xs text-gray-600 mb-1 line-clamp-2">{exam.description}</p>
                            )}
                            {exam.results && (
                              <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded mt-2 line-clamp-3">
                                {exam.results}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            exam.status === 'completed' ? 'bg-green-100 text-green-800' :
                            exam.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            exam.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {exam.status === 'completed' ? 'Concluído' :
                             exam.status === 'in_progress' ? 'Em Andamento' :
                             exam.status === 'pending' ? 'Pendente' :
                             exam.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-8">
                  <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhum exame cadastrado para este paciente.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Histórico de Consultas */}
      <div className="mt-8 w-full overflow-x-hidden">
        <PatientConsultations 
          patientId={patient.id} 
          onConsultationClick={(consultation) => {
            // Atualizar o formulário com os dados da consulta clicada
            setConsultationText(consultation.anamnesis || '');
            // Scroll para o topo do formulário
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    </div>
  );
}
