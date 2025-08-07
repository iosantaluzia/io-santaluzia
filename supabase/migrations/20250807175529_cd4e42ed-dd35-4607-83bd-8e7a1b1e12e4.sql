
-- Limpar dados inconsistentes
DELETE FROM auth.users WHERE email LIKE '%@iosantaluzia.com';

-- Limpar tabela app_users e recriar com dados corretos
DELETE FROM public.app_users;

-- Inserir os 3 usuários principais
INSERT INTO public.app_users (username, role, approved, created_by) VALUES
  ('matheus', 'doctor', true, 'system'),
  ('fabiola', 'doctor', true, 'system'),
  ('iosantaluzia', 'secretary', true, 'system');

-- Criar contas de autenticação para os 3 usuários
-- Nota: Estas contas serão criadas automaticamente quando eles fizerem login pela primeira vez
-- A senha será 'iosantaluzia' para todos

-- Atualizar a função para criar usuários automaticamente no primeiro login
CREATE OR REPLACE FUNCTION public.create_auth_user_if_needed(username_param TEXT, password_param TEXT)
RETURNS TABLE(user_id UUID, email TEXT, success BOOLEAN) AS $$
DECLARE
  generated_email TEXT;
  auth_user_id UUID;
  existing_app_user RECORD;
BEGIN
  -- Verificar se o usuário existe na tabela app_users
  SELECT * INTO existing_app_user FROM public.app_users WHERE username = LOWER(username_param);
  
  IF existing_app_user IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, NULL::TEXT, FALSE;
    RETURN;
  END IF;
  
  -- Se já tem auth_user_id, retornar sucesso
  IF existing_app_user.auth_user_id IS NOT NULL THEN
    RETURN QUERY SELECT existing_app_user.auth_user_id, existing_app_user.username || '@iosantaluzia.com', TRUE;
    RETURN;
  END IF;
  
  -- Gerar email fictício
  generated_email := username_param || '@iosantaluzia.com';
  
  -- Criar usuário no auth.users (será feito via client-side)
  RETURN QUERY SELECT NULL::UUID, generated_email, TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
