
import React from 'react';
import { 
  CalendarCheck, 
  UserPlus, 
  FileWarning, 
  AlertTriangle,
  Search,
  Plus,
  Tag,
  ClipboardPen
} from 'lucide-react';

interface DashboardOverviewProps {
  onSectionChange: (section: string) => void;
}

export function DashboardOverview({ onSectionChange }: DashboardOverviewProps) {
  const shortcutCards = [
    {
      title: "Agendamentos Recentes",
      description: "Acesse rapidamente os últimos agendamentos da clínica.",
      icon: CalendarCheck,
      section: "agendamentos",
      image: "https://placehold.co/200x190/F0F0F0/4A4A4A?text=Agendamentos",
      tags: ["agendamento", "consultas"]
    },
    {
      title: "Novo Paciente",
      description: "Cadastre um novo paciente de forma ágil e simples.",
      icon: UserPlus,
      section: "pacientes",
      image: "https://placehold.co/200x190/F0F0F0/4A4A4A?text=Novo+Paciente",
      tags: ["paciente", "cadastro"]
    },
    {
      title: "Exames Pendentes",
      description: "Verifique os exames que aguardam análise ou upload.",
      icon: FileWarning,
      section: "exames",
      image: "https://placehold.co/200x190/F0F0F0/4A4A4A?text=Exames",
      tags: ["exames", "pendentes"]
    },
    {
      title: "Estoque Baixo",
      description: "Visualize itens com estoque crítico e faça reposição.",
      icon: AlertTriangle,
      section: "estoque",
      image: "https://placehold.co/200x190/F0F0F0/4A4A4A?text=Estoque",
      tags: ["estoque", "insumos"]
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-8 pt-8">
      {/* Seção Superior: Título, Status e Informações */}
      <div className="flex flex-col items-center text-center px-4">
        <div className="flex items-center space-x-2 mb-2">
          <h1 className="text-5xl font-black text-cinza-escuro">Painel Clínico</h1>
          <div className="items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-cinza-escuro border border-bege-principal/10 hidden md:flex">
            <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse mr-1"></span>Online
          </div>
        </div>
        
        <div className="flex flex-col items-center mb-4">
          <div className="items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-bege-principal text-white shadow">
            Gestão Integrada
          </div>
          <div className="flex items-center mt-2">
            <span className="text-xl font-bold text-cinza-escuro">Instituto Santa Luzia</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm md:text-base max-w-2xl">
          Seu centro de comando para uma gestão eficiente e focada no paciente.
        </p>
      </div>

      {/* Barra de Pesquisa */}
      <div className="flex justify-center px-4">
        <div className="relative max-w-md w-full">
          <div className="flex w-full rounded-md">
            <div className="relative w-full before:pointer-events-none before:absolute before:-inset-1 before:rounded-[9991px] before:border before:border-bege-principal/20 before:opacity-0 before:ring-2 before:ring-bege-principal/40 before:transition focus-within:before:opacity-100 focus-within:after:shadow-cinza-escuro/20">
              <input
                type="search"
                autoComplete="off"
                className="text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:leading-6 border border-gray-200 bg-white/90 py-4 shadow-gray-200/5 placeholder:text-gray-400 focus:bg-white text-gray-800 relative pr-10 pl-12 shadow-sm md:py-5 w-full rounded-[9988px]"
                placeholder="Buscar nos módulos..."
                spellCheck="false"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Ação Rápida */}
      <div className="flex justify-center gap-4 px-4">
        <button
          onClick={() => onSectionChange('agendamentos')}
          className="bg-gradient-to-b from-white to-gray-50 text-cinza-escuro h-9 relative inline-flex items-center px-4 py-2 group text-base font-medium leading-6 rounded-[9px] shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bege-principal/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <Plus className="size-4 mr-1" /> Novo Agendamento
        </button>
        <button
          onClick={() => onSectionChange('financeiro')}
          className="text-cinza-escuro hover:text-bege-principal flex items-center"
        >
          <ClipboardPen className="size-4 mr-1" /> Relatórios
        </button>
      </div>

      {/* Cards de Atalho */}
      <div className="px-4">
        <div className="max-w-6xl mx-auto bg-gray-200/40 border border-dashed border-gray-300 py-6 px-6 rounded-[1.9rem]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shortcutCards.map((card, index) => (
              <button
                key={index}
                onClick={() => onSectionChange(card.section)}
                className="w-full text-left"
              >
                <div className="group relative break-inside-avoid w-full">
                  <div className="w-full">
                    <div className="rounded-[24px] bg-white p-2 no-underline transition-colors hover:bg-gray-50 shadow-sm border border-gray-100 w-full">
                      <div className="relative h-[190px] w-full rounded-[20px] mb-6 shadow-sm">
                        <img
                          src={card.image}
                          alt={card.title}
                          width="200"
                          height="200"
                          className="rounded-[16px] object-cover absolute h-full w-full inset-0"
                        />
                        <div className="absolute inset-0 rounded-[16px] shadow-[0px_0px_0px_1px_rgba(0,0,0,.07),0px_0px_0px_3px_#fff,0px_0px_0px_4px_rgba(0,0,0,.08)]"></div>
                      </div>
                      <h3 className="text-lg mt-2 text-cinza-escuro leading-tight px-1 font-semibold mb-0.5">{card.title}</h3>
                      <div className="flex items-center p-6 pt-0">
                        <div className="p-1 py-1.5 px-1.5 rounded-md text-gray-500 flex items-center gap-1 absolute bottom-2 right-2 rounded-br-[16px]">
                          <Tag className="h-4 w-4 ml-[1px]" />
                          <p className="flex items-center gap-1 tracking-tight text-gray-700 pr-1 text-xs">{card.tags.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
