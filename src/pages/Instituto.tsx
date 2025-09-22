
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/ui/footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";

const Instituto = () => {
  return (
    <div className="min-h-screen">
      <NavigationHeader showLogo={true} />
      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div>
            <h1 className="text-3xl md:text-5xl font-sans text-medical-primary mb-8 text-center">
              O Instituto
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 text-center">
                Mais de uma década dedicada ao cuidado especializado da sua visão
              </p>
              
              <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
                <div>
                  <h2 className="text-2xl font-semibold text-medical-primary mb-4">Nossa Missão</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Proporcionar cuidados oftalmológicos de excelência, utilizando tecnologia de ponta 
                    e uma abordagem humanizada para preservar e restaurar a visão dos nossos pacientes.
                  </p>
                </div>
                <div className="bg-medical-muted rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-medical-primary mb-4">Nossos Valores</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Excelência no atendimento</li>
                    <li>• Inovação tecnológica</li>
                    <li>• Cuidado humanizado</li>
                    <li>• Ética profissional</li>
                  </ul>
                </div>
              </div>

              <div className="bg-medical-muted rounded-2xl p-8 mb-12">
                <h2 className="text-2xl font-semibold text-medical-primary mb-6 text-center">
                  Por que escolher o Instituto?
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-medical-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">15+</span>
                    </div>
                    <h3 className="font-semibold text-medical-primary mb-2">Anos de Experiência</h3>
                    <p className="text-sm text-muted-foreground">
                      Mais de uma década cuidando da saúde ocular
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-medical-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">10k+</span>
                    </div>
                    <h3 className="font-semibold text-medical-primary mb-2">Pacientes Atendidos</h3>
                    <p className="text-sm text-muted-foreground">
                      Milhares de vidas transformadas
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-medical-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-medical-primary">95%</span>
                    </div>
                    <h3 className="font-semibold text-medical-primary mb-2">Satisfação</h3>
                    <p className="text-sm text-muted-foreground">
                      Alta taxa de satisfação dos pacientes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer
        logo={<img src="/lovable-uploads/logogrande-removebg-preview.png" alt="Instituto de Olhos Santa Luzia" className="h-10 w-10 brightness-0 invert" />}
        brandName=""
        socialLinks={[
          { icon: <span>📷</span>, href: "https://www.instagram.com/io.santaluzia/", label: "Instagram" },
          { icon: <span>📘</span>, href: "https://www.facebook.com/institudodeolhossantaluzia", label: "Facebook" }
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
          text: "© 2024 Instituto de Olhos Santa Luzia",
          license: "Avenida dos Tarumãs, 930 - Sinop/MT - CEP: 78550-001 | +55 66 99721-5000"
        }}
      />
      <FloatingWhatsAppButton />
    </div>
  );
};

export default Instituto;
