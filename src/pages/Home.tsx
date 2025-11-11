
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
import { VoiceChatButton } from "@/components/VoiceChatButton";
import { articles } from '@/data/articles';

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [currentArticle, setCurrentArticle] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "/uploads/interior.jpg",
    "/uploads/exames.jpg",
    "/uploads/35a55ba7-79f8-4351-a3c0-62d1d39c59f6.png",
    "/uploads/fachada.jpg"
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      // Header sempre visível - removida a condição de scroll
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const images = [
      "/uploads/interior.jpg",
      "/uploads/exames.jpg",
      "/uploads/35a55ba7-79f8-4351-a3c0-62d1d39c59f6.png",
      "/uploads/fachada.jpg"
    ];

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Troca a imagem a cada 5 segundos

    return () => clearInterval(interval);
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
    <div className="min-h-screen bg-background pt-24 md:pt-32">
      <NavigationHeader showLogo={true} />

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
          <div className="mb-6 flex justify-center">
            <img 
              src="/uploads/logoiosantaluzia-removebg-preview.png" 
              alt="Instituto de Olhos Santa Luzia" 
              className="h-18 w-auto md:h-24 md:w-auto object-contain"
            />
          </div>
          <div className="relative">
              {/* Image Carousel - Above Text for both mobile and desktop */}
              <div className="mb-6">
                <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-3xl">
                  {heroImages.map((img, idx) => {
                    const isAnimatedImage = img !== "/uploads/exames.jpg";
                    return (
                      <motion.img
                        key={`${img}-${idx}`}
                        src={img}
                        alt="Instituto de Olhos Santa Luzia"
                        className={`w-full h-full object-cover ${idx !== currentImageIndex ? 'hidden' : ''}`}
                        style={{ 
                          width: '100%', 
                          height: isAnimatedImage ? '130%' : '100%',
                          objectPosition: 'center' 
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: idx === currentImageIndex ? 1 : 0,
                          y: isAnimatedImage ? ['0%', '-15%', '0%'] : '0%',
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                          opacity: { duration: 0.8 },
                          y: isAnimatedImage ? { 
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut"
                          } : {}
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="w-full">
                  <div className="max-w-5xl mx-auto px-4">
                    <div className="space-y-4">
                      {/* Desktop Welcome Text */}
                      <h2 className="hidden md:block text-lg md:text-xl font-medium text-gray-600 mb-2">Bem vindo ao</h2>
                      {/* Title for all screen sizes */}
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

      {/* IA Section - Manter largura original para SymptomChecker */}
      <section id="ia" className="pt-20 md:pt-32 pb-8 md:pb-16 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-sans text-medical-primary mb-4 md:mb-6">
              Análise Inteligente de Sintomas
            </h2>
            <div className="mt-8 flex flex-col items-center gap-10 md:flex-row md:items-center md:gap-16 md:justify-center">
              <motion.div 
                className="flex-shrink-0 order-1 md:order-none"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true, amount: 0.5 }}
              >
                <motion.img
                  src="/uploads/iomascot.png"
                  alt="Mascote do Instituto de Olhos Santa Luzia"
                  className="w-28 sm:w-36 md:w-44 lg:w-52 drop-shadow-xl"
                  initial={{ rotate: -6, opacity: 0 }}
                  whileInView={{ rotate: [0, -4, 2, 0], opacity: 1 }}
                  transition={{ duration: 1.4, ease: "easeInOut", delay: 0.2 }}
                  viewport={{ once: true, amount: 0.5 }}
                />
              </motion.div>
              <div className="w-full md:max-w-2xl lg:max-w-3xl">
                <SymptomChecker className="md:mx-0 md:text-left" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Services Section */}
      <div className="py-12 md:py-20 bg-background">
        <div className="w-full px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-sans text-medical-primary mb-4 md:mb-6 px-4">
              O que <span className="text-medical-primary">oferecemos</span>
              </h2>
            </div>
            
          <div className="flex justify-center">
            <InteractiveCards />
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="py-12 md:py-20 bg-background">
        <div className="w-full px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-sans text-medical-primary mb-4 md:mb-6 px-4">
              Últimos Artigos
            </h2>
          </div>
          
          <div className="flex justify-center items-center mb-4 md:mb-8 px-4">
            <div className="flex space-x-2">
              <button
                onClick={prevArticle}
                className="p-2 rounded-full bg-medical-primary shadow-soft hover:bg-medical-primary/90 hover:shadow-medium transition-all"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={nextArticle}
                className="p-2 rounded-full bg-medical-primary shadow-soft hover:bg-medical-primary/90 hover:shadow-medium transition-all"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-4 md:gap-6 pb-4 px-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {articles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-[280px] md:w-80 bg-white rounded-xl shadow-medium overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
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
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <span>{article.data}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-sans text-medical-primary mb-2 md:mb-3 line-clamp-2">
                    {article.titulo}
                  </h3>
                  <p className="text-medical-secondary text-xs md:text-sm leading-relaxed line-clamp-3">
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
