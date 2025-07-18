
import React from "react";
import NavigationHeader from "@/components/NavigationHeader";

const Artigos = () => {
  const artigos = [
    {
      titulo: "Cirurgia Refrativa – Liberdade e Segurança",
      subtitulo: "Os benefícios da cirurgia refrativa",
      data: "26 de fevereiro de 2025",
      imagem: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop"
    },
    {
      titulo: "Seu filho tem miopia? Saiba os riscos e tratamentos",
      subtitulo: "A miopia é um dos problemas visuais mais comuns em crianças e sua incidência tem aumentado nos últimos anos. Caracterizada pela dificuldade em enxergar objetos distantes com clareza...",
      data: "14 de agosto de 2024",
      imagem: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=250&fit=crop"
    },
    {
      titulo: "Vitaminas e Suplementos para a visão?",
      subtitulo: "As vitaminas desempenham um papel crucial na manutenção da saúde ocular e podem ajudar a prevenir ou retardar a progressão de várias doenças oculares...",
      data: "4 de julho de 2024",
      imagem: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=250&fit=crop"
    },
    {
      titulo: "Catarata, eu vou ter?",
      subtitulo: "A catarata é uma condição comum que afeta a lente do olho, o Cristalino, que se torna opaco e causa uma visão inicialmente turva...",
      data: "9 de novembro de 2023",
      imagem: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=250&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <NavigationHeader showLogo={true} />
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h1 className="text-3xl md:text-5xl font-serif text-medical-primary mb-8">
          Artigos
        </h1>
        <p className="text-lg text-medical-secondary mb-12 max-w-3xl">
          Fique por dentro das novidades e informações importantes sobre saúde ocular através dos nossos artigos especializados.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artigos.map((artigo, index) => (
            <article key={index} className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={artigo.imagem}
                  alt={artigo.titulo}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-medical-secondary mb-2">
                  {artigo.data}
                </div>
                <h2 className="text-xl font-serif text-medical-primary mb-3 line-clamp-2">
                  {artigo.titulo}
                </h2>
                <p className="text-medical-secondary text-sm mb-4 line-clamp-3">
                  {artigo.subtitulo}
                </p>
                <button className="text-medical-secondary hover:text-medical-primary transition-colors font-medium text-sm">
                  LEIA MAIS »
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Artigos;
