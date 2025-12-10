-- Criar tabela para mensagens internas do chat
CREATE TABLE IF NOT EXISTS public.internal_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_username TEXT NOT NULL,
  to_username TEXT,
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'group' CHECK (message_type IN ('group', 'private')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Índices para melhor performance
  CONSTRAINT fk_from_user FOREIGN KEY (from_username) REFERENCES public.app_users(username) ON DELETE CASCADE
);

-- Foreign key para to_username (pode ser NULL para mensagens de grupo)
ALTER TABLE public.internal_messages
ADD CONSTRAINT fk_to_user FOREIGN KEY (to_username) REFERENCES public.app_users(username) ON DELETE CASCADE;

-- Índices para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_internal_messages_from ON public.internal_messages(from_username);
CREATE INDEX IF NOT EXISTS idx_internal_messages_to ON public.internal_messages(to_username);
CREATE INDEX IF NOT EXISTS idx_internal_messages_type ON public.internal_messages(message_type);
CREATE INDEX IF NOT EXISTS idx_internal_messages_created_at ON public.internal_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_internal_messages_read ON public.internal_messages(read) WHERE read = FALSE;

-- Habilitar Realtime para a tabela
ALTER PUBLICATION supabase_realtime ADD TABLE public.internal_messages;

-- Políticas RLS (Row Level Security)
ALTER TABLE public.internal_messages ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ler mensagens do grupo
CREATE POLICY "Users can read group messages"
ON public.internal_messages FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND approved = TRUE
  )
  AND (
    message_type = 'group' OR
    from_username IN (SELECT username FROM public.app_users WHERE auth_user_id = auth.uid()) OR
    to_username IN (SELECT username FROM public.app_users WHERE auth_user_id = auth.uid())
  )
);

-- Política: Usuários autenticados podem enviar mensagens
CREATE POLICY "Users can send messages"
ON public.internal_messages FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND username = from_username
    AND approved = TRUE
  )
);

-- Política: Usuários podem marcar suas próprias mensagens recebidas como lidas
CREATE POLICY "Users can update read status"
ON public.internal_messages FOR UPDATE
USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND username = to_username
    AND approved = TRUE
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND username = to_username
    AND approved = TRUE
  )
);

-- Política: Usuários podem deletar suas próprias mensagens (opcional, para limpeza)
CREATE POLICY "Users can delete their own messages"
ON public.internal_messages FOR DELETE
USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND username = from_username
    AND approved = TRUE
  )
);

-- Função para limpar mensagens antigas (mais de 24 horas)
CREATE OR REPLACE FUNCTION cleanup_old_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM public.internal_messages
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentário: Esta função pode ser chamada periodicamente via cron job no Supabase
-- ou manualmente quando necessário

