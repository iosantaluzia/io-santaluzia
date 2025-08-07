
import React, { useState } from 'react';
import { Plus, Edit, Trash2, UserCheck, UserX, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'doctor' | 'secretary';
  approved: boolean;
  lastLogin?: string;
  createdBy: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', username: 'matheus', role: 'doctor', approved: true, lastLogin: '2024-01-15 09:30', createdBy: 'system' },
    { id: '2', username: 'fabiola', role: 'doctor', approved: true, lastLogin: '2024-01-14 14:20', createdBy: 'system' },
    { id: '3', username: 'iosantaluzia', role: 'secretary', approved: true, lastLogin: '2024-01-15 08:00', createdBy: 'system' },
    { id: '4', username: 'novousuario', role: 'secretary', approved: false, createdBy: 'matheus' }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'secretary' as User['role']
  });

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.password) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      username: newUser.username.toLowerCase(),
      role: newUser.role,
      approved: true,
      createdBy: 'admin'
    };

    setUsers([...users, user]);
    setNewUser({ username: '', password: '', role: 'secretary' });
    setShowCreateForm(false);
    toast.success('Usuário criado com sucesso');
  };

  const handleApproveUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, approved: true } : user
    ));
    toast.success('Usuário aprovado');
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success('Usuário removido');
  };

  const getRoleName = (role: string) => {
    const roles = {
      admin: 'Administrador',
      doctor: 'Médico',
      secretary: 'Secretaria'
    };
    return roles[role as keyof typeof roles];
  };

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
                <Label htmlFor="new-password">Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Senha (máx. 8 caracteres)"
                  maxLength={8}
                />
              </div>
              <div>
                <Label>Função</Label>
                <Select value={newUser.role} onValueChange={(value: User['role']) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="secretary">Secretaria</SelectItem>
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
                  <span className="text-xs text-gray-500 ml-2">Criado por: {user.createdBy}</span>
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
                    <span className="text-sm text-gray-600">{user.lastLogin || 'Nunca'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Ativo
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-800">
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
