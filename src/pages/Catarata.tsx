
import React from "react";
import NavigationHeader from "@/components/NavigationHeader";

const Catarata = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <NavigationHeader showLogo={true} />
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h1 className="text-3xl md:text-5xl font-serif text-medical-primary mb-8">
          Cirurgia de Catarata
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-serif text-medical-primary mb-6">
              O que é Catarata?
            </h2>
            <p className="text-medical-secondary mb-6">
              A catarata é o embaçamento do cristalino (lente natural do olho), que causa diminuição progressiva da visão. É uma das principais causas de cegueira reversível no mundo.
            </p>
            
            <h3 className="text-xl font-semibold text-medical-primary mb-4">
              Sintomas Principais:
            </h3>
            <ul className="list-disc list-inside text-medical-secondary space-y-2 mb-8">
              <li>Visão embaçada ou turva</li>
              <li>Sensibilidade à luz</li>
              <li>Dificuldade para enxergar à noite</li>
              <li>Visão dupla em um olho</li>
              <li>Mudanças frequentes no grau dos óculos</li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-soft">
            <h3 className="text-xl font-semibold text-medical-primary mb-6">
              Nossa Abordagem
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-medical-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-medical-primary">Avaliação Completa</h4>
                  <p className="text-sm text-medical-secondary">Exames detalhados para determinar o melhor momento para a cirurgia</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-medical-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-medical-primary">Cirurgia Personalizada</h4>
                  <p className="text-sm text-medical-secondary">Técnicas modernas com lentes intraoculares premium</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-medical-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-medical-primary">Acompanhamento</h4>
                  <p className="text-sm text-medical-secondary">Cuidado pós-operatório para garantir a melhor recuperação</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catarata;
