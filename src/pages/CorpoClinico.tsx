
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/ui/footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Instagram, Facebook } from 'lucide-react';

const CorpoClinico = () => {
  return (
    <div className="min-h-screen">
      <NavigationHeader showLogo={true} />
      <main className="pt-20 md:pt-32 pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-sans text-medical-primary mb-4 md:mb-8">
              Corpo Clínico
            </h1>
            <p className="text-base md:text-lg text-medical-secondary max-w-3xl mx-auto px-4">
              Nossa equipe é formada por oftalmologistas experientes e especializados nas mais 
              diversas áreas da medicina ocular, garantindo um atendimento de alta qualidade.
            </p>
          </div>

          <div className="space-y-16">
            {/* Dra. Fabíola Roque */}
            <div className="bg-white rounded-lg shadow-soft overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 p-6 md:p-8 flex justify-center items-center bg-gradient-to-br from-medical-accent to-medical-muted">
                  <img
                    src="/uploads/drafabiola.png"
                    alt="Dra. Fabíola Roque"
                    className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-full border-4 border-white shadow-medium bg-amber-50"
                  />
                </div>
                <div className="lg:w-2/3 p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-sans font-bold text-medical-primary mb-3 md:mb-4">
                    Dra. Fabíola Roque
                  </h2>
                  <p className="text-medical-secondary mb-4 md:mb-6 text-base md:text-lg">
                    Especialista em Catarata, Ceratocone, Lentes de Contato e Cirurgia Refrativa.
                  </p>
                  <div className="space-y-2 text-sm md:text-base text-medical-secondary">
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
                <div className="lg:w-1/3 p-6 md:p-8 flex justify-center items-center bg-gradient-to-br from-medical-accent to-medical-muted">
                  <img
                    src="/uploads/drmatheus.png"
                    alt="Dr. Matheus Roque"
                    className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-full border-4 border-white shadow-medium bg-amber-50"
                  />
                </div>
                <div className="lg:w-2/3 p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-sans font-bold text-medical-primary mb-3 md:mb-4">
                    Dr. Matheus Roque
                  </h2>
                  <p className="text-medical-secondary mb-4 md:mb-6 text-base md:text-lg">
                    Especialista em Oftalmologia geral e Oftalmopediatria
                  </p>
                  <div className="space-y-2 text-sm md:text-base text-medical-secondary">
                    <p>• Formação em Medicina pela Pontifícia Universidade Católica do Paraná</p>
                    <p>• Especialização em Oftalmologia pelo Hospital de Clínicas da UFPR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8 mt-8 md:mt-12 max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold text-medical-primary mb-3 md:mb-4">
              Compromisso com a Excelência
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4 md:mb-6">
              Nossos profissionais estão em constante atualização, participando de congressos 
              e cursos de especialização para oferecer sempre os melhores tratamentos disponíveis.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Acreditamos que o cuidado humanizado, aliado à competência técnica, é fundamental 
              para o sucesso dos tratamentos e a satisfação dos nossos pacientes.
            </p>
          </div>
        </div>
      </main>
      <Footer
        logo={<img src="/uploads/26442ffb-6359-4e38-a0f7-eaddfc7505f1.png" alt="Instituto de Olhos Santa Luzia" className="h-[134px] w-auto brightness-0 invert" />}
        brandName=""
        socialLinks={[
          { icon: <Instagram className="h-[30px] w-[30px]" />, href: "https://www.instagram.com/io.santaluzia/", label: "Instagram" },
          { icon: <Facebook className="h-[30px] w-[30px]" />, href: "https://www.facebook.com/institudodeolhossantaluzia", label: "Facebook" }
        ]}
        mainLinks={[
          { href: "/instituto", label: "O Instituto" },
          { href: "/corpo-clinico", label: "Corpo Clínico" },
          { href: "/exames", label: "Exames" },
          { href: "/catarata", label: "Catarata" },
          { href: "/cirurgia-refrativa", label: "Cirurgia Refrativa" },
          { href: "/ceratocone", label: "Ceratocone" },
          { href: "/artigos", label: "Artigos" }
        ]}
        legalLinks={[]}
        copyright={{
          text: "",
          license: "Avenida dos Tarumãs, 930 - Sinop/MT - CEP: 78550-001 | +55 66 99721-5000"
        }}
      />
      <FloatingWhatsAppButton />
    </div>
  );
};

export default CorpoClinico;
