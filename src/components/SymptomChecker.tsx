
import React, { useState, useRef, useEffect } from 'react';
import { Search, AlertTriangle, RefreshCw, Calendar, ArrowDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SymptomChecker = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [showScheduleButton, setShowScheduleButton] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const analyzeSymptoms = async (symptoms: string) => {
    try {
      console.log('Chamando Edge Function para análise de sintomas...');
      
      const { data, error } = await supabase.functions.invoke('symptom-analyzer', {
        body: { symptoms }
      });

      if (error) {
        console.error('Erro no Edge Function:', error);
        throw new Error('Erro na comunicação com o serviço de análise');
      }

      if (!data.success || !data.analysis) {
        console.error('Resposta inválida do Edge Function:', data);
        throw new Error(data.error || 'Erro ao processar análise');
      }

      console.log('Análise recebida com sucesso');
      return data.analysis;

    } catch (error) {
      console.error('Erro detalhado na análise:', error);
      throw error;
    }
  };

  // Auto-scroll to results when they appear
  useEffect(() => {
    if (response && resultRef.current) {
      resultRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [response]);

  const handleSubmit = async () => {
    if (!input.trim()) {
      setResponse({ 
        type: 'error', 
        message: "Por favor, descreva seus sintomas oculares antes de analisar." 
      });
      setShowScheduleButton(false);
      return;
    }

    if (input.trim().length < 3) {
      setResponse({ 
        type: 'error', 
        message: "Por favor, descreva seus sintomas com mais detalhes." 
      });
      setShowScheduleButton(false);
      return;
    }

    setIsLoading(true);
    setResponse(null);
    setShowScheduleButton(false);

    console.log('Iniciando análise de sintomas:', input);
    
    try {
      const analysis = await analyzeSymptoms(input);
      console.log('Análise concluída:', analysis);
      
      setResponse({ 
        type: 'success', 
        message: analysis 
      });
      setShowScheduleButton(true);
    } catch (error) {
      console.error('Erro na análise:', error);
      setResponse({ 
        type: 'error', 
        message: error instanceof Error 
          ? error.message 
          : "Não foi possível processar sua consulta. Tente novamente ou agende uma consulta."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setResponse(null);
    setShowScheduleButton(false);
    handleSubmit();
  };

  const handleSchedule = () => {
    const message = `Olá! Gostaria de agendar uma consulta. Sintomas relatados: ${input}`;
    const whatsappUrl = `https://wa.me/5566997215000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const clearInput = () => {
    setInput('');
    setResponse(null);
    setShowScheduleButton(false);
  };

  const scrollToSite = () => {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      {!response ? (
        <>
          <div className="max-w-3xl mx-auto space-y-4 mb-8">
            <p className="text-lg text-medical-secondary leading-relaxed">
              Nossa IA especializada ajuda você a entender seus sintomas oculares de forma rápida e confiável
            </p>
            <p className="text-base text-gray-600 leading-relaxed">
              Digite seus sintomas oculares e receba uma análise inicial. Para diagnóstico preciso, agende uma consulta.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-medical-muted p-4 mb-6">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (response?.type === 'error') {
                    setResponse(null);
                    setShowScheduleButton(false);
                  }
                }}
                placeholder="Descreva seus sintomas oculares (ex: 'visão embaçada e sensibilidade à luz', 'dor de cabeça e vista cansada', 'manchas na visão', 'dificuldade para enxergar de perto')"
                className="flex-1 min-h-[60px] resize-none border-none outline-none bg-transparent text-medical-primary placeholder:text-medical-secondary/60"
                rows={2}
                disabled={isLoading}
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !input.trim()}
                  className="bg-medical-primary text-white p-2 rounded-full hover:bg-medical-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Analisar sintomas"
                >
                  <Search className="h-5 w-5" />
                </button>
                {input && (
                  <button
                    onClick={clearInput}
                    disabled={isLoading}
                    className="text-medical-secondary hover:text-medical-primary p-2 rounded-full hover:bg-medical-muted/30 transition-colors disabled:opacity-50"
                    title="Limpar campo"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div 
          ref={resultRef}
          className={`p-4 rounded-lg border mb-6 ${
            response.type === 'success' 
              ? 'bg-medical-muted/20 border-medical-muted' 
              : 'bg-red-50 border-red-200'
          }`}
        >
          {response.type === 'success' ? (
            <div className="flex flex-col lg:flex-row gap-4 items-start">
              <div className="flex-1 text-left">
                <p className="font-semibold mb-2 text-medical-primary">Resultado da Análise:</p>
                <p className="text-medical-secondary leading-relaxed text-sm">
                  {response.message}
                </p>
                <p className="text-xs text-medical-secondary/70 mt-3 italic">
                  ⚠️ Esta análise é apenas informativa. Consulte nosso corpo clínico para diagnóstico preciso.
                </p>
              </div>
              
              <div className="flex-shrink-0 lg:ml-4 flex flex-col gap-2">
                <button 
                  onClick={handleSchedule}
                  className="inline-flex items-center gap-2 bg-medical-primary text-white px-4 py-3 rounded-lg hover:bg-medical-secondary transition-colors text-sm font-medium shadow-soft"
                >
                  <Calendar className="h-4 w-4" />
                  Agendar Consulta
                </button>
                <button 
                  onClick={clearInput}
                  className="inline-flex items-center gap-2 text-medical-secondary hover:text-medical-primary px-4 py-2 rounded-lg hover:bg-medical-muted/30 transition-colors text-sm"
                >
                  Nova Análise
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="font-semibold text-red-700">Erro na Análise</p>
              </div>
              <p className="text-red-600 mb-3 text-sm">{response.message}</p>
              <button 
                onClick={handleRetry}
                className="inline-flex items-center gap-2 bg-medical-primary text-white px-4 py-2 rounded-lg hover:bg-medical-secondary transition-colors text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar Novamente
              </button>
            </>
          )}
        </div>
      )}

      {/* Botão Continuar no site - sempre visível */}
      <div className="mb-8">
        <button
          onClick={scrollToSite}
          className="inline-flex items-center gap-2 text-medical-primary hover:text-medical-secondary transition-colors font-medium text-sm group"
        >
          Continuar no site
          <ArrowDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>

      {isLoading && (
        <div className="mt-4 text-medical-secondary">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-medical-primary"></div>
            <p className="italic">Analisando sintomas...</p>
          </div>
          <p className="text-sm text-medical-secondary/80">
            Processando sua consulta com inteligência artificial especializada
          </p>
        </div>
      )}

    </div>
  );
};

export default SymptomChecker;
