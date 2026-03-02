import { supabase } from '@/integrations/supabase/client';
import { normalizeStr } from './formatters';

export interface PatientCacheItem {
    id: string;
    name: string;
    cpf: string | null;
    phone: string | null;
    // Adicionamos os outros campos necessários para o AppointmentFormFields se quisermos aproveitar o cache lá também
    email?: string | null;
    address?: string | null;
    cep?: string | null;
    city?: string | null;
    date_of_birth?: string | null;
}

let patientCache: PatientCacheItem[] = [];
let isLoading = false;
let isLoaded = false;

export const loadPatientCache = async (force = false) => {
    if (isLoaded && !force) return patientCache;
    if (isLoading) {
        // Aguarda carregar se já estiver em andamento
        while (isLoading) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return patientCache;
    }

    isLoading = true;
    try {
        console.log('Iniciando carregamento do cache de pacientes...');
        let allPatients: PatientCacheItem[] = [];
        let from = 0;
        const pageSize = 1000;
        let totalCount = 0;

        while (true) {
            const { data, count, error } = await supabase
                .from('patients')
                .select('*', { count: 'exact' })
                .order('name')
                .range(from, from + pageSize - 1);

            if (error) {
                console.error('Erro Supabase ao carregar cache:', error);
                throw error;
            }

            if (data && data.length > 0) {
                allPatients = [...allPatients, ...(data as PatientCacheItem[])];
                totalCount = count || 0;
                if (data.length < pageSize) break;
                from += pageSize;
            } else {
                break;
            }
        }

        patientCache = allPatients;
        isLoaded = true;
        console.log(`Cache de pacientes carregado com sucesso. Total: ${patientCache.length}/${totalCount}`);
    } catch (err) {
        console.error('Erro crítico ao carregar cache de pacientes:', err);
    } finally {
        isLoading = false;
    }
    return patientCache;
};


export const getPatientCache = () => patientCache;
export const isPatientCacheLoaded = () => isLoaded;

export const searchPatientsInCache = (query: string): PatientCacheItem[] => {
    if (!query.trim()) return [];

    const normQuery = normalizeStr(query);
    const queryClean = normQuery.replace(/\D/g, ''); // só dígitos para CPF/fone

    return patientCache
        .map(patient => {
            const normName = normalizeStr(patient.name || '');
            const idx = normName.indexOf(normQuery);
            let score = idx === -1 ? -1 : 1000 - idx;

            // Fallback: busca por CPF / telefone usando dígitos
            const cpfMatch = queryClean.length >= 3 && (patient.cpf || '').replace(/\D/g, '').includes(queryClean);
            const phoneMatch = queryClean.length >= 3 && (patient.phone || '').replace(/\D/g, '').includes(queryClean);
            
            if (score < 0 && (cpfMatch || phoneMatch)) {
                score = 1;
            }

            return { patient, score };
        })
        .filter(({ score }) => score >= 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10) // Máximo 10 resultados
        .map(({ patient }) => patient);
};
