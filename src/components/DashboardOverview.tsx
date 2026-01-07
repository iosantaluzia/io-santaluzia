
import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  UserPlus, 
  FileWarning, 
  AlertTriangle,
  Search,
  Plus,
  Tag,
  ClipboardPen,
  Box,
  Edit,
  Upload,
  Calendar,
  UserCircle,
  Eye,
  Clock
} from 'lucide-react';
import { WaitlistModal } from './WaitlistModal';
import { UsefulCodesModal } from './UsefulCodesModal';
import { AppointmentForm } from './AppointmentForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DashboardOverviewProps {
  onSectionChange: (section: string) => void;
}

interface CardData {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  overlayIcon: React.ComponentType<{ className?: string }>;
  section: string;
  image: string;
  tags: string[];
}

const STORAGE_KEY = 'dashboard-card-images';

export function DashboardOverview({ onSectionChange }: DashboardOverviewProps) {
  const { appUser } = useAuth();
  const isAdmin = appUser?.role === 'admin';
  
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showUsefulCodes, setShowUsefulCodes] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const defaultCards: CardData[] = [
    {
      title: "Agendamentos Recentes",
      description: "Acesse rapidamente os últimos agendamentos da clínica.",
      icon: CalendarCheck,
      overlayIcon: Calendar,
      section: "agendamentos",
      image: "https://placehold.co/200x190/F0F0F0/4A4A4A?text=Agendamentos",
      tags: ["agendamento", "consultas"]
    },
    {
      title: "Novo Paciente",
      description: "Cadastre um novo paciente de forma ágil e simples.",
      icon: UserPlus,
      overlayIcon: UserCircle,
      section: "pacientes",
      image: "https://placehold.co/200x190/F0F0F0/4A4A4A?text=Novo+Paciente",
      tags: ["paciente", "cadastro"]
    },
    {
      title: "Exames Pendentes",
      description: "Verifique os exames que aguardam análise ou upload.",
      icon: FileWarning,
      overlayIcon: Eye,
      section: "exames",
      image: "https://placehold.co/200x190/F0F0F0/4A4A4A?text=Exames",
      tags: ["exames", "pendentes"]
    },
    {
      title: "Estoque Baixo",
      description: "Visualize itens com estoque crítico e faça reposição.",
      icon: AlertTriangle,
      overlayIcon: Box,
      section: "estoque",
      image: "/dashboard/estoque.png",
      tags: ["estoque", "insumos"]
    },
  ];

  // Carregar imagens salvas do localStorage
  const [shortcutCards, setShortcutCards] = useState<CardData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedImages = JSON.parse(saved);
        return defaultCards.map((card, index) => ({
          ...card,
          image: savedImages[index] || card.image
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar imagens salvas:', error);
    }
    return defaultCards;
  });

  // Salvar imagens no localStorage quando mudarem
  useEffect(() => {
    const images = shortcutCards.map(card => card.image);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  }, [shortcutCards]);

  const handleEditClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) return;
    setEditingCardIndex(index);
    setImageUrl(shortcutCards[index].image);
    setPreviewUrl(shortcutCards[index].image);
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setPreviewUrl(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione um arquivo de imagem');
        return;
      }

      // Criar URL temporária para preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = () => {
    if (editingCardIndex === null) return;

    const updatedCards = [...shortcutCards];
    updatedCards[editingCardIndex] = {
      ...updatedCards[editingCardIndex],
      image: imageUrl || updatedCards[editingCardIndex].image
    };
    setShortcutCards(updatedCards);
    setEditingCardIndex(null);
    setImageUrl('');
    setPreviewUrl('');
    toast.success('Imagem atualizada com sucesso!');
  };

  const handleCancelEdit = () => {
    setEditingCardIndex(null);
    setImageUrl('');
    setPreviewUrl('');
  };

  return (
    <div className="flex flex-col gap-8 pb-8 pt-8">
      {/* Layout em duas colunas: Esquerda (conteúdo) e Direita (cards) */}
      <div className="px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Coluna Esquerda: Título, Pesquisa e Botões */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Botões de Ação Rápida - Topo */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowAppointmentForm(true)}
                className="bg-gradient-to-b from-white to-gray-50 text-cinza-escuro h-8 relative inline-flex items-center px-3 py-1.5 group text-sm font-medium leading-5 rounded-md shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_-0.5px_0.5px_rgba(0,0,0,0.05)_inset,0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bege-principal/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Plus className="size-3.5 mr-1.5" /> Novo Agendamento
              </button>
              <button
                onClick={() => onSectionChange('financeiro')}
                className="text-cinza-escuro hover:text-bege-principal flex items-center h-8 px-3 py-1.5 text-sm font-medium"
              >
                <ClipboardPen className="size-3.5 mr-1.5" /> Relatórios
              </button>
            </div>

            {/* Seção Superior: Título, Status e Informações */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-5xl font-black text-cinza-escuro">Painel Clínico</h1>
                <div className="items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-cinza-escuro border border-bege-principal/10 hidden md:flex">
                  <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse mr-1"></span>Online
                </div>
              </div>
              
              <div className="flex flex-col items-center lg:items-start mb-4">
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

            {/* Lista de Espera e Códigos Úteis */}
            <div className="flex justify-center lg:justify-start gap-2">
              <button
                onClick={() => setShowWaitlist(true)}
                className="bg-marrom-acentuado hover:bg-marrom-acentuado/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Lista de Espera
              </button>
              <button
                onClick={() => setShowUsefulCodes(true)}
                className="bg-medical-primary hover:bg-medical-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Tag className="h-4 w-4" />
                Códigos Úteis
              </button>
            </div>

            {/* Barra de Pesquisa */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-full max-w-md">
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
          </div>

          {/* Coluna Direita: Cards de Atalho */}
          <div className="lg:col-span-2">
            <div className="bg-gray-200/40 border border-dashed border-gray-300 py-6 px-6 rounded-[1.9rem]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {shortcutCards.map((card, index) => (
                  <div key={index} className="relative w-full">
                    <button
                      onClick={() => onSectionChange(card.section)}
                      className="w-full text-left"
                    >
                      <div className="group relative break-inside-avoid w-full">
                        <div className="w-full">
                          <div className={`rounded-[24px] ${card.section === 'estoque' ? 'bg-white' : 'bg-white'} p-2 no-underline transition-colors hover:bg-gray-50 shadow-sm border border-gray-100 w-full`}>
                            {card.section === 'estoque' ? (
                              /* Layout especial para estoque: texto à esquerda, imagem à direita */
                              <div className="flex items-center gap-4 h-[190px] px-2">
                                <div className="flex-1 flex flex-col justify-center">
                                  <h3 className="text-xl text-cinza-escuro leading-tight font-bold mb-2">{card.title}</h3>
                                </div>
                                <div className="relative h-full w-48 flex-shrink-0 rounded-[16px] overflow-hidden bg-white">
                                  <img
                                    src="/dashboard/estoque.png"
                                    alt={card.title}
                                    className="rounded-[16px] object-contain h-full w-full bg-white"
                                  />
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="relative h-[190px] w-full rounded-[20px] mb-6 shadow-sm overflow-hidden">
                                  <img
                                    src={card.image}
                                    alt={card.title}
                                    width="200"
                                    height="200"
                                    className="rounded-[16px] object-cover absolute h-full w-full inset-0"
                                  />
                                  {/* Ícone SVG específico para cada card */}
                                  <div className="absolute inset-0 rounded-[16px] flex items-center justify-center bg-gradient-to-b from-black/20 via-black/10 to-transparent">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 border-2 border-white/30 shadow-xl">
                                      <card.overlayIcon className="h-12 w-12 text-white drop-shadow-2xl" strokeWidth={2} />
                                    </div>
                                  </div>
                                </div>
                                <h3 className="text-lg mt-2 text-cinza-escuro leading-tight px-1 font-semibold mb-0.5">{card.title}</h3>
                              </>
                            )}
                            {card.section !== 'estoque' && (
                              <div className="flex items-center p-6 pt-0">
                                <div className="p-1 py-1.5 px-1.5 rounded-md text-gray-500 flex items-center gap-1 absolute bottom-2 right-2 rounded-br-[16px]">
                                  <Tag className="h-4 w-4 ml-[1px]" />
                                  <p className="flex items-center gap-1 tracking-tight text-gray-700 pr-1 text-xs">{card.tags.join(', ')}</p>
                                </div>
                              </div>
                            )}
                            {card.section === 'estoque' && (
                              <div className="flex items-center px-2 pb-2">
                                <div className="p-1 py-1.5 px-1.5 rounded-md text-gray-500 flex items-center gap-1">
                                  <Tag className="h-4 w-4 ml-[1px]" />
                                  <p className="flex items-center gap-1 tracking-tight text-gray-700 pr-1 text-xs">{card.tags.join(', ')}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                    {/* Botão de edição (apenas para admin) */}
                    {isAdmin && (
                      <button
                        onClick={(e) => handleEditClick(index, e)}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all hover:scale-110"
                        title="Editar imagem"
                      >
                        <Edit className="h-4 w-4 text-gray-700" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição de Imagem */}
      <Dialog open={editingCardIndex !== null} onOpenChange={handleCancelEdit}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Imagem do Card</DialogTitle>
            <DialogDescription>
              Altere a imagem do card "{shortcutCards[editingCardIndex || 0]?.title}". Você pode fazer upload de uma imagem ou usar uma URL.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Preview da imagem */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Box className="h-16 w-16" />
                  </div>
                )}
              </div>
            </div>

            {/* Upload de arquivo */}
            <div className="space-y-2">
              <Label htmlFor="file-upload">Upload de Imagem</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                <Upload className="h-5 w-5 text-gray-500" />
              </div>
            </div>

            {/* URL da imagem */}
            <div className="space-y-2">
              <Label htmlFor="image-url">Ou cole a URL da imagem</Label>
              <Input
                id="image-url"
                type="url"
                value={imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg ou /uploads/imagem.png"
              />
              <p className="text-xs text-gray-500">
                Dica: Use caminhos relativos como /uploads/nome-da-imagem.png para imagens locais
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancelar
            </Button>
            <Button onClick={handleSaveImage}>
              Salvar Imagem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <WaitlistModal
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
        onScheduleComplete={() => {
          // Recarregar dados se necessário
        }}
      />

      <UsefulCodesModal
        isOpen={showUsefulCodes}
        onClose={() => setShowUsefulCodes(false)}
      />

      <AppointmentForm
        isOpen={showAppointmentForm}
        onClose={() => {
          setShowAppointmentForm(false);
          // Opcional: mudar para a seção de agendamentos após criar
          // onSectionChange('agendamentos');
        }}
        selectedDate={new Date()}
      />
    </div>
  );
}
