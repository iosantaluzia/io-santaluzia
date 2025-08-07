
import React, { useState, useEffect } from 'react';
import { Calendar, User, FileText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Consultation {
  id: string;
  doctor_name: string;
  consultation_date: string;
  anamnesis?: string;
  diagnosis?: string;
  prescription?: string;
  visual_acuity_od?: string;
  visual_acuity_oe?: string;
  ocular_pressure_od?: string;
  ocular_pressure_oe?: string;
  biomicroscopy?: string;
  observations?: string;
}

interface PatientConsultationsProps {
  patientId: string;
}

export function PatientConsultations({ patientId }: PatientConsultationsProps) {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  useEffect(() => {
    fetchConsultations();
  }, [patientId]);

  const fetchConsultations = async () => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('patient_id', patientId)
        .order('consultation_date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar consultas:', error);
        return;
      }

      setConsultations(data || []);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
      </div>
    );
  }

  if (selectedConsultation) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-cinza-escuro">Detalhes da Consulta</h3>
          <Button variant="outline" onClick={() => setSelectedConsultation(null)}>
            Voltar
          </Button>
        </div>
        
        <div className="bg-white border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Informações Gerais</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Médico:</span> {selectedConsultation.doctor_name}</p>
                <p><span className="font-medium">Data:</span> {new Date(selectedConsultation.consultation_date).toLocaleString('pt-BR')}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Acuidade Visual</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">OD:</span> {selectedConsultation.visual_acuity_od || 'Não informado'}</p>
                <p><span className="font-medium">OE:</span> {selectedConsultation.visual_acuity_oe || 'Não informado'}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Pressão Ocular</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">OD:</span> {selectedConsultation.ocular_pressure_od || 'Não informado'} mmHg</p>
                <p><span className="font-medium">OE:</span> {selectedConsultation.ocular_pressure_oe || 'Não informado'} mmHg</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            {selectedConsultation.anamnesis && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Anamnese</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedConsultation.anamnesis}</p>
              </div>
            )}
            
            {selectedConsultation.biomicroscopy && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Biomicroscopia</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedConsultation.biomicroscopy}</p>
              </div>
            )}
            
            {selectedConsultation.diagnosis && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Diagnóstico</h4>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">{selectedConsultation.diagnosis}</p>
              </div>
            )}
            
            {selectedConsultation.prescription && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Prescrição</h4>
                <p className="text-sm text-gray-600 bg-green-50 p-3 rounded border border-green-200">{selectedConsultation.prescription}</p>
              </div>
            )}
            
            {selectedConsultation.observations && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Observações</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedConsultation.observations}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-cinza-escuro">Histórico de Consultas</h3>
      
      {consultations.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma consulta registrada para este paciente.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {consultations.map((consultation) => (
            <div
              key={consultation.id}
              className="bg-white border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => setSelectedConsultation(consultation)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-bege-principal flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-cinza-escuro">{consultation.doctor_name}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(consultation.consultation_date).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  {consultation.diagnosis && (
                    <div className="ml-11">
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Diagnóstico:</span> {consultation.diagnosis}
                      </p>
                    </div>
                  )}
                  
                  <div className="ml-11 flex items-center gap-4 text-xs text-gray-500">
                    {consultation.visual_acuity_od && (
                      <span>AV OD: {consultation.visual_acuity_od}</span>
                    )}
                    {consultation.visual_acuity_oe && (
                      <span>AV OE: {consultation.visual_acuity_oe}</span>
                    )}
                    {consultation.ocular_pressure_od && (
                      <span>PIO OD: {consultation.ocular_pressure_od}</span>
                    )}
                    {consultation.ocular_pressure_oe && (
                      <span>PIO OE: {consultation.ocular_pressure_oe}</span>
                    )}
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Ver Detalhes
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
