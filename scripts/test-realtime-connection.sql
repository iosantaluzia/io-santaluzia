-- Script para testar se o Realtime está funcionando corretamente
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela está habilitada para Realtime
SELECT 
  schemaname,
  tablename,
  attname
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
AND tablename = 'internal_messages';

-- 2. Se não aparecer resultado acima, habilitar Realtime manualmente:
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.internal_messages;

-- 3. Verificar se há mensagens na tabela
SELECT 
  id,
  from_username,
  to_username,
  message_type,
  created_at
FROM public.internal_messages
ORDER BY created_at DESC
LIMIT 10;

-- 4. Testar inserção de mensagem (substitua 'seu_usuario' pelo seu username)
-- INSERT INTO public.internal_messages (from_username, message, message_type)
-- VALUES ('seu_usuario', 'Teste de mensagem Realtime', 'group')
-- RETURNING *;

