import { Button } from "@/components/ui/button";
interface FooterProps {
  logo: React.ReactNode;
  brandName: string;
  socialLinks: Array<{
    icon: React.ReactNode;
    href: string;
    label: string;
  }>;
  mainLinks: Array<{
    href: string;
    label: string;
  }>;
  legalLinks: Array<{
    href: string;
    label: string;
  }>;
  copyright: {
    text: string;
    license?: string;
  };
}
export function Footer({
  logo,
  brandName,
  socialLinks,
  mainLinks,
  legalLinks,
  copyright
}: FooterProps) {
  return <footer className="pb-2 pt-6 md:pb-4 md:pt-8 lg:pb-6 lg:pt-12 bg-medical-primary text-white">
      <div className="px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:flex-row md:items-center md:justify-between">
          <a href="/" className="flex items-center gap-x-2" aria-label={brandName}>
            {logo}
            <span className="font-bold text-xl text-white">{brandName}</span>
          </a>
          <ul className="flex list-none mt-6 md:mt-0 space-x-3 justify-center">
            {socialLinks.map((link, i) => <li key={i}>
                <Button variant="secondary" size="icon" className="h-11 w-11 md:h-14 md:w-14 rounded-full bg-white/10 hover:bg-white/20 text-white [&_svg]:!h-[24px] [&_svg]:!w-[24px] md:[&_svg]:!h-[30px] md:[&_svg]:!w-[30px]" asChild>
                  <a href={link.href} target="_blank" aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              </li>)}
          </ul>
        </div>
        <div className="border-t border-white/20 mt-6 pt-6 md:mt-4 md:pt-8 lg:grid lg:grid-cols-10">
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-2 lg:justify-end">
              {mainLinks.map((link, i) => <li key={i} className="my-1 mx-2 shrink-0">
                  <a href={link.href} className="text-sm text-white underline-offset-4 hover:underline">
                    {link.label}
                  </a>
                </li>)}
            </ul>
          </nav>
          <div className="mt-6 lg:mt-0 lg:col-[4/11]">
            
          </div>
          <div className="mt-6 text-xs md:text-sm leading-6 text-white/80 lg:mt-0 lg:row-[1/3] lg:col-[1/4] text-left lg:text-right mx-2 md:mx-0">
            {copyright.text && <div>{copyright.text}</div>}
            {copyright.license && (
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Avenida+dos+Tarumas,+930,+Sinop"
                target="_blank"
                rel="noopener noreferrer"
                className="break-words md:break-all md:whitespace-nowrap text-left hover:underline cursor-pointer block"
              >
                {copyright.license.split(' - CEP:').map((part, index) => (
                  <span key={index}>
                    {index > 0 && (
                      <>
                        <br className="md:hidden" />
                        <span className="md:hidden">CEP:</span>
                        <span className="hidden md:inline md:ml-2">CEP:</span>
                      </>
                    )}
                    {part}
                  </span>
                ))}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>;
}
