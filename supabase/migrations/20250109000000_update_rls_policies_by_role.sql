-- =====================================================
-- ATUALIZAÇÃO DE POLÍTICAS RLS BASEADAS EM ROLES
-- Implementa controle de acesso granular por nível de usuário
-- =====================================================

BEGIN;

-- =====================================================
-- 1. REMOVER POLÍTICAS ANTIGAS
-- =====================================================

-- Remover políticas antigas da tabela patients
DROP POLICY IF EXISTS "Allow authenticated users to view patients" ON public.patients;
DROP POLICY IF EXISTS "Allow authenticated users to insert patients" ON public.patients;
DROP POLICY IF EXISTS "Allow authenticated users to update patients" ON public.patients;
DROP POLICY IF EXISTS "Allow authenticated users to delete patients" ON public.patients;
DROP POLICY IF EXISTS "Doctors and admins can view all patients" ON public.patients;
DROP POLICY IF EXISTS "Secretaries can view assigned patients" ON public.patients;
DROP POLICY IF EXISTS "Doctors and admins can insert patients" ON public.patients;
DROP POLICY IF EXISTS "Doctors and admins can update patients" ON public.patients;
DROP POLICY IF EXISTS "Only admins can delete patients" ON public.patients;

-- Remover políticas antigas da tabela consultations
DROP POLICY IF EXISTS "Allow authenticated users to view consultations" ON public.consultations;
DROP POLICY IF EXISTS "Allow authenticated users to insert consultations" ON public.consultations;
DROP POLICY IF EXISTS "Allow authenticated users to update consultations" ON public.consultations;
DROP POLICY IF EXISTS "Allow authenticated users to delete consultations" ON public.consultations;
DROP POLICY IF EXISTS "Doctors and admins can view all consultations" ON public.consultations;
DROP POLICY IF EXISTS "Secretaries can view their consultations" ON public.consultations;
DROP POLICY IF EXISTS "Patients can view their own consultations" ON public.consultations;
DROP POLICY IF EXISTS "Staff can insert consultations" ON public.consultations;
DROP POLICY IF EXISTS "Doctors and admins can update consultations" ON public.consultations;

-- Remover políticas antigas da tabela patient_exams
DROP POLICY IF EXISTS "Allow authenticated users to view patient_exams" ON public.patient_exams;
DROP POLICY IF EXISTS "Allow authenticated users to insert patient_exams" ON public.patient_exams;
DROP POLICY IF EXISTS "Allow authenticated users to update patient_exams" ON public.patient_exams;
DROP POLICY IF EXISTS "Allow authenticated users to delete patient_exams" ON public.patient_exams;

-- =====================================================
-- 2. CRIAR/ATUALIZAR FUNÇÃO AUXILIAR PARA VERIFICAR ROLE
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

-- Função para obter username do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_username()
RETURNS TEXT AS $$
DECLARE
  user_username TEXT;
BEGIN
  SELECT username INTO user_username
  FROM public.app_users
  WHERE auth_user_id = auth.uid()
  LIMIT 1;
  
  RETURN COALESCE(user_username, '');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. POLÍTICAS PARA TABELA PATIENTS
-- =====================================================

-- Todos os usuários autenticados podem ver dados de cadastro de pacientes
-- (mas não prontuários médicos - isso será controlado no frontend)
CREATE POLICY "All authenticated users can view patient registration data" ON public.patients
FOR SELECT USING (
  auth.role() = 'authenticated'
);

-- Secretários, médicos, financeiro e admins podem criar pacientes
CREATE POLICY "Staff can insert patients" ON public.patients
FOR INSERT WITH CHECK (
  public.get_user_role() IN ('admin', 'doctor', 'secretary', 'financeiro')
);

-- Secretários, médicos, financeiro e admins podem atualizar dados de cadastro
CREATE POLICY "Staff can update patient registration data" ON public.patients
FOR UPDATE USING (
  public.get_user_role() IN ('admin', 'doctor', 'secretary', 'financeiro')
);

-- Apenas admins podem deletar pacientes
CREATE POLICY "Only admins can delete patients" ON public.patients
FOR DELETE USING (
  public.get_user_role() = 'admin'
);

