
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Email {
  id: string;
  message_id: string;
  subject: string;
  from_email: string;
  from_name?: string;
  to_email: string;
  to_name?: string;
  cc_emails?: string[];
  bcc_emails?: string[];
  content_text?: string;
  content_html?: string;
  date_received: string;
  date_sent?: string;
  is_read: boolean;
  is_starred: boolean;
  folder: string;
  has_attachments: boolean;
  size_bytes?: number;
}

export interface EmailDraft {
  id?: string;
  to_email: string;
  cc_emails?: string[];
  bcc_emails?: string[];
  subject: string;
  content_html?: string;
  content_text?: string;
  reply_to_email_id?: string;
}

// Hook para obter informações do usuário atual
function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Buscar dados do app_user
        const { data: appUser } = await supabase
          .from('app_users')
          .select('*')
          .eq('auth_user_id', user.id)
          .single();
        
        setCurrentUser(appUser);
      }
    };

    getCurrentUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getCurrentUser();
    });

    return () => subscription.unsubscribe();
  }, []);

  return currentUser;
}

export function useEmails() {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  // SECURITY: Email account should come from environment variable or database
  // Using environment variable for better security and maintainability
  const getEmailAccount = () => {
    return import.meta.env.VITE_EMAIL_ACCOUNT || 'financeiro@iosantaluzia.com.br';
  };

  // Buscar emails diretamente do banco de dados com filtros baseados no usuário
  const { data: emails = [], isLoading, error } = useQuery({
    queryKey: ['emails', currentUser?.username],
    queryFn: async () => {
      console.log('Buscando emails do banco de dados...');
      
      // Use explicit typing to avoid TypeScript errors with the missing types
      const { data, error } = await (supabase as any)
        .from('emails')
        .select('*')
        .order('date_received', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar emails:', error);
        throw error;
      }
      
      let filteredEmails = (data || []) as Email[];
      
      // Filtrar emails baseado no tipo de usuário
      if (currentUser?.username === 'financeiro') {
        // Usuário financeiro vê apenas emails da conta financeiro@iosantaluzia.com.br
        filteredEmails = filteredEmails.filter((email: Email) => 
          email.to_email === 'financeiro@iosantaluzia.com.br' ||
          email.from_email === 'financeiro@iosantaluzia.com.br'
        );
        console.log(`Usuário financeiro: ${filteredEmails.length} emails filtrados`);
      } else if (currentUser?.role === 'doctor') {
        // Médicos não veem emails financeiros
        filteredEmails = filteredEmails.filter((email: Email) => 
          email.to_email !== 'financeiro@iosantaluzia.com.br' &&
          email.from_email !== 'financeiro@iosantaluzia.com.br'
        );
        console.log(`Médico: ${filteredEmails.length} emails filtrados (sem financeiros)`);
      }
      // Secretárias (role: secretary) veem TODOS os emails - incluindo os financeiros
      else {
        console.log(`Secretária/Admin: ${filteredEmails.length} emails (todos)`);
      }
      
      return filteredEmails;
    },
    enabled: !!currentUser, // Só executa quando o usuário estiver carregado
  });

  // Sincronizar emails via Edge Function
  const syncEmailsMutation = useMutation({
    mutationFn: async () => {
      console.log('Iniciando sincronização via Edge Function...');
      const emailAccount = getEmailAccount();
      const { data, error } = await supabase.functions.invoke('email-sync', {
        body: { emailAccount }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast.success(`Sincronização concluída. ${data.new || 0} novos emails.`);
    },
    onError: (error) => {
      console.error('Error syncing emails:', error);
      toast.error('Erro ao sincronizar emails');
    },
  });

  // Enviar email
  const sendEmailMutation = useMutation({
    mutationFn: async (emailData: EmailDraft) => {
      const fromEmail = getEmailAccount();
      const { data, error } = await supabase.functions.invoke('email-send', {
        body: {
          from: fromEmail,
          to: emailData.to_email,
          cc: emailData.cc_emails,
          bcc: emailData.bcc_emails,
          subject: emailData.subject,
          content: emailData.content_html || emailData.content_text || '',
          replyToEmailId: emailData.reply_to_email_id,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast.success('Email enviado com sucesso!');
    },
    onError: (error) => {
      console.error('Error sending email:', error);
      toast.error('Erro ao enviar email');
    },
  });

  // Marcar como lido (direto no banco)
  const markAsReadMutation = useMutation({
    mutationFn: async (emailId: string) => {
      const { error } = await (supabase as any)
        .from('emails')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', emailId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });

  // Marcar como favorito (direto no banco)
  const toggleStarMutation = useMutation({
    mutationFn: async ({ emailId, isStarred }: { emailId: string; isStarred: boolean }) => {
      const { error } = await (supabase as any)
        .from('emails')
        .update({ is_starred: !isStarred, updated_at: new Date().toISOString() })
        .eq('id', emailId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });

  return {
    emails,
    isLoading,
    error,
    currentUser,
    emailAccount: getEmailAccount(),
    syncEmails: syncEmailsMutation.mutate,
    isSyncing: syncEmailsMutation.isPending,
    sendEmail: sendEmailMutation.mutate,
    isSending: sendEmailMutation.isPending,
    markAsRead: markAsReadMutation.mutate,
    toggleStar: toggleStarMutation.mutate,
  };
}
