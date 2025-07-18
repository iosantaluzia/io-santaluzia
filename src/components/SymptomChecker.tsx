
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SymptomChecker = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [showScheduleButton, setShowScheduleButton] = useState(false);

  // Simulação de análise de sintomas (já que não temos API key)
  const analyzeSymptoms = (symptoms: string) => {
    const symptomsLower = symptoms.toLowerCase();
    
    if (symptomsLower.includes('embaçada') || symptomsLower.includes('turva')) {
      return "Visão embaçada pode estar relacionada a problemas refrativos (miopia, hipermetropia, astigmatismo) ou catarata. Em pessoas acima de 60 anos, a catarata é mais comum. Recomenda-se avaliação oftalmológica para diagnóstico preciso.";
    }
    
    if (symptomsLower.includes('seco') || symptomsLower.includes('coceira')) {
      return "Olho seco e coceira podem indicar síndrome do olho seco ou alergia ocular. Fatores como uso prolongado de telas, ar condicionado e idade podem contribuir. Tratamento adequado melhora significativamente os sintomas.";
    }
    
    if (symptomsLower.includes('dor') || symptomsLower.includes('pressão')) {
      return "Dor ou pressão ocular podem estar relacionadas ao glaucoma, especialmente em pessoas acima de 40 anos. Também pode indicar problemas na córnea ou inflamações. Avaliação urgente é recomendada.";
    }
    
    if (symptomsLower.includes('luz') || symptomsLower.includes('sensibilidade')) {
      return "Sensibilidade à luz pode estar relacionada a problemas na córnea, uveíte ou enxaqueca ocular. Em alguns casos, pode indicar inflamações intraoculares que requerem tratamento específico.";
    }
    
    return "Para uma análise precisa dos seus sintomas, recomendamos uma consulta oftalmológica. Nossos especialistas poderão fazer uma avaliação completa e indicar o melhor tratamento.";
  };

  const handleSubmit = async () => {
    if (!input.trim()) {
      setAiResponse({ type: 'error', message: "Por favor, digite seus sintomas antes de pesquisar." });
      setShowScheduleButton(false);
      return;
    }

    setIsLoading(true);
    setAiResponse(null);
    setShowScheduleButton(false);

    // Simular delay da API
    setTimeout(() => {
      const analysis = analyzeSymptoms(input);
      setAiResponse({ type: 'success', message: analysis });
      setShowScheduleButton(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleSchedule = () => {
    const message = `Olá! Gostaria de agendar uma consulta. Sintomas relatados: ${input}`;
    const whatsappUrl = `https://wa.me/5566997215000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <p className="text-lg text-medical-secondary mb-6">
        Digite seus sintomas oculares e receba uma análise inicial. Para diagnóstico preciso, agende uma consulta.
      </p>

      <div className="bg-white rounded-lg border border-medical-muted p-4 mb-6">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setAiResponse(null);
              setShowScheduleButton(false);
            }}
            placeholder="Descreva seus sintomas oculares (ex: 'visão embaçada e sensibilidade à luz', 'olho seco e coceira')"
            className="flex-1 min-h-[60px] resize-none border-none outline-none bg-transparent text-medical-primary placeholder:text-medical-secondary/60"
            rows={2}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="self-end bg-medical-primary text-white p-2 rounded-full hover:bg-medical-secondary transition-colors disabled:opacity-50"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 text-medical-secondary italic">
          <p>Analisando sintomas...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-primary mx-auto mt-2"></div>
        </div>
      )}

      {aiResponse && (
        <div className="mt-6 p-4 rounded-lg bg-medical-muted/30">
          <p className="font-semibold mb-2 text-medical-primary">Resultado da Análise:</p>
          <p className="text-medical-secondary italic text-left">
            {aiResponse.message}
          </p>
        </div>
      )}

      {showScheduleButton && (
        <div className="mt-8">
          <p className="text-lg text-medical-secondary mb-4">
            Para um diagnóstico preciso e tratamento adequado, recomendamos uma consulta com nosso corpo clínico.
          </p>
          <button 
            onClick={handleSchedule}
            className="bg-medical-primary text-white px-8 py-4 rounded-lg shadow-soft hover:bg-medical-secondary transition-colors text-lg font-semibold"
          >
            Agendar Consulta
          </button>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
