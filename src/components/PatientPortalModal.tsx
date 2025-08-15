
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PatientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PatientPortalModal = ({ isOpen, onClose }: PatientPortalModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    cpf: ''
  });

  const { signInWithUsername } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(''); // Clear error when user starts typing
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', formData.email);
      
      const { data, error } = await signInWithUsername(formData.email, formData.password);
      
      if (error) {
        console.error('Login error:', error);
        setError('Email/username ou senha incorretos');
        toast.error('Erro ao fazer login: ' + error.message);
        return;
      }

      if (data?.user) {
        console.log('Login successful, redirecting to portal');
        toast.success('Login realizado com sucesso!');
        onClose();
        // Small delay to ensure modal closes before navigation
        setTimeout(() => {
          navigate('/portal-paciente');
        }, 100);
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      setError('Erro inesperado ao fazer login');
      toast.error('Erro inesperado ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      toast.error('As senhas não coincidem');
      return;
    }

    toast.info('Funcionalidade de cadastro será implementada em breve');
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      cpf: ''
    });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-medical-primary">
            {isLogin ? 'Acesso ao Portal do Paciente' : 'Cadastro de Paciente'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  type="text"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  required={!isLogin}
                  placeholder="000.000.000-00"
                  className="mt-1"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email">
              {isLogin ? 'Email ou Username' : 'Email'}
            </Label>
            <Input
              id="email"
              name="email"
              type={isLogin ? 'text' : 'email'}
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder={isLogin ? 'Digite seu email ou username' : 'seu@email.com'}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required={!isLogin}
                className="mt-1"
              />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-medical-primary hover:bg-medical-primary/90 transition-colors"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-medical-secondary hover:text-medical-primary transition-colors underline"
            >
              {isLogin 
                ? 'Não tem conta? Cadastre-se aqui'
                : 'Já tem conta? Faça login aqui'
              }
            </button>
          </div>

          {isLogin && (
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-medical-primary transition-colors underline"
              >
                Esqueceu sua senha?
              </button>
            </div>
          )}
        </form>

        {isLogin && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700">
              <strong>Para teste:</strong> Use os mesmos logins do painel administrativo
            </p>
            <div className="text-xs text-blue-600 mt-1">
              • Username: <code>matheus</code> ou <code>fabiola</code><br/>
              • Senha: <code>123456</code>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PatientPortalModal;
