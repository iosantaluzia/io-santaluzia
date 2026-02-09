
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, TestTube } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';
import { PatientConsultations } from './PatientConsultations';
import { getDoctorFullName } from '@/utils/doctorNames';
import { calculateDetailedAge } from '@/utils/formatters';

// Sub-components
import { ConsultationPatientSummary } from './pacientes/ConsultationPatientSummary';
import { PatientExamsList } from './pacientes/PatientExamsList';


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
  onEditPatient?: (patient: Patient) => void;
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


export function NewConsultationForm({ patient, onBack, onSaved, existingConsultation, onEditPatient }: NewConsultationFormProps) {
  const { appUser } = useAuth();
  const [loading, setSaving] = useState(false);
  const [consultationText, setConsultationText] = useState('');
  const [exams, setExams] = useState<PatientExam[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Monitorar mudanças no texto
  useEffect(() => {
    if (consultationText !== (existingConsultation?.anamnesis || '')) {
      setHasChanges(true);
    }
  }, [consultationText, existingConsultation]);

  // Efeito para salvamento automático a cada 1 minuto
  useEffect(() => {
    if (!hasChanges || loading) return;

    const autoSaveInterval = setInterval(() => {
      console.log('Iniciando salvamento automático...');
      handleSave(true); // true = silent save
    }, 60000); // 1 minuto

    return () => clearInterval(autoSaveInterval);
  }, [hasChanges, consultationText, loading]);

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
            setHasChanges(false);
          }
        } catch (error) {
          console.error('Erro ao carregar consulta:', error);
        }
      } else if (existingConsultation?.anamnesis) {
        // Se a anamnese já foi fornecida, usar diretamente
        setConsultationText(existingConsultation.anamnesis);
        setHasChanges(false);
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

  const handleSave = async (silent = false) => {
    if (!silent) setSaving(true);

    try {
      const doctorName = getDoctorFullName(appUser?.username);
      const consultationDate = new Date().toISOString();
      let consultationId: string | null = null;

      if (existingConsultation?.id) {
        consultationId = existingConsultation.id;
      } else {
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

      const savedAt = new Date().toISOString();

      if (consultationId) {
        const { error } = await supabase
          .from('consultations')
          .update({
            doctor_name: doctorName,
            anamnesis: consultationText || null,
            status: 'completed',
            saved_at: savedAt,
            updated_at: savedAt
          })
          .eq('id', consultationId);

        if (error) {
          if (!silent) toast.error('Erro ao salvar consulta.');
          return false;
        }
      } else {
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
          if (!silent) toast.error('Erro ao salvar consulta.');
          return false;
        }
      }

      setLastSaved(new Date());
      setHasChanges(false);
      if (!silent) toast.success('Consulta salva com sucesso!');
      return true;
    } catch (error) {
      if (!silent) toast.error('Erro ao salvar consulta.');
      return false;
    } finally {
      if (!silent) setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSave();
    if (success) {
      setConsultationText('');
      onSaved();
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
            <h2 className="text-2xl font-bold text-cinza-escuro">
              {existingConsultation ? 'Editar Consulta' : 'Nova Consulta'}
            </h2>
            <p className="text-gray-600">
              {existingConsultation
                ? `Editar consulta de ${patient.name}`
                : `Registrar nova consulta para ${patient.name}`
              }
            </p>
          </div>
        </div>
        <Button
          type="submit"
          form="consultation-form"
          disabled={loading}
          className="bg-bege-principal hover:bg-bege-principal/90 text-white flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {loading ? 'Salvando...' : 'Salvar e Encerrar'}
        </Button>
      </div>

      <ConsultationPatientSummary
        patient={patient}
        onEditPatient={onEditPatient}
      />

      {/* Formulário - Layout em duas colunas */}
      <form id="consultation-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-semibold text-gray-700 block">Consulta</Label>
              <div className="flex items-center gap-3">
                {lastSaved && (
                  <span className="text-xs text-gray-500 italic">
                    Salvo em {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {hasChanges && ' (com alterações pendentes)'}
                  </span>
                )}
                <Button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={loading || !hasChanges}
                  variant="outline"
                  size="sm"
                  className="h-8 flex items-center gap-2 text-marrom-acentuado border-marrom-acentuado hover:bg-marrom-acentuado hover:text-white"
                >
                  <Save className="h-3.5 w-3.5" />
                  Salvar
                </Button>
              </div>
            </div>
            <Textarea
              value={consultationText}
              onChange={(e) => setConsultationText(e.target.value)}
              placeholder="Anamnese, Acuidade Visual (OD/OE), Pressão Intraocular (OD/OE), Biomicroscopia, Fundoscopia, Prescrição..."
              rows={20}
              className="bg-white min-h-[500px] resize-none"
            />
          </div>

          <PatientExamsList
            exams={exams}
            loading={loadingExams}
          />
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
