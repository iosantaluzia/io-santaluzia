-- ============================================================
-- Script: normalizar telefones de pacientes no banco
-- Objetivo: adicionar DDD 66 nos números sem DDD (8 ou 9 dígitos)
--           e formatar no padrão (xx) xxxxx-xxxx
-- ============================================================

-- 1. Ver como estão os telefones hoje (diagnóstico)
SELECT
  id,
  name,
  phone,
  length(regexp_replace(phone, '\D', '', 'g')) AS digitos
FROM patients
WHERE phone IS NOT NULL
  AND phone != ''
ORDER BY digitos, name;

-- ============================================================
-- 2. Atualizar: adicionar DDD 66 nos números com 8 dígitos (fixo sem DDD)
-- ============================================================
UPDATE patients
SET phone = '(66) ' || regexp_replace(phone, '\D', '', 'g')
WHERE phone IS NOT NULL
  AND length(regexp_replace(phone, '\D', '', 'g')) = 8;

-- Formatar os que ficaram com 10 dígitos (66 + 8 = 10): (xx) xxxx-xxxx
UPDATE patients
SET phone = '(' || substr(regexp_replace(phone, '\D', '', 'g'), 1, 2) || ') '
          || substr(regexp_replace(phone, '\D', '', 'g'), 3, 4) || '-'
          || substr(regexp_replace(phone, '\D', '', 'g'), 7, 4)
WHERE phone IS NOT NULL
  AND length(regexp_replace(phone, '\D', '', 'g')) = 10
  AND phone NOT LIKE '(%';

-- ============================================================
-- 3. Atualizar: adicionar DDD 66 nos números com 9 dígitos (celular sem DDD)
-- ============================================================
UPDATE patients
SET phone = regexp_replace(phone, '\D', '', 'g')
WHERE phone IS NOT NULL
  AND length(regexp_replace(phone, '\D', '', 'g')) = 9;

UPDATE patients
SET phone = '(' || '66' || ') ' || substr(phone, 1, 5) || '-' || substr(phone, 6, 4)
WHERE phone IS NOT NULL
  AND length(phone) = 9  -- só dígitos após normalização acima
  AND phone ~ '^\d{9}$';

-- ============================================================
-- 4. Formatar TODOS os números não formatados → (xx) xxxxx-xxxx
-- ============================================================

-- Celulares com 11 dígitos sem formatação
UPDATE patients
SET phone = '(' || substr(regexp_replace(phone, '\D', '', 'g'), 1, 2) || ') '
          || substr(regexp_replace(phone, '\D', '', 'g'), 3, 5) || '-'
          || substr(regexp_replace(phone, '\D', '', 'g'), 8, 4)
WHERE phone IS NOT NULL
  AND length(regexp_replace(phone, '\D', '', 'g')) = 11
  AND phone NOT LIKE '(%';

-- ============================================================
-- 5. Verificação final
-- ============================================================
SELECT
  name,
  phone,
  length(regexp_replace(phone, '\D', '', 'g')) AS digitos
FROM patients
WHERE phone IS NOT NULL
ORDER BY digitos, name;
