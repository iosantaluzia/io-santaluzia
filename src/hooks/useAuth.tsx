import { useState, useEffect, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface AppUser {
  id: string;
  username: string;
  role: 'admin' | 'doctor' | 'secretary' | 'financeiro';
  approved: boolean;
  auth_user_id: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
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
      // Timeout aumentado para 10 segundos para evitar falsos positivos
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 10000);
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
      appUserCache.current[authUserId] = data as unknown as AppUser;
      setAuthState(prev => ({
        ...prev,
        appUser: data as unknown as AppUser,
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

  const signInWithUsername = async (identifier: string, password_or_dob: string) => {
    try {
      // 1. Check if it's a staff member in app_users
      const { data: staffUser, error: staffError } = await supabase
        .from('app_users')
        .select('username, role')
        .eq('username', identifier.toLowerCase())
        .maybeSingle();

      if (staffUser && staffUser.role !== 'patient' as any) {
        const staffEmail = `${staffUser.username}@iosantaluzia.com.br`;
        return await supabase.auth.signInWithPassword({
          email: staffEmail,
          password: password_or_dob
        });
      }

      // Fallback para mapeamento fixo caso app_users falhe ou seja legado
      const legacyEmailMap: Record<string, string> = {
        'matheus': 'matheus@iosantaluzia.com.br',
        'fabiola': 'fabiola@iosantaluzia.com.br',
        'secretaria': 'secretaria@iosantaluzia.com.br',
        'financeiro': 'financeiro@iosantaluzia.com.br'
      };

      const legacyEmail = legacyEmailMap[identifier.toLowerCase()];
      if (legacyEmail) {
        return await supabase.auth.signInWithPassword({
          email: legacyEmail,
          password: password_or_dob
        });
      }

      // 2. Patient check
      const cleanIdentifier = identifier.trim();
      const cleanCPF = cleanIdentifier.replace(/\D/g, '');

      // Encontrar paciente por CPF ou Email
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .or(`cpf.eq."${cleanIdentifier}",cpf.eq."${cleanCPF}",email.eq."${cleanIdentifier}"`)
        .maybeSingle();

      if (patientError) {
        logger.error('Error searching patient:', patientError);
        return { data: null, error: { message: 'Erro ao buscar dados do paciente' } };
      }

      if (!patient) {
        return { data: null, error: { message: 'Paciente não encontrado em nossa base de dados' } };
      }

      // Validar data de nascimento (que é a senha)
      // Formato esperado: dd/mm/aa
      const parts = password_or_dob.split('/');
      if (parts.length !== 3) {
        return { data: null, error: { message: 'Formato de data de nascimento inválido (use dd/mm/aa)' } };
      }

      let [day, month, year] = parts;
      if (year.length === 2) {
        const yearNum = parseInt(year);
        year = yearNum > 30 ? `19${year}` : `20${year}`;
      }
      const formattedDOB = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      if (patient.date_of_birth !== formattedDOB) {
        return { data: null, error: { message: 'Data de nascimento incorreta para este CPF/Email' } };
      }

      // Paciente validado! Agora vamos autenticar no Supabase Auth
      // Usamos um email sintético: cpf@paciente.iosantaluzia.com.br
      const syntheticEmail = `${patient.cpf.replace(/\D/g, '')}@paciente.iosantaluzia.com.br`;

      // Tenta login
      let loginResult = await supabase.auth.signInWithPassword({
        email: syntheticEmail,
        password: password_or_dob
      });

      if (loginResult.error) {
        // Se falhou por credenciais inválidas, pode ser que o usuário auth ainda não exista
        if (loginResult.error.message.toLowerCase().includes('invalid login credentials')) {
          logger.log('Auth user not found for patient, creating default account...');

          // Criar usuário auth
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: syntheticEmail,
            password: password_or_dob,
            options: {
              data: {
                username: patient.name,
                full_name: patient.name,
                role: 'patient',
                patient_id: patient.id
              }
            }
          });

          if (signUpError) {
            logger.error('Error creating patient auth:', signUpError);
            return { data: null, error: signUpError };
          }

          if (signUpData.user) {
            // Garantir que app_users existe para este paciente
            // Como é um paciente, vamos criar com role 'patient' (mesmo não estando no enum base, o portal aceita)
            const { error: appUserError } = await supabase
              .from('app_users')
              .upsert({
                auth_user_id: signUpData.user.id,
                username: patient.cpf,
                role: 'patient' as any,
                approved: true,
                created_by: 'system'
              });

            if (appUserError) {
              logger.error('Error creating app_user for patient:', appUserError);
            }

            // Tenta login novamente após o cadastro
            loginResult = await supabase.auth.signInWithPassword({
              email: syntheticEmail,
              password: password_or_dob
            });
          }
        }
      }

      return loginResult;
    } catch (error) {
      logger.error('Error in signInWithUsername:', error);
      return { data: null, error: { message: 'Erro inesperado no sistema' } };
    }
  };

  const signOut = async () => {
    try {
      // Limpar cache antes do logout
      appUserCache.current = {};
      fetchingAppUser.current = {};

      // Fazer logout do Supabase
      const { error } = await supabase.auth.signOut();

      // Limpar estado local independente de erro
      setAuthState({
        user: null,
        session: null,
        appUser: null,
        loading: false,
        error: null
      });

      // Limpar localStorage do Supabase explicitamente
      // O Supabase armazena a sessão em localStorage com chaves específicas
      const supabaseStorageKeys = Object.keys(localStorage).filter(key =>
        key.startsWith('sb-') ||
        key.includes('supabase.auth')
      );
      supabaseStorageKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn('Erro ao limpar localStorage:', key, e);
        }
      });

      return { error };
    } catch (error) {
      console.error('Erro no signOut:', error);
      // Mesmo em caso de erro, limpar o estado
      setAuthState({
        user: null,
        session: null,
        appUser: null,
        loading: false,
        error: null
      });
      return { error: error as Error };
    }
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
