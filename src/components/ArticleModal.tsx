
import React from "react";
import { X, Share2, Download } from "lucide-react";
import html2canvas from "html2canvas";

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  date: string;
}

const ArticleModal = ({ isOpen, onClose, title, content, date }: ArticleModalProps) => {
  const handleShare = async () => {
    const modalContent = document.getElementById('article-modal-content');
    if (!modalContent) return;

    try {
      const canvas = await html2canvas(modalContent, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-medical-muted p-4 flex justify-between items-center">
          <h2 className="text-2xl font-sans font-bold text-medical-primary">{title}</h2>
          <div className="flex gap-2">
            <button 
              onClick={handleShare}
              className="p-2 hover:bg-medical-muted rounded-full transition-colors"
              title="Compartilhar como imagem"
            >
              <Download className="w-6 h-6 text-medical-primary" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-medical-muted rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-medical-primary" />
            </button>
          </div>
        </div>
        
        <div id="article-modal-content" className="p-8 bg-white">
          {/* Logo para compartilhamento */}
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/26442ffb-6359-4e38-a0f7-eaddfc7505f1.png"
              alt="Instituto de Olhos Santa Luzia"
              className="h-16 w-auto"
            />
          </div>
          
          <div className="text-sm text-gray-500 mb-4 text-center">
            {date}
          </div>
          
          <h1 className="text-3xl font-sans font-bold text-medical-primary mb-6 text-center">
            {title}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            {content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t border-medical-muted text-center">
            <p className="text-medical-primary font-medium">
              Instituto de Olhos Santa Luzia
            </p>
            <p className="text-gray-500 text-sm">
              Cuidados oftalmológicos especializados com excelência
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
