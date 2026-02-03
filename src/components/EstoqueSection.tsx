
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Package, Loader2, Trash2, Edit2, RotateCcw, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { InventoryItemModal } from './InventoryItemModal';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  min_stock: number;
  category: string;
  unit: string;
  status?: string;
}


export function EstoqueSection() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', 'Colírios', 'Lentes', 'Escritório', 'Centro Cirúrgico', 'Consultório', 'Limpeza'];

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
      const itemsWithStatus = (data || []).map(item => {
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
          status: quantity <= 0 ? 'Crítico' : (quantity <= min_stock ? 'Baixo' : 'Normal')
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
        return 'bg-red-100 text-red-800';
      case 'Baixo':
        return 'bg-yellow-100 text-yellow-800';
      case 'Normal':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const criticalItems = items.filter(item => item.status === 'Crítico').length;
  const lowItems = items.filter(item => item.status === 'Baixo').length;

  const filteredItems = selectedCategory === 'Todos'
    ? items
    : items.filter(item => item.category === selectedCategory);

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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold text-cinza-escuro">Inventário Atual</h3>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${selectedCategory === cat
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
            className="bg-medical-primary text-white hover:bg-medical-primary/90"
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
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Item</th>
                <th className="py-3 px-6 text-left">Categoria</th>
                <th className="py-3 px-6 text-center">Quantidade</th>
                <th className="py-3 px-6 text-center">Estoque Mín.</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Ações</th>
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
                filteredItems.map(item => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left font-medium">{item.name}</td>
                    <td className="py-3 px-6 text-left">{item.category}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleQuantityChange(item, -1)}
                          className="p-1 rounded-full text-marrom-acentuado hover:bg-marrom-acentuado hover:text-white transition-colors"
                          title="Diminuir"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-semibold text-gray-800 w-8">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item, 1)}
                          className="p-1 rounded-full text-marrom-acentuado hover:bg-marrom-acentuado hover:text-white transition-colors"
                          title="Aumentar"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-center">{item.min_stock}</td>
                    <td className="py-3 px-6 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
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
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
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
