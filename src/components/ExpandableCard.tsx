
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableCardProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
}

const ExpandableCard = ({ title, content, icon }: ExpandableCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-soft border border-medical-muted overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-medical-muted/30 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {icon && <div className="text-medical-primary">{icon}</div>}
          <h3 className="text-lg font-semibold text-medical-primary">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-medical-primary" />
        ) : (
          <ChevronDown className="h-5 w-5 text-medical-primary" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-6 pb-6">
          <p className="text-gray-700 leading-relaxed">{content}</p>
        </div>
      )}
    </div>
  );
};

export default ExpandableCard;
