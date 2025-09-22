import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Stethoscope, Eye } from 'lucide-react';

interface CardData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  color: string;
  bgColor: string;
  iconBg: string;
}

const InteractiveCards = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const cardsData: CardData[] = [
    {
      id: "profissionais",
      title: "Profissionais Qualificados",
      description: "Estamos prontos para cuidar da sua visão, oferecendo serviços especializados em áreas como refração, catarata, cirurgia refrativa, lentes de contato, ceratocone e oftalmopediatria. Nossa equipe é composta por médicos especialistas com vasta experiência e formação continuada.",
      icon: <Users className="h-6 w-6" />,
      image: "/lovable-uploads/6d7d13fe-03bb-4ace-89df-262bcaccb86e.png",
      color: "text-medical-primary",
      bgColor: "bg-medical-muted/30",
      iconBg: "bg-medical-primary/10"
    },
    {
      id: "exames",
      title: "Ampla Gama de Exames",
      description: "Disponibilizamos exames de ponta, para garantir um diagnóstico preciso e um tratamento adequado para cada paciente. Contamos com equipamentos de última geração como OCT, topografia corneana, microscopia especular e muitos outros.",
      icon: <Stethoscope className="h-6 w-6" />,
      image: "/lovable-uploads/oct.png",
      color: "text-medical-primary",
      bgColor: "bg-medical-muted/30",
      iconBg: "bg-medical-primary/10"
    },
    {
      id: "cirurgias",
      title: "Cirurgias Especializadas",
      description: "Realizamos cirurgias de Catarata, Ceratocone, Cirurgia Refrativa, de Lesões oculares e adaptação de lentes de contato. Utilizamos as mais modernas técnicas cirúrgicas e equipamentos de alta precisão para garantir os melhores resultados.",
      icon: <Eye className="h-6 w-6" />,
      image: "/lovable-uploads/refrativacc2.jpg",
      color: "text-medical-primary",
      bgColor: "bg-medical-muted/30",
      iconBg: "bg-medical-primary/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {cardsData.map((card) => (
        <motion.div
          key={card.id}
          className="relative group cursor-pointer"
          onMouseEnter={() => setActiveCard(card.id)}
          onMouseLeave={() => setActiveCard(null)}
          whileHover={{ y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* Card Background */}
          <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-medical-primary/5 to-medical-accent/5">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
              />
            </div>
            
            {/* Overlay */}
            <div className={`absolute inset-0 ${card.bgColor} group-hover:bg-medical-primary/20 transition-colors duration-300`}></div>
            
            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              {/* Icon */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${card.iconBg} ${card.color} mb-4`} style={{ filter: 'drop-shadow(2px 2px 0 white) drop-shadow(-2px -2px 0 white) drop-shadow(2px -2px 0 white) drop-shadow(-2px 2px 0 white)' }}>
                {card.icon}
              </div>
              
              {/* Title */}
              <h3 className={`text-xl font-bold ${card.color} mb-2`} style={{ textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white' }}>
                {card.title}
              </h3>
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {activeCard === card.id && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 left-0 right-0 z-20"
              >
                <motion.div
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${card.iconBg} ${card.color} flex-shrink-0`} style={{ filter: 'drop-shadow(2px 2px 0 white) drop-shadow(-2px -2px 0 white) drop-shadow(2px -2px 0 white) drop-shadow(-2px 2px 0 white)' }}>
                      {card.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold ${card.color} mb-3`} style={{ textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white' }}>
                        {card.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default InteractiveCards;
