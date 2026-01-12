import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface ConsultationUpdate {
  id: string;
  patient_id: string;
  consultation_date: string;
  status: string;
  doctor_name: string;
  appointment_type?: string;
  observations?: string;
}

export function useRealtimeAppointments(
  onAppointmentChange: (change: { type: 'INSERT' | 'UPDATE' | 'DELETE'; data: ConsultationUpdate }) => void
) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Configurar Realtime para mudanças na tabela consultations
  useEffect(() => {
    // Limpar canal anterior se existir
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    // Criar novo canal para monitorar mudanças na tabela consultations
    const channel = supabase
      .channel(`consultations_realtime_${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consultations'
        },
        (payload) => {
          console.log('📨 Nova consulta inserida via Realtime:', payload);
          const newConsultation = payload.new as ConsultationUpdate;
          onAppointmentChange({
            type: 'INSERT',
            data: newConsultation
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'consultations'
        },
        (payload) => {
          console.log('🔄 Consulta atualizada via Realtime:', payload);
          const updatedConsultation = payload.new as ConsultationUpdate;
          onAppointmentChange({
            type: 'UPDATE',
            data: updatedConsultation
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'consultations'
        },
        (payload) => {
          console.log('🗑️ Consulta removida via Realtime:', payload);
          const deletedConsultation = payload.old as ConsultationUpdate;
          onAppointmentChange({
            type: 'DELETE',
            data: deletedConsultation
          });
        }
      )
      .subscribe((status, err) => {
        console.log('📡 Status da subscrição Realtime (consultations):', status, err);

        if (status === 'SUBSCRIBED') {
          console.log('✅ Conectado ao Realtime para consultas - aguardando mudanças...');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Erro na conexão Realtime para consultas:', err);
          console.error('💡 Verifique se a tabela consultations está habilitada para Realtime no Supabase');
        } else if (status === 'TIMED_OUT') {
          console.warn('⏱️ Timeout na conexão Realtime para consultas - tentando reconectar...');
        } else if (status === 'CLOSED') {
          console.warn('🔌 Conexão Realtime para consultas fechada');
        } else {
          console.log('🔄 Status intermediário (consultations):', status);
        }
      });

    channelRef.current = channel;

    // Limpeza ao desmontar
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [onAppointmentChange]);

  // Função para testar a conexão (opcional, para debug)
  const testConnection = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('id')
        .limit(1);

      if (error) {
        console.error('❌ Erro ao testar conexão com tabela consultations:', error);
        return false;
      }

      console.log('✅ Conexão com tabela consultations OK');
      return true;
    } catch (error) {
      console.error('❌ Erro inesperado ao testar conexão:', error);
      return false;
    }
  }, []);

  return {
    testConnection
  };
}