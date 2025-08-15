import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Zap, Search, Activity } from "lucide-react";

const Exames = () => {
  const exams = [
    {
      name: "Topografia de Córnea",
      icon: <Eye className="h-8 w-8" />,
      description: "Exame que mapeia a curvatura da córnea, essencial para diagnóstico de astigmatismo e ceratocone.",
      image: "/lovable-uploads/topografia.png"
    },
    {
      name: "OCT - Tomografia de Coerência Óptica",
      icon: <Search className="h-8 w-8" />,
      description: "Tecnologia avançada para visualização detalhada da retina e nervo óptico.",
      image: "/lovable-uploads/oct.png"
    },
    {
      name: "Campimetria Visual",
      icon: <Activity className="h-8 w-8" />,
      description: "Avaliação do campo visual para diagnóstico de glaucoma e outras patologias.",
      image: "/lovable-uploads/campimetria.png"
    },
    {
      name: "Pentacam",
      icon: <Zap className="h-8 w-8" />,
      description: "Análise completa do segmento anterior do olho com tecnologia Scheimpflug.",
      image: "/lovable-uploads/pentacam.png"
    },
    {
      name: "Microscopia Especular",
      icon: <Eye className="h-8 w-8" />,
      description: "Avaliação das células do endotélio da córnea.",
      image: "/lovable-uploads/microscopia.png"
    },
    {
      name: "Aberrometria",
      icon: <Search className="h-8 w-8" />,
      description: "Medição das aberrações ópticas do olho para cirurgias refrativas personalizadas.",
      image: "/lovable-uploads/aberrometro.png"
    }
  ];

  return (
    <div className="min-h-screen">
      <NavigationHeader showLogo={true} />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-medical-primary mb-8 text-center">
              Exames Complementares
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 text-center max-w-3xl mx-auto">
              Utilizamos tecnologia de ponta para diagnósticos precisos e 
              acompanhamento detalhado da saúde dos seus olhos.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {exams.map((exam, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden bg-gradient-accent">
                    <img 
                      src={exam.image} 
                      alt={exam.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="text-medical-primary">
                        {exam.icon}
                      </div>
                      <span className="text-medical-primary">{exam.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {exam.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-medical-muted rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-medical-primary mb-6 text-center">
                Por que realizar exames complementares?
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-medical-primary mb-4">
                    Diagnóstico Preciso
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Os exames complementares permitem uma avaliação detalhada das estruturas 
                    oculares, possibilitando diagnósticos precoces e precisos de diversas 
                    condições oftalmológicas.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-medical-primary mb-4">
                    Acompanhamento Especializado
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Para pacientes com condições como glaucoma, diabetes ou degeneração 
                    macular, os exames regulares são fundamentais para monitorar a 
                    progressão da doença.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 shadow-soft">
                    <h4 className="font-semibold text-medical-primary mb-2">Tecnologia Avançada</h4>
                    <p className="text-sm text-muted-foreground">
                      Equipamentos de última geração para resultados confiáveis
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-soft">
                    <h4 className="font-semibold text-medical-primary mb-2">Equipe Especializada</h4>
                    <p className="text-sm text-muted-foreground">
                      Profissionais treinados para realizar e interpretar os exames
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-soft">
                    <h4 className="font-semibold text-medical-primary mb-2">Conforto e Rapidez</h4>
                    <p className="text-sm text-muted-foreground">
                      Exames não invasivos realizados com máximo conforto
                    </p>
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

export default Exames;
