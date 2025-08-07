
import React from 'react';
import { AlertTriangle, Pill, FileText } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  medical_history?: string;
  allergies?: string;
  medications?: string;
}

interface PatientMedicalHistoryProps {
  patient: Patient;
}

export function PatientMedicalHistory({ patient }: PatientMedicalHistoryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-cinza-escuro">Histórico Médico</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Histórico Médico */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-gray-600" />
            <h4 className="font-medium text-gray-700">Histórico Médico</h4>
          </div>
          <p className="text-sm text-gray-600">
            {patient.medical_history || 'Nenhum histórico médico registrado'}
          </p>
        </div>

        {/* Alergias */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <h4 className="font-medium text-red-700">Alergias</h4>
          </div>
          <p className="text-sm text-red-600">
            {patient.allergies || 'Nenhuma alergia conhecida'}
          </p>
        </div>

        {/* Medicações */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Pill className="h-4 w-4 text-blue-600" />
            <h4 className="font-medium text-blue-700">Medicações Atuais</h4>
          </div>
          <p className="text-sm text-blue-600">
            {patient.medications || 'Nenhuma medicação registrada'}
          </p>
        </div>
      </div>
    </div>
  );
}
