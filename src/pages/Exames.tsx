
import React, { useState } from 'react';
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/ui/footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import ExamModal from "@/components/ExamModal";
import ExamSearch from "@/components/ExamSearch";
import { Instagram, Facebook } from 'lucide-react';

const Exames = () => {
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const exames = [
    {
      nome: "Microscopia Especular",
      imagem: "/uploads/microscopia.png",
      descricao: "Avaliação das células do endotélio corneano",
      descricaoDetalhada: "A microscopia especular de córnea é um exame essencial na oftalmologia para avaliar a saúde das células endoteliais da córnea. Essas células são cruciais para manter a transparência corneana e sua integridade é vital para uma boa visão. O exame permite identificar alterações na densidade, forma e tamanho das células, indicando possíveis doenças ou a necessidade de intervenções. É indicado para avaliações pré e pós-operatórias de cirurgias como catarata e transplantes de córnea, acompanhamento de usuários de lentes de contato e diagnóstico de distrofias corneanas. É um procedimento rápido, indolor e não invasivo."
    },
    {
      nome: "YAG Laser",
      imagem: "/uploads/yaglaser.png",
      descricao: "Tratamento a laser para opacificação capsular",
      descricaoDetalhada: "O YAG Laser é uma tecnologia avançada utilizada em oftalmologia para tratar condições como a opacificação da cápsula posterior (conhecida como 'catarata secundária') após a cirurgia de catarata, e para realizar iridotomia em casos de glaucoma de ângulo fechado. O procedimento é rápido, indolor e realizado em consultório, sem necessidade de internação. Ele utiliza pulsos de laser de baixa energia para criar uma abertura precisa, restaurando a visão ou prevenindo picos de pressão intraocular. É uma alternativa segura e eficaz para evitar a necessidade de uma nova cirurgia invasiva."
    },
    {
      nome: "Topografia Corneana",
      imagem: "/uploads/topografia.png",
      descricao: "Mapeamento detalhado da curvatura da córnea",
      descricaoDetalhada: "A topografia corneana é um exame fundamental que mapeia a curvatura e espessura da córnea, criando um mapa detalhado de sua superfície. Este exame é essencial para o diagnóstico de ceratocone, astigmatismo irregular e outras condições que afetam a forma da córnea. É também crucial para o planejamento de cirurgias refrativas, adaptação de lentes de contato especiais e acompanhamento de doenças corneanas. O exame é rápido, indolor e fornece informações precisas sobre a geometria corneana, permitindo tratamentos mais personalizados e eficazes."
    },
    {
      nome: "Pentacam",
      imagem: "/uploads/pentacam.png",
      descricao: "Análise completa do segmento anterior do olho",
      descricaoDetalhada: "O Pentacam é um equipamento de alta tecnologia que realiza uma análise completa e tridimensional do segmento anterior do olho, incluindo córnea, câmara anterior, íris e cristalino. Este exame é fundamental para o diagnóstico precoce de ceratocone, avaliação da espessura corneana, análise da densidade do cristalino e planejamento de cirurgias refrativas e de catarata. O Pentacam fornece imagens de alta resolução e mapas detalhados que permitem uma avaliação precisa da anatomia ocular, sendo especialmente útil para detectar alterações sutis que podem não ser visíveis em exames convencionais."
    },
    {
      nome: "Aberrômetro",
      imagem: "/uploads/aberrometro.png",
      descricao: "Medição de aberrações ópticas do olho",
      descricaoDetalhada: "O aberrômetro é um equipamento sofisticado que mede as aberrações ópticas do olho, identificando imperfeições na qualidade da visão que não são detectadas pelos exames convencionais de refração. Este exame é fundamental para cirurgias refrativas personalizadas, pois permite criar tratamentos sob medida para cada paciente. O aberrômetro identifica aberrações de alta ordem que podem causar visão noturna ruim, halos, glare e outros sintomas visuais. É especialmente útil para pacientes com visão subótima após cirurgias refrativas ou para aqueles que buscam a melhor qualidade visual possível."
    },
    {
      nome: "Campimetria",
      imagem: "/uploads/campimetria.png",
      descricao: "Exame do campo visual periférico",
      descricaoDetalhada: "A campimetria é um exame essencial para avaliar o campo visual periférico e detectar perdas visuais que podem indicar doenças como glaucoma, lesões do nervo óptico, problemas neurológicos ou degeneração macular. O exame mapeia a sensibilidade visual em diferentes pontos do campo visual, identificando áreas de perda ou redução da visão. É fundamental para o diagnóstico precoce do glaucoma, uma das principais causas de cegueira irreversível. A campimetria também é importante para monitorar a progressão de doenças e avaliar a eficácia dos tratamentos."
    },
    {
      nome: "OCT",
      imagem: "/uploads/oct.png",
      descricao: "Tomografia de coerência óptica",
      descricaoDetalhada: "A OCT (Tomografia de Coerência Óptica) é uma tecnologia revolucionária que permite visualizar as estruturas internas do olho com alta resolução, sem necessidade de contato ou procedimentos invasivos. Este exame é fundamental para o diagnóstico e acompanhamento de doenças da retina, nervo óptico e córnea. A OCT é especialmente importante para detectar degeneração macular, edema macular, retinopatia diabética, glaucoma e outras condições que afetam a parte posterior do olho. O exame fornece imagens detalhadas das camadas da retina, permitindo diagnóstico precoce e tratamento mais eficaz de diversas doenças oculares."
    }
  ];

  return (
    <div className="min-h-screen">
      <NavigationHeader showLogo={true} />
      <main className="pt-20 md:pt-32 pb-12 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-sans text-medical-primary mb-4 md:mb-8 px-4">
              Centro Diagnóstico
            </h1>
            <p className="text-base md:text-lg text-medical-secondary max-w-3xl mx-auto px-4">
              Oferecemos uma ampla gama de exames oftalmológicos com equipamentos de última geração 
              para diagnósticos precisos e confiáveis.
            </p>
          </div>

          {/* Botão para pesquisar exames */}
          <div className="text-center mb-8 md:mb-12 px-4">
            <button
              onClick={() => setIsSearchModalOpen(!isSearchModalOpen)}
              className="bg-medical-primary text-white px-6 py-3 md:px-8 md:py-4 rounded-lg hover:bg-white hover:text-medical-primary hover:border-2 hover:border-medical-primary transition-colors font-semibold text-base md:text-lg"
            >
              Pesquisar seu exame
            </button>
          </div>

          {/* Campo de pesquisa de exames */}
          {isSearchModalOpen && <ExamSearch exames={exames} />}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {exames.map((exame, index) => (
              <div
                key={index}
                className="group cursor-pointer bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300"
                onClick={() => setSelectedExam(exame)}
              >
                <div className="relative h-40 md:h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-medical-primary/80 to-transparent"></div>
                  <img 
                    src={exame.imagem}
                    alt={exame.nome}
                    className="relative w-full h-full object-contain p-3 md:p-4 group-hover:scale-105 transition-transform duration-300 z-10"
                  />
                  <h3 className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 text-white font-sans text-base md:text-lg font-semibold z-20">
                    {exame.nome}
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-medical-secondary text-xs md:text-sm">
                    {exame.descricao}
                  </p>
                </div>
              </div>
            ))}
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
      
      <ExamModal
        isOpen={!!selectedExam}
        onClose={() => setSelectedExam(null)}
        title={selectedExam?.nome || ""}
        content={selectedExam?.descricaoDetalhada || selectedExam?.descricao || ""}
        image={selectedExam?.imagem || ""}
      />
      
    </div>
  );
};

export default Exames;
