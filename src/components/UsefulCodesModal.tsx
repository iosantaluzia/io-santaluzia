import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ExamCode {
  exam: string;
  code: string;
  notes?: string;
}

interface UsefulCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const examCodes: ExamCode[] = [
  { exam: 'Herpes IGG', code: '40307085' },
  { exam: 'Herpes IGM', code: '40307093' },
  { exam: 'Toxo IGG', code: '40307824' },
  { exam: 'Toxo IGM', code: '40307832' },
  { exam: 'Clamídia / Chlamydias', code: '403142, 43' },
  { exam: 'Anti HIV', code: '40307182' },
  { exam: 'TC crânio', code: '41001010', notes: 'ou TC orbitas' },
  { exam: 'Urina comum', code: '40311210' },
  { exam: 'VDRL', code: '40307760' },
  { exam: 'T4 livre', code: '40316491' },
  { exam: 'Anti TPO', code: '40316157' },
  { exam: 'Sessão Psicoterapia', code: '50000470' },
  { exam: 'Sessão nutricional', code: '50000360' },
  { exam: 'Raio X PA + P', code: '40805026' },
  { exam: 'Ultrasson Quadril', code: '40401360' },
  { exam: 'Vitamina K', code: '40302849', notes: '(exame não tem cobertura)' },
  { exam: 'OCT - Tomografia coerência óptica', code: '41501144' },
  { exam: 'Hemograma', code: '40304361' },
  { exam: 'Coagulograma', code: '40304922' },
  { exam: 'Albuminúria jejum', code: '40302040' },
  { exam: 'Eletro ECG', code: '40101010' },
  { exam: 'RX tórax', code: '40805026' },
  { exam: 'HB / Hemoglobina Glicosada', code: '40302733' },
  { exam: 'FAN', code: '40306852' },
  { exam: 'VHS ou VSG', code: '40304370' },
  { exam: 'Fator Reumatoide', code: '40306860' },
  { exam: 'TSH', code: '40316521' },
  { exam: 'Vitamina D', code: '40302830' },
  { exam: 'Anatomopatológico / Biópsia Prélvio', code: '40601110' },
  { exam: 'Anti RO / SSA', code: '40306119' },
  { exam: 'Anti LA / SSB', code: '40306089' },
  { exam: 'Anti TGP', code: '40302512' },
  { exam: 'TGO', code: '40302504' },
];

export function UsefulCodesModal({ isOpen, onClose }: UsefulCodesModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredCodes = examCodes.filter(
    (item) =>
      item.exam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.includes(searchTerm) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Código copiado!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-medical-primary">
            Códigos Úteis para Solicitações de Exame
          </DialogTitle>
          <DialogDescription>
            Códigos de exames para facilitar as solicitações. Clique no código para copiar.
          </DialogDescription>
        </DialogHeader>

        {/* Barra de busca */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar por exame, código ou observação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Grid de códigos em duas colunas */}
        <div className="flex-1 overflow-auto">
          {filteredCodes.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              Nenhum código encontrado para "{searchTerm}"
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredCodes.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        {item.exam}
                      </h4>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mb-2">
                          {item.notes}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleCopyCode(item.code)}
                      className="flex items-center gap-2 text-medical-primary hover:text-medical-primary/80 font-mono font-semibold transition-colors group whitespace-nowrap flex-shrink-0"
                    >
                      {copiedCode === item.code ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 text-sm">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="text-sm">{item.code}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rodapé com informações */}
        <div className="mt-4 pt-4 border-t text-xs text-gray-500 text-center">
          <p>Total de códigos: {filteredCodes.length} de {examCodes.length}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

