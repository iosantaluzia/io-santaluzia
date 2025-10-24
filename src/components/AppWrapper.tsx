import { useKeepSupabaseAlive } from '@/hooks/useKeepSupabaseAlive';

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper = ({ children }: AppWrapperProps) => {
  // Mantém o Supabase ativo quando usuários acessam o site
  useKeepSupabaseAlive();
  
  return <>{children}</>;
};

export default AppWrapper;
