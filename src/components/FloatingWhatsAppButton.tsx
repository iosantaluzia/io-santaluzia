
import React from 'react';

const FloatingWhatsAppButton = () => {
  const phoneNumber = "5566997215000";
  const message = "Olá! Gostaria de agendar uma consulta no Instituto de Olhos Santa Luzia.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 transition-all duration-300 hover:scale-110"
      style={{
        animation: 'breathe 2s ease-in-out infinite'
      }}
      aria-label="Contato via WhatsApp"
    >
      <img 
        src="/lovable-uploads/bd1edf3a-7fd7-44ce-8135-96dbec8a78fa.png" 
        alt="WhatsApp" 
        className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg"
      />
    </a>
  );
};

export default FloatingWhatsAppButton;
