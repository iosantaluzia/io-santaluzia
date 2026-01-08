-- Criar função para atualizar email do usuário (requer privilégios admin)
CREATE OR REPLACE FUNCTION public.update_user_email(user_id UUID, new_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Atualizar email no auth.users
  UPDATE auth.users
  SET email = new_email,
      updated_at = NOW()
  WHERE id = user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

