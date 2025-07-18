
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  className?: string;
  variant?: "default" | "outline";
}

const WhatsAppButton = ({ className = "", variant = "default" }: WhatsAppButtonProps) => {
  const phoneNumber = "556699721-5000";
  const message = "Olá! Gostaria de agendar uma consulta no Instituto de Olhos Santa Luzia.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Button
      asChild
      size="lg"
      variant={variant}
      className={`bg-medical-primary hover:bg-medical-primary/90 text-white rounded-full px-8 py-4 ${className}`}
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/bd1edf3a-7fd7-44ce-8135-96dbec8a78fa.png" 
          alt="WhatsApp" 
          className="w-6 h-6"
        />
        Agende sua Consulta
      </a>
    </Button>
  );
};

export default WhatsAppButton;
