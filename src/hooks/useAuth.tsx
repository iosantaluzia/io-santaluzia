
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null
        }));

        if (session?.user) {
          // Fetch app user data after auth state change
          setTimeout(async () => {
            await fetchAppUser(session.user.id);
          }, 0);
        } else {
          setAuthState(prev => ({
            ...prev,
            appUser: null,
            loading: false
          }));
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
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
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching app user:', error);
      }

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

  const signUp = async (email: string, password: string, username: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username: username.toLowerCase()
        }
      }
    });

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (!error && data.user) {
      // Update last login
      setTimeout(async () => {
        await supabase
          .from('app_users')
          .update({ last_login: new Date().toISOString() })
          .eq('auth_user_id', data.user.id);
      }, 0);
    }

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!authState.user && !!authState.appUser && authState.appUser.approved
  };
}
