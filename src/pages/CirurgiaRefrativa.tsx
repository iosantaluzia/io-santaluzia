
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/ui/footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Instagram, Facebook, Eye, Zap, Heart, Star } from 'lucide-react';

const CirurgiaRefrativa = () => {
  const benefits = [
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Liberdade Visual",
      description: "Livre-se dos óculos e lentes de contato"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Procedimento Rápido",
      description: "Cirurgia realizada em minutos"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Qualidade de Vida",
      description: "Melhora significativa no dia a dia"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Resultados Duradouros",
      description: "Correção permanente dos erros refrativos"
    }
  ];

  const conditions = [
    {
      name: "Miopia",
      description: "Dificuldade para enxergar objetos distantes",
      correction: "Laser modela a córnea para reduzir a curvatura"
    },
    {
      name: "Hipermetropia",
      description: "Dificuldade para enxergar objetos próximos",
      correction: "Laser aumenta a curvatura central da córnea"
    },
    {
      name: "Astigmatismo",
      description: "Visão embaçada devido à curvatura irregular da córnea",
      correction: "Laser corrige as irregularidades da superfície corneana"
    }
  ];

  return (
    <div className="min-h-screen">
      <NavigationHeader showLogo={true} />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-medical-primary mb-6">
                Cirurgia Refrativa
              </h1>
              <p className="text-lg text-medical-secondary mb-8">
                Liberdade e segurança em um só procedimento. A cirurgia refrativa oferece 
                correção definitiva para miopia, hipermetropia e astigmatismo com tecnologia 
                laser de última geração.
              </p>
              <div className="bg-medical-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-medical-primary mb-3">
                  Tecnologia LASIK
                </h3>
                <p className="text-medical-secondary">
                  Utilizamos a mais avançada tecnologia laser para remodelar a córnea com 
                  precisão microscópica, proporcionando resultados excepcionais.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/lovable-uploads/87125f62-3c4e-4acc-970b-25f7eb624ae5.png"
                alt="Cirurgia Refrativa"
                className="rounded-lg shadow-medium w-full"
              />
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-medical-primary text-center mb-12">
              Benefícios da Cirurgia Refrativa
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 text-center"
                >
                  <div className="text-medical-primary mb-4 flex justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-medical-primary mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-medical-secondary text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Conditions Section */}
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-12">
            <h2 className="text-3xl font-serif font-bold text-medical-primary mb-8 text-center">
              Condições Tratadas
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {conditions.map((condition, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-xl font-semibold text-medical-primary mb-4">
                    {condition.name}
                  </h3>
                  <p className="text-medical-secondary mb-4">
                    {condition.description}
                  </p>
                  <div className="bg-medical-muted/10 p-4 rounded-lg">
                    <h4 className="font-medium text-medical-primary mb-2">Como Corrigimos:</h4>
                    <p className="text-sm text-medical-secondary">
                      {condition.correction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process Section */}
          <div className="bg-medical-muted/10 rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-serif font-bold text-medical-primary mb-8 text-center">
              Processo da Cirurgia
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-medical-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-medical-primary mb-3">
                  Avaliação
                </h3>
                <p className="text-medical-secondary text-sm">
                  Exames detalhados para verificar candidatura à cirurgia.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-medical-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-medical-primary mb-3">
                  Preparação
                </h3>
                <p className="text-medical-secondary text-sm">
                  Anestesia tópica e posicionamento para o procedimento.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-medical-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-medical-primary mb-3">
                  Cirurgia
                </h3>
                <p className="text-medical-secondary text-sm">
                  Aplicação precisa do laser na córnea em poucos minutos.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-medical-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-lg font-semibold text-medical-primary mb-3">
                  Recuperação
                </h3>
                <p className="text-medical-secondary text-sm">
                  Acompanhamento pós-operatório para garantir os melhores resultados.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <h2 className="text-3xl font-serif font-bold text-medical-primary mb-8 text-center">
              Perguntas Frequentes
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-medical-primary mb-2">
                  Quem pode fazer cirurgia refrativa?
                </h3>
                <p className="text-medical-secondary">
                  Candidatos com mais de 21 anos, grau estável há pelo menos 1 ano e córnea com espessura adequada.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-medical-primary mb-2">
                  A cirurgia é segura?
                </h3>
                <p className="text-medical-secondary">
                  Sim, é um procedimento muito seguro com alta taxa de sucesso e milhões de cirurgias realizadas mundialmente.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-medical-primary mb-2">
                  Quando posso voltar às atividades normais?
                </h3>
                <p className="text-medical-secondary">
                  A maioria dos pacientes retorna às atividades normais em 24-48 horas após a cirurgia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer
        logo={<img src="/lovable-uploads/26442ffb-6359-4e38-a0f7-eaddfc7505f1.png" alt="Instituto de Olhos Santa Luzia" className="h-12 w-auto brightness-0 invert" />}
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
          text: "© 2024 Instituto de Olhos Santa Luzia",
          license: "Avenida dos Tarumãs, 930 - Sinop/MT - CEP: 78550-001 | +55 66 99721-5000"
        }}
      />
      <FloatingWhatsAppButton />
    </div>
  );
};

export default CirurgiaRefrativa;
