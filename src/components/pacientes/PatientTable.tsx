import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { calculateAge, formatPhone } from '@/utils/formatters';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { Clock, Users } from 'lucide-react';

interface PatientTableProps {
    patients: any[];
    loading: boolean;
    searchTerm: string;
    onViewDetails: (patient: any) => void;
    onViewMedicalRecord: (patient: any) => void;
    appUser: any;
    observerTarget: React.RefObject<HTMLDivElement>;
    isLoadingMore: boolean;
    hasMore: boolean;
    itemsPerPage: number;
}

export function PatientTable({
    patients,
    loading,
    searchTerm,
    onViewDetails,
    onViewMedicalRecord,
    appUser,
    observerTarget,
    isLoadingMore,
    hasMore,
    itemsPerPage
}: PatientTableProps) {
    const [viewMode, setViewMode] = useState<'all' | 'recent'>('all');
    const [recentPatients, setRecentPatients] = useState<any[]>([]);
    const [loadingRecent, setLoadingRecent] = useState(false);

    // Buscar pacientes dos últimos 7 dias que efetivamente passaram pela clínica
    useEffect(() => {
        if (viewMode !== 'recent') return;
        const fetchRecent = async () => {
            setLoadingRecent(true);
            try {
                const since = new Date();
                since.setDate(since.getDate() - 7);
                const sinceISO = since.toISOString();

                // Statuses que indicam presença efetiva na clínica
                // (excluir: scheduled/agendado, confirmed, cancelled/cancelado, rescheduled/remarcado)
                const activeStatuses = [
                    'pending', 'aguardando', 'aguardando_pagamento', 'pendente',
                    'in_progress', 'in_attendance', 'em_atendimento',
                    'completed', 'realizado'
                ];

                const { data: recentConsultations } = await supabase
                    .from('consultations')
                    .select('patient_id, consultation_date, status')
                    .gte('consultation_date', sinceISO)
                    .in('status', activeStatuses)
                    .order('consultation_date', { ascending: false });

                const recentPatientIds = Array.from(
                    new Set((recentConsultations || []).map((c: any) => c.patient_id))
                ).filter(Boolean);

                if (recentPatientIds.length === 0) {
                    setRecentPatients([]);
                    return;
                }

                // Buscar dados completos dos pacientes
                const { data: patientsData } = await supabase
                    .from('patients')
                    .select('*')
                    .in('id', recentPatientIds);

                // Ordenar pela consulta mais recente (manter ordem do select acima)
                const orderedIds = recentPatientIds;
                const patientsMap = new Map((patientsData || []).map(p => [p.id, p]));
                const ordered = orderedIds
                    .map(id => patientsMap.get(id))
                    .filter(Boolean);

                setRecentPatients(ordered);
            } catch (err) {
                logger.error('Erro ao buscar pacientes recentes:', err);
            } finally {
                setLoadingRecent(false);
            }
        };
        fetchRecent();
    }, [viewMode]);

    const displayPatients = viewMode === 'recent' ? recentPatients : patients;
    const isLoading = viewMode === 'recent' ? loadingRecent : loading;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header com toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                <button
                    onClick={() => setViewMode('all')}
                    className={`flex items-center gap-2 text-lg sm:text-xl font-semibold transition-colors ${viewMode === 'all'
                        ? 'text-cinza-escuro'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <Users className={`h-5 w-5 ${viewMode === 'all' ? 'text-marrom-acentuado' : ''}`} />
                    Pacientes Cadastrados
                </button>

                <span className="hidden sm:inline text-gray-300 text-xl">|</span>

                <button
                    onClick={() => setViewMode('recent')}
                    className={`flex items-center gap-2 text-lg sm:text-xl font-semibold transition-colors ${viewMode === 'recent'
                        ? 'text-marrom-acentuado'
                        : 'text-gray-400 hover:text-gray-600'
                        }`}
                >
                    <Clock className={`h-5 w-5 ${viewMode === 'recent' ? 'text-marrom-acentuado' : ''}`} />
                    <span className="whitespace-nowrap">Pacientes Recentes</span>
                    {viewMode === 'recent' && recentPatients.length > 0 && (
                        <span className="ml-1 text-xs sm:text-sm font-normal bg-marrom-acentuado/10 text-marrom-acentuado px-2 py-0.5 rounded-full whitespace-nowrap">
                            {recentPatients.length} • últimos 7 dias
                        </span>
                    )}
                </button>
            </div>

            <div key={viewMode} className="animate-tab-in">
                {displayPatients.length === 0 ? (
                    <p className="text-gray-500 text-center mt-8">
                        {viewMode === 'recent'
                            ? 'Nenhum paciente atendido ou cadastrado nos últimos 7 dias.'
                            : searchTerm
                                ? 'Nenhum paciente encontrado para a busca.'
                                : 'Nenhum paciente cadastrado.'}
                    </p>
                ) : (
                    <div className="overflow-x-auto w-full pb-2">
                        <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
                            <table className="min-w-full bg-white rounded-md shadow-sm text-sm sm:text-base">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left">Nome</th>
                                        <th className="py-3 px-6 text-left">CPF</th>
                                        <th className="py-3 px-6 text-left">Nascimento</th>
                                        <th className="py-3 px-6 text-left">Telefone</th>
                                        {viewMode === 'recent' && (
                                            <th className="py-3 px-6 text-left">Cadastrado em</th>
                                        )}
                                        <th className="py-3 px-6 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 text-xs sm:text-sm font-light">
                                    {displayPatients.map(patient => (
                                        <tr
                                            key={patient.id}
                                            className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                                            onClick={(e) => {
                                                if ((e.target as HTMLElement).closest('button')) return;
                                                onViewDetails(patient);
                                            }}
                                        >
                                            <td className="py-3 px-6 text-left font-medium">{patient.name}</td>
                                            <td className="py-3 px-6 text-left">{patient.cpf || '-'}</td>
                                            <td className="py-3 px-6 text-left">
                                                {calculateAge(patient.date_of_birth)}
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                {patient.phone ? formatPhone(patient.phone) : '-'}
                                            </td>
                                            {viewMode === 'recent' && (
                                                <td className="py-3 px-6 text-left text-xs text-gray-500">
                                                    {patient.created_at
                                                        ? new Date(patient.created_at).toLocaleDateString('pt-BR')
                                                        : '-'}
                                                </td>
                                            )}
                                            <td className="py-3 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onViewDetails(patient)}
                                                        className="hover:bg-medical-primary hover:text-white w-full sm:w-auto h-7 sm:h-9 text-[10px] sm:text-sm px-2 sm:px-3"
                                                    >
                                                        Ver Detalhes
                                                    </Button>
                                                    {(appUser?.role === 'admin' || appUser?.role === 'doctor') && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => onViewMedicalRecord(patient)}
                                                            className="hover:bg-medical-primary hover:text-white w-full sm:w-auto h-7 sm:h-9 text-[10px] sm:text-sm px-2 sm:px-3"
                                                        >
                                                            Prontuário
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {viewMode === 'all' && searchTerm.trim() && (
                                <>
                                    <div ref={observerTarget} className="h-4" />
                                    {isLoadingMore && (
                                        <div className="flex justify-center items-center py-4">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
                                            <span className="ml-2 text-sm text-gray-600">Carregando mais pacientes...</span>
                                        </div>
                                    )}
                                    {!hasMore && patients.length > itemsPerPage && (
                                        <div className="text-center py-4 text-sm text-gray-500">
                                            Todos os pacientes foram carregados
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
