
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, Stethoscope } from 'lucide-react';

interface Consultation {
    id: string;
    consultation_date: string;
    doctor_name: string;
    diagnosis?: string;
    status?: string;
    saved_at?: string;
    amount?: number;
    payment_received?: boolean;
    anamnesis?: string;
    prescription?: string;
    observations?: string;
}

interface ConsultationDetailsModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    patientName: string;
    selectedConsultation: Consultation | null;
    getStatusColor: (status: string | null | undefined) => string;
    translateStatus: (status: string | null | undefined) => string;
    isDoctor: boolean;
    onOpenConsultationForPatient?: (patientId: string, consultationId: string) => void;
    onOpenConsultation?: () => void;
    onSectionChange?: (section: string) => void;
    patientId: string | null;
}

export const ConsultationDetailsModal = ({
    isOpen,
    onOpenChange,
    patientName,
    selectedConsultation,
    getStatusColor,
    translateStatus,
    isDoctor,
    onOpenConsultationForPatient,
    onOpenConsultation,
    onSectionChange,
    patientId
}: ConsultationDetailsModalProps) => {
    if (!selectedConsultation) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Detalhes da Consulta</DialogTitle>
                    <DialogDescription>
                        Informações da consulta de {patientName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Informações Básicas */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium text-gray-600">Data e Horário</Label>
                            <p className="text-sm text-gray-900 mt-1">
                                {new Date(selectedConsultation.consultation_date).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium text-gray-600">Médico</Label>
                            <p className="text-sm text-gray-900 mt-1">{selectedConsultation.doctor_name}</p>
                        </div>
                    </div>

                    {/* Linha com Status e Pagamento lado a lado */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Status */}
                        <div>
                            <Label className="text-sm font-medium text-gray-600">Status</Label>
                            <div className="mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(selectedConsultation.status)}`}>
                                    {translateStatus(selectedConsultation.status)}
                                </span>
                            </div>
                            {selectedConsultation.saved_at && (
                                <p className="text-xs text-gray-500 mt-2">
                                    Finalizada em: {new Date(selectedConsultation.saved_at).toLocaleString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            )}
                        </div>

                        {/* Valor e Pagamento lado a lado */}
                        {(selectedConsultation.amount !== null && selectedConsultation.amount !== undefined) || selectedConsultation.payment_received !== null ? (
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                {selectedConsultation.amount !== null && selectedConsultation.amount !== undefined && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Valor Pago</Label>
                                        <p className="text-sm text-gray-900 mt-1">
                                            R$ {selectedConsultation.amount.toFixed(2).replace('.', ',')}
                                        </p>
                                    </div>
                                )}
                                {selectedConsultation.payment_received !== null && (
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Pagamento</Label>
                                        <p className="text-sm text-gray-900 mt-1">
                                            {selectedConsultation.payment_received ? 'Realizado' : 'Pendente'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>

                    {/* Diagnóstico */}
                    {selectedConsultation.diagnosis && (
                        <div>
                            <Label className="text-sm font-medium text-gray-600">Diagnóstico</Label>
                            <p className="text-sm text-gray-900 mt-1">{selectedConsultation.diagnosis}</p>
                        </div>
                    )}

                    {/* Botões de Ação */}
                    <div className="flex gap-2 pt-4">
                        {/* Botão para Abrir Consulta Completa */}
                        {isDoctor && onOpenConsultationForPatient && patientId && (
                            <Button
                                size="sm"
                                onClick={() => {
                                    onOpenChange(false);
                                    onOpenConsultationForPatient(patientId, selectedConsultation.id);
                                    if (onSectionChange) {
                                        onSectionChange('pacientes');
                                    }
                                }}
                                className="flex-1 bg-medical-primary hover:bg-medical-primary/90"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Abrir Consulta Completa
                            </Button>
                        )}

                        {/* Botão para Acessar Prontuário Completo (Fallback) */}
                        {isDoctor && !onOpenConsultationForPatient && onOpenConsultation && (
                            <Button
                                size="sm"
                                onClick={() => {
                                    onOpenChange(false);
                                    if (onOpenConsultation) {
                                        onOpenConsultation();
                                    }
                                }}
                                className="flex-1 bg-medical-primary hover:bg-medical-primary/90"
                            >
                                <Stethoscope className="h-4 w-4 mr-2" />
                                Acessar Prontuário Completo
                            </Button>
                        )}

                        {/* Botão Fechar */}
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="px-4"
                        >
                            Fechar
                        </Button>
                    </div>

                    {/* Seção de Anamnese, Prescrição e Observações com Scroll Fixo */}
                    {(selectedConsultation.anamnesis || selectedConsultation.prescription || selectedConsultation.observations) && (
                        <div className="border rounded-lg bg-gray-50">
                            <Label className="text-sm font-medium text-gray-600 mb-3 block p-4 pb-0">Detalhes da Consulta</Label>
                            <div className="px-4 pb-4 h-[250px] overflow-y-auto">
                                <div className="space-y-4">
                                    {/* Anamnese */}
                                    {selectedConsultation.anamnesis && isDoctor && (
                                        <div>
                                            <Label className="text-xs font-medium text-gray-500 uppercase">Anamnese</Label>
                                            <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{selectedConsultation.anamnesis}</p>
                                        </div>
                                    )}

                                    {/* Prescrição */}
                                    {selectedConsultation.prescription && isDoctor && (
                                        <div>
                                            <Label className="text-xs font-medium text-gray-500 uppercase">Prescrição</Label>
                                            <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{selectedConsultation.prescription}</p>
                                        </div>
                                    )}

                                    {/* Observações */}
                                    {selectedConsultation.observations && (
                                        <div>
                                            <Label className="text-xs font-medium text-gray-500 uppercase">Observações</Label>
                                            <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{selectedConsultation.observations}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
