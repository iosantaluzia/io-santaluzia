/**
 * Wrapper para operações do Supabase com suporte offline
 * Usa o serviço de sincronização para salvar operações offline quando necessário
 */

import { supabase } from '@/integrations/supabase/client';
import { syncService } from './syncService';

/**
 * Insere dados com suporte offline
 */
export async function insertOffline<T = any>(
  table: string,
  data: T
): Promise<{ data: any; error: any }> {
  try {
    // Tentar inserir diretamente
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();

    if (!error) {
      return { data: result, error: null };
    }

    // Se houver erro de rede, salvar offline
    if (error.code === 'PGRST116' || error.message?.includes('fetch')) {
      const operationId = await syncService.saveOffline('insert', table, data);
      return {
        data: { id: operationId, ...data, _offline: true },
        error: null
      };
    }

    return { data: null, error };
  } catch (error: any) {
    // Em caso de erro de rede, salvar offline
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      const operationId = await syncService.saveOffline('insert', table, data);
      return {
        data: { id: operationId, ...data, _offline: true },
        error: null
      };
    }
    return { data: null, error };
  }
}

/**
 * Atualiza dados com suporte offline
 */
export async function updateOffline<T = any>(
  table: string,
  id: string,
  data: Partial<T>
): Promise<{ data: any; error: any }> {
  try {
    // Tentar atualizar diretamente
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (!error) {
      return { data: result, error: null };
    }

    // Se houver erro de rede, salvar offline
    if (error.code === 'PGRST116' || error.message?.includes('fetch')) {
      const operationId = await syncService.saveOffline('update', table, { id, ...data });
      return {
        data: { id, ...data, _offline: true },
        error: null
      };
    }

    return { data: null, error };
  } catch (error: any) {
    // Em caso de erro de rede, salvar offline
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      const operationId = await syncService.saveOffline('update', table, { id, ...data });
      return {
        data: { id, ...data, _offline: true },
        error: null
      };
    }
    return { data: null, error };
  }
}

/**
 * Deleta dados com suporte offline
 */
export async function deleteOffline(
  table: string,
  id: string
): Promise<{ data: any; error: any }> {
  try {
    // Tentar deletar diretamente
    const { data: result, error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (!error) {
      return { data: result, error: null };
    }

    // Se houver erro de rede, salvar offline
    if (error.code === 'PGRST116' || error.message?.includes('fetch')) {
      const operationId = await syncService.saveOffline('delete', table, { id });
      return {
        data: { id, _offline: true },
        error: null
      };
    }

    return { data: null, error };
  } catch (error: any) {
    // Em caso de erro de rede, salvar offline
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      const operationId = await syncService.saveOffline('delete', table, { id });
      return {
        data: { id, _offline: true },
        error: null
      };
    }
    return { data: null, error };
  }
}

/**
 * Busca dados com cache offline
 */
export async function selectOffline<T = any>(
  table: string,
  query?: string
): Promise<{ data: T[] | null; error: any }> {
  try {
    // Tentar buscar diretamente
    let queryBuilder = supabase.from(table).select(query || '*');
    const { data, error } = await queryBuilder;

    if (!error) {
      return { data, error: null };
    }

    // Se houver erro de rede, tentar buscar do cache
    if (error.code === 'PGRST116' || error.message?.includes('fetch')) {
      // Retornar array vazio se não houver cache
      return { data: [], error: null };
    }

    return { data: null, error };
  } catch (error: any) {
    // Em caso de erro de rede, retornar array vazio
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return { data: [], error: null };
    }
    return { data: null, error };
  }
}

