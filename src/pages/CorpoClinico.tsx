
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/ui/footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Instagram, Facebook } from 'lucide-react';

const CorpoClinico = () => {
  return (
    <div className="min-h-screen">
      <NavigationHeader showLogo={true} />
      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-sans text-medical-primary mb-8">
              Corpo Clínico
            </h1>
            <p className="text-lg text-medical-secondary max-w-3xl mx-auto">
              Nossa equipe é formada por oftalmologistas experientes e especializados nas mais 
              diversas áreas da medicina ocular, garantindo um atendimento de alta qualidade.
            </p>
          </div>

          <div className="space-y-16">
            {/* Dra. Fabíola Roque */}
            <div className="bg-white rounded-lg shadow-soft overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/3 p-8 flex justify-center items-center bg-gradient-to-br from-medical-accent to-medical-muted">
                  <img
                    src="/uploads/fabiola.png"
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
                    src="/uploads/matheus.png"
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

          <div className="bg-white rounded-2xl shadow-soft p-8 mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-medical-primary mb-4">
              Compromisso com a Excelência
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Nossos profissionais estão em constante atualização, participando de congressos 
              e cursos de especialização para oferecer sempre os melhores tratamentos disponíveis.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Acreditamos que o cuidado humanizado, aliado à competência técnica, é fundamental 
              para o sucesso dos tratamentos e a satisfação dos nossos pacientes.
            </p>
          </div>
        </div>
      </main>
      <Footer
        logo={<img src="/uploads/26442ffb-6359-4e38-a0f7-eaddfc7505f1.png" alt="Instituto de Olhos Santa Luzia" className="h-28 w-auto brightness-0 invert mx-auto" />}
        brandName=""
        socialLinks={[
          { icon: <Instagram className="h-5 w-5" />, href: "https://www.instagram.com/io.santaluzia/", label: "Instagram" },
          { icon: <Facebook className="h-5 w-5" />, href: "https://www.facebook.com/institudodeolhossantaluzia", label: "Facebook" }
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
