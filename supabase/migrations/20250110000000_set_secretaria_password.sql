-- Definir senha para o usuário secretaria
-- Esta migração cria ou atualiza a conta auth.users para secretaria@iosantaluzia.com
-- com a senha "iosantaluzia"

DO $$
DECLARE
  secretaria_user_id UUID;
  secretaria_auth_id UUID;
BEGIN
  -- Verificar se o usuário secretaria existe na tabela app_users
  SELECT id INTO secretaria_user_id 
  FROM public.app_users 
  WHERE username = 'secretaria';
  
  IF secretaria_user_id IS NULL THEN
    -- Criar o usuário secretaria na tabela app_users se não existir
    INSERT INTO public.app_users (username, role, approved, created_by)
    VALUES ('secretaria', 'secretary', true, 'system')
    RETURNING id INTO secretaria_user_id;
  END IF;
  
  -- Verificar se já existe uma conta de autenticação para secretaria
  SELECT id INTO secretaria_auth_id
  FROM auth.users
  WHERE email = 'secretaria@iosantaluzia.com';
  
  -- Se não existe, criar a conta de autenticação
  IF secretaria_auth_id IS NULL THEN
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
      'secretaria@iosantaluzia.com',
      crypt('iosantaluzia', gen_salt('bf')), -- Senha: iosantaluzia
      NOW(),
      NULL,
      NULL,
      '{"provider": "email", "providers": ["email"]}',
      '{"username": "secretaria"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO secretaria_auth_id;
    
    -- Vincular a conta Auth ao registro app_users
    UPDATE public.app_users
    SET auth_user_id = secretaria_auth_id,
        updated_at = NOW()
    WHERE username = 'secretaria';
    
    RAISE NOTICE 'Conta de autenticação criada para secretaria@iosantaluzia.com com senha iosantaluzia';
  ELSE
    -- Se já existe, atualizar a senha para iosantaluzia
    UPDATE auth.users
    SET encrypted_password = crypt('iosantaluzia', gen_salt('bf')),
        updated_at = NOW()
    WHERE email = 'secretaria@iosantaluzia.com';
    
    -- Vincular se não estiver vinculado
    UPDATE public.app_users
    SET auth_user_id = secretaria_auth_id,
        updated_at = NOW()
    WHERE username = 'secretaria'
      AND (auth_user_id IS NULL OR auth_user_id != secretaria_auth_id);
    
    RAISE NOTICE 'Senha atualizada para secretaria@iosantaluzia.com';
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
WHERE au.username = 'secretaria';

