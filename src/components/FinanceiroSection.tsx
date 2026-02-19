import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { TrendingUp, DollarSign, Calendar, FileText, Filter, User, Loader2, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format, subMonths, subYears, startOfMonth, endOfMonth, startOfYear, endOfYear, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { PatientDetailsModal } from './PatientDetailsModal';

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
    patientId?: string;
  }>;
}

export function FinanceiroSection() {
  const { appUser } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [financialData, setFinancialData] = useState<Record<string, FinancialData>>({});
  const [doctorsList, setDoctorsList] = useState<Array<{ key: string, name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedPatientForModal, setSelectedPatientForModal] = useState<any>(null);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });

  const setCurrentMonth = () => {
    setDateRange({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    });
  };

  const setLastMonth = () => {
    const lastMonth = subMonths(new Date(), 1);
    setDateRange({
      from: startOfMonth(lastMonth),
      to: endOfMonth(lastMonth)
    });
  };

  const setLastYear = () => {
    const lastYear = subYears(new Date(), 1);
    setDateRange({
      from: startOfYear(lastYear),
      to: endOfYear(lastYear)
    });
  };

  // Buscar dados financeiros reais do banco
  useEffect(() => {
    fetchFinancialData();
  }, [dateRange]);

  const fetchFinancialData = async () => {
    try {
      // Mostrar loading de tela cheia apenas no primeiro carregamento
      const isInitial = Object.keys(financialData).length === 0;
      if (isInitial) {
        setLoading(true);
      } else {
        setIsRefetching(true);
      }

      // Buscar todas as consultas pagas (amount > 0) para relatórios financeiros
      let query = supabase
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
          patient_id,
          patients (
            name
          )
        `)
        .not('amount', 'is', null)
        .neq('amount', 0); // Excluir apenas valores exatamente zero

      if (dateRange.from) {
        query = query.gte('consultation_date', dateRange.from.toISOString());
      }
      if (dateRange.to) {
        // Garantir que o fim do dia seja considerado
        const endDay = new Date(dateRange.to);
        endDay.setHours(23, 59, 59, 999);
        query = query.lte('consultation_date', endDay.toISOString());
      }

      const { data: consultations, error } = await query.order('consultation_date', { ascending: false });

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

        // Check if the appointment is considered paid
        // It's paid if explicitly marked as received OR if the appointment status is completed/realizado
        const isPaid = consultation.payment_received ||
          consultation.status === 'completed' ||
          consultation.status === 'realizado';

        // Adicionar receita mensal apenas se foi pago/realizado
        if (isPaid) {
          doctorsData[doctorKey].monthlyRevenue += amount;
        }

        // Adicionar pagamentos pendentes APENAS se não foi pago e não foi realizado
        if (!isPaid) {
          doctorsData[doctorKey].pendingPayments += amount;
        }

        // Adicionar transação
        doctorsData[doctorKey].transactions.push({
          id: consultation.id,
          patient: patientName,
          service: getServiceName(consultation.appointment_type, consultation.status),
          amount: amount,
          date: new Date(consultation.consultation_date).toLocaleDateString('pt-BR'),
          // Se foi realizado ou pago, status é Pago, senão Pendente
          status: isPaid ? 'Pago' : 'Pendente',
          paymentMethod: consultation.payment_method,
          patientId: consultation.patient_id
        });
      });

      // Calcular médias diárias e totais de pacientes
      const daysInPeriod = dateRange.from && dateRange.to
        ? Math.max(1, differenceInDays(dateRange.to, dateRange.from) + 1)
        : 30;

      Object.keys(doctorsData).forEach(doctorKey => {
        const doctor = doctorsData[doctorKey];

        // Média diária baseada na receita do período
        doctor.dailyAverage = Math.round(doctor.monthlyRevenue / daysInPeriod);

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
        dailyAverage: Math.round(totalRevenue / daysInPeriod),
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
      setIsRefetching(false);
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
  const getFinancialData = (): FinancialData => {
    const emptyData: FinancialData = {
      name: appUser?.username || 'Médico',
      monthlyRevenue: 0,
      dailyAverage: 0,
      pendingPayments: 0,
      totalPatients: 0,
      transactions: []
    };

    if (appUser?.role === 'doctor') {
      // Médico vê apenas seus dados - baseado no username
      const doctorKeys = Object.keys(financialData).filter(key =>
        key !== 'all' && financialData[key].name.toLowerCase().includes(appUser.username?.toLowerCase() || '')
      );
      return doctorKeys.length > 0 ? financialData[doctorKeys[0]] : emptyData;
    } else if (appUser?.role === 'admin' || appUser?.username === 'financeiro') {
      // Admin e financeiro veem dados consolidados ou filtrados
      return financialData[selectedDoctor] || financialData['all'] || emptyData;
    }
    return financialData['all'] || emptyData;
  };

  const currentFinancialData = getFinancialData();
  const canViewAllDoctors = appUser?.role === 'admin' || appUser?.username === 'financeiro';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleTransactionClick = (transaction: any) => {
    setSelectedPatientForModal({
      patientId: transaction.patientId,
      consultationId: transaction.id,
      name: transaction.patient,
      status: transaction.status === 'Pago' ? 'completed' : 'pending',
      time: transaction.date
    });
    setShowPatientDetailsModal(true);
  };

  if (loading && Object.keys(financialData).length === 0) {
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
    <div className={cn("p-4 transition-opacity duration-200", isRefetching && "opacity-60")}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-cinza-escuro">Relatórios Financeiros</h2>
          {isRefetching && <Loader2 className="h-5 w-5 animate-spin text-bege-principal" />}
        </div>

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
              <p className="text-sm text-gray-600">Receita no Período</p>
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-xl font-semibold text-cinza-escuro">
            Transações Recentes
            {selectedDoctor !== 'all' && currentFinancialData.name && (
              <span className="text-sm font-normal text-gray-600 ml-2">- {currentFinancialData.name}</span>
            )}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-md p-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8"
                onClick={setCurrentMonth}
              >
                Mês Atual
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8"
                onClick={setLastMonth}
              >
                Último Mês
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-8"
                onClick={setLastYear}
              >
                Último Ano
              </Button>
            </div>

            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "justify-start text-left font-normal h-9",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end" onInteractOutside={(e) => {
                // Se estiver carregando dados, permitir que o calendário fique aberto
                // mas geralmente o comportamento padrão de fechar ao clicar fora é esperado
              }}>
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                    // Se o intervalo estiver completo (tem from e to), opcionalmente podemos fechar
                    // mas o usuário pediu para permanecer aberto. Vou deixar aberto.
                  }}
                  numberOfMonths={2}
                  locale={ptBR}
                />
                <div className="p-2 border-t border-gray-100 flex justify-end">
                  <Button size="sm" onClick={() => setCalendarOpen(false)}>
                    Concluído
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

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
                <tr
                  key={transaction.id}
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleTransactionClick(transaction)}
                >
                  <td className="py-3 px-6 text-left font-medium">{transaction.patient}</td>
                  <td className="py-3 px-6 text-left">{transaction.service}</td>
                  <td className="py-3 px-6 text-right font-semibold">{formatCurrency(transaction.amount)}</td>
                  <td className="py-3 px-6 text-center">
                    {transaction.paymentMethod ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${transaction.paymentMethod.toLowerCase() === 'dinheiro'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-blue-100 text-blue-800'
                        }`}>
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
          <h4 className="text-lg font-semibold text-cinza-escuro mb-2">Resumo do Período</h4>
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

      {showPatientDetailsModal && selectedPatientForModal && (
        <PatientDetailsModal
          isOpen={showPatientDetailsModal}
          onClose={() => {
            setShowPatientDetailsModal(false);
            setSelectedPatientForModal(null);
            // Atualizar dados financeiros caso o pagamento tenha sido alterado
            fetchFinancialData();
          }}
          patient={selectedPatientForModal}
          onPatientUpdate={fetchFinancialData}
        />
      )}
    </div>
  );
}
