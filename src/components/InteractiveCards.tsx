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
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [activeCard, setActiveCard] = useState<string>("profissionais"); // Primeiro card ativo por padrão

  const cardsData: CardData[] = [
    {
      id: "profissionais",
      title: "Profissionais Qualificados",
      description: "Estamos prontos para cuidar da sua visão, oferecendo serviços especializados em áreas como refração, catarata, cirurgia refrativa, lentes de contato, ceratocone e oftalmopediatria. Nossa equipe é composta por médicos especialistas com vasta experiência e formação continuada.",
      icon: <Users className="h-6 w-6" />,
      image: "/uploads/6d7d13fe-03bb-4ace-89df-262bcaccb86e.png",
      color: "text-medical-primary",
      bgColor: "bg-medical-muted/30",
      iconBg: "bg-medical-primary/10"
    },
    {
      id: "exames",
      title: "Ampla Gama de Exames",
      description: "Disponibilizamos exames de ponta, para garantir um diagnóstico preciso e um tratamento adequado para cada paciente. Contamos com equipamentos de última geração como OCT, topografia corneana, microscopia especular e muitos outros.",
      icon: <Stethoscope className="h-6 w-6" />,
      image: "/uploads/oct.png",
      color: "text-medical-primary",
      bgColor: "bg-medical-muted/30",
      iconBg: "bg-medical-primary/10"
    },
    {
      id: "cirurgias",
      title: "Cirurgias Especializadas",
      description: "Realizamos cirurgias de Catarata, Ceratocone, Cirurgia Refrativa, de Lesões oculares e adaptação de lentes de contato. Utilizamos as mais modernas técnicas cirúrgicas e equipamentos de alta precisão para garantir os melhores resultados.",
      icon: <Eye className="h-6 w-6" />,
      image: "/uploads/ZEISS-MEL-90-photo.jpeg",
      color: "text-medical-primary",
      bgColor: "bg-medical-muted/30",
      iconBg: "bg-medical-primary/10"
    }
  ];

  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4">
      {cardsData.map((card) => {
        const isExpanded = expandedCard === card.id;
        const cardWidth = isExpanded ? 600 : 280;
        
        return (
          <motion.div
            key={card.id}
            className="relative group cursor-pointer flex-shrink-0"
            style={{ width: cardWidth }}
            onClick={() => {
              setActiveCard(card.id);
              setExpandedCard(isExpanded ? null : card.id);
            }}
            onMouseEnter={() => {
              setActiveCard(card.id);
              setExpandedCard(card.id);
            }}
            onMouseLeave={() => {
              setExpandedCard(null);
            }}
            animate={{ width: cardWidth }}
            transition={{ 
              duration: 0.4,
              ease: "easeInOut"
            }}
          >
            {/* Card Background */}
            <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-medical-primary/5 to-medical-accent/5">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={card.image}
                  alt={card.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    activeCard === card.id 
                      ? 'opacity-100' 
                      : 'opacity-20 group-hover:opacity-30'
                  }`}
                />
              </div>
              
              {/* Overlay */}
              <div className={`absolute inset-0 transition-colors duration-300 ${
                activeCard === card.id 
                  ? 'bg-medical-primary/10' 
                  : `${card.bgColor} group-hover:bg-medical-primary/20`
              }`}></div>
              
              {/* Content */}
              <div className="relative z-10 p-6 h-full flex flex-col">
                {/* Header with Icon and Title */}
                <div className="flex items-center gap-4 mb-4">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${card.iconBg} ${card.color} flex-shrink-0`} style={{ filter: 'drop-shadow(2px 2px 0 white) drop-shadow(-2px -2px 0 white) drop-shadow(2px -2px 0 white) drop-shadow(-2px 2px 0 white)' }}>
                    {card.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className={`text-xl font-bold ${card.color} flex-1`} style={{ textShadow: '2px 2px 0 white, -2px -2px 0 white, 2px -2px 0 white, -2px 2px 0 white' }}>
                    {card.title}
                  </h3>
                </div>
                
                {/* Description - Only visible when expanded */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      transition={{ 
                        duration: 0.4,
                        ease: "easeInOut"
                      }}
                      className="overflow-hidden"
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {card.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default InteractiveCards;


