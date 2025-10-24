import { X, Download } from 'lucide-react';

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
  fileName: string;
}

const PDFModal = ({ isOpen, onClose, title, pdfUrl, fileName }: PDFModalProps) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-medical-muted p-4 flex justify-between items-center">
          <h2 className="text-2xl font-sans font-bold text-medical-primary">{title}</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 bg-medical-primary text-white px-4 py-2 rounded-lg hover:bg-medical-secondary transition-colors text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              Baixar PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* PDF Content */}
        <div className="h-[calc(90vh-80px)]">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title={title}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFModal;
