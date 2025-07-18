
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

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

  const navItems = [
    { name: "O Instituto", path: "/instituto" },
    { name: "Corpo clínico", path: "/corpo-clinico" },
    { name: "Exames complementares", path: "/exames" },
    { name: "Catarata", path: "/catarata" },
    { name: "Cirurgia Refrativa", path: "/cirurgia-refrativa" },
    { name: "Ceratocone", path: "/ceratocone" },
    { name: "Artigos", path: "/artigos" },
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-sm rounded-full shadow-medium p-2">
      <div className="flex items-center gap-4">
        {showLogo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img 
              src="/lovable-uploads/logoimg.png" 
              alt="Instituto de Olhos Santa Luzia" 
              className="h-8 w-8"
            />
          </motion.div>
        )}
        
        <ul
          className="relative flex w-fit rounded-full border-2 border-medical-primary bg-white p-1"
          onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
        >
          {navItems.map((item) => (
            <Tab 
              key={item.name}
              setPosition={setPosition}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
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
}: {
  children: React.ReactNode;
  setPosition: any;
  isActive: boolean;
  onClick: () => void;
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
      className={`relative z-10 block cursor-pointer px-2 py-1.5 text-xs uppercase mix-blend-difference md:px-4 md:py-2 md:text-sm transition-colors ${
        isActive 
          ? "text-medical-primary font-semibold" 
          : "text-medical-primary hover:text-medical-secondary"
      }`}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 rounded-full bg-medical-secondary md:h-10"
    />
  );
};

export default NavigationHeader;
