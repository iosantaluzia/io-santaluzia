
import React, { useState } from 'react';
import { Search, HardDrive, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PacientesSection() {
  const [patientSubSection, setPatientSubSection] = useState('prontuarios');

  const patientsData = [
    { id: 1, name: 'João da Silva', dob: '15/03/1980', lastVisit: '10/01/2024' },
    { id: 2, name: 'Maria Oliveira', dob: '22/07/1992', lastVisit: '05/12/2023' },
    { id: 3, name: 'Pedro Santos', dob: '01/11/1975', lastVisit: '20/02/2024' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-cinza-escuro mb-4">Base de Dados de Pacientes</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
        {/* Abas para Prontuários e Backup */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setPatientSubSection('prontuarios')}
            className={`py-2 px-4 text-sm font-medium ${patientSubSection === 'prontuarios' ? 'border-b-2 border-bege-principal text-bege-principal' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Prontuários Eletrônicos
          </button>
          <button
            onClick={() => setPatientSubSection('backup')}
            className={`py-2 px-4 text-sm font-medium ${patientSubSection === 'backup' ? 'border-b-2 border-bege-principal text-bege-principal' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Gerenciamento de Backup
          </button>
        </div>

        {patientSubSection === 'prontuarios' && (
          <div>
            <div className="flex mb-4">
              <input 
                type="text" 
                placeholder="Buscar paciente por nome ou ID..." 
                className="flex-1 p-2 border border-gray-300 rounded-l-md" 
              />
              <button className="bg-bege-principal text-white px-4 py-2 rounded-r-md hover:bg-marrom-acentuado transition">
                <Search className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-gray-100 rounded-md p-4">
              {patientsData.length > 0 ? (
                <div className="w-full">
                  <h3 className="text-xl font-semibold text-cinza-escuro mb-4">Pacientes Cadastrados</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-md shadow-sm">
                      <thead>
                        <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-left">ID</th>
                          <th className="py-3 px-6 text-left">Nome</th>
                          <th className="py-3 px-6 text-left">Nascimento</th>
                          <th className="py-3 px-6 text-left">Última Visita</th>
                          <th className="py-3 px-6 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm font-light">
                        {patientsData.map(patient => (
                          <tr key={patient.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left whitespace-nowrap">{patient.id}</td>
                            <td className="py-3 px-6 text-left">{patient.name}</td>
                            <td className="py-3 px-6 text-left">{patient.dob}</td>
                            <td className="py-3 px-6 text-left">{patient.lastVisit}</td>
                            <td className="py-3 px-6 text-center">
                              <Button variant="ghost" size="sm">Ver Prontuário</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center mt-8">Nenhum paciente cadastrado.</p>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button className="bg-bege-principal text-white px-4 py-2 rounded-md hover:bg-marrom-acentuado transition">
                Adicionar Novo Paciente
              </button>
            </div>
          </div>
        )}

        {patientSubSection === 'backup' && (
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
        )}
      </div>
    </div>
  );
}
