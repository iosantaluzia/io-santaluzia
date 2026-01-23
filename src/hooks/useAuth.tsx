import { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface AppUser {
  id: string;
  username: string;
  role: 'admin' | 'doctor' | 'secretary';
  approved: boolean;
  auth_user_id: string | null;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  appUser: AppUser | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    appUser: null,
    loading: true,
    error: null
  });

  // Cache para evitar múltiplas chamadas desnecessárias
  const appUserCache = useRef<{ [key: string]: AppUser | null }>({});
  const fetchingAppUser = useRef<{ [key: string]: Promise<void> }>({});

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener - NUNCA usar async aqui para evitar deadlock
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        // Apenas atualizações síncronas de estado aqui
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          error: null
        }));

        // Diferir chamadas ao Supabase usando setTimeout para evitar deadlock
        if (session?.user) {
          setTimeout(() => {
            if (mounted) {
              fetchAppUserSafely(session.user.id);
            }
          }, 0);
        } else {
          setTimeout(() => {
            if (mounted) {
              setAuthState(prev => ({
                ...prev,
                appUser: null,
                loading: false,
                error: null
              }));
            }
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;

      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        error: null
      }));

      if (session?.user) {
        fetchAppUserSafely(session.user.id);
      } else {
        if (mounted) {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      // Limpar cache e requests pendentes
      appUserCache.current = {};
      fetchingAppUser.current = {};
    };
  }, []);

  const fetchAppUserSafely = async (authUserId: string) => {
    // Verificar cache primeiro
    if (appUserCache.current[authUserId] !== undefined) {
      setAuthState(prev => ({
        ...prev,
        appUser: appUserCache.current[authUserId],
        loading: false,
        error: null
      }));
      return;
    }

    // Verificar se já está buscando para este usuário
    if (fetchingAppUser.current[authUserId]) {
      try {
        await fetchingAppUser.current[authUserId];
      } catch (error) {
        // Ignorar erro de fetch em progresso
      }
      return;
    }

    // Criar promessa de fetch
    fetchingAppUser.current[authUserId] = fetchAppUser(authUserId);
    
    try {
      await fetchingAppUser.current[authUserId];
    } finally {
      delete fetchingAppUser.current[authUserId];
    }
  };

  const fetchAppUser = async (authUserId: string) => {
    try {
      // Timeout reduzido para 3 segundos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 3000);
      });

      const queryPromise = supabase
        .from('app_users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .maybeSingle();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (error) {
        logger.error('Error fetching app user:', error);
        appUserCache.current[authUserId] = null;
        setAuthState(prev => ({
          ...prev,
          appUser: null,
          loading: false,
          error: 'Erro ao carregar dados do usuário'
        }));
        return;
      }

      if (!data) {
        appUserCache.current[authUserId] = null;
        setAuthState(prev => ({
          ...prev,
          appUser: null,
          loading: false,
          error: 'Sua conta não está vinculada ao sistema'
        }));
        return;
      }

      // Cache do resultado
      appUserCache.current[authUserId] = data;
      setAuthState(prev => ({
        ...prev,
        appUser: data,
        loading: false,
        error: null
      }));
    } catch (error) {
      logger.error('Error in fetchAppUser:', error);
      
      appUserCache.current[authUserId] = null;
      
      if (error instanceof Error && error.message === 'Timeout') {
        setAuthState(prev => ({
          ...prev,
          appUser: null,
          loading: false,
          error: 'Timeout ao carregar dados - tente novamente'
        }));
      } else {
        setAuthState(prev => ({
          ...prev,
          appUser: null,
          loading: false,
          error: 'Erro inesperado ao carregar dados'
        }));
      }
    }
  };

  const signInWithUsername = async (username: string, password: string) => {
    try {
      // SECURITY NOTE: Email mapping is hardcoded but non-sensitive
      // TODO: Consider moving this mapping to database for better maintainability
      // This mapping is safe as it only contains public email addresses, not passwords or secrets
      const emailMap: Record<string, string> = {
        'matheus': 'matheus@iosantaluzia.com',
        'fabiola': 'fabiola@iosantaluzia.com',
        'secretaria': 'secretaria@iosantaluzia.com',
        'financeiro': 'financeiro@iosantaluzia.com'
      };

      const email = emailMap[username.toLowerCase()];
      if (!email) {
        return { data: null, error: { message: 'Usuário não encontrado' } };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        logger.error('Login error:', error);
        return { data, error };
      }

      if (data.user) {
        // Update last login - usar setTimeout para não bloquear o fluxo de login
        setTimeout(async () => {
          try {
            const { error: updateError } = await supabase
              .from('app_users')
              .update({ last_login: new Date().toISOString() })
              .eq('auth_user_id', data.user.id);
            
            if (updateError) {
              logger.error('Failed to update last login:', updateError);
              console.error('Erro ao atualizar último login:', updateError);
            } else {
              logger.log('Last login updated successfully for user:', data.user.id);
            }
          } catch (updateError) {
            logger.error('Exception updating last login:', updateError);
            console.error('Exceção ao atualizar último login:', updateError);
          }
        }, 100);
      }

      return { data, error: null };
    } catch (error) {
      logger.error('Error in signInWithUsername:', error);
      return { data: null, error: { message: 'Erro inesperado' } };
    }
  };

  const signOut = async () => {
    // Limpar cache antes do logout
    appUserCache.current = {};
    fetchingAppUser.current = {};
    
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setAuthState({
        user: null,
        session: null,
        appUser: null,
        loading: false,
        error: null
      });
    }
    return { error };
  };

  const retry = () => {
    if (authState.user) {
      // Limpar cache para forçar nova busca
      delete appUserCache.current[authState.user.id];
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      fetchAppUserSafely(authState.user.id);
    }
  };

  return {
    ...authState,
    signInWithUsername,
    signOut,
    retry,
    isAuthenticated: !!authState.user && !!authState.appUser && authState.appUser.approved
  };
}
