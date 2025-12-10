-- Script para verificar se a migração foi aplicada corretamente
-- Execute este script no SQL Editor do Supabase para confirmar

-- 1. Verificar se a tabela existe
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'internal_messages'
) AS table_exists;

-- 2. Verificar estrutura da tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'internal_messages'
ORDER BY ordinal_position;

-- 3. Verificar se Realtime está habilitado
SELECT 
  schemaname,
  tablename,
  attname
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
AND tablename = 'internal_messages';

-- 4. Verificar políticas RLS
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'internal_messages';

-- 5. Verificar índices
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename = 'internal_messages';

-- Se todos os resultados aparecerem, a migração foi aplicada com sucesso!

