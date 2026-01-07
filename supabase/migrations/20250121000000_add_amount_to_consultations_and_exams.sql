-- Adicionar campo de valor pago nas consultas
ALTER TABLE public.consultations 
ADD COLUMN IF NOT EXISTS amount NUMERIC(10, 2) DEFAULT 0.00;

COMMENT ON COLUMN public.consultations.amount IS 'Valor pago pelo serviço de consulta em R$';

-- Adicionar campo de valor pago nos exames
ALTER TABLE public.patient_exams 
ADD COLUMN IF NOT EXISTS amount NUMERIC(10, 2) DEFAULT 0.00;

COMMENT ON COLUMN public.patient_exams.amount IS 'Valor pago pelo serviço de exame em R$';

