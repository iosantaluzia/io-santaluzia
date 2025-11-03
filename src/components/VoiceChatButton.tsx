import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VoiceChatButtonProps {
  variant?: 'default' | 'floating' | 'inline';
  className?: string;
}

const VAPI_PUBLIC_KEY = '0aafc1eb-1ef3-4bd9-9dad-b763c58a0b44';
const VAPI_PRIVATE_KEY = 'f5f59844-231f-4d0d-a4b2-bc7d8933bed6';

export function VoiceChatButton({ variant = 'default', className = '' }: VoiceChatButtonProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  // Assistant ID encontrado na sua conta Vapi (configurado para Instituto de Olhos Santa Luzia)
  const [assistantId] = useState<string>('0eee3a3e-ab36-478d-acd2-cdf4aa3fdcb5');

  const startCall = async () => {
    if (!assistantId) {
      toast.error('Assistente não configurado. Verifique sua conta Vapi.');
      return;
    }

    try {
      setIsCalling(true);
      
      // Solicitar número de telefone do usuário
      const phoneNumber = prompt('Digite seu número de telefone com DDD (ex: 66997215000):');
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
          // Configurações adicionais para agendamento
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
        className={`fixed bottom-20 right-4 md:bottom-24 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-medical-primary text-white shadow-lg hover:bg-medical-primary/90 transition-all duration-300 hover:scale-110 flex items-center justify-center ${
          isCalling ? 'animate-pulse bg-red-600' : ''
        } ${className}`}
        aria-label={isCalling ? 'Encerrar chamada' : 'Iniciar chamada de voz'}
        title={isCalling ? 'Encerrar chamada' : 'Agendar por chamada de voz'}
      >
        {isCalling ? (
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
        disabled={isCalling}
      >
        {isCalling ? (
          <>
            <PhoneOff className="h-4 w-4 mr-2" />
            Encerrar Chamada
          </>
        ) : (
          <>
            <Phone className="h-4 w-4 mr-2" />
            Agendar por Voz
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
        disabled={isCalling}
    >
      {isCalling ? (
        <>
          <PhoneOff className="h-5 w-5 mr-2" />
          Encerrar Chamada
        </>
      ) : (
        <>
          <Phone className="h-5 w-5 mr-2" />
          Agendar por Chamada de Voz
        </>
      )}
    </Button>
  );
}

