
import { useState } from "react";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [{
    name: "Início",
    href: "#inicio"
  }, {
    name: "Sobre",
    href: "#sobre"
  }, {
    name: "Serviços",
    href: "#servicos"
  }, {
    name: "Equipe",
    href: "#equipe"
  }, {
    name: "Contato",
    href: "#contato"
  }];

  return <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-soft">
      {/* Top bar with contact info */}
      

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-white">
              <img 
                src="/lovable-uploads/e187619e-2328-418d-971f-86200b2bb552.png" 
                alt="Instituto de Olhos Santa Luzia" 
                className="h-10 w-10 object-contain animate-spin-slow" 
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
            {navItems.map(item => <a key={item.name} href={item.href} className="text-medical-primary hover:text-medical-secondary transition-colors duration-300 font-medium">
                {item.name}
              </a>)}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button variant="default" className="bg-gradient-primary">
              Agendar Consulta
            </Button>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-medical-primary">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b shadow-medium">
            <nav className="py-4">
              {navItems.map(item => <a key={item.name} href={item.href} className="block px-4 py-3 text-medical-primary hover:bg-medical-muted transition-colors" onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </a>)}
              <div className="px-4 py-3">
                <Button variant="default" className="w-full bg-gradient-primary">
                  Agendar Consulta
                </Button>
              </div>
            </nav>
          </div>}
      </div>
    </header>;
};

export default Header;
