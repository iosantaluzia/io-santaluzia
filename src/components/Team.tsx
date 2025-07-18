import { Award, GraduationCap, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Team = () => {
  const doctors = [
    {
      name: "Dr. Carlos Silva",
      specialty: "Cirurgia de Catarata e Retina",
      experience: "15 anos",
      education: "USP - Faculdade de Medicina",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Dra. Ana Santos",
      specialty: "Glaucoma e Córnea",
      experience: "12 anos",
      education: "UNICAMP - Residência em Oftalmologia",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Dr. Roberto Lima",
      specialty: "Cirurgia Refrativa",
      experience: "10 anos",
      education: "UFC - Especialização em Laser",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face"
    }
  ];

  const stats = [
    { number: "15+", label: "Anos de Experiência", icon: <Clock className="h-6 w-6" /> },
    { number: "10k+", label: "Cirurgias Realizadas", icon: <Award className="h-6 w-6" /> },
    { number: "5", label: "Especialistas", icon: <GraduationCap className="h-6 w-6" /> }
  ];

  return (
    <section id="equipe" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-medical-secondary uppercase tracking-wider mb-4">
            Nossa Equipe
          </h2>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-medical-primary mb-6">
            Especialistas{" "}
            <span className="text-medical-secondary">Qualificados</span>
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Nossa equipe é formada por oftalmologistas experientes e especializados, 
            comprometidos em oferecer o melhor cuidado para a saúde dos seus olhos.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-2xl bg-medical-muted"
            >
              <div className="w-12 h-12 bg-medical-primary rounded-xl mx-auto mb-4 flex items-center justify-center text-white">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-medical-primary mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor, index) => (
            <Card 
              key={index}
              className="group overflow-hidden border-0 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-medical-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h4 className="text-xl font-semibold text-medical-primary mb-2">
                  {doctor.name}
                </h4>
                <p className="text-medical-secondary font-medium mb-3">
                  {doctor.specialty}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    {doctor.experience} de experiência
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    {doctor.education}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Values */}
        <div className="mt-16 bg-gradient-accent rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h4 className="text-2xl md:text-3xl font-serif font-bold text-medical-primary mb-4">
              Nossos Valores
            </h4>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Baseamos nossa prática em princípios sólidos que orientam cada atendimento
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-medical-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h5 className="font-semibold text-medical-primary mb-2">Excelência</h5>
              <p className="text-sm text-muted-foreground">
                Compromisso com a qualidade e resultados superiores em todos os procedimentos
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-medical-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h5 className="font-semibold text-medical-primary mb-2">Conhecimento</h5>
              <p className="text-sm text-muted-foreground">
                Atualização constante com as mais modernas técnicas e tecnologias
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-medical-accent rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-medical-primary" />
              </div>
              <h5 className="font-semibold text-medical-primary mb-2">Dedicação</h5>
              <p className="text-sm text-muted-foreground">
                Cuidado personalizado e atenção integral a cada paciente
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;