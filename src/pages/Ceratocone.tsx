
import React from "react";
import NavigationHeader from "@/components/NavigationHeader";

const Ceratocone = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <NavigationHeader showLogo={true} />
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h1 className="text-3xl md:text-5xl font-serif text-medical-primary mb-8">
          Tratamento do Ceratocone
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-serif text-medical-primary mb-6">
              O que é Ceratocone?
            </h2>
            <p className="text-medical-secondary mb-6">
              O ceratocone é uma doença progressiva que afeta a córnea, causando seu afinamento e protrusão em formato cônico. Isso resulta em distorção visual significativa e pode levar à necessidade de transplante de córnea se não tratado adequadamente.
            </p>
            
            <h3 className="text-xl font-semibold text-medical-primary mb-4">
              Sinais e Sintomas:
            </h3>
            <ul className="list-disc list-inside text-medical-secondary space-y-2">
              <li>Visão distorcida e embaçada</li>
              <li>Mudanças frequentes no grau dos óculos</li>
              <li>Sensibilidade à luz</li>
              <li>Halos ao redor das luzes</li>
              <li>Diplopia monocular (visão dupla em um olho)</li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-soft">
            <h3 className="text-xl font-semibold text-medical-primary mb-6">
              Opções de Tratamento
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-medical-primary mb-2">Crosslinking Corneano</h4>
                <p className="text-sm text-medical-secondary">
                  Procedimento que fortalece as fibras de colágeno da córnea, estabilizando a progressão da doença.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-medical-primary mb-2">Lentes de Contato Especiais</h4>
                <p className="text-sm text-medical-secondary">
                  Lentes rígidas ou semi-rígidas especialmente desenhadas para ceratocone.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-medical-primary mb-2">Anel Intraestromal</h4>
                <p className="text-sm text-medical-secondary">
                  Implante de segmentos de anel para regularizar a curvatura corneana.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-medical-primary mb-2">Transplante de Córnea</h4>
                <p className="text-sm text-medical-secondary">
                  Em casos avançados, pode ser necessário o transplante parcial ou total da córnea.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-medical-accent to-medical-muted p-8 rounded-lg text-center">
          <h3 className="text-2xl font-serif text-medical-primary mb-4">
            Diagnóstico Precoce é Fundamental
          </h3>
          <p className="text-medical-primary max-w-3xl mx-auto">
            O tratamento precoce do ceratocone pode estabilizar a progressão da doença e preservar a visão. 
            Realizamos exames especializados como topografia corneana e tomografia para diagnóstico preciso.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ceratocone;
