
-- Remover políticas RLS problemáticas que causam recursão
DROP POLICY IF EXISTS "Admin users can manage app_users" ON public.app_users;
DROP POLICY IF EXISTS "Users can view all app_users" ON public.app_users;

-- Criar políticas RLS mais simples e sem recursão
CREATE POLICY "Allow read access to app_users" ON public.app_users
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to update their own record" ON public.app_users
FOR UPDATE USING (auth_user_id = auth.uid());

-- Criar as 3 contas Auth diretamente
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
) VALUES 
(
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'matheus@iosantaluzia.com',
  crypt('iosantaluzia', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"username": "matheus"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
),
(
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'fabiola@iosantaluzia.com',
  crypt('iosantaluzia', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"username": "fabiola"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
),
(
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'iosantaluzia@iosantaluzia.com',
  crypt('iosantaluzia', gen_salt('bf')),
  NOW(),
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"username": "iosantaluzia"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Vincular as contas Auth aos registros da tabela app_users
UPDATE public.app_users 
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'matheus@iosantaluzia.com')
WHERE username = 'matheus';

UPDATE public.app_users 
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'fabiola@iosantaluzia.com')
WHERE username = 'fabiola';

UPDATE public.app_users 
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'iosantaluzia@iosantaluzia.com')
WHERE username = 'iosantaluzia';
