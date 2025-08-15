
import React, { Suspense } from 'react';
import { Users, Stethoscope, Eye } from 'lucide-react';
import ExpandableCard from '@/components/ExpandableCard';
import NavigationHeader from '@/components/NavigationHeader';
import { Instagram, Facebook, Phone, MapPin, Clock } from 'lucide-react';

const LazyHero = React.lazy(() => import('@/components/Hero'));
const LazyServices = React.lazy(() => import('@/components/Services'));
const LazyAbout = React.lazy(() => import('@/components/About'));
const LazyTeam = React.lazy(() => import('@/components/Team'));
const LazyContact = React.lazy(() => import('@/components/Contact'));
const LazyFloatingWhatsAppButton = React.lazy(() => import('@/components/FloatingWhatsAppButton'));
const LazyFooter = React.lazy(() => import('@/components/ui/footer').then(module => ({ default: module.Footer })));

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-medical-muted/20 to-medical-accent/10">
      <NavigationHeader showLogo={true} />
      
      <Suspense fallback={<div className="h-screen bg-gradient-to-br from-background via-medical-muted/20 to-medical-accent/10" />}>
        <LazyHero />
      </Suspense>

      {/* Welcome Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-background via-medical-muted/20 to-medical-accent/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans text-medical-primary mb-6">
                Bem vindo ao Instituto de Olhos Santa Luzia
              </h2>
              <p className="text-lg text-medical-secondary mb-8">
                Nosso compromisso é proporcionar um serviço oftalmológico de excelência, atendendo a todas as suas necessidades visuais com cuidado e precisão. Desde 2014, estamos presentes em Sinop, Mato Grosso, oferecendo atendimento completo em oftalmologia.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/6d7d13fe-03bb-4ace-89df-262bcaccb86e.png" 
                alt="Cuidados oftalmológicos especializados" 
                className="rounded-lg shadow-medium w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="h-32 bg-background" />}>
        <LazyServices />
      </Suspense>

      <Suspense fallback={<div className="h-32 bg-background" />}>
        <LazyAbout />
      </Suspense>

      {/* Services Overview Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-background via-medical-muted/20 to-medical-accent/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans text-medical-primary mb-6">
                O que oferecemos?
              </h2>
              <p className="text-lg text-medical-secondary mb-6">
                Estamos aqui para cuidar da sua saúde visual com dedicação e comprometimento. Entre em contato conosco para mais informações e agende sua consulta hoje mesmo. Seus olhos merecem o melhor cuidado!
              </p>
              <p className="text-lg text-medical-secondary mb-8">
                Clique e confira um pouco do que nosso serviço dispõe para você:
              </p>
            </div>
            
            <div className="space-y-4">
              <ExpandableCard
                icon={<Users className="h-6 w-6" />}
                title="PROFISSIONAIS QUALIFICADOS"
                content="Nossa equipe é formada por especialistas altamente qualificados, com vasta experiência em oftalmologia e cirurgias oculares. Cada profissional se dedica a oferecer o melhor atendimento e tratamento personalizado para cada paciente."
              />
              <ExpandableCard
                icon={<Stethoscope className="h-6 w-6" />}
                title="UMA AMPLA GAMA DE EXAMES"
                content="Realizamos uma completa variedade de exames oftalmológicos, desde consultas de rotina até diagnósticos especializados. Utilizamos equipamentos de última geração para garantir precisão e confiabilidade em todos os resultados."
              />
              <ExpandableCard
                icon={<Eye className="h-6 w-6" />}
                title="CIRURGIAS"
                content="Oferecemos procedimentos cirúrgicos modernos e seguros, incluindo cirurgia de catarata, correção de problemas refrativos e tratamento de ceratocone. Todas as cirurgias são realizadas com tecnologia avançada e cuidado excepcional."
              />
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="h-32 bg-background" />}>
        <LazyTeam />
      </Suspense>

      <Suspense fallback={<div className="h-32 bg-background" />}>
        <LazyContact />
      </Suspense>
      
      <Suspense fallback={<div className="h-32 bg-background" />}>
        <LazyFooter
          logo={<img src="/lovable-uploads/e6a1d636-8727-4054-a89d-8ed7337a643a.png" alt="Instituto de Olhos Santa Luzia" className="h-20 w-auto brightness-0 invert" />}
          brandName=""
          socialLinks={[
            { icon: <Instagram className="h-5 w-5" />, href: "https://www.instagram.com/io.santaluzia/", label: "Instagram" },
            { icon: <Facebook className="h-5 w-5" />, href: "https://www.facebook.com/profile.php?id=100063558400559", label: "Facebook" },
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
            license: "Rua das Acácias, 634, Setor Comercial, Sinop - MT | (66) 3531-2323"
          }}
        />
      </Suspense>

      <Suspense fallback={null}>
        <LazyFloatingWhatsAppButton />
      </Suspense>
    </div>
  );
};

export default Home;
