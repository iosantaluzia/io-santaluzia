
import { MessageCircle } from "lucide-react";
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
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="mr-2 h-5 w-5" />
        Agende sua Consulta
      </a>
    </Button>
  );
};

export default WhatsAppButton;
