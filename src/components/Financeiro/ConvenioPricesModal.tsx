import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Save, Plus, Trash2, DollarSign, ArrowLeft } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ProcedurePrice {
    id: string;
    name: string;
    code: string;
    prices: Record<string, number>;
}

interface ConvenioPricesModalProps {
    onClose: () => void;
    isInline?: boolean;
}

const initialProcedures: ProcedurePrice[] = [
    { id: '1', name: 'Consulta Oftalmológica', code: '10101012', prices: { 'Local': 222.60, 'Nacional': 130.00, 'Estadual': 130.00, 'Seguros': 130.00 } },
    { id: '2', name: 'Microscopia Especular de Córnea', code: '41301269', prices: { 'Local': 512.62, 'Nacional': 91.42, 'Estadual': 91.42, 'Seguros': 91.42 } },
    { id: '3', name: 'Capsulotomia YAG Laser', code: '30306019', prices: { 'Local': 630.70, 'Nacional': 630.70, 'Estadual': 630.70, 'Seguros': 630.70 } },
    { id: '4', name: 'Ceratoscopia / Topografia Computadorizada', code: '41301080', prices: { 'Local': 183.08, 'Nacional': 45.64, 'Estadual': 45.64, 'Seguros': 45.64 } },
    { id: '5', name: 'Pentacam (Tomografia de Segmento Anterior)', code: '41301423', prices: { 'Local': 360, 'Nacional': 390, 'Estadual': 390, 'Seguros': 390 } },
    { id: '6', name: 'OCT - Tomografia Coerência Óptica', code: '41501144', prices: { 'Local': 230, 'Nacional': 250, 'Estadual': 250, 'Seguros': 250 } },
    { id: '7', name: 'Campimetria Computadorizada', code: '40103137', prices: { 'Local': 175.76, 'Nacional': 40.86, 'Estadual': 40.86, 'Seguros': 40.86 } },
    { id: '8', name: 'Cirurgia de Catarata (Faco + LIO)', code: '30306027', prices: { 'Local': 1500, 'Nacional': 1500, 'Estadual': 1500, 'Seguros': 1500 } },
    { id: '9', name: 'Fixação Iriana de Lente', code: '30306051', prices: { 'Local': 1600, 'Nacional': 875, 'Estadual': 875, 'Seguros': 875 } },
    { id: '10', name: 'Teste Provocativo para Glaucoma', code: '41401301', prices: { 'Nacional': 27.24, 'Seguros': 27.24, 'Estadual': 27.24 } },
    { id: '11', name: 'Paquimetria Ultrassônica', code: '41501128', prices: { 'Local': 219.70, 'Nacional': 51.07, 'Estadual': 51.07, 'Seguros': 51.07 } },
    { id: '12', name: 'Avaliação Vias Lacrimais (Schirmer)', code: '41301170', prices: { 'Local': 121.56, 'Nacional': 28.27, 'Estadual': 28.27, 'Seguros': 28.27 } },
    { id: '13', name: 'Tumor de Órbita - Exerese', code: '30302137', prices: { 'Nacional': 1625.00, 'Estadual': 1625.00, 'Seguros': 1625.00 } },
    { id: '14', name: 'Vitrectomia Posterior (Pars Plana)', code: '30307120', prices: { 'Nacional': 1312.50, 'Estadual': 1312.50, 'Seguros': 1312.50 } },
    { id: '15', name: 'Tonometria Ocular - Binocular', code: '41301323', prices: { 'Local': 18.31, 'Estadual': 8.51, 'Nacional': 8.51, 'Seguros': 8.51 } },
    { id: '16', name: 'Mapeamento de Retina - Monocular', code: '41301250', prices: { 'Local': 54.48, 'Estadual': 27.24, 'Nacional': 27.24, 'Seguros': 27.24 } },
    { id: '17', name: 'Gonioscopia - Binocular', code: '41301242', prices: { 'Local': 58.58, 'Estadual': 58.58, 'Nacional': 58.58, 'Seguros': 58.58 } },
    { id: '18', name: 'PRK - Fotoablação de Superfície', code: '30304091', prices: { 'Nacional': 1256.25, 'Estadual': 1256.25, 'Seguros': 1256.25 } },
    { id: '19', name: 'Adaptação e Treinamento Visão Subnormal', code: '20103018', prices: { 'Local': 22.47, 'Nacional': 22.47, 'Estadual': 22.47, 'Seguros': 22.47 } },
    { id: '20', name: 'Teste Sensibilidade Contraste/Cores', code: '41401271', prices: { 'Local': 98.12, 'Estadual': 98.12, 'Nacional': 98.12, 'Seguros': 98.12 } },
    { id: '21', name: 'Biomicroscopia de Fundo', code: '41301420', prices: { 'Estadual': 10.21, 'Nacional': 10.21, 'Seguros': 10.21 } },
    { id: '22', name: 'Exame de Motilidade Ocular', code: '41301200', prices: { 'Estadual': 13.61, 'Nacional': 13.61, 'Seguros': 13.61 } },
    { id: '23', name: 'Fundoscopia sob Medríases - Binocular', code: '41301439', prices: { 'Estadual': 0, 'Nacional': 0, 'Seguros': 0 } },
    { id: '24', name: 'Potencial de Acuidade Visual - Monocular', code: '41301307', prices: { 'Estadual': 0, 'Nacional': 0, 'Seguros': 0 } },
    { id: '25', name: 'Oftalmodinamometria - Monocular', code: '41301277', prices: { 'Estadual': 0, 'Nacional': 0, 'Seguros': 0 } },
];

