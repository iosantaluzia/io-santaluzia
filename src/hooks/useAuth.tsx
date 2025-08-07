
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          error: null
        }));

        if (session?.user) {
          await fetchAppUser(session.user.id);
        } else {
          if (mounted) {
            setAuthState(prev => ({
              ...prev,
              appUser: null,
              loading: false,
              error: null
            }));
          }
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
        fetchAppUser(session.user.id);
      } else {
        if (mounted) {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchAppUser = async (authUserId: string) => {
    const startTime = Date.now();
    console.log('Fetching app user for auth_user_id:', authUserId, 'at', new Date().toISOString());
    
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 8000);
      });

      // Create the query promise
      const queryPromise = supabase
        .from('app_users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no data found

      // Race between timeout and query
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      const elapsedTime = Date.now() - startTime;
      console.log('App user query completed in', elapsedTime, 'ms');

      if (error) {
        console.error('Error fetching app user:', error);
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
        setAuthState(prev => ({
          ...prev,
          appUser: null,
          loading: false,
          error: 'Sua conta não está vinculada ao sistema'
        }));
        return;
      }

      setAuthState(prev => ({
        ...prev,
        appUser: data,
        loading: false,
        error: null
      }));
    } catch (error) {
      const elapsedTime = Date.now() - startTime;
      console.error('Error in fetchAppUser after', elapsedTime, 'ms:', error);
      
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
      
      // Mapear username para email
      const emailMap: Record<string, string> = {
        'matheus': 'matheus@iosantaluzia.com',
        'fabiola': 'fabiola@iosantaluzia.com',
        'iosantaluzia': 'iosantaluzia@iosantaluzia.com'
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
        
        // Update last login
        setTimeout(async () => {
          await supabase
            .from('app_users')
            .update({ last_login: new Date().toISOString() })
            .eq('auth_user_id', data.user.id);
        }, 0);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error in signInWithUsername:', error);
      return { data: null, error: { message: 'Erro inesperado' } };
    }
  };

  const signOut = async () => {
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
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      fetchAppUser(authState.user.id);
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
