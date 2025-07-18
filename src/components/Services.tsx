import { Eye, Glasses, Zap, Shield, Heart, Microscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Services = () => {
  const services = [
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Consultas Oftalmológicas",
      description: "Avaliação completa da saúde ocular com exames detalhados e diagnósticos precisos.",
      features: ["Exame de fundo de olho", "Medição da pressão ocular", "Avaliação da acuidade visual"]
    },
    {
      icon: <Glasses className="h-8 w-8" />,
      title: "Cirurgia de Catarata",
      description: "Procedimento moderno para remoção da catarata com implante de lentes intraoculares.",
      features: ["Técnica facoemulsificação", "Lentes premium", "Recuperação rápida"]
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Cirurgia Refrativa",
      description: "Correção de miopia, hipermetropia e astigmatismo com tecnologia a laser.",
      features: ["LASIK", "PRK", "Avaliação pré-operatória"]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Glaucoma",
      description: "Diagnóstico precoce e tratamento especializado para preservação da visão.",
      features: ["Tonometria", "Campo visual", "Tratamento clínico e cirúrgico"]
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Retina",
      description: "Tratamento de doenças da retina com tecnologias avançadas.",
      features: ["Fotocoagulação a laser", "Injeções intravítreas", "Vitrectomia"]
    },
    {
      icon: <Microscope className="h-8 w-8" />,
      title: "Exames Especializados",
      description: "Diagnósticos precisos com equipamentos de última geração.",
      features: ["OCT", "Angiofluoresceinografia", "Ultrassom ocular"]
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-medical-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-medical-secondary uppercase tracking-wider mb-4">
            Nossos Serviços
          </h2>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-medical-primary mb-6">
            Cuidados Oftalmológicos{" "}
            <span className="text-medical-secondary">Completos</span>
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Oferecemos uma ampla gama de serviços oftalmológicos, desde consultas de rotina 
            até procedimentos cirúrgicos complexos, sempre com excelência e tecnologia de ponta.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-medium transition-all duration-300 border-0 bg-background"
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl mx-auto mb-4 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-medical-primary">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex}
                      className="flex items-center text-sm text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 bg-medical-secondary rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-primary rounded-3xl p-8 md:p-12 text-white shadow-strong">
            <h4 className="text-2xl md:text-3xl font-serif font-bold mb-4">
              Precisa de uma consulta?
            </h4>
            <p className="text-lg mb-8 opacity-90">
              Agende sua consulta e cuide da saúde dos seus olhos com nossa equipe especializada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-background text-medical-primary px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-colors">
                Agendar Consulta
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-medical-primary transition-colors">
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;