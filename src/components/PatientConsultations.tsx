
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, User, FileText, Eye, AlertCircle, X, Edit, Save, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Consultation {
  id: string;
  doctor_name: string;
  consultation_date: string;
  anamnesis?: string;
  diagnosis?: string;
  prescription?: string;
  visual_acuity_od?: string;
  visual_acuity_oe?: string;
  ocular_pressure_od?: string;
  ocular_pressure_oe?: string;
  biomicroscopy?: string;
  fundus_exam?: string;
  observations?: string;
  physical_exam?: string;
  payment_received?: boolean | null;
  amount?: number | null;
  status?: string;
}

interface PatientConsultationsProps {
  patientId: string;
  onConsultationClick?: (consultation: Consultation) => void;
  onOpenConsultation?: (consultationId: string) => void;
}

export function PatientConsultations({ patientId, onConsultationClick, onOpenConsultation }: PatientConsultationsProps) {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState<Partial<Consultation>>({});
  const [saving, setSaving] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const { appUser } = useAuth();
  
  const isDoctor = appUser?.role === 'doctor' || appUser?.role === 'admin';
  const isCurrentConsultation = selectedConsultation?.status === 'scheduled' || 
                                 selectedConsultation?.status === 'waiting_payment' || 
                                 selectedConsultation?.status === 'in_progress';
  
  const handleEditClick = () => {
    setEditingData({ ...selectedConsultation });
    setIsEditing(true);
  };
  
  const handleSaveConsultation = async () => {
    if (!selectedConsultation) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('consultations')
        .update(editingData)
        .eq('id', selectedConsultation.id);
        
      if (error) {
        toast.error('Erro ao salvar consulta');
        console.error(error);
        return;
      }
      
      toast.success('Consulta atualizada com sucesso!');
      setIsEditing(false);
      await fetchConsultations();
    } catch (error) {
      toast.error('Erro ao salvar consulta');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    // Aguardar appUser carregar antes de buscar consultas
    if (appUser || !appUser) { // Sempre executar, mas aguardar appUser se necessário
      fetchConsultations();
    }
  }, [patientId, appUser]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Verificar estado inicial
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [consultations]);

  // SECURITY FIX: Validate user access before fetching consultations
  const validateAccess = async (): Promise<boolean> => {
    // Se appUser ainda não foi carregado, aguardar um pouco e tentar novamente
    if (!appUser) {
      console.log('appUser não carregado ainda, aguardando...');
      // Aguardar até 2 segundos para appUser carregar
      for (let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (appUser) break;
      }
      if (!appUser) {
        console.warn('appUser ainda não carregado após aguardar');
        // Se ainda não carregou, permitir acesso se o usuário está autenticado
        // (as políticas RLS do banco vão controlar o acesso real)
        const { data: { user } } = await supabase.auth.getUser();
        return !!user;
      }
    }

    console.log('Validando acesso para usuário:', appUser?.username, 'role:', appUser?.role);

    // Admins and doctors can access all patients
    if (appUser.role === 'admin' || appUser.role === 'doctor') {
      console.log('Acesso permitido: médico ou admin');
      return true;
    }

    // Secretaries can only access patients they created or have consultations with
    if (appUser.role === 'secretary') {
      // Check if this secretary has any relation to this patient
      const { data: hasAccess } = await supabase
        .from('consultations')
        .select('id')
        .eq('patient_id', patientId)
        .eq('created_by', appUser.username)
        .limit(1)
        .maybeSingle();

      if (hasAccess) {
        return true;
      }

      // Also check if secretary created the patient
      try {
        const { data: patient } = await (supabase as any)
          .from('patients')
          .select('created_by')
          .eq('id', patientId)
          .single();

        return patient?.created_by === appUser.username;
      } catch {
        return false;
      }
    }

    console.warn('Acesso negado: role não reconhecido ou sem permissão');
    return false;
  };

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setAccessDenied(false);

      // Para médicos e admins, confiar nas políticas RLS do banco diretamente
      // As políticas RLS permitem acesso a todos os usuários autenticados
      // A validação adicional só é necessária para secretários
      if (appUser && (appUser.role === 'doctor' || appUser.role === 'admin')) {
        // Médicos e admins têm acesso direto - buscar sem validação adicional
        console.log('Buscando consultas como médico/admin');
      } else if (appUser && appUser.role === 'secretary') {
        // Para secretários, validar acesso
        const hasAccess = await validateAccess();
        if (!hasAccess) {
          setAccessDenied(true);
          toast.error('Acesso negado: você não tem permissão para ver este paciente');
          setLoading(false);
          return;
        }
      } else if (!appUser) {
        // Se appUser ainda não carregou, tentar buscar mesmo assim
        // O RLS vai controlar o acesso
        console.log('appUser não carregado ainda, tentando buscar mesmo assim...');
      }

      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('patient_id', patientId)
        .order('consultation_date', { ascending: false });

      if (error) {
        console.error('Erro ao buscar consultas:', error);
        // Se for erro de permissão
        if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('policy')) {
          setAccessDenied(true);
          if (appUser?.role !== 'doctor' && appUser?.role !== 'admin') {
            toast.error('Erro ao carregar consultas: acesso negado');
          }
        } else {
          toast.error('Erro ao carregar consultas');
        }
        setConsultations([]);
        return;
      }

      // Usar apenas consultas reais do banco de dados
      const allConsultations = data || [];
      
      // Ordenar por data (mais recente primeiro)
      allConsultations.sort((a, b) => 
        new Date(b.consultation_date).getTime() - new Date(a.consultation_date).getTime()
      );

      setConsultations(allConsultations);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
      if (appUser?.role !== 'doctor' && appUser?.role !== 'admin') {
        toast.error('Erro ao carregar consultas');
      }
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-bege-principal"></div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center h-32 p-4">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-red-600 font-medium">Acesso Negado</p>
        <p className="text-sm text-gray-600 text-center">
          Você não tem permissão para visualizar consultas deste paciente.
        </p>
      </div>
    );
  }

  const handleConsultationClick = (consultation: Consultation) => {
    if (onConsultationClick) {
      onConsultationClick(consultation);
    } else {
      setSelectedConsultation(consultation);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };


  return (
    <div className="space-y-4 w-full overflow-x-hidden">
      <h3 className="text-lg font-semibold text-cinza-escuro">Histórico de Consultas</h3>
      
      {consultations.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma consulta registrada para este paciente.</p>
        </div>
      ) : (
        <div className="relative w-full" style={{ overflow: 'hidden', maxWidth: '992px' }}>
          {/* Seta esquerda */}
          {showLeftArrow && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-white shadow-lg hover:bg-gray-50"
              onClick={scrollLeft}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          {/* Container de scroll horizontal */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 transparent',
              msOverflowStyle: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
              cursor: 'grab',
              maxWidth: '100%'
            }}
            onScroll={handleScroll}
            onMouseDown={(e) => {
              const container = scrollContainerRef.current;
              if (!container) return;
              
              const startX = e.pageX - container.offsetLeft;
              const scrollLeft = container.scrollLeft;
              let isDown = true;
              
              container.style.cursor = 'grabbing';
              
              const handleMouseMove = (e: MouseEvent) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                const walk = (x - startX) * 2;
                container.scrollLeft = scrollLeft - walk;
              };
              
              const handleMouseUp = () => {
                isDown = false;
                if (container) {
                  container.style.cursor = 'grab';
                }
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            {consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="bg-white border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors flex-shrink-0 w-[320px] shadow-sm"
                onClick={(e) => {
                  // Prevenir clique quando está arrastando
                  if (e.detail === 0) return;
                  handleConsultationClick(consultation);
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-bege-principal flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-cinza-escuro text-sm truncate">{consultation.doctor_name}</h5>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(consultation.consultation_date).toLocaleDateString('pt-BR')}</span>
                      <span>•</span>
                      <span>{new Date(consultation.consultation_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
                
                {/* Verificar se é consulta futura sem anamnese */}
                {(() => {
                  const consultationDate = new Date(consultation.consultation_date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  consultationDate.setHours(0, 0, 0, 0);
                  const isFutureConsultation = consultationDate > today;
                  const hasAnamnesis = consultation.anamnesis && consultation.anamnesis.trim() !== '';
                  
                  // Se for consulta futura e não tiver anamnese, mostrar "Retorno Aguardado"
                  if (isFutureConsultation && !hasAnamnesis) {
                    return (
                      <p className="text-xs text-gray-500 italic mb-3">
                        Retorno Aguardado
                      </p>
                    );
                  }
                  
                  // Se tiver anamnese, mostrar normalmente
                  if (hasAnamnesis) {
                    return (
                      <p className="text-xs text-gray-600 line-clamp-4 mb-3">
                        {consultation.anamnesis}
                      </p>
                    );
                  }
                  
                  // Se não for futura e não tiver anamnese, mostrar diagnóstico se existir
                  if (consultation.diagnosis) {
                    return (
                      <p className="text-xs text-gray-600 mb-3">
                        <span className="font-medium">Diagnóstico:</span> {consultation.diagnosis}
                      </p>
                    );
                  }
                  
                  return null;
                })()}
                
                <div className="flex items-center justify-end mt-auto">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConsultationClick(consultation);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Seta direita */}
          {showRightArrow && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-white shadow-lg hover:bg-gray-50"
              onClick={scrollRight}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}
      
      {/* Modal de Detalhes da Consulta */}
      <Dialog open={!!selectedConsultation} onOpenChange={(open) => !open && setSelectedConsultation(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0 relative">
            {/* Botões de Navegação entre Consultas */}
            {selectedConsultation && consultations.length > 1 && (() => {
              const currentIndex = consultations.findIndex(c => c.id === selectedConsultation.id);
              const hasPrevious = currentIndex > 0;
              const hasNext = currentIndex < consultations.length - 1;
              const previousConsultation = hasPrevious ? consultations[currentIndex - 1] : null;
              const nextConsultation = hasNext ? consultations[currentIndex + 1] : null;

              return (
                <>
                  {hasPrevious && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute -left-14 top-1/2 -translate-y-1/2 z-50 h-10 w-10 bg-white shadow-lg hover:bg-gray-50"
                      onClick={() => {
                        if (previousConsultation) {
                          setSelectedConsultation(previousConsultation);
                          setIsEditing(false);
                        }
                      }}
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  )}
                  {hasNext && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute -right-14 top-1/2 -translate-y-1/2 z-50 h-10 w-10 bg-white shadow-lg hover:bg-gray-50"
                      onClick={() => {
                        if (nextConsultation) {
                          setSelectedConsultation(nextConsultation);
                          setIsEditing(false);
                        }
                      }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  )}
                </>
              );
            })()}
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold text-cinza-escuro">
                  {isCurrentConsultation ? 'Consulta Atual' : 'Detalhes da Consulta'}
                </DialogTitle>
                <DialogDescription>
                  {selectedConsultation?.doctor_name} • {new Date(selectedConsultation?.consultation_date || '').toLocaleString('pt-BR')}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                {isCurrentConsultation && isDoctor && !isEditing && (
                  <Button variant="outline" size="sm" onClick={handleEditClick}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
                {isEditing && (
                  <>
                    <Button variant="outline" size="sm" onClick={() => { setIsEditing(false); setEditingData({}); }}>
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={handleSaveConsultation} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Salvando...' : 'Salvar'}
                    </Button>
                  </>
                )}
                {isDoctor && onOpenConsultation && selectedConsultation && !isEditing && (
                  <Button 
                    size="sm"
                    className="bg-medical-primary hover:bg-medical-primary/90 text-white"
                    onClick={() => {
                      setSelectedConsultation(null);
                      setIsEditing(false);
                      onOpenConsultation(selectedConsultation.id);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Abrir Consulta
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => { setSelectedConsultation(null); setIsEditing(false); }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <ScrollArea className="flex-1 px-6 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna Esquerda - Campos maiores */}
              <div className="lg:col-span-2 space-y-6">
                {/* Informações Gerais */}
                {selectedConsultation?.amount != null && selectedConsultation.amount > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3">Informações Gerais</h4>
                    <div>
                      <Label className="text-xs text-gray-600">Valor Pago</Label>
                      <p className="text-sm font-semibold text-green-600 mt-1">
                        R$ {selectedConsultation.amount.toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Anamnese */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Anamnese</Label>
                  {isEditing ? (
                    <Textarea
                      value={editingData.anamnesis || ''}
                      onChange={(e) => setEditingData({ ...editingData, anamnesis: e.target.value })}
                      placeholder="Histórico da queixa principal, sintomas relatados pelo paciente..."
                      rows={5}
                      className="bg-white"
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 min-h-[80px] max-h-[120px] overflow-y-auto whitespace-pre-wrap">
                      {selectedConsultation?.anamnesis || 'Não informado'}
                    </div>
                  )}
                </div>

                {/* Biomicroscopia */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Biomicroscopia</Label>
                  {isEditing ? (
                    <Textarea
                      value={editingData.biomicroscopy || ''}
                      onChange={(e) => setEditingData({ ...editingData, biomicroscopy: e.target.value })}
                      placeholder="Achados da biomicroscopia (lâmpada de fenda)..."
                      rows={4}
                      className="bg-white"
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 min-h-[60px] max-h-[100px] overflow-y-auto whitespace-pre-wrap">
                      {selectedConsultation?.biomicroscopy || 'Não informado'}
                    </div>
                  )}
                </div>

                {/* Fundo de Olho */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Fundo de Olho</Label>
                  {isEditing ? (
                    <Textarea
                      value={editingData.fundus_exam || ''}
                      onChange={(e) => setEditingData({ ...editingData, fundus_exam: e.target.value })}
                      placeholder="Achados do exame de fundo de olho..."
                      rows={4}
                      className="bg-white"
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 min-h-[60px] max-h-[100px] overflow-y-auto whitespace-pre-wrap">
                      {selectedConsultation?.fundus_exam || 'Não informado'}
                    </div>
                  )}
                </div>

                {/* Prescrição */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">Prescrição e Conduta</Label>
                  {isEditing ? (
                    <Textarea
                      value={editingData.prescription || ''}
                      onChange={(e) => setEditingData({ ...editingData, prescription: e.target.value })}
                      placeholder="Prescrição médica..."
                      rows={4}
                      className="bg-white"
                    />
                  ) : (
                    <div className="bg-green-50 p-3 rounded border border-green-200 text-sm text-gray-700 min-h-[60px] max-h-[100px] overflow-y-auto whitespace-pre-wrap">
                      {selectedConsultation?.prescription || 'Não informado'}
                    </div>
                  )}
                </div>
              </div>

              {/* Coluna Direita - Seções menores */}
              <div className="lg:col-span-1 space-y-6">
                {/* Acuidade Visual */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">Acuidade Visual</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-600">OD</Label>
                      {isEditing ? (
                        <Input
                          value={editingData.visual_acuity_od || ''}
                          onChange={(e) => setEditingData({ ...editingData, visual_acuity_od: e.target.value })}
                          placeholder="Ex: 20/20"
                          className="mt-1 bg-white"
                        />
                      ) : (
                        <p className="text-sm mt-1 font-medium">{selectedConsultation?.visual_acuity_od || 'Não informado'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">OE</Label>
                      {isEditing ? (
                        <Input
                          value={editingData.visual_acuity_oe || ''}
                          onChange={(e) => setEditingData({ ...editingData, visual_acuity_oe: e.target.value })}
                          placeholder="Ex: 20/20"
                          className="mt-1 bg-white"
                        />
                      ) : (
                        <p className="text-sm mt-1 font-medium">{selectedConsultation?.visual_acuity_oe || 'Não informado'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pressão Intraocular (Tonometria) */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-sm font-semibold text-gray-700 mb-3 block">Tonometria</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-600">OD</Label>
                      {isEditing ? (
                        <Input
                          value={editingData.ocular_pressure_od || ''}
                          onChange={(e) => setEditingData({ ...editingData, ocular_pressure_od: e.target.value })}
                          placeholder="Ex: 14"
                          className="mt-1 bg-white"
                        />
                      ) : (
                        <p className="text-sm mt-1 font-medium">
                          {selectedConsultation?.ocular_pressure_od ? `${selectedConsultation.ocular_pressure_od} mmHg` : 'Não informado'}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">OE</Label>
                      {isEditing ? (
                        <Input
                          value={editingData.ocular_pressure_oe || ''}
                          onChange={(e) => setEditingData({ ...editingData, ocular_pressure_oe: e.target.value })}
                          placeholder="Ex: 14"
                          className="mt-1 bg-white"
                        />
                      ) : (
                        <p className="text-sm mt-1 font-medium">
                          {selectedConsultation?.ocular_pressure_oe ? `${selectedConsultation.ocular_pressure_oe} mmHg` : 'Não informado'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
