import React, { useState } from 'react';
import { Phone, PhoneOff, PhoneCall, PhoneIncoming } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface VoiceChatButtonProps {
  variant?: 'default' | 'floating' | 'inline';
  className?: string;
}

const VAPI_PRIVATE_KEY = 'f5f59844-231f-4d0d-a4b2-bc7d8933bed6';

export function VoiceChatButton({ 
  variant = 'default', 
  className = ''
}: VoiceChatButtonProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callType, setCallType] = useState<'receive' | 'call'>('receive');
  
  // Assistant ID encontrado na sua conta Vapi (configurado para Instituto de Olhos Santa Luzia)
  const [assistantId] = useState<string>('0eee3a3e-ab36-478d-acd2-cdf4aa3fdcb5');

  const formatPhoneInput = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + número)
    const limited = numbers.slice(0, 11);
    
    // Formata: (XX) XXXXX-XXXX
    if (limited.length <= 10) {
      return limited.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else {
      return limited.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
  };

  const formatPhoneForAPI = (phone: string): string => {
    const numbers = phone.replace(/\D/g, '');
    if (!numbers.startsWith('55')) {
      return `+55${numbers}`;
    }
    return `+${numbers}`;
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      toast.error('Por favor, digite um número de telefone válido');
      return;
    }

    setShowPhoneDialog(false);
    await startPhoneCall(formatPhoneForAPI(phoneNumber));
  };

  // Chamada telefônica - usuário recebe ligação
  const startPhoneCall = async (formattedPhone?: string) => {
    if (!assistantId) {
      toast.error('Assistente não configurado. Verifique sua conta Vapi.');
      return;
    }

    const phone = formattedPhone || formatPhoneForAPI(phoneNumber);

    try {
      setIsLoading(true);
      
      // Iniciar chamada via API da Vapi (outboundPhoneCall - usuário recebe ligação)
      // A Vapi requer phoneNumber no objeto customer ou phoneNumberId
      // Baseado no erro: "Need Either `phoneNumberId` Or `phoneNumber`"
      const response = await fetch('https://api.vapi.ai/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
        },
        body: JSON.stringify({
          assistantId: assistantId,
          customer: {
            phoneNumber: phone, // Usar phoneNumber (não number)
          },
          metadata: {
            source: 'website',
            page: window.location.pathname,
            callType: callType,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao iniciar chamada');
      }

      const data = await response.json();
      setCallId(data.id);
      setIsCalling(true);
      setIsLoading(false);
      
      if (callType === 'receive') {
        toast.success('Chamada iniciada! Você receberá uma ligação em breve no número informado.');
      } else {
        toast.success('Chamada iniciada! Conectando...');
      }
      
    } catch (error: any) {
      console.error('Erro ao iniciar chamada:', error);
      toast.error(error.message || 'Erro ao iniciar chamada. Tente novamente.');
      setIsLoading(false);
    }
  };

  const startCall = () => {
    setCallType('receive'); // Por padrão, usuário recebe ligação
    setShowPhoneDialog(true);
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
    setPhoneNumber('');
    toast.info('Chamada encerrada');
  };

  if (variant === 'floating') {
    return (
      <>
        <button
          onClick={isCalling ? endCall : startCall}
          disabled={isLoading}
          className={`fixed bottom-20 right-4 md:bottom-24 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-medical-primary text-white shadow-lg hover:bg-medical-primary/90 transition-all duration-300 hover:scale-110 flex items-center justify-center ${
            isCalling ? 'animate-pulse bg-red-600' : ''
          } ${isLoading ? 'opacity-50 cursor-wait' : ''} ${className}`}
          aria-label={isCalling ? 'Encerrar chamada' : 'Agendar por chamada de voz'}
          title={isCalling ? 'Encerrar chamada' : 'Agendar consulta por chamada de voz'}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
          ) : isCalling ? (
            <PhoneOff className="h-6 w-6 md:h-7 md:w-7" />
          ) : (
            <Phone className="h-6 w-6 md:h-7 md:w-7" />
          )}
        </button>

        {/* Dialog para coletar número de telefone */}
        <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-medical-primary" />
                Agendar por Chamada de Voz
              </DialogTitle>
              <DialogDescription>
                Informe seu número de telefone para receber uma ligação do nosso assistente virtual e agendar sua consulta.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Número de Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(66) 99999-9999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneInput(e.target.value))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handlePhoneSubmit();
                    }
                  }}
                  className="text-lg"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Digite seu número com DDD. Você receberá uma ligação em breve.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPhoneDialog(false);
                  setPhoneNumber('');
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handlePhoneSubmit}
                disabled={!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10}
                className="bg-medical-primary hover:bg-medical-primary/90"
              >
                <PhoneIncoming className="h-4 w-4 mr-2" />
                Receber Ligação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (variant === 'inline') {
    return (
      <>
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
              Agendar por Voz
            </>
          )}
        </Button>

        {/* Dialog para coletar número de telefone */}
        <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-medical-primary" />
                Agendar por Chamada de Voz
              </DialogTitle>
              <DialogDescription>
                Informe seu número de telefone para receber uma ligação do nosso assistente virtual.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="phone-inline">Número de Telefone</Label>
                <Input
                  id="phone-inline"
                  type="tel"
                  placeholder="(66) 99999-9999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneInput(e.target.value))}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handlePhoneSubmit();
                    }
                  }}
                  className="text-lg"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPhoneDialog(false);
                  setPhoneNumber('');
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handlePhoneSubmit}
                disabled={!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10}
                className="bg-medical-primary hover:bg-medical-primary/90"
              >
                <PhoneIncoming className="h-4 w-4 mr-2" />
                Receber Ligação
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
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
            Agendar por Chamada de Voz
          </>
        )}
      </Button>

      {/* Dialog para coletar número de telefone */}
      <Dialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-medical-primary" />
              Agendar por Chamada de Voz
            </DialogTitle>
            <DialogDescription>
              Informe seu número de telefone para receber uma ligação do nosso assistente virtual e agendar sua consulta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="phone-default">Número de Telefone</Label>
              <Input
                id="phone-default"
                type="tel"
                placeholder="(66) 99999-9999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneInput(e.target.value))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePhoneSubmit();
                  }
                }}
                className="text-lg"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                Você receberá uma ligação em breve no número informado.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowPhoneDialog(false);
                setPhoneNumber('');
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handlePhoneSubmit}
              disabled={!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10}
              className="bg-medical-primary hover:bg-medical-primary/90"
            >
              <PhoneIncoming className="h-4 w-4 mr-2" />
              Receber Ligação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
