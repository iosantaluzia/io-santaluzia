
import React, { useState } from 'react';
import { Search, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SymptomChecker = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [showScheduleButton, setShowScheduleButton] = useState(false);

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
              if (response?.type === 'error') {
                setResponse(null);
                setShowScheduleButton(false);
              }
            }}
            placeholder="Descreva seus sintomas oculares (ex: 'visão embaçada e sensibilidade à luz', 'olho seco e coceira', 'dor de cabeça e vista cansada')"
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

      {response && (
        <div className={`mt-6 p-4 rounded-lg ${
          response.type === 'success' 
            ? 'bg-medical-muted/30' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {response.type === 'success' ? (
            <>
              <p className="font-semibold mb-2 text-medical-primary">Resultado da Análise:</p>
              <p className="text-medical-secondary text-left whitespace-pre-wrap leading-relaxed">
                {response.message}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="font-semibold text-red-700">Erro na Análise</p>
              </div>
              <p className="text-red-600 mb-3">{response.message}</p>
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

      {showScheduleButton && (
        <div className="mt-8">
          <div className="bg-gradient-to-r from-medical-primary/10 to-medical-secondary/10 rounded-lg p-6 mb-4">
            <p className="text-lg text-medical-secondary mb-4 font-medium">
              ⚠️ Esta análise é apenas informativa. Para um diagnóstico preciso e tratamento adequado, recomendamos uma consulta com nosso corpo clínico especializado.
            </p>
          </div>
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
