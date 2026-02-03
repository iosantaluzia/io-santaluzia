import React from 'react';
import { HardDrive, Plus } from 'lucide-react';

export function BackupSection() {
    return (
        <div>
            <h3 className="text-xl font-semibold text-cinza-escuro mb-4">Gerenciamento de Backup de Dados</h3>
            <div className="bg-gray-100 h-96 flex flex-col items-center justify-center text-gray-500 text-lg rounded-md p-4 text-center">
                <HardDrive className="h-16 w-16 text-gray-400 mb-4" />
                <p className="mb-4">Realize backups regulares para garantir a segurança dos dados dos seus pacientes.</p>
                <button className="bg-bege-principal text-white px-6 py-3 rounded-md hover:bg-marrom-acentuado transition flex items-center gap-2">
                    <Plus className="h-5 w-5" /> Iniciar Backup Agora
                </button>
                <p className="text-sm mt-4 text-gray-600">Último backup: 01/08/2024 às 10:30</p>
                <p className="text-sm text-green-600">Status: Sincronizado e Seguro</p>
            </div>
        </div>
    );
}
