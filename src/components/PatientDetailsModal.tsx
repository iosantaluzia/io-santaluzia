import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, MapPin, Calendar, FileText, Stethoscope } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    name: string;
    time: string;
    status: string;
    cpf?: string;
    phone?: string;
    email?: string;
    address?: string;
    birthDate?: string;
    observations?: string;
  };
  onOpenConsultation?: () => void;
}

export function PatientDetailsModal({ isOpen, onClose, patient, onOpenConsultation }: PatientDetailsModalProps) {
  const { appUser } = useAuth();
  const isDoctor = appUser?.role === 'doctor';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-medical-primary">
            Detalhes do Paciente
          </DialogTitle>
          <DialogDescription className="text-center">
            Informações do agendamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações do Agendamento */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="font-semibold text-gray-700">Agendamento:</span>
            </div>
            <p className="text-sm text-gray-600 ml-6">Horário: {patient.time}</p>
            <div className="ml-6 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block
                ${patient.status === 'Confirmado' ? 'bg-green-100 text-green-800' :
                  patient.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'}`}>
                {patient.status}
              </span>
            </div>
          </div>

          {/* Dados do Paciente */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-gray-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-700">{patient.name}</p>
                {patient.cpf && (
                  <p className="text-sm text-gray-600">CPF: {patient.cpf}</p>
                )}
              </div>
            </div>

            {patient.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-600" />
                <p className="text-sm text-gray-700">{patient.phone}</p>
              </div>
            )}

            {patient.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-600" />
                <p className="text-sm text-gray-700">{patient.email}</p>
              </div>
            )}

            {patient.birthDate && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-600" />
                <p className="text-sm text-gray-700">
                  Data de Nascimento: {patient.birthDate}
                </p>
              </div>
            )}

            {patient.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-600 mt-1" />
                <p className="text-sm text-gray-700">{patient.address}</p>
              </div>
            )}

            {patient.observations && (
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-gray-600 mt-1" />
                <div>
                  <p className="font-semibold text-gray-700 text-sm">Observações:</p>
                  <p className="text-sm text-gray-600">{patient.observations}</p>
                </div>
              </div>
            )}
          </div>

          {/* Botão para Acessar Consulta (Só para Médicos) */}
          {isDoctor && onOpenConsultation && (
            <div className="pt-4 border-t">
              <Button
                onClick={onOpenConsultation}
                className="w-full bg-medical-primary hover:bg-medical-primary/90"
              >
                <Stethoscope className="h-4 w-4 mr-2" />
                Acessar Dados da Consulta
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Acesso exclusivo para médicos
              </p>
            </div>
          )}

          {!isDoctor && (
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                <Stethoscope className="h-3 w-3 inline mr-1" />
                Dados de consulta disponíveis apenas para médicos
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

