// Hook para manter Supabase ativo
import { useEffect } from 'react';

export const useKeepSupabaseAlive = () => {
  useEffect(() => {
    const keepAlive = async () => {
      try {
        // Só executa se passou mais de 5 minutos desde a última chamada
        const lastCall = localStorage.getItem('lastSupabaseCall');
        const now = Date.now();
        
        if (!lastCall || (now - parseInt(lastCall)) > 5 * 60 * 1000) {
          await fetch('/api/keep-supabase-alive', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          localStorage.setItem('lastSupabaseCall', now.toString());
        }
      } catch (error) {
        console.log('Keep alive call failed:', error);
      }
    };

    // Executa quando o componente monta
    keepAlive();

    // Executa a cada 10 minutos enquanto a página está ativa
    const interval = setInterval(keepAlive, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);
};
