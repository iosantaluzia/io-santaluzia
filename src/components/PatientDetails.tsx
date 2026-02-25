
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, Phone, Mail, FileText, TestTube, Plus, Pencil, X, Save } from 'lucide-react';
import { PatientMedicalHistory } from './PatientMedicalHistory';
import { PatientConsultations } from './PatientConsultations';
import { PatientExams } from './PatientExams';
import { NewConsultationForm } from './NewConsultationForm';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { formatPhone } from '@/utils/formatters';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  date_of_birth: string;
  phone?: string;
  email?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  medical_history?: string;
  allergies?: string;
  medications?: string;
}

interface PatientDetailsProps {
  patient: Patient;
  onBack: () => void;
  onSectionChange?: (section: string) => void;
}

export function PatientDetails({ patient, onBack, onSectionChange }: PatientDetailsProps) {
  const { appUser } = useAuth();
  const canViewMedicalRecords = appUser?.role === 'admin' || appUser?.role === 'doctor';
  const [activeTab, setActiveTab] = useState(canViewMedicalRecords ? 'prontuario' : 'cadastro');
  const [showNewConsultation, setShowNewConsultation] = useState(false);
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);

  // ─── Estado do modal de edição ────────────────────────────────────────────
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localPatient, setLocalPatient] = useState<Patient>(patient);
  const [editForm, setEditForm] = useState({
    name: patient.name || '',
    cpf: patient.cpf || '',
    date_of_birth: patient.date_of_birth || '',
    phone: patient.phone || '',
    email: patient.email || '',
    address: patient.address || '',
    emergency_contact: patient.emergency_contact || '',
    emergency_phone: patient.emergency_phone || '',
    medical_history: patient.medical_history || '',
    allergies: patient.allergies || '',
    medications: patient.medications || '',
  });

  // Sincronizar editForm quando o paciente muda
  useEffect(() => {
    setLocalPatient(patient);
    setEditForm({
      name: patient.name || '',
      cpf: patient.cpf || '',
      date_of_birth: patient.date_of_birth || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      emergency_contact: patient.emergency_contact || '',
      emergency_phone: patient.emergency_phone || '',
      medical_history: patient.medical_history || '',
      allergies: patient.allergies || '',
      medications: patient.medications || '',
    });
  }, [patient]);

  useEffect(() => {
    if (canViewMedicalRecords && activeTab !== 'prontuario') {
      setActiveTab('prontuario');
    }
  }, [canViewMedicalRecords, activeTab]);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '?';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleNewConsultationSaved = () => {
    setShowNewConsultation(false);
    setActiveTab('prontuario');
    if (onSectionChange) onSectionChange('agendamentos');
  };

  // ─── Salvar edição ────────────────────────────────────────────────────────
  const handleSaveEdit = async () => {
    if (!editForm.name.trim()) {
      toast.error('O nome do paciente é obrigatório.');
      return;
    }
    try {
      setSaving(true);
      const { error } = await supabase
        .from('patients')
        .update({
          name: editForm.name.trim(),
          cpf: editForm.cpf || null,
          date_of_birth: editForm.date_of_birth || null,
          phone: editForm.phone || null,
          email: editForm.email || null,
          address: editForm.address || null,
          emergency_contact: editForm.emergency_contact || null,
          emergency_phone: editForm.emergency_phone || null,
          medical_history: editForm.medical_history || null,
          allergies: editForm.allergies || null,
          medications: editForm.medications || null,
        })
        .eq('id', localPatient.id);

      if (error) throw error;

      // Atualizar estado local para refletir edição sem precisar voltar
      setLocalPatient(prev => ({ ...prev, ...editForm }));
      setShowEditModal(false);
      toast.success('Dados do paciente atualizados com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar paciente:', error);
      toast.error('Erro ao salvar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = () => {
    // Reinicia o form com os dados atuais (incluindo edições locais)
    setEditForm({
      name: localPatient.name || '',
      cpf: localPatient.cpf || '',
      date_of_birth: localPatient.date_of_birth || '',
      phone: localPatient.phone || '',
      email: localPatient.email || '',
      address: localPatient.address || '',
      emergency_contact: localPatient.emergency_contact || '',
      emergency_phone: localPatient.emergency_phone || '',
      medical_history: localPatient.medical_history || '',
      allergies: localPatient.allergies || '',
      medications: localPatient.medications || '',
    });
    setShowEditModal(true);
  };

  if (showNewConsultation) {
    return (
      <NewConsultationForm
        patient={localPatient}
        onBack={() => {
          setShowNewConsultation(false);
          setSelectedConsultationId(null);
        }}
        onSaved={handleNewConsultationSaved}
        existingConsultation={selectedConsultationId ? { id: selectedConsultationId } : null}
      />
    );
  }

  const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-marrom-acentuado focus:border-marrom-acentuado outline-none";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

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
              {canViewMedicalRecords ? 'Prontuário do Paciente' : 'Cadastro do Paciente'}
            </h2>
            <p className="text-gray-600">
              {canViewMedicalRecords ? 'Histórico médico e consultas' : 'Informações de cadastro'}
            </p>
          </div>
        </div>
        {canViewMedicalRecords && (
          <Button
            onClick={() => setShowNewConsultation(true)}
            className="bg-marrom-acentuado hover:bg-marrom-acentuado/90 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Consulta
          </Button>
        )}
      </div>

      {/* Card de informações do paciente */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6 relative">
        {/* Botão Editar Cadastro — canto superior direito */}
        <button
          onClick={handleOpenEdit}
          className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-marrom-acentuado border border-gray-200 hover:border-marrom-acentuado/40 bg-white hover:bg-marrom-acentuado/5 rounded-md px-3 py-1.5 transition-all"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar Cadastro
        </button>

        <div className="flex items-start space-x-6">
          <div className="h-16 w-16 rounded-full bg-bege-principal flex items-center justify-center flex-shrink-0">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h3 className="text-xl font-semibold text-cinza-escuro mb-2">{localPatient.name}</h3>
                {localPatient.date_of_birth && (
                  <p className="text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {calculateAge(localPatient.date_of_birth)} anos • {new Date(localPatient.date_of_birth).toLocaleDateString('pt-BR')}
                  </p>
                )}
                {localPatient.cpf && (
                  <p className="text-gray-600 mt-1">CPF: {localPatient.cpf}</p>
                )}
              </div>
              <div>
                {localPatient.phone && (
                  <p className="text-gray-600 flex items-center gap-2 mb-1">
                    <Phone className="h-4 w-4" />
                    {formatPhone(localPatient.phone)}
                  </p>
                )}
                {localPatient.email && (
                  <p className="text-gray-600 flex items-center gap-2 mb-1">
                    <Mail className="h-4 w-4" />
                    {localPatient.email}
                  </p>
                )}
                {localPatient.address && (
                  <p className="text-gray-600 text-sm mt-1">{localPatient.address}</p>
                )}
              </div>
              <div>
                {localPatient.emergency_contact && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">Contato de Emergência</p>
                    <p className="text-gray-600 text-sm">{localPatient.emergency_contact}</p>
                    {localPatient.emergency_phone && (
                      <p className="text-gray-600 text-sm">{localPatient.emergency_phone}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Abas de navegação */}
      {canViewMedicalRecords ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('prontuario')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'prontuario'
                  ? 'border-marrom-acentuado text-marrom-acentuado'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Prontuário
                </div>
              </button>
              <button
                onClick={() => setActiveTab('exames')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'exames'
                  ? 'border-marrom-acentuado text-marrom-acentuado'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  Exames
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'prontuario' && (
              <div className="space-y-6 w-full overflow-x-hidden">
                <PatientMedicalHistory patient={localPatient} />
                <PatientConsultations
                  patientId={localPatient.id}
                  onOpenConsultation={(consultationId) => {
                    setSelectedConsultationId(consultationId);
                    setShowNewConsultation(true);
                  }}
                />
              </div>
            )}
            {activeTab === 'exames' && (
              <PatientExams patientId={localPatient.id} />
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <p className="text-gray-600 text-sm">
            Você tem acesso apenas aos dados de cadastro do paciente. Prontuários médicos são restritos a médicos e administradores.
          </p>
        </div>
      )}

      {/* ─── Modal de Edição de Cadastro ─────────────────────────────────── */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-cinza-escuro">
              <Pencil className="h-5 w-5 text-marrom-acentuado" />
              Editar Dados do Paciente
            </DialogTitle>
            <DialogDescription>
              Altere os dados de cadastro de <strong>{localPatient.name}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Nome e Data de Nascimento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nome completo *</label>
                <input
                  className={inputClass}
                  value={editForm.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className={labelClass}>Data de nascimento</label>
                <input
                  type="date"
                  className={inputClass}
                  value={editForm.date_of_birth}
                  onChange={e => setEditForm(f => ({ ...f, date_of_birth: e.target.value }))}
                />
              </div>
            </div>

            {/* CPF e Telefone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>CPF</label>
                <input
                  className={inputClass}
                  value={editForm.cpf}
                  onChange={e => setEditForm(f => ({ ...f, cpf: e.target.value }))}
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className={labelClass}>Telefone</label>
                <input
                  className={inputClass}
                  value={editForm.phone}
                  onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            {/* E-mail */}
            <div>
              <label className={labelClass}>E-mail</label>
              <input
                type="email"
                className={inputClass}
                value={editForm.email}
                onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>

            {/* Endereço */}
            <div>
              <label className={labelClass}>Endereço</label>
              <input
                className={inputClass}
                value={editForm.address}
                onChange={e => setEditForm(f => ({ ...f, address: e.target.value }))}
                placeholder="Rua, número, bairro, cidade"
              />
            </div>

            {/* Contato de Emergência */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Contato de emergência</label>
                <input
                  className={inputClass}
                  value={editForm.emergency_contact}
                  onChange={e => setEditForm(f => ({ ...f, emergency_contact: e.target.value }))}
                  placeholder="Nome do contato"
                />
              </div>
              <div>
                <label className={labelClass}>Telefone de emergência</label>
                <input
                  className={inputClass}
                  value={editForm.emergency_phone}
                  onChange={e => setEditForm(f => ({ ...f, emergency_phone: e.target.value }))}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            {/* Histórico Médico, Alergias e Medicações */}
            <div>
              <label className={labelClass}>Histórico médico</label>
              <textarea
                rows={2}
                className={inputClass}
                value={editForm.medical_history}
                onChange={e => setEditForm(f => ({ ...f, medical_history: e.target.value }))}
                placeholder="Doenças, cirurgias, internações anteriores..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Alergias</label>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={editForm.allergies}
                  onChange={e => setEditForm(f => ({ ...f, allergies: e.target.value }))}
                  placeholder="Alergias conhecidas"
                />
              </div>
              <div>
                <label className={labelClass}>Medicações em uso</label>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={editForm.medications}
                  onChange={e => setEditForm(f => ({ ...f, medications: e.target.value }))}
                  placeholder="Medicamentos em uso contínuo"
                />
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex-1 bg-marrom-acentuado hover:bg-marrom-acentuado/90 text-white flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
