
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/ui/footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Instagram, Facebook } from 'lucide-react';

const CorpoClinico = () => {
  const doctors = [
    {
      name: "Dr. Matheus Rocha",
      specialty: "Oftalmologista Geral",
      description: "Especialista em cirurgias de catarata e glaucoma, com mais de 10 anos de experiência.",
      image: "/lovable-uploads/6d7d13fe-03bb-4ace-89df-262bcaccb86e.png"
    },
    {
      name: "Dra. Fabíola Santos",
      specialty: "Cirurgia Refrativa",
      description: "Especialista em cirurgias refrativas e correção de miopia, hipermetropia e astigmatismo.",
      image: "/lovable-uploads/87125f62-3c4e-4acc-970b-25f7eb624ae5.png"
    },
    {
      name: "Dr. Carlos Mendes",
      specialty: "Retina e Vítreo",
      description: "Especialista em doenças da retina e procedimentos de vitrectomia.",
      image: "/lovable-uploads/6d7d13fe-03bb-4ace-89df-262bcaccb86e.png"
    }
  ];

  return (
    <div className="min-h-screen">
      <NavigationHeader showLogo={true} />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-medical-primary mb-6">
              Corpo Clínico
            </h1>
            <p className="text-lg text-medical-secondary max-w-3xl mx-auto">
              Nossa equipe é formada por oftalmologistas experientes e especializados nas mais 
              diversas áreas da medicina ocular, garantindo um atendimento de alta qualidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {doctors.map((doctor, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-sans font-bold text-medical-primary mb-2">
                    {doctor.name}
                  </h3>
                  <h4 className="text-medical-accent font-medium mb-3">
                    {doctor.specialty}
                  </h4>
                  <p className="text-medical-secondary text-sm">
                    {doctor.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-8 mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-medical-primary mb-4">
              Compromisso com a Excelência
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Nossos profissionais estão em constante atualização, participando de congressos 
              e cursos de especialização para oferecer sempre os melhores tratamentos disponíveis.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Acreditamos que o cuidado humanizado, aliado à competência técnica, é fundamental 
              para o sucesso dos tratamentos e a satisfação dos nossos pacientes.
            </p>
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

export default CorpoClinico;
