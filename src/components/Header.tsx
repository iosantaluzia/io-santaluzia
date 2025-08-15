
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import HeaderDropdown from "./HeaderDropdown";
import PatientPortalModal from "./PatientPortalModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const navigate = useNavigate();

  const institutoItems = [
    { name: "História", href: "/historia" },
    { name: "Corpo Clínico", href: "/corpo-clinico" }
  ];

  const cirurgiasItems = [
    { name: "Catarata", href: "/catarata" },
    { name: "Cirurgia Refrativa", href: "/cirurgia-refrativa" },
    { name: "Ceratocone", href: "/ceratocone" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-white">
              <img 
                src="/lovable-uploads/logoiosantaluzia-removebg-preview.png" 
                alt="Instituto de Olhos Santa Luzia" 
                className="h-10 w-10 object-contain" 
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif font-semibold text-lg text-medical-primary">
                Instituto de Olhos
              </h1>
              <p className="text-sm text-medical-secondary font-medium">Santa Luzia</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <HeaderDropdown title="O Instituto" items={institutoItems} />
            <HeaderDropdown title="Cirurgias" items={cirurgiasItems} />
            <a 
              href="/exames" 
              className="text-medical-primary hover:text-medical-secondary transition-colors duration-300 font-medium"
            >
              Exames
            </a>
            <a 
              href="/artigos" 
              className="text-medical-primary hover:text-medical-secondary transition-colors duration-300 font-medium"
            >
              Artigos
            </a>
            <button
              onClick={() => setIsPortalModalOpen(true)}
              className="text-medical-primary hover:text-medical-secondary transition-colors duration-300 font-medium"
            >
              Portal do Paciente
            </button>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button variant="default" className="bg-gradient-primary">
              Agendar Consulta
            </Button>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="lg:hidden p-2 text-medical-primary"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b shadow-medium">
            <nav className="py-4">
              <div className="px-4 py-3">
                <HeaderDropdown title="O Instituto" items={institutoItems} className="w-full justify-between" />
              </div>
              <div className="px-4 py-3">
                <HeaderDropdown title="Cirurgias" items={cirurgiasItems} className="w-full justify-between" />
              </div>
              <a 
                href="/exames" 
                className="block px-4 py-3 text-medical-primary hover:bg-medical-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Exames
              </a>
              <a 
                href="/artigos" 
                className="block px-4 py-3 text-medical-primary hover:bg-medical-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Artigos
              </a>
              <button
                onClick={() => {
                  setIsPortalModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-medical-primary hover:bg-medical-muted transition-colors"
              >
                Portal do Paciente
              </button>
              <div className="px-4 py-3">
                <Button variant="default" className="w-full bg-gradient-primary">
                  Agendar Consulta
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>

      <PatientPortalModal 
        isOpen={isPortalModalOpen} 
        onClose={() => setIsPortalModalOpen(false)} 
      />
    </header>
  );
};

export default Header;
