
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SymptomChecker = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [showScheduleButton, setShowScheduleButton] = useState(false);

  const apiKey = "AIzaSyByhBtRJM1llpc-wu2Lhc0e1RcpZbBS6aU";

  const analyzeWithAPI = async (symptoms: string) => {
    try {
      console.log('Iniciando análise com API Gemini...');
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Como especialista em oftalmologia, analise os seguintes sintomas oculares e forneça uma análise inicial: "${symptoms}". Responda em português brasileiro de forma educativa, explicando possíveis causas e sempre recomende consulta médica para diagnóstico preciso. Mantenha a resposta concisa e informativa.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      console.log('Status da resposta:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na API:', response.status, errorText);
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dados recebidos:', data);
      
      const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!analysisText) {
        console.error('Resposta da API não contém texto:', data);
        throw new Error('Resposta inválida da API');
      }
      
      return analysisText;
    } catch (error) {
      console.error('Erro detalhado na API:', error);
      return "Erro ao processar sua consulta. Por favor, tente novamente ou agende uma consulta para avaliação presencial.";
    }
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

    console.log('Iniciando análise de sintomas:', input);
    
    const analysis = await analyzeWithAPI(input);
    console.log('Análise concluída:', analysis);
    
    setAiResponse({ type: 'success', message: analysis });
    setShowScheduleButton(true);
    setIsLoading(false);
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
          <p className="text-medical-secondary italic text-left whitespace-pre-wrap">
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
