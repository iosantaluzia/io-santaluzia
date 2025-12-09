import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileId?: string;
}

/**
 * Faz upload de um arquivo de exame para o Supabase Storage
 * e cria o registro no banco de dados
 */
export async function uploadExamFile(
  file: File,
  patientExamId: string,
  patientId: string,
  uploadedBy?: string
): Promise<UploadResult> {
  try {
    // Validar arquivo
    if (!file) {
      throw new Error('Arquivo não fornecido');
    }

    // Validar tamanho (máximo 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Tamanho máximo: 50MB');
    }

    // Validar tipo de arquivo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não permitido. Use PDF, JPG ou PNG');
    }

    // 1. Preparar nome do arquivo único
    const fileExt = file.name.split('.').pop() || 'bin';
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${patientId}/${patientExamId}/${timestamp}_${sanitizedFileName}`;

    // 2. Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('exam-files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
    }

    // 3. Obter URL pública do arquivo
    const { data: { publicUrl } } = supabase.storage
      .from('exam-files')
      .getPublicUrl(fileName);

    // 4. Salvar referência no banco de dados
    const { data: fileRecord, error: dbError } = await supabase
      .from('exam_files')
      .insert({
        patient_exam_id: patientExamId,
        file_name: file.name,
        file_path: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: uploadedBy || null
      })
      .select()
      .single();

    if (dbError) {
      // Se falhar ao salvar no banco, tentar remover o arquivo do storage
      await supabase.storage
        .from('exam-files')
        .remove([fileName]);
      
      throw new Error(`Erro ao salvar registro: ${dbError.message}`);
    }

    return {
      success: true,
      url: publicUrl,
      fileId: fileRecord.id
    };
  } catch (error: any) {
    console.error('Erro ao fazer upload do exame:', error);
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao fazer upload'
    };
  }
}

/**
 * Remove um arquivo de exame do Supabase Storage e do banco de dados
 */
export async function deleteExamFile(fileId: string, filePath: string): Promise<boolean> {
  try {
    // Extrair o caminho do arquivo do URL
    const url = new URL(filePath);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts.slice(pathParts.indexOf('exam-files') + 1).join('/');

    // Remover do storage
    const { error: storageError } = await supabase.storage
      .from('exam-files')
      .remove([fileName]);

    if (storageError) {
      console.error('Erro ao remover do storage:', storageError);
      // Continuar mesmo se falhar no storage
    }

    // Remover do banco de dados
    const { error: dbError } = await supabase
      .from('exam_files')
      .delete()
      .eq('id', fileId);

    if (dbError) {
      throw new Error(`Erro ao remover registro: ${dbError.message}`);
    }

    return true;
  } catch (error: any) {
    console.error('Erro ao deletar arquivo:', error);
    return false;
  }
}

/**
 * Busca todos os arquivos de um exame
 */
export async function getExamFiles(patientExamId: string) {
  try {
    const { data, error } = await supabase
      .from('exam_files')
      .select('*')
      .eq('patient_exam_id', patientExamId)
      .order('uploaded_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar arquivos:', error);
    return [];
  }
}

