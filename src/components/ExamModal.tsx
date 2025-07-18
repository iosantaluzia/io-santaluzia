
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
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-medical-muted p-4 flex justify-between items-center">
          <h2 className="text-2xl font-sans text-gray-800">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-medical-muted rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-medical-primary" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-1">
              <img 
                src={image}
                alt={title}
                className="w-full h-auto object-contain rounded-lg bg-gray-50 p-4"
              />
            </div>
            <div className="md:col-span-2">
              <div className="prose prose-medical max-w-none">
                {content.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamModal;
