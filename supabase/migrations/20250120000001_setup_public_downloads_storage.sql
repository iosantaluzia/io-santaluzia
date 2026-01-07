-- Criar bucket para downloads públicos (executáveis)
-- Nota: Buckets devem ser criados manualmente no dashboard do Supabase se esta migração falhar
-- Este arquivo contém as políticas RLS para o bucket

-- Tentar criar bucket 'public-downloads' (pode falhar se já existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('public-downloads', 'public-downloads', TRUE, 524288000, ARRAY['application/x-msdownload', 'application/octet-stream', 'application/exe'])
ON CONFLICT (id) DO NOTHING;

-- Política para permitir que qualquer pessoa autenticada baixe arquivos
DROP POLICY IF EXISTS "Allow authenticated users to download executable" ON storage.objects;
CREATE POLICY "Allow authenticated users to download executable"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-downloads');

-- Política para permitir que administradores façam upload de executáveis
DROP POLICY IF EXISTS "Allow admin to upload executable" ON storage.objects;
CREATE POLICY "Allow admin to upload executable"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'public-downloads' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Política para permitir que administradores atualizem executáveis
DROP POLICY IF EXISTS "Allow admin to update executable" ON storage.objects;
CREATE POLICY "Allow admin to update executable"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'public-downloads' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Política para permitir que administradores deletem executáveis
DROP POLICY IF EXISTS "Allow admin to delete executable" ON storage.objects;
CREATE POLICY "Allow admin to delete executable"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'public-downloads' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND role = 'admin'
  )
);

