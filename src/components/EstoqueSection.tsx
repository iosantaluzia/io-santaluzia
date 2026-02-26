
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Package, Loader2, Trash2, Edit2, RotateCcw, Minus, Search, Calendar as CalendarIcon, LayoutGrid, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { InventoryItemModal } from './InventoryItemModal';
import { toast } from 'sonner';
import { format, isPast, isWithinInterval, addMonths } from 'date-fns';

interface ExpirationBatch {
  date: string;
  quantity: number;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  min_stock: number;
  category: string;
  unit: string;
  status?: string;
  expirations?: ExpirationBatch[];
}


export function EstoqueSection() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Todos', 'Colírios', 'Lentes', 'IOL', 'Escritório', 'Centro Cirúrgico', 'Consultório', 'Limpeza'];

  const getCategoryStyles = (category: string) => {
    const styles: Record<string, { bar: string, badge: string, img: string }> = {
      'Colírios': {
        bar: 'bg-cyan-500',
        badge: 'bg-cyan-50 text-cyan-600',
        img: '/uploads/eyedrops.png'
      },
      'Lentes': {
        bar: 'bg-indigo-500',
        badge: 'bg-indigo-50 text-indigo-600',
        img: '/uploads/lens.png'
      },
      'IOL': {
        bar: 'bg-violet-500',
        badge: 'bg-violet-50 text-violet-600',
        img: '/uploads/IOL.png'
      },
      'Escritório': {
        bar: 'bg-orange-500',
        badge: 'bg-orange-50 text-orange-600',
        img: '/uploads/escritorio.png'
      },
      'Centro Cirúrgico': {
        bar: 'bg-red-500',
        badge: 'bg-red-50 text-red-600',
        img: '/uploads/centrocirurgico.png'
      },
      'Consultório': {
        bar: 'bg-emerald-500',
        badge: 'bg-emerald-50 text-emerald-600',
        img: '/uploads/oftalmoscopio.png'
      },
      'Limpeza': {
        bar: 'bg-emerald-500',
        badge: 'bg-emerald-50 text-emerald-600',
        img: '/uploads/limpeza.png'
      }
    };
    return styles[category] || {
      bar: 'bg-gray-400',
      badge: 'bg-gray-100 text-gray-600',
      img: '/uploads/building.png'
    };
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('name');

      if (error) throw error;

      // Process status locally and normalize categories
      const itemsWithStatus = ((data as any[]) || []).map(item => {
        const quantity = item.quantity ?? 0;
        const min_stock = item.min_stock ?? 0;

        // Normalize categories to match the new system
        let category = item.category || 'Outros';
        if (category === 'Material Escritório' || category === 'Papelaria') {
          category = 'Escritório';
        } else if (category === 'Medicamentos') {
          category = 'Colírios';
        } else if (category === 'Material Médico') {
          category = 'Centro Cirúrgico';
        }

        return {
          ...item,
          name: item.name || 'Sem nome',
          quantity: quantity,
          min_stock: min_stock,
          category: category,
          unit: item.unit || 'unidade',
          status: quantity <= 0 ? 'Crítico' : (quantity <= min_stock ? 'Baixo' : 'Normal'),
          expirations: Array.isArray(item.expirations) ? item.expirations : []
        };
      });

      setItems(itemsWithStatus);
    } catch (error: any) {
      console.error('Erro ao buscar estoque:', error);
      toast.error('Não foi possível carregar o estoque. Verifique se o banco de dados está configurado.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Item removido com sucesso!');
      fetchInventory();
    } catch (error: any) {
      toast.error('Erro ao remover item: ' + error.message);
    }
  };


  const handleQuantityChange = async (item: InventoryItem, delta: number) => {
    const newQuantity = Math.max(0, item.quantity + delta);

    // Update local state first for immediate UI feedback
    setItems(prev => prev.map(i => i.id === item.id ? {
      ...i,
      quantity: newQuantity,
      status: newQuantity <= 0 ? 'Crítico' : (newQuantity <= i.min_stock ? 'Baixo' : 'Normal')
    } : i));

    try {
      const { error } = await supabase
        .from('inventory')
        .update({ quantity: newQuantity })
        .eq('id', item.id);

      if (error) throw error;
    } catch (error: any) {
      console.error('Erro ao atualizar quantidade:', error);
      toast.error('Erro ao salvar no banco de dados');
      fetchInventory(); // Revert to server state if error
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Crítico':
        return 'bg-red-500';
      case 'Baixo':
        return 'bg-yellow-500';
      case 'Normal':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getExpirationStatus = (expirations?: ExpirationBatch[]) => {
    if (!expirations || expirations.length === 0) return { label: '-', class: 'text-gray-400' };

    const sortedExpirations = [...expirations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const closest = new Date(sortedExpirations[0].date + 'T12:00:00');
    const label = format(closest, 'dd/MM/yyyy');

    if (isPast(closest)) return { label, class: 'text-red-600 font-bold', icon: true };
    if (isWithinInterval(closest, { start: new Date(), end: addMonths(new Date(), 3) })) {
      return { label, class: 'text-orange-600 font-semibold', icon: true };
    }

    return { label, class: 'text-gray-700' };
  };

  const criticalItems = items.filter(item => item.status === 'Crítico').length;
  const lowItems = items.filter(item => item.status === 'Baixo').length;

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-bege-principal" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-cinza-escuro">Controle de Estoque</h2>
        <Button onClick={fetchInventory} variant="ghost" size="sm">
          <RotateCcw className="h-4 w-4 mr-1" /> Atualizar
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Itens Críticos</p>
              <p className="text-2xl font-bold text-red-600">{criticalItems}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Estoque Baixo</p>
              <p className="text-2xl font-bold text-yellow-600">{lowItems}</p>
            </div>
            <Package className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Itens</p>
              <p className="text-2xl font-bold text-cinza-escuro">{items.length}</p>
            </div>
            <Package className="h-8 w-8 text-bege-principal" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex justify-between items-center bg-gray-50/50 -mx-6 -mt-6 p-6 border-b border-gray-100 rounded-t-lg">
            <h3 className="text-xl font-bold text-cinza-escuro tracking-tight flex items-center gap-2">
              <Package className="h-6 w-6 text-marrom-acentuado" />
              Inventário Geral
            </h3>
            <Button
              className="bg-medical-primary text-white hover:bg-medical-primary/90 shadow-sm"
              onClick={() => {
                setEditingItem(null);
                setIsModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full">
            <div className="relative group transition-all duration-300 ease-in-out w-full md:w-32 md:focus-within:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-marrom-acentuado transition-colors" />
              <Input
                placeholder="Pesquisar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all h-9 text-sm ${searchTerm ? 'md:w-72' : ''}`}
              />
            </div>

            <div className="flex flex-nowrap bg-gray-100 p-1 rounded-lg overflow-x-auto no-scrollbar flex-1 max-w-full gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-all whitespace-nowrap ${selectedCategory === cat
                    ? 'bg-marrom-acentuado text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {cat === 'Todos' ? 'Todos' : cat}
                </button>
              ))}
            </div>

            {selectedCategory !== 'Todos' && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedCategory('Todos');
                  setSearchTerm('');
                }}
                className="text-gray-500 hover:text-medical-primary font-medium text-xs gap-2 shrink-0"
              >
                <LayoutGrid className="h-4 w-4" />
                Categorias
              </Button>
            )}
          </div>
        </div>

        {selectedCategory === 'Todos' && searchTerm === '' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            {categories.filter(c => c !== 'Todos').map((cat) => {
              const style = getCategoryStyles(cat);
              const count = items.filter(s => s.category === cat).length;
              return (
                <Card
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="group flex flex-col items-center justify-center p-4 cursor-pointer transition-all border-gray-100 bg-white active:scale-95 overflow-hidden min-h-[180px]"
                >
                  <div className="flex items-center justify-center w-full mb-3">
                    <div className="relative h-28 w-28 md:h-32 md:w-32 flex items-center justify-center transition-colors duration-500">
                      <img
                        src={style.img}
                        alt={cat}
                        className="h-22 w-22 md:h-26 md:w-26 object-contain group-hover:scale-110 transition-transform duration-500 z-10"
                      />
                    </div>
                  </div>
                  <div className="text-center px-1">
                    <h3 className="text-sm font-black text-cinza-escuro tracking-tight leading-tight line-clamp-2">{cat}</h3>
                    <div className="flex items-center justify-center gap-1 mt-1.5">
                      <span className="text-xs font-bold text-gray-400">
                        {count} {count === 1 ? 'item' : 'itens'}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700 uppercase text-xs sm:text-sm leading-normal">
                  <th className="py-3 px-3 sm:px-6 text-left">Item</th>
                  <th className="py-3 px-3 sm:px-6 text-left hidden md:table-cell">Categoria</th>
                  <th className="py-3 px-3 sm:px-6 text-center">Quantidade</th>
                  <th className="py-3 px-3 sm:px-6 text-center">Validade Próxima</th>
                  <th className="py-3 px-3 sm:px-6 text-center">Estoque Mín.</th>
                  <th className="py-3 px-3 sm:px-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500">
                      Nenhum item encontrado nesta categoria.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(item => {
                    const expStatus = getExpirationStatus(item.expirations);
                    return (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td
                          className="py-3 px-3 sm:px-6 text-left cursor-pointer hover:text-marrom-acentuado"
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${getStatusColor(item.status)}`}
                              title={item.status}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-800">{item.name}</span>
                              <span className="text-[10px] text-gray-400 md:hidden">{item.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 sm:px-6 text-left hidden md:table-cell">{item.category}</td>
                        <td className="py-3 px-3 sm:px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item, -1)}
                              className="p-1 rounded-full text-marrom-acentuado hover:bg-marrom-acentuado hover:text-white transition-colors"
                              title="Diminuir"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="font-semibold text-gray-800 min-w-[20px]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item, 1)}
                              className="p-1 rounded-full text-marrom-acentuado hover:bg-marrom-acentuado hover:text-white transition-colors"
                              title="Aumentar"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3 sm:px-6 text-center">
                          <div className={`flex items-center justify-center gap-1 ${expStatus.class}`}>
                            {expStatus.icon && <CalendarIcon className="h-3 w-3" />}
                            <span>{expStatus.label}</span>
                            {item.expirations && item.expirations.length > 1 && (
                              <span className="ml-1 text-[10px] bg-gray-100 text-gray-500 px-1 rounded-sm" title="Múltiplos lotes">
                                +{item.expirations.length - 1}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 sm:px-6 text-center hidden sm:table-cell">{item.min_stock} {item.unit}</td>
                        <td className="py-3 px-3 sm:px-6 text-center">
                          <div className="flex justify-center space-x-1 sm:space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setEditingItem(item);
                                setIsModalOpen(true);
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      <InventoryItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itemToEdit={editingItem}
        onSave={fetchInventory}
      />
    </div>
  );
}
