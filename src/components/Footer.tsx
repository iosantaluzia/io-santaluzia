import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Serviços",
      links: [
        "Consultas Oftalmológicas",
        "Cirurgia de Catarata",
        "Cirurgia Refrativa",
        "Tratamento de Glaucoma",
        "Retina",
        "Exames Especializados"
      ]
    },
    {
      title: "Instituto",
      links: [
        "Sobre Nós",
        "Nossa Equipe",
        "Estrutura",
        "Convênios",
        "Depoimentos",
        "Blog"
      ]
    },
    {
      title: "Atendimento",
      links: [
        "Agendar Consulta",
        "Resultados de Exames",
        "Segunda Via",
        "Emergências",
        "Localização",
        "Contato"
      ]
    }
  ];

  const socialLinks = [
    { icon: <Instagram className="h-5 w-5" />, href: "#", label: "Instagram" },
    { icon: <Facebook className="h-5 w-5" />, href: "#", label: "Facebook" },
    { icon: <Linkedin className="h-5 w-5" />, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-medical-primary text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/lovable-uploads/a89a1d61-75ee-4ff2-8233-42d51ff14f18.png" 
                alt="Instituto de Olhos Santa Luzia" 
                className="h-12 w-auto brightness-0 invert"
              />
              <div>
                <h3 className="font-serif font-semibold text-lg">
                  Instituto de Olhos
                </h3>
                <p className="text-sm text-white/80">Santa Luzia</p>
              </div>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Mais de 15 anos cuidando da saúde dos seus olhos com excelência, 
              tecnologia de ponta e atendimento humanizado.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold text-lg mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">(85) 3456-7890</p>
                <p className="text-sm text-white/80">(85) 9 8765-4321</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">contato@santaoftalmo.com.br</p>
                <p className="text-sm text-white/80">agendamento@santaoftalmo.com.br</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Rua Silva Paulet, 1218</p>
                <p className="text-sm text-white/80">Aldeota, Fortaleza - CE</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-white/80">
              © {currentYear} Instituto de Olhos Santa Luzia. Todos os direitos reservados.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                LGPD
              </a>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-white/60">
              CRM: 12345-CE | CNPJ: 12.345.678/0001-90 | Responsável Técnico: Dr. Carlos Silva
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;