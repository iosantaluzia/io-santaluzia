
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Stethoscope, Eye, Zap, Circle, FileText, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PatientPortalModal from "./PatientPortalModal";

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
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const institutoItems = [
    { name: "História", href: "/instituto" },
    { name: "Corpo Clínico", href: "/corpo-clinico" }
  ];

  const cirurgiasItems = [
    { name: "Catarata", href: "/catarata" },
    { name: "Cirurgia Refrativa", href: "/cirurgia-refrativa" },
    { name: "Ceratocone", href: "/ceratocone" }
  ];

  const navItems = [
    { name: "Exames complementares", path: "/exames", icon: Stethoscope },
    { name: "Artigos", path: "/artigos", icon: FileText },
  ];

  return (
    <>
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
                src="/lovable-uploads/e6a1d636-8727-4054-a89d-8ed7337a643a.png" 
                alt="Instituto de Olhos Santa Luzia" 
                className="h-7 w-7 object-contain animate-spin-slow"
              />
            </motion.div>
          )}
          
          <ul
            className="relative flex w-fit rounded-full bg-white p-1"
            onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
          >
            {/* Instituto Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Tab 
                  setPosition={setPosition}
                  isActive={location.pathname === '/instituto' || location.pathname === '/corpo-clinico'}
                  onClick={() => {}}
                  isMobile={isMobile}
                  icon={Home}
                  isDropdown={true}
                >
                  O Instituto
                </Tab>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 shadow-medium rounded-lg p-2 min-w-[200px] z-[60]">
                {institutoItems.map((item) => (
                  <DropdownMenuItem
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className="cursor-pointer px-4 py-2 text-medical-primary hover:bg-medical-muted hover:text-medical-secondary transition-colors rounded-md"
                  >
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cirurgias Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Tab 
                  setPosition={setPosition}
                  isActive={location.pathname === '/catarata' || location.pathname === '/cirurgia-refrativa' || location.pathname === '/ceratocone'}
                  onClick={() => {}}
                  isMobile={isMobile}
                  icon={Eye}
                  isDropdown={true}
                >
                  Cirurgias
                </Tab>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 shadow-medium rounded-lg p-2 min-w-[200px] z-[60]">
                {cirurgiasItems.map((item) => (
                  <DropdownMenuItem
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className="cursor-pointer px-4 py-2 text-medical-primary hover:bg-medical-muted hover:text-medical-secondary transition-colors rounded-md"
                  >
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Regular Navigation Items */}
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

            {/* Portal do Paciente */}
            <Tab 
              setPosition={setPosition}
              isActive={false}
              onClick={() => setIsPortalModalOpen(true)}
              isMobile={isMobile}
              icon={Users}
            >
              Portal do Paciente
            </Tab>

            <Cursor position={position} />
          </ul>
        </div>
      </div>

      <PatientPortalModal 
        isOpen={isPortalModalOpen} 
        onClose={() => setIsPortalModalOpen(false)} 
      />
    </>
  );
}

const Tab = ({
  children,
  setPosition,
  isActive,
  onClick,
  isMobile,
  icon: Icon,
  isDropdown = false,
}: {
  children: React.ReactNode;
  setPosition: any;
  isActive: boolean;
  onClick: () => void;
  isMobile: boolean;
  icon: any;
  isDropdown?: boolean;
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
      } ${isDropdown ? 'flex items-center space-x-1' : ''}`}
    >
      {isMobile ? (
        isActive ? (
          <span className="text-xs whitespace-nowrap flex items-center space-x-1">
            {children}
            {isDropdown && <ChevronDown className="w-3 h-3" />}
          </span>
        ) : (
          <Icon className="w-4 h-4" />
        )
      ) : (
        <span className="whitespace-nowrap flex items-center space-x-1">
          {children}
          {isDropdown && <ChevronDown className="w-3 h-3" />}
        </span>
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
