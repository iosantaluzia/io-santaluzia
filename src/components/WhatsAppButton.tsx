
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  className?: string;
  variant?: "default" | "outline";
}

const WhatsAppButton = ({ className = "", variant = "default" }: WhatsAppButtonProps) => {
  const phoneNumber = "5566997215000";
  const message = "Olá! Gostaria de agendar uma consulta no Instituto de Olhos Santa Luzia.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <Button
      asChild
      size="lg"
      variant={variant}
      className={`bg-medical-primary hover:bg-medical-primary/90 text-white rounded-lg px-8 py-4 font-semibold ${className}`}
    >
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        AGENDE UMA CONSULTA
      </a>
    </Button>
  );
};

export default WhatsAppButton;
