-- Criar bucket para arquivos de exames (se não existir)
-- Nota: Buckets devem ser criados manualmente no dashboard do Supabase
-- Este arquivo contém as políticas RLS para o bucket

-- Política para administradores, médicos e secretários fazerem upload
CREATE POLICY "Admin staff can upload exam files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'exam-files' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND role IN ('admin', 'doctor', 'secretary')
  )
);

-- Política para administradores, médicos e secretários visualizarem arquivos
CREATE POLICY "Admin staff can view exam files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'exam-files' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND role IN ('admin', 'doctor', 'secretary')
  )
);

-- Política para administradores e médicos deletarem arquivos
CREATE POLICY "Admin and doctors can delete exam files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'exam-files' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.app_users
    WHERE auth_user_id = auth.uid()
    AND role IN ('admin', 'doctor')
  )
);

-- Política para pacientes visualizarem seus próprios arquivos
-- Isso permite que pacientes vejam arquivos através do portal web
CREATE POLICY "Patients can view their own exam files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'exam-files' AND
  auth.role() = 'authenticated' AND
  -- Verificar se o paciente tem acesso ao arquivo através da tabela exam_files
  EXISTS (
    SELECT 1 FROM public.exam_files ef
    JOIN public.patient_exams pe ON ef.patient_exam_id = pe.id
    JOIN public.patients p ON pe.patient_id = p.id
    WHERE ef.file_path LIKE '%' || (storage.foldername(name))[3] || '%'
    AND (
      -- Paciente autenticado vinculado ao paciente
      EXISTS (
        SELECT 1 FROM public.app_users au
        WHERE au.auth_user_id = auth.uid()
        AND LOWER(au.username) = LOWER(p.cpf)
      )
      OR
      -- Verificar através de patient_portal_documents se existir
      EXISTS (
        SELECT 1 FROM public.patient_portal_documents ppd
        WHERE ppd.user_id = auth.uid()
        AND ppd.file_path LIKE '%' || (storage.foldername(name))[3] || '%'
      )
    )
  )
);

-- Comentário: Para criar o bucket manualmente:
-- 1. Acesse o dashboard do Supabase
-- 2. Vá em Storage
-- 3. Clique em "New bucket"
-- 4. Nome: exam-files
-- 5. Público: Não (privado)
-- 6. As políticas acima serão aplicadas automaticamente

