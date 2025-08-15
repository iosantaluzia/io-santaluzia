
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Card, CardContent } from "@/components/ui/card";

const CorpoClinico = () => {
  const doctors = [
    {
      name: "Dr. Carlos Silva",
      specialty: "Oftalmologista Geral",
      crm: "CRM 12345-CE",
      description: "Especialista em cirurgia de catarata e glaucoma com mais de 15 anos de experiência.",
      image: "/lovable-uploads/4f2fb169-1556-4f12-9d20-a788c214c4f1.png"
    },
    {
      name: "Dra. Maria Santos",
      specialty: "Retina e Vítreo",
      crm: "CRM 67890-CE",
      description: "Especializada em doenças da retina e cirurgias vitreorretinianas.",
      image: "/lovable-uploads/6f0e2320-1b39-403a-ab68-8eeffe8dfc36.png"
    },
    {
      name: "Dr. João Oliveira",
      specialty: "Cirurgia Refrativa",
      crm: "CRM 11111-CE",
      description: "Expert em cirurgias refrativas a laser e correção de miopia, hipermetropia e astigmatismo.",
      image: "/lovable-uploads/87125f62-3c4e-4acc-970b-25f7eb624ae5.png"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-medical-primary mb-8 text-center">
              Nosso Corpo Clínico
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 text-center max-w-3xl mx-auto">
              Conheça nossa equipe de oftalmologistas especializados, 
              comprometidos com a excelência no cuidado da sua visão.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-medical-primary mb-2">
                      {doctor.name}
                    </h3>
                    <p className="text-medical-secondary font-medium mb-1">
                      {doctor.specialty}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {doctor.crm}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {doctor.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-16 bg-gradient-accent rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-medical-primary mb-6 text-center">
                Compromisso com a Excelência
              </h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Nossa equipe médica é formada por oftalmologistas altamente qualificados, 
                    com formação em renomadas instituições e constante atualização em 
                    técnicas e tecnologias inovadoras.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Cada profissional traz sua expertise específica, garantindo um 
                    atendimento completo e personalizado para todas as necessidades 
                    oftalmológicas.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-medical-primary rounded-full"></div>
                    <span className="text-medical-primary font-medium">Formação de excelência</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-medical-secondary rounded-full"></div>
                    <span className="text-medical-primary font-medium">Atualização constante</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-medical-accent rounded-full"></div>
                    <span className="text-medical-primary font-medium">Experiência comprovada</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-medical-primary rounded-full"></div>
                    <span className="text-medical-primary font-medium">Atendimento humanizado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
};

export default CorpoClinico;
