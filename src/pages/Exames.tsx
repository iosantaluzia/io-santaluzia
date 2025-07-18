
import React, { useState } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import ExamModal from "@/components/ExamModal";

const Exames = () => {
  const [selectedExam, setSelectedExam] = useState<any>(null);

  const exames = [
    {
      nome: "Microscopia Especular",
      imagem: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      descricao: "A microscopia especular de córnea é utilizada na oftalmologia para avaliar as células endoteliais da córnea, que são essenciais para a manutenção da transparência corneana.\n\nAo examinar as células endoteliais, os oftalmologistas podem avaliar a saúde da córnea, prever a resposta a tratamentos e monitorar a progressão de doenças ao longo do tempo.\n\nSuas indicações incluem avaliações pré e pós-operatória de cirurgias como: catarata, transplantes de córnea, indicado também para usuários crônicos de lentes de contato, implante de lentes intraoculares e no acompanhamento de doenças corneanas.\n\nÉ um exame indolor e de rápida execução. O paciente deve estar sem lentes de contato caso faça uso. Para sua realização é necessário apenas que o paciente fixe o olhar no alvo dentro do aparelho. Geralmente não necessita de acompanhantes."
    },
    {
      nome: "YAG Laser",
      imagem: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop",
      descricao: "O YAG laser é uma ferramenta versátil e amplamente utilizada em oftalmologia, utilizado para diversas funções.\n\nApós a cirurgia de catarata, uma fina membrana chamada de cápsula posterior pode se tornar opaca, causando visão turva. Utilizamos o YAG Laser para realizar uma limpeza desta membrana, que envolve a criação de uma abertura na cápsula para restaurar a visão.\n\nEm casos de glaucoma de ângulo estreito ou fechado, onde a drenagem do humor aquoso é prejudicada, uma iridotomia pode ser realizada para criar uma pequena abertura na íris, permitindo que o líquido flua adequadamente.\n\nEle é capaz fornecer tratamentos minimamente invasivos, indolores, com tempos de recuperação mais rápidos."
    },
    {
      nome: "Topografia Corneana",
      imagem: "https://images.unsplash.com/photo-1581093458791-9d42ed4c3d0e?w=400&h=300&fit=crop",
      descricao: "A topografia corneana é um procedimento oftalmológico utilizado para mapear a superfície da córnea, que é a parte transparente e externa do olho.\n\nA córnea desempenha um papel fundamental na refração da luz que entra no olho, ajudando a focalizar a imagem na retina, este exame auxilia no diagnóstico de doenças como astigmatismo, ceratocone, distrofias corneanas e irregularidades na superfície corneana."
    },
    {
      nome: "Pentacam",
      imagem: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop",
      descricao: "O Pentacam é um dispositivo de tomografia de coerência óptica (OCT) utilizado na oftalmologia para avaliar a estrutura e topografia da córnea e segmento anterior do olho.\n\nUtilizado para avaliação pré-operatória de cirurgias refrativas como o LASIK. É importante avaliar a espessura corneana, a topografia corneana e a curvatura da córnea para determinar a adequação do paciente para o procedimento.\n\nAuxilia no diagnóstico de ceratocone e outras ectasias corneanas por fornece mapas tridimensionais detalhados da córnea, ajudando os médicos a monitorar a progressão da doença e planejar intervenções adequadas.\n\nO Pentacam também é útil na avaliação pré-operatória de pacientes que serão submetidos à implantação de lentes intraoculares após a remoção da catarata."
    },
    {
      nome: "Aberrômetro",
      imagem: "https://images.unsplash.com/photo-1559757175-64ad86161d5b?w=400&h=300&fit=crop",
      descricao: "O aberrômetro, também conhecido como wavefront analyzer, é um instrumento utilizado na oftalmologia para medir as aberrações ópticas do olho. Essas aberrações são imperfeições na forma da córnea e do cristalino que podem afetar a qualidade da visão.\n\nAvaliação pré-operatória de cirurgias refrativas: Antes de realizar cirurgias refrativas como a LASIK (cirurgia refrativa a laser), o aberrômetro é utilizado para medir e quantificar as aberrações ópticas do olho.\n\nAlém de medir as aberrações ópticas, o aberrômetro também pode avaliar a qualidade da visão do paciente em condições específicas, como luz de dia, luz noturna e diferentes níveis de contraste. Isso pode ajudar os oftalmologistas a entender melhor as necessidades visuais do paciente e planejar o tratamento adequado."
    },
    {
      nome: "Campimetria",
      imagem: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      descricao: "A campimetria, também conhecida como exame de campo visual, é uma ferramenta fundamental na oftalmologia para avaliar a extensão e a sensibilidade da visão periférica e central de um paciente.\n\nEste exame é frequentemente utilizado para diagnosticar e monitorar uma variedade de condições oftalmológicas e neurológicas que afetam o campo visual, principalmente o glaucoma.\n\nA campimetria também é útil na avaliação de distúrbios neurológicos que afetam o campo visual, como lesões no nervo óptico, tumores cerebrais, acidentes vasculares cerebrais (AVCs) e esclerose múltipla. Bem como o monitoramento de doenças retinianas como a retinopatia diabética, degeneração macular e retinose pigmentar."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <NavigationHeader showLogo={true} />
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h1 className="text-3xl md:text-5xl font-serif text-medical-primary mb-8">
          Exames Complementares
        </h1>
        <p className="text-lg text-medical-secondary mb-12 max-w-3xl">
          No Instituto de Olhos Santa Luzia contamos com exames complementares necessários para seu diagnóstico, conheça-os abaixo:
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exames.map((exame, index) => (
            <div 
              key={index} 
              className="group cursor-pointer bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300"
              onClick={() => setSelectedExam(exame)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={exame.imagem}
                  alt={exame.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-medical-primary/80 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 right-4 text-white font-serif text-lg font-semibold">
                  {exame.nome}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ExamModal
        isOpen={!!selectedExam}
        onClose={() => setSelectedExam(null)}
        title={selectedExam?.nome || ""}
        content={selectedExam?.descricao || ""}
        image={selectedExam?.imagem || ""}
      />
    </div>
  );
};

export default Exames;
