
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Stethoscope, Eye, ChevronLeft, ChevronRight, Instagram, Facebook } from "lucide-react";
import NavigationHeader from "@/components/NavigationHeader";
import SymptomChecker from "@/components/SymptomChecker";
import ExpandableCard from "@/components/ExpandableCard";
import InteractiveCards from "@/components/InteractiveCards";
import { Footer } from "@/components/ui/footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import ArticleModal from "@/components/ArticleModal";
import { articles } from '@/data/articles';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [currentArticle, setCurrentArticle] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      // Header sempre visível - removida a condição de scroll
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const nextArticle = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const prevArticle = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const handleContinueToSite = () => {
    const siteSection = document.getElementById('site');
    siteSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader showLogo={true} />

      {/* IA Section - Manter largura original para SymptomChecker */}
      <section id="ia" className="pt-32 pb-16 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Logo acima do título */}
            <div className="mb-6 flex justify-center">
                      <img 
                        src="/uploads/logoiosantaluzia-removebg-preview.png" 
                        alt="Instituto de Olhos Santa Luzia" 
                        className="h-18 w-auto md:h-24 md:w-auto object-contain"
                      />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-sans text-medical-primary mb-6">
              Análise Inteligente de Sintomas
            </h2>
            <SymptomChecker />
          </motion.div>
        </div>
      </section>

      {/* Hero Section */}
      <motion.div
        id="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 min-h-[80vh] flex items-end"
      >
        <div className="w-full">
          <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="relative">
              {/* Background Image */}
              <div className="absolute inset-0 flex items-end justify-center pb-0 z-0">
                <div className="max-w-4xl mx-auto px-4 w-full">
            <img 
              src="/uploads/6d7d13fe-03bb-4ace-89df-262bcaccb86e.png"
                    alt="Background"
                    className="h-auto object-cover rounded-t-3xl"
                    style={{ 
                      width: '98%',
                      filter: `contrast(1.05) brightness(0.98) saturate(1.05) blur(${Math.max(0, 3 - scrollY * 0.01)}px)`,
                      imageRendering: 'crisp-edges',
                      transform: 'translateY(-10%)'
                    }}
            />
          </div>
              </div>
              
              {/* Mock Background - bghomemock.png */}
              <div className="absolute inset-0 flex items-start justify-center pt-8 z-10">
                <div className="max-w-5xl mx-auto px-4">
                  <img 
                    src="/uploads/bghomemock.png"
                    alt="Mock Background"
                    className="w-full object-contain"
                    style={{
                      filter: 'hue-rotate(0deg) saturate(1) brightness(1) contrast(1) sepia(0) invert(0) grayscale(0)',
                      transform: 'translateX(-2%)'
                    }}
                  />
        </div>
      </div>

              {/* Content */}
              <div className="relative z-20 flex items-end pt-28">
                <div className="w-full">
                  {/* Mobile Mock Frame with Overlay Text */}
                  <div className="md:hidden w-full px-4 mb-8">
                    <div className="relative">
                      {/* Mobile Mock Frame */}
                      <div className="relative mx-auto max-w-sm">
                        <img 
                          src="/uploads/mockmobile2.png"
                          alt="Mobile Mock"
                          className="w-full h-auto object-contain"
                        />
                        
                        {/* Overlay Text "Bem vindo ao" */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h2 className="text-lg font-medium text-gray-600 text-center">
                            Bem vindo ao
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="max-w-5xl mx-auto px-4">
                    <div className="space-y-4">
                      {/* Desktop Welcome Text */}
                      <h2 className="hidden md:block text-lg md:text-xl font-medium text-gray-600 mb-2">Bem vindo ao</h2>
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-medical-primary mb-6">
                        INSTITUTO DE OLHOS SANTA LUZIA
            </h1>
        </div>
      </div>

                  {/* Desktop Content */}
                  <div className="hidden md:block max-w-2xl ml-0 px-4 self-start">
                    <div className="space-y-4">
                      <p className="text-lg text-medical-secondary mb-8 text-left">
                        Nosso compromisso é proporcionar um serviço oftalmológico de excelência, atendendo a todas as suas necessidades visuais com cuidado e precisão. Desde 2014, estamos presentes em Sinop, Mato Grosso, oferecendo atendimento completo em oftalmologia.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => window.open('https://wa.me/5566997215000?text=Olá! Gostaria de agendar uma consulta no Instituto de Olhos Santa Luzia.', '_blank')}
                          className="px-8 py-4 bg-medical-primary text-white rounded-lg font-semibold hover:bg-medical-primary/90 transition-colors"
                        >
                          AGENDE UMA CONSULTA
                        </button>
                        <button 
                          onClick={handleContinueToSite}
                          className="px-8 py-4 bg-medical-primary text-white rounded-lg font-semibold hover:bg-medical-primary/90 transition-colors"
                        >
                          CONHEÇA NOSSOS SERVIÇOS
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Content - Below Title */}
                  <div className="md:hidden w-full px-4 mt-6">
                    <div className="space-y-4">
                      <p className="text-lg text-medical-secondary mb-8 text-left">
                        Nosso compromisso é proporcionar um serviço oftalmológico de excelência, atendendo a todas as suas necessidades visuais com cuidado e precisão. Desde 2014, estamos presentes em Sinop, Mato Grosso, oferecendo atendimento completo em oftalmologia.
                      </p>
                      <div className="flex flex-col gap-4">
                        <button 
                          onClick={() => window.open('https://wa.me/5566997215000?text=Olá! Gostaria de agendar uma consulta no Instituto de Olhos Santa Luzia.', '_blank')}
                          className="px-8 py-4 bg-medical-primary text-white rounded-lg font-semibold hover:bg-medical-primary/90 transition-colors"
                        >
                          AGENDE UMA CONSULTA
                        </button>
                        <button 
                          onClick={handleContinueToSite}
                          className="px-8 py-4 bg-medical-primary text-white rounded-lg font-semibold hover:bg-medical-primary/90 transition-colors"
                        >
                          CONHEÇA NOSSOS SERVIÇOS
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>


      {/* Services Section */}
      <div className="py-20 bg-background">
        <div className="w-full px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans text-medical-primary mb-6">
              O que <span className="text-medical-primary">oferecemos</span>
              </h2>
            </div>
            
          <div className="flex justify-center">
            <InteractiveCards />
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="py-20 bg-background">
        <div className="w-full px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans text-medical-primary mb-6">
              Últimos Artigos
            </h2>
          </div>
          
          <div className="flex justify-between items-center mb-8">
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
          
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-6 pb-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {articles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-80 bg-white rounded-xl shadow-medium overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={article.imagem}
                    alt={article.titulo}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-medical-accent mb-3">
                    <span>{article.data}</span>
                  </div>
                  <h3 className="text-lg font-sans text-medical-primary mb-3 line-clamp-2">
                    {article.titulo}
                  </h3>
                  <p className="text-medical-secondary text-sm leading-relaxed line-clamp-3">
                    {article.subtitulo}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

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
      
      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          title={selectedArticle.titulo}
          content={selectedArticle.conteudo}
          date={selectedArticle.data}
        />
      )}
    </div>
  );
};

export default Home;
