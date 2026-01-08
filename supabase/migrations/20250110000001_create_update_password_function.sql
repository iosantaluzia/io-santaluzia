-- Criar função para atualizar senha do usuário (requer privilégios admin)
CREATE OR REPLACE FUNCTION public.update_user_password(user_id UUID, new_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Atualizar senha no auth.users
  UPDATE auth.users
  SET encrypted_password = crypt(new_password, gen_salt('bf')),
      updated_at = NOW()
  WHERE id = user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

