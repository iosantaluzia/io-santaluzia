
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/ui/footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Instagram, Facebook } from 'lucide-react';

const Exames = () => {
  const exams = [
    {
      title: "Microscopia Especular",
      image: "/lovable-uploads/microscopia.png",
      description: "Avaliação das células do endotélio corneano"
    },
    {
      title: "YAG Laser",
      image: "/lovable-uploads/yaglaser.png",
      description: "Tratamento a laser para opacificação capsular"
    },
    {
      title: "Topografia Corneana",
      image: "/lovable-uploads/topografia.png",
      description: "Mapeamento detalhado da curvatura da córnea"
    },
    {
      title: "Pentacam",
      image: "/lovable-uploads/pentacam.png",
      description: "Análise completa do segmento anterior do olho"
    },
    {
      title: "Aberrômetro",
      image: "/lovable-uploads/aberrometro.png",
      description: "Medição de aberrações ópticas do olho"
    },
    {
      title: "Campimetria",
      image: "/lovable-uploads/campimetria.png",
      description: "Exame do campo visual periférico"
    },
    {
      title: "OCT",
      image: "/lovable-uploads/oct.png",
      description: "Tomografia de coerência óptica"
    }
  ];

  return (
    <div className="min-h-screen">
      <NavigationHeader showLogo={true} />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-medical-primary mb-6">
              Exames Complementares
            </h1>
            <p className="text-lg text-medical-secondary max-w-3xl mx-auto">
              Oferecemos uma ampla gama de exames oftalmológicos com equipamentos de última geração 
              para diagnósticos precisos e confiáveis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {exams.map((exam, index) => (
              <div
                key={index}
                className="group cursor-pointer bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={exam.image}
                    alt={exam.title}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-medical-primary/80 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 right-4 text-white font-sans text-lg font-semibold">
                    {exam.title}
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-medical-secondary text-sm">
                    {exam.description}
                  </p>
                </div>
              </div>
            ))}
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

export default Exames;
