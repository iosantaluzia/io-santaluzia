
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { ArrowUp, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Context para o PromptInput
const PromptInputContext = createContext({
  isLoading: false,
  value: "",
  setValue: () => {},
  maxHeight: 240,
  onSubmit: undefined,
  disabled: false,
});

function usePromptInput() {
  const context = useContext(PromptInputContext);
  if (!context) {
    throw new Error("usePromptInput must be used within a PromptInput");
  }
  return context;
}

function PromptInput({
  className,
  isLoading = false,
  maxHeight = 240,
  value,
  onValueChange,
  onSubmit,
  children,
}) {
  const [internalValue, setInternalValue] = useState(value || "");

  const handleChange = (newValue) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TooltipProvider>
      <PromptInputContext.Provider
        value={{
          isLoading,
          value: value ?? internalValue,
          setValue: onValueChange ?? handleChange,
          maxHeight,
          onSubmit,
          disabled: false,
        }}
      >
        <div
          className={cn(
            "border-input bg-background rounded-3xl border p-2 shadow-soft",
            className
          )}
        >
          {children}
        </div>
      </PromptInputContext.Provider>
    </TooltipProvider>
  );
}

function PromptInputTextarea({
  className,
  onKeyDown,
  disableAutosize = false,
  ...props
}) {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
  const textareaRef = useRef(null);

  useEffect(() => {
    if (disableAutosize) return;

    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      typeof maxHeight === "number"
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
  }, [value, maxHeight, disableAutosize]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn(
        "text-medical-primary min-h-[44px] w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-2",
        className
      )}
      rows={1}
      disabled={disabled}
      {...props}
    />
  );
}

function PromptInputActions({
  children,
  className,
  ...props
}) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

function PromptInputAction({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}) {
  const { disabled } = usePromptInput();

  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

const SymptomChecker = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [showScheduleButton, setShowScheduleButton] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) {
      setAiResponse({ type: 'error', message: "Por favor, digite seus sintomas antes de pesquisar." });
      setShowScheduleButton(false);
      return;
    }

    setIsLoading(true);
    setAiResponse(null);
    setShowScheduleButton(false);

    try {
      const prompt = `Analise os seguintes sintomas oculares: "${input}". Com base neles, indique qual região do olho ou condição pode estar relacionada (córnea, cristalino, grau de óculos (refração), catarata, etc.). Adicione informações se certas condições estão mais associadas a fatores como idade (ex: catarata - mais comum em idosos) ou outros fatores relevantes. Responda em no máximo 3 linhas. Se os sintomas não forem relacionados à oftalmologia ou medicina, retorne apenas a frase "Não consigo realizar esta ação. Por favor, digite sintomas relacionados à saúde ocular ou medicina."`;

      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });

      const payload = { contents: chatHistory };
      const apiKey = "AIzaSyCcbK9p_uGHUL0d7oyE7rqbxK0IdBbME80";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;

        if (text.includes("Não consigo realizar esta ação.")) {
          setAiResponse({ type: 'error', message: text });
        } else {
          setAiResponse({ type: 'success', message: text });
          setShowScheduleButton(true);
        }
      } else {
        setAiResponse({ type: 'error', message: "Não foi possível obter uma resposta. Tente novamente." });
      }
    } catch (error) {
      console.error("Erro ao chamar a API Gemini:", error);
      setAiResponse({ type: 'error', message: "Ocorreu um erro na comunicação com a IA. Por favor, tente novamente mais tarde." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueChange = (value) => {
    setInput(value);
    setAiResponse(null);
    setShowScheduleButton(false);
  };

  const handleScheduleClick = () => {
    const phoneNumber = "556699721-5000";
    const message = "Olá! Realizei uma consulta sobre sintomas oculares e gostaria de agendar uma consulta no Instituto de Olhos Santa Luzia.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="py-12 px-6 md:px-12 max-w-4xl mx-auto text-center">
      <p className="text-lg text-medical-secondary mb-6 leading-relaxed">
        Digite seus sintomas oculares e vamos sugerir suas alterações ou condições oculares. Se necessário, agende uma consulta.
      </p>

      <PromptInput
        value={input}
        onValueChange={handleValueChange}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        className="w-full mb-6 max-w-2xl mx-auto"
      >
        <PromptInputTextarea 
          placeholder="Descreva seus sintomas oculares (ex: 'visão embaçada e sensibilidade à luz', 'olho seco e coceira')" 
          className=""
          onKeyDown={() => {}}
        />
        <PromptInputActions className="justify-end pt-2">
          <PromptInputAction
            tooltip={isLoading ? "Parar pesquisa" : "Pesquisar sintomas"}
            className=""
          >
            <Button
              variant="default"
              size="icon"
              className="h-8 w-8 rounded-full bg-medical-primary hover:bg-medical-primary/90 text-white"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <Square className="size-4 fill-current" />
              ) : (
                <ArrowUp className="size-4" />
              )}
            </Button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>

      {isLoading && (
        <div className="mt-4 text-medical-secondary italic">
          <p>Analisando sintomas...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-primary mx-auto mt-2"></div>
        </div>
      )}

      {aiResponse && (
        <div className={`mt-6 p-4 rounded-lg bg-transparent ${aiResponse.type === 'error' ? 'text-red-700' : 'text-medical-secondary'}`}>
          <p className="font-semibold mb-2 text-medical-primary">Resultado da Análise:</p>
          <p className={`whitespace-pre-wrap text-left ${aiResponse.type === 'error' ? 'font-bold' : 'italic'}`}>
            {aiResponse.message}
          </p>
        </div>
      )}

      {showScheduleButton && (
        <div className="mt-8">
          <p className="text-lg text-medical-secondary mb-4">
            Para um diagnóstico preciso e tratamento adequado, recomendamos uma consulta com nosso corpo clínico.
          </p>
          <Button 
            onClick={handleScheduleClick}
            className="bg-medical-primary hover:bg-medical-primary/90 text-white px-8 py-4 rounded-lg text-lg font-semibold"
          >
            Agendar Consulta
          </Button>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
