
import React from "react";
import NavigationHeader from "@/components/NavigationHeader";

const Artigos = () => {
  const artigos = [
    {
      titulo: "Prevenção da Cegueira por Catarata",
      resumo: "A importância do diagnóstico precoce e tratamento adequado da catarata para prevenir a cegueira evitável.",
      data: "Dezembro 2024"
    },
    {
      titulo: "Avanços na Cirurgia Refrativa",
      resumo: "As mais recentes tecnologias em cirurgia refrativa e seus benefícios para os pacientes.",
      data: "Novembro 2024"
    },
    {
      titulo: "Ceratocone: Diagnóstico e Tratamento",
      resumo: "Uma abordagem abrangente sobre o ceratocone, desde o diagnóstico até as opções de tratamento disponíveis.",
      data: "Outubro 2024"
    },
    {
      titulo: "Oftalmologia Pediátrica: Cuidados Especiais",
      resumo: "A importância dos exames oftalmológicos na infância e os cuidados especiais necessários.",
      data: "Setembro 2024"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <NavigationHeader showLogo={true} />
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h1 className="text-3xl md:text-5xl font-serif text-medical-primary mb-8">
          Artigos e Publicações
        </h1>
        
        <p className="text-lg text-medical-secondary mb-12 max-w-3xl">
          Compartilhamos conhecimento científico e orientações importantes sobre saúde ocular para nossos pacientes e comunidade médica.
        </p>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {artigos.map((artigo, index) => (
            <article key={index} className="bg-white p-8 rounded-lg shadow-soft border border-medical-muted hover:shadow-medium transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm text-medical-secondary bg-medical-muted px-3 py-1 rounded-full">
                  {artigo.data}
                </span>
              </div>
              
              <h2 className="text-xl font-serif text-medical-primary mb-4">
                {artigo.titulo}
              </h2>
              
              <p className="text-medical-secondary mb-6">
                {artigo.resumo}
              </p>
              
              <button className="text-medical-primary font-semibold hover:text-medical-secondary transition-colors">
                Ler mais →
              </button>
            </article>
          ))}
        </div>
        
        <div className="mt-16 bg-gradient-to-r from-medical-accent to-medical-muted p-8 rounded-lg text-center">
          <h3 className="text-2xl font-serif text-medical-primary mb-4">
            Interessado em nossos artigos?
          </h3>
          <p className="text-medical-primary mb-6 max-w-2xl mx-auto">
            Cadastre-se em nossa newsletter para receber as mais recentes publicações e orientações sobre saúde ocular.
          </p>
          <button className="bg-medical-primary text-white px-8 py-3 rounded-full hover:bg-medical-secondary transition-colors">
            Cadastrar-se
          </button>
        </div>
      </div>
    </div>
  );
};

export default Artigos;
