import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PatientFilterBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    onNewPatient: () => void;
}

export function PatientFilterBar({ searchTerm, setSearchTerm, onNewPatient }: PatientFilterBarProps) {
    return (
        <div className="flex mb-4 gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    type="text"
                    placeholder="Buscar paciente por nome, CPF ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>
            <Button
                onClick={onNewPatient}
                className="bg-marrom-acentuado hover:bg-marrom-acentuado/90 text-white"
            >
                <Plus className="h-4 w-4 mr-2" />
                Novo Paciente
            </Button>
        </div>
    );
}
