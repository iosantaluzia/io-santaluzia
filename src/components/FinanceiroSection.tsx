
import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, FileText, Filter, User, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface FinancialData {
  name: string;
  monthlyRevenue: number;
  dailyAverage: number;
  pendingPayments: number;
  totalPatients: number;
  transactions: Array<{
    id: string;
    patient: string;
    service: string;
    amount: number;
    date: string;
    status: string;
    paymentMethod?: string;
  }>;
}

export function FinanceiroSection() {
  const { appUser } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [financialData, setFinancialData] = useState<Record<string, FinancialData>>({});
  const [doctorsList, setDoctorsList] = useState<Array<{key: string, name: string}>>([]);
  const [loading, setLoading] = useState(true);

  // Buscar dados financeiros reais do banco
  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);

      // Buscar todas as consultas com valores (excluindo retornos gratuitos)
      const { data: consultations, error } = await supabase
        .from('consultations')
        .select(`
          id,
          doctor_name,
          amount,
          payment_received,
          payment_method,
          consultation_date,
          status,
          appointment_type,
          patients (
            name
          )
        `)
        .not('amount', 'is', null)
        .gt('amount', 0) // Excluir consultas com valor zero (retornos gratuitos)
        .order('consultation_date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar dados financeiros:', error);
        return;
      }

      // Organizar dados por médico
      const doctorsData: Record<string, FinancialData> = {};
      const doctorsSet = new Set<string>();

      consultations?.forEach(consultation => {
        const doctorKey = consultation.doctor_name?.toLowerCase().replace(/\s+/g, '-').replace('.', '') || 'desconhecido';
        const doctorName = consultation.doctor_name || 'Médico Desconhecido';

        doctorsSet.add(doctorName);

        if (!doctorsData[doctorKey]) {
          doctorsData[doctorKey] = {
            name: doctorName,
            monthlyRevenue: 0,
            dailyAverage: 0,
            pendingPayments: 0,
            totalPatients: 0,
            transactions: []
          };
        }

        const amount = Number(consultation.amount) || 0;
        const patientName = consultation.patients?.name || 'Paciente Desconhecido';

        // Adicionar receita mensal
        doctorsData[doctorKey].monthlyRevenue += amount;

        // Adicionar pagamentos pendentes se não foi recebido
        if (!consultation.payment_received) {
          doctorsData[doctorKey].pendingPayments += amount;
        }

        // Adicionar transação
        doctorsData[doctorKey].transactions.push({
          id: consultation.id,
          patient: patientName,
          service: getServiceName(consultation.appointment_type, consultation.status),
          amount: amount,
          date: new Date(consultation.consultation_date).toLocaleDateString('pt-BR'),
          status: consultation.payment_received ? 'Pago' : 'Pendente',
          paymentMethod: consultation.payment_method
        });
      });

      // Calcular médias diárias e totais de pacientes
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      Object.keys(doctorsData).forEach(doctorKey => {
        const doctor = doctorsData[doctorKey];

        // Média diária baseada na receita mensal
        doctor.dailyAverage = Math.round(doctor.monthlyRevenue / daysInMonth);

        // Total de pacientes únicos
        const uniquePatients = new Set(doctor.transactions.map(t => t.patient));
        doctor.totalPatients = uniquePatients.size;
      });

      // Criar dados consolidados
      const allTransactions = Object.values(doctorsData).flatMap(doctor => doctor.transactions);
      const totalRevenue = Object.values(doctorsData).reduce((sum, doctor) => sum + doctor.monthlyRevenue, 0);
      const totalPending = Object.values(doctorsData).reduce((sum, doctor) => sum + doctor.pendingPayments, 0);
      const totalPatients = new Set(allTransactions.map(t => t.patient)).size;

      doctorsData['all'] = {
        name: 'Todos os Médicos',
        monthlyRevenue: totalRevenue,
        dailyAverage: Math.round(totalRevenue / daysInMonth),
        pendingPayments: totalPending,
        totalPatients: totalPatients,
        transactions: allTransactions
      };

      setFinancialData(doctorsData);
      setDoctorsList(Array.from(doctorsSet).map(name => ({
        key: name.toLowerCase().replace(/\s+/g, '-').replace('.', ''),
        name: name
      })));

    } catch (error) {
      console.error('Erro ao processar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceName = (appointmentType: string | null, status: string | null): string => {
    if (appointmentType) {
      switch (appointmentType) {
        case 'consulta': return 'Consulta Oftalmológica';
        case 'retorno': return 'Retorno';
        case 'exame': return 'Exame Oftalmológico';
        case 'pagamento_honorarios': return 'Pagamento de Honorários';
        default: return appointmentType;
      }
    }
    return status === 'completed' ? 'Consulta Oftalmológica' : 'Serviço Médico';
  };

  // Determinar dados a exibir baseado no perfil do usuário
  const getFinancialData = () => {
    if (appUser?.role === 'doctor') {
      // Médico vê apenas seus dados - baseado no username
      const doctorKeys = Object.keys(financialData).filter(key =>
        key !== 'all' && financialData[key].name.toLowerCase().includes(appUser.username?.toLowerCase() || '')
      );
      return doctorKeys.length > 0 ? financialData[doctorKeys[0]] : financialData['all'];
    } else if (appUser?.role === 'admin' || appUser?.username === 'financeiro') {
      // Admin e financeiro veem dados consolidados ou filtrados
      return financialData[selectedDoctor] || financialData['all'];
    }
    return financialData['all'];
  };

  const currentFinancialData = getFinancialData();
  const canViewAllDoctors = appUser?.role === 'admin' || appUser?.username === 'financeiro';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-bege-principal" />
            <p className="text-gray-600">Carregando dados financeiros...</p>
          </div>
        </div>
      </div>
    );
  }

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
                {doctorsList.map(doctor => (
                  <SelectItem key={doctor.key} value={doctor.key}>
                    {doctor.name}
                  </SelectItem>
                ))}
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
              <p className="text-2xl font-bold text-green-600">{formatCurrency(currentFinancialData.monthlyRevenue)}</p>
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
              <p className="text-2xl font-bold text-bege-principal">{formatCurrency(currentFinancialData.dailyAverage)}</p>
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
              <p className="text-2xl font-bold text-yellow-600">{formatCurrency(currentFinancialData.pendingPayments)}</p>
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
              <p className="text-2xl font-bold text-cinza-escuro">{currentFinancialData.totalPatients}</p>
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
          {selectedDoctor !== 'all' && currentFinancialData.name && (
            <span className="text-sm font-normal text-gray-600 ml-2">- {currentFinancialData.name}</span>
          )}
        </h3>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="min-w-full bg-white rounded-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Paciente</th>
                <th className="py-3 px-6 text-left">Serviço</th>
                <th className="py-3 px-6 text-right">Valor</th>
                <th className="py-3 px-6 text-center">Pagamento</th>
                <th className="py-3 px-6 text-center">Data</th>
                <th className="py-3 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {currentFinancialData.transactions.map(transaction => (
                <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left font-medium">{transaction.patient}</td>
                  <td className="py-3 px-6 text-left">{transaction.service}</td>
                  <td className="py-3 px-6 text-right font-semibold">{formatCurrency(transaction.amount)}</td>
                  <td className="py-3 px-6 text-center">
                    {transaction.paymentMethod ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {transaction.paymentMethod}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
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
              <p className="font-bold text-cinza-escuro">{formatCurrency(currentFinancialData.monthlyRevenue)}</p>
            </div>
            <div>
              <p className="text-gray-600">Recebido:</p>
              <p className="font-bold text-green-600">{formatCurrency(currentFinancialData.monthlyRevenue - currentFinancialData.pendingPayments)}</p>
            </div>
            <div>
              <p className="text-gray-600">A Receber:</p>
              <p className="font-bold text-yellow-600">{formatCurrency(currentFinancialData.pendingPayments)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
