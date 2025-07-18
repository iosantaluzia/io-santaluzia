import { ArrowRight, Eye, Heart, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="inicio" className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-medical-secondary animate-pulse" />
        <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-medical-accent animate-pulse delay-300" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-medical-primary animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-medical-primary leading-tight">
                Cuidamos da sua{" "}
                <span className="text-medical-secondary font-script">visão</span>{" "}
                com excelência
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                No Instituto de Olhos Santa Luzia, oferecemos cuidados oftalmológicos 
                especializados com tecnologia de ponta e uma equipe altamente qualificada 
                para garantir a saúde dos seus olhos.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-medical-primary">15+</div>
                <div className="text-sm text-muted-foreground">Anos de Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-medical-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Pacientes Atendidos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-medical-primary">95%</div>
                <div className="text-sm text-muted-foreground">Satisfação</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-primary group">
                Agendar Consulta
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-medical-primary text-medical-primary">
                Conheça Nossa Equipe
              </Button>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="bg-gradient-accent rounded-3xl p-8 shadow-strong">
              <div className="grid grid-cols-2 gap-6">
                {/* Feature cards */}
                <div className="bg-background rounded-2xl p-6 shadow-soft">
                  <div className="w-12 h-12 bg-medical-primary rounded-xl flex items-center justify-center mb-4">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-medical-primary mb-2">Exames Especializados</h3>
                  <p className="text-sm text-muted-foreground">Tecnologia avançada para diagnósticos precisos</p>
                </div>

                <div className="bg-background rounded-2xl p-6 shadow-soft">
                  <div className="w-12 h-12 bg-medical-secondary rounded-xl flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-medical-primary mb-2">Cuidado Humanizado</h3>
                  <p className="text-sm text-muted-foreground">Atendimento personalizado e acolhedor</p>
                </div>

                <div className="bg-background rounded-2xl p-6 shadow-soft col-span-2">
                  <div className="w-12 h-12 bg-medical-accent rounded-xl flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-medical-primary" />
                  </div>
                  <h3 className="font-semibold text-medical-primary mb-2">Excelência Reconhecida</h3>
                  <p className="text-sm text-muted-foreground">
                    Referência em oftalmologia no Ceará, com equipe especializada e resultados comprovados
                  </p>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-medical-primary rounded-full opacity-20 animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-medical-secondary rounded-full opacity-30 animate-pulse delay-700" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;