
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UserAuthSetup } from './UserAuthSetup';

interface AppUser {
  id: string;
  username: string;
  role: 'admin' | 'doctor' | 'secretary';
  approved: boolean;
  auth_user_id: string | null;
  created_at: string;
  last_login: string | null;
}

export function UserManagement() {
  const queryClient = useQueryClient();

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

  // Toggle aprovação do usuário
  const toggleApprovalMutation = useMutation({
    mutationFn: async ({ userId, approved }: { userId: string; approved: boolean }) => {
      const { error } = await supabase
        .from('app_users')
        .update({ approved })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app_users'] });
      toast.success('Status do usuário atualizado');
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast.error('Erro ao atualizar usuário');
    },
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'secretary':
        return 'bg-green-100 text-green-800';
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
      default:
        return role;
    }
  };

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

      {/* Componente para criar autenticação do usuário financeiro */}
      <UserAuthSetup />

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold">{user.username}</h3>
                    <div className="flex items-center space-x-2 mt-1">
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
                <div className="flex items-center space-x-2">
                  <Button
                    variant={user.approved ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleApprovalMutation.mutate({
                      userId: user.id,
                      approved: !user.approved
                    })}
                    disabled={toggleApprovalMutation.isPending}
                  >
                    {user.approved ? "Desaprovar" : "Aprovar"}
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                {user.last_login && (
                  <p>Último login: {new Date(user.last_login).toLocaleString('pt-BR')}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
