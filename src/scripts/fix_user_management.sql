-- Script para CORRIGIR o gerenciamento de usuários e evitar Recursão Infinita (Erro 500)
-- Execute este script no SQL Editor do Supabase

-- 0. Garantir extensões necessárias
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Adicionar o papel 'financeiro' ao enum user_role se não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'user_role' AND e.enumlabel = 'financeiro') THEN
        ALTER TYPE public.user_role ADD VALUE 'financeiro';
    END IF;
END
$$;

-- 2. Adicionar a coluna display_name se não existir
ALTER TABLE public.app_users ADD COLUMN IF NOT EXISTS display_name TEXT;

-- 3. Garantir que RLS está habilitado
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- 4. Limpar políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Permitir leitura para usuários autenticados" ON public.app_users;
DROP POLICY IF EXISTS "Permitir gerenciamento para administradores" ON public.app_users;
DROP POLICY IF EXISTS "Permitir leitura para todos usuários autenticados" ON public.app_users;
DROP POLICY IF EXISTS "Permitir que admins gerenciem usuários" ON public.app_users;
DROP POLICY IF EXISTS "Allow select for authenticated" ON public.app_users;
DROP POLICY IF EXISTS "Allow individual update" ON public.app_users;
DROP POLICY IF EXISTS "app_users_select_policy" ON public.app_users;
DROP POLICY IF EXISTS "app_users_admin_policy" ON public.app_users;

-- 5. Criar uma função SECURITY DEFINER para checar se é admin sem causar recursão
-- O "SECURITY DEFINER" faz a função ignorar as políticas de RLS ao consultar a tabela
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

-- 6. Criar novas políticas SEM recursão
-- Política de Leitura: Qualquer um autenticado pode ler
CREATE POLICY "app_users_select_policy" 
ON public.app_users FOR SELECT 
TO authenticated 
USING (true);

-- Política de Gerenciamento: Apenas admins podem Inserir/Atualizar/Deletar
-- Usamos a função check_is_admin() que, por ser SECURITY DEFINER, não causa recursão
CREATE POLICY "app_users_admin_policy" 
ON public.app_users FOR ALL 
TO authenticated 
USING (
    username IN ('matheus', 'secretaria') OR 
    (SELECT public.check_is_admin())
);

-- 7. Funções auxiliares para Auth
CREATE OR REPLACE FUNCTION public.update_user_email(user_id uuid, new_email text)
RETURNS boolean AS $$
BEGIN
  UPDATE auth.users SET email = new_email, updated_at = now() WHERE id = user_id;
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_user_password(user_id uuid, new_password text)
RETURNS boolean AS $$
BEGIN
  -- Nota: O Supabase Auth gerencia o hash da senha internamente se usarmos o campo correto
  -- Esta função é um facilitador via RPC
  UPDATE auth.users SET 
    encrypted_password = crypt(new_password, gen_salt('bf')), 
    updated_at = now(),
    email_confirmed_at = COALESCE(email_confirmed_at, now()) -- Garantir que não bloqueia login
  WHERE id = user_id;
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
