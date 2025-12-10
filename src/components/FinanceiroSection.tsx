
import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, FileText, Filter, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';

export function FinanceiroSection() {
  const { appUser } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  
  // Dados financeiros mockados - em produção viriam do banco
  const doctorsData = {
    'dr-silva': {
      name: 'Dr. Silva',
      monthlyRevenue: 25000,
      dailyAverage: 833,
      pendingPayments: 3500,
      totalPatients: 65,
      transactions: [
        { id: 1, patient: 'Ana Silva', service: 'Consulta Oftalmológica', amount: 250, date: '05/08/2024', status: 'Pago' },
        { id: 2, patient: 'Bruno Costa', service: 'Exame de Acuidade Visual', amount: 150, date: '04/08/2024', status: 'Pago' },
      ]
    },
    'dr-santos': {
      name: 'Dr. Santos',
      monthlyRevenue: 20000,
      dailyAverage: 667,
      pendingPayments: 5000,
      totalPatients: 55,
      transactions: [
        { id: 3, patient: 'Carla Dias', service: 'Cirurgia de Catarata', amount: 3500, date: '04/08/2024', status: 'Pendente' },
        { id: 4, patient: 'Daniel Rocha', service: 'Mapeamento de Retina', amount: 400, date: '03/08/2024', status: 'Pago' },
      ]
    }
  };

  // Dados consolidados para conta financeiro
  const consolidatedData = {
    monthlyRevenue: 45000,
    dailyAverage: 1500,
    pendingPayments: 8500,
    totalPatients: 120,
    transactions: [
      ...doctorsData['dr-silva'].transactions,
      ...doctorsData['dr-santos'].transactions
    ]
  };

  // Determinar dados a exibir baseado no perfil do usuário
  const getFinancialData = () => {
    if (appUser?.role === 'doctor') {
      // Médico vê apenas seus dados - simulando pelo username
      const doctorKey = `dr-${appUser.username}`;
      return doctorsData[doctorKey] || doctorsData['dr-silva'];
    } else if (appUser?.role === 'admin' || appUser?.username === 'financeiro') {
      // Admin e financeiro veem dados consolidados ou filtrados
      if (selectedDoctor === 'all') {
        return consolidatedData;
      }
      return doctorsData[selectedDoctor] || consolidatedData;
    }
    return consolidatedData;
  };

  const financialData = getFinancialData();
  const canViewAllDoctors = appUser?.role === 'admin' || appUser?.username === 'financeiro';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-cinza-escuro">Relatórios Financeiros</h2>
        
        {canViewAllDoctors && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione o médico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Médicos</SelectItem>
                <SelectItem value="dr-silva">Dr. Silva</SelectItem>
                <SelectItem value="dr-santos">Dr. Santos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {appUser?.role === 'doctor' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Visualizando seus dados financeiros pessoais
            </span>
          </div>
        </div>
      )}
      
      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[140px]">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-sm text-gray-600">Receita Mensal</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(financialData.monthlyRevenue)}</p>
            </div>
            <img 
              src="/dashboard/caixa.png" 
              alt="Caixa" 
              className="h-24 w-24 object-contain"
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[140px]">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-sm text-gray-600">Média Diária</p>
              <p className="text-2xl font-bold text-bege-principal">{formatCurrency(financialData.dailyAverage)}</p>
            </div>
            <img 
              src="/dashboard/receitas.png" 
              alt="Receitas" 
              className="h-24 w-24 object-contain"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[140px]">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-sm text-gray-600">Pagamentos Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(financialData.pendingPayments)}</p>
            </div>
            <img 
              src="/dashboard/boletos.png" 
              alt="Boletos" 
              className="h-24 w-24 object-contain"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[140px]">
          <div className="flex items-center justify-between h-full">
            <div>
              <p className="text-sm text-gray-600">Pacientes Atendidos</p>
              <p className="text-2xl font-bold text-cinza-escuro">{financialData.totalPatients}</p>
            </div>
            <img 
              src="/dashboard/anotacoes.png" 
              alt="Anotações" 
              className="h-24 w-24 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
        <h3 className="text-xl font-semibold text-cinza-escuro mb-4">
          Transações Recentes
          {selectedDoctor !== 'all' && financialData.name && (
            <span className="text-sm font-normal text-gray-600 ml-2">- {financialData.name}</span>
          )}
        </h3>

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
              {financialData.transactions.map(transaction => (
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
