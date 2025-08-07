
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ExamesSection() {
  const [examSubSection, setExamSubSection] = useState('exames');

  const examsData = [
    { id: 1, patient: 'Ana Silva', type: 'Acuidade Visual', date: '01/03/2024', status: 'Concluído' },
    { id: 2, patient: 'Bruno Costa', type: 'Mapeamento de Retina', date: '02/03/2024', status: 'Pendente' },
    { id: 3, patient: 'Carla Dias', type: 'Topografia de Córnea', date: '03/03/2024', status: 'Concluído' },
  ];

  const diagnosesData = [
    { id: 1, patient: 'Ana Silva', diagnosis: 'Miopia', date: '01/03/2024' },
    { id: 2, patient: 'Bruno Costa', diagnosis: 'Glaucoma Suspeito', date: '02/03/2024' },
  ];

  const previousConsultationsData = [
    { id: 1, patient: 'João da Silva', date: '10/01/2024', doctor: 'Dr. Matheus', notes: 'Revisão anual. Paciente estável.' },
    { id: 2, patient: 'Maria Oliveira', date: '05/12/2023', doctor: 'Dra. Fabíola', notes: 'Queixa de olho seco. Prescrito colírio.' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-cinza-escuro mb-4">Gestão de Exames</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 min-h-[500px]">
        {/* Abas de navegação para Exames, Diagnósticos, Consultas Anteriores */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setExamSubSection('exames')}
            className={`py-2 px-4 text-sm font-medium ${examSubSection === 'exames' ? 'border-b-2 border-bege-principal text-bege-principal' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Exames
          </button>
          <button
            onClick={() => setExamSubSection('diagnosticos')}
            className={`py-2 px-4 text-sm font-medium ${examSubSection === 'diagnosticos' ? 'border-b-2 border-bege-principal text-bege-principal' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Diagnósticos
          </button>
          <button
            onClick={() => setExamSubSection('consultas-anteriores')}
            className={`py-2 px-4 text-sm font-medium ${examSubSection === 'consultas-anteriores' ? 'border-b-2 border-bege-principal text-bege-principal' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Consultas Anteriores
          </button>
        </div>

        {/* Conteúdo da aba "Exames" */}
        {examSubSection === 'exames' && (
          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center text-gray-500 mb-4">
              <input type="file" className="hidden" id="file-upload" multiple />
              <label htmlFor="file-upload" className="cursor-pointer block">
                Arraste e solte arquivos de exames aqui, ou clique para selecionar.
              </label>
              <p className="text-sm mt-2">Formatos suportados: PDF, JPG, PNG</p>
            </div>
            <div className="bg-gray-100 rounded-md p-4">
              {examsData.length > 0 && (
                <div className="w-full">
                  <h3 className="text-xl font-semibold text-cinza-escuro mb-4">Exames Recentes</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-md shadow-sm">
                      <thead>
                        <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-left">Paciente</th>
                          <th className="py-3 px-6 text-left">Tipo de Exame</th>
                          <th className="py-3 px-6 text-left">Data</th>
                          <th className="py-3 px-6 text-left">Status</th>
                          <th className="py-3 px-6 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm font-light">
                        {examsData.map(exam => (
                          <tr key={exam.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left whitespace-nowrap">{exam.patient}</td>
                            <td className="py-3 px-6 text-left">{exam.type}</td>
                            <td className="py-3 px-6 text-left">{exam.date}</td>
                            <td className="py-3 px-6 text-left">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                ${exam.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {exam.status}
                              </span>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <Button variant="ghost" size="sm">Visualizar</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conteúdo da aba "Diagnósticos" */}
        {examSubSection === 'diagnosticos' && (
          <div>
            <h3 className="text-xl font-semibold text-cinza-escuro mb-4">Diagnósticos Registrados</h3>
            <div className="bg-gray-100 rounded-md p-4">
              {diagnosesData.length > 0 && (
                <div className="w-full">
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-md shadow-sm">
                      <thead>
                        <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-left">Paciente</th>
                          <th className="py-3 px-6 text-left">Diagnóstico</th>
                          <th className="py-3 px-6 text-left">Data</th>
                          <th className="py-3 px-6 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm font-light">
                        {diagnosesData.map(diagnosis => (
                          <tr key={diagnosis.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left whitespace-nowrap">{diagnosis.patient}</td>
                            <td className="py-3 px-6 text-left">{diagnosis.diagnosis}</td>
                            <td className="py-3 px-6 text-left">{diagnosis.date}</td>
                            <td className="py-3 px-6 text-center">
                              <Button variant="ghost" size="sm">Ver Detalhes</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conteúdo da aba "Consultas Anteriores" */}
        {examSubSection === 'consultas-anteriores' && (
          <div>
            <h3 className="text-xl font-semibold text-cinza-escuro mb-4">Consultas Anteriores</h3>
            <div className="bg-gray-100 rounded-md p-4">
              {previousConsultationsData.length > 0 && (
                <div className="w-full">
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-md shadow-sm">
                      <thead>
                        <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-left">Paciente</th>
                          <th className="py-3 px-6 text-left">Data</th>
                          <th className="py-3 px-6 text-left">Médico</th>
                          <th className="py-3 px-6 text-left">Observações</th>
                          <th className="py-3 px-6 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 text-sm font-light">
                        {previousConsultationsData.map(consultation => (
                          <tr key={consultation.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left whitespace-nowrap">{consultation.patient}</td>
                            <td className="py-3 px-6 text-left">{consultation.date}</td>
                            <td className="py-3 px-6 text-left">{consultation.doctor}</td>
                            <td className="py-3 px-6 text-left">{consultation.notes}</td>
                            <td className="py-3 px-6 text-center">
                              <Button variant="ghost" size="sm">Ver Consulta</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
