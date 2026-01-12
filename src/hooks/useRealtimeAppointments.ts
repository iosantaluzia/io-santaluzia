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
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Função com debounce para evitar múltiplas chamadas rápidas
  const debouncedCallback = useCallback((change: { type: 'INSERT' | 'UPDATE' | 'DELETE'; data: ConsultationUpdate }) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onAppointmentChange(change);
    }, 300); // 300ms de debounce
  }, [onAppointmentChange]);

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
          table: 'consultations',
          filter: undefined // Remover filtro para capturar todas as mudanças
        },
        (payload) => {
          const newConsultation = payload.new as ConsultationUpdate;
          debouncedCallback({
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
          table: 'consultations',
          filter: undefined // Remover filtro para capturar todas as mudanças
        },
        (payload) => {
          const updatedConsultation = payload.new as ConsultationUpdate;
          debouncedCallback({
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
          table: 'consultations',
          filter: undefined // Remover filtro para capturar todas as mudanças
        },
        (payload) => {
          const deletedConsultation = payload.old as ConsultationUpdate;
          debouncedCallback({
            type: 'DELETE',
            data: deletedConsultation
          });
        }
      )
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('Erro na conexão Realtime para consultas:', err);
        }
      });

    channelRef.current = channel;

    // Limpeza ao desmontar
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [debouncedCallback]);

  // Função para testar a conexão e verificar realtime
  const testConnection = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('id')
        .limit(1);

      if (error) {
        console.error('Erro na conexão com tabela consultations:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro inesperado ao testar conexão:', error);
      return false;
    }
  }, []);

  return {
    testConnection
  };
}