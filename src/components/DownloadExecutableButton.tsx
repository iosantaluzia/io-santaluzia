import React, { useState, useEffect } from 'react';
import { Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { downloadExecutable, getExecutableDownloadUrl } from '@/utils/executableDownload';

export function DownloadExecutableButton() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [downloadAvailable, setDownloadAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar se o executável está disponível
    const checkAvailability = async () => {
      try {
        const url = await getExecutableDownloadUrl();
        setDownloadAvailable(url !== null);
      } catch (error) {
        console.error('Erro ao verificar disponibilidade:', error);
        setDownloadAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAvailability();
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadComplete(false);

    try {
      const success = await downloadExecutable();
      
      if (success) {
        setDownloadComplete(true);
        toast.success('Download iniciado com sucesso!');
        
        // Resetar após 2 segundos
        setTimeout(() => {
          setDownloadComplete(false);
          setIsDownloading(false);
        }, 2000);
      } else {
        throw new Error('Não foi possível iniciar o download');
      }
    } catch (error: any) {
      console.error('Erro ao fazer download:', error);
      toast.error('Erro ao fazer download. Verifique se o arquivo está disponível.');
      setIsDownloading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          title="Baixar aplicativo desktop"
        >
          <Download className="h-4 w-4" />
          <span className="hidden md:inline">Baixar App</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Download do Aplicativo Desktop</DialogTitle>
          <DialogDescription>
            Baixe o aplicativo administrativo para instalar em outros computadores.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Informações do Aplicativo</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Nome:</strong> Santa Luzia Admin</li>
              <li>• <strong>Tamanho:</strong> ~185 MB</li>
              <li>• <strong>Sistema:</strong> Windows 10/11 (64-bit)</li>
              <li>• <strong>Requisitos:</strong> Conexão com internet</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Importante</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• O aplicativo precisa de conexão com internet</li>
              <li>• Use as mesmas credenciais do painel web</li>
              <li>• Arquivos são sincronizados automaticamente</li>
            </ul>
          </div>

          {isChecking ? (
            <Button disabled className="w-full flex items-center justify-center gap-2" size="lg">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verificando disponibilidade...</span>
            </Button>
          ) : !downloadAvailable ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-1">Arquivo não disponível</h4>
                  <p className="text-sm text-red-800">
                    O executável ainda não foi enviado para o servidor. 
                    Entre em contato com o administrador do sistema.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleDownload}
              disabled={isDownloading || downloadComplete}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Preparando download...</span>
                </>
              ) : downloadComplete ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Download Iniciado!</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Baixar Executável</span>
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

