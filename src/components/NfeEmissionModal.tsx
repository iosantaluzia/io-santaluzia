import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt, FileText, CheckCircle2, User, Building, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useRef, useEffect } from 'react';

interface NfeEmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultPatientName?: string;
    defaultAmount?: number;
}

export function NfeEmissionModal({ isOpen, onClose, defaultPatientName = '', defaultAmount = 0 }: NfeEmissionModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Estados para a busca de pacientes
    const [searchTerm, setSearchTerm] = useState('');
    const [patientResults, setPatientResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        documentType: 'CPF',
        documentNumber: '',
        patientName: defaultPatientName || '',
        serviceCode: '04.03',
        description: 'Consulta Oftalmológica',
        amount: defaultAmount ? defaultAmount.toString() : '',
        patientId: '',
        emissorTipo: 'PJ_MATHEUS',
    });

    // Clicar fora para fechar resultados
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchPatients = async (query: string) => {
        if (!query || query.length < 2) {
            setPatientResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        setShowResults(true);

        try {
            // Busca apenas por nome ou cpf
            const { data, error } = await supabase
                .from('patients')
                .select('id, name, cpf')
                .or(`name.ilike.%${query}%,cpf.ilike.%${query}%`)
                .limit(10);

            if (error) throw error;
            setPatientResults(data || []);
        } catch (error) {
            console.error('Erro ao buscar pacientes:', error);
            toast.error('Não foi possível buscar os pacientes da base de dados.');
        } finally {
            setIsSearching(false);
        }
    };

    const handlePatientSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setFormData(prev => ({ ...prev, patientName: value }));
        searchPatients(value);
    };

    const selectPatient = (patient: any) => {
        setSearchTerm(patient.name);
        setFormData(prev => ({
            ...prev,
            patientName: patient.name,
            documentNumber: patient.cpf || prev.documentNumber,
            documentType: patient.cpf?.length > 14 ? 'CNPJ' : 'CPF',
            patientId: patient.id
        }));
        setShowResults(false);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleEmit = async () => {
        setLoading(true);

        try {
            // Chamada de API real para sua Função de Backend no Supabase
            const { data, error } = await supabase.functions.invoke('emissao-nfe', {
                body: {
                    paciente: formData.patientName,
                    documento: formData.documentNumber,
                    servico: formData.serviceCode,
                    descricao: formData.description,
                    valor: Number(formData.amount),
                    emissor: formData.emissorTipo,
                }
            });

            if (error) throw error;

            // Sucesso e Nota Retornada pelo Back-end!
            setStep(2);
            toast.success(`Nota Fiscal nº ${data.numero} emitida com sucesso!`);
        } catch (error: any) {
            console.error('Erro ao emitir NFe:', error);
            toast.error('Erro na comunicação com a API de NFS-e. Verifique se a função está rodando.');
        } finally {
            setLoading(false);
        }
    };

    const resetAndClose = () => {
        setStep(1);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
            <DialogContent className="sm:max-w-[500px]">
                {step === 1 ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <Receipt className="h-6 w-6 text-bege-principal" />
                                Emitir Nota Fiscal (NFS-e)
                            </DialogTitle>
                            <DialogDescription>
                                Preencha os dados do tomador do serviço para emissão da nota fiscal eletrônica.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 py-4 overflow-visible">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="emissor" className="text-right">
                                    Emissor
                                </Label>
                                <Select value={formData.emissorTipo} onValueChange={(val) => handleInputChange('emissorTipo', val)}>
                                    <SelectTrigger className="col-span-3 font-semibold text-bege-principal bg-bege-principal/5 border-bege-principal/20">
                                        <SelectValue placeholder="Selecione o emissor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PJ_MATHEUS">Matheus Roque Serviços Médicos LTDA (PJ)</SelectItem>
                                        <SelectItem value="PJ_INSTITUTO">Instituto dos Olhos Santa Luzia (PJ)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4 relative" ref={searchRef}>
                                <Label htmlFor="name" className="text-right">
                                    Tomador
                                </Label>
                                <div className="col-span-3 pb-0 relative">
                                    <div className="flex items-center bg-gray-50 border rounded-md px-3 py-2 w-full focus-within:ring-2 focus-within:ring-bege-principal focus-within:border-bege-principal transition-all">
                                        <Search className="h-4 w-4 text-gray-400 mr-2" />
                                        <input
                                            id="name"
                                            value={formData.patientName}
                                            onChange={handlePatientSearchInput}
                                            onFocus={() => { if (patientResults.length > 0) setShowResults(true) }}
                                            className="bg-transparent border-none outline-none w-full text-sm"
                                            placeholder="Buscar Paciente por Nome ou CPF..."
                                            autoComplete="off"
                                        />
                                    </div>

                                    {/* Dropdown de Resultados */}
                                    {showResults && searchTerm.length >= 2 && (
                                        <div className="absolute top-12 left-0 right-0 bg-white border rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                                            {isSearching ? (
                                                <div className="p-3 text-sm text-gray-500 text-center flex items-center justify-center">
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    Buscando...
                                                </div>
                                            ) : patientResults.length > 0 ? (
                                                <ul className="py-1">
                                                    {patientResults.map(patient => (
                                                        <li
                                                            key={patient.id}
                                                            onClick={() => selectPatient(patient)}
                                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                                        >
                                                            <div className="font-medium text-gray-900">{patient.name}</div>
                                                            {patient.cpf && <div className="text-xs text-gray-500">Doc: {patient.cpf}</div>}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="p-3 text-sm text-gray-500 text-center">
                                                    Nenhum paciente encontrado.<br />Pode prosseguir para tomador avulso.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right">Doc.</Label>
                                <div className="col-span-3 flex gap-2">
                                    <Select value={formData.documentType} onValueChange={(val) => handleInputChange('documentType', val)}>
                                        <SelectTrigger className="w-[100px]">
                                            <SelectValue placeholder="Tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CPF">CPF</SelectItem>
                                            <SelectItem value="CNPJ">CNPJ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        className="flex-1"
                                        placeholder={formData.documentType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                                        value={formData.documentNumber}
                                        onChange={(e) => handleInputChange('documentNumber', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="service" className="text-right">
                                    Serviço
                                </Label>
                                <Select value={formData.serviceCode} onValueChange={(val) => handleInputChange('serviceCode', val)}>
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Selecione o serviço" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="04.03">04.03 - Hospitais, clínicas, laboratórios...</SelectItem>
                                        <SelectItem value="04.01">04.01 - Medicina e biomedicina</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="desc" className="text-right">
                                    Descrição
                                </Label>
                                <Input
                                    id="desc"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="col-span-3"
                                    placeholder="Ex: Consulta Oftalmológica do dia..."
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">
                                    Valor (R$)
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => handleInputChange('amount', e.target.value)}
                                    className="col-span-3 max-w-[150px] font-semibold text-lg"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={resetAndClose}>Cancelar</Button>
                            <Button onClick={handleEmit} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                                {loading ? 'Processando...' : 'Emitir e Assinar'}
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <div className="py-8 flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Nota Fiscal Emitida!</h2>
                        <p className="text-gray-600 max-w-sm">
                            Sua NFS-e foi gerada, assinada digitalmente e enviada para a Prefeitura e para o email do paciente com sucesso.
                        </p>

                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-lg w-full text-left mt-4 text-sm max-w-sm mx-auto">
                            <p><span className="font-semibold">Nº da Nota:</span> 2026000142</p>
                            <p><span className="font-semibold">Tomador:</span> {formData.patientName || 'Não informado'}</p>
                            <p><span className="font-semibold">Valor:</span> R$ {Number(formData.amount).toFixed(2).replace('.', ',')}</p>
                            <p><span className="font-semibold">Data e Hora:</span> {new Date().toLocaleString('pt-BR')}</p>
                        </div>

                        <div className="flex gap-3 w-full mt-6 justify-center">
                            <Button variant="outline" className="flex-1" onClick={resetAndClose}>
                                Fechar
                            </Button>
                            <Button className="flex-1 bg-bege-principal hover:bg-bege-principal/90 text-white">
                                <FileText className="mr-2 h-4 w-4" />
                                Ver PDF
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
