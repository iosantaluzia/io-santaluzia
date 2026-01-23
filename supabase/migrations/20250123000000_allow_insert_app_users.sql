-- Permitir que usuários autorizados (matheus e secretaria) possam inserir novos usuários em app_users
-- Usar função SECURITY DEFINER para evitar recursão nas políticas RLS
CREATE OR REPLACE FUNCTION public.check_user_can_manage_users()
RETURNS BOOLEAN AS $$
DECLARE
  current_username TEXT;
BEGIN
  SELECT username INTO current_username
  FROM public.app_users
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
  
  RETURN current_username IN ('matheus', 'secretaria');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Allow authorized users to insert app_users" ON public.app_users
FOR INSERT 
WITH CHECK (public.check_user_can_manage_users());

