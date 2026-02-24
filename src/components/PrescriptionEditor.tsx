import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Printer, Pill } from 'lucide-react';
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

export function PrescriptionEditor() {
    const [patientName, setPatientName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [prescriptionContent, setPrescriptionContent] = useState('');
    const [searchResults, setSearchResults] = useState<Medication[]>([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

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
        const newEntry = `
Uso: ${medication.categoria === 'Uso Oral' ? 'Oral' : 'Tópico Ocular'}
- ${medication.nome_comercial} (${medication.principio_ativo})
  ${medication.apresentacao}
  Posologia: ${medication.posologia_padrao}
`;
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
            <div className="w-full md:w-2/3 bg-gray-100 p-4 md:p-8 rounded-lg flex justify-center overflow-auto print:p-0 print:bg-white print:overflow-visible">
                {/* Papel (A4 Aspect Ratio) */}
                <div className="bg-white w-full max-w-[21cm] min-h-[29.7cm] p-10 md:p-16 shadow-lg border border-gray-200 print:shadow-none print:border-none print:p-0 print:max-w-full">
                    {/* Cabeçalho do Documento */}
                    <div className="border-b-2 border-medical-primary pb-6 mb-8 text-center flex flex-col items-center">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-12 w-12 bg-medical-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                                IO
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-cinza-escuro tracking-wide">Instituto dos Olhos Santa Luzia</h1>
                                <p className="text-sm text-gray-500">Oftalmologia Clínica e Cirúrgica</p>
                            </div>
                        </div>
                    </div>

                    {/* Corpo da Receita */}
                    <div className="mb-8 min-h-[400px]">
                        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-end gap-2 text-lg">
                                <span className="font-semibold text-gray-800">Paciente:</span>
                                <span className="border-b border-gray-400 font-medium px-2 min-w-[200px] inline-block">{patientName}</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-center mb-6 uppercase tracking-wider">Receituário Médico</h2>

                            <Textarea
                                value={prescriptionContent}
                                onChange={(e) => setPrescriptionContent(e.target.value)}
                                className="w-full min-h-[300px] text-base p-4 border-gray-200 focus:border-medical-primary focus:ring-medical-primary resize-y print:border-none print:resize-none print:p-0"
                                placeholder="Adicione os medicamentos usando a busca ao lado ou digite livremente aqui..."
                            />
                        </div>
                    </div>

                    {/* Rodapé do Documento */}
                    <div className="mt-auto pt-20 flex flex-col items-center">
                        <div className="w-64 border-t border-gray-800 mb-2"></div>
                        <p className="text-sm font-semibold text-gray-800">Assinatura / Carimbo do Médico</p>
                        <p className="text-xs text-gray-500 mt-6 text-center">
                            Sinop/MT, {currentDate}<br />
                            Avenida Julio Campos, 1234 - Centro
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
