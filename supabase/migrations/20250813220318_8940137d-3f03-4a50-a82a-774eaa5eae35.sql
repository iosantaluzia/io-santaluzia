
-- Criar a tabela emails
CREATE TABLE public.emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id TEXT UNIQUE NOT NULL,
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
  is_read BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  folder TEXT DEFAULT 'inbox',
  has_attachments BOOLEAN DEFAULT FALSE,
  size_bytes INTEGER,
  flags TEXT[],
  in_reply_to TEXT,
  references TEXT[],
  raw_headers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar a tabela de anexos de email
CREATE TABLE public.email_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_id UUID REFERENCES public.emails(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  content_type TEXT,
  size_bytes INTEGER,
  file_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar a tabela de rascunhos de email
CREATE TABLE public.email_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  to_email TEXT NOT NULL,
  cc_emails TEXT[],
  bcc_emails TEXT[],
  subject TEXT NOT NULL,
  content_html TEXT,
  content_text TEXT,
  reply_to_email_id UUID REFERENCES public.emails(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_drafts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para emails (todos os usuários autenticados podem ver todos os emails)
CREATE POLICY "Allow authenticated users to view emails" ON public.emails
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to update emails" ON public.emails
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow service role to insert emails" ON public.emails
  FOR INSERT TO service_role WITH CHECK (true);

-- Políticas RLS para anexos
CREATE POLICY "Allow authenticated users to view email attachments" ON public.email_attachments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow service role to insert email attachments" ON public.email_attachments
  FOR INSERT TO service_role WITH CHECK (true);

-- Políticas RLS para rascunhos (usuários só veem seus próprios rascunhos)
CREATE POLICY "Users can view their own drafts" ON public.email_drafts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own drafts" ON public.email_drafts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts" ON public.email_drafts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts" ON public.email_drafts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Criar índices para performance
CREATE INDEX idx_emails_message_id ON public.emails(message_id);
CREATE INDEX idx_emails_from_email ON public.emails(from_email);
CREATE INDEX idx_emails_to_email ON public.emails(to_email);
CREATE INDEX idx_emails_date_received ON public.emails(date_received DESC);
CREATE INDEX idx_emails_folder ON public.emails(folder);
CREATE INDEX idx_emails_is_read ON public.emails(is_read);
CREATE INDEX idx_emails_is_starred ON public.emails(is_starred);
CREATE INDEX idx_email_attachments_email_id ON public.email_attachments(email_id);
CREATE INDEX idx_email_drafts_user_id ON public.email_drafts(user_id);

-- Inserir alguns emails mock para teste
INSERT INTO public.emails (
  message_id, subject, from_email, from_name, to_email, to_name,
  content_text, content_html, date_received, is_read, has_attachments, size_bytes, folder
) VALUES
(
  '<fin-001@supplier.com>',
  'Fatura de Equipamentos Médicos - Vencimento 25/01',
  'financeiro@medequip.com.br',
  'MedEquip Brasil',
  'financeiro@iosantaluzia.com.br',
  'Financeiro IO Santa Luzia',
  'Prezados, segue em anexo a fatura dos equipamentos oftalmológicos com vencimento em 25/01/2025.',
  '<p>Prezados,</p><p>Segue em anexo a fatura dos equipamentos oftalmológicos com vencimento em 25/01/2025.</p><p>Valor: R$ 15.420,00</p>',
  NOW(),
  false,
  true,
  2048,
  'inbox'
),
(
  '<fin-002@bank.com>',
  'Extrato Bancário - Janeiro 2025',
  'noreply@bb.com.br',
  'Banco do Brasil',
  'financeiro@iosantaluzia.com.br',
  'Financeiro IO Santa Luzia',
  'Extrato bancário da conta corrente disponível.',
  '<p>Extrato bancário da conta corrente disponível.</p>',
  NOW() - INTERVAL '1 day',
  true,
  false,
  1024,
  'inbox'
),
(
  '<fin-003@governo.br>',
  'Notificação Fiscal - Declaração Mensal',
  'noreply@receita.fazenda.gov.br',
  'Receita Federal',
  'financeiro@iosantaluzia.com.br',
  'Financeiro IO Santa Luzia',
  'Lembrete: Declaração mensal deve ser enviada até 20/01/2025.',
  '<p>Lembrete: Declaração mensal deve ser enviada até 20/01/2025.</p>',
  NOW() - INTERVAL '2 days',
  false,
  false,
  1500,
  'inbox'
),
(
  '<main-001@paciente.com>',
  'Consulta de Retorno - Maria Silva',
  'maria.silva@gmail.com',
  'Maria Silva',
  'iosantaluzia@iosantaluzia.com.br',
  'Instituto Oftalmológico Santa Luzia',
  'Bom dia! Gostaria de agendar uma consulta de retorno para próxima semana.',
  '<p>Bom dia!</p><p>Gostaria de agendar uma consulta de retorno para próxima semana.</p>',
  NOW(),
  false,
  false,
  1024,
  'inbox'
),
(
  '<main-002@convenio.com>',
  'Autorização de Cirurgia Aprovada',
  'autorizacoes@unimed.com.br',
  'Unimed Santa Luzia',
  'iosantaluzia@iosantaluzia.com.br',
  'Instituto Oftalmológico Santa Luzia',
  'A autorização para cirurgia de catarata foi aprovada.',
  '<p>A autorização para cirurgia de catarata foi aprovada.</p>',
  NOW() - INTERVAL '1 day',
  true,
  false,
  1500,
  'inbox'
);
