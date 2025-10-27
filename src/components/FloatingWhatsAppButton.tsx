
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
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-all duration-300 hover:scale-110"
      style={{
        animation: 'breathe 2s ease-in-out infinite'
      }}
      aria-label="Contato via WhatsApp"
    >
      <img 
        src="/uploads/bd1edf3a-7fd7-44ce-8135-96dbec8a78fa.png" 
        alt="WhatsApp" 
        className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 drop-shadow-lg"
      />
    </a>
  );
};

export default FloatingWhatsAppButton;
