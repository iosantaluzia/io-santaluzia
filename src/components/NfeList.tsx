import React, { useState } from 'react';
import { FileText, Search, Download, Eye, Ban, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Dados mokados para visualização inicial
const MOCK_NFES = [
    {
        id: 'nfe-001',
        numero: '2026000142',
        paciente: 'João Silva',
        documento: '123.456.789-00',
        valor: 350.00,
        data: '24/02/2026 14:30',
        status: 'autorizada',
        servico: 'Consulta Oftalmológica'
    },
    {
        id: 'nfe-002',
        numero: '2026000141',
        paciente: 'Maria Oliveira',
        documento: '987.654.321-11',
        valor: 200.00,
        data: '23/02/2026 09:15',
        status: 'autorizada',
        servico: 'Exame de Rotina'
    },
    {
        id: 'nfe-003',
        numero: '2026000140',
        paciente: 'Empresa Teste LTDA',
        documento: '00.000.000/0001-00',
        valor: 1500.00,
        data: '22/02/2026 16:45',
        status: 'cancelada',
        servico: 'Consultoria'
    },
    {
        id: 'nfe-004',
        numero: '2026000139',
        paciente: 'Carlos Santos',
        documento: '111.222.333-44',
        valor: 450.00,
        data: '22/02/2026 10:20',
        status: 'processando',
        servico: 'Procedimento Cirúrgico Menor'
    }
];

export function NfeList() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNfes = MOCK_NFES.filter(nfe =>
        nfe.paciente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nfe.numero.includes(searchTerm) ||
        nfe.documento.includes(searchTerm)
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'autorizada':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Autorizada</Badge>;
            case 'cancelada':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelada</Badge>;
            case 'processando':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Processando</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-xl font-semibold text-cinza-escuro">Notas Fiscais Emitidas</h3>
                    <p className="text-sm text-gray-500">Histórico de NFS-e geradas pelo sistema</p>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por paciente, CPF/CNPJ ou número..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[100px]">Número</TableHead>
                            <TableHead>Paciente/Tomador</TableHead>
                            <TableHead>Data Emissão</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredNfes.length > 0 ? (
                            filteredNfes.map((nfe) => (
                                <TableRow key={nfe.id}>
                                    <TableCell className="font-medium">{nfe.numero}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-gray-900">{nfe.paciente}</p>
                                            <p className="text-xs text-gray-500">{nfe.documento}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{nfe.data}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(nfe.valor)}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(nfe.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" title="Visualizar NFS-e" disabled={nfe.status !== 'autorizada'}>
                                                <Eye className="h-4 w-4 text-gray-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" title="Baixar PDF" disabled={nfe.status !== 'autorizada'}>
                                                <Download className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" title="Cancelar Nota" disabled={nfe.status !== 'autorizada'}>
                                                <Ban className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <AlertCircle className="h-8 w-8 mb-2 text-gray-400" />
                                        <p>Nenhuma nota fiscal encontrada com este termo.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <p>Mostrando {filteredNfes.length} notas fiscais</p>
                <div className="flex items-center gap-2">
                    <p className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                        Integração VidaaS Online Puxando Dados
                    </p>
                </div>
            </div>
        </div>
    );
}
