
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Stethoscope, Eye, FileText, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavigationHeaderProps {
  showLogo: boolean;
}

type HighlightPosition = {
  left: number;
  width: number;
  opacity: number;
};

function NavigationHeader({ showLogo }: NavigationHeaderProps) {
  const [position, setPosition] = useState<HighlightPosition>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);


  const [institutoDropdownOpen, setInstitutoDropdownOpen] = useState(false);
  const [cirurgiasDropdownOpen, setCirurgiasDropdownOpen] = useState(false);
  const institutoButtonRef = useRef<HTMLButtonElement>(null);
  const cirurgiasButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Reset position when switching to mobile
      if (mobile) {
        setPosition({
          left: 0,
          width: 0,
          opacity: 0,
        });
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Atualiza cursor quando dropdowns abrem/fecham
  useEffect(() => {
    if (isMobile) return;

    const updateCursor = () => {
      if (institutoDropdownOpen && institutoButtonRef.current) {
        const { width } = institutoButtonRef.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: institutoButtonRef.current.offsetLeft,
        });
        // Fecha o outro dropdown se estiver aberto
        if (cirurgiasDropdownOpen) {
          setCirurgiasDropdownOpen(false);
        }
      } else if (cirurgiasDropdownOpen && cirurgiasButtonRef.current) {
        const { width } = cirurgiasButtonRef.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: cirurgiasButtonRef.current.offsetLeft,
        });
        // Fecha o outro dropdown se estiver aberto
        if (institutoDropdownOpen) {
          setInstitutoDropdownOpen(false);
        }
      } else if (!institutoDropdownOpen && !cirurgiasDropdownOpen) {
        // Se nenhum dropdown está aberto, verifica se está na página ativa
        const isInstitutoActive = location.pathname === '/historia' || location.pathname === '/corpo-clinico';
        const isCirurgiasActive = location.pathname === '/catarata' || location.pathname === '/cirurgia-refrativa' || location.pathname === '/ceratocone';
        const isAnyTabActive = location.pathname === '/exames' || location.pathname === '/artigos';

        // Se não está em nenhuma página ativa, remove o hover
        if (!isInstitutoActive && !isCirurgiasActive && !isAnyTabActive) {
          setPosition((prev) => ({
            ...prev,
            opacity: 0,
          }));
        }
      }
    };

    // Pequeno delay para garantir que o DOM foi atualizado
    const timeoutId = setTimeout(updateCursor, 10);
    return () => clearTimeout(timeoutId);
  }, [institutoDropdownOpen, cirurgiasDropdownOpen, isMobile, location.pathname]);

  const institutoItems = [
    { name: "História", href: "/historia" },
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
      <div
        className={cn(
          "fixed top-2 md:top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-sm rounded-full shadow-medium",
          isMobile ? "w-[calc(100vw-1.5rem)] px-2 py-1" : "p-1 md:p-1 lg:p-2"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2 md:gap-1.5 lg:gap-3 xl:gap-4",
            isMobile && "w-full"
          )}
        >
          {showLogo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="cursor-pointer flex-shrink-0 rounded-full overflow-hidden bg-white h-7 w-7 md:h-8 md:w-8 flex items-center justify-center"
              onClick={() => navigate("/")}
            >
              <img
                src="/uploads/e6a1d636-8727-4054-a89d-8ed7337a643a.png"
                alt="Instituto de Olhos Santa Luzia"
                className="h-[35px] w-[35px] md:h-[41px] md:w-[41px] object-contain animate-spin-slow"
              />
            </motion.div>
          )}

          <motion.ul
            layout
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "relative flex items-center rounded-full bg-white",
              isMobile ? "w-full justify-between px-1.5 py-1" : "w-fit p-1"
            )}
            onMouseLeave={() => {
              if (isMobile) return;
              setPosition((pv) => ({ ...pv, opacity: 0 }));
            }}
          >
            {/* Instituto Dropdown */}
            <DropdownMenu open={institutoDropdownOpen} onOpenChange={setInstitutoDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <motion.button
                  ref={institutoButtonRef}
                  layout
                  layoutId="instituto-button"
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  onMouseEnter={(e) => {
                    if (isMobile) return;
                    const button = e.currentTarget;
                    const { width } = button.getBoundingClientRect();
                    setPosition((prev) => ({
                      ...prev,
                      width,
                      opacity: institutoDropdownOpen || location.pathname === '/historia' || location.pathname === '/corpo-clinico' ? 1 : 0.5,
                      left: button.offsetLeft,
                    }));
                    // Remove hover de outros botões
                    if (cirurgiasDropdownOpen) {
                      setCirurgiasDropdownOpen(false);
                    }
                  }}
                  onMouseLeave={() => {
                    if (isMobile || institutoDropdownOpen || location.pathname === '/historia' || location.pathname === '/corpo-clinico') return;
                    setPosition((prev) => ({
                      ...prev,
                      opacity: 0,
                    }));
                  }}
                  className={`relative z-10 cursor-pointer transition-colors rounded-full flex items-center justify-center flex-shrink-0 ${isMobile
                    ? (location.pathname === '/historia' || location.pathname === '/corpo-clinico' || institutoDropdownOpen)
                      ? "px-3 py-1.5"
                      : "px-1.5 py-1"
                    : "px-2 py-1.5 md:px-2 md:py-1.5 lg:px-3 lg:py-2 text-xs uppercase space-x-1"
                    } ${institutoDropdownOpen || location.pathname === '/historia' || location.pathname === '/corpo-clinico'
                      ? "bg-medical-primary text-white font-semibold"
                      : "text-medical-primary hover:text-white hover:bg-medical-primary"
                    }`}
                >
                  {isMobile ? (
                    <div className="flex items-center gap-1">
                      <AnimatePresence mode="sync">
                        {(location.pathname === '/historia' || location.pathname === '/corpo-clinico') ? (
                          <motion.div
                            key="text"
                            initial={{ width: 0, opacity: 0, x: -10 }}
                            animate={{ width: 'auto', opacity: 1, x: 0 }}
                            exit={{ width: 0, opacity: 0, x: -10 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden flex items-center gap-1"
                          >
                            <span className="text-[12px] whitespace-nowrap font-semibold uppercase">O Instituto</span>
                            <ChevronDown className="w-3 h-3 flex-shrink-0" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon"
                            initial={{ width: 0, opacity: 0, scale: 0.8 }}
                            animate={{ width: 'auto', opacity: 1, scale: 1 }}
                            exit={{ width: 0, opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                          >
                            <Home className="w-4 h-4 flex-shrink-0" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <>
                      <span className="whitespace-nowrap">O Instituto</span>
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-lg p-2 min-w-[200px] z-[200]">
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
            <DropdownMenu open={cirurgiasDropdownOpen} onOpenChange={setCirurgiasDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <motion.button
                  ref={cirurgiasButtonRef}
                  layout
                  layoutId="cirurgias-button"
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  onMouseEnter={(e) => {
                    if (isMobile) return;
                    const button = e.currentTarget;
                    const { width } = button.getBoundingClientRect();
                    setPosition((prev) => ({
                      ...prev,
                      width,
                      opacity: cirurgiasDropdownOpen || location.pathname === '/catarata' || location.pathname === '/cirurgia-refrativa' || location.pathname === '/ceratocone' ? 1 : 0.5,
                      left: button.offsetLeft,
                    }));
                    // Remove hover de outros botões
                    if (institutoDropdownOpen) {
                      setInstitutoDropdownOpen(false);
                    }
                  }}
                  onMouseLeave={() => {
                    if (isMobile || cirurgiasDropdownOpen || location.pathname === '/catarata' || location.pathname === '/cirurgia-refrativa' || location.pathname === '/ceratocone') return;
                    setPosition((prev) => ({
                      ...prev,
                      opacity: 0,
                    }));
                  }}
                  className={`relative z-10 cursor-pointer transition-colors rounded-full flex items-center justify-center flex-shrink-0 ${isMobile
                    ? (location.pathname === '/catarata' || location.pathname === '/cirurgia-refrativa' || location.pathname === '/ceratocone' || cirurgiasDropdownOpen)
                      ? "px-3 py-1.5"
                      : "px-1.5 py-1"
                    : "px-2 py-1.5 md:px-2 md:py-1.5 lg:px-3 lg:py-2 text-xs uppercase space-x-1"
                    } ${cirurgiasDropdownOpen || location.pathname === '/catarata' || location.pathname === '/cirurgia-refrativa' || location.pathname === '/ceratocone'
                      ? "bg-medical-primary text-white font-semibold"
                      : "text-medical-primary hover:text-white hover:bg-medical-primary"
                    }`}
                >
                  {isMobile ? (
                    <div className="flex items-center gap-1">
                      <AnimatePresence mode="sync">
                        {(location.pathname === '/catarata' || location.pathname === '/cirurgia-refrativa' || location.pathname === '/ceratocone') ? (
                          <motion.div
                            key="text"
                            initial={{ width: 0, opacity: 0, x: -10 }}
                            animate={{ width: 'auto', opacity: 1, x: 0 }}
                            exit={{ width: 0, opacity: 0, x: -10 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden flex items-center gap-1"
                          >
                            <span className="text-[12px] whitespace-nowrap font-semibold uppercase">Cirurgias</span>
                            <ChevronDown className="w-3 h-3 flex-shrink-0" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon"
                            initial={{ width: 0, opacity: 0, scale: 0.8 }}
                            animate={{ width: 'auto', opacity: 1, scale: 1 }}
                            exit={{ width: 0, opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                          >
                            <Eye className="w-4 h-4 flex-shrink-0" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <>
                      <span className="whitespace-nowrap">Cirurgias</span>
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200 shadow-lg rounded-lg p-2 min-w-[200px] z-[200]">
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
                onClick={() => {
                  navigate(item.path);
                  // Fecha dropdowns quando navegar
                  setInstitutoDropdownOpen(false);
                  setCirurgiasDropdownOpen(false);
                }}
                isMobile={isMobile}
                icon={item.icon}
                hasDropdownOpen={institutoDropdownOpen || cirurgiasDropdownOpen}
              >
                {item.name}
              </Tab>
            ))}



            <Cursor position={position} isMobile={isMobile} />
          </motion.ul>
        </div>
      </div>


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
  hasDropdownOpen = false,
}: {
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<HighlightPosition>>;
  isActive: boolean;
  onClick: () => void;
  isMobile: boolean;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  hasDropdownOpen?: boolean;
}) => {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!isActive || !ref.current || isMobile) {
      if (!isActive && !isMobile) {
        setPosition((prev) => ({ ...prev, opacity: 0 }));
      }
      return;
    }
    // Delay para aguardar a animação de layout terminar
    const timeoutId = setTimeout(() => {
      if (!ref.current) return;
      const { width } = ref.current.getBoundingClientRect();
      setPosition({
        width,
        opacity: 1,
        left: ref.current.offsetLeft,
      });
    }, 350); // Aguarda a animação de 0.3s + pequeno buffer

    return () => clearTimeout(timeoutId);
  }, [isActive, setPosition, isMobile]);

  return (
    <motion.li
      layout
      layoutId={`tab-${children}`}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      ref={ref}
      onMouseEnter={() => {
        if (isMobile || !ref.current || isActive || hasDropdownOpen) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition((prev) => ({
          ...prev,
          width,
          opacity: 0.5,
          left: ref.current.offsetLeft,
        }));
      }}
      onMouseLeave={() => {
        if (isMobile || isActive || hasDropdownOpen) return;
        setPosition((prev) => ({
          ...prev,
          opacity: 0,
        }));
      }}
      onClick={() => {
        onClick();
        if (!isActive && !isMobile) {
          // Se não está ativo, esconde o cursor imediatamente após o clique
          setPosition((prev) => ({
            ...prev,
            opacity: 0,
          }));
        } else if (isActive && !isMobile) {
          // Se está ativo, atualiza após um delay para aguardar animação
          setTimeout(() => {
            if (!ref.current) return;
            const { width } = ref.current.getBoundingClientRect();
            setPosition({
              width,
              opacity: 1,
              left: ref.current.offsetLeft,
            });
          }, 350);
        }
      }}
      className={cn(
        "relative z-10 block cursor-pointer transition-colors rounded-full flex items-center justify-center flex-shrink-0",
        isMobile
          ? isActive
            ? "px-3 py-1.5"
            : "px-1.5 py-1"
          : "px-2 py-1.5 md:px-2 md:py-1.5 lg:px-3 lg:py-2 text-xs uppercase",
        isActive
          ? "bg-medical-primary text-white font-semibold shadow-soft"
          : isMobile
            ? "text-medical-primary active:bg-transparent"
            : "text-medical-primary hover:text-white hover:bg-medical-primary/50 focus:outline-none focus:bg-transparent"
      )}
    >
      {isMobile ? (
        <div className="flex items-center">
          <AnimatePresence mode="sync">
            {isActive ? (
              <motion.div
                key="text"
                initial={{ width: 0, opacity: 0, x: -10 }}
                animate={{ width: 'auto', opacity: 1, x: 0 }}
                exit={{ width: 0, opacity: 0, x: -10 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <span className="text-[12px] whitespace-nowrap font-semibold uppercase">
                  {typeof children === 'string' && children === 'Exames complementares' ? 'Exames' : children}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="icon"
                initial={{ width: 0, opacity: 0, scale: 0.8 }}
                animate={{ width: 'auto', opacity: 1, scale: 1 }}
                exit={{ width: 0, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <span className="whitespace-nowrap">
          {children}
        </span>
      )}
    </motion.li>
  );
};

const Cursor = ({ position, isMobile }: { position: HighlightPosition; isMobile: boolean }) => {
  if (isMobile) return null;

  return (
    <motion.li
      animate={position}
      transition={{
        type: "tween",
        ease: [0.4, 0, 0.2, 1],
        duration: 0.4
      }}
      className={cn(
        "absolute z-0 pointer-events-none rounded-full bg-medical-primary",
        "h-7 md:h-7 lg:h-8 xl:h-10"
      )}
    />
  );
};

export default NavigationHeader;
