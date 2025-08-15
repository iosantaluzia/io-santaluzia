
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PatientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PatientPortalModal = ({ isOpen, onClose }: PatientPortalModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Para teste, usar os mesmos logins do admin
      const { data, error } = await signInWithUsername(formData.email, formData.password);
      
      if (error) {
        toast.error('Erro ao fazer login: ' + error.message);
        return;
      }

      if (data?.user) {
        toast.success('Login realizado com sucesso!');
        onClose();
        navigate('/portal-paciente');
      }
    } catch (error) {
      toast.error('Erro inesperado ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
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
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-medical-primary">
            {isLogin ? 'Acesso ao Portal do Paciente' : 'Cadastro de Paciente'}
          </DialogTitle>
        </DialogHeader>

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
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
              />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-medical-primary hover:bg-medical-primary/90"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-medical-secondary hover:text-medical-primary transition-colors"
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
                className="text-sm text-gray-500 hover:text-medical-primary transition-colors"
              >
                Esqueceu sua senha?
              </button>
            </div>
          )}
        </form>

        {isLogin && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Para teste:</strong> Use os mesmos logins do painel administrativo
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PatientPortalModal;
