
export const translateStatus = (status: string | null | undefined): string => {
    if (!status) return 'Agendado';

    const statusMap: { [key: string]: string } = {
        'scheduled': 'Agendado',
        'pending': 'Aguardando',
        'in_progress': 'Em atendimento',
        'in_attendance': 'Em atendimento',
        'completed': 'Realizado',
        'confirmed': 'Confirmado',
        'cancelled': 'Cancelado',
        'rescheduled': 'Remarcado',
        'agendado': 'Agendado',
        'aguardando_pagamento': 'Aguardando',
        'aguardando': 'Aguardando',
        'em_atendimento': 'Em atendimento',
        'realizado': 'Realizado',
        'cancelado': 'Cancelado',
        'remarcado': 'Remarcado',
        'pendente': 'Aguardando'
    };

    return statusMap[status.toLowerCase()] || status;
};

export const getStatusColor = (status: string | null | undefined): string => {
    if (!status) return 'bg-blue-100 text-blue-800';

    const statusLower = status.toLowerCase();
    if (statusLower === 'scheduled' || statusLower === 'agendado' || statusLower === 'confirmado') {
        return 'bg-blue-100 text-blue-800';
    }
    if (statusLower === 'pending' || statusLower === 'aguardando_pagamento' || statusLower === 'aguardando pagamento' || statusLower === 'pendente' || statusLower === 'aguardando') {
        return 'bg-yellow-100 text-yellow-800';
    }
    if (statusLower === 'in_progress' || statusLower === 'in_attendance' || statusLower === 'em_atendimento' || statusLower === 'em atendimento') {
        return 'bg-purple-100 text-purple-800';
    }
    if (statusLower === 'completed' || statusLower === 'realizado') {
        return 'bg-green-100 text-green-800';
    }
    if (statusLower === 'cancelled' || statusLower === 'cancelado') {
        return 'bg-red-100 text-red-800';
    }
    if (statusLower === 'rescheduled' || statusLower === 'remarcado') {
        return 'bg-orange-100 text-orange-800';
    }
    return 'bg-gray-100 text-gray-800';
};

export const examTypeLabels: { [key: string]: string } = {
    'pentacam': 'Pentacam',
    'campimetria': 'Campimetria',
    'topografia': 'Topografia',
    'microscopia_especular': 'Microscopia Especular',
    'oct': 'OCT',
    'retinografia': 'Retinografia',
    'angiofluoresceinografia': 'Angiofluoresceinografia',
    'ultrassom_ocular': 'Ultrassom Ocular'
};

export const appointmentTypeLabels: { [key: string]: string } = {
    'consulta': 'Consulta',
    'retorno': 'Retorno',
    'exame': 'Exame',
    'convenio': 'Convênio',
    'pagamento_honorarios': 'Pagamento de Honorários'
};
