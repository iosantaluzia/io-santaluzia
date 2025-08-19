import React from 'react';
import NavigationHeader from '@/components/NavigationHeader';
import { Footer } from '@/components/ui/footer';
import Timeline from '@/components/Timeline';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import { Instagram, Facebook } from 'lucide-react';

const Historia = () => {
  // Timeline real do Instituto de Olhos Santa Luzia
  const timelineData = [
    {
      title: '2024',
      content: (
        <div>
          <div className="bg-medical-accent/50 p-4 rounded-lg mb-4">
            <p className="text-gray-800 text-sm md:text-base font-semibold">
              Inovação Tecnológica em Cirurgia Refrativa
            </p>
          </div>
          <p className="text-gray-700 text-sm md:text-base font-normal mb-4">
            Em 2024, adicionamos o primeiro laser de cirurgia refrativa (MEL 90, da empresa Zeiss) 
            com a tecnologia Presbyond® da região, fornecendo o que há de mais avançado em cirurgia 
            refrativa para nossos pacientes.
          </p>
          <p className="text-gray-700 text-sm md:text-base font-normal mb-6">
            Esta tecnologia revolucionária permite tratamentos mais precisos e personalizados, 
            estabelecendo um novo padrão de excelência em correção visual na região.
          </p>
          <div className="mb-4">
            <div className="flex gap-2 items-center text-gray-600 text-sm md:text-base mb-2">
              🔬 Primeiro MEL 90 Zeiss da região
            </div>
            <div className="flex gap-2 items-center text-gray-600 text-sm md:text-base mb-2">
              ⚡ Tecnologia Presbyond® avançada
            </div>
            <div className="flex gap-2 items-center text-gray-600 text-sm md:text-base mb-2">
              👁️ Cirurgia refrativa de última geração
            </div>
            <div className="flex gap-2 items-center text-gray-600 text-sm md:text-base mb-4">
              📈 Novo padrão de excelência regional
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src="/lovable-uploads/Gemini_Generated_Image_mhsbckmhsbckmhsb.png"
              alt="MEL 90 Zeiss - Laser de Cirurgia Refrativa"
              className="rounded-lg shadow-medium w-full max-w-md h-auto object-cover"
            />
          </div>
        </div>
      )
    },
    {
      title: '2023-2024',
      content: (
        <div>
          <div className="bg-medical-accent/50 p-4 rounded-lg mb-4">
            <p className="text-gray-800 text-sm md:text-base font-semibold">
              Ampliação e Crescimento do Instituto
            </p>
          </div>
          <p className="text-gray-700 text-sm md:text-base font-normal mb-6">
            Em 2023 fizemos uma ampliação do nosso espaço, coincidindo com a chegada do Dr. Matheus Roque, 
            que veio contribuir com os atendimentos de Oftalmologia Geral e Pediátrico. Uma nova fase de 
            crescimento e expertise para melhor atender nossos pacientes.
          </p>
          <div className="mb-6">
            <div className="flex gap-2 items-center text-gray-600 text-sm md:text-base mb-2">
              👨‍⚕️ Chegada do Dr. Matheus Roque
            </div>
            <div className="flex gap-2 items-center text-gray-600 text-sm md:text-base mb-2">
              🏥 Ampliação do espaço físico
            </div>
            <div className="flex gap-2 items-center text-gray-600 text-sm md:text-base mb-2">
              👶 Início dos atendimentos pediátricos
            </div>
            <div className="flex gap-2 items-center text-gray-600 text-sm md:text-base">
              🔬 Modernização dos equipamentos
            </div>
          </div>
        </div>
      )
    },
    {
      title: '2014-2023',
      content: (
        <div>
          <div className="bg-medical-accent/50 p-4 rounded-lg mb-4">
            <p className="text-gray-800 text-sm md:text-base font-semibold">
              Uma Década de Excelência
            </p>
          </div>
          <p className="text-gray-700 text-sm md:text-base font-normal mb-4">
            Desde nossa inauguração em maio de 2014, já atendemos mais de 15.000 pacientes e realizamos 
            mais de 2.000 cirurgias, incluindo catarata, pterígio, ceratocone, tumores de superfície 
            ocular e cirurgia refrativa.
          </p>
          <p className="text-gray-700 text-sm md:text-base font-normal mb-6">
            Durante esses anos, mantivemos nossa parceria e amizade com o Hospital Dois Pinheiros, 
            sempre buscando oferecer o melhor atendimento em oftalmologia com tecnologia de ponta.
          </p>
          <div className="mb-6">
            <div className="flex gap-2 items-center text-gray-600 text-sm md:text-base mb-2">
              👥 +15.000 pacientes atendidos
            </div>
            <div className="flex gap-2 items-center text-gray-600 text-sm md:text-base mb-2">
              ⚕️ +2.000 cirurgias realizadas
            </div>
            <div className="flex gap-2 items-center text-gray-600 text-sm md:text-base mb-2">
              🏥 Parceria Hospital Dois Pinheiros
            </div>
            <div className="flex gap-2 items-center text-gray-600 text-sm md:text-base">
              💎 Excelência em atendimento
            </div>
          </div>
        </div>
      )
    },
    {
      title: '2014',
      content: (
        <div>
          <div className="bg-medical-accent/50 p-4 rounded-lg mb-4">
            <p className="text-gray-800 text-sm md:text-base font-semibold">
              Fundação do Instituto
            </p>
          </div>
          <p className="text-gray-700 text-sm md:text-base font-normal mb-6">
            O Instituto de Olhos Santa Luzia foi inaugurado em maio de 2014 pela Dra. Fabiola Roque. 
            Inicialmente chamado Instituto de Olhos Dois Pinheiros, sempre fizemos questão da parceria 
            e amizade com o Hospital Dois Pinheiros, localizado próximo a nós.
          </p>
          <p className="text-gray-700 text-sm md:text-base font-normal mb-4">
            Nosso compromisso desde o primeiro dia: oferecer um atendimento respeitoso, técnico e 
            humanizado, com as mais modernas tecnologias e aparelhos para auxílio em diferentes diagnósticos.
          </p>
          <div className="bg-gradient-to-r from-medical-accent to-medical-muted p-4 rounded-lg border border-medical-secondary">
            <p className="text-medical-primary text-sm md:text-base font-medium text-center italic">
              "Para nós, é uma honra servir!"
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader showLogo={true} />
      <FloatingWhatsAppButton />
      
      <main className="pt-32">
        <div className="max-w-4xl mx-auto px-4">
          <Timeline data={timelineData} />
        </div>
      </main>
      
      <Footer 
        logo={
          <img 
            src="/lovable-uploads/26442ffb-6359-4e38-a0f7-eaddfc7505f1.png" 
            alt="Instituto de Olhos Santa Luzia" 
            className="h-12 w-auto brightness-0 invert" 
          />
        } 
        brandName="" 
        socialLinks={[
          {
            icon: <Instagram className="h-5 w-5" />,
            href: "https://www.instagram.com/io.santaluzia/",
            label: "Instagram"
          }, 
          {
            icon: <Facebook className="h-5 w-5" />,
            href: "https://www.facebook.com/institudodeolhossantaluzia",
            label: "Facebook"
          }
        ]} 
        mainLinks={[
          {
            href: "/instituto",
            label: "O Instituto"
          }, 
          {
            href: "/corpo-clinico",
            label: "Corpo Clínico"
          }, 
          {
            href: "/exames",
            label: "Exames"
          }, 
          {
            href: "/catarata",
            label: "Catarata"
          }, 
          {
            href: "/cirurgia-refrativa",
            label: "Cirurgia Refrativa"
          }, 
          {
            href: "/ceratocone",
            label: "Ceratocone"
          }, 
          {
            href: "/artigos",
            label: "Artigos"
          }
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
