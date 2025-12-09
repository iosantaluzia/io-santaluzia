import { supabase } from '@/integrations/supabase/client';

/**
 * Faz upload do executável para o Supabase Storage
 * Deve ser executado manualmente após cada build
 */
export async function uploadExecutableToStorage(filePath: string): Promise<string | null> {
  try {
    // Ler o arquivo do sistema de arquivos (isso só funciona no servidor/Node.js)
    // Para uso em produção, você precisaria fazer upload manualmente ou via script
    
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error('Não foi possível ler o arquivo');
    }
    
    const blob = await response.blob();
    const fileName = 'Santa-Luzia-Admin.exe';
    
    // Upload para Supabase Storage
    const { data, error } = await supabase.storage
      .from('public-downloads') // Bucket para downloads públicos
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw error;
    }

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('public-downloads')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error: any) {
    console.error('Erro ao fazer upload do executável:', error);
    return null;
  }
}

/**
 * Obtém a URL de download do executável
 */
export async function getExecutableDownloadUrl(): Promise<string | null> {
  try {
    // Tentar obter do Supabase Storage
    const { data: { publicUrl } } = supabase.storage
      .from('public-downloads')
      .getPublicUrl('Santa-Luzia-Admin.exe');

    // Verificar se o arquivo existe fazendo uma requisição HEAD
    const response = await fetch(publicUrl, { method: 'HEAD' });
    if (response.ok) {
      return publicUrl;
    }

    return null;
  } catch (error) {
    console.error('Erro ao obter URL de download:', error);
    return null;
  }
}

/**
 * Faz download do executável diretamente
 */
export async function downloadExecutable(): Promise<boolean> {
  try {
    const url = await getExecutableDownloadUrl();
    
    if (!url) {
      throw new Error('URL de download não disponível');
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Erro ao baixar o arquivo');
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'Santa-Luzia-Admin.exe';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (error: any) {
    console.error('Erro ao fazer download:', error);
    return false;
  }
}

