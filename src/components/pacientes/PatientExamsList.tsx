import React from 'react';
import { TestTube, FileText, Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { examTypeLabels } from '@/utils/statusUtils';

interface PatientExam {
    id: string;
    exam_type: string;
    exam_date: string;
    doctor_name?: string;
    description?: string;
    results?: string;
    status: string;
}

interface PatientExamsListProps {
    exams: PatientExam[];
    loading: boolean;
}

export function PatientExamsList({ exams, loading }: PatientExamsListProps) {
    return (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 h-full">
            <div className="flex items-center gap-2 mb-4">
                <TestTube className="h-5 w-5 text-gray-600" />
                <Label className="text-sm font-semibold text-gray-700">Exames Cadastrados</Label>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
                </div>
            ) : exams.length > 0 ? (
                <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-3">
                        {exams.map((exam) => (
                            <div
                                key={exam.id}
                                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FileText className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-800">
                                                {examTypeLabels[exam.exam_type] || exam.exam_type}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                                            <Calendar className="h-3 w-3" />
                                            <span>{new Date(exam.exam_date).toLocaleDateString('pt-BR')}</span>
                                            {exam.doctor_name && (
                                                <>
                                                    <span>•</span>
                                                    <span>{exam.doctor_name}</span>
                                                </>
                                            )}
                                        </div>
                                        {exam.description && (
                                            <p className="text-xs text-gray-600 mb-1 line-clamp-2">{exam.description}</p>
                                        )}
                                        {exam.results && (
                                            <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded mt-2 line-clamp-3">
                                                {exam.results}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${exam.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        exam.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                            exam.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {exam.status === 'completed' ? 'Concluído' :
                                            exam.status === 'in_progress' ? 'Em Andamento' :
                                                exam.status === 'pending' ? 'Pendente' :
                                                    exam.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            ) : (
                <div className="text-center py-8">
                    <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Nenhum exame cadastrado para este paciente.</p>
                </div>
            )}
        </div>
    );
}
