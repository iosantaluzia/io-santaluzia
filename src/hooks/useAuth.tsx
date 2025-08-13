import { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
        console.log('Auth state changed:', event, session?.user?.email);
        
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
      console.log('Initial session check:', session?.user?.email);
      
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
    console.log('fetchAppUserSafely called for:', authUserId);

    // Verificar cache primeiro
    if (appUserCache.current[authUserId] !== undefined) {
      console.log('Using cached app user data');
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
      console.log('Already fetching app user, waiting...');
      try {
        await fetchingAppUser.current[authUserId];
      } catch (error) {
        console.log('Fetch in progress failed:', error);
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
    const startTime = Date.now();
    console.log('Fetching app user for auth_user_id:', authUserId, 'at', new Date().toISOString());
    
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

      const elapsedTime = Date.now() - startTime;
      console.log('App user query completed in', elapsedTime, 'ms');

      if (error) {
        console.error('Error fetching app user:', error);
        appUserCache.current[authUserId] = null;
        setAuthState(prev => ({
          ...prev,
          appUser: null,
          loading: false,
          error: 'Erro ao carregar dados do usuário'
        }));
        return;
      }

      console.log('App user data:', data);

      if (!data) {
        console.log('No app user found for this auth user');
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
      const elapsedTime = Date.now() - startTime;
      console.error('Error in fetchAppUser after', elapsedTime, 'ms:', error);
      
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
      console.log('Attempting login with username:', username);
      
      // Mapear username para email - INCLUINDO o usuário financeiro
      const emailMap: Record<string, string> = {
        'matheus': 'matheus@iosantaluzia.com',
        'fabiola': 'fabiola@iosantaluzia.com',
        'iosantaluzia': 'iosantaluzia@iosantaluzia.com',
        'financeiro': 'financeiro@iosantaluzia.com'
      };

      const email = emailMap[username.toLowerCase()];
      if (!email) {
        return { data: null, error: { message: 'Usuário não encontrado' } };
      }

      console.log('Login attempt with email:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return { data, error };
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.email);
        
        // Update last login - usar setTimeout para não bloquear
        setTimeout(async () => {
          try {
            await supabase
              .from('app_users')
              .update({ last_login: new Date().toISOString() })
              .eq('auth_user_id', data.user.id);
          } catch (updateError) {
            console.log('Failed to update last login:', updateError);
          }
        }, 100);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in signInWithUsername:', error);
      return { data: null, error: { message: 'Erro inesperado' } };
    }
  };

  const signOut = async () => {
    console.log('Signing out...');
    
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
    console.log('Retrying auth...');
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
