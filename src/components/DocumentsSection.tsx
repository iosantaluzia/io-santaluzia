import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Edit, Trash2, Copy, Search, X, Pill, TestTube, FileCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface DocumentTemplate {
  id: string;
  name: string;
  type: 'receituario' | 'solicitacao_exame' | 'declaracao';
  content: string;
  category: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export function DocumentsSection() {
  const { appUser } = useAuth();
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'receituarios' | 'exames' | 'laudos'>('receituarios');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'receituario' as 'receituario' | 'solicitacao_exame' | 'declaracao',
    content: '',
    category: ''
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm, selectedCategory, activeTab]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('document_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates((data || []) as DocumentTemplate[]);
    } catch (error: any) {
      console.error('Erro ao buscar modelos:', error);
      toast.error('Erro ao carregar modelos de documentos');
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    // Filtrar por aba ativa (tipo)
    const typeMap: Record<string, string> = {
      'receituarios': 'receituario',
      'exames': 'solicitacao_exame',
      'laudos': 'declaracao'
    };
    filtered = filtered.filter(t => t.type === typeMap[activeTab]);

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Filtrar por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(term) ||
        t.content.toLowerCase().includes(term) ||
        (t.category && t.category.toLowerCase().includes(term))
      );
    }

    setFilteredTemplates(filtered);
  };

  const getCurrentType = (): 'receituario' | 'solicitacao_exame' | 'declaracao' => {
    const typeMap: Record<string, 'receituario' | 'solicitacao_exame' | 'declaracao'> = {
      'receituarios': 'receituario',
      'exames': 'solicitacao_exame',
      'laudos': 'declaracao'
    };
    return typeMap[activeTab];
  };

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('document_templates')
        .insert({
          name: formData.name,
          type: getCurrentType(),
          content: formData.content,
          category: formData.category || null,
          created_by: appUser?.username || null
        });

      if (error) throw error;

      toast.success('Modelo criado com sucesso!');
      setIsCreateModalOpen(false);
      resetForm();
      fetchTemplates();
    } catch (error: any) {
      console.error('Erro ao criar modelo:', error);
      toast.error('Erro ao criar modelo: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleEdit = (template: DocumentTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      type: template.type,
      content: template.content,
      category: template.category || ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingTemplate || !formData.name.trim() || !formData.content.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('document_templates')
        .update({
          name: formData.name,
          type: formData.type,
          content: formData.content,
          category: formData.category || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingTemplate.id);

      if (error) throw error;

      toast.success('Modelo atualizado com sucesso!');
      setIsEditModalOpen(false);
      setEditingTemplate(null);
      resetForm();
      fetchTemplates();
    } catch (error: any) {
      console.error('Erro ao atualizar modelo:', error);
      toast.error('Erro ao atualizar modelo: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este modelo?')) return;

    try {
      const { error } = await (supabase as any)
        .from('document_templates')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast.success('Modelo excluído com sucesso!');
      fetchTemplates();
    } catch (error: any) {
      console.error('Erro ao excluir modelo:', error);
      toast.error('Erro ao excluir modelo: ' + (error.message || 'Erro desconhecido'));
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Conteúdo copiado para a área de transferência!');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: getCurrentType(),
      content: '',
      category: ''
    });
  };

  const getCategoriesForCurrentTab = () => {
    const typeMap: Record<string, string> = {
      'receituarios': 'receituario',
      'exames': 'solicitacao_exame',
      'laudos': 'declaracao'
    };
    return Array.from(new Set(
      templates
        .filter(t => t.type === typeMap[activeTab])
        .map(t => t.category)
        .filter(Boolean)
    )) as string[];
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'receituario': return 'Receituário';
      case 'solicitacao_exame': return 'Solicitação de Exame';
      case 'declaracao': return 'Declaração';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'receituario': return 'bg-blue-100 text-blue-800';
      case 'solicitacao_exame': return 'bg-green-100 text-green-800';
      case 'declaracao': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bege-principal"></div>
        <span className="ml-2 text-gray-600">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cinza-escuro">Documentos</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie modelos de receituários, solicitações de exames e laudos
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (open) {
            // Resetar formulário com tipo baseado na aba ativa quando abrir
            setFormData({
              name: '',
              type: getCurrentType(),
              content: '',
              category: ''
            });
          } else {
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-medical-primary hover:bg-medical-primary/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Novo Modelo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Criar Novo Modelo - {
                  activeTab === 'receituarios' ? 'Receituário' :
                  activeTab === 'exames' ? 'Solicitação de Exame' :
                  'Laudo'
                }
              </DialogTitle>
              <DialogDescription>
                Crie um novo modelo de documento para uso nas consultas
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Modelo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={
                    activeTab === 'receituarios' ? 'Ex: Receituário Uveites' :
                    activeTab === 'exames' ? 'Ex: Exames Uveites' :
                    'Ex: Laudo Teste do Reflexo Vermelho'
                  }
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria (opcional)</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ex: Uveites, Pós-operatório"
                />
              </div>
              <div>
                <Label htmlFor="content">Conteúdo *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Digite o conteúdo do modelo..."
                  className="min-h-[300px] font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use {'{PACIENTE}'} como placeholder para o nome do paciente
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate} className="bg-medical-primary hover:bg-medical-primary/90 text-white">
                  Criar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Abas de Categorias */}
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value as 'receituarios' | 'exames' | 'laudos');
        setSelectedCategory('all'); // Resetar categoria ao trocar de aba
      }}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="receituarios" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Receituários
          </TabsTrigger>
          <TabsTrigger value="exames" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Exames
          </TabsTrigger>
          <TabsTrigger value="laudos" className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Laudos
          </TabsTrigger>
        </TabsList>

        {/* Filtros - Comum para todas as abas */}
        <div className="flex gap-4 items-end mt-4">
          <div className="flex-1">
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, conteúdo ou categoria..."
                className="pl-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          {getCategoriesForCurrentTab().length > 0 && (
            <div className="w-48">
              <Label htmlFor="category-filter">Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {getCategoriesForCurrentTab().map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Conteúdo das Abas */}
        <TabsContent value="receituarios" className="mt-6">
          {filteredTemplates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Pill className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Nenhum receituário encontrado</p>
                <p className="text-sm text-gray-500 mt-1">
                  {templates.filter(t => t.type === 'receituario').length === 0 
                    ? 'Crie seu primeiro modelo de receituário' 
                    : 'Tente ajustar os filtros de busca'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {template.category && (
                            <Badge className="bg-blue-100 text-blue-800">
                              {template.category}
                            </Badge>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-4 flex-1 overflow-hidden">
                      <pre className="whitespace-pre-wrap font-mono text-xs max-h-32 overflow-y-auto">
                        {template.content.length > 200 
                          ? template.content.substring(0, 200) + '...' 
                          : template.content}
                      </pre>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCopy(template.content)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="exames" className="mt-6">
          {filteredTemplates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TestTube className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Nenhuma solicitação de exame encontrada</p>
                <p className="text-sm text-gray-500 mt-1">
                  {templates.filter(t => t.type === 'solicitacao_exame').length === 0 
                    ? 'Crie seu primeiro modelo de solicitação de exame' 
                    : 'Tente ajustar os filtros de busca'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {template.category && (
                            <Badge className="bg-green-100 text-green-800">
                              {template.category}
                            </Badge>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-4 flex-1 overflow-hidden">
                      <pre className="whitespace-pre-wrap font-mono text-xs max-h-32 overflow-y-auto">
                        {template.content.length > 200 
                          ? template.content.substring(0, 200) + '...' 
                          : template.content}
                      </pre>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCopy(template.content)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="laudos" className="mt-6">
          {filteredTemplates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileCheck className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600">Nenhum laudo encontrado</p>
                <p className="text-sm text-gray-500 mt-1">
                  {templates.filter(t => t.type === 'declaracao').length === 0 
                    ? 'Crie seu primeiro modelo de laudo' 
                    : 'Tente ajustar os filtros de busca'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {template.category && (
                            <Badge className="bg-purple-100 text-purple-800">
                              {template.category}
                            </Badge>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 mb-4 flex-1 overflow-hidden">
                      <pre className="whitespace-pre-wrap font-mono text-xs max-h-32 overflow-y-auto">
                        {template.content.length > 200 
                          ? template.content.substring(0, 200) + '...' 
                          : template.content}
                      </pre>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCopy(template.content)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copiar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(template)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Modelo</DialogTitle>
            <DialogDescription>
              Edite o modelo de documento
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome do Modelo *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Categoria (opcional)</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Conteúdo *</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setIsEditModalOpen(false); resetForm(); setEditingTemplate(null); }}>
                Cancelar
              </Button>
              <Button onClick={handleUpdate} className="bg-medical-primary hover:bg-medical-primary/90 text-white">
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

