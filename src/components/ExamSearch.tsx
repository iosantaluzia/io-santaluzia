import React, { useState } from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';

interface ExamSearchProps {
  exames: Array<{
    nome: string;
    imagem: string;
    descricao: string;
    descricaoDetalhada: string;
  }>;
}

const ExamSearch: React.FC<ExamSearchProps> = ({ exames }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    exam: any;
    suggestions: string[];
  } | null>(null);

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  };

  // Palavras comuns que devem ser ignoradas na busca
  const stopWords = new Set(['de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas', 'a', 'o', 'e', 'ou', 'para', 'com', 'por']);

  // Sinônimos e variações comuns
  const synonyms: { [key: string]: string[] } = {
    'visao': ['visual', 'visão'],
    'visual': ['visao', 'visão'],
    'visão': ['visao', 'visual'],
    'campo': ['perimetria', 'campimetria'],
    'perimetria': ['campo', 'campimetria'],
    'campimetria': ['campo', 'perimetria'],
    'pressao': ['pressão', 'tonometria'],
    'pressão': ['pressao', 'tonometria'],
    'tonometria': ['pressao', 'pressão'],
    'cornea': ['córnea'],
    'córnea': ['cornea'],
    'retina': ['fundo', 'fundoscopia'],
    'fundo': ['retina', 'fundoscopia'],
    'fundoscopia': ['retina', 'fundo'],
    'grau': ['refração', 'refrativo'],
    'refração': ['grau', 'refrativo'],
    'refrativo': ['grau', 'refração']
  };

  // Normaliza e tokeniza o texto, removendo stop words e expandindo sinônimos
  const tokenizeAndNormalize = (text: string): string[] => {
    const normalized = normalizeText(text);
    const tokens = normalized.split(/\s+/).filter(token => token.length > 0);
    
    // Remove stop words
    const filteredTokens = tokens.filter(token => !stopWords.has(token));
    
    // Expande sinônimos
    const expandedTokens = new Set<string>();
    filteredTokens.forEach(token => {
      expandedTokens.add(token);
      if (synonyms[token]) {
        synonyms[token].forEach(syn => expandedTokens.add(normalizeText(syn)));
      }
    });
    
    return Array.from(expandedTokens);
  };

  // Verifica se dois textos têm palavras em comum (independente da ordem)
  const hasCommonTokens = (text1: string, text2: string): boolean => {
    const tokens1 = tokenizeAndNormalize(text1);
    const tokens2 = tokenizeAndNormalize(text2);
    
    // Se não há tokens suficientes, usa busca simples
    if (tokens1.length === 0 || tokens2.length === 0) {
      return normalizeText(text1).includes(normalizeText(text2)) || 
             normalizeText(text2).includes(normalizeText(text1));
    }
    
    // Verifica se há tokens em comum
    const commonTokens = tokens1.filter(token => tokens2.includes(token));
    
    // Considera match se houver pelo menos 50% dos tokens em comum ou se todos os tokens principais estão presentes
    const minCommonTokens = Math.min(tokens1.length, tokens2.length);
    const threshold = Math.max(1, Math.ceil(minCommonTokens * 0.5));
    
    return commonTokens.length >= threshold;
  };

  const searchExam = (term: string) => {
    if (!term.trim()) {
      setSearchResult(null);
      return;
    }

    const normalizedTerm = normalizeText(term);
    const searchTokens = tokenizeAndNormalize(term);
    
    // Busca exata (nome completo igual)
    const exactMatch = exames.find(exame => 
      normalizeText(exame.nome) === normalizedTerm
    );

    if (exactMatch) {
      setSearchResult({
        found: true,
        exam: exactMatch,
        suggestions: []
      });
      return;
    }

    // Se o termo é apenas "visão", "visao" ou "visual" sem outras palavras, pular busca direta nos exames
    // e ir direto para termos relacionados (para evitar encontrar exames que apenas mencionam "visão" na descrição)
    const isOnlyVisionTerm = searchTokens.length === 1 && 
      (searchTokens[0] === 'visao' || searchTokens[0] === 'visual' || searchTokens[0] === 'visão');
    
    // Busca inteligente usando tokens e sinônimos (pular se for termo genérico de visão)
    if (!isOnlyVisionTerm) {
      const smartMatches = exames.filter(exame => {
        const nomeNormalized = normalizeText(exame.nome);
        const descricaoNormalized = normalizeText(exame.descricao);
        const descricaoDetalhadaNormalized = normalizeText(exame.descricaoDetalhada);
        
        // Busca exata no nome
        if (nomeNormalized === normalizedTerm) return true;
        
        // Busca usando tokens comuns (independente da ordem)
        if (hasCommonTokens(term, exame.nome)) return true;
        if (hasCommonTokens(term, exame.descricao)) return true;
        if (hasCommonTokens(term, exame.descricaoDetalhada)) return true;
        
        // Busca parcial tradicional (fallback)
        if (nomeNormalized.includes(normalizedTerm) || normalizedTerm.includes(nomeNormalized)) return true;
        if (descricaoNormalized.includes(normalizedTerm)) return true;
        if (descricaoDetalhadaNormalized.includes(normalizedTerm)) return true;
        
        return false;
      });

      if (smartMatches.length > 0) {
        setSearchResult({
          found: true,
          exam: smartMatches[0],
          suggestions: smartMatches.slice(1).map(exame => exame.nome)
        });
        return;
      }
    }

    // Busca por termos relacionados
    const relatedTerms: { [key: string]: string[] } = {
      // EXAMES DE CONSULTA
      'acuidade visual': ['Exame de Consulta'],
      'acuidade visão': ['Exame de Consulta'],
      'acuidade visao': ['Exame de Consulta'],
      'visão': ['Exame de Consulta'],
      'visao': ['Exame de Consulta'],
      'visual': ['Exame de Consulta'],
      'teste visão': ['Exame de Consulta'],
      'teste visao': ['Exame de Consulta'],
      'teste visual': ['Exame de Consulta'],
      'exame visão': ['Exame de Consulta'],
      'exame visao': ['Exame de Consulta'],
      'exame visual': ['Exame de Consulta'],
      'medir visão': ['Exame de Consulta'],
      'medir visao': ['Exame de Consulta'],
      'medir visual': ['Exame de Consulta'],
      'refração': ['Exame de Consulta', 'Aberrômetro'],
      'grau do olho': ['Exame de Consulta', 'Aberrômetro'],
      'medir grau': ['Exame de Consulta', 'Aberrômetro'],
      'adaptação lentes': ['Exame de Consulta', 'Microscopia Especular'],
      'adaptacao lentes': ['Exame de Consulta', 'Microscopia Especular'],
      'lentes contato': ['Exame de Consulta', 'Microscopia Especular'],
      'lente contato': ['Exame de Consulta', 'Microscopia Especular'],
      'biomicroscopia': ['Exame de Consulta'],
      'lâmpada de fenda': ['Exame de Consulta'],
      'lampada de fenda': ['Exame de Consulta'],
      'fundoscopia': ['Exame de Consulta'],
      'fundo do olho': ['Exame de Consulta'],
      'exame fundo': ['Exame de Consulta'],
      'mapeamento retina': ['Exame de Consulta', 'OCT'],
      'mapeamento de retina': ['Exame de Consulta', 'OCT'],
      'tonometria': ['Exame de Consulta', 'Pentacam'],
      'pressão ocular': ['Exame de Consulta', 'Pentacam'],
      'pressao ocular': ['Exame de Consulta', 'Pentacam'],
      'pressão do olho': ['Exame de Consulta', 'Pentacam'],
      'pressao do olho': ['Exame de Consulta', 'Pentacam'],
      'pressão intraocular': ['Exame de Consulta', 'Pentacam'],
      'pressao intraocular': ['Exame de Consulta', 'Pentacam'],
      'medir pressão': ['Exame de Consulta', 'Pentacam'],
      'medir pressao': ['Exame de Consulta', 'Pentacam'],
      'pressão alta': ['Exame de Consulta', 'Pentacam'],
      'pressao alta': ['Exame de Consulta', 'Pentacam'],
      
      // OCT e Tomografia
      'retina': ['OCT', 'Tomografia de coerência óptica'],
      'tomografia': ['OCT', 'Tomografia de coerência óptica'],
      'oct': ['OCT', 'Tomografia de coerência óptica'],
      'tomografia retina': ['OCT', 'Tomografia de coerência óptica'],
      'exame retina': ['OCT', 'Tomografia de coerência óptica'],
      'avaliação retina': ['OCT', 'Tomografia de coerência óptica'],
      'mácula': ['OCT'],
      'macula': ['OCT'],
      'nervo óptico': ['OCT', 'Campimetria'],
      'nervo optico': ['OCT', 'Campimetria'],
      'fibras nervosas': ['OCT'],
      
      // Córnea e Topografia
      'córnea': ['Topografia Corneana', 'Pentacam', 'Microscopia Especular'],
      'cornea': ['Topografia Corneana', 'Pentacam', 'Microscopia Especular'],
      'topografia': ['Topografia Corneana', 'Pentacam', 'Aberrômetro'],
      'curvatura cornea': ['Topografia Corneana', 'Pentacam'],
      'mapa cornea': ['Topografia Corneana', 'Pentacam'],
      'espessura cornea': ['Pentacam', 'Topografia Corneana'],
      'paquimetria': ['Pentacam', 'Topografia Corneana'],
      'câmara anterior': ['Pentacam'],
      'camara anterior': ['Pentacam'],
      'densidade cristalino': ['Pentacam'],
      'densidade do cristalino': ['Pentacam'],
      
      // Glaucoma e Campo Visual
      'glaucoma': ['Campimetria', 'OCT'],
      'campo visual': ['Campimetria'],
      'campo de visão': ['Campimetria'],
      'campo de visao': ['Campimetria'],
      'campo visão': ['Campimetria'],
      'campo visao': ['Campimetria'],
      'visual campo': ['Campimetria'],
      'visão campo': ['Campimetria'],
      'visao campo': ['Campimetria'],
      'exame campo visual': ['Campimetria'],
      'exame campo visão': ['Campimetria'],
      'teste campo visual': ['Campimetria'],
      'teste campo visão': ['Campimetria'],
      'campimetria': ['Campimetria'],
      'perimetria': ['Campimetria'],
      'perda campo visual': ['Campimetria'],
      'perda campo': ['Campimetria'],
      'perda visão': ['Campimetria'],
      'perda visao': ['Campimetria'],
      
      // Catarata
      'catarata': ['Pentacam', 'YAG Laser'],
      'cristalino': ['Pentacam', 'YAG Laser'],
      'lente cristalino': ['Pentacam', 'YAG Laser'],
      'opacidade capsular': ['YAG Laser'],
      'catarata secundaria': ['YAG Laser'],
      'catarata secundária': ['YAG Laser'],
      
      // Refração e Aberrações
      'refrativa': ['Aberrômetro', 'Cirurgia Refrativa'],
      'aberrações': ['Aberrômetro'],
      'aberracoes': ['Aberrômetro'],
      'wavefront': ['Aberrômetro'],
      'qualidade visual': ['Aberrômetro'],
      'visão noturna': ['Aberrômetro'],
      'visao noturna': ['Aberrômetro'],
      'halos': ['Aberrômetro'],
      'glare': ['Aberrômetro'],
      
      // Laser
      'laser': ['YAG Laser'],
      'yag': ['YAG Laser'],
      'laser yag': ['YAG Laser'],
      'iridotomia': ['YAG Laser'],
      
      // Microscopia Especular
      'endotelio': ['Microscopia Especular'],
      'endotélio': ['Microscopia Especular'],
      'celulas endotelio': ['Microscopia Especular'],
      'células endotélio': ['Microscopia Especular'],
      'densidade celular': ['Microscopia Especular'],
      'contagem celular': ['Microscopia Especular'],
      
      // Ceratocone
      'ceratocone': ['Topografia Corneana', 'Pentacam', 'Cirurgia Especializada'],
      'ceratocono': ['Topografia Corneana', 'Pentacam', 'Cirurgia Especializada'],
      'ectasia': ['Topografia Corneana', 'Pentacam'],
      'astigmatismo irregular': ['Topografia Corneana', 'Pentacam'],
      
      // CIRURGIAS
      'anel intraestromal': ['Cirurgia Especializada'],
      'anel corneano': ['Cirurgia Especializada'],
      'anel de ferrara': ['Cirurgia Especializada'],
      'crosslinking': ['Cirurgia Especializada'],
      'cross linking': ['Cirurgia Especializada'],
      'lesões oculares': ['Cirurgia Especializada'],
      'lesoes oculares': ['Cirurgia Especializada'],
      'tratamento lesões': ['Cirurgia Especializada'],
      'tratamento lesoes': ['Cirurgia Especializada'],
      'cirurgia catarata': ['Pentacam', 'YAG Laser'],
      'cirurgia refrativa': ['Aberrômetro', 'Topografia Corneana', 'Pentacam'],
      'cirurgia laser': ['YAG Laser', 'Aberrômetro'],
      'cirurgia miopia': ['Cirurgia Refrativa'],
      'cirurgia hipermetropia': ['Cirurgia Refrativa'],
      'cirurgia astigmatismo': ['Cirurgia Refrativa'],
      'cirurgia presbiopia': ['Cirurgia Refrativa'],
      'pós operatório': ['Pentacam', 'Microscopia Especular', 'OCT'],
      'pos operatorio': ['Pentacam', 'Microscopia Especular', 'OCT'],
      
      // Sintomas comuns
      'visão embaçada': ['OCT', 'Topografia Corneana', 'Pentacam', 'Exame de Consulta'],
      'visao embacada': ['OCT', 'Topografia Corneana', 'Pentacam', 'Exame de Consulta'],
      'visão distorcida': ['Topografia Corneana', 'Pentacam'],
      'visao distorcida': ['Topografia Corneana', 'Pentacam'],
      'manchas visão': ['OCT', 'Exame de Consulta'],
      'manchas visao': ['OCT', 'Exame de Consulta'],
      'vista cansada': ['Exame de Consulta', 'Aberrômetro'],
      'dificuldade enxergar': ['Exame de Consulta', 'Aberrômetro'],
      
      // Equipamentos e tecnologias
      'equipamento moderno': ['OCT', 'Pentacam', 'Aberrômetro'],
      'tecnologia avançada': ['OCT', 'Pentacam', 'Aberrômetro'],
      'exame digital': ['OCT', 'Pentacam', 'Topografia Corneana'],
      'diagnóstico preciso': ['OCT', 'Pentacam', 'Topografia Corneana', 'Campimetria'],
      'diagnostico preciso': ['OCT', 'Pentacam', 'Topografia Corneana', 'Campimetria'],
      'exame completo': ['Exame de Consulta', 'OCT', 'Pentacam', 'Aberrômetro']
    };

    const suggestions: string[] = [];
    const foundExams: string[] = [];
    
    // Busca inteligente nos termos relacionados
    Object.entries(relatedTerms).forEach(([key, values]) => {
      const keyNormalized = normalizeText(key);
      
      // Busca exata
      if (keyNormalized === normalizedTerm) {
        suggestions.push(...values);
        foundExams.push(...values);
        return;
      }
      
      // Busca usando tokens comuns (independente da ordem)
      if (hasCommonTokens(term, key)) {
        suggestions.push(...values);
        foundExams.push(...values);
        return;
      }
      
      // Busca parcial
      if (keyNormalized.includes(normalizedTerm) || normalizedTerm.includes(keyNormalized)) {
        suggestions.push(...values);
        foundExams.push(...values);
        return;
      }
      
      // Para termos genéricos de visão, verificar se o termo pesquisado está contido no key
      if (isOnlyVisionTerm && (keyNormalized.includes('visao') || keyNormalized.includes('visual') || keyNormalized.includes('visão'))) {
        suggestions.push(...values);
        foundExams.push(...values);
        return;
      }
    });

    // Se encontrou exames relacionados, mostrar como encontrado
    if (foundExams.length > 0) {
      const uniqueExams = [...new Set(foundExams)];
      
      // Mapear exames para explicações técnicas e traduzir "Exame de Consulta"
      const examExplanations: { [key: string]: string } = {
        'Pentacam': 'Equipamento que realiza análise completa do segmento anterior do olho',
        'OCT': 'Tomografia de Coerência Óptica - exame de alta precisão',
        'Topografia Corneana': 'Mapeamento detalhado da curvatura da córnea',
        'Aberrômetro': 'Medição de aberrações ópticas do olho',
        'Campimetria': 'Exame do campo visual periférico',
        'Microscopia Especular': 'Avaliação das células do endotélio corneano',
        'YAG Laser': 'Procedimento a laser para tratamento de glaucoma e catarata',
        'Cirurgia Especializada': 'Procedimento cirúrgico especializado',
        'Cirurgia Refrativa': 'Cirurgia para correção de graus (miopia, hipermetropia, astigmatismo)'
      };

      // Traduzir "Exame de Consulta" para o termo técnico específico usando busca inteligente
      const translateConsultationExam = (term: string): string => {
        const termTokens = tokenizeAndNormalize(term);
        const termTokensLower = termTokens.map(t => t.toLowerCase());
        
        if (termTokensLower.some(t => t.includes('pressao') || t.includes('pressão') || t.includes('tonometria'))) {
          return 'Tonometria - Exame realizado durante a consulta';
        } else if (termTokensLower.some(t => t.includes('grau') || t.includes('refração') || t.includes('refracao'))) {
          return 'Refração - Exame realizado durante a consulta';
        } else if (termTokensLower.some(t => t.includes('campo') || t.includes('visual') || t.includes('visao') || t.includes('visão') || t.includes('campimetria') || t.includes('perimetria'))) {
          return 'Campimetria - Exame realizado durante a consulta';
        } else if (termTokensLower.some(t => t.includes('retina') || t.includes('fundo') || t.includes('fundoscopia'))) {
          return 'Fundoscopia - Exame realizado durante a consulta';
        } else if (termTokensLower.some(t => t.includes('córnea') || t.includes('cornea') || t.includes('topografia'))) {
          return 'Biomicroscopia - Exame realizado durante a consulta';
        } else if (termTokensLower.some(t => t.includes('lente') || t.includes('contato'))) {
          return 'Adaptação de Lentes - Exame realizado durante a consulta';
        } else if (termTokensLower.some(t => t.includes('acuidade') || t.includes('visão') || t.includes('visao') || t.includes('visual'))) {
          return 'Acuidade Visual - Exame realizado durante a consulta';
        }
        return 'Exame de Consulta - Exame realizado durante a consulta oftalmológica';
      };

      // Identificar o termo técnico principal usando busca inteligente
      let technicalTerm = '';
      const searchTokensLower = searchTokens.map(t => t.toLowerCase());
      
      if (searchTokensLower.some(t => t.includes('pressao') || t.includes('pressão') || t.includes('tonometria'))) {
        technicalTerm = 'Tonometria';
      } else if (searchTokensLower.some(t => t.includes('grau') || t.includes('refração') || t.includes('refracao'))) {
        technicalTerm = 'Refração';
      } else if (searchTokensLower.some(t => t.includes('campo') || t.includes('visual') || t.includes('visao') || t.includes('visão') || t.includes('campimetria') || t.includes('perimetria'))) {
        technicalTerm = 'Campimetria';
      } else if (searchTokensLower.some(t => t.includes('retina') || t.includes('fundo') || t.includes('fundoscopia'))) {
        technicalTerm = 'Fundoscopia';
      } else if (searchTokensLower.some(t => t.includes('córnea') || t.includes('cornea') || t.includes('topografia'))) {
        technicalTerm = 'Topografia Corneana';
      }

      const explanations = uniqueExams.map(exam => {
        if (exam === 'Exame de Consulta') {
          return translateConsultationExam(searchTerm);
        }
        return `${exam} - ${examExplanations[exam] || 'Exame oftalmológico especializado'}`;
      }).join('\n• ');

      setSearchResult({
        found: true,
        exam: {
          nome: searchTerm, // Manter o termo que o usuário digitou
          descricao: technicalTerm ? 
            `Encontramos exames relacionados ao que você procura` : 
            `Exames relacionados encontrados: ${uniqueExams.join(', ')}`,
          descricaoDetalhada: technicalTerm ? 
            `Para "${searchTerm}", realizamos os seguintes exames:\n\n• ${explanations}\n\nTodos estes exames estão disponíveis em nossa clínica.` :
            `Encontramos os seguintes exames relacionados à sua pesquisa:\n\n• ${explanations}\n\nTodos estes exames estão disponíveis em nossa clínica.`
        },
        suggestions: uniqueExams.slice(1)
      });
    } else {
      setSearchResult({
        found: false,
        exam: null,
        suggestions: [...new Set(suggestions)]
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchExam(searchTerm);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    searchExam(suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="bg-white rounded-lg shadow-soft p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-sans text-medical-primary mb-2">
            Pesquisar Exame
          </h2>
          <p className="text-medical-secondary">
            Digite o nome do exame que seu médico solicitou para verificar se realizamos em nossa clínica
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ex: campo visual, OCT, topografia, microscopia, glaucoma, catarata, retina..."
                className="w-full px-4 py-3 border border-medical-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-primary focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-medical-primary text-white px-6 py-3 rounded-lg hover:bg-medical-secondary transition-colors flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              Pesquisar
            </button>
          </div>
        </form>

        {searchResult && (
          <div className="mt-6">
            {searchResult.found ? (
              <div className="bg-medical-primary/5 border border-medical-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="h-6 w-6 text-medical-primary" />
                  <h3 className="text-lg font-semibold text-medical-primary">
                    Exame Disponível!
                  </h3>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-medical-primary mb-2">
                    {searchResult.exam.nome}
                  </h4>
                  <p className="text-medical-secondary text-sm mb-3">
                    {searchResult.exam.descricao}
                  </p>
                  <div className="text-medical-secondary text-sm mb-3 whitespace-pre-line">
                    {searchResult.exam.descricaoDetalhada}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-medical-primary">
                    <CheckCircle className="h-4 w-4" />
                    <span>Estes exames estão disponíveis em nossa clínica</span>
                  </div>
                </div>
                
                {searchResult.suggestions.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-medical-primary mb-2">Outros exames relacionados:</p>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1 bg-medical-primary/10 text-medical-primary rounded-full text-sm hover:bg-medical-primary/20 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-800">
                    Exame não encontrado
                  </h3>
                </div>
                <p className="text-red-700 mb-4">
                  Não encontramos este exame em nossa lista. Verifique a grafia ou entre em contato conosco.
                </p>
                
                {searchResult.suggestions.length > 0 && (
                  <div>
                    <p className="text-sm text-red-700 mb-2">Você pode estar procurando por:</p>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-medical-secondary">
            Não encontrou o exame? Entre em contato conosco pelo WhatsApp para mais informações.
          </p>
          <button
            onClick={() => window.open('https://wa.me/5566997215000?text=Olá! Gostaria de saber se vocês realizam um exame específico.', '_blank')}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            Entrar em Contato
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamSearch;
