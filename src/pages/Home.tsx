
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

  const articles = [
    {
      titulo: "Seu filho tem miopia?",
      subtitulo: "Como identificar e tratar a miopia infantil",
      data: "15 de abril de 2024",
      imagem: "/lovable-uploads/oct.png",
      conteudo: "A miopia infantil tem se tornado cada vez mais comum, especialmente com o aumento do uso de dispositivos digitais. É importante identificar os sinais precocemente para evitar complicações futuras.\n\nOs principais sintomas incluem: dificuldade para enxergar objetos distantes, necessidade de aproximar-se da TV ou quadro na escola, dores de cabeça frequentes e esfregar os olhos constantemente.\n\nO tratamento pode incluir óculos, lentes de contato ou até mesmo cirurgia refrativa em casos específicos. O acompanhamento regular com oftalmologista pediátrico é fundamental."
    },
    {
      titulo: "Ceratocone: Diagnóstico Precoce é Fundamental",
      subtitulo: "Entenda como identificar e tratar o ceratocone",
      data: "10 de abril de 2024",
      imagem: "/lovable-uploads/pentacam.png",
      conteudo: "O ceratocone é uma doença progressiva da córnea que pode causar distorção significativa da visão. O diagnóstico precoce é crucial para evitar complicações graves.\n\nOs sintomas incluem visão embaçada, sensibilidade à luz, mudanças frequentes no grau dos óculos e visão dupla. O tratamento varia desde óculos e lentes de contato especiais até procedimentos como crosslinking e transplante de córnea.\n\nExames como topografia corneana e tomografia são essenciais para o diagnóstico preciso. O acompanhamento regular é fundamental para monitorar a progressão da doença."
    },
    {
      titulo: "Catarata: Quando Operar?",
      subtitulo: "Saiba quando é o momento ideal para a cirurgia de catarata",
      data: "8 de abril de 2024",
      imagem: "/lovable-uploads/yaglaser.png",
      conteudo: "A catarata é uma das principais causas de cegueira reversível no mundo. Saber quando operar é fundamental para o sucesso do tratamento.\n\nA cirurgia é indicada quando a catarata interfere significativamente nas atividades diárias, como dirigir, ler ou assistir TV. Não é necessário esperar a catarata 'amadurecer' completamente.\n\nA cirurgia moderna de catarata é segura e eficaz, com recuperação rápida. A escolha da lente intraocular adequada é crucial para o resultado final. O acompanhamento pós-operatório é essencial para garantir a recuperação adequada."
    },
    {
      titulo: "Exames Oftalmológicos Essenciais",
      subtitulo: "Quais exames você deve fazer regularmente",
      data: "5 de abril de 2024",
      imagem: "/lovable-uploads/aberrometro.png",
      conteudo: "Exames oftalmológicos regulares são fundamentais para manter a saúde dos olhos e prevenir doenças graves. Cada faixa etária tem suas necessidades específicas.\n\nPara adultos jovens, recomenda-se exame anual. Após os 40 anos, é importante incluir exames para glaucoma e degeneração macular. Após os 60 anos, o acompanhamento deve ser mais frequente.\n\nExames como fundoscopia, tonometria, campo visual e OCT são essenciais para detectar problemas precocemente. O diagnóstico precoce pode prevenir a perda irreversível da visão."
    },
    {
      titulo: "Lentes de Contato: Cuidados Essenciais",
      subtitulo: "Como usar lentes de contato com segurança",
      data: "3 de abril de 2024",
      imagem: "/lovable-uploads/microscopia.png",
      conteudo: "As lentes de contato são uma excelente opção para correção visual, mas requerem cuidados específicos para evitar complicações. A higiene adequada é fundamental.\n\nSempre lave as mãos antes de manusear as lentes, use soluções adequadas para limpeza e armazenamento, e nunca durma com lentes que não são apropriadas para uso prolongado.\n\nSinais de alerta incluem: olhos vermelhos, dor, sensibilidade à luz e visão embaçada. Se apresentar esses sintomas, remova as lentes imediatamente e procure um oftalmologista.\n\nO acompanhamento regular é essencial para garantir que as lentes estejam adequadas e que não haja complicações."
    },
    {
      titulo: "Glaucoma: O Ladrão Silencioso da Visão",
      subtitulo: "Entenda como prevenir e tratar o glaucoma",
      data: "1 de abril de 2024",
      imagem: "/lovable-uploads/campimetria.png",
      conteudo: "O glaucoma é conhecido como o 'ladrão silencioso da visão' porque pode causar perda visual irreversível sem sintomas iniciais. A prevenção e diagnóstico precoce são fundamentais.\n\nOs fatores de risco incluem: idade acima de 40 anos, histórico familiar, pressão intraocular elevada, diabetes e miopia alta. O tratamento pode incluir colírios, laser ou cirurgia.\n\nExames regulares são essenciais para detectar o glaucoma precocemente. O campo visual e a tomografia de nervo óptico são exames importantes para o diagnóstico e acompanhamento.\n\nO tratamento adequado pode prevenir a perda visual e manter a qualidade de vida do paciente."
    },
    {
      titulo: "Presbiopia: A Vista Cansada dos 40",
      subtitulo: "Como lidar com a presbiopia após os 40 anos",
      data: "28 de março de 2024",
      imagem: "/lovable-uploads/topografia.png",
      conteudo: "A presbiopia é uma condição natural que afeta todas as pessoas após os 40 anos, causando dificuldade para enxergar de perto. É parte do processo natural de envelhecimento do cristalino.\n\nOs sintomas incluem: necessidade de afastar objetos para ler, fadiga visual ao ler, dores de cabeça e dificuldade para focar em objetos próximos.\n\nAs opções de tratamento incluem: óculos para leitura, óculos bifocais ou multifocais, lentes de contato multifocais e cirurgia refrativa. A escolha depende do estilo de vida e preferências do paciente.\n\nO acompanhamento regular é importante para ajustar a correção conforme a presbiopia progride."
    },
    {
      titulo: "Astigmatismo: Visão Distorcida",
      subtitulo: "Entenda o que é astigmatismo e como tratar",
      data: "25 de março de 2024",
      imagem: "/lovable-uploads/refrativacc.jpg",
      conteudo: "O astigmatismo é um erro refrativo comum que causa visão distorcida ou embaçada tanto para longe quanto para perto. É causado por uma irregularidade na curvatura da córnea ou do cristalino.\n\nOs sintomas incluem: visão embaçada, distorção de imagens, fadiga visual, dores de cabeça e dificuldade para dirigir à noite.\n\nO tratamento pode incluir óculos com lentes cilíndricas, lentes de contato tóricas ou cirurgia refrativa. A escolha depende do grau do astigmatismo e das necessidades do paciente.\n\nO diagnóstico preciso é fundamental para a correção adequada. Exames como topografia corneana podem ajudar a identificar a causa do astigmatismo."
    },
    {
      titulo: "Hipermetropia: Dificuldade para Ver de Perto",
      subtitulo: "Como identificar e tratar a hipermetropia",
      data: "22 de março de 2024",
      imagem: "/lovable-uploads/ZEISS-MEL-90-photo.jpeg",
      conteudo: "A hipermetropia é um erro refrativo onde a imagem é formada atrás da retina, causando dificuldade para enxergar objetos próximos. Em casos leves, pode não causar sintomas significativos.\n\nOs sintomas incluem: dificuldade para ler, fadiga visual, dores de cabeça, visão embaçada para perto e, em casos mais graves, visão embaçada para longe também.\n\nO tratamento pode incluir óculos, lentes de contato ou cirurgia refrativa. A escolha depende da idade, grau da hipermetropia e estilo de vida do paciente.\n\nEm crianças, a hipermetropia pode causar ambliopia se não tratada adequadamente. O acompanhamento regular é essencial para prevenir complicações."
    },
    {
      titulo: "Diabetes e Saúde Ocular",
      subtitulo: "Como o diabetes afeta a visão e a importância do controle glicêmico",
      data: "12 de abril de 2024",
      imagem: "/lovable-uploads/oct.png",
      conteudo: "O diabetes pode causar várias complicações oculares, sendo a retinopatia diabética a mais comum. Esta condição afeta os vasos sanguíneos da retina e pode levar à perda de visão se não for tratada adequadamente.\n\nOs fatores de risco incluem tempo de diabetes, controle glicêmico inadequado, hipertensão arterial e colesterol elevado. O controle rigoroso da glicemia é fundamental para prevenir complicações.\n\nO tratamento pode incluir laser, injeções intravítreas ou cirurgia em casos mais avançados. O acompanhamento regular com oftalmologista é essencial para todos os pacientes diabéticos."
    }
  ];


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
      <section id="ia" className="pt-20 pb-16 bg-background">
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

      {/* Hero Section */}
      <motion.div
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
              src="/lovable-uploads/6d7d13fe-03bb-4ace-89df-262bcaccb86e.png"
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
                    src="/lovable-uploads/bghomemock.png"
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
                  <div className="max-w-5xl mx-auto px-4">
                    <div className="space-y-4">
                      <h2 className="text-lg md:text-xl font-medium text-gray-600 mb-2">Bem vindo ao</h2>
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-medical-primary mb-6">
                        INSTITUTO DE OLHOS SANTA LUZIA
            </h1>
        </div>
      </div>

                  <div className="max-w-2xl ml-0 px-4 self-start">
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
