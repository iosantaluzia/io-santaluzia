-- Permitir que usuários aprovados marquem como lidas:
-- 1) mensagens privadas destinadas a eles (to_username = usuário atual)
-- 2) mensagens de grupo (to_username IS NULL) — qualquer usuário aprovado pode marcar
DROP POLICY IF EXISTS "Users can update read status" ON public.internal_messages;

CREATE POLICY "Users can update read status"
ON public.internal_messages FOR UPDATE
USING (
  auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.app_users au
    WHERE au.auth_user_id = auth.uid()
    AND au.approved = TRUE
    AND (
      LOWER(au.username) = LOWER(internal_messages.to_username)
      OR (internal_messages.message_type = 'group' AND internal_messages.to_username IS NULL)
    )
  )
)
WITH CHECK (
  auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM public.app_users au
    WHERE au.auth_user_id = auth.uid()
    AND au.approved = TRUE
    AND (
      LOWER(au.username) = LOWER(internal_messages.to_username)
      OR (internal_messages.message_type = 'group' AND internal_messages.to_username IS NULL)
    )
  )
);
