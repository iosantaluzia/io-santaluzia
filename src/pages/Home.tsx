
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Stethoscope, Eye, ChevronLeft, ChevronRight, Instagram, Facebook } from "lucide-react";
import NavigationHeader from "@/components/NavigationHeader";
import SymptomChecker from "@/components/SymptomChecker";
import ExpandableCard from "@/components/ExpandableCard";
import { Footer } from "@/components/ui/footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import WhatsAppButton from "@/components/WhatsAppButton";

const Home = () => {
  const [currentArticle, setCurrentArticle] = useState(0);

  const articles = [
    {
      title: "Cirurgia Refrativa – Liberdade e Segurança",
      excerpt: "Os benefícios da cirurgia refrativa para sua qualidade de vida",
      date: "26 de fevereiro de 2025",
      image: "/lovable-uploads/87125f62-3c4e-4acc-970b-25f7eb624ae5.png"
    },
    {
      title: "Catarata: Diagnóstico e Tratamento",
      excerpt: "Tudo o que você precisa saber sobre a cirurgia de catarata",
      date: "20 de fevereiro de 2025",
      image: "/lovable-uploads/6d7d13fe-03bb-4ace-89df-262bcaccb86e.png"
    }
  ];

  const nextArticle = () => {
    setCurrentArticle((prev) => (prev + 1) % articles.length);
  };

  const prevArticle = () => {
    setCurrentArticle((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const handleContinueToSite = () => {
    const siteSection = document.getElementById('site');
    siteSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader showLogo={true} />
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center min-h-[60vh] px-4 pt-8"
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            src="/lovable-uploads/logoiosantaluzia-removebg-preview.png"
            alt="Instituto de Olhos Santa Luzia"
            className="mx-auto mb-6 max-w-xs md:max-w-sm lg:max-w-md"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-sans text-medical-primary mb-6">
              Instituto de Olhos Santa Luzia
            </h1>
            <p className="text-lg md:text-xl text-medical-secondary max-w-2xl mx-auto">
              Cuidados oftalmológicos especializados com excelência e tecnologia de ponta
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* IA Section - Manter largura original para SymptomChecker */}
      <section id="ia" className="py-16 bg-gradient-to-br from-medical-muted/10 to-medical-accent/5">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-sans text-medical-primary mb-4">
              Análise Inteligente de Sintomas
            </h2>
            <p className="text-lg text-medical-secondary mb-8 max-w-2xl mx-auto">
              Nossa IA especializada ajuda você a entender seus sintomas oculares de forma rápida e confiável
            </p>
            <SymptomChecker />
          </motion.div>
        </div>
      </section>

      {/* Site Section - Ajustada para max-w-4xl */}
      <section id="site" className="py-20 bg-gradient-hero scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
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
      </section>

      {/* WhatsApp Button Section */}
      <div className="py-8 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <WhatsAppButton />
        </div>
      </div>

      {/* Services Section - Ajustada para max-w-4xl */}
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
                content="Nossa equipe é formada por oftalmologistas experientes e especializados nas mais diversas áreas da medicina ocular, garantindo um atendimento de alta qualidade."
                icon={<Users className="h-6 w-6" />}
              />
              <ExpandableCard
                title="UMA AMPLA GAMA DE EXAMES"
                content="Oferecemos uma completa linha de exames oftalmológicos com equipamentos de última geração para diagnósticos precisos e confiáveis."
                icon={<Stethoscope className="h-6 w-6" />}
              />
              <ExpandableCard
                title="CIRURGIAS"
                content="Realizamos cirurgias oftalmológicas avançadas, incluindo catarata, cirurgia refrativa e tratamento de ceratocone, sempre com os mais altos padrões de segurança."
                icon={<Eye className="h-6 w-6" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section - Ajustada para max-w-4xl */}
      <div className="py-20 bg-medical-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-sans text-medical-primary">
              Últimos Artigos
            </h2>
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
            {articles.map((article, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 cursor-pointer"
                style={{ display: index === currentArticle || index === (currentArticle + 1) % articles.length ? 'block' : 'none' }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="text-sm text-medical-secondary mb-2">
                    {article.date}
                  </div>
                  <h3 className="text-xl font-sans font-bold text-medical-primary mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-medical-secondary text-sm mb-4 line-clamp-2">
                    {article.excerpt}
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

export default Home;
