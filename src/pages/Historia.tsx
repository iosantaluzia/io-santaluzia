
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Timeline from '@/components/Timeline';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';

const Historia = () => {
  // Dados do timeline para a história do instituto
  const timelineData = [
    {
      year: '2009',
      title: 'Fundação do Instituto',
      description: 'O Instituto de Olhos Santa Luzia foi fundado com o compromisso de oferecer cuidados oftalmológicos de excelência.'
    },
    {
      year: '2012',
      title: 'Primeira Expansão',
      description: 'Ampliação das instalações e incorporação de novos equipamentos de última geração.'
    },
    {
      year: '2015',
      title: 'Centro de Cirurgias',
      description: 'Inauguração do centro cirúrgico especializado em cirurgias oftalmológicas.'
    },
    {
      year: '2018',
      title: 'Tecnologia de Ponta',
      description: 'Incorporação de equipamentos de diagnóstico avançado, incluindo OCT e aberrômetro.'
    },
    {
      year: '2020',
      title: 'Telemedicina',
      description: 'Implementação de serviços de telemedicina e portal digital para pacientes.'
    },
    {
      year: '2024',
      title: '15 Anos de Excelência',
      description: 'Celebrando 15 anos de dedicação à saúde visual no Ceará.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
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
      
      <Footer />
    </div>
  );
};

export default Historia;
