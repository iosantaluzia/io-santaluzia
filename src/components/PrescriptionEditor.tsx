import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Printer, Pill } from 'lucide-react';
import { DocumentTemplate } from './DocumentsSection';
import medicationsData from '@/data/medications.json';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

interface Medication {
    id: string;
    nome_comercial: string;
    principio_ativo: string;
    apresentacao: string;
    posologia_padrao: string;
    categoria: string;
}

interface PrescriptionEditorProps {
    templates?: DocumentTemplate[];
}

export function PrescriptionEditor({ templates = [] }: PrescriptionEditorProps) {
    const [patientName, setPatientName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [prescriptionContent, setPrescriptionContent] = useState('');
    const [searchResults, setSearchResults] = useState<Medication[]>([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const [documentType, setDocumentType] = useState<'receituario' | 'solicitacao_exame' | 'declaracao'>('receituario');
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('none');

    const handleTemplateChange = (val: string) => {
        setSelectedTemplateId(val);
        if (val !== 'none') {
            const t = templates.find(temp => temp.id === val);
            if (t) {
                setDocumentType(t.type);
                let newContent = t.content;
                if (patientName) {
                    newContent = newContent.replace(/{PACIENTE}/g, patientName);
                } else {
                    newContent = newContent.replace(/{PACIENTE}/g, '________________________');
                }
                setPrescriptionContent(newContent);
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.length > 1) {
            const filtered = medicationsData.filter(med =>
                med.nome_comercial.toLowerCase().includes(term.toLowerCase()) ||
                med.principio_ativo.toLowerCase().includes(term.toLowerCase())
            );
            setSearchResults(filtered);
            setShowResults(true);
        } else {
            setSearchResults([]);
            setShowResults(false);
        }
    };

    const addMedicationToPrescription = (medication: Medication) => {
        // Conta quantos medicamentos já tem numerados
        const lines = prescriptionContent.split('\n');
        let count = 0;
        lines.forEach(l => { if (l.match(/^\d+\)/)) count++; });
        const num = count + 1;

        // Tenta ser inteligente sobre a embalagem para formar "1 frasco", "1 unidade", etc.
        let qtd = "1 unidade";
        if (medication.apresentacao.toLowerCase().includes('frasco') || medication.apresentacao.toLowerCase().includes('solução')) qtd = "01 frasco";
        if (medication.apresentacao.toLowerCase().includes('caixa') || medication.categoria === 'Uso Oral') qtd = "01 caixa";

        const baseText = `${num}) ${medication.nome_comercial} (${medication.principio_ativo})`;
        const padding = " ----------------------------------- ";

        const newEntry = `${baseText}${padding}${qtd}\n${medication.posologia_padrao}\n\n`;

        setPrescriptionContent(prev => prev + newEntry);
        setSearchTerm('');
        setShowResults(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

    return (
        <div className="flex flex-col md:flex-row gap-6 h-full print:block print:w-full print:h-auto">
            {/* Lado Esquerdo - Controles (Não aparece na impressão) */}
            <div className="w-full md:w-1/3 flex flex-col gap-6 print:hidden">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-cinza-escuro mb-4 flex items-center gap-2">
                        <Pill className="h-5 w-5 text-medical-primary" />
                        Editor de Receita
                    </h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Tipo de Documento</Label>
                                <Select value={documentType} onValueChange={(val: any) => {
                                    setDocumentType(val);
                                    setSelectedTemplateId('none');
                                }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="receituario">Receituário</SelectItem>
                                        <SelectItem value="solicitacao_exame">Exames</SelectItem>
                                        <SelectItem value="declaracao">Laudo/Declaração</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label>Modelo Pré-pronto</Label>
                                <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um modelo..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Em branco</SelectItem>
                                        {templates.filter(t => t.type === documentType).map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="patientName">Nome do Paciente</Label>
                            <Input
                                id="patientName"
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
                                placeholder="Ex: João Silva"
                            />
                        </div>

                        <div className="relative" ref={searchRef}>
                            <Label htmlFor="medsearch">Buscar Medicamento (ANVISA/RENAME)</Label>
                            <div className="flex items-center bg-gray-50 border rounded-md px-3 py-2 mt-1 focus-within:ring-2 focus-within:ring-medical-primary">
                                <Search className="h-4 w-4 text-gray-400 mr-2" />
                                <input
                                    id="medsearch"
                                    className="bg-transparent border-none outline-none w-full text-sm"
                                    placeholder="Ex: Vigamox, Maxitrol..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    onFocus={() => { if (searchResults.length > 0) setShowResults(true) }}
                                    autoComplete="off"
                                />
                            </div>

                            {showResults && searchResults.length > 0 && (
                                <div className="absolute top-[70px] left-0 right-0 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                                    <ul className="py-1">
                                        {searchResults.map(med => (
                                            <li
                                                key={med.id}
                                                onClick={() => addMedicationToPrescription(med)}
                                                className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm border-b last:border-0"
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-semibold text-gray-900">{med.nome_comercial}</span>
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{med.categoria}</span>
                                                </div>
                                                <div className="text-xs text-gray-600 truncate">{med.principio_ativo}</div>
                                                <div className="text-xs text-gray-500 truncate mt-0.5">{med.posologia_padrao}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <Button onClick={handlePrint} className="w-full bg-medical-primary hover:bg-medical-secondary text-white mt-4">
                            <Printer className="h-4 w-4 mr-2" />
                            Imprimir / Salvar PDF
                        </Button>
                    </div>
                </div>
            </div>

            {/* Lado Direito - Visualização do Documento e Impressão */}
            <div className="w-full md:w-2/3 bg-gray-100 p-4 md:p-8 rounded-lg flex justify-center overflow-auto print:p-0 print:bg-white print:overflow-visible print:block">
                {/* Papel (A4 Aspect Ratio) */}
                <div id="prescription-print-area" className="relative bg-white w-full max-w-[21cm] min-h-[29.7cm] shadow-xl border border-gray-200 print:shadow-none print:border-none print:m-0 print:p-0 print:max-w-full flex flex-col font-sans overflow-hidden">

                    {/* Marca d'água no fundo da página inteira */}
                    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-5">
                        <img src="/uploads/circlebg.png" alt="" className="w-[85%] max-w-lg object-contain" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full flex-grow p-10 md:pt-14 md:pb-8 md:px-14 print:pt-14 print:pb-8 print:px-14">
                        {/* Cabeçalho do Documento */}
                        <div className="flex flex-col items-center mb-10 w-full">
                            <img src="/uploads/logoiosantaluzia-removebg-preview.png" alt="Instituto de Olhos Santa Luzia" className="h-[120px] object-contain mb-3" />
                            <p className="text-[#857053] font-medium text-[13px] text-center tracking-wide leading-tight">
                                • Córnea • Catarata • Ceratocone • Lentes de Contato<br />
                                • Cirurgia Refrativa • Oftalmopediatria
                            </p>
                            <div className="w-full h-[1.5px] bg-[#857053] mt-5"></div>
                        </div>

                        {/* Corpo da Receita */}
                        <div className="flex-grow flex flex-col text-cinza-escuro">
                            <h2 className="text-xl font-bold text-center mb-8 uppercase tracking-widest text-[#161a1d]">
                                {documentType === 'receituario' ? 'Receituário' :
                                    documentType === 'solicitacao_exame' ? 'Solicitação de Exame' :
                                        'Laudo Médico'}
                            </h2>

                            {patientName && (
                                <div className="mb-6 flex items-end gap-2 text-[15px]">
                                    <span className="font-semibold text-gray-800">Paciente:</span>
                                    <span className="font-medium inline-block flex-1">{patientName}</span>
                                </div>
                            )}

                            <Textarea
                                value={prescriptionContent}
                                onChange={(e) => setPrescriptionContent(e.target.value)}
                                className="w-full flex-grow min-h-[400px] text-[15px] p-0 border-none focus-visible:ring-0 resize-none font-sans text-cinza-escuro bg-transparent leading-relaxed print:resize-none print:p-0 outline-none"
                                placeholder="PARA USO EM CLÍNICA MÉDICA&#10;&#10;Adicione os medicamentos usando a busca ao lado ou digite livremente aqui..."
                            />
                        </div>

                        {/* Assinatura, Data e Rodapé */}
                        <div className="mt-8 shrink-0">
                            <div className="flex justify-end pr-8 mb-6">
                                <p className="text-cinza-escuro text-[15px]">{currentDate}</p>
                            </div>

                            {/* Linha Fina Dourada/Marrom do rodapé */}
                            <div className="w-full h-[1.5px] bg-[#857053] mb-4"></div>

                            <div className="flex justify-between w-full text-[12px] text-[#6b583f] font-medium tracking-tight px-1">
                                <div className="flex flex-col leading-snug">
                                    <span className="font-bold text-[#5c4a30]">Avenida dos Tarumãs 930</span>
                                    <span>Setor Residencial Sul • Sinop MT</span>
                                    <span>Cep 78 550-001</span>
                                    <span>(66) 3531-6381 • 99721-5000</span>
                                </div>
                                <div className="flex flex-col text-right leading-snug mt-auto">
                                    <span>@faroque</span>
                                    <span>@matheusroqueoftalmo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
