
import React from "react";
import NavigationHeader from "@/components/NavigationHeader";
import Timeline from "@/components/Timeline";

const Instituto = () => {
  const timelineData = [
    {
      title: "2023-2024",
      content: (
        <div>
          <p className="text-medical-primary text-xs md:text-sm font-normal mb-4">
            Ampliação e Crescimento do Instituto
          </p>
          <p className="text-medical-primary text-xs md:text-sm font-normal mb-6">
            Em 2023 fizemos uma ampliação do nosso espaço, coincidindo com a chegada do Dr. Matheus Roque, que veio contribuir com os atendimentos de Oftalmologia Geral e Pediátrico. Uma nova fase de crescimento e expertise para melhor atender nossos pacientes.
          </p>
          <div className="mb-6">
            <div className="flex gap-2 items-center text-medical-secondary text-xs md:text-sm mb-2">
              👨‍⚕️ Chegada do Dr. Matheus Roque
            </div>
            <div className="flex gap-2 items-center text-medical-secondary text-xs md:text-sm mb-2">
              🏥 Ampliação do espaço físico
            </div>
            <div className="flex gap-2 items-center text-medical-secondary text-xs md:text-sm mb-2">
              👶 Início dos atendimentos pediátricos
            </div>
            <div className="flex gap-2 items-center text-medical-secondary text-xs md:text-sm">
              🔬 Modernização dos equipamentos
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2014-2023",
      content: (
        <div>
          <p className="text-medical-primary text-xs md:text-sm font-normal mb-4">
            Uma Década de Excelência
          </p>
          <p className="text-medical-primary text-xs md:text-sm font-normal mb-4">
            Desde nossa inauguração em maio de 2014, já atendemos mais de 15.000 pacientes e realizamos mais de 2.000 cirurgias, incluindo catarata, pterígio, ceratocone, tumores de superfície ocular e cirurgia refrativa.
          </p>
          <p className="text-medical-primary text-xs md:text-sm font-normal mb-6">
            Durante esses anos, mantivemos nossa parceria e amizade com o Hospital Dois Pinheiros, sempre buscando oferecer o melhor atendimento em oftalmologia com tecnologia de ponta.
          </p>
          <div className="mb-6">
            <div className="flex gap-2 items-center text-medical-secondary text-xs md:text-sm mb-2">
              👥 +15.000 pacientes atendidos
            </div>
            <div className="flex gap-2 items-center text-medical-secondary text-xs md:text-sm mb-2">
              ⚕️ +2.000 cirurgias realizadas
            </div>
            <div className="flex gap-2 items-center text-medical-secondary text-xs md:text-sm mb-2">
              🏥 Parceria Hospital Dois Pinheiros
            </div>
            <div className="flex gap-2 items-center text-medical-secondary text-xs md:text-sm">
              💎 Excelência em atendimento
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "2014",
      content: (
        <div>
          <p className="text-medical-primary text-xs md:text-sm font-normal mb-4">
            Fundação do Instituto
          </p>
          <p className="text-medical-primary text-xs md:text-sm font-normal mb-6">
            O Instituto de Olhos Santa Luzia foi inaugurado em maio de 2014 pela Dra. Fabiola Roque. Inicialmente chamado Instituto de Olhos Dois Pinheiros, sempre fizemos questão da parceria e amizade com o Hospital Dois Pinheiros, localizado próximo a nós.
          </p>
          <p className="text-medical-primary text-xs md:text-sm font-normal mb-4">
            Nosso compromisso desde o primeiro dia: oferecer um atendimento respeitoso, técnico e humanizado, com as mais modernas tecnologias e aparelhos para auxílio em diferentes diagnósticos.
          </p>
          <div className="bg-gradient-to-r from-medical-accent to-medical-muted p-4 rounded-lg border border-medical-secondary">
            <p className="text-medical-primary text-xs md:text-sm font-medium text-center italic">
              "Para nós, é uma honra servir!"
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <NavigationHeader showLogo={true} />
      <Timeline data={timelineData} />
    </div>
  );
};

export default Instituto;
