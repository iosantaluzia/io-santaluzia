
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
import { Edit, Save, X, Trash2 } from 'lucide-react';

interface AppUser {
  id: string;
  username: string;
  role: 'admin' | 'doctor' | 'secretary' | 'financeiro';
  approved: boolean;
  auth_user_id: string | null;
  created_at: string;
  last_login: string | null;
}

export function UserManagement() {
  const { appUser } = useAuth();
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [editFormData, setEditFormData] = useState({ username: '', password: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Verificar se o usuário tem permissão (apenas matheus e secretaria)
  const canManageUsers = appUser?.username?.toLowerCase() === 'matheus' || appUser?.username?.toLowerCase() === 'secretaria';

  // Buscar usuários
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['app_users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AppUser[];
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
      setEditFormData({ username: '', password: '' });
      toast.success('Usuário deletado com sucesso');
    },
    onError: (error: any) => {
      console.error('Error deleting user:', error);
      toast.error('Erro ao deletar usuário: ' + (error.message || 'Erro desconhecido'));
    },
  });

  // Editar usuário
  const editUserMutation = useMutation({
    mutationFn: async ({ userId, username, password }: { userId: string; username: string; password?: string }) => {
      // Buscar dados atuais do usuário
      const { data: currentUser } = await supabase
        .from('app_users')
        .select('auth_user_id, username')
        .eq('id', userId)
        .single();

      if (!currentUser) throw new Error('Usuário não encontrado');

      // Atualizar username na tabela app_users
      const { error: appUserError } = await supabase
        .from('app_users')
        .update({ username })
        .eq('id', userId);
      
      if (appUserError) throw appUserError;

      // Se o username mudou e o usuário tem auth_user_id, atualizar email no auth.users via função SQL
      if (currentUser.auth_user_id && username !== currentUser.username) {
        const newEmail = `${username}@iosantaluzia.com`;
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
      setEditFormData({ username: '', password: '' });
      toast.success('Usuário atualizado com sucesso');
    },
    onError: (error: any) => {
      console.error('Error updating user:', error);
      toast.error('Erro ao atualizar usuário: ' + (error.message || 'Erro desconhecido'));
    },
  });

  const handleEditUser = (user: AppUser) => {
    setEditingUser(user);
    setEditFormData({ username: user.username, password: '' });
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    
    if (!editFormData.username.trim()) {
      toast.error('O username não pode estar vazio');
      return;
    }

    editUserMutation.mutate({
      userId: editingUser.id,
      username: editFormData.username.trim(),
      password: editFormData.password.trim() || undefined
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({ username: '', password: '' });
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-marrom-principal">Gerenciamento de Usuários</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="flex flex-col">
            <CardContent className="p-4 flex flex-col flex-1">
              <div className="flex flex-col space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{user.username}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                      <Badge variant={user.approved ? "default" : "destructive"}>
                        {user.approved ? "Aprovado" : "Pendente"}
                      </Badge>
                      {user.auth_user_id ? (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          ✓ Auth Configurado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          ⚠ Auth Pendente
                        </Badge>
                      )}
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
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={editFormData.username}
                onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
                placeholder="Digite o username"
                disabled={editUserMutation.isPending || deleteUserMutation.isPending}
              />
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
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={editUserMutation.isPending || deleteUserMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Deletar Usuário
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={editUserMutation.isPending || deleteUserMutation.isPending}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={editUserMutation.isPending || deleteUserMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {editUserMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          </div>
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
