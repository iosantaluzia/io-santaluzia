import React from 'react';
import { User, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateDetailedAge } from '@/utils/formatters';

interface ConsultationPatientSummaryProps {
    patient: {
        id: string;
        name: string;
        cpf: string;
        date_of_birth: string;
    };
    onEditPatient?: (patient: any) => void;
}

export function ConsultationPatientSummary({ patient, onEditPatient }: ConsultationPatientSummaryProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-bege-principal flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-cinza-escuro">{patient.name}</h3>
                        <p className="text-gray-600">
                            CPF: {patient.cpf || '-'} • Nascimento: {new Date(patient.date_of_birth).toLocaleDateString('pt-BR')} ({calculateDetailedAge(patient.date_of_birth)})
                        </p>
                    </div>
                </div>
                {onEditPatient && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onEditPatient(patient)}
                        className="bg-marrom-acentuado hover:bg-marrom-acentuado/90 text-white border-marrom-acentuado hover:border-marrom-acentuado/90"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar Paciente
                    </Button>
                )}
            </div>
        </div>
    );
}
