
import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface LoginFormProps {
  onLogin: (username: string, role: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock users - in real app this would come from Supabase
  const mockUsers = {
    'matheus': { password: 'iosantaluzia', role: 'doctor', approved: true },
    'fabiola': { password: 'iosantaluzia', role: 'doctor', approved: true },
    'iosantaluzia': { password: 'iosantaluzia', role: 'secretary', approved: true }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock authentication - replace with Supabase auth
      const user = mockUsers[username.toLowerCase() as keyof typeof mockUsers];
      
      if (!user) {
        toast.error('Usuário não encontrado');
        return;
      }

      if (user.password !== password) {
        toast.error('Senha incorreta');
        return;
      }

      if (!user.approved) {
        toast.error('Usuário aguardando aprovação');
        return;
      }

      toast.success(`Bem-vindo, ${username}!`);
      onLogin(username, user.role);
    } catch (error) {
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <img 
            src="/lovable-uploads/e187619e-2328-418d-971f-86200b2bb552.png" 
            alt="Instituto de Olhos Santa Luzia" 
            className="h-16 w-16 object-contain mx-auto mb-4" 
          />
          <h2 className="text-3xl font-bold text-cinza-escuro">Admin Panel</h2>
          <p className="text-gray-600 mt-2">Instituto de Olhos Santa Luzia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username">Usuário</Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="pl-10"
                placeholder="Digite seu usuário"
              />
              <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 pr-10"
                placeholder="Digite sua senha"
                maxLength={8}
              />
              <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-bege-principal hover:bg-marrom-acentuado"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600">
          <p>Usuários de demonstração:</p>
          <p>matheus, fabiola, iosantaluzia</p>
          <p>Senha: iosantaluzia</p>
        </div>
      </div>
    </div>
  );
}
