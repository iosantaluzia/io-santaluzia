
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function UserAuthSetup() {
  const [isCreating, setIsCreating] = useState(false);
  const [password, setPassword] = useState('');

  const createFinanceiroAuth = async () => {
    if (!password) {
      toast.error('Digite uma senha para o usuário financeiro');
      return;
    }

    setIsCreating(true);
    try {
      // Primeiro, chamar a função para verificar se pode criar o usuário
      const { data: funcData, error: funcError } = await supabase.rpc(
        'create_auth_user_if_needed',
        { username_param: 'financeiro', password_param: password }
      );

      if (funcError) {
        console.error('Erro na função:', funcError);
        toast.error('Erro ao verificar usuário');
        return;
      }

      if (!funcData || funcData.length === 0) {
        toast.error('Usuário financeiro não encontrado na tabela app_users');
        return;
      }

      const userData = funcData[0];
      if (!userData.success) {
        toast.error('Não foi possível criar o usuário');
        return;
      }

      // Criar o usuário de autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: password,
        options: {
          data: {
            username: 'financeiro'
          }
        }
      });

      if (authError) {
        console.error('Erro ao criar autenticação:', authError);
        toast.error('Erro ao criar usuário de autenticação: ' + authError.message);
        return;
      }

      if (authData.user) {
        // Atualizar o app_user com o auth_user_id
        const { error: updateError } = await supabase
          .from('app_users')
          .update({ auth_user_id: authData.user.id })
          .eq('username', 'financeiro');

        if (updateError) {
          console.error('Erro ao vincular usuário:', updateError);
          toast.error('Erro ao vincular usuário');
          return;
        }

        toast.success('Usuário financeiro criado com sucesso!');
        setPassword('');
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error('Erro inesperado ao criar usuário');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Configurar Usuário Financeiro</CardTitle>
        <CardDescription>
          Criar conta de autenticação para o usuário financeiro
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Senha para financeiro@iosantaluzia.com
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha"
          />
        </div>
        <Button 
          onClick={createFinanceiroAuth}
          disabled={isCreating || !password}
          className="w-full"
        >
          {isCreating ? 'Criando...' : 'Criar Usuário de Autenticação'}
        </Button>
      </CardContent>
    </Card>
  );
}
