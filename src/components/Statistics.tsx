import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StatisticsCharts } from './StatisticsCharts';

// Interface reflecting the actual columns in the DB
interface Patient {
    id: string;
    name: string | null;
    address: string | null;
    date_of_birth: string | null;
}

// Infer gender from the patient's name (simple heuristic: names ending with 'a' are feminine)
function inferGender(name: string | null): string {
    if (!name) return 'Não informado';
    const trimmed = name.trim().toLowerCase();
    return trimmed.endsWith('a') ? 'Feminino' : 'Masculino';
}

// Extract city from address (same logic used in the standardize_cities script)
function extractCity(address: string | null): string {
    if (!address) return 'Não informado';
    const parts = address.split(',');
    if (parts.length > 1) {
        let lastPart = parts[parts.length - 1].trim();
        lastPart = lastPart.split('-')[0].split('/')[0].trim();
        if (lastPart.toLowerCase() === 'mt' && parts.length > 2) {
            lastPart = parts[parts.length - 2].trim();
        }
        return lastPart;
    }
    const dashParts = address.split(' - ');
    if (dashParts.length > 1) {
        let lastPart = dashParts[dashParts.length - 1].trim();
        lastPart = lastPart.split('-')[0].split('/')[0].trim();
        return lastPart;
    }
    return 'Não informado';
}

export function Statistics() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            const { data, error } = await supabase
                .from('patients')
                .select('id, name, address, date_of_birth');
            if (error) {
                console.error('Error fetching patients for statistics:', error);
                setLoading(false);
                return;
            }
            setPatients(data as Patient[]);
            setLoading(false);
        };
        fetchPatients();
    }, []);

    const genderCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    const ageGroups: Record<string, number> = {
        '0-17': 0,
        '18-35': 0,
        '36-55': 0,
        '56+': 0,
    };

    const calculateAge = (dob: string | null) => {
        if (!dob) return null;
        const date = new Date(dob);
        const diff = Date.now() - date.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    };

    patients.forEach(p => {
        const gender = inferGender(p.name);
        genderCounts[gender] = (genderCounts[gender] || 0) + 1;

        const city = extractCity(p.address);
        cityCounts[city] = (cityCounts[city] || 0) + 1;

        const age = calculateAge(p.date_of_birth);
        if (age !== null) {
            if (age <= 17) ageGroups['0-17']++;
            else if (age <= 35) ageGroups['18-35']++;
            else if (age <= 55) ageGroups['36-55']++;
            else ageGroups['56+']++;
        }
    });

    if (loading) {
        return (
            <div className="p-6 text-center">
                <span className="text-gray-600">Carregando estatísticas...</span>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Estatísticas</h1>

            <StatisticsCharts
                genderCounts={genderCounts}
                cityCounts={cityCounts}
                ageGroups={ageGroups}
            />
        </div>
    );
}
