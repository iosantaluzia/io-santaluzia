
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/ui/footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Instagram, Facebook } from 'lucide-react';

const Artigos = () => {
  const articles = [
    {
      title: "Cirurgia Refrativa – Liberdade e Segurança",
      excerpt: "Descubra como a cirurgia refrativa pode transformar sua vida, oferecendo liberdade dos óculos e lentes de contato com total segurança.",
      date: "26 de fevereiro de 2025",
      image: "/lovable-uploads/87125f62-3c4e-4acc-970b-25f7eb624ae5.png",
      readTime: "5 min"
    },
    {
      title: "Catarata: Diagnóstico e Tratamento",
      excerpt: "Tudo o que você precisa saber sobre a catarata, desde os primeiros sintomas até os tratamentos mais modernos disponíveis.",
      date: "20 de fevereiro de 2025",
      image: "/lovable-uploads/6d7d13fe-03bb-4ace-89df-262bcaccb86e.png",
      readTime: "7 min"
    },
    {
      title: "Ceratocone: Tratamentos Avançados",
      excerpt: "Conheça os tratamentos mais modernos para ceratocone, incluindo crosslinking e implante de anéis intraestromais.",
      date: "15 de fevereiro de 2025",
      image: "/lovable-uploads/87125f62-3c4e-4acc-970b-25f7eb624ae5.png",
      readTime: "6 min"
    },
    {
      title: "Importância dos Exames Preventivos",
      excerpt: "Saiba por que realizar exames oftalmológicos regulares é essencial para manter a saúde dos seus olhos.",
      date: "10 de fevereiro de 2025",
      image: "/lovable-uploads/6d7d13fe-03bb-4ace-89df-262bcaccb86e.png",
      readTime: "4 min"
    }
  ];

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

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {articles.map((article, index) => (
              <article
                key={index}
                className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 cursor-pointer"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between text-sm text-medical-secondary mb-3">
                    <span>{article.date}</span>
                    <span>{article.readTime} de leitura</span>
                  </div>
                  <h3 className="text-xl font-sans font-bold text-medical-primary mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-medical-secondary text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <button className="text-medical-primary hover:text-medical-secondary transition-colors font-medium text-sm">
                    LEIA MAIS »
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-8 mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-medical-primary mb-4">
              Fique Sempre Informado
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Nossa equipe de especialistas está sempre produzindo conteúdo de qualidade 
              para manter você informado sobre os avanços na oftalmologia.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Acompanhe nossos artigos e descubra como cuidar melhor da sua saúde visual 
              com informações precisas e atualizadas.
            </p>
          </div>
        </div>
      </main>
      <Footer
        logo={<img src="/lovable-uploads/26442ffb-6359-4e38-a0f7-eaddfc7505f1.png" alt="Instituto de Olhos Santa Luzia" className="h-12 w-auto brightness-0 invert" />}
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
          text: "© 2024 Instituto de Olhos Santa Luzia",
          license: "Avenida dos Tarumãs, 930 - Sinop/MT - CEP: 78550-001 | +55 66 99721-5000"
        }}
      />
      <FloatingWhatsAppButton />
    </div>
  );
};

export default Artigos;
