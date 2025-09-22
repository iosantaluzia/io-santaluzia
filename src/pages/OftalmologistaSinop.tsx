import React from 'react';
import NavigationHeader from "@/components/NavigationHeader";
import SEOStructuredData from "@/components/SEOStructuredData";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Eye, 
  Award, 
  MapPin, 
  Clock, 
  Phone, 
  Calendar,
  CheckCircle,
  Star,
  Instagram,
  Facebook
} from 'lucide-react';
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

const OftalmologistaSinop = () => {
  const { trackAppointmentRequest, trackPhoneCall } = useGoogleAnalytics('GA_MEASUREMENT_ID');

  const handleAppointmentClick = () => {
    trackAppointmentRequest();
    window.open('https://wa.me/5566997215000?text=Olá! Gostaria de agendar uma consulta oftalmológica.', '_blank');
  };

  const handlePhoneClick = () => {
    trackPhoneCall('+55 66 99721-5000');
    window.location.href = 'tel:+5566997215000';
  };

  const specialties = [
    'Cirurgia de Catarata',
    'Cirurgia Refrativa',
    'Tratamento de Ceratocone', 
    'Retina e Vítreo',
    'Glaucoma',
    'Lentes de Contato Especiais',
    'Exames Oftalmológicos Completos',
    'Emergências Oftalmológicas'
  ];

  const advantages = [
    'Tecnologia de última geração',
    'Equipe médica especializada',
    'Atendimento humanizado',
    'Localização central em Sinop',
    'Convênios aceitos',
    'Plantão para emergências',
    'Exames no mesmo local',
    'Pós-operatório acompanhado'
  ];

  return (
    <>
      <SEOStructuredData 
        data={{
          "name": "Oftalmologista em Sinop - Instituto de Olhos Santa Luzia",
          "headline": "Oftalmologista Especializado em Sinop/MT - Cirurgia de Catarata e Refrativa",
          "description": "Encontre o melhor oftalmologista em Sinop/MT. Especialistas em cirurgia de catarata, cirurgia refrativa, ceratocone e exames oftalmológicos completos.",
        }}
      />
      
      <div className="min-h-screen">
        <NavigationHeader showLogo={true} />
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-medical-primary to-medical-secondary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-sans text-medical-primary mb-8">
                Oftalmologista Especialista em Sinop/MT
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Cuidados oftalmológicos de excelência com tecnologia de ponta no coração de Mato Grosso
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleAppointmentClick}
                  className="bg-white text-medical-primary hover:bg-medical-muted text-lg px-8 py-4"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar Consulta
                </Button>
                <Button 
                  onClick={handlePhoneClick}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-medical-primary text-lg px-8 py-4"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  (66) 99721-5000
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Location Info */}
        <section className="py-16 bg-medical-muted">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardContent className="p-6">
                  <MapPin className="w-12 h-12 text-medical-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Localização Central</h3>
                  <p className="text-medical-secondary">Avenida dos Tarumãs, 930<br />Sinop/MT - CEP: 78550-001</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <Clock className="w-12 h-12 text-medical-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Horários</h3>
                  <p className="text-medical-secondary">Segunda à Sexta: 8h às 18h<br />Sábado: 8h às 12h</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <Award className="w-12 h-12 text-medical-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Excelência</h3>
                  <p className="text-medical-secondary">Mais de 20 anos cuidando<br />da saúde ocular em Sinop</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Specialties */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-medical-primary mb-4">
                  Especialidades Oftalmológicas
                </h2>
                <p className="text-lg text-medical-secondary max-w-2xl mx-auto">
                  Oferecemos tratamentos completos para todas as condições oftalmológicas com tecnologia de última geração
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {specialties.map((specialty, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <Eye className="w-8 h-8 text-medical-primary mx-auto mb-3" />
                      <h3 className="font-semibold text-medical-primary">{specialty}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-medical-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-medical-primary mb-4">
                  Por Que Escolher o Instituto de Olhos Santa Luzia?
                </h2>
                <p className="text-lg text-medical-secondary max-w-2xl mx-auto">
                  Somos referência em oftalmologia em Sinop e região, oferecendo o que há de mais moderno em cuidados oculares
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold text-medical-primary mb-6">Nossas Vantagens</h3>
                  <div className="space-y-4">
                    {advantages.map((advantage, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                        <span className="text-medical-secondary">{advantage}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="p-6">
                  <div className="text-center">
                    <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-medical-primary mb-4">
                      Avaliação dos Pacientes
                    </h3>
                    <div className="flex justify-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-6 h-6 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-medical-secondary italic">
                      "Excelente atendimento e profissionais muito competentes. Recomendo!"
                    </p>
                    <p className="text-sm text-medical-secondary mt-2">- Paciente verificado</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-medical-primary to-medical-secondary text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Agende Sua Consulta Hoje Mesmo
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Não deixe problemas de visão afetarem sua qualidade de vida. Nossa equipe está pronta para cuidar de você.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleAppointmentClick}
                  className="bg-white text-medical-primary hover:bg-medical-muted text-lg px-8 py-4"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendar pelo WhatsApp
                </Button>
                <Button 
                  onClick={handlePhoneClick}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-medical-primary text-lg px-8 py-4"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Ligar Agora
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Footer
          logo={<img src="/lovable-uploads/26442ffb-6359-4e38-a0f7-eaddfc7505f1.png" alt="Instituto de Olhos Santa Luzia" className="h-28 w-auto brightness-0 invert mx-auto" />}
          brandName=""
          socialLinks={[
            { icon: <Instagram className="h-5 w-5" />, href: "https://www.instagram.com/io.santaluzia/", label: "Instagram" },
            { icon: <Facebook className="h-5 w-5" />, href: "https://www.facebook.com/institudodeolhossantaluzia", label: "Facebook" }
          ]}
          mainLinks={[
            { href: "/instituto", label: "O Instituto" },
            { href: "/corpo-clinico", label: "Corpo Clínico" },
            { href: "/exames", label: "Exames" },
            { href: "/catarata", label: "Catarata" },
            { href: "/cirurgia-refrativa", label: "Cirurgia Refrativa" },
            { href: "/ceratocone", label: "Ceratocone" },
            { href: "/artigos", label: "Artigos" }
          ]}
          legalLinks={[]}
          copyright={{
            text: "",
            license: "Avenida dos Tarumãs, 930 - Sinop/MT - CEP: 78550-001 | +55 66 99721-5000"
          }}
        />
      </div>
    </>
  );
};

export default OftalmologistaSinop;