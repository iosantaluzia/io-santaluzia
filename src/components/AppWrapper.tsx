import { useKeepSupabaseAlive } from '@/hooks/useKeepSupabaseAlive';
import { useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';

interface AppWrapperProps {
  children: React.ReactNode;
}

const AppWrapper = ({ children }: AppWrapperProps) => {
  // Mantém o Supabase ativo quando usuários acessam o site
  useKeepSupabaseAlive();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Manage body background transparency - ONLY for Home Page
  React.useEffect(() => {
    if (isHomePage) {
      document.body.classList.add('bg-transparent');
      // Forcing style just in case class is overridden
      document.body.style.backgroundColor = 'transparent';
    } else {
      document.body.classList.remove('bg-transparent');
      document.body.style.backgroundColor = '';
    }

    return () => {
      document.body.classList.remove('bg-transparent');
      document.body.style.backgroundColor = '';
    };
  }, [isHomePage]);

  return (
    <>
      {isHomePage && (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
          <img
            src="/dashboard/background.png"
            alt="Background"
            className="w-full h-full object-cover opacity-60 mix-blend-multiply filter blur-3xl scale-110"
          />
        </div>
      )}
      {children}
    </>
  );
};

export default AppWrapper;
