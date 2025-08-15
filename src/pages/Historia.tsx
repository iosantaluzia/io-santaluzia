
import React from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { Footer } from '@/components/ui/footer';
import Timeline from '@/components/Timeline';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import { Instagram, Facebook } from 'lucide-react';

const Historia = () => {
  // Dados do timeline para a história do instituto
  const timelineData = [
    {
      title: '2009',
      content: (
        <div className="text-muted-foreground">
          <h3 className="text-lg font-semibold text-medical-primary mb-2">Fundação do Instituto</h3>
          <p>O Instituto de Olhos Santa Luzia foi fundado com o compromisso de oferecer cuidados oftalmológicos de excelência.</p>
        </div>
      )
    },
    {
      title: '2012',
      content: (
        <div className="text-muted-foreground">
          <h3 className="text-lg font-semibold text-medical-primary mb-2">Primeira Expansão</h3>
          <p>Ampliação das instalações e incorporação de novos equipamentos de última geração.</p>
        </div>
      )
    },
    {
      title: '2015',
      content: (
        <div className="text-muted-foreground">
          <h3 className="text-lg font-semibold text-medical-primary mb-2">Centro de Cirurgias</h3>
          <p>Inauguração do centro cirúrgico especializado em cirurgias oftalmológicas.</p>
        </div>
      )
    },
    {
      title: '2018',
      content: (
        <div className="text-muted-foreground">
          <h3 className="text-lg font-semibold text-medical-primary mb-2">Tecnologia de Ponta</h3>
          <p>Incorporação de equipamentos de diagnóstico avançado, incluindo OCT e aberrômetro.</p>
        </div>
      )
    },
    {
      title: '2020',
      content: (
        <div className="text-muted-foreground">
          <h3 className="text-lg font-semibold text-medical-primary mb-2">Telemedicina</h3>
          <p>Implementação de serviços de telemedicina e portal digital para pacientes.</p>
        </div>
      )
    },
    {
      title: '2024',
      content: (
        <div className="text-muted-foreground">
          <h3 className="text-lg font-semibold text-medical-primary mb-2">15 Anos de Excelência</h3>
          <p>Celebrando 15 anos de dedicação à saúde visual no Ceará.</p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader showLogo={true} />
      <FloatingWhatsAppButton />
      
      <main className="pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-medical-primary mb-6">
                Nossa História
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Conheça a trajetória do Instituto de Olhos Santa Luzia e como nos tornamos 
                referência em cuidados oftalmológicos no Ceará.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-12">
              <h2 className="text-2xl font-semibold text-medical-primary mb-4">
                15 Anos de Excelência
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Fundado com o compromisso de oferecer cuidados oftalmológicos de excelência, 
                o Instituto de Olhos Santa Luzia tem se dedicado ao longo de mais de uma década 
                a proporcionar saúde visual com tecnologia de ponta e atendimento humanizado.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nossa missão sempre foi clara: cuidar da visão de nossos pacientes com a mais 
                alta qualidade técnica, combinada com o carinho e atenção que cada pessoa merece.
              </p>
            </div>

            <Timeline data={timelineData} />
          </div>
        </div>
      </main>
      
      <Footer
        logo={<img src="/lovable-uploads/26442ffb-6359-4e38-a0f7-eaddfc7505f1.png" alt="Instituto de Olhos Santa Luzia" className="h-12 w-auto brightness-0 invert" />}
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
          text: "© 2024 Instituto de Olhos Santa Luzia",
          license: "Avenida dos Tarumãs, 930 - Sinop/MT - CEP: 78550-001 | +55 66 99721-5000"
        }}
      />
    </div>
  );
};

export default Historia;
