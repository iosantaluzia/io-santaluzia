
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Zap, CheckCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const CirurgiaRefrativa = () => {
  const conditions = [
    {
      name: "Miopia",
      description: "Dificuldade para enxergar de longe",
      icon: <Eye className="h-6 w-6" />
    },
    {
      name: "Hipermetropia", 
      description: "Dificuldade para enxergar de perto",
      icon: <Eye className="h-6 w-6" />
    },
    {
      name: "Astigmatismo",
      description: "Visão distorcida em todas as distâncias",
      icon: <Eye className="h-6 w-6" />
    },
    {
      name: "Presbiopia",
      description: "Vista cansada relacionada à idade",
      icon: <Eye className="h-6 w-6" />
    }
  ];

  const benefits = [
    "Liberdade dos óculos e lentes de contato",
    "Melhora na qualidade de vida",
    "Maior confiança e autoestima",
    "Praticidade no dia a dia",
    "Economia a longo prazo",
    "Resultados duradouros"
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-medical-primary mb-6">
                Cirurgia Refrativa
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Liberte-se dos óculos e lentes de contato com segurança e precisão. 
                Tecnologia a laser de última geração para correção visual.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-3xl font-semibold text-medical-primary mb-6">
                  O que é Cirurgia Refrativa?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  A cirurgia refrativa é um procedimento que utiliza tecnologia laser 
                  para corrigir erros refrativos como miopia, hipermetropia, 
                  astigmatismo e presbiopia.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  O procedimento remodela a córnea de forma precisa, permitindo que 
                  a luz seja focada corretamente na retina, resultando em visão nítida 
                  sem a necessidade de óculos ou lentes de contato.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {conditions.map((condition, index) => (
                    <Card key={index} className="bg-gradient-accent">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="text-medical-primary">
                            {condition.icon}
                          </div>
                          <h3 className="font-semibold text-medical-primary">
                            {condition.name}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {condition.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-medical-secondary rounded-2xl p-8 text-white">
                  <div className="flex items-center space-x-3 mb-6">
                    <Zap className="h-10 w-10" />
                    <h3 className="text-2xl font-semibold">Tecnologia LASIK</h3>
                  </div>
                  <p className="leading-relaxed mb-6">
                    Utilizamos a técnica LASIK (Laser-Assisted in Situ Keratomileusis), 
                    considerada o padrão ouro em cirurgia refrativa mundial.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Procedimento rápido (15 minutos)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Recuperação visual rápida</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Mínimo desconforto</span>
                    </li>
                  </ul>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-6 w-6 text-medical-primary" />
                      <span>Benefícios da Cirurgia</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-medical-primary" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="bg-medical-muted rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-semibold text-medical-primary mb-6 text-center">
                Etapas do Procedimento
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-medical-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="font-semibold text-medical-primary mb-2">Avaliação</h3>
                  <p className="text-sm text-muted-foreground">
                    Exames detalhados para determinar candidatura
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-medical-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="font-semibold text-medical-primary mb-2">Preparação</h3>
                  <p className="text-sm text-muted-foreground">
                    Aplicação de colírio anestésico
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-medical-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-medical-primary">3</span>
                  </div>
                  <h3 className="font-semibold text-medical-primary mb-2">Laser</h3>
                  <p className="text-sm text-muted-foreground">
                    Aplicação precisa do laser na córnea
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-medical-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">4</span>
                  </div>
                  <h3 className="font-semibold text-medical-primary mb-2">Recuperação</h3>
                  <p className="text-sm text-muted-foreground">
                    Acompanhamento e melhora gradual
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-semibold text-medical-primary mb-4">
                Você é candidato à cirurgia refrativa?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Agende uma avaliação completa para descobrir se você pode se livrar 
                dos óculos e lentes de contato de forma segura e definitiva.
              </p>
              <Button size="lg" className="bg-gradient-primary">
                Agendar Avaliação
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

export default CirurgiaRefrativa;
