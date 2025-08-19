
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/ui/footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Instagram, Facebook, Eye, CheckCircle, Clock, Shield } from 'lucide-react';

const Catarata = () => {
  const benefits = [
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Visão Restaurada",
      description: "Recuperação da nitidez visual perdida pela catarata"
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Procedimento Seguro",
      description: "Cirurgia minimamente invasiva com alta taxa de sucesso"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Recuperação Rápida",
      description: "Retorno às atividades normais em poucos dias"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Tecnologia Avançada",
      description: "Lentes intraoculares de última geração"
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
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-medical-primary mb-6">
                Cirurgia de Catarata
              </h1>
              <p className="text-lg text-medical-secondary mb-8">
                A catarata é uma das principais causas de perda visual no mundo, mas tem tratamento 
                definitivo. Nossa equipe especializada oferece cirurgias seguras e eficazes com 
                tecnologia de ponta.
              </p>
              <div className="bg-medical-muted/20 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-medical-primary mb-3">
                  O que é Catarata?
                </h3>
                <p className="text-medical-secondary">
                  A catarata é a opacificação do cristalino, lente natural do olho, que causa 
                  visão embaçada, sensibilidade à luz e dificuldade para enxergar à noite.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/lovable-uploads/6d7d13fe-03bb-4ace-89df-262bcaccb86e.png"
                alt="Cirurgia de Catarata"
                className="rounded-lg shadow-medium w-full"
              />
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-medical-primary text-center mb-12">
              Benefícios da Cirurgia
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

          {/* Process Section */}
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-12">
            <h2 className="text-3xl font-serif font-bold text-medical-primary mb-8 text-center">
              Como Funciona a Cirurgia
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-medical-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-medical-primary mb-3">
                  Avaliação Pré-Operatória
                </h3>
                <p className="text-medical-secondary text-sm">
                  Exames detalhados para determinar o tipo de lente intraocular mais adequada.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-medical-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-medical-primary mb-3">
                  Procedimento Cirúrgico
                </h3>
                <p className="text-medical-secondary text-sm">
                  Cirurgia minimamente invasiva com técnica de facoemulsificação.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-medical-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-medical-primary mb-3">
                  Recuperação
                </h3>
                <p className="text-medical-secondary text-sm">
                  Acompanhamento pós-operatório para garantir a melhor recuperação.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-medical-muted/10 rounded-2xl p-8">
            <h2 className="text-3xl font-serif font-bold text-medical-primary mb-8 text-center">
              Perguntas Frequentes
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-medical-primary mb-2">
                  A cirurgia de catarata dói?
                </h3>
                <p className="text-medical-secondary">
                  Não. A cirurgia é realizada com anestesia local (colírio) e o paciente não sente dor durante o procedimento.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-medical-primary mb-2">
                  Quanto tempo demora a recuperação?
                </h3>
                <p className="text-medical-secondary">
                  A recuperação visual inicial ocorre em poucos dias, mas a estabilização completa pode levar algumas semanas.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-medical-primary mb-2">
                  Posso operar os dois olhos no mesmo dia?
                </h3>
                <p className="text-medical-secondary">
                  Geralmente recomendamos um intervalo entre as cirurgias, mas em casos específicos pode ser avaliada a cirurgia bilateral.
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

export default Catarata;
