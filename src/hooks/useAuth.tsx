
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
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    appUser: null,
    loading: true
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null
        }));

        if (session?.user) {
          await fetchAppUser(session.user.id);
        } else {
          setAuthState(prev => ({
            ...prev,
            appUser: null,
            loading: false
          }));
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      
      setAuthState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null
      }));

      if (session?.user) {
        fetchAppUser(session.user.id);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAppUser = async (authUserId: string) => {
    try {
      console.log('Fetching app user for auth_user_id:', authUserId);
      
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (error) {
        console.error('Error fetching app user:', error);
        if (error.code !== 'PGRST116') {
          console.error('Unexpected error:', error);
        }
      }

      console.log('App user data:', data);

      setAuthState(prev => ({
        ...prev,
        appUser: data || null,
        loading: false
      }));
    } catch (error) {
      console.error('Error in fetchAppUser:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
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
    return { error };
  };

  return {
    ...authState,
    signInWithUsername,
    signOut,
    isAuthenticated: !!authState.user && !!authState.appUser && authState.appUser.approved
  };
}
