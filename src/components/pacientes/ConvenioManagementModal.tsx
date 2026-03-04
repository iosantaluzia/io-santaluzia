import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Upload, CheckCircle, AlertCircle, Loader2, Filter, FileSpreadsheet, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ConvenioManagementModalProps {
    onClose: () => void;
    isInline?: boolean;
}

interface ExternalPatient {
    guia?: string;
    name: string;
    date: string;
    procedure?: string;
    amount?: number;
    status: 'pending' | 'matched' | 'missing';
    matchedAppointment?: any;
    isSad?: boolean;
}

export function ConvenioManagementModal({ onClose, isInline = false }: ConvenioManagementModalProps) {
    const [loading, setLoading] = useState(false);
    const [internalAppointments, setInternalAppointments] = useState<any[]>([]);
    const [externalData, setExternalData] = useState<ExternalPatient[]>([]);
    const [rawText, setRawText] = useState('');
    const [viewMode, setViewMode] = useState<'input' | 'comparison'>('input');

    useEffect(() => {
        fetchInternalAppointments();
    }, []);

    const fetchInternalAppointments = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('consultations')
                .select(`
                  id,
                  doctor_name,
                  consultation_date,
                  status,
                  appointment_type,
                  payment_method,
                  patients (
                    name,
                    cpf
                  )
                `)
                .or('appointment_type.eq.convenio,payment_method.ilike.%unimed%')
                .order('consultation_date', { ascending: false });

            if (error) throw error;
            setInternalAppointments(data || []);
        } catch (error) {
            console.error('Erro ao buscar agendamentos internos:', error);
            toast.error('Erro ao carregar agendamentos internos');
        } finally {
            setLoading(false);
        }
    };

    const handleProcessData = () => {
        if (!rawText.trim()) {
            toast.error('Por favor, cole os dados para processar');
            return;
        }

        const lines = rawText.split('\n').filter(line => line.trim().length > 10);
        const processed: ExternalPatient[] = [];

        lines.forEach(line => {
            const matchData = line.match(/(\d{8})\s+\d{8,}\s+\d{10,}\s+([A-Z\s]+?)\s+(\d{2}\/\d{2}\/\d{2})/);

            if (matchData) {
                const [_, guia, name, date] = matchData;
                const fullDateStr = date.replace(/\/(\d{2})$/, '/20$1');

                const internalMatch = internalAppointments.find(app => {
                    const internalDate = format(new Date(app.consultation_date), "dd/MM/yyyy");
                    const namesMatch = app.patients?.name?.toLowerCase().includes(name.trim().toLowerCase()) ||
                        name.trim().toLowerCase().includes(app.patients?.name?.toLowerCase() || '');
                    return namesMatch && internalDate === fullDateStr;
                });

                processed.push({
                    guia,
                    name: name.trim(),
                    date: fullDateStr,
                    status: internalMatch ? 'matched' : 'missing',
                    matchedAppointment: internalMatch
                });
            } else if (line.match(/[A-Z]{3,}\s[A-Z]{3,}/)) {
                const possibleName = line.split('\t')[0].trim();
                if (possibleName.length > 5 && !possibleName.includes(':')) {
                    const internalMatch = internalAppointments.find(app =>
                        app.patients?.name?.toLowerCase().includes(possibleName.toLowerCase())
                    );
                    processed.push({
                        name: possibleName,
                        date: 'Não identificada',
                        status: internalMatch ? 'matched' : 'missing',
                        matchedAppointment: internalMatch
                    });
                }
            }
        });

        if (processed.length === 0) {
            toast.error('Não foi possível extrair dados.');
            return;
        }

        setExternalData(processed);
        setViewMode('comparison');
        toast.success(`${processed.length} registros extraídos.`);
    };

    const content = (
        <div className={cn("flex flex-col h-full bg-white rounded-lg", !isInline && "max-h-[90vh]")}>
            <div className="flex justify-between items-center p-6 border-b">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                        Gestão de Convênios
                    </h2>
                    <p className="text-sm text-gray-500">
                        Compare os dados extraídos do portal da Unimed com seus agendamentos internos.
                    </p>
                </div>
                <Button variant="ghost" onClick={onClose} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {viewMode === 'input' ? (
                    <div className="space-y-4 py-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                            <h4 className="text-sm font-semibold text-blue-800 mb-1 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Como usar
                            </h4>
                            <p className="text-xs text-blue-700">
                                Copie a tabela de beneficiários ou a relação de guias do portal Unimed (SolusWeb) e cole abaixo.
                            </p>
                        </div>

                        <textarea
                            className="w-full h-64 p-3 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Cole aqui os dados copiados do portal..."
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                        />

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={onClose}>Cancelar</Button>
                            <Button onClick={handleProcessData} disabled={!rawText.trim() || loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                                Processar e Comparar
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2">
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    {externalData.filter(d => d.status === 'matched').length} Conciliados
                                </Badge>
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                    {externalData.filter(d => d.status === 'missing').length} Pendentes no Sistema
                                </Badge>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setViewMode('input')}>
                                Voltar/Colar novamente
                            </Button>
                        </div>

                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Guia</TableHead>
                                        <TableHead>Paciente (Relatório)</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Registro Interno</TableHead>
                                        <TableHead className="text-right">Ação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {externalData.map((patient, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="text-xs font-mono">{patient.guia || '-'}</TableCell>
                                            <TableCell className="font-medium text-xs">{patient.name}</TableCell>
                                            <TableCell className="text-xs">{patient.date}</TableCell>
                                            <TableCell>
                                                {patient.status === 'matched' ? (
                                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none flex w-fit gap-1 items-center">
                                                        <CheckCircle className="h-3 w-3" /> Conciliado
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none flex w-fit gap-1 items-center">
                                                        <AlertCircle className="h-3 w-3" /> Não Encontrado
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {patient.matchedAppointment ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{patient.matchedAppointment.patients?.name}</span>
                                                        <span className="text-gray-500">
                                                            {format(new Date(patient.matchedAppointment.consultation_date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 italic">Sem registro interno</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {patient.status === 'missing' && (
                                                    <Button size="sm" variant="outline" className="h-7 text-[10px]">
                                                        Lançar Agora
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={onClose}>Fechar</Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                Exportar Relatório
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    if (isInline) return content;

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                {content}
            </DialogContent>
        </Dialog>
    );
}
