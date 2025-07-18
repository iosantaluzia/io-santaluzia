
import React from "react";
import NavigationHeader from "@/components/NavigationHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Footer } from "@/components/ui/footer";
import { Instagram, Facebook } from "lucide-react";

const CorpoClinico = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <NavigationHeader showLogo={true} />
      <div className="max-w-4xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h1 className="text-3xl md:text-5xl font-sans font-bold text-medical-primary mb-8">
          Corpo Clínico
        </h1>
        
        <div className="space-y-16">
          {/* Dra. Fabíola Roque */}
          <div className="bg-white rounded-lg shadow-soft overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 p-8 flex justify-center items-center bg-gradient-to-br from-medical-accent to-medical-muted">
                <img 
                  src="/lovable-uploads/04564b96-e055-469d-8614-41f82a6e22a1.png" 
                  alt="Dra. Fabíola Roque"
                  className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-medium"
                />
              </div>
              <div className="lg:w-2/3 p-8">
                <h2 className="text-2xl font-sans font-bold text-medical-primary mb-4">
                  Dra. Fabíola Roque
                </h2>
                <p className="text-medical-secondary mb-6 text-lg">
                  Especialista em Catarata, Ceratocone, Lentes de Contato e Cirurgia Refrativa.
                </p>
                <div className="space-y-2 text-medical-secondary">
                  <p>• Formação em Medicina pela FFFCMPA</p>
                  <p>• Especialização em Oftalmologia pela UFCSPA</p>
                  <p>• Fellow em Segmento Anterior pela Santa Casa de Misericórdia de Porto Alegre</p>
                  <p>• Fellow em Córnea pelo Bascom Palmer Eye Institute</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dr. Matheus Roque */}
          <div className="bg-white rounded-lg shadow-soft overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/3 p-8 flex justify-center items-center bg-gradient-to-br from-medical-accent to-medical-muted">
                <img 
                  src="/lovable-uploads/1eb4c536-bf5e-4336-9560-481b3a909e6e.png" 
                  alt="Dr. Matheus Roque"
                  className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-medium"
                />
              </div>
              <div className="lg:w-2/3 p-8">
                <h2 className="text-2xl font-sans font-bold text-medical-primary mb-4">
                  Dr. Matheus Roque
                </h2>
                <p className="text-medical-secondary mb-6 text-lg">
                  Especialista em Oftalmologia geral e Oftalmopediatria
                </p>
                <div className="space-y-2 text-medical-secondary">
                  <p>• Formação em Medicina pela Pontifícia Universidade Católica do Paraná</p>
                  <p>• Especialização em Oftalmologia pelo Hospital de Clínicas da UFPR</p>
                </div>
              </div>
            </div>
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

export default CorpoClinico;
