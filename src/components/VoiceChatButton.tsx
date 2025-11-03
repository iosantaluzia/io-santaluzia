import React, { useState } from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VoiceChatButtonProps {
  variant?: 'default' | 'floating' | 'inline';
  className?: string;
  useBrowserCall?: boolean; // Nova prop para escolher entre ligação telefônica ou navegador
}

const VAPI_PUBLIC_KEY = '0aafc1eb-1ef3-4bd9-9dad-b763c58a0b44';
const VAPI_PRIVATE_KEY = 'f5f59844-231f-4d0d-a4b2-bc7d8933bed6';

export function VoiceChatButton({ 
  variant = 'default', 
  className = '',
  useBrowserCall = true // Por padrão, usar chamada no navegador
}: VoiceChatButtonProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Assistant ID encontrado na sua conta Vapi (configurado para Instituto de Olhos Santa Luzia)
  const [assistantId] = useState<string>('0eee3a3e-ab36-478d-acd2-cdf4aa3fdcb5');

  // Chamada via navegador (cria chamada sem número de telefone)
  const startBrowserCall = async () => {
    if (!assistantId) {
      toast.error('Assistente não configurado. Verifique sua conta Vapi.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Solicitar permissão de microfone
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        toast.error('Permissão de microfone necessária para usar o chat de voz.');
        setIsLoading(false);
        return;
      }

      // A Vapi não suporta chamadas WebRTC diretas via API REST
      // Para teste no navegador, vamos redirecionar para o simulador da Vapi
      toast.info('Para testar no navegador, use o simulador no dashboard da Vapi.', {
        duration: 5000,
      });
      
      // Abrir dashboard da Vapi em nova aba para teste
      const dashboardUrl = `https://dashboard.vapi.ai/assistant/${assistantId}`;
      window.open(dashboardUrl, '_blank');
      
      setIsLoading(false);
      
    } catch (error: any) {
      console.error('Erro ao iniciar chamada no navegador:', error);
      toast.error(error.message || 'Erro ao iniciar chamada. Tente novamente.');
      setIsLoading(false);
    }
  };

  // Chamada telefônica (modo original)
  const startPhoneCall = async () => {
    if (!assistantId) {
      toast.error('Assistente não configurado. Verifique sua conta Vapi.');
      return;
    }

    try {
      setIsCalling(true);
      
      // Solicitar número de telefone do usuário
      const phoneNumber = prompt('Digite seu número de telefone com DDD (ex: 41998620321):');
      if (!phoneNumber) {
        setIsCalling(false);
        return;
      }

      // Formatar número para E.164 (adicionar +55 se necessário)
      let formattedPhone = phoneNumber.replace(/\D/g, '');
      if (!formattedPhone.startsWith('55')) {
        formattedPhone = `55${formattedPhone}`;
      }
      formattedPhone = `+${formattedPhone}`;
      
      // Iniciar chamada via API da Vapi
      const response = await fetch('https://api.vapi.ai/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
        },
        body: JSON.stringify({
          assistantId: assistantId,
          customer: {
            number: formattedPhone,
          },
          metadata: {
            source: 'website',
            page: window.location.pathname,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao iniciar chamada');
      }

      const data = await response.json();
      setCallId(data.id);
      toast.success('Chamada iniciada! Você receberá uma ligação em breve.');
      
    } catch (error: any) {
      console.error('Erro ao iniciar chamada:', error);
      toast.error(error.message || 'Erro ao iniciar chamada. Tente novamente.');
      setIsCalling(false);
    }
  };

  const startCall = () => {
    if (useBrowserCall) {
      startBrowserCall();
    } else {
      startPhoneCall();
    }
  };

  const endCall = async () => {
    if (callId) {
      try {
        // Encerrar chamada via API da Vapi
        await fetch(`https://api.vapi.ai/call/${callId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
          },
          body: JSON.stringify({
            endedReason: 'user-ended',
          }),
        });
      } catch (error) {
        console.error('Erro ao encerrar chamada:', error);
      }
    }
    
    setCallId(null);
    setIsCalling(false);
    toast.info('Chamada encerrada');
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={isCalling ? endCall : startCall}
        disabled={isLoading}
        className={`fixed bottom-20 right-4 md:bottom-24 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-medical-primary text-white shadow-lg hover:bg-medical-primary/90 transition-all duration-300 hover:scale-110 flex items-center justify-center ${
          isCalling ? 'animate-pulse bg-red-600' : ''
        } ${isLoading ? 'opacity-50 cursor-wait' : ''} ${className}`}
        aria-label={isCalling ? 'Encerrar chamada' : 'Iniciar chat de voz'}
        title={isCalling ? 'Encerrar chamada' : useBrowserCall ? 'Testar assistente de voz no navegador' : 'Agendar por chamada telefônica'}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
        ) : isCalling ? (
          <PhoneOff className="h-6 w-6 md:h-7 md:w-7" />
        ) : (
          <Phone className="h-6 w-6 md:h-7 md:w-7" />
        )}
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <Button
        onClick={isCalling ? endCall : startCall}
        className={`bg-medical-primary hover:bg-medical-primary/90 ${isCalling ? 'bg-red-600' : ''} ${className}`}
        disabled={isCalling || isLoading}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
            Conectando...
          </>
        ) : isCalling ? (
          <>
            <PhoneOff className="h-4 w-4 mr-2" />
            Encerrar Chamada
          </>
        ) : (
          <>
            <Phone className="h-4 w-4 mr-2" />
            {useBrowserCall ? 'Testar Assistente' : 'Agendar por Voz'}
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={isCalling ? endCall : startCall}
      className={`bg-medical-primary hover:bg-medical-primary/90 ${isCalling ? 'bg-red-600' : ''} ${className}`}
      size="lg"
      disabled={isCalling || isLoading}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
          Conectando...
        </>
      ) : isCalling ? (
        <>
          <PhoneOff className="h-5 w-5 mr-2" />
          Encerrar Chamada
        </>
      ) : (
        <>
          <Phone className="h-5 w-5 mr-2" />
          {useBrowserCall ? 'Testar Assistente de Voz' : 'Agendar por Chamada de Voz'}
        </>
      )}
    </Button>
  );
}
