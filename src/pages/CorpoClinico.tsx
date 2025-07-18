
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
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Dra. Fabíola Roque */}
          <div className="bg-white rounded-lg shadow-soft overflow-hidden">
            <div className="h-64 bg-gradient-to-br from-medical-accent to-medical-muted flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop" 
                alt="Dra. Fabíola Roque"
                className="w-32 h-32 rounded-full object-cover border-4 border-white"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-serif text-medical-primary mb-4">
                Dra. Fabíola Roque
              </h2>
              <p className="text-medical-secondary mb-6">
                Especialista em Catarata, Ceratocone, Lentes de Contato e Cirurgia Refrativa.
              </p>
              <div className="space-y-2 text-sm text-medical-secondary">
                <p>• Formação em Medicina pela FFFCMPA</p>
                <p>• Especialização em Oftalmologia pela UFCSPA</p>
                <p>• Fellow em Segmento Anterior pela Santa Casa de Misericórdia de Porto Alegre</p>
                <p>• Fellow em Córnea pelo Bascom Palmer Eye Institute</p>
              </div>
            </div>
          </div>
          
          {/* Dr. Matheus Roque */}
          <div className="bg-white rounded-lg shadow-soft overflow-hidden">
            <div className="h-64 bg-gradient-to-br from-medical-accent to-medical-muted flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop" 
                alt="Dr. Matheus Roque"
                className="w-32 h-32 rounded-full object-cover border-4 border-white"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-serif text-medical-primary mb-4">
                Dr. Matheus Roque
              </h2>
              <p className="text-medical-secondary mb-6">
                Especialista em Oftalmologia geral e Oftalmopediatria
              </p>
              <div className="space-y-2 text-sm text-medical-secondary">
                <p>• Formação em Medicina pela Pontifícia Universidade Católica do Paraná</p>
                <p>• Especialização em Oftalmologia pelo Hospital de Clínicas da UFPR</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorpoClinico;
