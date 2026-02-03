
import React from 'react';
import { FileText, Stethoscope, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Consultation {
    id: string;
    consultation_date: string;
    doctor_name: string;
    diagnosis?: string;
    status?: string;
}

interface Exam {
    id: string;
    exam_date: string;
    exam_type: string;
    doctor_name?: string;
    status?: string;
}

interface ConsultationHistoryListProps {
    loading: boolean;
    consultations: Consultation[];
    exams: Exam[];
    setSelectedConsultation: (consultation: any) => void;
    setShowConsultationDetails: (show: boolean) => void;
    getStatusColor: (status: string | null | undefined) => string;
    translateStatus: (status: string | null | undefined) => string;
    examTypeLabels: { [key: string]: string };
}

export const ConsultationHistoryList = ({
    loading,
    consultations,
    exams,
    setSelectedConsultation,
    setShowConsultationDetails,
    getStatusColor,
    translateStatus,
    examTypeLabels
}: ConsultationHistoryListProps) => {
    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Histórico
            </h3>

            <ScrollArea className="h-[300px] pr-4">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {/* Consultas */}
                        {consultations.length > 0 && (
                            <div>
                                <h4 className="font-medium text-gray-700 text-xs mb-2 flex items-center gap-2">
                                    <Stethoscope className="h-3 w-3" />
                                    Consultas ({consultations.length})
                                </h4>
                                <div className="space-y-2">
                                    {consultations.map((consultation) => (
                                        <div
                                            key={consultation.id}
                                            className="bg-marrom-acentuado/5 p-3 rounded-md border border-marrom-acentuado/20 cursor-pointer hover:bg-marrom-acentuado/10 transition-colors"
                                            onClick={() => {
                                                setSelectedConsultation(consultation);
                                                setShowConsultationDetails(true);
                                            }}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-xs font-medium text-gray-700">
                                                    {new Date(consultation.consultation_date).toLocaleDateString('pt-BR')}
                                                </p>
                                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(consultation.status)}`}>
                                                    {translateStatus(consultation.status)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600">{consultation.doctor_name}</p>
                                            {consultation.diagnosis && (
                                                <p className="text-xs text-gray-500 mt-1">{consultation.diagnosis}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Exames */}
                        {exams.length > 0 && (
                            <div>
                                <h4 className="font-medium text-gray-700 text-xs mb-2 flex items-center gap-2 mt-4">
                                    <Eye className="h-3 w-3" />
                                    Exames ({exams.length})
                                </h4>
                                <div className="space-y-2">
                                    {exams.map((exam) => (
                                        <div key={exam.id} className="bg-marrom-acentuado/5 p-3 rounded-md border border-marrom-acentuado/20">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-xs font-medium text-gray-700">
                                                    {new Date(exam.exam_date).toLocaleDateString('pt-BR')}
                                                </p>
                                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(exam.status)}`}>
                                                    {translateStatus(exam.status)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-700 font-medium">
                                                {examTypeLabels[exam.exam_type] || exam.exam_type}
                                            </p>
                                            {exam.doctor_name && (
                                                <p className="text-xs text-gray-600">{exam.doctor_name}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!loading && consultations.length === 0 && exams.length === 0 && (
                            <p className="text-xs text-gray-500 text-center py-4">
                                Nenhum histórico encontrado
                            </p>
                        )}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};
