
import React from "react";
import NavigationHeader from "@/components/NavigationHeader";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Footer } from "@/components/ui/footer";
import { Instagram, Facebook } from "lucide-react";

const CirurgiaRefrativa = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <NavigationHeader showLogo={true} />
      <div className="max-w-4xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h1 className="text-3xl md:text-5xl font-sans text-medical-primary mb-8">
              Cirurgia Refrativa
            </h1>
            <p className="text-lg text-medical-secondary max-w-4xl mx-auto mb-8">
              A cirurgia refrativa tem como objetivo reestabelecer a qualidade de vida dos pacientes e proporcionar a liberdade de óculos e lentes de contato.
            </p>
          </div>
          <div className="relative">
            <img 
              src="/lovable-uploads/9ae22b05-d770-4e0d-b143-fbc9278106e6.png"
              alt="Cirurgia Refrativa"
              className="rounded-lg shadow-medium w-full"
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-soft mb-12">
          <h2 className="text-2xl font-sans text-medical-primary mb-6 text-center">
            Tecnologia de Ponta
          </h2>
          <p className="text-medical-secondary text-center max-w-4xl mx-auto mb-6">
            No Instituto de Olhos Santa Luzia contamos com técnicas avançadas e atualmente o mais novo Excimer Laser de Mato Grosso, o MEL 90 da Zeiss, realizando procedimentos para correção de problemas como hipermetropia, miopia, astigmatismo e presbiopia.
          </p>
          <p className="text-medical-secondary text-center max-w-4xl mx-auto">
            A cirurgia tem recuperação rápida, com resultados visíveis em pouco tempo, proporcionando maior conforto e liberdade para o paciente no seu dia a dia.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-medical-accent to-medical-muted p-8 rounded-lg">
          <h3 className="text-2xl font-sans text-medical-primary mb-6 text-center">
            Benefícios da Cirurgia Refrativa
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-medical-primary rounded-full"></span>
                <span className="text-medical-primary">Liberdade dos óculos e lentes</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-medical-primary rounded-full"></span>
                <span className="text-medical-primary">Procedimento rápido e seguro</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-medical-primary rounded-full"></span>
                <span className="text-medical-primary">Recuperação visual rápida</span>
              </li>
            </ul>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-medical-primary rounded-full"></span>
                <span className="text-medical-primary">Melhora na qualidade de vida</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-medical-primary rounded-full"></span>
                <span className="text-medical-primary">Tecnologia de última geração</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-medical-primary rounded-full"></span>
                <span className="text-medical-primary">Resultados duradouros</span>
              </li>
            </ul>
          </div>
          <p className="text-medical-primary text-center mt-8 font-medium">
            Com ela é possível reduzir ou até mesmo eliminar a dependência de óculos ou lentes de contato, trazendo uma nova perspectiva de vida com mais clareza e liberdade.
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

export default CirurgiaRefrativa;
