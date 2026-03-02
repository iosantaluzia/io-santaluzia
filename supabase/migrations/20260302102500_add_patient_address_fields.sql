
-- Adicionar colunas faltantes na tabela patients
ALTER TABLE public.patients 
ADD COLUMN IF NOT EXISTS cep TEXT,
ADD COLUMN IF NOT EXISTS city TEXT;

COMMENT ON COLUMN public.patients.cep IS 'CEP do paciente';
COMMENT ON COLUMN public.patients.city IS 'Cidade do paciente';
