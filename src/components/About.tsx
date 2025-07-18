import { CheckCircle, Users, Microscope, Calendar } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Equipe Especializada",
      description: "Oftalmologistas experientes e especializados em diversas áreas"
    },
    {
      icon: <Microscope className="h-6 w-6" />,
      title: "Tecnologia Avançada",
      description: "Equipamentos de última geração para diagnósticos precisos"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Atendimento Ágil",
      description: "Consultas e procedimentos com agilidade e qualidade"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Resultados Comprovados",
      description: "Milhares de pacientes satisfeitos ao longo dos anos"
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-medical-secondary uppercase tracking-wider">
                Sobre Nós
              </h2>
              <h3 className="text-3xl md:text-4xl font-serif font-bold text-medical-primary">
                Mais de 15 anos cuidando da{" "}
                <span className="text-medical-secondary">sua visão</span>
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                O Instituto de Olhos Santa Luzia é uma referência em oftalmologia no Ceará, 
                oferecendo atendimento humanizado e tratamentos inovadores. Nossa missão é 
                preservar e restaurar a visão de nossos pacientes com excelência e dedicação.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-medical-primary mb-2">Nossa Missão</h4>
                <p className="text-muted-foreground">
                  Proporcionar cuidados oftalmológicos de excelência, utilizando tecnologia 
                  de ponta e uma abordagem humanizada para melhorar a qualidade de vida 
                  através da saúde ocular.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-medical-primary mb-2">Nossa Visão</h4>
                <p className="text-muted-foreground">
                  Ser reconhecido como o principal centro oftalmológico do Nordeste, 
                  referência em inovação, qualidade e atendimento humanizado.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-3 p-4 rounded-xl bg-medical-muted"
                >
                  <div className="w-10 h-10 bg-medical-primary rounded-lg flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <div>
                    <h5 className="font-semibold text-medical-primary mb-1">
                      {feature.title}
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative">
            <div className="bg-gradient-accent rounded-3xl p-8 shadow-strong">
              <div className="bg-background rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-medical-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                  <img 
                    src="/lovable-uploads/a89a1d61-75ee-4ff2-8233-42d51ff14f18.png" 
                    alt="Santa Luzia" 
                    className="w-16 h-16 object-contain"
                  />
                </div>
                
                <h4 className="text-xl font-serif font-semibold text-medical-primary mb-4">
                  Instituto de Olhos Santa Luzia
                </h4>
                
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-medical-primary mb-2">15+</div>
                    <div className="text-sm text-muted-foreground">Anos de Tradição</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-medical-primary mb-2">10k+</div>
                    <div className="text-sm text-muted-foreground">Vidas Transformadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-medical-primary mb-2">5</div>
                    <div className="text-sm text-muted-foreground">Especialistas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-medical-primary mb-2">95%</div>
                    <div className="text-sm text-muted-foreground">Satisfação</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-medical-secondary rounded-full opacity-30" />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-medical-accent rounded-full opacity-40" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;