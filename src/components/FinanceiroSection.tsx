import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { TrendingUp, DollarSign, Calendar, FileText, Filter, User, Loader2, ChevronDown, Receipt, LineChart, CreditCard, Wallet } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format, subMonths, subYears, startOfMonth, endOfMonth, startOfYear, endOfYear, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { PatientDetailsModal } from './PatientDetailsModal';
import { NfeEmissionModal } from './NfeEmissionModal';
import { NfeList } from './NfeList';
import { toast } from 'sonner';

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
    insurance_name?: string;
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
  const [isNfeModalOpen, setIsNfeModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [searchTerm, setSearchTerm] = useState('');

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

  const normalizeDoctorName = (name: string | null): string => {
    if (!name) return 'Médico Desconhecido';
    const n = name.toLowerCase().trim();
    if (n.includes('matheus')) return 'Matheus Roque';
    if (n.includes('fabiola')) return 'Fabiola Roque';
    return name;
  };

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

      let { data: consultations, error } = await (query as any).order('consultation_date', { ascending: false });

      // Se todas as consultas deram erro de Supabase, lança o erro para o log
      if (error) {
        console.error('Erro ao buscar dados financeiros:', error);
        toast.error('Erro ao carregar dados financeiros');
        setLoading(false);
        return;
      }

      // Organizar dados por médico
      const doctorsData: Record<string, FinancialData> = {
        'matheus-roque': { name: 'Matheus Roque', monthlyRevenue: 0, dailyAverage: 0, pendingPayments: 0, totalPatients: 0, transactions: [] },
        'fabiola-roque': { name: 'Fabiola Roque', monthlyRevenue: 0, dailyAverage: 0, pendingPayments: 0, totalPatients: 0, transactions: [] }
      };

      const doctorsSet = new Set<string>(['Matheus Roque', 'Fabiola Roque']);

      consultations?.forEach(consultation => {
        const rawName = consultation.doctor_name || 'Médico Desconhecido';
        const doctorName = normalizeDoctorName(rawName);
        const doctorKey = doctorName.toLowerCase().replace(/\s+/g, '-').replace('.', '');

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
          service: getServiceName(consultation.appointment_type, consultation.status, consultation.payment_method),
          amount: amount,
          date: new Date(consultation.consultation_date).toLocaleDateString('pt-BR'),
          // Se foi realizado ou pago, status é Pago, senão Pendente
          status: isPaid ? 'Pago' : 'Pendente',
          paymentMethod: consultation.payment_method,
          patientId: consultation.patient_id,
          insurance_name: (consultation as any).insurance_name
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

  const getServiceName = (appointmentType: string | null, status: string | null, paymentMethod?: string | null): string => {
    if (appointmentType) {
      switch (appointmentType) {
        case 'consulta': return 'Consulta Oftalmológica';
        case 'retorno': return 'Retorno';
        case 'exame': return 'Exame Oftalmológico';
        case 'convenio': return paymentMethod ? `Convênio - ${paymentMethod}` : 'Convênio';
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
      // Se for médico, forçar o retorno apenas dos dados dele, nunca 'all'
      return doctorKeys.length > 0 ? financialData[doctorKeys[0]] : emptyData;
    } else if (appUser?.role === 'admin' || appUser?.role === 'financeiro' || appUser?.username === 'financeiro') {
      // Admin e financeiro veem dados consolidados ou filtrados
      return financialData[selectedDoctor] || financialData['all'] || emptyData;
    }
    return emptyData; // Não admin/financeiro/médico não vê nada
  };

  const currentFinancialData = getFinancialData();
  const canViewAllDoctors = appUser?.role === 'admin' || appUser?.role === 'financeiro' || appUser?.username === 'financeiro';

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          className="bg-bege-principal/10 p-4 rounded-lg shadow-sm border border-bege-principal/20 flex flex-col items-center justify-center gap-3 hover:bg-bege-principal hover:text-white transition-colors text-bege-principal group min-h-[140px]"
          onClick={() => setIsNfeModalOpen(true)}
        >
          <Receipt className="h-8 w-8 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-center leading-tight">Emitir Notas<br />Fiscais</span>
        </button>

        <div className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-3 opacity-60 cursor-not-allowed min-h-[140px]">
          <LineChart className="h-8 w-8 text-gray-400" />
          <span className="font-semibold text-gray-500 text-center leading-tight">Relatórios<br />Avançados<br /><span className="text-xs font-normal">Em breve</span></span>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-3 opacity-60 cursor-not-allowed min-h-[140px]">
          <CreditCard className="h-8 w-8 text-gray-400" />
          <span className="font-semibold text-gray-500 text-center leading-tight">Integração<br />Cartões<br /><span className="text-xs font-normal">Em breve</span></span>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-3 opacity-60 cursor-not-allowed min-h-[140px]">
          <Wallet className="h-8 w-8 text-gray-400" />
          <span className="font-semibold text-gray-500 text-center leading-tight">Contas a<br />Pagar<br /><span className="text-xs font-normal">Em breve</span></span>
        </div>
      </div>

      <Tabs defaultValue="transacoes" className="w-full">
        <TabsList className="mb-6 gap-2 bg-transparent">
          <TabsTrigger
            value="transacoes"
            className="data-[state=active]:bg-bege-principal data-[state=active]:text-white data-[state=inactive]:bg-gray-100 px-6 py-2.5 rounded-md font-medium text-sm transition-all"
          >
            Histórico Financeiro
          </TabsTrigger>
          <TabsTrigger
            value="notas"
            className="data-[state=active]:bg-bege-principal data-[state=active]:text-white data-[state=inactive]:bg-gray-100 px-6 py-2.5 rounded-md font-medium text-sm transition-all"
          >
            Notas Fiscais Emitidas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notas" className="mt-0">
          <div className="mb-6">
            <NfeList />
          </div>
        </TabsContent>

        <TabsContent value="transacoes" className="mt-0">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                <h3 className="text-xl font-semibold text-cinza-escuro whitespace-nowrap">
                  Transações Recentes
                  {selectedDoctor !== 'all' && currentFinancialData.name && (
                    <span className="text-sm font-normal text-gray-600 ml-2">- {currentFinancialData.name}</span>
                  )}
                </h3>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Buscar paciente, serviço ou operadora..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </div>

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
                    <th className="py-3 px-6 text-left text-blue-600">Convênio</th>
                    <th className="py-3 px-6 text-right">Valor</th>
                    <th className="py-3 px-6 text-center">Pagamento</th>
                    <th className="py-3 px-6 text-center">Data</th>
                    <th className="py-3 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {currentFinancialData.transactions
                    .filter(t =>
                      t.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      t.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (t.insurance_name && t.insurance_name.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map(transaction => (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleTransactionClick(transaction)}
                      >
                        <td className="py-3 px-6 text-left font-medium">{transaction.patient}</td>
                        <td className="py-3 px-6 text-left">{transaction.service}</td>
                        <td className="py-3 px-6 text-left">
                          {transaction.insurance_name ? (
                            <span className="text-blue-600 font-medium">{transaction.insurance_name}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
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
        </TabsContent>
      </Tabs>

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

      {/* Modal de Emissão de NFe */}
      <NfeEmissionModal
        isOpen={isNfeModalOpen}
        onClose={() => setIsNfeModalOpen(false)}
      />
    </div>
  );
}
