
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'doctor' | 'secretary';
  approved: boolean;
  last_login?: string;
  created_by?: string;
  auth_user_id?: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    role: 'secretary' as User['role']
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Erro ao carregar usuários');
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.username) {
      toast.error('Preencha o nome do usuário');
      return;
    }

    try {
      const { error } = await supabase
        .from('app_users')
        .insert([{
          username: newUser.username.toLowerCase(),
          role: newUser.role,
          approved: false,
          created_by: 'admin'
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('Nome de usuário já existe');
        } else {
          toast.error('Erro ao criar usuário');
        }
        return;
      }

      setNewUser({ username: '', role: 'secretary' });
      setShowCreateForm(false);
      toast.success('Usuário criado com sucesso');
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Erro ao criar usuário');
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('app_users')
        .update({ approved: true })
        .eq('id', userId);

      if (error) {
        toast.error('Erro ao aprovar usuário');
        return;
      }

      toast.success('Usuário aprovado');
      fetchUsers();
    } catch (error) {
      console.error('Error approving user:', error);
      toast.error('Erro ao aprovar usuário');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('app_users')
        .delete()
        .eq('id', userId);

      if (error) {
        toast.error('Erro ao remover usuário');
        return;
      }

      toast.success('Usuário removido');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao remover usuário');
    }
  };

  const getRoleName = (role: string) => {
    const roles = {
      admin: 'Administrador',
      doctor: 'Médico',
      secretary: 'Secretária'
    };
    return roles[role as keyof typeof roles];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bege-principal"></div>
      </div>
    );
  }

  const pendingUsers = users.filter(user => !user.approved);
  const approvedUsers = users.filter(user => user.approved);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-cinza-escuro">Gerenciar Usuários</h3>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="bg-bege-principal hover:bg-marrom-acentuado">
              <Plus className="h-4 w-4 mr-2" />
              Criar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-username">Nome de Usuário</Label>
                <Input
                  id="new-username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  placeholder="Digite o nome do usuário"
                  maxLength={20}
                />
              </div>
              <div>
                <Label>Função</Label>
                <Select value={newUser.role} onValueChange={(value: User['role']) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="secretary">Secretária</SelectItem>
                    <SelectItem value="doctor">Médico</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateUser} className="flex-1 bg-bege-principal hover:bg-marrom-acentuado">
                  Criar Usuário
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Usuários Pendentes */}
      {pendingUsers.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-3">Usuários Aguardando Aprovação</h4>
          <div className="space-y-2">
            {pendingUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between bg-white p-3 rounded-md border">
                <div>
                  <span className="font-medium">{user.username}</span>
                  <span className="text-sm text-gray-600 ml-2">({getRoleName(user.role)})</span>
                  <span className="text-xs text-gray-500 ml-2">Criado por: {user.created_by}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleApproveUser(user.id)} className="bg-green-600 hover:bg-green-700">
                    <UserCheck className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usuários Aprovados */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-semibold text-cinza-escuro">Usuários Ativos</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Acesso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {approvedUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{user.username}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{getRoleName(user.role)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">
                      {user.last_login ? new Date(user.last_login).toLocaleString('pt-BR') : 'Nunca'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.auth_user_id ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.auth_user_id ? 'Ativo' : 'Pendente Login'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-800" onClick={() => handleDeleteUser(user.id)}>
                        <UserX className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
