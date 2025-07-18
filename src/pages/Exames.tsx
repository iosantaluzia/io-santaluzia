
import React from "react";
import NavigationHeader from "@/components/NavigationHeader";

const Exames = () => {
  const exames = [
    {
      nome: "Tomografia de Coerência Óptica (OCT)",
      descricao: "Exame não invasivo que permite visualizar as camadas da retina em alta resolução."
    },
    {
      nome: "Campo Visual",
      descricao: "Avaliação da visão periférica, essencial para diagnóstico de glaucoma."
    },
    {
      nome: "Topografia Corneana",
      descricao: "Mapeamento detalhado da superfície da córnea para diagnóstico de ceratocone."
    },
    {
      nome: "Biometria Ultrassônica",
      descricao: "Medição precisa das estruturas oculares para cálculo de lentes intraoculares."
    },
    {
      nome: "Microscopia Especular",
      descricao: "Análise das células do endotélio corneano."
    },
    {
      nome: "Paquimetria",
      descricao: "Medição da espessura da córnea."
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
          Contamos com equipamentos de última geração para realizar diagnósticos precisos e acompanhar a evolução dos tratamentos.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exames.map((exame, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-soft border border-medical-muted">
              <h3 className="text-xl font-semibold text-medical-primary mb-4">
                {exame.nome}
              </h3>
              <p className="text-medical-secondary text-sm">
                {exame.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exames;
