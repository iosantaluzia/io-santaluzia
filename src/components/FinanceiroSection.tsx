
import React from 'react';
import { TrendingUp, DollarSign, Calendar, FileText } from 'lucide-react';

export function FinanceiroSection() {
  const financialData = {
    monthlyRevenue: 45000,
    dailyAverage: 1500,
    pendingPayments: 8500,
    totalPatients: 120
  };

  const recentTransactions = [
    { id: 1, patient: 'Ana Silva', service: 'Consulta Oftalmológica', amount: 250, date: '05/08/2024', status: 'Pago' },
    { id: 2, patient: 'Bruno Costa', service: 'Cirurgia de Catarata', amount: 3500, date: '04/08/2024', status: 'Pendente' },
    { id: 3, patient: 'Carla Dias', service: 'Exame de Acuidade Visual', amount: 150, date: '04/08/2024', status: 'Pago' },
    { id: 4, patient: 'Daniel Rocha', service: 'Mapeamento de Retina', amount: 400, date: '03/08/2024', status: 'Pago' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-cinza-escuro mb-4">Relatórios Financeiros</h2>
      
      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Receita Mensal</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(financialData.monthlyRevenue)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Média Diária</p>
              <p className="text-2xl font-bold text-bege-principal">{formatCurrency(financialData.dailyAverage)}</p>
            </div>
            <Calendar className="h-8 w-8 text-bege-principal" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pagamentos Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(financialData.pendingPayments)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pacientes Atendidos</p>
              <p className="text-2xl font-bold text-cinza-escuro">{financialData.totalPatients}</p>
            </div>
            <FileText className="h-8 w-8 text-cinza-escuro" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
        <h3 className="text-xl font-semibold text-cinza-escuro mb-4">Transações Recentes</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Paciente</th>
                <th className="py-3 px-6 text-left">Serviço</th>
                <th className="py-3 px-6 text-right">Valor</th>
                <th className="py-3 px-6 text-center">Data</th>
                <th className="py-3 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {recentTransactions.map(transaction => (
                <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left font-medium">{transaction.patient}</td>
                  <td className="py-3 px-6 text-left">{transaction.service}</td>
                  <td className="py-3 px-6 text-right font-semibold">{formatCurrency(transaction.amount)}</td>
                  <td className="py-3 px-6 text-center">{transaction.date}</td>
                  <td className="py-3 px-6 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${transaction.status === 'Pago' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumo do Período */}
        <div className="mt-6 p-4 bg-bege-principal/10 border border-bege-principal/20 rounded-md">
          <h4 className="text-lg font-semibold text-cinza-escuro mb-2">Resumo do Mês</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Total Faturado:</p>
              <p className="font-bold text-cinza-escuro">{formatCurrency(financialData.monthlyRevenue)}</p>
            </div>
            <div>
              <p className="text-gray-600">Recebido:</p>
              <p className="font-bold text-green-600">{formatCurrency(financialData.monthlyRevenue - financialData.pendingPayments)}</p>
            </div>
            <div>
              <p className="text-gray-600">A Receber:</p>
              <p className="font-bold text-yellow-600">{formatCurrency(financialData.pendingPayments)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
