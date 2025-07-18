
import React from "react";
import NavigationHeader from "@/components/NavigationHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Footer } from "@/components/ui/footer";
import { Instagram, Facebook } from "lucide-react";

const Ceratocone = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <NavigationHeader showLogo={true} />
      <div className="max-w-4xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h1 className="text-3xl md:text-5xl font-sans text-medical-primary mb-8">
              Tratamento do Ceratocone
            </h1>
            <p className="text-lg text-medical-secondary mb-6">
              O ceratocone é uma condição ocular que causa o afinamento e a deformação da córnea, levando à visão distorcida e, em alguns casos, à perda significativa da visão.
            </p>
            <p className="text-medical-secondary mb-6">
              Com o tempo, a córnea assume um formato de cone, o que afeta a forma como a luz é focalizada na retina.
            </p>
          </div>
          <div className="relative">
            <img 
              src="/lovable-uploads/cf83b478-63b6-4cc7-a3c1-a4b1eb5029fb.png"
              alt="Lente de contato para ceratocone"
              className="rounded-lg shadow-medium w-full"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-soft mb-12">
          <h2 className="text-2xl font-sans text-medical-primary mb-6">
            Complicações e Sintomas
          </h2>
          <p className="text-medical-secondary mb-6">
            As complicações mais comuns do ceratocone incluem miopia e astigmatismo, além de dificuldades com o uso de lentes de contato convencionais.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-medical-primary mb-4">
                Sinais e Sintomas:
              </h3>
              <ul className="list-disc list-inside text-medical-secondary space-y-2">
                <li>Visão distorcida e embaçada</li>
                <li>Mudanças frequentes no grau dos óculos</li>
                <li>Sensibilidade à luz</li>
                <li>Halos ao redor das luzes</li>
                <li>Diplopia monocular (visão dupla em um olho)</li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="/lovable-uploads/ca6a3fb8-8270-45cf-97e5-a67feca68a3e.png"
                alt="Vista detalhada do ceratocone"
                className="rounded-lg shadow-soft"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-medical-accent to-medical-muted p-8 rounded-lg mb-12">
          <h3 className="text-2xl font-sans text-medical-primary mb-6 text-center">
            Opções de Tratamento
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-medical-primary mb-2">Crosslinking Corneano</h4>
                <p className="text-sm text-medical-primary">
                  Procedimento que fortalece as fibras de colágeno da córnea, estabilizando a progressão da doença.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-medical-primary mb-2">Lentes de Contato Especiais</h4>
                <p className="text-sm text-medical-primary">
                  Lentes rígidas ou semi-rígidas especialmente desenhadas para ceratocone.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-medical-primary mb-2">Anel Intraestromal</h4>
                <p className="text-sm text-medical-primary">
                  Implante de segmentos de anel para regularizar a curvatura corneana.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-medical-primary mb-2">Transplante de Córnea</h4>
                <p className="text-sm text-medical-primary">
                  Em casos avançados, pode ser necessário o transplante parcial ou total da córnea.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-soft text-center">
          <h3 className="text-2xl font-sans text-medical-primary mb-4">
            Acompanhamento é Fundamental
          </h3>
          <p className="text-medical-primary max-w-4xl mx-auto mb-6">
            O tratamento varia conforme a gravidade da doença. Em estágios iniciais, o uso de lentes de contato especiais pode corrigir a visão, e pode ser necessário a realização de crosslinking para estabilização do ceratocone.
          </p>
          <p className="text-medical-primary max-w-4xl mx-auto">
            É fundamental o acompanhamento regular com um oftalmologista para monitorar a progressão da doença e determinar o tratamento adequado.
          </p>
        </div>
      </div>

      {/* Botão de agendamento */}
      <div className="py-12 bg-background">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <WhatsAppButton />
        </div>
      </div>

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

export default Ceratocone;
