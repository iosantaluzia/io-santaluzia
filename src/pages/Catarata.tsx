
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/ui/footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import PDFModal from "@/components/PDFModal";
import { Instagram, Facebook, Eye, CheckCircle, Clock, Shield, FileText, Download } from 'lucide-react';
import { useState } from 'react';

const Catarata = () => {
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

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
      <main className="pt-20 md:pt-32 pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
            <div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-sans text-medical-primary mb-6 md:mb-8">
                Cirurgia de Catarata
              </h1>
              <p className="text-base md:text-lg text-medical-secondary mb-6 md:mb-8">
                A catarata é uma das principais causas de perda visual no mundo, mas tem tratamento 
                definitivo. Nossa equipe especializada oferece cirurgias seguras e eficazes com 
                tecnologia de ponta.
              </p>
              <div className="bg-medical-muted/20 p-4 md:p-6 rounded-lg">
                <h3 className="text-lg md:text-xl font-semibold text-medical-primary mb-3">
                  O que é Catarata?
                </h3>
                <p className="text-sm md:text-base text-medical-secondary">
                  A catarata é a opacificação do cristalino, lente natural do olho, que causa 
                  visão embaçada, sensibilidade à luz e dificuldade para enxergar à noite.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/uploads/6f0e2320-1b39-403a-ab68-8eeffe8dfc36.png"
                alt="Cirurgia de Catarata"
                className="rounded-lg shadow-medium w-full"
              />
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-medical-primary text-center mb-8 md:mb-12">
              Benefícios da Cirurgia
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white p-4 md:p-6 rounded-lg shadow-soft hover:shadow-medium transition-all duration-300 text-center"
                >
                  <div className="text-medical-primary mb-3 md:mb-4 flex justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-medical-primary mb-2 md:mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-medical-secondary text-xs md:text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Process Section */}
          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-8 mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-medical-primary mb-6 md:mb-8 text-center">
              Como Funciona a Cirurgia
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center">
                <div className="bg-medical-primary text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg md:text-xl font-bold mx-auto mb-3 md:mb-4">
                  1
                </div>
                <h3 className="text-base md:text-lg font-semibold text-medical-primary mb-2 md:mb-3">
                  Avaliação Pré-Operatória
                </h3>
                <p className="text-medical-secondary text-xs md:text-sm">
                  Exames detalhados para determinar o tipo de lente intraocular mais adequada.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-medical-primary text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg md:text-xl font-bold mx-auto mb-3 md:mb-4">
                  2
                </div>
                <h3 className="text-base md:text-lg font-semibold text-medical-primary mb-2 md:mb-3">
                  Procedimento Cirúrgico
                </h3>
                <p className="text-medical-secondary text-xs md:text-sm">
                  Cirurgia minimamente invasiva com técnica de facoemulsificação.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-medical-primary text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-lg md:text-xl font-bold mx-auto mb-3 md:mb-4">
                  3
                </div>
                <h3 className="text-base md:text-lg font-semibold text-medical-primary mb-2 md:mb-3">
                  Recuperação
                </h3>
                <p className="text-medical-secondary text-xs md:text-sm">
                  Acompanhamento pós-operatório para garantir a melhor recuperação.
                </p>
              </div>
            </div>
          </div>

          {/* Cuidados Pós-Operatórios */}
          <div className="bg-gradient-to-r from-medical-primary/5 to-medical-accent/5 rounded-2xl p-6 md:p-8 mb-6 md:mb-8">
            <div className="text-center mb-4 md:mb-6">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-medical-primary mb-3 md:mb-4">
                Cuidados Pós-Operatórios
              </h2>
              <p className="text-base md:text-lg text-medical-secondary mb-4 md:mb-6">
                Orientações importantes para uma recuperação segura e eficaz após a cirurgia de catarata
              </p>
              <button
                onClick={() => setIsPDFModalOpen(true)}
                className="inline-flex items-center gap-2 md:gap-3 bg-medical-primary text-white px-6 py-3 md:px-8 md:py-4 rounded-lg hover:bg-medical-secondary transition-colors font-semibold text-sm md:text-lg shadow-medium hover:shadow-lg"
              >
                <FileText className="h-5 w-5 md:h-6 md:w-6" />
                <span className="hidden sm:inline">Ver Orientações Completas</span>
                <span className="sm:hidden">Ver Orientações</span>
                <Download className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-soft">
                <h3 className="text-base md:text-lg font-semibold text-medical-primary mb-2 md:mb-3">
                  Primeiros Dias
                </h3>
                <ul className="text-medical-secondary space-y-2 text-xs md:text-sm">
                  <li>• Use os colírios conforme prescrito</li>
                  <li>• Evite esfregar os olhos</li>
                  <li>• Use óculos de proteção</li>
                  <li>• Evite atividades físicas intensas</li>
                </ul>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-soft">
                <h3 className="text-base md:text-lg font-semibold text-medical-primary mb-2 md:mb-3">
                  Primeira Semana
                </h3>
                <ul className="text-medical-secondary space-y-2 text-xs md:text-sm">
                  <li>• Mantenha a higiene ocular</li>
                  <li>• Evite piscinas e saunas</li>
                  <li>• Retorne às consultas marcadas</li>
                  <li>• Relate qualquer desconforto</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-medical-muted/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-medical-primary mb-6 md:mb-8 text-center">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="text-base md:text-lg font-semibold text-medical-primary mb-2">
                  A cirurgia de catarata dói?
                </h3>
                <p className="text-sm md:text-base text-medical-secondary">
                  Não. A cirurgia é realizada com anestesia local (colírio) e o paciente não sente dor durante o procedimento.
                </p>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-medical-primary mb-2">
                  Quanto tempo demora a recuperação?
                </h3>
                <p className="text-sm md:text-base text-medical-secondary">
                  A recuperação visual inicial ocorre em poucos dias, mas a estabilização completa pode levar algumas semanas.
                </p>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-medical-primary mb-2">
                  Posso operar os dois olhos no mesmo dia?
                </h3>
                <p className="text-sm md:text-base text-medical-secondary">
                  Geralmente recomendamos um intervalo entre as cirurgias, mas em casos específicos pode ser avaliada a cirurgia bilateral.
                </p>
              </div>
            </div>
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
      
      {/* PDF Modal */}
      <PDFModal
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
        title="Cuidados Pós-Operatórios - Cirurgia de Catarata"
        pdfUrl="/CUIDADOS OPERATÓRIOS CATARATA.pdf"
        fileName="CUIDADOS OPERATÓRIOS CATARATA.pdf"
      />
    </div>
  );
};

export default Catarata;
