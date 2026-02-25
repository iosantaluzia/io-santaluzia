-- Adicionar coluna avatar_url na tabela app_users
ALTER TABLE public.app_users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Garantir que a coluna esteja disponível para RLS (já está habilitado para a tabela)
-- Nenhuma alteração de política necessária se as políticas existentes já cobrem SELECT e UPDATE
