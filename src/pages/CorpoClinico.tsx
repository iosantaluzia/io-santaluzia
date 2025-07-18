
import React from "react";
import NavigationHeader from "@/components/NavigationHeader";

const CorpoClinico = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <NavigationHeader showLogo={true} />
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h1 className="text-3xl md:text-5xl font-serif text-medical-primary mb-8">
          Corpo Clínico
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-soft">
            <h2 className="text-2xl font-serif text-medical-primary mb-6">
              Dra. Fabiola Roque
            </h2>
            <p className="text-medical-secondary mb-4">
              Fundadora do Instituto de Olhos Santa Luzia, especialista em oftalmologia com mais de uma década de experiência.
            </p>
            <div className="space-y-2 text-sm text-medical-secondary">
              <p>• Especialização em Cirurgia de Catarata</p>
              <p>• Cirurgia Refrativa</p>
              <p>• Tratamento de Ceratocone</p>
              <p>• Tumores de Superfície Ocular</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-soft">
            <h2 className="text-2xl font-serif text-medical-primary mb-6">
              Dr. Matheus Roque
            </h2>
            <p className="text-medical-secondary mb-4">
              Especialista em Oftalmologia Geral e Pediátrica, juntou-se ao instituto em 2023.
            </p>
            <div className="space-y-2 text-sm text-medical-secondary">
              <p>• Oftalmologia Geral</p>
              <p>• Oftalmologia Pediátrica</p>
              <p>• Atendimento Especializado</p>
              <p>• Diagnósticos Avançados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorpoClinico;
