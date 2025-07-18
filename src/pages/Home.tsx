
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Stethoscope, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import NavigationHeader from "@/components/NavigationHeader";
import ExpandableCard from "@/components/ExpandableCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import ArticleModal from "@/components/ArticleModal";
import SymptomChecker from "@/components/SymptomChecker";
import { Footer } from "@/components/ui/footer";
import { Instagram, Facebook } from "lucide-react";

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [currentArticle, setCurrentArticle] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setShowFloatingNav(currentScrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const artigos = [
    {
      titulo: "Cirurgia Refrativa – Liberdade e Segurança",
      subtitulo: "Os benefícios da cirurgia refrativa para sua qualidade de vida",
      data: "26 de fevereiro de 2025",
      imagem: "/lovable-uploads/87125f62-3c4e-4acc-970b-25f7eb624ae5.png",
      conteudo: "A cirurgia refrativa tem como objetivo reestabelecer a qualidade de vida dos pacientes e proporcionar a liberdade de óculos e lentes de contato.\n\nNo Instituto de Olhos Santa Luzia contamos com técnicas avançadas e atualmente o mais novo Excimer Laser de Mato Grosso, o MEL 90 da Zeiss, realizando procedimentos para correção de problemas como hipermetropia, miopia, astigmatismo e presbiopia."
    },
    {
      titulo: "Seu filho tem miopia? Saiba os riscos e tratamentos",
      subtitulo: "A miopia infantil tem aumentado e requer atenção especial dos pais",
      data: "14 de agosto de 2024",
      imagem: "/lovable-uploads/e61210e1-053c-4ae4-9902-9d9eaf4c0312.png",
      conteudo: "A miopia é um dos problemas visuais mais comuns em crianças e sua incidência tem aumentado nos últimos anos. Caracterizada pela dificuldade em enxergar objetos distantes com clareza, a miopia ocorre quando o olho é mais longo do que o normal."
    }
  ];

  const nextArticle = () => {
    setCurrentArticle((prev) => (prev + 1) % artigos.length);
  };

  const prevArticle = () => {
    setCurrentArticle((prev) => (prev - 1 + artigos.length) % artigos.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header flutuante - só aparece após scroll */}
      {showFloatingNav && <NavigationHeader showLogo={true} />}

      {/* Hero Section com logo principal - posicionado mais acima */}
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] px-4 pt-8"
        style={{
          opacity: Math.max(0, 1 - scrollY / 400),
        }}
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.img
            src="/lovable-uploads/26442ffb-6359-4e38-a0f7-eaddfc7505f1.png"
            alt="Instituto de Olhos Santa Luzia"
            className="mx-auto mb-6 max-w-xs md:max-w-sm lg:max-w-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-4"
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-sans text-medical-primary mb-6">
              Instituto de Olhos Santa Luzia
            </h1>
            <p className="text-lg md:text-xl text-medical-secondary max-w-2xl mx-auto">
              Cuidados oftalmológicos especializados com excelência e tecnologia de ponta
            </p>
          </motion.div>
          
          {/* Seção de pesquisa de sintomas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <SymptomChecker />
          </motion.div>
        </div>
      </motion.div>

      {/* Seção de boas-vindas */}
      <div className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans text-medical-primary mb-6">
              Bem vindo ao Instituto de Olhos Santa Luzia
            </h2>
            <p className="text-lg text-medical-secondary mb-8">
              Nosso compromisso é proporcionar um serviço oftalmológico de excelência, atendendo a todas as suas necessidades visuais com cuidado e precisão. Desde 2014, estamos presentes em Sinop, Mato Grosso, oferecendo atendimento completo em oftalmologia.
            </p>
          </div>
          <div className="relative">
            <img 
              src="/lovable-uploads/6d7d13fe-03bb-4ace-89df-262bcaccb86e.png"
              alt="Cuidados oftalmológicos especializados"
              className="rounded-lg shadow-medium w-full"
            />
          </div>
        </div>
      </div>

      {/* Botão de agendamento após hero */}
      <div className="py-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <WhatsAppButton />
        </div>
      </div>

      {/* Seção O que oferecemos */}
      <div className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans text-medical-primary mb-6">
                O que oferecemos?
              </h2>
              <p className="text-lg text-medical-secondary mb-6">
                Estamos aqui para cuidar da sua saúde visual com dedicação e comprometimento. Entre em contato conosco para mais informações e agende sua consulta hoje mesmo. Seus olhos merecem o melhor cuidado!
              </p>
              <p className="text-lg text-medical-secondary mb-8">
                Clique e confira um pouco do que nosso serviço dispõe para você:
              </p>
            </div>
            
            <div className="space-y-4">
              <ExpandableCard
                title="PROFISSIONAIS QUALIFICADOS"
                content="Estamos prontos para cuidar da sua visão, oferecendo serviços especializados em áreas como refração, catarata, cirurgia refrativa, lentes de contato, ceratocone e oftalmopediatria."
                icon={<Users className="h-6 w-6" />}
              />
              
              <ExpandableCard
                title="UMA AMPLA GAMA DE EXAMES"
                content="Disponibilizamos exames de ponta, para garantir um diagnóstico preciso e um tratamento adequado para cada paciente."
                icon={<Stethoscope className="h-6 w-6" />}
              />
              
              <ExpandableCard
                title="CIRURGIAS"
                content="Realizamos cirurgias de Catarata, Ceratocone, Cirurgia Refrativa, de Lesões oculares e adaptação de lentes de contato."
                icon={<Eye className="h-6 w-6" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Carrossel de Artigos */}
      <div className="py-20 bg-medical-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-sans text-medical-primary">Últimos Artigos</h2>
            <div className="flex space-x-2">
              <button
                onClick={prevArticle}
                className="p-2 rounded-full bg-white shadow-soft hover:shadow-medium transition-shadow"
              >
                <ChevronLeft className="h-5 w-5 text-medical-primary" />
              </button>
              <button
                onClick={nextArticle}
                className="p-2 rounded-full bg-white shadow-soft hover:shadow-medium transition-shadow"
              >
                <ChevronRight className="h-5 w-5 text-medical-primary" />
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {artigos.map((artigo, index) => (
              <article 
                key={index}
                className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedArticle(artigo)}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={artigo.imagem}
                    alt={artigo.titulo}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-medical-secondary mb-2">
                    {artigo.data}
                  </div>
                  <h3 className="text-xl font-sans font-bold text-medical-primary mb-3 line-clamp-2">
                    {artigo.titulo}
                  </h3>
                  <p className="text-medical-secondary text-sm mb-4 line-clamp-2">
                    {artigo.subtitulo}
                  </p>
                  <button className="text-medical-primary hover:text-medical-secondary transition-colors font-medium text-sm">
                    LEIA MAIS »
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Segundo botão de agendamento */}
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

      <ArticleModal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        title={selectedArticle?.titulo || ""}
        content={selectedArticle?.conteudo || ""}
        date={selectedArticle?.data || ""}
      />
    </div>
  );
};

export default Home;
