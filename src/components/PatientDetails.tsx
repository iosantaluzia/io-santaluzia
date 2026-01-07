
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, Phone, Mail, FileText, TestTube, Plus } from 'lucide-react';
import { PatientMedicalHistory } from './PatientMedicalHistory';
import { PatientConsultations } from './PatientConsultations';
import { PatientExams } from './PatientExams';
import { NewConsultationForm } from './NewConsultationForm';

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
}

export function PatientDetails({ patient, onBack }: PatientDetailsProps) {
  const [activeTab, setActiveTab] = useState('prontuario');
  const [showNewConsultation, setShowNewConsultation] = useState(false);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleNewConsultationSaved = () => {
    setShowNewConsultation(false);
    setActiveTab('prontuario');
  };

  if (showNewConsultation) {
    return (
      <NewConsultationForm
        patient={patient}
        onBack={() => setShowNewConsultation(false)}
        onSaved={handleNewConsultationSaved}
      />
    );
  }

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
            <h2 className="text-2xl font-bold text-cinza-escuro">Prontuário do Paciente</h2>
            <p className="text-gray-600">Histórico médico e consultas</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowNewConsultation(true)}
          className="bg-bege-principal hover:bg-bege-principal/90 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Consulta
        </Button>
      </div>

      {/* Informações do Paciente */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start space-x-6">
          <div className="h-16 w-16 rounded-full bg-bege-principal flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h3 className="text-xl font-semibold text-cinza-escuro mb-2">{patient.name}</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {calculateAge(patient.date_of_birth)} anos • {new Date(patient.date_of_birth).toLocaleDateString('pt-BR')}
                </p>
                <p className="text-gray-600 mt-1">CPF: {patient.cpf}</p>
              </div>
              <div>
                {patient.phone && (
                  <p className="text-gray-600 flex items-center gap-2 mb-1">
                    <Phone className="h-4 w-4" />
                    {patient.phone}
                  </p>
                )}
                {patient.email && (
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {patient.email}
                  </p>
                )}
              </div>
              <div>
                {patient.address && (
                  <p className="text-gray-600 text-sm">{patient.address}</p>
                )}
                {patient.emergency_contact && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-500 uppercase">Contato de Emergência</p>
                    <p className="text-gray-600 text-sm">{patient.emergency_contact}</p>
                    {patient.emergency_phone && (
                      <p className="text-gray-600 text-sm">{patient.emergency_phone}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Abas de navegação */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('prontuario')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'prontuario'
                  ? 'border-bege-principal text-bege-principal'
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
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'exames'
                  ? 'border-bege-principal text-bege-principal'
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

        {/* Conteúdo das abas */}
        <div className="p-6">
          {activeTab === 'prontuario' && (
            <div className="space-y-6 w-full overflow-x-hidden">
              <PatientMedicalHistory patient={patient} />
              <PatientConsultations patientId={patient.id} />
            </div>
          )}
          {activeTab === 'exames' && (
            <PatientExams patientId={patient.id} />
          )}
        </div>
      </div>
    </div>
  );
}
