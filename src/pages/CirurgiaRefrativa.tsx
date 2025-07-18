
import React from "react";
import NavigationHeader from "@/components/NavigationHeader";

const CirurgiaRefrativa = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <NavigationHeader showLogo={true} />
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h1 className="text-3xl md:text-5xl font-serif text-medical-primary mb-8">
          Cirurgia Refrativa
        </h1>
        
        <p className="text-lg text-medical-secondary mb-12 max-w-3xl">
          A cirurgia refrativa é um procedimento que corrige erros de refração como miopia, hipermetropia, astigmatismo e presbiopia, proporcionando independência dos óculos e lentes de contato.
        </p>
        
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-soft">
            <h3 className="text-xl font-semibold text-medical-primary mb-4">Miopia</h3>
            <p className="text-medical-secondary text-sm">
              Dificuldade para enxergar objetos distantes. A cirurgia remodela a córnea para focar corretamente a luz na retina.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-soft">
            <h3 className="text-xl font-semibold text-medical-primary mb-4">Hipermetropia</h3>
            <p className="text-medical-secondary text-sm">
              Dificuldade para enxergar objetos próximos. O procedimento aumenta o poder de convergência da córnea.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-soft">
            <h3 className="text-xl font-semibold text-medical-primary mb-4">Astigmatismo</h3>
            <p className="text-medical-secondary text-sm">
              Visão distorcida em todas as distâncias. A cirurgia corrige a curvatura irregular da córnea.
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-medical-accent to-medical-muted p-8 rounded-lg">
          <h3 className="text-2xl font-serif text-medical-primary mb-6 text-center">
            Vantagens da Cirurgia Refrativa
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-medical-primary rounded-full"></span>
                <span className="text-medical-primary">Liberdade dos óculos e lentes</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-medical-primary rounded-full"></span>
                <span className="text-medical-primary">Procedimento rápido e seguro</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-medical-primary rounded-full"></span>
                <span className="text-medical-primary">Recuperação visual rápida</span>
              </li>
            </ul>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-medical-primary rounded-full"></span>
                <span className="text-medical-primary">Melhora na qualidade de vida</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-medical-primary rounded-full"></span>
                <span className="text-medical-primary">Tecnologia de última geração</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-medical-primary rounded-full"></span>
                <span className="text-medical-primary">Resultados duradouros</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CirurgiaRefrativa;
