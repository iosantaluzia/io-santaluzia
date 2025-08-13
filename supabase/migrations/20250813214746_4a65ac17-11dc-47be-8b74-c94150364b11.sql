
-- Criar tabela para armazenar emails
CREATE TABLE public.emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  to_name TEXT,
  cc_emails TEXT[],
  bcc_emails TEXT[],
  content_text TEXT,
  content_html TEXT,
  date_received TIMESTAMP WITH TIME ZONE NOT NULL,
  date_sent TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN NOT NULL DEFAULT false,
  is_starred BOOLEAN NOT NULL DEFAULT false,
  folder TEXT NOT NULL DEFAULT 'inbox',
  has_attachments BOOLEAN NOT NULL DEFAULT false,
  size_bytes INTEGER,
  flags TEXT[],
  in_reply_to TEXT,
  references TEXT[],
  raw_headers JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para anexos de email
CREATE TABLE public.email_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_id UUID NOT NULL REFERENCES public.emails(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  content_type TEXT,
  size_bytes INTEGER,
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para rascunhos de email
CREATE TABLE public.email_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  cc_emails TEXT[],
  bcc_emails TEXT[],
  subject TEXT NOT NULL,
  content_html TEXT,
  content_text TEXT,
  reply_to_email_id UUID REFERENCES public.emails(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_drafts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para emails - permitir acesso autenticado
CREATE POLICY "Allow authenticated users to view emails" 
ON public.emails FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update emails" 
ON public.emails FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert emails" 
ON public.emails FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Políticas RLS para anexos
CREATE POLICY "Allow authenticated users to view email_attachments" 
ON public.email_attachments FOR SELECT 
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert email_attachments" 
ON public.email_attachments FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Políticas RLS para rascunhos - apenas o próprio usuário
CREATE POLICY "Users can view their own drafts" 
ON public.email_drafts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drafts" 
ON public.email_drafts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts" 
ON public.email_drafts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts" 
ON public.email_drafts FOR DELETE 
USING (auth.uid() = user_id);

-- Criar usuário financeiro
INSERT INTO public.app_users (username, role, approved, created_by) 
VALUES ('financeiro', 'secretary', true, 'admin');

-- Criar índices para performance
CREATE INDEX idx_emails_date_received ON public.emails(date_received DESC);
CREATE INDEX idx_emails_folder ON public.emails(folder);
CREATE INDEX idx_emails_is_read ON public.emails(is_read);
CREATE INDEX idx_emails_is_starred ON public.emails(is_starred);
CREATE INDEX idx_emails_message_id ON public.emails(message_id);
CREATE INDEX idx_email_attachments_email_id ON public.email_attachments(email_id);
