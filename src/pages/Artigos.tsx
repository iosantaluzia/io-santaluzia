
import React, { useState } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/ui/footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import ArticleModal from "@/components/ArticleModal";
import { Instagram, Facebook } from 'lucide-react';
import { articles } from '@/data/articles';

const Artigos = () => {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  return (
    <div className="min-h-screen">
      <NavigationHeader showLogo={true} />
      <main className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-sans text-medical-primary mb-8">
              Artigos
            </h1>
            <p className="text-lg text-medical-secondary max-w-3xl mx-auto">
              Mantenha-se informado sobre saúde ocular, tratamentos e as últimas novidades 
              em oftalmologia com nossos artigos especializados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {articles.map((article, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={article.imagem}
                    alt={article.titulo}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-medical-secondary mb-2">
                    <span>{article.data}</span>
                    <span>5 min</span>
                  </div>
                  <h3 className="text-lg font-sans font-bold text-medical-primary mb-2 line-clamp-2">
                    {article.titulo}
                  </h3>
                  <p className="text-medical-secondary text-sm mb-3 line-clamp-2">
                    {article.subtitulo}
                  </p>
                  <button className="text-medical-primary hover:text-medical-secondary transition-colors font-medium text-xs">
                    LEIA MAIS »
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer
        logo={<img src="/uploads/26442ffb-6359-4e38-a0f7-eaddfc7505f1.png" alt="Instituto de Olhos Santa Luzia" className="h-28 w-auto brightness-0 invert mx-auto" />}
        brandName=""
        socialLinks={[
          { icon: <Instagram className="h-5 w-5" />, href: "https://www.instagram.com/io.santaluzia/", label: "Instagram" },
          { icon: <Facebook className="h-5 w-5" />, href: "https://www.facebook.com/institudodeolhossantaluzia", label: "Facebook" }
        ]}
        mainLinks={[
          { href: "/instituto", label: "O Instituto" },
          { href: "/corpo-clinico", label: "Corpo Clínico" },
          { href: "/exames", label: "Exames" },
          { href: "/catarata", label: "Catarata" },
          { href: "/cirurgia-refrativa", label: "Cirurgia Refrativa" },
          { href: "/ceratocone", label: "Ceratocone" },
          { href: "/artigos", label: "Artigos" }
        ]}
        legalLinks={[]}
        copyright={{
          text: "",
          license: "Avenida dos Tarumãs, 930 - Sinop/MT - CEP: 78550-001 | +55 66 99721-5000"
        }}
      />
      <FloatingWhatsAppButton />
      
      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          title={selectedArticle.titulo}
          content={selectedArticle.conteudo}
          date={selectedArticle.data}
          image={selectedArticle.imagem}
        />
      )}
    </div>
  );
};

export default Artigos;
