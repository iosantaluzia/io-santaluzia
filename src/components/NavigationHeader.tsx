
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Stethoscope, Eye, Zap, Circle, FileText } from "lucide-react";

interface NavigationHeaderProps {
  showLogo: boolean;
}

function NavigationHeader({ showLogo }: NavigationHeaderProps) {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { name: "O Instituto", path: "/instituto", icon: Home },
    { name: "Corpo clínico", path: "/corpo-clinico", icon: Users },
    { name: "Exames complementares", path: "/exames", icon: Stethoscope },
    { name: "Catarata", path: "/catarata", icon: Eye },
    { name: "Cirurgia Refrativa", path: "/cirurgia-refrativa", icon: Zap },
    { name: "Ceratocone", path: "/ceratocone", icon: Circle },
    { name: "Artigos", path: "/artigos", icon: FileText },
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-sm rounded-full shadow-medium p-2">
      <div className="flex items-center gap-4">
        {showLogo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="cursor-pointer flex-shrink-0 rounded-full overflow-hidden bg-white h-8 w-8 flex items-center justify-center"
            onClick={() => navigate("/")}
          >
            <img 
              src="/lovable-uploads/e187619e-2328-418d-971f-86200b2bb552.png" 
              alt="Instituto de Olhos Santa Luzia" 
              className="h-7 w-7 object-contain animate-spin-slow"
            />
          </motion.div>
        )}
        
        <ul
          className="relative flex w-fit rounded-full bg-white p-1"
          onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
        >
          {navItems.map((item) => (
            <Tab 
              key={item.name}
              setPosition={setPosition}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              isMobile={isMobile}
              icon={item.icon}
            >
              {item.name}
            </Tab>
          ))}
          <Cursor position={position} />
        </ul>
      </div>
    </div>
  );
}

const Tab = ({
  children,
  setPosition,
  isActive,
  onClick,
  isMobile,
  icon: Icon,
}: {
  children: React.ReactNode;
  setPosition: any;
  isActive: boolean;
  onClick: () => void;
  isMobile: boolean;
  icon: any;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      onClick={onClick}
      className={`relative z-10 block cursor-pointer px-3 py-2 text-xs uppercase transition-colors md:px-4 md:py-2 md:text-sm rounded-full ${
        isActive 
          ? "bg-medical-primary text-white font-semibold" 
          : "text-medical-primary hover:text-white hover:bg-medical-primary"
      }`}
    >
      {isMobile ? (
        isActive ? (
          <span className="text-xs whitespace-nowrap">{children}</span>
        ) : (
          <Icon className="w-4 h-4" />
        )
      ) : (
        <span className="whitespace-nowrap">{children}</span>
      )}
    </li>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-8 rounded-full bg-medical-primary md:h-10"
    />
  );
};

export default NavigationHeader;
