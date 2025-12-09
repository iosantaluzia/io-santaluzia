import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadExamFile } from '@/utils/examUpload';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface ExamFileUploadProps {
  patientExamId: string;
  patientId: string;
  onUploadSuccess?: () => void;
}

export function ExamFileUpload({ patientExamId, patientId, onUploadSuccess }: ExamFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { appUser } = useAuth();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(file => 
        uploadExamFile(file, patientExamId, patientId, appUser?.username)
      );

      const results = await Promise.all(uploadPromises);
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.length - successCount;

      if (successCount > 0) {
        toast.success(`${successCount} arquivo(s) enviado(s) com sucesso!`);
        onUploadSuccess?.();
      }

      if (errorCount > 0) {
        toast.error(`${errorCount} arquivo(s) falharam ao enviar`);
      }
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao fazer upload dos arquivos');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive 
            ? 'border-bege-principal bg-bege-principal/10' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          id="exam-file-upload"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.gif,application/pdf,image/*"
          onChange={handleFileInput}
          disabled={isUploading}
        />
        <label htmlFor="exam-file-upload" className="cursor-pointer block">
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-bege-principal animate-spin mb-4" />
              <p className="text-gray-600">Enviando arquivos...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-700 font-medium mb-2">
                Arraste e solte arquivos de exames aqui
              </p>
              <p className="text-sm text-gray-500 mb-4">ou</p>
              <Button type="button" variant="outline">
                Selecionar Arquivos
              </Button>
              <p className="text-xs text-gray-500 mt-4">
                Formatos suportados: PDF, JPG, PNG, GIF (máx. 50MB por arquivo)
              </p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}

