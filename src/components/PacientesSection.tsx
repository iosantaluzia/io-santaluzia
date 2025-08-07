
import React, { useState } from 'react';
import { Search, HardDrive, Plus, Eye, Camera, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function PacientesSection() {
  const [patientSubSection, setPatientSubSection] = useState('prontuarios');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const patientsData = [
    { 
      id: 1, 
      name: 'João da Silva', 
      dob: '15/03/1980', 
      cpf: '123.456.789-00',
      phone: '(11) 99999-9999',
      lastVisit: '10/01/2024',
      condition: 'Miopia',
      visualAcuity: { right: '20/40', left: '20/30' },
      pressure: { right: '14 mmHg', left: '15 mmHg' },
      allergies: 'Nenhuma conhecida'
    },
    { 
      id: 2, 
      name: 'Maria Oliveira', 
      dob: '22/07/1992', 
      cpf: '987.654.321-00',
      phone: '(11) 88888-8888',
      lastVisit: '05/12/2023',
      condition: 'Astigmatismo',
      visualAcuity: { right: '20/25', left: '20/20' },
      pressure: { right: '16 mmHg', left: '17 mmHg' },
      allergies: 'Penicilina'
    },
    { 
      id: 3, 
      name: 'Pedro Santos', 
      dob: '01/11/1975', 
      cpf: '456.789.123-00',
      phone: '(11) 77777-7777',
      lastVisit: '20/02/2024',
      condition: 'Presbiopia',
      visualAcuity: { right: '20/60', left: '20/50' },
      pressure: { right: '18 mmHg', left: '19 mmHg' },
      allergies: 'Sulfamida'
    },
  ];

  const medicalHistory = [
    { date: '10/01/2024', doctor: 'Dr. Matheus', notes: 'Consulta de rotina. Miopia estável.', prescription: 'Óculos -2.50 OD, -2.25 OE' },
    { date: '10/07/2023', doctor: 'Dra. Fabíola', notes: 'Exame de fundo de olho normal.', prescription: 'Manter óculos atual' },
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
            {!selectedPatient ? (
              <>
                <div className="flex mb-4 gap-2">
                  <input 
                    type="text" 
                    placeholder="Buscar paciente por nome, CPF ou ID..." 
                    className="flex-1 p-2 border border-gray-300 rounded-l-md" 
                  />
                  <button className="bg-bege-principal text-white px-4 py-2 rounded-r-md hover:bg-marrom-acentuado transition">
                    <Search className="h-5 w-5" />
                  </button>
                  <Button className="bg-green-600 hover:bg-green-700 ml-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Paciente
                  </Button>
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
                              <th className="py-3 px-6 text-left">CPF</th>
                              <th className="py-3 px-6 text-left">Nascimento</th>
                              <th className="py-3 px-6 text-left">Condição</th>
                              <th className="py-3 px-6 text-left">Última Visita</th>
                              <th className="py-3 px-6 text-center">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-600 text-sm font-light">
                            {patientsData.map(patient => (
                              <tr key={patient.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{patient.id}</td>
                                <td className="py-3 px-6 text-left font-medium">{patient.name}</td>
                                <td className="py-3 px-6 text-left">{patient.cpf}</td>
                                <td className="py-3 px-6 text-left">{patient.dob}</td>
                                <td className="py-3 px-6 text-left">
                                  <Badge variant="secondary">{patient.condition}</Badge>
                                </td>
                                <td className="py-3 px-6 text-left">{patient.lastVisit}</td>
                                <td className="py-3 px-6 text-center">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setSelectedPatient(patient)}
                                  >
                                    Ver Prontuário
                                  </Button>
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
              </>
            ) : (
              /* Prontuário Detalhado */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-cinza-escuro flex items-center gap-2">
                    <User className="h-6 w-6" />
                    Prontuário - {selectedPatient.name}
                  </h3>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedPatient(null)}
                  >
                    Voltar à Lista
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Dados Pessoais */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-cinza-escuro mb-3">Dados Pessoais</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nome:</strong> {selectedPatient.name}</p>
                      <p><strong>Data de Nascimento:</strong> {selectedPatient.dob}</p>
                      <p><strong>CPF:</strong> {selectedPatient.cpf}</p>
                      <p><strong>Telefone:</strong> {selectedPatient.phone}</p>
                      <p><strong>Última Consulta:</strong> {selectedPatient.lastVisit}</p>
                    </div>
                  </div>

                  {/* Dados Oftalmológicos */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-cinza-escuro mb-3 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Avaliação Visual
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p><strong>Acuidade Visual:</strong></p>
                        <p>OD: {selectedPatient.visualAcuity.right}</p>
                        <p>OE: {selectedPatient.visualAcuity.left}</p>
                      </div>
                      <div>
                        <p><strong>Pressão Ocular:</strong></p>
                        <p>OD: {selectedPatient.pressure.right}</p>
                        <p>OE: {selectedPatient.pressure.left}</p>
                      </div>
                      <div>
                        <p><strong>Condição Atual:</strong></p>
                        <Badge className="bg-bege-principal">{selectedPatient.condition}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Alergias e Observações */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-cinza-escuro mb-3">Informações Médicas</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Alergias:</strong></p>
                      <p className="text-red-600">{selectedPatient.allergies}</p>
                      <div className="mt-4">
                        <p><strong>Observações:</strong></p>
                        <Textarea 
                          placeholder="Adicionar observações médicas..."
                          rows={3}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Histórico de Consultas */}
                <div className="bg-white border rounded-lg">
                  <div className="p-4 border-b">
                    <h4 className="font-semibold text-cinza-escuro flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Histórico de Consultas
                    </h4>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {medicalHistory.map((record, index) => (
                        <div key={index} className="border-l-4 border-bege-principal pl-4 py-2">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-cinza-escuro">{record.date}</p>
                              <p className="text-sm text-gray-600">{record.doctor}</p>
                            </div>
                          </div>
                          <p className="text-sm mb-2">{record.notes}</p>
                          {record.prescription && (
                            <p className="text-sm bg-green-50 p-2 rounded border-l-2 border-green-400">
                              <strong>Prescrição:</strong> {record.prescription}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upload de Exames */}
                <div className="bg-white border rounded-lg">
                  <div className="p-4 border-b">
                    <h4 className="font-semibold text-cinza-escuro flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Exames e Imagens
                    </h4>
                  </div>
                  <div className="p-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Arraste retinografias, tomografias ou outros exames aqui</p>
                      <Button variant="outline" className="mt-2">
                        Selecionar Arquivos
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
