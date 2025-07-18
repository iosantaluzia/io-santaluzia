
import React from "react";
import { X } from "lucide-react";

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  image: string;
}

const ExamModal = ({ isOpen, onClose, title, content, image }: ExamModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-medical-muted p-4 flex justify-between items-center">
          <h2 className="text-2xl font-serif text-medical-primary">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-medical-muted rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-medical-primary" />
          </button>
        </div>
        <div className="p-6">
          <img 
            src={image}
            alt={title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <div className="prose prose-medical max-w-none">
            {content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-medical-secondary mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamModal;
