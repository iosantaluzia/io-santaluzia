-- Criar conta de autenticação para o usuário financeiro
-- Esta migração cria a conta auth.users para financeiro@iosantaluzia.com

-- Verificar se o usuário financeiro existe na tabela app_users
DO $$
DECLARE
  financeiro_user_id UUID;
  financeiro_auth_id UUID;
BEGIN
  -- Verificar se o usuário financeiro existe
  SELECT id INTO financeiro_user_id 
  FROM public.app_users 
  WHERE username = 'financeiro';
  
  IF financeiro_user_id IS NULL THEN
    -- Criar o usuário financeiro na tabela app_users se não existir
    INSERT INTO public.app_users (username, role, approved, created_by)
    VALUES ('financeiro', 'secretary', true, 'system')
    RETURNING id INTO financeiro_user_id;
  END IF;
  
  -- Verificar se já existe uma conta de autenticação para financeiro
  SELECT id INTO financeiro_auth_id
  FROM auth.users
  WHERE email = 'financeiro@iosantaluzia.com';
  
  -- Se não existe, criar a conta de autenticação
  IF financeiro_auth_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'financeiro@iosantaluzia.com',
      crypt('iosantaluzia', gen_salt('bf')), -- Senha padrão: iosantaluzia
      NOW(),
      NULL,
      NULL,
      '{"provider": "email", "providers": ["email"]}',
      '{"username": "financeiro"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO financeiro_auth_id;
    
    -- Vincular a conta Auth ao registro app_users
    UPDATE public.app_users
    SET auth_user_id = financeiro_auth_id,
        updated_at = NOW()
    WHERE username = 'financeiro';
    
    RAISE NOTICE 'Conta de autenticação criada para financeiro@iosantaluzia.com';
  ELSE
    -- Se já existe, apenas vincular se não estiver vinculado
    UPDATE public.app_users
    SET auth_user_id = financeiro_auth_id,
        updated_at = NOW()
    WHERE username = 'financeiro'
      AND (auth_user_id IS NULL OR auth_user_id != financeiro_auth_id);
    
    RAISE NOTICE 'Conta de autenticação já existe para financeiro@iosantaluzia.com';
  END IF;
END $$;

-- Verificar o resultado
SELECT 
  au.username,
  au.role,
  au.approved,
  au.auth_user_id,
  CASE 
    WHEN au.auth_user_id IS NOT NULL THEN 'Vinculado'
    ELSE 'Não vinculado'
  END as status
FROM public.app_users au
WHERE au.username = 'financeiro';

