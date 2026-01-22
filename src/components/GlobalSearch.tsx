import React, { useState, useEffect, useRef } from 'react';
import { Search, User, TestTube, Package, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  type: 'patient' | 'exam' | 'stock';
  id: string;
  title: string;
  subtitle?: string;
  data: any;
}

interface GlobalSearchProps {
  onResultClick?: (result: SearchResult) => void;
  onSectionChange?: (section: string) => void;
}

export function GlobalSearch({ onResultClick, onSectionChange }: GlobalSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar resultados
  useEffect(() => {
    const search = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      setShowDropdown(true);

      const searchLower = searchTerm.toLowerCase().trim();
      const allResults: SearchResult[] = [];

      try {
        // Buscar Pacientes
        const { data: patients, error: patientsError } = await supabase
          .from('patients')
          .select('id, name, cpf, phone')
          .or(`name.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
          .limit(5);

        if (!patientsError && patients) {
          patients.forEach(patient => {
            allResults.push({
              type: 'patient',
              id: patient.id,
              title: patient.name,
              subtitle: patient.cpf || patient.phone || '',
              data: patient
            });
          });
        }

        // Buscar Exames
        const { data: exams, error: examsError } = await supabase
          .from('patient_exams')
          .select(`
            id,
            exam_type,
            exam_date,
            description,
            patient_id,
            patients!inner(id, name)
          `)
          .or(`exam_type.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .limit(5);

        if (!examsError && exams) {
          exams.forEach((exam: any) => {
            const examTypeLabels: { [key: string]: string } = {
              'pentacam': 'Pentacam',
              'campimetria': 'Campimetria',
              'topografia': 'Topografia de Córnea',
              'microscopia_especular': 'Microscopia Especular',
              'oct': 'OCT',
              'retinografia': 'Retinografia',
              'angiofluoresceinografia': 'Angiofluoresceinografia',
              'ultrassom_ocular': 'Ultrassom Ocular'
            };

            allResults.push({
              type: 'exam',
              id: exam.id,
              title: examTypeLabels[exam.exam_type] || exam.exam_type,
              subtitle: exam.patients?.name || `Data: ${new Date(exam.exam_date).toLocaleDateString('pt-BR')}`,
              data: exam
            });
          });
        }

        // Buscar Estoque (dados mockados - você pode substituir por uma tabela real depois)
        const stockData = [
          { id: 1, item: 'Colírio Hipromelose', quantity: 5, minStock: 10, status: 'Baixo', category: 'Medicamentos' },
          { id: 2, item: 'Lentes de Contato (-2.00)', quantity: 15, minStock: 20, status: 'Baixo', category: 'Lentes' },
          { id: 3, item: 'Papel para Impressão', quantity: 50, minStock: 25, status: 'Normal', category: 'Material Escritório' },
          { id: 4, item: 'Algodão Oftálmico', quantity: 2, minStock: 15, status: 'Crítico', category: 'Material Médico' },
        ];

        stockData.forEach(item => {
          if (item.item.toLowerCase().includes(searchLower) || 
              item.category.toLowerCase().includes(searchLower)) {
            allResults.push({
              type: 'stock',
              id: item.id.toString(),
              title: item.item,
              subtitle: `${item.category} • Quantidade: ${item.quantity}`,
              data: item
            });
          }
        });

        setResults(allResults);
      } catch (error) {
        console.error('Erro na busca:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 300); // Debounce de 300ms
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    }

    // Navegação padrão baseada no tipo
    if (onSectionChange) {
      switch (result.type) {
        case 'patient':
          onSectionChange('pacientes');
          break;
        case 'exam':
          onSectionChange('exames');
          break;
        case 'stock':
          onSectionChange('estoque');
          break;
      }
    }

    setShowDropdown(false);
    setSearchTerm('');
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'patient':
        return <User className="h-4 w-4" />;
      case 'exam':
        return <TestTube className="h-4 w-4" />;
      case 'stock':
        return <Package className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'patient':
        return 'Pacientes';
      case 'exam':
        return 'Exames';
      case 'stock':
        return 'Estoque';
      default:
        return '';
    }
  };

  // Agrupar resultados por categoria
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const categories = ['patient', 'exam', 'stock'] as const;

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          ref={inputRef}
          type="search"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (results.length > 0 || searchTerm) {
              setShowDropdown(true);
            }
          }}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-marrom-acentuado focus:border-marrom-acentuado outline-none w-full"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setResults([]);
              setShowDropdown(false);
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showDropdown && (searchTerm || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 text-sm">Buscando...</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              Nenhum resultado encontrado para "{searchTerm}"
            </div>
          ) : (
            <div className="py-2">
              {categories.map(category => {
                const categoryResults = groupedResults[category];
                if (!categoryResults || categoryResults.length === 0) return null;

                return (
                  <div key={category} className="mb-2">
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase">
                      {getCategoryIcon(category)}
                      {getCategoryLabel(category)}
                      <span className="ml-auto text-gray-500">({categoryResults.length})</span>
                    </div>
                    {categoryResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 active:bg-gray-100 flex items-start gap-3 transition-colors cursor-pointer focus:outline-none focus:bg-gray-50"
                      >
                        <div className="mt-0.5 text-gray-400 flex-shrink-0">
                          {getCategoryIcon(result.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {result.title}
                          </div>
                          {result.subtitle && (
                            <div className="text-xs text-gray-500 truncate mt-0.5">
                              {result.subtitle}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

