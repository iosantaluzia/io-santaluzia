
-- Adicionar coluna de preferências na tabela app_users
ALTER TABLE public.app_users 
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.app_users.preferences IS 'Preferências individuais do usuário (ex: exibir/ocultar horários livres no dashboard)';
