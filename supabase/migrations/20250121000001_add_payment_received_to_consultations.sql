-- Adicionar campo de status de pagamento nas consultas
ALTER TABLE public.consultations 
ADD COLUMN IF NOT EXISTS payment_received BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.consultations.payment_received IS 'Indica se o pagamento foi realizado (true) ou não (false)';