const planTypes = ['Estadual', 'Nacional', 'Seguros', 'Local', 'Outros'];

export function ConvenioPricesModal({ onClose, isInline = false }: ConvenioPricesModalProps) {
    const [procedures, setProcedures] = useState<ProcedurePrice[]>(initialProcedures);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProcedures = procedures.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.includes(searchTerm)
    );

    const handlePriceChange = (id: string, plan: string, value: string) => {
        const numericValue = parseFloat(value.replace(',', '.')) || 0;
        setProcedures(prev => prev.map(p =>
            p.id === id ? { ...p, prices: { ...p.prices, [plan]: numericValue } } : p
        ));
    };

    const handleSave = () => {
        toast.success('Tabela de preços atualizada!');
        onClose();
    };

    const content = (
        <div className={cn("flex flex-col h-full bg-white rounded-lg", !isInline && "max-h-[90vh]")}>
            <div className="flex justify-between items-center p-6 border-b">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <DollarSign className="h-6 w-6 text-green-600" />
                        Tabela de Preços Convênios
                    </h2>
                    <p className="text-sm text-gray-500">
                        Defina os valores pagos pela Unimed para cada procedimento e tipo de plano.
                    </p>
                </div>
                <Button variant="ghost" onClick={onClose} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Buscar procedimento..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[300px]">Procedimento</TableHead>
                                <TableHead>Código</TableHead>
                                {planTypes.map(plan => (
                                    <TableHead key={plan} className="text-right">{plan}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProcedures.map((proc) => (
                                <TableRow key={proc.id}>
                                    <TableCell className="font-medium">{proc.name}</TableCell>
                                    <TableCell className="text-gray-500 font-mono text-xs">{proc.code}</TableCell>
                                    {planTypes.map(plan => (
                                        <TableCell key={plan} className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="text-xs text-gray-400">R$</span>
                                                <Input
                                                    type="text"
                                                    value={proc.prices[plan] || ''}
                                                    onChange={(e) => handlePriceChange(proc.id, plan, e.target.value)}
                                                    className="w-20 h-8 text-right text-xs"
                                                />
                                            </div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSave} className="bg-medical-primary text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Alterações
                    </Button>
                </div>
            </div>
        </div>
    );

    if (isInline) return content;

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-5xl max-h-[90vh] p-0">
                {content}
            </DialogContent>
        </Dialog>
    );
}
