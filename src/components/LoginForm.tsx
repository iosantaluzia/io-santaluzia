
import React, { useState } from 'react';
import { Eye, EyeOff, User, Lock, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onLogin: (username: string, role: string) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const { signIn, signUp, appUser, user } = useAuth();

  // If user is authenticated and has approved app user, auto login
  React.useEffect(() => {
    if (user && appUser && appUser.approved) {
      onLogin(appUser.username, appUser.role);
    } else if (user && appUser && !appUser.approved) {
      toast.error('Usuário aguardando aprovação');
    }
  }, [user, appUser, onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, username);
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Email já cadastrado');
          } else {
            toast.error('Erro ao criar conta: ' + error.message);
          }
          return;
        }

        toast.success('Conta criada! Verifique seu email e faça login.');
        setIsSignUp(false);
        setEmail('');
        setPassword('');
        setUsername('');
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou senha incorretos');
          } else {
            toast.error('Erro ao fazer login: ' + error.message);
          }
          return;
        }

        // Success will be handled by useEffect above
      }
    } catch (error) {
      toast.error('Erro inesperado');
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
          <h2 className="text-3xl font-bold text-cinza-escuro">
            {isSignUp ? 'Criar Conta' : 'Admin Panel'}
          </h2>
          <p className="text-gray-600 mt-2">Instituto de Olhos Santa Luzia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <Label htmlFor="username">Nome de Usuário</Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10"
                  placeholder="Digite seu nome de usuário"
                  maxLength={20}
                />
                <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
                placeholder="Digite seu email"
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
            {loading ? 'Processando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
          </Button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-bege-principal hover:text-marrom-acentuado text-sm font-medium"
          >
            {isSignUp ? 'Já tem conta? Fazer login' : 'Não tem conta? Criar uma'}
          </button>
        </div>

        <div className="text-center text-sm text-gray-600 space-y-1">
          <p><strong>Usuários pré-cadastrados:</strong></p>
          <p>matheus@iosantaluzia.com (Médico)</p>
          <p>fabiola@iosantaluzia.com (Médica)</p>
          <p>iosantaluzia@iosantaluzia.com (Secretária)</p>
          <p className="text-xs mt-2">Todos com senha: <strong>iosantaluzia</strong></p>
        </div>
      </div>
    </div>
  );
}
