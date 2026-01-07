/**
 * Sistema de armazenamento offline usando IndexedDB
 * Permite que o aplicativo funcione sem internet e sincronize quando possível
 */

const DB_NAME = 'santaluzia-offline-db';
const DB_VERSION = 1;

interface OfflineOperation {
  id: string;
  type: 'insert' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

class OfflineStorage {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Erro ao abrir IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store para operações pendentes
        if (!db.objectStoreNames.contains('pending_operations')) {
          const operationsStore = db.createObjectStore('pending_operations', {
            keyPath: 'id',
            autoIncrement: false
          });
          operationsStore.createIndex('synced', 'synced', { unique: false });
          operationsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store para cache de dados
        if (!db.objectStoreNames.contains('data_cache')) {
          const cacheStore = db.createObjectStore('data_cache', {
            keyPath: 'key'
          });
          cacheStore.createIndex('table', 'table', { unique: false });
          cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  /**
   * Salva uma operação offline para sincronização posterior
   */
  async saveOfflineOperation(
    type: 'insert' | 'update' | 'delete',
    table: string,
    data: any
  ): Promise<string> {
    await this.init();

    const operation: OfflineOperation = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      table,
      data,
      timestamp: Date.now(),
      synced: false
    };

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['pending_operations'], 'readwrite');
      const store = transaction.objectStore('pending_operations');
      const request = store.add(operation);

      request.onsuccess = () => {
        console.log('Operação offline salva:', operation);
        resolve(operation.id);
      };

      request.onerror = () => {
        console.error('Erro ao salvar operação offline:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Obtém todas as operações pendentes de sincronização
   */
  async getPendingOperations(): Promise<OfflineOperation[]> {
    await this.init();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['pending_operations'], 'readonly');
      const store = transaction.objectStore('pending_operations');
      const index = store.index('synced');
      const request = index.getAll(false);

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Marca uma operação como sincronizada
   */
  async markOperationAsSynced(operationId: string): Promise<void> {
    await this.init();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['pending_operations'], 'readwrite');
      const store = transaction.objectStore('pending_operations');
      const getRequest = store.get(operationId);

      getRequest.onsuccess = () => {
        const operation = getRequest.result;
        if (operation) {
          operation.synced = true;
          const putRequest = store.put(operation);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve();
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Remove operações sincronizadas antigas (mais de 7 dias)
   */
  async cleanSyncedOperations(): Promise<void> {
    await this.init();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['pending_operations'], 'readwrite');
      const store = transaction.objectStore('pending_operations');
      const index = store.index('synced');
      const request = index.getAll(true);

      request.onsuccess = () => {
        const operations = request.result || [];
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        
        const deletePromises = operations
          .filter((op: OfflineOperation) => op.timestamp < sevenDaysAgo)
          .map((op: OfflineOperation) => {
            return new Promise<void>((resolveDelete, rejectDelete) => {
              const deleteRequest = store.delete(op.id);
              deleteRequest.onsuccess = () => resolveDelete();
              deleteRequest.onerror = () => rejectDelete(deleteRequest.error);
            });
          });

        Promise.all(deletePromises).then(() => resolve()).catch(reject);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Salva dados no cache local
   */
  async cacheData(table: string, key: string, data: any): Promise<void> {
    await this.init();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['data_cache'], 'readwrite');
      const store = transaction.objectStore('data_cache');
      const request = store.put({
        key: `${table}_${key}`,
        table,
        data,
        timestamp: Date.now()
      });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Obtém dados do cache local
   */
  async getCachedData(table: string, key: string): Promise<any | null> {
    await this.init();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['data_cache'], 'readonly');
      const store = transaction.objectStore('data_cache');
      const request = store.get(`${table}_${key}`);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Limpa cache antigo (mais de 1 dia)
   */
  async cleanOldCache(): Promise<void> {
    await this.init();

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(['data_cache'], 'readwrite');
      const store = transaction.objectStore('data_cache');
      const index = store.index('timestamp');
      const request = index.openCursor();

      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      let deleteCount = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          if (cursor.value.timestamp < oneDayAgo) {
            cursor.delete();
            deleteCount++;
          }
          cursor.continue();
        } else {
          console.log(`Cache limpo: ${deleteCount} entradas removidas`);
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineStorage = new OfflineStorage();

