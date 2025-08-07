
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  date_of_birth: string;
}

interface NewConsultationFormProps {
  patient: Patient;
  onBack: () => void;
  onSaved: () => void;
}

export function NewConsultationForm({ patient, onBack, onSaved }: NewConsultationFormProps) {
  const { appUser } = useAuth();
  const [loading, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    doctor_name: '',
    consultation_date: new Date().toISOString().slice(0, 16),
    anamnesis: '',
    physical_exam: '',
    visual_acuity_od: '',
    visual_acuity_oe: '',
    ocular_pressure_od: '',
    ocular_pressure_oe: '',
    biomicroscopy: '',
    diagnosis: '',
    prescription: '',
    observations: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('consultations')
        .insert({
          patient_id: patient.id,
          doctor_name: formData.doctor_name,
          consultation_date: formData.consultation_date,
          anamnesis: formData.anamnesis,
          physical_exam: formData.physical_exam,
          visual_acuity_od: formData.visual_acuity_od,
          visual_acuity_oe: formData.visual_acuity_oe,
          ocular_pressure_od: formData.ocular_pressure_od,
          ocular_pressure_oe: formData.ocular_pressure_oe,
          biomicroscopy: formData.biomicroscopy,
          diagnosis: formData.diagnosis,
          prescription: formData.prescription,
          observations: formData.observations,
          status: 'completed',
          created_by: appUser?.username || 'sistema'
        });

      if (error) {
        console.error('Erro ao salvar consulta:', error);
        alert('Erro ao salvar consulta. Tente novamente.');
        return;
      }

      alert('Consulta salva com sucesso!');
      onSaved();
    } catch (error) {
      console.error('Erro ao salvar consulta:', error);
      alert('Erro ao salvar consulta. Tente novamente.');
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

      {/* Formulário */}
      <form id="consultation-form" onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Médico Responsável *</label>
            <Input
              required
              value={formData.doctor_name}
              onChange={(e) => handleInputChange('doctor_name', e.target.value)}
              placeholder="Nome do médico"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data e Hora da Consulta *</label>
            <Input
              type="datetime-local"
              required
              value={formData.consultation_date}
              onChange={(e) => handleInputChange('consultation_date', e.target.value)}
            />
          </div>
        </div>

        {/* Anamnese */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Anamnese</label>
          <Textarea
            value={formData.anamnesis}
            onChange={(e) => handleInputChange('anamnesis', e.target.value)}
            placeholder="Histórico da queixa principal, sintomas relatados pelo paciente..."
            rows={4}
          />
        </div>

        {/* Exame Físico */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Exame Físico</label>
          <Textarea
            value={formData.physical_exam}
            onChange={(e) => handleInputChange('physical_exam', e.target.value)}
            placeholder="Achados do exame físico geral..."
            rows={3}
          />
        </div>

        {/* Acuidade Visual */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Acuidade Visual</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Olho Direito (OD)</label>
              <Input
                value={formData.visual_acuity_od}
                onChange={(e) => handleInputChange('visual_acuity_od', e.target.value)}
                placeholder="Ex: 20/20, 20/40, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Olho Esquerdo (OE)</label>
              <Input
                value={formData.visual_acuity_oe}
                onChange={(e) => handleInputChange('visual_acuity_oe', e.target.value)}
                placeholder="Ex: 20/20, 20/40, etc."
              />
            </div>
          </div>
        </div>

        {/* Pressão Ocular */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3">Pressão Intraocular</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Olho Direito (OD) - mmHg</label>
              <Input
                value={formData.ocular_pressure_od}
                onChange={(e) => handleInputChange('ocular_pressure_od', e.target.value)}
                placeholder="Ex: 14, 16, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Olho Esquerdo (OE) - mmHg</label>
              <Input
                value={formData.ocular_pressure_oe}
                onChange={(e) => handleInputChange('ocular_pressure_oe', e.target.value)}
                placeholder="Ex: 14, 16, etc."
              />
            </div>
          </div>
        </div>

        {/* Biomicroscopia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Biomicroscopia</label>
          <Textarea
            value={formData.biomicroscopy}
            onChange={(e) => handleInputChange('biomicroscopy', e.target.value)}
            placeholder="Achados da biomicroscopia (lâmpada de fenda)..."
            rows={3}
          />
        </div>

        {/* Diagnóstico */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Diagnóstico</label>
          <Textarea
            value={formData.diagnosis}
            onChange={(e) => handleInputChange('diagnosis', e.target.value)}
            placeholder="Diagnóstico principal e secundários..."
            rows={3}
          />
        </div>

        {/* Prescrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prescrição</label>
          <Textarea
            value={formData.prescription}
            onChange={(e) => handleInputChange('prescription', e.target.value)}
            placeholder="Medicações, óculos, lentes de contato..."
            rows={4}
          />
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
          <Textarea
            value={formData.observations}
            onChange={(e) => handleInputChange('observations', e.target.value)}
            placeholder="Observações adicionais, orientações ao paciente..."
            rows={3}
          />
        </div>
      </form>
    </div>
  );
}
