-- =====================================================
-- CORREÇÃO CRÍTICA DE SEGURANÇA - POLÍTICAS RLS
-- Aplicar IMEDIATAMENTE após revisar
-- =====================================================

-- ⚠️ ATENÇÃO: Este script remove políticas permissivas e implementa controle de acesso baseado em roles
-- ⚠️ TESTE EM AMBIENTE DE DESENVOLVIMENTO PRIMEIRO

BEGIN;

-- =====================================================
-- 1. REMOVER POLÍTICAS PERMISSIVAS EXISTENTES
-- =====================================================

-- Remover políticas antigas da tabela patients
DROP POLICY IF EXISTS "Allow authenticated users to view patients" ON public.patients;
DROP POLICY IF EXISTS "Allow authenticated users to insert patients" ON public.patients;
DROP POLICY IF EXISTS "Allow authenticated users to update patients" ON public.patients;
DROP POLICY IF EXISTS "Allow authenticated users to delete patients" ON public.patients;

-- Remover políticas antigas da tabela consultations
DROP POLICY IF EXISTS "Allow authenticated users to view consultations" ON public.consultations;
DROP POLICY IF EXISTS "Allow authenticated users to insert consultations" ON public.consultations;
DROP POLICY IF EXISTS "Allow authenticated users to update consultations" ON public.consultations;
DROP POLICY IF EXISTS "Allow authenticated users to delete consultations" ON public.consultations;

-- Remover políticas antigas da tabela patient_exams
DROP POLICY IF EXISTS "Allow authenticated users to view patient_exams" ON public.patient_exams;
DROP POLICY IF EXISTS "Allow authenticated users to insert patient_exams" ON public.patient_exams;
DROP POLICY IF EXISTS "Allow authenticated users to update patient_exams" ON public.patient_exams;
DROP POLICY IF EXISTS "Allow authenticated users to delete patient_exams" ON public.patient_exams;

-- Remover políticas antigas da tabela exam_files
DROP POLICY IF EXISTS "Allow authenticated users to view exam_files" ON public.exam_files;
DROP POLICY IF EXISTS "Allow authenticated users to insert exam_files" ON public.exam_files;
DROP POLICY IF EXISTS "Allow authenticated users to update exam_files" ON public.exam_files;
DROP POLICY IF EXISTS "Allow authenticated users to delete exam_files" ON public.exam_files;

-- =====================================================
-- 2. CRIAR FUNÇÃO AUXILIAR PARA VERIFICAR ROLE DO USUÁRIO
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.app_users
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
  
  RETURN COALESCE(user_role, 'unauthorized');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. POLÍTICAS PARA TABELA PATIENTS
-- =====================================================

-- Médicos e admins podem ver TODOS os pacientes
CREATE POLICY "Doctors and admins can view all patients" ON public.patients
FOR SELECT USING (
  public.get_user_role() IN ('admin', 'doctor')
);

-- Secretários podem ver apenas pacientes que eles criaram ou que têm consultas relacionadas
CREATE POLICY "Secretaries can view assigned patients" ON public.patients
FOR SELECT USING (
  public.get_user_role() = 'secretary'
  AND (
    -- Pacientes criados por este secretário
    created_by = (
      SELECT username FROM public.app_users 
      WHERE auth_user_id = auth.uid()
    )
    OR
    -- Pacientes com consultas criadas por este secretário
    EXISTS (
      SELECT 1 FROM public.consultations
      WHERE consultations.patient_id = patients.id
      AND consultations.created_by = (
        SELECT username FROM public.app_users 
        WHERE auth_user_id = auth.uid()
      )
    )
  )
);

-- Apenas médicos e admins podem criar pacientes
CREATE POLICY "Doctors and admins can insert patients" ON public.patients
FOR INSERT WITH CHECK (
  public.get_user_role() IN ('admin', 'doctor')
);

-- Apenas médicos e admins podem atualizar pacientes
CREATE POLICY "Doctors and admins can update patients" ON public.patients
FOR UPDATE USING (
  public.get_user_role() IN ('admin', 'doctor')
);

-- Apenas admins podem deletar pacientes (ou desabilitar delete completamente)
CREATE POLICY "Only admins can delete patients" ON public.patients
FOR DELETE USING (
  public.get_user_role() = 'admin'
);

-- =====================================================
-- 4. POLÍTICAS PARA TABELA CONSULTATIONS
-- =====================================================

-- Médicos e admins podem ver TODAS as consultas
CREATE POLICY "Doctors and admins can view all consultations" ON public.consultations
FOR SELECT USING (
  public.get_user_role() IN ('admin', 'doctor')
);

-- Secretários podem ver consultas que eles criaram
CREATE POLICY "Secretaries can view their consultations" ON public.consultations
FOR SELECT USING (
  public.get_user_role() = 'secretary'
  AND created_by = (
    SELECT username FROM public.app_users 
    WHERE auth_user_id = auth.uid()
  )
);

-- Pacientes podem ver apenas suas próprias consultas (via patient_portal)
CREATE POLICY "Patients can view their own consultations" ON public.consultations
FOR SELECT USING (
  -- Verificar se o paciente está autenticado e se a consulta pertence a ele
  patient_id IN (
    SELECT p.id FROM public.patients p
    INNER JOIN auth.users au ON au.email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
    WHERE p.email = au.email
  )
);

