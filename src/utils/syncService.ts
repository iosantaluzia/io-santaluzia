/**
 * Serviço de sincronização offline-first
 * Sincroniza dados locais com o Supabase quando há conexão
 */

import { supabase } from '@/integrations/supabase/client';
import { offlineStorage } from './offlineStorage';
import { toast } from 'sonner';

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingOperations: number;
  lastSync: Date | null;
}

class SyncService {
  private syncStatus: SyncStatus = {
    isOnline: navigator.onLine,
    isSyncing: false,
    pendingOperations: 0,
    lastSync: null
  };
  private listeners: ((status: SyncStatus) => void)[] = [];
  private syncInterval: number | null = null;
  private weeklySyncInterval: number | null = null;

  constructor() {
    // Inicializar storage offline
    offlineStorage.init().catch(console.error);

    // Monitorar status de conexão
    window.addEventListener('online', () => {
      this.setOnline(true);
      this.sync();
    });

    window.addEventListener('offline', () => {
      this.setOnline(false);
    });

    // Sincronização automática a cada 5 minutos quando online
    this.startAutoSync();

    // Sincronização semanal automática
    this.startWeeklySync();
  }

  /**
   * Verifica se há conexão com internet
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      return true;
    } catch {
      try {
        // Tentar verificar conexão com Supabase
        const { error } = await supabase.from('patients').select('id').limit(1);
        return !error;
      } catch {
        return false;
      }
    }
  }

  /**
   * Define status online/offline
   */
  private setOnline(isOnline: boolean) {
    this.syncStatus.isOnline = isOnline;
    this.notifyListeners();
  }

  /**
   * Adiciona listener para mudanças de status
   */
  addListener(listener: (status: SyncStatus) => void) {
    this.listeners.push(listener);
    listener(this.syncStatus);
  }

  /**
   * Remove listener
   */
  removeListener(listener: (status: SyncStatus) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notifica todos os listeners
   */
  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.syncStatus }));
  }

  /**
   * Obtém status atual
   */
  getStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Sincroniza operações pendentes com o Supabase
   */
  async sync(): Promise<{ success: boolean; synced: number; errors: number }> {
    if (this.syncStatus.isSyncing) {
      return { success: false, synced: 0, errors: 0 };
    }

    const isOnline = await this.checkConnection();
    if (!isOnline) {
      this.setOnline(false);
      return { success: false, synced: 0, errors: 0 };
    }

    this.setOnline(true);
    this.syncStatus.isSyncing = true;
    this.notifyListeners();

    try {
      const pendingOps = await offlineStorage.getPendingOperations();
      this.syncStatus.pendingOperations = pendingOps.length;
      this.notifyListeners();

      if (pendingOps.length === 0) {
        this.syncStatus.isSyncing = false;
        this.syncStatus.lastSync = new Date();
        this.notifyListeners();
        return { success: true, synced: 0, errors: 0 };
      }

      let synced = 0;
      let errors = 0;

      for (const op of pendingOps) {
        try {
          await this.syncOperation(op);
          await offlineStorage.markOperationAsSynced(op.id);
          synced++;
        } catch (error) {
          console.error(`Erro ao sincronizar operação ${op.id}:`, error);
          errors++;
        }
      }

      // Limpar operações sincronizadas antigas
      await offlineStorage.cleanSyncedOperations();

      // Limpar cache antigo
      await offlineStorage.cleanOldCache();

      this.syncStatus.isSyncing = false;
      this.syncStatus.lastSync = new Date();
      this.syncStatus.pendingOperations = await offlineStorage.getPendingOperations().then(ops => ops.length);
      this.notifyListeners();

      if (synced > 0) {
        toast.success(`${synced} operação(ões) sincronizada(s) com sucesso!`);
      }

      return { success: true, synced, errors };
    } catch (error) {
      console.error('Erro na sincronização:', error);
      this.syncStatus.isSyncing = false;
      this.notifyListeners();
      return { success: false, synced: 0, errors: 0 };
    }
  }

  /**
   * Sincroniza uma operação específica
   */
  private async syncOperation(op: any): Promise<void> {
    const { type, table, data } = op;

    switch (type) {
      case 'insert':
        const { error: insertError } = await supabase
          .from(table)
          .insert(data);
        if (insertError) throw insertError;
        break;

      case 'update':
        const { error: updateError } = await supabase
          .from(table)
          .update(data)
          .eq('id', data.id);
        if (updateError) throw updateError;
        break;

      case 'delete':
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('id', data.id);
        if (deleteError) throw deleteError;
        break;

      default:
        throw new Error(`Tipo de operação desconhecido: ${type}`);
    }
  }

  /**
   * Salva uma operação offline para sincronização posterior
   */
  async saveOffline(
    type: 'insert' | 'update' | 'delete',
    table: string,
    data: any
  ): Promise<string> {
    const isOnline = await this.checkConnection();

    if (isOnline) {
      // Tentar sincronizar imediatamente
      try {
        await this.syncOperation({ type, table, data });
        this.setOnline(true);
        return 'synced';
      } catch (error) {
        console.warn('Falha ao sincronizar imediatamente, salvando offline:', error);
        // Continuar para salvar offline
      }
    }

    // Salvar offline
    const operationId = await offlineStorage.saveOfflineOperation(type, table, data);
    this.syncStatus.pendingOperations = await offlineStorage.getPendingOperations().then(ops => ops.length);
    this.notifyListeners();

    // Tentar sincronizar em background se houver conexão
    if (isOnline) {
      setTimeout(() => this.sync(), 1000);
    }

    return operationId;
  }

  /**
   * Inicia sincronização automática periódica
   */
  startAutoSync(intervalMinutes: number = 5) {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = window.setInterval(() => {
      this.sync();
    }, intervalMinutes * 60 * 1000);
  }

  /**
   * Para sincronização automática
   */
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Inicia sincronização semanal automática
   */
  startWeeklySync() {
    if (this.weeklySyncInterval) {
      clearInterval(this.weeklySyncInterval);
    }

    // Sincronizar toda segunda-feira às 2h da manhã
    const now = new Date();
    const nextMonday = new Date();
    nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
    nextMonday.setHours(2, 0, 0, 0);

    if (nextMonday <= now) {
      nextMonday.setDate(nextMonday.getDate() + 7);
    }

    const msUntilNextMonday = nextMonday.getTime() - now.getTime();

    setTimeout(() => {
      this.sync();
      // Agendar próxima sincronização semanal
      this.weeklySyncInterval = window.setInterval(() => {
        this.sync();
      }, 7 * 24 * 60 * 60 * 1000);
    }, msUntilNextMonday);
  }

  /**
   * Para sincronização semanal
   */
  stopWeeklySync() {
    if (this.weeklySyncInterval) {
      clearInterval(this.weeklySyncInterval);
      this.weeklySyncInterval = null;
    }
  }
}

export const syncService = new SyncService();

