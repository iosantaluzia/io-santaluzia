
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavigationHeader from "@/components/NavigationHeader";

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setShowFloatingNav(currentScrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header flutuante */}
      <NavigationHeader showLogo={showFloatingNav} />

      {/* Logo principal centralizada */}
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen px-4"
        style={{
          opacity: Math.max(0, 1 - scrollY / 400),
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <div className="text-center">
          <motion.img
            src="/lovable-uploads/26442ffb-6359-4e38-a0f7-eaddfc7505f1.png"
            alt="Instituto de Olhos Santa Luzia"
            className="mx-auto mb-8 max-w-sm md:max-w-md lg:max-w-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-4"
          >
            <h1 className="text-2xl md:text-4xl font-serif text-medical-primary">
              Instituto de Olhos Santa Luzia
            </h1>
            <p className="text-lg md:text-xl text-medical-secondary max-w-2xl mx-auto">
              Cuidados oftalmológicos especializados com excelência e tecnologia de ponta
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Seção de boas-vindas */}
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif text-medical-primary mb-6">
              Bem vindo ao Instituto de Olhos Santa Luzia
            </h2>
            <p className="text-lg md:text-xl text-medical-secondary mb-8">
              Nosso compromisso é proporcionar um serviço oftalmológico de excelência, atendendo a todas as suas necessidades visuais com cuidado e precisão. Desde 2014, estamos presentes em Sinop, Mato Grosso, oferecendo atendimento completo em oftalmologia.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-soft text-center">
                <h3 className="text-2xl font-bold text-medical-primary mb-2">+15.000</h3>
                <p className="text-medical-secondary">Pacientes Atendidos</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-soft text-center">
                <h3 className="text-2xl font-bold text-medical-primary mb-2">+2.000</h3>
                <p className="text-medical-secondary">Cirurgias Realizadas</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-soft text-center">
                <h3 className="text-2xl font-bold text-medical-primary mb-2">10+</h3>
                <p className="text-medical-secondary">Anos de Excelência</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=500&fit=crop"
              alt="Paciente em consulta oftalmológica"
              className="rounded-lg shadow-medium w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
