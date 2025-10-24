
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/ui/footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Instagram, Facebook, Eye, Shield, Zap, CheckCircle } from 'lucide-react';

const Ceratocone = () => {
  const treatments = [
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Crosslinking",
      description: "Fortalecimento da córnea para estabilizar a progressão da doença"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Anéis Intraestromais",
      description: "Implante de anéis para regularizar a curvatura corneana"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lentes de Contato Especiais",
      description: "Lentes rígidas ou esclerais para correção visual"
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Transplante de Córnea",
      description: "Em casos avançados, quando outros tratamentos não são suficientes"
    }
  ];

  const stages = [
    {
      stage: "Inicial",
      symptoms: "Visão levemente embaçada, sensibilidade à luz",
      treatment: "Óculos ou lentes de contato gelatinosas"
    },
    {
      stage: "Moderado",
      symptoms: "Astigmatismo irregular, distorção de imagens",
      treatment: "Lentes de contato rígidas, crosslinking"
    },
    {
      stage: "Avançado",
      symptoms: "Afinamento da córnea, cicatrizes",
      treatment: "Anéis intraestromais, transplante de córnea"
    }
  ];

  return (
    <div className="min-h-screen">
      <NavigationHeader showLogo={true} />
      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h1 className="text-3xl md:text-5xl font-sans text-medical-primary mb-8">
                Ceratocone
              </h1>
              <p className="text-lg text-medical-secondary mb-8">
                O ceratocone é uma doença progressiva da córnea que causa distorção visual. 
                Oferecemos tratamentos avançados para estabilizar a doença e melhorar a qualidade visual.
              </p>
              <div className="bg-medical-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-medical-primary mb-3">
                  O que é Ceratocone?
                </h3>
                <p className="text-medical-secondary">
                  É uma condição em que a córnea se torna mais fina e assume formato cônico, 
                  causando astigmatismo irregular e perda de qualidade visual.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/uploads/ca6a3fb8-8270-45cf-97e5-a67feca68a3e.png"
                alt="Tratamento de Ceratocone"
                className="rounded-lg shadow-medium w-full"
              />
            </div>
          </div>

          {/* Treatments Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-medical-primary text-center mb-12">
              Opções de Tratamento
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {treatments.map((treatment, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 text-center"
                >
                  <div className="text-medical-primary mb-4 flex justify-center">
                    {treatment.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-medical-primary mb-3">
                    {treatment.title}
                  </h3>
                  <p className="text-medical-secondary text-sm">
                    {treatment.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stages Section */}
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-12">
            <h2 className="text-3xl font-serif font-bold text-medical-primary mb-8 text-center">
              Estágios do Ceratocone
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {stages.map((stage, index) => (
                <div key={index} className="text-center">
                  <div className="bg-medical-primary text-white rounded-full w-16 h-16 flex items-center justify-center text-lg font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-medical-primary mb-4">
                    {stage.stage}
                  </h3>
                  <div className="bg-medical-muted/10 p-4 rounded-lg mb-4">
                    <h4 className="font-medium text-medical-primary mb-2">Sintomas:</h4>
                    <p className="text-sm text-medical-secondary">
                      {stage.symptoms}
                    </p>
                  </div>
                  <div className="bg-medical-accent/10 p-4 rounded-lg">
                    <h4 className="font-medium text-medical-primary mb-2">Tratamento:</h4>
                    <p className="text-sm text-medical-secondary">
                      {stage.treatment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crosslinking Detail */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div className="bg-medical-muted/10 p-8 rounded-lg">
              <h2 className="text-2xl font-serif font-bold text-medical-primary mb-6">
                Crosslinking de Córnea
              </h2>
              <p className="text-medical-secondary mb-4">
                O crosslinking é um tratamento inovador que fortalece as fibras de colágeno da córnea, 
                estabilizando a progressão do ceratocone.
              </p>
              <ul className="space-y-2 text-medical-secondary">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-medical-primary mr-2" />
                  Procedimento minimamente invasivo
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-medical-primary mr-2" />
                  Estabiliza a progressão da doença
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-medical-primary mr-2" />
                  Pode melhorar a qualidade visual
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-medical-primary mr-2" />
                  Recuperação relativamente rápida
                </li>
              </ul>
            </div>
            <div className="relative">
              <img
                src="/uploads/ceratocone.jpg"
                alt="Crosslinking de Córnea"
                className="rounded-lg shadow-medium w-full"
              />
            </div>
          </div>

          {/* Anel Intraestromal Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-medical-primary mb-4">
                Anel Intraestromal
              </h2>
              <p className="text-lg text-medical-secondary max-w-3xl mx-auto">
                Os anéis intraestromais são pequenos segmentos semicirculares de material biocompatível 
                implantados na córnea para regularizar sua curvatura e melhorar a visão em casos de 
                ceratocone moderado a avançado.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="relative">
                <img
                  src="/uploads/anelintraestromal.png"
                  alt="Anel Intraestromal"
                  className="rounded-lg shadow-medium w-full"
                />
              </div>
              <div className="bg-medical-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-medical-primary mb-3">
                  Como Funciona?
                </h3>
                <p className="text-medical-secondary mb-4">
                  Os anéis são inseridos em túneis criados na espessura da córnea, aplicando pressão 
                  que achatam a área central e regularizam a curvatura corneana.
                </p>
                <ul className="text-medical-secondary space-y-2">
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Procedimento ambulatorial com anestesia local
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Recuperação rápida e pouco dolorosa
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Pode ser combinado com crosslinking
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Reversível se necessário
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-medical-accent/10 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-medical-primary mb-3">
                  Indicações
                </h3>
                <ul className="text-medical-secondary space-y-2">
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Ceratocone moderado a avançado
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Intolerância a lentes de contato
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Pacientes que não podem usar óculos
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Alternativa ao transplante de córnea
                  </li>
                </ul>
              </div>
              
              <div className="bg-white border border-medical-muted/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-medical-primary mb-3">
                  Vantagens
                </h3>
                <ul className="text-medical-secondary space-y-2">
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Melhora significativa da visão
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Redução da dependência de óculos
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Estabilização do ceratocone
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Procedimento seguro e eficaz
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Transplante de Córnea Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-medical-primary mb-4">
                Transplante de Córnea
              </h2>
              <p className="text-lg text-medical-secondary max-w-3xl mx-auto">
                O transplante de córnea é indicado para casos avançados de ceratocone onde outros tratamentos 
                não são mais eficazes. Utilizamos técnicas modernas para garantir os melhores resultados.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="relative">
                <img
                  src="/uploads/txcornea.jpg"
                  alt="Transplante de Córnea"
                  className="rounded-lg shadow-medium w-full"
                />
              </div>
              <div className="bg-medical-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-medical-primary mb-3">
                  Quando é Indicado?
                </h3>
                <ul className="text-medical-secondary space-y-2">
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Ceratocone em estágio avançado
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Falha dos tratamentos conservadores
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Córnea muito fina ou com cicatrizes
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Perda significativa da visão
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-medical-accent/10 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-medical-primary mb-3">
                  Tipos de Transplante
                </h3>
                <ul className="text-medical-secondary space-y-2">
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Transplante penetrante (PK)
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Transplante lamelar anterior (DALK)
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Transplante endotelial (DMEK)
                  </li>
                </ul>
              </div>
              
              <div className="bg-white border border-medical-muted/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-medical-primary mb-3">
                  Recuperação
                </h3>
                <ul className="text-medical-secondary space-y-2">
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Visão gradual em 3-6 meses
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Cuidados pós-operatórios rigorosos
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Acompanhamento especializado
                  </li>
                  <li className="flex items-start">
                    <span className="text-medical-primary mr-2">•</span>
                    Taxa de sucesso alta
                  </li>
                </ul>
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
                  O ceratocone tem cura?
                </h3>
                <p className="text-medical-secondary">
                  Não há cura definitiva, mas existem tratamentos eficazes para estabilizar a doença e melhorar a visão.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-medical-primary mb-2">
                  Qual a idade mais comum para desenvolver ceratocone?
                </h3>
                <p className="text-medical-secondary">
                  Geralmente se manifesta na adolescência ou início da idade adulta, entre 15 e 25 anos.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-medical-primary mb-2">
                  O crosslinking é doloroso?
                </h3>
                <p className="text-medical-secondary">
                  O procedimento é realizado com anestesia local e pode haver desconforto leve nos primeiros dias após a cirurgia.
                </p>
              </div>
            </div>
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

export default Ceratocone;
