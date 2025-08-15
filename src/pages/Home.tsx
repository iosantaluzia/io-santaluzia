
import NavigationHeader from "@/components/NavigationHeader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import SymptomChecker from "@/components/SymptomChecker";

const Home = () => {
  return (
    <div className="min-h-screen">
      <NavigationHeader showLogo={true} />
      <Hero />
      <SymptomChecker />
      <About />
      <Services />
      <Team />
      <Contact />
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
};

export default Home;
