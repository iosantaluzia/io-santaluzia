-- Melhorar política RLS para usar comparação case-insensitive
-- Isso garante que mensagens funcionem mesmo se houver diferenças de case no username

DROP POLICY IF EXISTS "Users can send messages" ON public.internal_messages;

CREATE POLICY "Users can send messages"
ON public.internal_messages FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND LOWER(username) = LOWER(from_username)
    AND approved = TRUE
  )
);

-- Melhorar política de leitura para também usar case-insensitive
DROP POLICY IF EXISTS "Users can read group messages" ON public.internal_messages;

CREATE POLICY "Users can read group messages"
ON public.internal_messages FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND approved = TRUE
  )
  AND (
    message_type = 'group' OR
    LOWER(from_username) IN (SELECT LOWER(username) FROM public.app_users WHERE auth_user_id = auth.uid()) OR
    LOWER(to_username) IN (SELECT LOWER(username) FROM public.app_users WHERE auth_user_id = auth.uid())
  )
);
