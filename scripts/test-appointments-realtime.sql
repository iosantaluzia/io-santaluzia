-- Script para testar se o Realtime está funcionando para agendamentos
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar se a tabela consultations está habilitada para Realtime
SELECT
  schemaname,
  tablename,
  attnames
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
AND tablename = 'consultations';

-- 2. Verificar se há consultas na tabela
SELECT
  id,
  patient_id,
  consultation_date,
  status,
  doctor_name,
  appointment_type,
  created_at
FROM public.consultations
ORDER BY created_at DESC
LIMIT 5;

-- 3. Testar inserção de nova consulta (substitua os valores pelos reais)
-- IMPORTANTE: Certifique-se de que o patient_id existe na tabela patients
-- Primeiro, verifique um patient_id existente:
SELECT id, name FROM public.patients LIMIT 1;

-- Exemplo de inserção (substitua o patient_id pelo valor real acima):
-- INSERT INTO public.consultations (
--   patient_id,
--   doctor_name,
--   consultation_date,
--   status,
--   appointment_type,
--   observations
-- ) VALUES (
--   'patient_id_real', -- substitua pelo ID real de um paciente
--   'Dra. Fabíola',
--   (NOW() + INTERVAL '1 day')::timestamp,
--   'scheduled',
--   'consulta',
--   'Teste de atualização em tempo real'
-- )
-- RETURNING *;

-- 4. Testar atualização de status (substitua o id pela consulta criada acima):
-- UPDATE public.consultations
-- SET status = 'completed'
-- WHERE id = 'id_da_consulta_criada_acima'
-- RETURNING *;