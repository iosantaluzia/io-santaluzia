/**
 * Utility functions for formatting strings like CPF and Phone numbers.
 */

export const formatCPF = (cpf: string): string => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length === 11) {
        return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
};

const DEFAULT_DDD = '66';

/**
 * Adiciona DDD padrão (66) se o número não tiver DDD,
 * e formata no padrão (xx) xxxxx-xxxx ou (xx) xxxx-xxxx.
 */
export const formatPhone = (phone: string): string => {
    if (!phone) return phone;
    let digits = phone.replace(/\D/g, '');

    // Número sem DDD: 8 dígitos (fixo) ou 9 dígitos (celular) → adicionar DDD 66
    if (digits.length === 8) {
        digits = DEFAULT_DDD + digits;  // ex: 36001234 → 6636001234
    } else if (digits.length === 9) {
        digits = DEFAULT_DDD + digits;  // ex: 996001234 → 66996001234
    }

    // Formatar
    if (digits.length === 11) {
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (digits.length === 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return phone; // retornar original se não reconhecer o padrão
};

/**
 * Normaliza telefone para armazenamento: remove formatação,
 * adiciona DDD 66 se ausente e retorna no formato (xx) xxxxx-xxxx.
 */
export const normalizePhoneForStorage = (phone: string): string => {
    return formatPhone(phone);
};


export const formatCEP = (cep: string): string => {
    const numbers = cep.replace(/\D/g, '');
    if (numbers.length === 8) {
        return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return cep;
};

export const calculateAge = (dateOfBirth: string | null | undefined): string => {
    if (!dateOfBirth) return '-';
    const date = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        age--;
    }
    return `${date.toLocaleDateString('pt-BR')} (${age} anos)`;
};

export const calculateDetailedAge = (birthDate: string): string => {
    const birth = new Date(birthDate);
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    // Ajustar se o mês atual for menor que o mês de nascimento
    if (months < 0) {
        years--;
        months += 12;
    }

    // Ajustar se o dia atual for menor que o dia de nascimento
    if (days < 0) {
        months--;
        // Calcular dias do mês anterior
        const daysInLastMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        days += daysInLastMonth;

        // Se months ficou negativo após o ajuste, ajustar novamente
        if (months < 0) {
            years--;
            months += 12;
        }
    }

    return `${years} anos, ${months} meses, ${days} dias`;
};
