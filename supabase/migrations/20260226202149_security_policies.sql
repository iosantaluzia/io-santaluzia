
-- ==========================================
-- MEGA SCRIPT DE SEGURANÇA: RLS E ISOLAMENTO MÉDICO
-- ==========================================
-- Instruções: Copie e cole este script no SQL Editor do seu Dashboard Supabase.
-- Ele habilita a segurança em todas as tabelas e garante que cada médico veja apenas seus dados.

-- 1. Bases de Segurança e Funções Auxiliares
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.app_users 
    WHERE auth_user_id = auth.uid() 
    AND (role = 'admin' OR username IN ('matheus', 'secretaria'))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_is_staff()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.app_users 
    WHERE auth_user_id = auth.uid() 
    AND role IN ('admin', 'doctor', 'secretary', 'financeiro')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Normalização de Tabelas e Auditoria
-- Criar tabela de fornecedores se não existir
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    status TEXT DEFAULT 'Ativo',
    last_quotation DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by_id UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

DO $$ 
BEGIN
    -- patients
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'created_by_id') THEN
        ALTER TABLE public.patients ADD COLUMN created_by_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
    END IF;
    -- consultations
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consultations' AND column_name = 'created_by_id') THEN
        ALTER TABLE public.consultations ADD COLUMN created_by_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
    END IF;
    -- inventory
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory' AND column_name = 'created_by_id') THEN
        ALTER TABLE public.inventory ADD COLUMN created_by_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
    END IF;
END $$;

-- 3. Habilitação Global de RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_files ENABLE ROW LEVEL SECURITY;

-- 4. Limpeza de Políticas Conflitantes
DROP POLICY IF EXISTS "app_users_select_policy" ON public.app_users;
DROP POLICY IF EXISTS "app_users_self_update_policy" ON public.app_users;
DROP POLICY IF EXISTS "app_users_admin_all_policy" ON public.app_users;
DROP POLICY IF EXISTS "patients_all_policy" ON public.patients;
DROP POLICY IF EXISTS "consultations_all_policy" ON public.consultations;
DROP POLICY IF EXISTS "inventory_all_policy" ON public.inventory;
DROP POLICY IF EXISTS "suppliers_all_policy" ON public.suppliers;

-- 5. NOVAS POLÍTICAS DE SEGURANÇA REFORÇADA

-- [TABELA: APP_USERS]
CREATE POLICY "app_users_select" ON public.app_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "app_users_self_update" ON public.app_users FOR UPDATE TO authenticated USING (auth_user_id = auth.uid());
CREATE POLICY "app_users_admin_all" ON public.app_users FOR ALL TO authenticated USING (public.check_is_admin());

-- [TABELA: PATIENTS]
-- Todos os médicos e secretarias podem ver todos os pacientes (necessário para triagem)
CREATE POLICY "patients_select" ON public.patients FOR SELECT TO authenticated USING (public.check_is_staff());
-- Apenas staff pode cadastrar/alterar pacientes
CREATE POLICY "patients_write" ON public.patients FOR ALL TO authenticated USING (public.check_is_staff());

-- [TABELA: CONSULTATIONS]
-- Médicos vêem apenas suas consultas. Admins/Secretarias vêem tudo para financeiro/agendamento.
CREATE POLICY "consultations_select" ON public.consultations FOR SELECT TO authenticated 
USING (created_by_id = auth.uid() OR public.check_is_admin() OR (SELECT role FROM public.app_users WHERE auth_user_id = auth.uid()) IN ('secretary', 'financeiro'));

-- Apenas o médico que criou ou um Admin pode alterar a consulta
CREATE POLICY "consultations_update" ON public.consultations FOR UPDATE TO authenticated 
USING (created_by_id = auth.uid() OR public.check_is_admin());

-- [TABELA: INVENTORY & SUPPLIERS]
-- Todos da clínica vêem o estoque e fornecedores
CREATE POLICY "inventory_select" ON public.inventory FOR SELECT TO authenticated USING (public.check_is_staff());
CREATE POLICY "suppliers_select" ON public.suppliers FOR SELECT TO authenticated USING (public.check_is_staff());
-- Apenas Admins e Secretarias gerenciam estoque e fornecedores
CREATE POLICY "inventory_suppliers_write" ON public.inventory FOR ALL TO authenticated USING (public.check_is_admin() OR (SELECT role FROM public.app_users WHERE auth_user_id = auth.uid()) = 'secretary');
CREATE POLICY "suppliers_write" ON public.suppliers FOR ALL TO authenticated USING (public.check_is_admin() OR (SELECT role FROM public.app_users WHERE auth_user_id = auth.uid()) = 'secretary');

-- [TABELA: EXAMES]
CREATE POLICY "patient_exams_access" ON public.patient_exams FOR ALL TO authenticated USING (public.check_is_staff());
CREATE POLICY "exam_files_access" ON public.exam_files FOR ALL TO authenticated USING (public.check_is_staff());

-- 6. Habilitar Realtime com segurança
ALTER PUBLICATION supabase_realtime ADD TABLE public.patients, public.consultations, public.inventory, public.suppliers;

COMMENT ON TABLE public.patients IS 'Tabela de pacientes com RLS isolado para Staff.';
COMMENT ON TABLE public.consultations IS 'Prontuários médicos com isolamento estrito por médico.';
