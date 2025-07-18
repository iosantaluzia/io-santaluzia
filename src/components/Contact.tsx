import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Telefone",
      details: ["(85) 3456-7890", "(85) 9 8765-4321"],
      action: "Ligar Agora"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: ["contato@santaoftalmo.com.br", "agendamento@santaoftalmo.com.br"],
      action: "Enviar Email"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Endereço",
      details: ["Rua Silva Paulet, 1218", "Aldeota, Fortaleza - CE"],
      action: "Ver no Mapa"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Horário de Funcionamento",
      details: ["Seg - Sex: 7h às 18h", "Sáb: 7h às 12h"],
      action: "Agendar"
    }
  ];

  return (
    <section id="contato" className="py-20 bg-medical-muted">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-medical-secondary uppercase tracking-wider mb-4">
            Entre em Contato
          </h2>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-medical-primary mb-6">
            Agende sua{" "}
            <span className="text-medical-secondary">consulta</span>
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Estamos prontos para cuidar da saúde dos seus olhos. Entre em contato 
            conosco para agendar sua consulta ou esclarecer suas dúvidas.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h4 className="text-2xl font-serif font-semibold text-medical-primary mb-6">
                Informações de Contato
              </h4>
              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="border-0 shadow-soft">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-medical-primary rounded-xl flex items-center justify-center text-white">
                          {info.icon}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-medical-primary mb-2">
                            {info.title}
                          </h5>
                          {info.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-muted-foreground mb-1">
                              {detail}
                            </p>
                          ))}
                          <button className="text-medical-secondary font-medium text-sm hover:underline mt-2">
                            {info.action}
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-primary rounded-2xl p-6 text-white">
              <h5 className="text-xl font-semibold mb-4">Atendimento Rápido</h5>
              <p className="mb-6 opacity-90">
                Para emergências oftalmológicas ou agendamentos urgentes:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="secondary" className="bg-white text-medical-primary hover:bg-gray-100">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergência
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-medical-primary">
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle className="text-2xl font-serif text-medical-primary">
                  Envie uma Mensagem
                </CardTitle>
                <p className="text-muted-foreground">
                  Preencha o formulário e entraremos em contato em breve
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-medical-primary mb-2 block">
                      Nome Completo
                    </label>
                    <Input placeholder="Seu nome completo" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-medical-primary mb-2 block">
                      Telefone
                    </label>
                    <Input placeholder="(85) 9 9999-9999" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-medical-primary mb-2 block">
                    Email
                  </label>
                  <Input type="email" placeholder="seu@email.com" />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-medical-primary mb-2 block">
                    Tipo de Consulta
                  </label>
                  <select className="w-full p-3 border border-input rounded-lg bg-background">
                    <option>Consulta de Rotina</option>
                    <option>Cirurgia de Catarata</option>
                    <option>Cirurgia Refrativa</option>
                    <option>Tratamento de Glaucoma</option>
                    <option>Exames Especializados</option>
                    <option>Outros</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-medical-primary mb-2 block">
                    Mensagem
                  </label>
                  <Textarea 
                    placeholder="Descreva seus sintomas ou dúvidas..." 
                    rows={4}
                  />
                </div>
                
                <Button className="w-full bg-gradient-primary">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Ao enviar esta mensagem, você concorda com nossos termos de privacidade.
                  Responderemos em até 24 horas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="border-0 shadow-medium overflow-hidden">
            <div className="bg-medical-primary text-white p-6">
              <h4 className="text-xl font-semibold mb-2">Nossa Localização</h4>
              <p className="opacity-90">
                Estamos localizados no coração da Aldeota, em Fortaleza, 
                com fácil acesso e estacionamento disponível.
              </p>
            </div>
            <div className="h-64 bg-medical-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-medical-primary mx-auto mb-4" />
                <p className="text-medical-primary font-medium">
                  Rua Silva Paulet, 1218 - Aldeota
                </p>
                <p className="text-muted-foreground">
                  Fortaleza, Ceará
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;