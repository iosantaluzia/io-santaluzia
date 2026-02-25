-- MEGA SCRIPT DE CORREÇÃO: Schema e Políticas de Usuários
-- Execute este script no SQL Editor do Supabase para corrigir o erro de coluna ausente e permissões.

-- 1. Adicionar colunas necessárias se não existirem
ALTER TABLE public.app_users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.app_users ADD COLUMN IF NOT EXISTS display_name TEXT;

-- 2. Garantir que o tipo enum existe (papel financeiro)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'user_role' AND e.enumlabel = 'financeiro') THEN
        ALTER TYPE public.user_role ADD VALUE 'financeiro';
    END IF;
END
$$;

-- 3. Resetar políticas para evitar conflitos de recursão ou permissão
DROP POLICY IF EXISTS "app_users_select_policy" ON public.app_users;
DROP POLICY IF EXISTS "app_users_admin_policy" ON public.app_users;
DROP POLICY IF EXISTS "Permitir leitura para usuários autenticados" ON public.app_users;
DROP POLICY IF EXISTS "Permitir gerenciamento para administradores" ON public.app_users;
DROP POLICY IF EXISTS "Users can update own avatar" ON public.app_users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.app_users;

-- 4. Função SECURITY DEFINER para checar admin (evita recursão infinita)
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.app_users 
    WHERE auth_user_id = auth.uid() 
    AND (role = 'admin' OR username IN ('matheus', 'secretaria'))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. POLÍTICA DE LEITURA (Pública para autenticados)
CREATE POLICY "app_users_select_policy" 
ON public.app_users FOR SELECT 
TO authenticated 
USING (true);

-- 6. POLÍTICA DE AUTO-ATUALIZAÇÃO (Para avatar e display_name)
CREATE POLICY "app_users_self_update_policy"
ON public.app_users FOR UPDATE
TO authenticated
USING (auth_user_id = auth.uid())
WITH CHECK (auth_user_id = auth.uid());

-- 7. POLÍTICA DE ADMIN (Gerenciamento total)
CREATE POLICY "app_users_admin_all_policy" 
ON public.app_users FOR ALL 
TO authenticated 
USING (public.check_is_admin());

-- NOTA: Após executar, o Supabase pode levar alguns segundos para atualizar o cache do PostgREST.
-- Se o erro persistir, tente clicar em "Reload Schema" nas configurações da API do Supabase (embora o DDL acima costume disparar isso).
