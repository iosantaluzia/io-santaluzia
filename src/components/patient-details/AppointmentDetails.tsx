
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, X, Play, RotateCcw } from 'lucide-react';

interface AppointmentDetailsProps {
    patient: any;
    isDoctor: boolean;
    isSecretary: boolean;
    isTodayAppointment: () => boolean;
    canEditCurrentConsultation: () => boolean;
    isConsultationStarted: () => boolean;
    handleEditAppointment: () => void;
    handleDeleteAppointment: () => void;
    handleStartCurrentConsultation: () => void;
    handleScheduleReturn?: () => void;
    getStatusColor: (status: string | null | undefined) => string;
    translateStatus: (status: string | null | undefined) => string;
}

export const AppointmentDetails = ({
    patient,
    isDoctor,
    isSecretary,
    isTodayAppointment,
    canEditCurrentConsultation,
    isConsultationStarted,
    handleEditAppointment,
    handleDeleteAppointment,
    handleStartCurrentConsultation,
    handleScheduleReturn,
    getStatusColor,
    translateStatus
}: AppointmentDetailsProps) => {
    return (
        <div className="bg-marrom-acentuado/10 p-4 rounded-lg relative border border-marrom-acentuado/20">
            <div className="absolute top-3 right-3 flex gap-2">
                {patient.consultationId && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditAppointment}
                            className="h-7 px-2 text-xs"
                        >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteAppointment}
                            className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <X className="h-3 w-3 mr-1" />
                            Remover
                        </Button>
                    </>
                )}
                {/* Botão "Iniciar Consulta" para médicos quando o agendamento é da data atual */}
                {isDoctor && isTodayAppointment() && (
                    <Button
                        size="sm"
                        onClick={handleStartCurrentConsultation}
                        className="h-7 px-3 text-xs bg-bege-principal hover:bg-bege-principal/90 text-white"
                        disabled={!canEditCurrentConsultation()}
                    >
                        <Play className="h-3 w-3 mr-1" />
                        {canEditCurrentConsultation()
                            ? (isConsultationStarted() ? 'Acessar Consulta' : 'Iniciar Consulta')
                            : 'Consulta não pode ser editada (após 12h)'
                        }
                    </Button>
                )}
                {/* Botão "Agendar Retorno" - disponível para pacientes já cadastrados, visível para médicos e secretárias */}
                {patient.patientId && handleScheduleReturn && (isDoctor || isSecretary) && (
                    <Button
                        size="sm"
                        onClick={handleScheduleReturn}
                        variant="outline"
                        className="h-7 px-3 text-xs border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700"
                    >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Agendar Retorno
                    </Button>
                )}
            </div>
            <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="font-semibold text-gray-700">Agendamento:</span>
            </div>
            {patient.time && (
                <p className="text-sm text-gray-600 ml-6">Horário: {patient.time}</p>
            )}
            {patient.appointmentDate && (
                <p className="text-sm text-gray-600 ml-6">
                    Data: {new Date(patient.appointmentDate).toLocaleDateString('pt-BR')}
                </p>
            )}
            {patient.appointmentType && (
                <p className="text-sm text-gray-600 ml-6">
                    Tipo: {patient.appointmentType === 'consulta' ? 'Consulta' :
                        patient.appointmentType === 'retorno' ? 'Retorno' :
                            patient.appointmentType === 'exame' ? 'Exame' :
                                patient.appointmentType === 'pagamento_honorarios' ? 'Pagamento de Honorários' :
                                    patient.appointmentType}
                </p>
            )}
            <div className="ml-6 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(patient.status)}`}>
                    {translateStatus(patient.status)}
                </span>
            </div>
        </div>
    );
};
