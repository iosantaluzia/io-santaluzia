
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, User, Clock, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PatientDetails } from './PatientDetails';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  date_of_birth: string;
  phone?: string;
  email?: string;
  medical_history?: string;
  allergies?: string;
  medications?: string;
  last_consultation?: string;
  condition?: string;
}

export function ConsultasSection() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          consultations(consultation_date)
        `)
        .order('name');

      if (error) {
        console.error('Erro ao buscar pacientes:', error);
        setError('Erro ao carregar pacientes');
        return;
      }

      const patientsWithLastConsultation = data?.map(patient => ({
        ...patient,
        last_consultation: patient.consultations?.length > 0 
          ? new Date(Math.max(...patient.consultations.map((c: any) => new Date(c.consultation_date).getTime()))).toLocaleDateString('pt-BR')
          : 'Nenhuma consulta',
        condition: patient.medical_history ? 'Acompanhamento' : 'Primeira consulta'
      })) || [];

      setPatients(patientsWithLastConsultation);
      setFilteredPatients(patientsWithLastConsultation);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      setError('Erro inesperado ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf.includes(searchTerm) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
    fetchPatients();
  };

  if (selectedPatient) {
    return (
      <PatientDetails 
        patient={selectedPatient} 
        onBack={handleBackToList}
      />
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchPatients}>
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bege-principal"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-cinza-escuro mb-4">Consultas e Prontuários</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        {/* Barra de busca e filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome, CPF ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        {/* Lista de pacientes */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase">ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase">Nome</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase">CPF</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase">Nascimento</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase">Última Consulta</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase">Condição</th>
                <th className="py-3 px-4 text-center text-sm font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {patient.id.slice(0, 8)}...
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-bege-principal flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-cinza-escuro">{patient.name}</div>
                        {patient.email && (
                          <div className="text-xs text-gray-500">{patient.email}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{patient.cpf}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(patient.date_of_birth).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {patient.last_consultation}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${patient.condition === 'Primeira consulta' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'}`}>
                      {patient.condition}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePatientSelect(patient)}
                        className="flex items-center gap-1"
                      >
                        <FileText className="h-3 w-3" />
                        Ver Prontuário
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && !loading && (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'Nenhum paciente encontrado para a busca.' : 'Nenhum paciente cadastrado.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
