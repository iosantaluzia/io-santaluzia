
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Calendar, User, LogOut, Download } from 'lucide-react';
import { toast } from 'sonner';

interface Document {
  id: string;
  title: string;
  document_type: string;
  file_name: string;
  file_path: string;
  exam_date: string | null;
  doctor_name: string | null;
  description: string | null;
  created_at: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  doctor_name: string;
  appointment_type: string | null;
  status: string;
  notes: string | null;
}

const PatientPortal = () => {
  const { user, appUser, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !appUser)) {
      navigate('/');
      return;
    }
    
    if (user) {
      fetchPatientData();
    }
  }, [user, appUser, loading, navigate]);

  const fetchPatientData = async () => {
    if (!user) return;

    try {
      setLoadingData(true);

      // Buscar documentos do paciente usando type casting
      const { data: documentsData, error: documentsError } = await (supabase as any)
        .from('patient_portal_documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

      if (documentsError) {
        console.error('Erro ao buscar documentos:', documentsError);
      } else {
        setDocuments((documentsData as Document[]) || []);
      }

      // Buscar consultas do paciente usando type casting
      const { data: appointmentsData, error: appointmentsError } = await (supabase as any)
        .from('patient_portal_appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });

      if (appointmentsError) {
        console.error('Erro ao buscar consultas:', appointmentsError);
      } else {
        setAppointments((appointmentsData as Appointment[]) || []);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar seus dados');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast.success('Logout realizado com sucesso');
      navigate('/');
    } else {
      toast.error('Erro ao fazer logout');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'exam': 'Exame',
      'prescription': 'Receita',
      'report': 'Relatório',
      'other': 'Outro'
    };
    return types[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'rescheduled': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'scheduled': 'Agendada',
      'completed': 'Realizada',
      'cancelled': 'Cancelada',
      'rescheduled': 'Reagendada'
    };
    return labels[status] || status;
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-primary"></div>
      </div>
    );
  }

  if (!user || !appUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/logoiosantaluzia-removebg-preview.png" 
                alt="Instituto de Olhos Santa Luzia" 
                className="h-10 w-10 object-contain" 
              />
              <div>
                <h1 className="text-xl font-semibold text-medical-primary">Portal do Paciente</h1>
                <p className="text-sm text-gray-600">Instituto de Olhos Santa Luzia</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Olá, {appUser.username}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo ao seu Portal
          </h2>
          <p className="text-gray-600">
            Aqui você pode acessar seus exames, histórico de consultas e receitas médicas.
          </p>
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="documents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Meus Documentos</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Consultas</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Perfil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Meus Documentos</CardTitle>
                <CardDescription>
                  Exames, receitas e relatórios médicos disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum documento disponível no momento.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-medical-primary" />
                            <div>
                              <h4 className="font-medium text-gray-900">{doc.title}</h4>
                              <p className="text-sm text-gray-500">
                                {getDocumentTypeLabel(doc.document_type)}
                                {doc.exam_date && ` • ${formatDate(doc.exam_date)}`}
                                {doc.doctor_name && ` • Dr. ${doc.doctor_name}`}
                              </p>
                              {doc.description && (
                                <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center space-x-2">
                          <Download className="h-4 w-4" />
                          <span>Baixar</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Consultas</CardTitle>
                <CardDescription>
                  Suas consultas realizadas e agendadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhuma consulta encontrada.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-medical-primary" />
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {formatDate(appointment.appointment_date)}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Dr. {appointment.doctor_name}
                                {appointment.appointment_type && ` • ${appointment.appointment_type}`}
                              </p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusLabel(appointment.status)}
                          </span>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-gray-600 mt-2 pl-8">{appointment.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Meu Perfil</CardTitle>
                <CardDescription>
                  Informações da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {appUser.username}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Conta
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {appUser.role === 'admin' ? 'Administrador' : 
                       appUser.role === 'doctor' ? 'Médico' : 
                       appUser.role === 'secretary' ? 'Secretária' : 'Paciente'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PatientPortal;
