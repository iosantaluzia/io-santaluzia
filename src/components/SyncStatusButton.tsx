import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { syncService, SyncStatus } from '@/utils/syncService';
import { toast } from 'sonner';

export function SyncStatusButton() {
  const [status, setStatus] = useState<SyncStatus>(syncService.getStatus());
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  useEffect(() => {
    syncService.addListener(setStatus);
    return () => {
      syncService.removeListener(setStatus);
    };
  }, []);

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    try {
      const result = await syncService.sync();
      if (result.success) {
        if (result.synced > 0) {
          toast.success(`${result.synced} operação(ões) sincronizada(s)!`);
        } else {
          toast.info('Nenhuma operação pendente para sincronizar.');
        }
      } else {
        toast.error('Erro ao sincronizar. Verifique sua conexão.');
      }
    } catch (error) {
      console.error('Erro na sincronização manual:', error);
      toast.error('Erro ao sincronizar.');
    } finally {
      setIsManualSyncing(false);
    }
  };

  const getStatusIcon = () => {
    if (status.isSyncing || isManualSyncing) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    if (status.isOnline) {
      if (status.pendingOperations > 0) {
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      }
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    return <CloudOff className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = () => {
    if (status.isSyncing || isManualSyncing) {
      return 'Sincronizando...';
    }
    if (!status.isOnline) {
      return 'Modo Offline';
    }
    if (status.pendingOperations > 0) {
      return `${status.pendingOperations} pendente(s)`;
    }
    return 'Sincronizado';
  };

  const getTooltipContent = () => {
    if (!status.isOnline) {
      return 'Você está offline. As alterações serão sincronizadas quando a conexão for restaurada.';
    }
    if (status.pendingOperations > 0) {
      return `${status.pendingOperations} operação(ões) aguardando sincronização. Clique para sincronizar agora.`;
    }
    if (status.lastSync) {
      return `Última sincronização: ${new Date(status.lastSync).toLocaleString('pt-BR')}`;
    }
    return 'Tudo sincronizado!';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSync}
            disabled={status.isSyncing || isManualSyncing || !status.isOnline}
            className="flex items-center gap-2"
          >
            {getStatusIcon()}
            <span className="hidden md:inline">{getStatusText()}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p>{getTooltipContent()}</p>
            {status.pendingOperations > 0 && status.isOnline && (
              <p className="text-xs text-yellow-600">
                Clique para sincronizar agora
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