-- Médicos, admins e secretários podem criar consultas
CREATE POLICY "Staff can insert consultations" ON public.consultations
FOR INSERT WITH CHECK (
  public.get_user_role() IN ('admin', 'doctor', 'secretary')
);

-- Apenas médicos e admins podem atualizar consultas
CREATE POLICY "Doctors and admins can update consultations" ON public.consultations
FOR UPDATE USING (
  public.get_user_role() IN ('admin', 'doctor')
);

-- Apenas admins podem deletar consultas
CREATE POLICY "Only admins can delete consultations" ON public.consultations
FOR DELETE USING (
  public.get_user_role() = 'admin'
);

-- =====================================================
-- 5. POLÍTICAS PARA TABELA PATIENT_EXAMS
-- =====================================================

-- Médicos e admins podem ver TODOS os exames
CREATE POLICY "Doctors and admins can view all exams" ON public.patient_exams
FOR SELECT USING (
  public.get_user_role() IN ('admin', 'doctor')
);

-- Secretários podem ver exames que eles criaram
CREATE POLICY "Secretaries can view their exams" ON public.patient_exams
FOR SELECT USING (
  public.get_user_role() = 'secretary'
  AND created_by = (
    SELECT username FROM public.app_users 
    WHERE auth_user_id = auth.uid()
  )
);

-- Médicos, admins e secretários podem criar exames
CREATE POLICY "Staff can insert exams" ON public.patient_exams
FOR INSERT WITH CHECK (
  public.get_user_role() IN ('admin', 'doctor', 'secretary')
);

-- Apenas médicos e admins podem atualizar exames
CREATE POLICY "Doctors and admins can update exams" ON public.patient_exams
FOR UPDATE USING (
  public.get_user_role() IN ('admin', 'doctor')
);

-- Apenas admins podem deletar exames
CREATE POLICY "Only admins can delete exams" ON public.patient_exams
FOR DELETE USING (
  public.get_user_role() = 'admin'
);

-- =====================================================
-- 6. POLÍTICAS PARA TABELA EXAM_FILES
-- =====================================================

-- Médicos e admins podem ver TODOS os arquivos
CREATE POLICY "Doctors and admins can view all exam files" ON public.exam_files
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.patient_exams pe
    WHERE pe.id = exam_files.patient_exam_id
    AND (
      public.get_user_role() IN ('admin', 'doctor')
      OR (
        public.get_user_role() = 'secretary'
        AND pe.created_by = (
          SELECT username FROM public.app_users 
          WHERE auth_user_id = auth.uid()
        )
      )
    )
  )
);

-- Médicos, admins e secretários podem fazer upload de arquivos
CREATE POLICY "Staff can insert exam files" ON public.exam_files
FOR INSERT WITH CHECK (
  public.get_user_role() IN ('admin', 'doctor', 'secretary')
);

-- Apenas médicos e admins podem atualizar arquivos
CREATE POLICY "Doctors and admins can update exam files" ON public.exam_files
FOR UPDATE USING (
  public.get_user_role() IN ('admin', 'doctor')
);

-- Apenas admins podem deletar arquivos
CREATE POLICY "Only admins can delete exam files" ON public.exam_files
FOR DELETE USING (
  public.get_user_role() = 'admin'
);

-- =====================================================
-- 7. CRIAR TABELA DE AUDITORIA DE ACESSO (RECOMENDADO)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  username TEXT,
  action TEXT NOT NULL, -- 'view', 'insert', 'update', 'delete'
  table_name TEXT NOT NULL,
  record_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ver logs de auditoria
CREATE POLICY "Only admins can view access logs" ON public.access_logs
FOR SELECT USING (
  public.get_user_role() = 'admin'
);

-- Sistema pode inserir logs (via função SECURITY DEFINER)
CREATE POLICY "System can insert access logs" ON public.access_logs
FOR INSERT WITH CHECK (true);

-- =====================================================
-- 8. FUNÇÃO PARA REGISTRAR ACESSOS (OPCIONAL MAS RECOMENDADO)
-- =====================================================

CREATE OR REPLACE FUNCTION public.log_access(
  p_action TEXT,
  p_table_name TEXT,
  p_record_id UUID DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.access_logs (
    user_id,
    username,
    action,
    table_name,
    record_id,
    ip_address
  ) VALUES (
    auth.uid(),
    (SELECT username FROM public.app_users WHERE auth_user_id = auth.uid()),
    p_action,
    p_table_name,
    p_record_id,
    NULL -- IP pode ser obtido via trigger ou application layer
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;

-- =====================================================
-- NOTAS IMPORTANTES:
-- =====================================================
-- 1. Este script implementa controle de acesso baseado em roles
-- 2. Médicos e admins têm acesso completo
-- 3. Secretários têm acesso limitado apenas aos pacientes/consultas que criaram
-- 4. Pacientes podem ver apenas seus próprios dados (via patient_portal)
-- 5. Todas as ações podem ser auditadas via tabela access_logs
-- 
-- PRÓXIMOS PASSOS:
-- 1. Testar em ambiente de desenvolvimento
-- 2. Verificar se todas as funcionalidades ainda funcionam
-- 3. Ajustar políticas conforme necessário para seu caso de uso específico
-- 4. Implementar triggers para registrar acessos automaticamente (opcional)
-- =====================================================

