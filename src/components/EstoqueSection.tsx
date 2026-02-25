
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Package, Loader2, Trash2, Edit2, RotateCcw, Minus, Search, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <h3 className="text-xl font-semibold text-cinza-escuro whitespace-nowrap">Inventário</h3>

            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Filtrar itens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>

            <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap ${selectedCategory === cat
                    ? 'bg-white text-marrom-acentuado shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <Button
            className="bg-medical-primary text-white hover:bg-medical-primary/90 w-full lg:w-auto"
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Item
          </Button>
        </div>

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
