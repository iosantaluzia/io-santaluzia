
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

export function useEmails() {
  const queryClient = useQueryClient();

  // Buscar emails
  const { data: emails = [], isLoading, error } = useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .order('date_received', { ascending: false });

      if (error) throw error;
      return data as Email[];
    },
  });

  // Sincronizar emails
  const syncEmailsMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('email-sync');
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast.success(`Sincronização concluída. ${data.new} novos emails.`);
    },
    onError: (error) => {
      console.error('Error syncing emails:', error);
      toast.error('Erro ao sincronizar emails');
    },
  });

  // Enviar email
  const sendEmailMutation = useMutation({
    mutationFn: async (emailData: EmailDraft) => {
      const { data, error } = await supabase.functions.invoke('email-send', {
        body: {
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

  // Marcar como lido
  const markAsReadMutation = useMutation({
    mutationFn: async (emailId: string) => {
      const { error } = await supabase
        .from('emails')
        .update({ is_read: true })
        .eq('id', emailId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });

  // Marcar como favorito
  const toggleStarMutation = useMutation({
    mutationFn: async ({ emailId, isStarred }: { emailId: string; isStarred: boolean }) => {
      const { error } = await supabase
        .from('emails')
        .update({ is_starred: !isStarred })
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
    syncEmails: syncEmailsMutation.mutate,
    isSyncing: syncEmailsMutation.isPending,
    sendEmail: sendEmailMutation.mutate,
    isSending: sendEmailMutation.isPending,
    markAsRead: markAsReadMutation.mutate,
    toggleStar: toggleStarMutation.mutate,
  };
}
