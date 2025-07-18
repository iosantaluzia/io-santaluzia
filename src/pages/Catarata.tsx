
import React from "react";
import NavigationHeader from "@/components/NavigationHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Footer } from "@/components/ui/footer";
import { Instagram, Facebook } from "lucide-react";

const Catarata = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <NavigationHeader showLogo={true} />
      <div className="max-w-4xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h1 className="text-3xl md:text-5xl font-sans text-medical-primary mb-8">
              Cirurgia de Catarata
            </h1>
            <p className="text-lg text-medical-secondary mb-6">
              A catarata é uma condição natural que ocorre com o envelhecimento, quando o cristalino do olho, que é responsável por focar a visão, começa a se tornar opaco.
            </p>
            <p className="text-medical-secondary mb-8">
              Isso pode causar visão embaçada, dificuldade para enxergar à noite, sensibilidade à luz, e em casos avançados pode levar à cegueira.
            </p>
          </div>
          <div className="relative">
            <img 
              src="/lovable-uploads/6f0e2320-1b39-403a-ab68-8eeffe8dfc36.png"
              alt="Cirurgia de Catarata"
              className="rounded-lg shadow-medium w-full"
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-medical-accent to-medical-muted p-8 rounded-lg mb-12">
          <h2 className="text-2xl font-sans text-medical-primary mb-6 text-center">
            Tratamento Eficaz
          </h2>
          <p className="text-medical-secondary text-center max-w-3xl mx-auto">
            A boa notícia é que, para corrigir a catarata, realizamos uma cirurgia indolor, precisa e segura, onde o cristalino opaco é removido e substituído por uma lente artificial, restaurando a visão de forma eficaz.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-soft text-center">
            <div className="w-16 h-16 bg-medical-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-sans text-medical-primary mb-4">Avaliação</h3>
            <p className="text-sm text-medical-secondary">
              Exames detalhados para determinar o melhor momento para a cirurgia
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-soft text-center">
            <div className="w-16 h-16 bg-medical-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-sans text-medical-primary mb-4">Cirurgia</h3>
            <p className="text-sm text-medical-secondary">
              Procedimento indolor, preciso e seguro com lentes intraoculares de qualidade
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-soft text-center">
            <div className="w-16 h-16 bg-medical-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-sans text-medical-primary mb-4">Recuperação</h3>
            <p className="text-sm text-medical-secondary">
              Acompanhamento pós-operatório para garantir a melhor recuperação
            </p>
          </div>
        </div>
      </div>

      {/* Botão de agendamento */}
      <div className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <WhatsAppButton />
        </div>
      </div>

      {/* Botão flutuante WhatsApp */}
      <FloatingWhatsAppButton />

      {/* Footer */}
      <Footer
        logo={
          <img 
            src="/lovable-uploads/logoimg.png" 
            alt="Instituto de Olhos Santa Luzia" 
            className="h-10 w-10 brightness-0 invert"
          />
        }
        brandName="Instituto de Olhos Santa Luzia"
        socialLinks={[
          {
            icon: <Instagram className="h-5 w-5" />,
            href: "https://www.instagram.com/io.santaluzia/",
            label: "Instagram",
          },
          {
            icon: <Facebook className="h-5 w-5" />,
            href: "https://www.facebook.com/institudodeolhossantaluzia",
            label: "Facebook",
          },
        ]}
        mainLinks={[
          { href: "/instituto", label: "O Instituto" },
          { href: "/corpo-clinico", label: "Corpo Clínico" },
          { href: "/exames", label: "Exames" },
          { href: "/catarata", label: "Catarata" },
          { href: "/cirurgia-refrativa", label: "Cirurgia Refrativa" },
          { href: "/ceratocone", label: "Ceratocone" },
          { href: "/artigos", label: "Artigos" },
        ]}
        legalLinks={[
          { href: "#", label: "Política de Privacidade" },
          { href: "#", label: "Termos de Uso" },
          { href: "#", label: "LGPD" },
        ]}
        copyright={{
          text: "© 2024 Instituto de Olhos Santa Luzia",
          license: "Avenida dos Tarumãs, 930 - Sinop/MT - CEP: 78550-001 | +55 66 99721-5000",
        }}
      />
    </div>
  );
};

export default Catarata;
