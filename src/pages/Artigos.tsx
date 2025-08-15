
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/ui/footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";

const Artigos = () => {
  return (
    <div className="min-h-screen">
      <NavigationHeader showLogo={true} />
      <main className="pt-20">
        
      </main>
      <Footer
        logo={<img src="/lovable-uploads/logogrande-removebg-preview.png" alt="Instituto de Olhos Santa Luzia" className="h-10 w-10 brightness-0 invert" />}
        brandName=""
        socialLinks={[
          { icon: <span>📷</span>, href: "https://www.instagram.com/io.santaluzia/", label: "Instagram" },
          { icon: <span>📘</span>, href: "https://www.facebook.com/institudodeolhossantaluzia", label: "Facebook" }
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
