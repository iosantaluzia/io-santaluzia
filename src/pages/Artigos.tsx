
import React, { useState } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import ArticleModal from "@/components/ArticleModal";

const Artigos = () => {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const artigos = [
    {
      titulo: "Cirurgia Refrativa – Liberdade e Segurança",
      subtitulo: "Os benefícios da cirurgia refrativa",
      data: "26 de fevereiro de 2025",
      imagem: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      conteudo: "A cirurgia refrativa tem como objetivo reestabelecer a qualidade de vida dos pacientes e proporcionar a liberdade de óculos e lentes de contato.\n\nNo Instituto de Olhos Santa Luzia contamos com técnicas avançadas e atualmente o mais novo Excimer Laser de Mato Grosso, o MEL 90 da Zeiss, realizando procedimentos para correção de problemas como hipermetropia, miopia, astigmatismo e presbiopia.\n\nA cirurgia tem recuperação rápida, com resultados visíveis em pouco tempo, proporcionando maior conforto e liberdade para o paciente no seu dia a dia.\n\nCom ela é possível reduzir ou até mesmo eliminar a dependência de óculos ou lentes de contato, trazendo uma nova perspectiva de vida com mais clareza e liberdade.\n\nOs procedimentos são realizados com a mais alta tecnologia e segurança, garantindo resultados excepcionais para nossos pacientes."
    },
    {
      titulo: "Seu filho tem miopia? Saiba os riscos e tratamentos",
      subtitulo: "A miopia é um dos problemas visuais mais comuns em crianças e sua incidência tem aumentado nos últimos anos. Caracterizada pela dificuldade em enxergar objetos distantes com clareza...",
      data: "14 de agosto de 2024",
      imagem: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=250&fit=crop",
      conteudo: "A miopia é um dos problemas visuais mais comuns em crianças e sua incidência tem aumentado nos últimos anos. Caracterizada pela dificuldade em enxergar objetos distantes com clareza, a miopia ocorre quando o olho é mais longo do que o normal, fazendo com que a luz se concentre antes da retina.\n\nÉ fundamental que os pais estejam atentos aos sinais que podem indicar miopia em crianças, como apertar os olhos para ver melhor, sentar muito próximo à televisão, reclamações de dor de cabeça após atividades que exigem visão de longe, e dificuldades na escola.\n\nO tratamento precoce é essencial para evitar a progressão da miopia e suas complicações. Existem várias opções de tratamento disponíveis, desde óculos e lentes de contato até tratamentos mais específicos para controle da progressão.\n\nO acompanhamento regular com um oftalmologista especializado é fundamental para monitorar a evolução da miopia e ajustar o tratamento conforme necessário."
    },
    {
      titulo: "Vitaminas e Suplementos para a visão?",
      subtitulo: "As vitaminas desempenham um papel crucial na manutenção da saúde ocular e podem ajudar a prevenir ou retardar a progressão de várias doenças oculares...",
      data: "4 de julho de 2024",
      imagem: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=250&fit=crop",
      conteudo: "As vitaminas desempenham um papel crucial na manutenção da saúde ocular e podem ajudar a prevenir ou retardar a progressão de várias doenças oculares. A venda de suplementos milagrosos é cada vez mais comum na internet, e por vezes, não possuem comprovação científica de funcionarem.\n\nCuras para Glaucoma, Catarata, Diabetes e outras condições são frequentemente prometidas sem base científica sólida. É importante consultar sempre um oftalmologista antes de iniciar qualquer suplementação.\n\nAs vitaminas A, C, E, zinco e ômega-3 são algumas das substâncias que realmente podem beneficiar a saúde ocular quando consumidas adequadamente e sob orientação médica.\n\nUma dieta equilibrada rica em vegetais folhosos, peixes e frutas geralmente fornece as vitaminas necessárias para manter a saúde dos olhos."
    },
    {
      titulo: "Catarata, eu vou ter?",
      subtitulo: "A catarata é uma condição comum que afeta a lente do olho, o Cristalino, que se torna opaco e causa uma visão inicialmente turva...",
      data: "9 de novembro de 2023",
      imagem: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=250&fit=crop",
      conteudo: "A catarata é uma condição comum que afeta a lente do olho, o Cristalino, que se torna opaco e causa uma visão inicialmente turva. Essa doença pode afetar um ou ambos os olhos e é uma das principais causas de perda de visão em pessoas idosas.\n\nNo entanto, com o tratamento adequado, a catarata pode ser completamente curada através de uma cirurgia segura e eficaz. A cirurgia de catarata é um dos procedimentos mais realizados e bem-sucedidos em todo o mundo.\n\nOs sintomas iniciais incluem visão embaçada, sensibilidade à luz, dificuldade para enxergar à noite e necessidade de trocar a graduação dos óculos com frequência.\n\nQuando diagnosticada precocemente e tratada adequadamente, os pacientes podem recuperar completamente sua visão e qualidade de vida."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <NavigationHeader showLogo={true} />
      <div className="max-w-4xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h1 className="text-3xl md:text-5xl font-sans font-bold text-medical-primary mb-8">
          Artigos
        </h1>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">
          Fique por dentro das novidades e informações importantes sobre saúde ocular através dos nossos artigos especializados.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {artigos.map((artigo, index) => (
            <article 
              key={index} 
              className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedArticle(artigo)}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={artigo.imagem}
                  alt={artigo.titulo}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">
                  {artigo.data}
                </div>
                <h2 className="text-xl font-sans font-bold text-medical-primary mb-3 line-clamp-2">
                  {artigo.titulo}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {artigo.subtitulo}
                </p>
                <button className="text-medical-primary hover:text-medical-secondary transition-colors font-medium text-sm">
                  LEIA MAIS »
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ArticleModal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        title={selectedArticle?.titulo || ""}
        content={selectedArticle?.conteudo || ""}
        date={selectedArticle?.data || ""}
      />
    </div>
  );
};

export default Artigos;
