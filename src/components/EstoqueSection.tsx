
import React from 'react';
import { AlertTriangle, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EstoqueSection() {
  const stockData = [
    { id: 1, item: 'Colírio Hipromelose', quantity: 5, minStock: 10, status: 'Baixo', category: 'Medicamentos' },
    { id: 2, item: 'Lentes de Contato (-2.00)', quantity: 15, minStock: 20, status: 'Baixo', category: 'Lentes' },
    { id: 3, item: 'Papel para Impressão', quantity: 50, minStock: 25, status: 'Normal', category: 'Material Escritório' },
    { id: 4, item: 'Algodão Oftálmico', quantity: 2, minStock: 15, status: 'Crítico', category: 'Material Médico' },
  ];

  const getStatusColor = (status: string) => {
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

  const criticalItems = stockData.filter(item => item.status === 'Crítico').length;
  const lowItems = stockData.filter(item => item.status === 'Baixo').length;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-cinza-escuro mb-4">Controle de Estoque</h2>
      
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
              <p className="text-2xl font-bold text-cinza-escuro">{stockData.length}</p>
            </div>
            <Package className="h-8 w-8 text-bege-principal" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-cinza-escuro">Inventário Atual</h3>
          <Button className="bg-bege-principal text-white hover:bg-marrom-acentuado">
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
              {stockData.map(item => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left font-medium">{item.item}</td>
                  <td className="py-3 px-6 text-left">{item.category}</td>
                  <td className="py-3 px-6 text-center">{item.quantity}</td>
                  <td className="py-3 px-6 text-center">{item.minStock}</td>
                  <td className="py-3 px-6 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button variant="ghost" size="sm">Editar</Button>
                      <Button variant="ghost" size="sm" className="text-bege-principal hover:text-marrom-acentuado">
                        Repor
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alertas de Estoque */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            <h4 className="text-sm font-semibold text-yellow-800">Alertas de Estoque</h4>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            {criticalItems} item(ns) com estoque crítico e {lowItems} item(ns) com estoque baixo requerem atenção.
          </p>
        </div>
      </div>
    </div>
  );
}
