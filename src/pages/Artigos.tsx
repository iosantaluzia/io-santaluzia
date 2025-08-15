
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Eye, Zap, Shield } from "lucide-react";

const Artigos = () => {
  const articles = [
    {
      title: "Catarata: Quando é hora de operar?",
      excerpt: "Entenda os sinais que indicam a necessidade de cirurgia de catarata e como o procedimento pode melhorar sua qualidade de vida.",
      author: "Dr. Carlos Silva",
      date: "15 de Janeiro, 2024",
      category: "Catarata",
      icon: <Eye className="h-5 w-5" />,
      image: "/lovable-uploads/4f2fb169-1556-4f12-9d20-a788c214c4f1.png"
    },
    {
      title: "Cirurgia Refrativa: Mitos e Verdades",
      excerpt: "Desmistificamos as principais dúvidas sobre cirurgia refrativa e esclarecemos os benefícios do procedimento.",
      author: "Dr. João Oliveira",
      date: "8 de Janeiro, 2024",
      category: "Cirurgia Refrativa",
      icon: <Zap className="h-5 w-5" />,
      image: "/lovable-uploads/87125f62-3c4e-4acc-970b-25f7eb624ae5.png"
    },
    {
      title: "Ceratocone: Diagnóstico Precoce Salva a Visão",
      excerpt: "A importância do diagnóstico precoce do ceratocone e as opções de tratamento disponíveis para preservar a visão.",
      author: "Dra. Maria Santos",
      date: "2 de Janeiro, 2024",
      category: "Ceratocone",
      icon: <Shield className="h-5 w-5" />,
      image: "/lovable-uploads/6f0e2320-1b39-403a-ab68-8eeffe8dfc36.png"
    },
    {
      title: "Glaucoma: O Ladrão Silencioso da Visão",
      excerpt: "Como identificar os primeiros sinais do glaucoma e a importância dos exames regulares para prevenção.",
      author: "Dr. Carlos Silva",
      date: "28 de Dezembro, 2023",
      category: "Glaucoma",
      icon: <Eye className="h-5 w-5" />,
      image: "/lovable-uploads/4f2fb169-1556-4f12-9d20-a788c214c4f1.png"
    },
    {
      title: "Tecnologia OCT: Revolução no Diagnóstico",
      excerpt: "Conheça como a Tomografia de Coerência Óptica está revolucionando o diagnóstico de doenças da retina.",
      author: "Dra. Maria Santos",
      date: "20 de Dezembro, 2023",
      category: "Tecnologia",
      icon: <Zap className="h-5 w-5" />,
      image: "/lovable-uploads/6f0e2320-1b39-403a-ab68-8eeffe8dfc36.png"
    },
    {
      title: "Cuidados Pós-Operatórios em Cirurgia Ocular",
      excerpt: "Guia completo sobre os cuidados necessários após cirurgias oftalmológicas para garantir melhor recuperação.",
      author: "Dr. João Oliveira",
      date: "15 de Dezembro, 2023",
      category: "Cuidados",
      icon: <Shield className="h-5 w-5" />,
      image: "/lovable-uploads/87125f62-3c4e-4acc-970b-25f7eb624ae5.png"
    }
  ];

  const categories = ["Todos", "Catarata", "Cirurgia Refrativa", "Ceratocone", "Glaucoma", "Tecnologia", "Cuidados"];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-medical-primary mb-6">
                Artigos e Informações
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Mantenha-se informado sobre saúde ocular com nossos artigos especializados. 
                Conteúdo confiável produzido por nossa equipe médica.
              </p>
            </div>

            {/* Categories Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    index === 0 
                      ? 'bg-medical-primary text-white' 
                      : 'bg-medical-muted text-medical-primary hover:bg-medical-primary hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video overflow-hidden bg-gradient-accent">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1 text-medical-primary">
                        {article.icon}
                        <span className="text-xs font-medium">{article.category}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight hover:text-medical-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Newsletter Subscription */}
            <div className="mt-16 bg-gradient-primary rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-semibold mb-4">
                Receba conteúdo exclusivo sobre saúde ocular
              </h2>
              <p className="mb-6 opacity-90">
                Assine nossa newsletter e receba artigos, dicas e novidades 
                diretamente em seu e-mail.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="flex-1 px-4 py-2 rounded-lg text-medical-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="px-6 py-2 bg-white text-medical-primary rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  Assinar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
};

export default Artigos;
