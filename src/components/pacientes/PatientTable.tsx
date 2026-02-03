import React from 'react';
import { Button } from '@/components/ui/button';
import { calculateAge } from '@/utils/formatters';

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
    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
            </div>
        );
    }

    if (patients.length === 0) {
        return (
            <p className="text-gray-500 text-center mt-8">
                {searchTerm ? 'Nenhum paciente encontrado para a busca.' : 'Nenhum paciente cadastrado.'}
            </p>
        );
    }

    return (
        <div className="w-full">
            <h3 className="text-xl font-semibold text-cinza-escuro mb-4">Pacientes Cadastrados</h3>
            <div className="overflow-x-auto">
                <div className="max-h-96 overflow-y-auto">
                    <table className="min-w-full bg-white rounded-md shadow-sm">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Nome</th>
                                <th className="py-3 px-6 text-left">CPF</th>
                                <th className="py-3 px-6 text-left">Nascimento</th>
                                <th className="py-3 px-6 text-left">Telefone</th>
                                <th className="py-3 px-6 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {patients.map(patient => (
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
                                    <td className="py-3 px-6 text-left">{patient.phone || '-'}</td>
                                    <td className="py-3 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onViewDetails(patient)}
                                            >
                                                Ver Detalhes
                                            </Button>
                                            {(appUser?.role === 'admin' || appUser?.role === 'doctor') && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onViewMedicalRecord(patient)}
                                                >
                                                    Ver Prontuário
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {searchTerm.trim() && (
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
        </div>
    );
}
