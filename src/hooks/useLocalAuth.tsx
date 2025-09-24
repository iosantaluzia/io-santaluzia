import { useState, useEffect } from 'react';

interface LocalUser {
  username: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: LocalUser | null;
  loading: boolean;
  error: string | null;
}

const VALID_USERS = [
  { username: 'matheus', role: 'admin' },
  { username: 'fabiola', role: 'doctor' },
  { username: 'thauanne', role: 'secretary' },
  { username: 'beatriz', role: 'secretary' }
];

const VALID_PASSWORD = 'iosantaluzia';

export function useLocalAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  });

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('admin-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null
        });
      } catch (error) {
        localStorage.removeItem('admin-user');
      }
    }
  }, []);

  const signIn = async (username: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      if (password !== VALID_PASSWORD) {
        throw new Error('Senha incorreta');
      }

      const user = VALID_USERS.find(u => u.username.toLowerCase() === username.toLowerCase());
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const userData = {
        username: user.username,
        role: user.role
      };

      localStorage.setItem('admin-user', JSON.stringify(userData));
      
      setAuthState({
        isAuthenticated: true,
        user: userData,
        loading: false,
        error: null
      });

      return { data: { user: userData }, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: errorMessage
      });
      return { data: null, error: { message: errorMessage } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('admin-user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
  };

  return {
    ...authState,
    signIn,
    signOut,
    appUser: authState.user
  };
}
