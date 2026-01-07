import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

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

// ⚠️ SECURITY WARNING: This local auth system is DEPRECATED and less secure than Supabase Auth
// 
// RISKS:
// - Passwords stored in localStorage are vulnerable to XSS attacks
// - No server-side validation
// - No session management
// - No password hashing
//
// RECOMMENDATION: 
// - Use only Supabase Auth (useAuth.tsx) for production
// - This hook should be removed in future versions
// - If still needed, ensure VITE_LOCAL_AUTH_PASSWORD is set in environment

const VALID_PASSWORD = import.meta.env.VITE_LOCAL_AUTH_PASSWORD || '';

if (!VALID_PASSWORD && import.meta.env.PROD) {
  logger.warn('⚠️ VITE_LOCAL_AUTH_PASSWORD not set. Local auth will not work in production.');
}

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
      // SECURITY FIX: Validate password exists and matches
      if (!VALID_PASSWORD || password !== VALID_PASSWORD) {
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

      logger.log('Login successful (local auth):', { username: userData.username, role: userData.role });
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
