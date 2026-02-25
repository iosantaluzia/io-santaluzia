
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Edit, Save, X, Trash2, Plus, User } from 'lucide-react';

interface AppUser {
  id: string;
  username: string;
  display_name: string | null;
  role: 'admin' | 'doctor' | 'secretary' | 'financeiro';
  approved: boolean;
  auth_user_id: string | null;
  created_at: string;
  last_login: string | null;
  avatar_url?: string | null;
}

export function UserManagement() {
  const { appUser } = useAuth();
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [editFormData, setEditFormData] = useState({ username: '', display_name: '', password: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserFormData, setNewUserFormData] = useState({
    username: '',
    display_name: '',
    password: '',
    role: 'secretary' as 'admin' | 'doctor' | 'secretary' | 'financeiro'
  });

  // Verificar se o usuário tem permissão (apenas matheus e secretaria)
  const canManageUsers = appUser?.username?.toLowerCase() === 'matheus' || appUser?.username?.toLowerCase() === 'secretaria';

  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'doctor' | 'secretary' | 'financeiro'>('all');

  // Buscar usuários
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['app_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as unknown) as AppUser[];
    },
  });

  // Deletar usuário
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Buscar auth_user_id antes de deletar
      const { data: userData } = await supabase
        .from('app_users')
        .select('auth_user_id')
        .eq('id', userId)
        .single();

      // Deletar da tabela app_users (isso pode deletar em cascata o auth.users se configurado)
      const { error } = await supabase
        .from('app_users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Se houver auth_user_id, tentar deletar do auth.users também
      if (userData?.auth_user_id) {
        try {
          // Nota: Deletar de auth.users pode requerer privilégios admin
          // Por enquanto, apenas deletamos de app_users
          console.log('Usuário removido de app_users. Para remover completamente, use o painel do Supabase.');
        } catch (authDeleteError) {
          console.warn('Não foi possível deletar do auth.users:', authDeleteError);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app_users'] });
      setShowDeleteConfirm(false);
      setEditingUser(null);
      setEditFormData({ username: '', display_name: '', password: '' });
      toast.success('Usuário deletado com sucesso');
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);
      toast.error('Erro ao deletar usuário: ' + (error.message || 'Erro desconhecido'));
    },
  });

  // Criar novo usuário
  const createUserMutation = useMutation({
    mutationFn: async ({ username, display_name, password, role }: { username: string; display_name?: string; password: string; role: 'admin' | 'doctor' | 'secretary' | 'financeiro' }) => {
      const email = `${username}@iosantaluzia.com.br`;

      // Verificar se o username já existe
      const { data: existingUser } = await supabase
        .from('app_users')
        .select('id, auth_user_id')
        .eq('username', username.toLowerCase())
        .maybeSingle();

      if (existingUser) {
        if (existingUser.auth_user_id) {
          throw new Error('Usuário já existe e está vinculado a uma conta de autenticação');
        }
        throw new Error('Username já existe. Use um username diferente.');
      }

      // Criar registro em app_users primeiro (sem auth_user_id)
      const { data: newAppUser, error: appUserError } = await supabase
        .from('app_users')
        .insert({
          username: username.toLowerCase(),
          display_name: display_name?.trim() || null,
          role,
          approved: true,
          auth_user_id: null,
          created_by: appUser?.username || 'system'
        } as any)
        .select()
        .single();

      if (appUserError) {
        throw appUserError;
      }

      // Criar usuário no Supabase Auth
      // O trigger handle_new_user() irá vincular automaticamente o auth_user_id
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.toLowerCase()
          },
          emailRedirectTo: undefined
        }
      });

      if (authError) {
        // Se falhar ao criar no auth, deletar o registro de app_users
        try {
          await supabase
            .from('app_users')
            .delete()
            .eq('id', newAppUser.id);
        } catch (deleteError) {
          console.error('Erro ao limpar registro de app_users após falha:', deleteError);
        }

        if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
          throw new Error('Email já está em uso. Use um username diferente.');
        }
        throw authError;
      }

      if (!authData.user) {
        // Se não criou o usuário, deletar o registro de app_users
        try {
          await supabase
            .from('app_users')
            .delete()
            .eq('id', newAppUser.id);
        } catch (deleteError) {
          console.error('Erro ao limpar registro de app_users:', deleteError);
        }
        throw new Error('Erro ao criar usuário de autenticação');
      }

      // O trigger handle_new_user() deve vincular automaticamente, mas vamos atualizar manualmente para garantir
      const { error: linkError } = await supabase
        .from('app_users')
        .update({ auth_user_id: authData.user.id })
        .eq('id', newAppUser.id);

      if (linkError) {
        console.warn('Aviso: Não foi possível vincular auth_user_id automaticamente:', linkError);
        // Não falhar aqui, pois o trigger pode fazer isso
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app_users'] });
      setShowAddUser(false);
      setNewUserFormData({ username: '', display_name: '', password: '', role: 'secretary' });
      toast.success('Usuário criado com sucesso');
    },
    onError: (error: any) => {
      console.error('Error creating user:', error);
      toast.error('Erro ao criar usuário: ' + (error.message || 'Erro desconhecido'));
    },
  });

  // Editar usuário
  const editUserMutation = useMutation({
    mutationFn: async ({ userId, username, display_name, password }: { userId: string; username: string; display_name?: string; password?: string }) => {
      // Buscar dados atuais do usuário
      const { data: currentUser } = await supabase
        .from('app_users')
        .select('auth_user_id, username')
        .eq('id', userId)
        .single();

      if (!currentUser) throw new Error('Usuário não encontrado');

      // Preparar dados para atualização
      const updateData: { username: string; display_name?: string } = { username };
      if (display_name !== undefined) {
        updateData.display_name = display_name.trim() || null;
      }

      // Atualizar username e display_name na tabela app_users
      const { error: appUserError } = await supabase
        .from('app_users')
        .update(updateData)
        .eq('id', userId);

      if (appUserError) throw appUserError;

      // Se o username mudou e o usuário tem auth_user_id, atualizar email no auth.users via função SQL
      if (currentUser.auth_user_id && username !== currentUser.username) {
        const newEmail = `${username}@iosantaluzia.com.br`;
        try {
          // Atualizar email usando função SQL
          const { error: emailError } = await (supabase as any).rpc('update_user_email', {
            user_id: currentUser.auth_user_id,
            new_email: newEmail
          });

          if (emailError) {
            console.warn('Erro ao atualizar email:', emailError);
            toast.warning('Username atualizado. O email pode precisar ser atualizado manualmente no painel do Supabase.');
          }
        } catch (emailUpdateError) {
          console.warn('Erro ao atualizar email do usuário:', emailUpdateError);
          toast.warning('Username atualizado. O email pode precisar ser atualizado manualmente no painel do Supabase.');
        }
      }

      // Se houver senha e o usuário tiver auth_user_id, atualizar senha no auth.users
      if (password && password.trim() !== '') {
        const authUserId = currentUser.auth_user_id;
        if (authUserId) {
          try {
            // Atualizar senha usando função SQL
            const { error: passwordError } = await (supabase as any).rpc('update_user_password', {
              user_id: authUserId,
              new_password: password
            });

            if (passwordError) {
              console.warn('Erro ao atualizar senha:', passwordError);
              toast.warning('Username atualizado. Para alterar a senha, use o painel do Supabase.');
            }
          } catch (rpcError) {
            console.warn('Erro ao chamar função de atualização de senha:', rpcError);
            toast.warning('Username atualizado. Para alterar a senha, use o painel do Supabase.');
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app_users'] });
      setEditingUser(null);
      setEditFormData({ username: '', display_name: '', password: '' });
      toast.success('Usuário atualizado com sucesso');
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      toast.error('Erro ao atualizar usuário: ' + (error.message || 'Erro desconhecido'));
    },
  });

  const handleEditUser = (user: AppUser) => {
    setEditingUser(user);
    setEditFormData({
      username: user.username,
      display_name: user.display_name || '',
      password: ''
    });
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;

    if (!editFormData.username.trim()) {
      toast.error('O username não pode estar vazio');
      return;
    }

    editUserMutation.mutate({
      userId: editingUser.id,
      username: editFormData.username.trim().toLowerCase(),
      display_name: editFormData.display_name.trim() || undefined,
      password: editFormData.password.trim() || undefined
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({ username: '', display_name: '', password: '' });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'secretary':
        return 'bg-green-100 text-green-800';
      case 'financeiro':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'doctor':
        return 'Médico';
      case 'secretary':
        return 'Secretária';
      case 'financeiro':
        return 'Financeiro';
      default:
        return role;
    }
  };

  // Verificar permissão de acesso
  if (!canManageUsers) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">Acesso Negado</p>
          <p className="text-sm text-gray-500">Apenas Matheus e Secretaria podem gerenciar usuários.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bege-principal"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-cinza-escuro">Gerenciamento de Usuários</h2>
        <Button
          onClick={() => setShowAddUser(true)}
          className="bg-medical-primary text-white hover:bg-medical-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={roleFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setRoleFilter('all')}
          size="sm"
          className="rounded-full px-4"
        >
          Todos
        </Button>
        <Button
          variant={roleFilter === 'doctor' ? 'default' : 'outline'}
          onClick={() => setRoleFilter('doctor')}
          size="sm"
          className="rounded-full px-4"
        >
          Médicos
        </Button>
        <Button
          variant={roleFilter === 'secretary' ? 'default' : 'outline'}
          onClick={() => setRoleFilter('secretary')}
          size="sm"
          className="rounded-full px-4"
        >
          Secretárias
        </Button>
        <Button
          variant={roleFilter === 'financeiro' ? 'default' : 'outline'}
          onClick={() => setRoleFilter('financeiro')}
          size="sm"
          className="rounded-full px-4"
        >
          Financeiro
        </Button>
        <Button
          variant={roleFilter === 'admin' ? 'default' : 'outline'}
          onClick={() => setRoleFilter('admin')}
          size="sm"
          className="rounded-full px-4"
        >
          Administradores
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users
          .filter(user => roleFilter === 'all' || user.role === roleFilter)
          .map((user) => (
            <Card key={user.id || user.username} className="flex flex-col">
              <CardContent className="p-4 flex flex-col flex-1">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-2xl border-2 border-bege-principal/20 bg-white shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={user.avatar_url || `https://api.dicebear.com/9.x/micah/svg?seed=${user.username}&backgroundColor=b6e3f4`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{user.display_name || user.username}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                      disabled={editUserMutation.isPending}
                      className="w-full"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>

                    <div className="text-xs text-gray-600 pt-2 border-t">
                      <p>Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                      {user.last_login && (
                        <p className="mt-1">Último login: {new Date(user.last_login).toLocaleString('pt-BR')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Modal de Edição de Usuário */}
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Altere o username e/ou senha do usuário. Deixe a senha em branco para não alterá-la.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
            }}
            className="space-y-4 mt-4"
          >
            <div>
              <Label htmlFor="edit-username">Username (Login)</Label>
              <Input
                id="edit-username"
                value={editFormData.username}
                onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value.toLowerCase() })}
                placeholder="Digite o username (minúsculas)"
                disabled={editUserMutation.isPending || deleteUserMutation.isPending}
              />
              <p className="text-xs text-gray-500 mt-1">
                Username usado para login (será convertido para minúsculas)
              </p>
            </div>
            <div>
              <Label htmlFor="edit-display-name">Nome de Exibição</Label>
              <Input
                id="edit-display-name"
                value={editFormData.display_name}
                onChange={(e) => setEditFormData({ ...editFormData, display_name: e.target.value })}
                placeholder="Digite o nome de exibição (ex: Dr. Matheus)"
                disabled={editUserMutation.isPending || deleteUserMutation.isPending}
              />
              <p className="text-xs text-gray-500 mt-1">
                Nome que será exibido no chat e outras partes do sistema
              </p>
            </div>
            <div>
              <Label htmlFor="edit-password">Nova Senha (opcional)</Label>
              <Input
                id="edit-password"
                type="password"
                value={editFormData.password}
                onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                placeholder="Deixe em branco para não alterar"
                disabled={editUserMutation.isPending || deleteUserMutation.isPending}
              />
              <p className="text-xs text-gray-500 mt-1">
                Deixe em branco para manter a senha atual
              </p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={editUserMutation.isPending || deleteUserMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Deletar Usuário
              </Button>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={editUserMutation.isPending || deleteUserMutation.isPending}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={editUserMutation.isPending || deleteUserMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {editUserMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Adicionar Usuário */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Crie um novo usuário com login e permissões para o dashboard.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newUserFormData.username.trim()) {
                toast.error('O username é obrigatório');
                return;
              }
              if (!newUserFormData.password.trim() || newUserFormData.password.length < 6) {
                toast.error('A senha deve ter pelo menos 6 caracteres');
                return;
              }
              createUserMutation.mutate({
                username: newUserFormData.username.trim(),
                display_name: newUserFormData.display_name.trim() || undefined,
                password: newUserFormData.password,
                role: newUserFormData.role
              });
            }}
            className="space-y-4 mt-4"
          >
            <div>
              <Label htmlFor="new-username">Username (Login) *</Label>
              <Input
                id="new-username"
                value={newUserFormData.username}
                onChange={(e) => setNewUserFormData({ ...newUserFormData, username: e.target.value.toLowerCase() })}
                placeholder="Digite o username (ex: joao)"
                disabled={createUserMutation.isPending}
              />
              <p className="text-xs text-gray-500 mt-1">
                O email será gerado automaticamente como: {newUserFormData.username || 'username'}@iosantaluzia.com.br
              </p>
            </div>
            <div>
              <Label htmlFor="new-display-name">Nome de Exibição</Label>
              <Input
                id="new-display-name"
                value={newUserFormData.display_name}
                onChange={(e) => setNewUserFormData({ ...newUserFormData, display_name: e.target.value })}
                placeholder="Digite o nome de exibição (ex: Dr. João)"
                disabled={createUserMutation.isPending}
              />
              <p className="text-xs text-gray-500 mt-1">
                Nome que será exibido no chat e outras partes do sistema (opcional)
              </p>
            </div>
            <div>
              <Label htmlFor="new-password">Senha *</Label>
              <Input
                id="new-password"
                type="password"
                value={newUserFormData.password}
                onChange={(e) => setNewUserFormData({ ...newUserFormData, password: e.target.value })}
                placeholder="Digite a senha"
                disabled={createUserMutation.isPending}
              />
            </div>
            <div>
              <Label htmlFor="new-role">Função *</Label>
              <select
                id="new-role"
                value={newUserFormData.role}
                onChange={(e) => setNewUserFormData({ ...newUserFormData, role: e.target.value as any })}
                disabled={createUserMutation.isPending}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="secretary">Secretária</option>
                <option value="doctor">Médico</option>
                <option value="admin">Administrador</option>
                <option value="financeiro">Financeiro</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddUser(false);
                  setNewUserFormData({ username: '', display_name: '', password: '', role: 'secretary' });
                }}
                disabled={createUserMutation.isPending}
              >
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createUserMutation.isPending}
                className="bg-medical-primary text-white hover:bg-medical-primary/90"
              >
                <Plus className="h-4 w-4 mr-1" />
                {createUserMutation.isPending ? 'Criando...' : 'Criar Usuário'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar o usuário <strong>{editingUser?.username}</strong>?
              <br />
              <span className="text-red-600 font-semibold">Esta ação não pode ser desfeita.</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={deleteUserMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => editingUser && deleteUserMutation.mutate(editingUser.id)}
              disabled={deleteUserMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {deleteUserMutation.isPending ? 'Deletando...' : 'Deletar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
