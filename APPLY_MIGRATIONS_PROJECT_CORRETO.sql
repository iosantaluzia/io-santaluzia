-- ============================================
-- MIGRAÇÕES PARA APLICAR NO PROJETO CORRETO
-- Projeto: aobjtwikccovikmfoicg.supabase.co
-- ============================================
-- 
-- INSTRUÇÕES:
-- 1. Acesse: https://supabase.com/dashboard/project/aobjtwikccovikmfoicg/sql
-- 2. Cole este SQL completo
-- 3. Execute
-- ============================================

-- Migração 1: Adicionar campo amount nas consultas e exames
ALTER TABLE public.consultations 
ADD COLUMN IF NOT EXISTS amount NUMERIC(10, 2) DEFAULT 0.00;

COMMENT ON COLUMN public.consultations.amount IS 'Valor pago pelo serviço de consulta em R$';

ALTER TABLE public.patient_exams 
ADD COLUMN IF NOT EXISTS amount NUMERIC(10, 2) DEFAULT 0.00;

COMMENT ON COLUMN public.patient_exams.amount IS 'Valor pago pelo serviço de exame em R$';

-- Migração 2: Adicionar campo payment_received nas consultas
ALTER TABLE public.consultations 
ADD COLUMN IF NOT EXISTS payment_received BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.consultations.payment_received IS 'Indica se o pagamento foi realizado (true) ou não (false)';

-- Migração 3: Criar função RPC para inserir consultas (contorna cache do PostgREST)
CREATE OR REPLACE FUNCTION insert_consultation_with_amount(
  p_patient_id UUID,
  p_doctor_name TEXT,
  p_consultation_date TIMESTAMPTZ,
  p_observations TEXT DEFAULT NULL,
  p_amount NUMERIC DEFAULT NULL,
  p_payment_received BOOLEAN DEFAULT FALSE,
  p_status TEXT DEFAULT 'scheduled',
  p_created_by TEXT DEFAULT 'sistema'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_consultation_id UUID;
BEGIN
  INSERT INTO public.consultations (
    patient_id,
    doctor_name,
    consultation_date,
    observations,
    amount,
    payment_received,
    status,
    created_by
  ) VALUES (
    p_patient_id,
    p_doctor_name,
    p_consultation_date,
    p_observations,
    p_amount,
    p_payment_received,
    p_status,
    p_created_by
  )
  RETURNING id INTO v_consultation_id;
  
  RETURN v_consultation_id;
END;
$$;

-- Verificar se as colunas foram criadas
SELECT 
  column_name, 
  data_type, 
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'consultations' 
  AND column_name IN ('amount', 'payment_received')
ORDER BY column_name;

