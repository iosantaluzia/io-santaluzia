
import NavigationHeader from "@/components/NavigationHeader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import SEOStructuredData from "@/components/SEOStructuredData";
import { Footer } from "@/components/ui/footer";
import { Instagram, Facebook } from 'lucide-react';
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

const Index = () => {
  const { trackPageView } = useGoogleAnalytics('GA_MEASUREMENT_ID');

  return (
    <div className="min-h-screen">
      <SEOStructuredData />
      <NavigationHeader showLogo={true} />
      <Hero />
      <About />
      <Services />
      <Team />
      <Contact />
      <FAQ />
      <Footer
        logo={<img src="/uploads/26442ffb-6359-4e38-a0f7-eaddfc7505f1.png" alt="Instituto de Olhos Santa Luzia" className="h-[134px] w-auto brightness-0 invert" />}
        brandName=""
        socialLinks={[
          { icon: <Instagram className="h-[30px] w-[30px]" />, href: "https://www.instagram.com/io.santaluzia/", label: "Instagram" },
          { icon: <Facebook className="h-[30px] w-[30px]" />, href: "https://www.facebook.com/institudodeolhossantaluzia", label: "Facebook" }
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
    </div>
  );
};

export default Index;