-- =====================================================
-- 4. POLÍTICAS PARA TABELA CONSULTATIONS
-- =====================================================

-- Médicos podem ver apenas suas próprias consultas
CREATE POLICY "Doctors can view their own consultations" ON public.consultations
FOR SELECT USING (
  public.get_user_role() = 'doctor'
  AND (
    doctor_name ILIKE '%' || public.get_user_username() || '%'
    OR doctor_name ILIKE '%matheus%' AND public.get_user_username() = 'matheus'
    OR doctor_name ILIKE '%fabiola%' AND public.get_user_username() = 'fabiola'
  )
);

-- Admins podem ver todas as consultas
CREATE POLICY "Admins can view all consultations" ON public.consultations
FOR SELECT USING (
  public.get_user_role() = 'admin'
);

-- Secretários e financeiro NÃO podem ver consultas (prontuários médicos)
-- (Não criamos política SELECT para eles)

-- Médicos, secretários e admins podem criar consultas
CREATE POLICY "Doctors and secretaries can insert consultations" ON public.consultations
FOR INSERT WITH CHECK (
  public.get_user_role() IN ('admin', 'doctor', 'secretary')
);

-- Médicos e admins podem atualizar consultas
CREATE POLICY "Doctors and admins can update consultations" ON public.consultations
FOR UPDATE USING (
  public.get_user_role() IN ('admin', 'doctor')
);

-- Médicos podem atualizar apenas suas próprias consultas
CREATE POLICY "Doctors can update only their own consultations" ON public.consultations
FOR UPDATE USING (
  public.get_user_role() = 'doctor'
  AND (
    doctor_name ILIKE '%' || public.get_user_username() || '%'
    OR doctor_name ILIKE '%matheus%' AND public.get_user_username() = 'matheus'
    OR doctor_name ILIKE '%fabiola%' AND public.get_user_username() = 'fabiola'
  )
);

-- Apenas admins podem deletar consultas
CREATE POLICY "Only admins can delete consultations" ON public.consultations
FOR DELETE USING (
  public.get_user_role() = 'admin'
);

-- =====================================================
-- 5. POLÍTICAS PARA TABELA PATIENT_EXAMS
-- =====================================================

-- Médicos podem ver exames de seus pacientes
CREATE POLICY "Doctors can view their patients exams" ON public.patient_exams
FOR SELECT USING (
  public.get_user_role() = 'doctor'
  AND (
    doctor_name ILIKE '%' || public.get_user_username() || '%'
    OR doctor_name ILIKE '%matheus%' AND public.get_user_username() = 'matheus'
    OR doctor_name ILIKE '%fabiola%' AND public.get_user_username() = 'fabiola'
  )
);

-- Admins podem ver todos os exames
CREATE POLICY "Admins can view all exams" ON public.patient_exams
FOR SELECT USING (
  public.get_user_role() = 'admin'
);

-- Secretários e financeiro NÃO podem ver exames (prontuários médicos)
-- (Não criamos política SELECT para eles)

-- Médicos, secretários e admins podem criar exames
CREATE POLICY "Doctors and secretaries can insert exams" ON public.patient_exams
FOR INSERT WITH CHECK (
  public.get_user_role() IN ('admin', 'doctor', 'secretary')
);

-- Médicos e admins podem atualizar exames
CREATE POLICY "Doctors and admins can update exams" ON public.patient_exams
FOR UPDATE USING (
  public.get_user_role() IN ('admin', 'doctor')
);

-- =====================================================
-- 6. ATUALIZAR USUÁRIO iosantaluzia PARA secretaria
-- =====================================================

-- Primeiro atualizar referências na tabela internal_messages
UPDATE public.internal_messages
SET from_username = 'secretaria'
WHERE from_username = 'iosantaluzia';

UPDATE public.internal_messages
SET to_username = 'secretaria'
WHERE to_username = 'iosantaluzia';

-- Depois atualizar o username na tabela app_users
UPDATE public.app_users
SET username = 'secretaria'
WHERE username = 'iosantaluzia';

COMMIT;

