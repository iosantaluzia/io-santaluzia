import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

const Catarata = () => {
  const symptoms = [
    "Visão embaçada ou turva",
    "Dificuldade para enxergar à noite", 
    "Sensibilidade aumentada à luz",
    "Visão dupla em um olho",
    "Necessidade de mudar óculos frequentemente",
    "Cores parecem desbotadas"
  ];

  const benefits = [
    "Melhora significativa da visão",
    "Redução da dependência de óculos",
    "Maior qualidade de vida",
    "Procedimento seguro e eficaz",
    "Recuperação rápida",
    "Tecnologia de ponta"
  ];

  return (
    <div className="min-h-screen">
      <NavigationHeader showLogo={true} />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-medical-primary mb-6">
                Cirurgia de Catarata
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Recupere sua visão com segurança e tecnologia avançada. 
                A cirurgia de catarata é um dos procedimentos mais seguros e eficazes da medicina.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-3xl font-semibold text-medical-primary mb-6">
                  O que é Catarata?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  A catarata é uma opacificação do cristalino (lente natural do olho) que 
                  torna a visão embaçada, como se você estivesse olhando através de uma 
                  janela embaçada ou fosca.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  É uma condição comum relacionada ao envelhecimento, mas pode afetar 
                  pessoas de qualquer idade. A única forma eficaz de tratamento é a cirurgia.
                </p>

                <Card className="bg-gradient-accent">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertCircle className="h-6 w-6 text-medical-primary" />
                      <span>Sintomas da Catarata</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-medical-primary rounded-full"></div>
                          <span className="text-muted-foreground">{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                <div className="bg-medical-primary rounded-2xl p-8 text-white">
                  <div className="flex items-center space-x-3 mb-6">
                    <Eye className="h-10 w-10" />
                    <h3 className="text-2xl font-semibold">Tecnologia Avançada</h3>
                  </div>
                  <p className="leading-relaxed mb-6">
                    Utilizamos a técnica de facoemulsificação com ultrassom, 
                    que permite incisões menores, recuperação mais rápida e 
                    resultados superiores.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Lentes intraoculares premium</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Cirurgia ambulatorial</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Anestesia tópica (colírio)</span>
                    </li>
                  </ul>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-6 w-6 text-medical-secondary" />
                      <span>Benefícios da Cirurgia</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-medical-secondary" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="bg-medical-muted rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-semibold text-medical-primary mb-6 text-center">
                Como é o Procedimento?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-medical-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="font-semibold text-medical-primary mb-2">Preparação</h3>
                  <p className="text-sm text-muted-foreground">
                    Aplicação de colírio anestésico e dilatação da pupila
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-medical-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="font-semibold text-medical-primary mb-2">Cirurgia</h3>
                  <p className="text-sm text-muted-foreground">
                    Remoção da catarata e implante da lente intraocular
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-medical-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-medical-primary">3</span>
                  </div>
                  <h3 className="font-semibold text-medical-primary mb-2">Recuperação</h3>
                  <p className="text-sm text-muted-foreground">
                    Acompanhamento pós-operatório e melhora gradual da visão
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold text-medical-primary mb-4">
                Pronto para recuperar sua visão?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Agende uma consulta para avaliação e descubra como a cirurgia de catarata 
                pode melhorar sua qualidade de vida.
              </p>
              <Button size="lg" className="bg-gradient-primary">
                Agendar Consulta
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

export default Catarata;
