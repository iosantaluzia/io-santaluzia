
-- Inserir o usuário "financeiro" se não existir
INSERT INTO public.app_users (username, role, approved, created_by) 
VALUES ('financeiro', 'secretary', true, 'admin')
ON CONFLICT (username) DO NOTHING;

-- Verificar se os usuários existem
SELECT username, role, approved, auth_user_id FROM public.app_users 
WHERE username IN ('financeiro', 'iosantaluzia', 'matheus', 'fabiola');
