import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Eye, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const Ceratocone = () => {
  const symptoms = [
    "Visão distorcida e embaçada",
    "Aumento frequente do grau dos óculos",
    "Sensibilidade à luz",
    "Visão dupla ou múltipla",
    "Dificuldade para dirigir à noite",
    "Coceira nos olhos"
  ];

  const treatments = [
    {
      name: "Crosslinking",
      description: "Fortalecimento da córnea com riboflavina e luz UV",
      icon: <Shield className="h-6 w-6" />
    },
    {
      name: "Anel Intraestromal",
      description: "Implante de anéis para regularizar a córnea",
      icon: <Eye className="h-6 w-6" />
    },
    {
      name: "Lentes de Contato Especiais",
      description: "Lentes rígidas ou esclerais para correção visual",
      icon: <Activity className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen">
      <NavigationHeader showLogo={true} />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-medical-primary mb-6">
                Tratamento de Ceratocone
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Diagnóstico precoce e tratamento especializado para preservar sua visão. 
                Tecnologias avançadas para controlar a progressão do ceratocone.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 mb-12">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="h-8 w-8 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-semibold text-orange-800 mb-3">
                    O que é Ceratocone?
                  </h2>
                  <p className="text-orange-700 leading-relaxed mb-4">
                    O ceratocone é uma condição progressiva em que a córnea (parte transparente 
                    da frente do olho) gradualmente se torna mais fina e assume um formato cônico, 
                    causando distorção visual.
                  </p>
                  <p className="text-orange-700 leading-relaxed">
                    É importante o diagnóstico precoce para evitar a progressão e preservar a visão.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-3xl font-semibold text-medical-primary mb-6">
                  Sintomas do Ceratocone
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  O ceratocone geralmente se desenvolve durante a adolescência ou início 
                  da idade adulta. Os sintomas podem aparecer gradualmente e incluem:
                </p>

                <Card className="bg-gradient-accent">
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-medical-primary rounded-full flex-shrink-0"></div>
                          <span className="text-muted-foreground">{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    ⚠️ Diagnóstico Precoce é Fundamental
                  </h3>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    Se você apresenta algum destes sintomas, especialmente se tem 
                    histórico familiar de ceratocone, procure avaliação oftalmológica 
                    especializada o quanto antes.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-3xl font-semibold text-medical-primary mb-6">
                  Opções de Tratamento
                </h2>
                
                {treatments.map((treatment, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="text-medical-primary">
                          {treatment.icon}
                        </div>
                        <span>{treatment.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {treatment.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}

                <div className="bg-medical-primary rounded-2xl p-6 text-white">
                  <h3 className="font-semibold mb-3">💡 Tratamento Personalizado</h3>
                  <p className="text-sm leading-relaxed">
                    Cada caso de ceratocone é único. Nossa equipe avalia 
                    cuidadosamente cada paciente para determinar o melhor 
                    plano de tratamento, que pode combinar diferentes 
                    abordagens para resultados otimais.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-medical-muted rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-semibold text-medical-primary mb-6 text-center">
                Etapas do Diagnóstico
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-medical-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="font-semibold text-medical-primary mb-2">Consulta</h3>
                  <p className="text-sm text-muted-foreground">
                    Avaliação dos sintomas e histórico familiar
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-medical-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="font-semibold text-medical-primary mb-2">Topografia</h3>
                  <p className="text-sm text-muted-foreground">
                    Mapeamento detalhado da curvatura da córnea
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-medical-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-medical-primary">3</span>
                  </div>
                  <h3 className="font-semibold text-medical-primary mb-2">Pentacam</h3>
                  <p className="text-sm text-muted-foreground">
                    Análise da espessura e formato da córnea
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-medical-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">4</span>
                  </div>
                  <h3 className="font-semibold text-medical-primary mb-2">Plano</h3>
                  <p className="text-sm text-muted-foreground">
                    Definição da estratégia de tratamento
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold text-medical-primary mb-4">
                Suspeita de Ceratocone?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Não espere os sintomas piorarem. Agende uma consulta especializada 
                para diagnóstico precoce e tratamento adequado.
              </p>
              <Button size="lg" className="bg-gradient-primary">
                Agendar Consulta Especializada
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
};

export default Ceratocone;
