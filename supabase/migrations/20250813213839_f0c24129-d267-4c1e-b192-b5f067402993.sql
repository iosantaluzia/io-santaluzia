
-- Criar tabela para armazenar emails
CREATE TABLE public.emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id TEXT UNIQUE,
  subject TEXT NOT NULL,
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  to_name TEXT,
  cc_emails TEXT[],
  bcc_emails TEXT[],
  reply_to TEXT,
  content_text TEXT,
  content_html TEXT,
  date_received TIMESTAMP WITH TIME ZONE NOT NULL,
  date_sent TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  folder TEXT DEFAULT 'inbox',
  thread_id TEXT,
  in_reply_to TEXT,
  references TEXT[],
  has_attachments BOOLEAN DEFAULT FALSE,
  size_bytes INTEGER,
  flags TEXT[],
  raw_headers JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para anexos
CREATE TABLE public.email_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_id UUID REFERENCES public.emails(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_id TEXT,
  size_bytes INTEGER,
  is_inline BOOLEAN DEFAULT FALSE,
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para rascunhos
CREATE TABLE public.email_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email TEXT NOT NULL,
  cc_emails TEXT[],
  bcc_emails TEXT[],
  subject TEXT NOT NULL,
  content_html TEXT,
  content_text TEXT,
  reply_to_email_id UUID REFERENCES public.emails(id),
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_drafts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para emails (todos os usuários autenticados podem ver emails do financeiro)
CREATE POLICY "Allow authenticated users to view emails" 
  ON public.emails 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update emails" 
  ON public.emails 
  FOR UPDATE 
  USING (auth.uid() IS NOT NULL);

-- Políticas RLS para anexos
CREATE POLICY "Allow authenticated users to view attachments" 
  ON public.email_attachments 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Políticas RLS para rascunhos
CREATE POLICY "Allow authenticated users to manage drafts" 
  ON public.email_drafts 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Índices para performance
CREATE INDEX idx_emails_date_received ON public.emails(date_received DESC);
CREATE INDEX idx_emails_folder ON public.emails(folder);
CREATE INDEX idx_emails_message_id ON public.emails(message_id);
CREATE INDEX idx_emails_thread_id ON public.emails(thread_id);
CREATE INDEX idx_email_attachments_email_id ON public.email_attachments(email_id);
