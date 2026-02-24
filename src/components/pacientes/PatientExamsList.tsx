import React, { useState, useEffect } from 'react';
import { TestTube, FileText, Calendar, Pill, ClipboardList } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { examTypeLabels } from '@/utils/statusUtils';
import { supabase } from '@/integrations/supabase/client';

interface PatientExam {
    id: string;
    exam_type: string;
    exam_date: string;
    doctor_name?: string;
    description?: string;
    results?: string;
    status: string;
}

interface PastPrescription {
    id: string;
    consultation_date: string;
    doctor_name?: string;
    prescription?: string;
    anamnesis?: string;
}

interface PatientExamsListProps {
    exams: PatientExam[];
    loading: boolean;
    patientId: string;
    /** Renderiza o botão de gerar receita (passado pelo pai que controla o Dialog) */
    generateReceiptButton?: React.ReactNode;
}

export function PatientExamsList({ exams, loading, patientId, generateReceiptButton }: PatientExamsListProps) {
    const [prescriptions, setPrescriptions] = useState<PastPrescription[]>([]);
    const [loadingPrescriptions, setLoadingPrescriptions] = useState(true);

    useEffect(() => {
        if (!patientId) return;
        const fetchPrescriptions = async () => {
            setLoadingPrescriptions(true);
            const { data } = await supabase
                .from('consultations')
                .select('id, consultation_date, doctor_name, prescription, anamnesis')
                .eq('patient_id', patientId)
                .not('prescription', 'is', null)
                .order('consultation_date', { ascending: false })
                .limit(20);
            if (data) setPrescriptions(data as PastPrescription[]);
            setLoadingPrescriptions(false);
        };
        fetchPrescriptions();
    }, [patientId]);

    return (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col h-full">
            <Tabs defaultValue="exames" className="flex flex-col flex-1 min-h-0">
                <TabsList className="w-full grid grid-cols-2 mb-3 shrink-0">
                    <TabsTrigger value="exames" className="flex items-center gap-1.5 text-xs">
                        <TestTube className="h-3.5 w-3.5" /> Exames
                    </TabsTrigger>
                    <TabsTrigger value="receitas" className="flex items-center gap-1.5 text-xs">
                        <ClipboardList className="h-3.5 w-3.5" /> Receitas
                    </TabsTrigger>
                </TabsList>

                {/* ─── ABA EXAMES ─── */}
                <TabsContent value="exames" className="flex-1 min-h-0 mt-0">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
                        </div>
                    ) : exams.length > 0 ? (
                        <ScrollArea className="h-[420px] pr-2">
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
                </TabsContent>

                {/* ─── ABA RECEITAS ─── */}
                <TabsContent value="receitas" className="flex-1 min-h-0 mt-0">
                    {loadingPrescriptions ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
                        </div>
                    ) : prescriptions.length > 0 ? (
                        <ScrollArea className="h-[420px] pr-2">
                            <div className="space-y-3">
                                {prescriptions.map((rx) => (
                                    <div
                                        key={rx.id}
                                        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Pill className="h-3.5 w-3.5 text-medical-primary" />
                                            <span className="text-xs text-gray-500">
                                                {new Date(rx.consultation_date).toLocaleDateString('pt-BR')}
                                            </span>
                                            {rx.doctor_name && (
                                                <>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-xs text-gray-500">{rx.doctor_name}</span>
                                                </>
                                            )}
                                        </div>
                                        <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                                            {rx.prescription}
                                        </pre>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="text-center py-8">
                            <Pill className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Nenhuma receita prescrita anteriormente.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* ─── BOTÃO GERAR RECEITA (rodapé) ─── */}
            {generateReceiptButton && (
                <div className="mt-3 pt-3 border-t border-gray-200 shrink-0">
                    {generateReceiptButton}
                </div>
            )}
        </div>
    );
}
