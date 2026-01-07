-- Inserir pacientes e consultas reais dos dias 06/01/2026 e 07/01/2026
-- Remover dados fake do Dr. Matheus

-- =====================================================
-- 1. REMOVER CONSULTAS FAKE DO DR. MATHEUS
-- =====================================================
-- Remover consultas fake (manter apenas as reais que serão inseridas abaixo)
DELETE FROM consultations 
WHERE doctor_name = 'Dr. Matheus' 
AND (anamnesis IS NULL OR anamnesis = '' OR anamnesis LIKE '%fake%' OR anamnesis LIKE '%demonstração%');

-- =====================================================
-- 2. CRIAR/ATUALIZAR PACIENTES
-- =====================================================

-- Bruno Ferreira Medeiros (já existe, mas vamos garantir que está correto)
INSERT INTO patients (id, name, cpf, date_of_birth, created_by)
VALUES ('fda615f4-7898-4669-b222-7334212ca00e', 'Bruno Ferreira Medeiros', '042.674.161-76', '1996-12-30', 'sistema')
ON CONFLICT (cpf) DO UPDATE 
SET name = EXCLUDED.name, date_of_birth = EXCLUDED.date_of_birth;

-- Valdir Taffarel
INSERT INTO patients (name, cpf, date_of_birth, created_by)
VALUES ('Valdir Taffarel', '001.375.138-79', '1941-02-18', 'sistema')
ON CONFLICT (cpf) DO UPDATE 
SET name = EXCLUDED.name, date_of_birth = EXCLUDED.date_of_birth;

-- Rubens Temistocles Caleffi
INSERT INTO patients (name, cpf, date_of_birth, phone, address, created_by)
VALUES (
  'Rubens Temistocles Caleffi', 
  '18343724968', 
  '1949-11-24',
  '(66) 99669-4006',
  'Estrada Selene, km5 - Sítio Santa Fé, Zona Rural, Sinop-MT',
  'sistema'
)
ON CONFLICT (cpf) DO UPDATE 
SET name = EXCLUDED.name, date_of_birth = EXCLUDED.date_of_birth, phone = EXCLUDED.phone, address = EXCLUDED.address;

-- Fabiane (sem CPF completo fornecido - vamos usar um CPF temporário ou deixar NULL se necessário)
-- Como não temos CPF completo, vamos criar com um identificador único
INSERT INTO patients (name, cpf, date_of_birth, created_by)
SELECT 'Fabiane', 'TEMP_FABIANE_' || gen_random_uuid()::text, '1984-01-01', 'sistema'
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE name = 'Fabiane' AND cpf LIKE 'TEMP_FABIANE_%')
LIMIT 1;

-- Wesley Ribeiro Lima (sem CPF fornecido)
INSERT INTO patients (name, cpf, date_of_birth, created_by)
SELECT 'Wesley Ribeiro Lima', 'TEMP_WESLEY_' || gen_random_uuid()::text, '1992-01-01', 'sistema'
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE name = 'Wesley Ribeiro Lima' AND cpf LIKE 'TEMP_WESLEY_%')
LIMIT 1;

-- Leila Anselmo da Silva Santos
INSERT INTO patients (name, cpf, date_of_birth, phone, address, created_by)
VALUES (
  'Leila Anselmo da Silva Santos',
  '79623611153',
  '1976-03-31',
  '(66) 99936-4243',
  'Rua Zumira Paiva, 315, Nossa Senhora Aparecida, Sinop-MT',
  'sistema'
)
ON CONFLICT (cpf) DO UPDATE 
SET name = EXCLUDED.name, date_of_birth = EXCLUDED.date_of_birth, phone = EXCLUDED.phone, address = EXCLUDED.address;

-- =====================================================
-- 3. CRIAR CONSULTAS REAIS
-- =====================================================

-- Consulta 1: Bruno Ferreira Medeiros - 06/01/2026 08:30
INSERT INTO consultations (
  patient_id,
  doctor_name,
  consultation_date,
  anamnesis,
  visual_acuity_od,
  visual_acuity_oe,
  biomicroscopy,
  prescription,
  status,
  created_by
)
SELECT 
  p.id,
  'Dr. Matheus',
  '2026-01-06 08:30:00-04:00',
  'Paciente com CERATOCONE AO, COM CXL AO E ANEL INTRAESTROMAL NO OE. ESTÁ COM DOR HÁ 2 DIAS E EM USO DE MAXIFLOX E SYSTANE',
  '20/150P',
  '20/',
  'OD: ULCERA CENTRAL 5X3mm, SRCA, OPACIDADE CENTRAL, DEMAIS SP',
  'VIGAMOX 2/2H, LBF E RETORNO EM 1 DIA',
  'completed',
  'sistema'
FROM patients p
WHERE p.cpf = '042.674.161-76'
AND NOT EXISTS (
  SELECT 1 FROM consultations c 
  WHERE c.patient_id = p.id 
  AND c.consultation_date = '2026-01-06 08:30:00-04:00'
  AND c.doctor_name = 'Dr. Matheus'
);

-- Consulta 2: Valdir Taffarel - 06/01/2026 09:00
INSERT INTO consultations (
  patient_id,
  doctor_name,
  consultation_date,
  anamnesis,
  visual_acuity_od,
  visual_acuity_oe,
  biomicroscopy,
  fundus_exam,
  prescription,
  status,
  created_by
)
SELECT 
  p.id,
  'Dr. Matheus',
  '2026-01-06 09:00:00-04:00',
  'PACIENTE REFERE VERMELHIDÃO E DOR NO OLHO ESQUERDO. HMP: HAS, DM E ANGIOPLASTIA.',
  '20/25',
  '20/25P',
  'OD: PSF, LIO TÓPICA, SRCA, CAF. OE: OPACIDADE ESTROMAL CENTRAL, CERATITE PUNTACTA, SRCA, PSF, LIO TÓPICA, PUPILAS ISOFOTO REAGENTES.',
  'FO AO: SP',
  'GANCICLOVIR POMADA 5X/DIA, E VIGAMOX 4X/DIA. RETORNO EM 3 DIAS',
  'completed',
  'sistema'
FROM patients p
WHERE p.cpf = '001.375.138-79'
AND NOT EXISTS (
  SELECT 1 FROM consultations c 
  WHERE c.patient_id = p.id 
  AND c.consultation_date = '2026-01-06 09:00:00-04:00'
  AND c.doctor_name = 'Dr. Matheus'
);

-- Consulta 3: Rubens Temistocles Caleffi - 07/01/2026 08:00
INSERT INTO consultations (
  patient_id,
  doctor_name,
  consultation_date,
  anamnesis,
  visual_acuity_od,
  visual_acuity_oe,
  biomicroscopy,
  fundus_exam,
  amount,
  payment_received,
  status,
  created_by
)
SELECT 
  p.id,
  'Dr. Matheus',
  '2026-01-07 08:00:00-04:00',
  'Refere dor forte em olho direito há 1 dia. HMP: HERPES ZOSTER, DM, HAS, HPB.',
  '20/80',
  '20/40',
  'BIO OD: C.E CENTRAL, HC 2+/4, DEMAIS SP. BIO AO: CAT INCIPIENTE',
  'FO AO: SP',
  300.00,
  true,
  'completed',
  'sistema'
FROM patients p
WHERE p.cpf = '18343724968'
AND NOT EXISTS (
  SELECT 1 FROM consultations c 
  WHERE c.patient_id = p.id 
  AND c.consultation_date = '2026-01-07 08:00:00-04:00'
  AND c.doctor_name = 'Dr. Matheus'
);

-- Consulta 4: Fabiane - 07/01/2026 08:30
INSERT INTO consultations (
  patient_id,
  doctor_name,
  consultation_date,
  anamnesis,
  visual_acuity_od,
  visual_acuity_oe,
  biomicroscopy,
  fundus_exam,
  prescription,
  status,
  created_by
)
SELECT 
  p.id,
  'Dr. Matheus',
  '2026-01-07 08:30:00-04:00',
  'REFERE BAV PARA LONGE, HÁ 10 ANOS. HMP: HIPOTIREOIDISMO. HXF: GLAUCOMA AVÔ',
  '20/80',
  '20/80',
  'BIO AO: SP',
  'FO AO: SP',
  'RX: -5.25 -0.50 90° OD / -5.00 -0.50 45° OE. PRESCREVO RX. ORIENTAÇÕES GERAIS',
  'completed',
  'sistema'
FROM patients p
WHERE p.name = 'Fabiane' AND p.cpf LIKE 'TEMP_FABIANE_%'
AND NOT EXISTS (
  SELECT 1 FROM consultations c 
  WHERE c.patient_id = p.id 
  AND c.consultation_date = '2026-01-07 08:30:00-04:00'
  AND c.doctor_name = 'Dr. Matheus'
)
LIMIT 1;

-- Consulta 5: Bruno Ferreira Medeiros (Retorno) - 07/01/2026 09:00
INSERT INTO consultations (
  patient_id,
  doctor_name,
  consultation_date,
  anamnesis,
  visual_acuity_od,
  visual_acuity_oe,
  biomicroscopy,
  prescription,
  status,
  created_by
)
SELECT 
  p.id,
  'Dr. Matheus',
  '2026-01-07 09:00:00-04:00',
  'Paciente com CERATOCONE AO, COM CXL AO E ANEL INTRAESTROMAL NO OE. >> MELHORA DA DOR, EM USO DE VIGAMOX 2/2H',
  '20/150P',
  '20/',
  'OD: sem ulcera, SRCA, OPACIDADE CENTRAL, DEMAIS SP',
  'MANTENHO VIGAMOX 2/2H, LBF E RETORNO EM 1 DIA',
  'completed',
  'sistema'
FROM patients p
WHERE p.cpf = '042.674.161-76'
AND NOT EXISTS (
  SELECT 1 FROM consultations c 
  WHERE c.patient_id = p.id 
  AND c.consultation_date = '2026-01-07 09:00:00-04:00'
  AND c.doctor_name = 'Dr. Matheus'
);

-- Consulta 6: Wesley Ribeiro Lima - 07/01/2026 09:30
INSERT INTO consultations (
  patient_id,
  doctor_name,
  consultation_date,
  anamnesis,
  visual_acuity_od,
  visual_acuity_oe,
  biomicroscopy,
  fundus_exam,
  prescription,
  status,
  created_by
)
SELECT 
  p.id,
  'Dr. Matheus',
  '2026-01-07 09:30:00-04:00',
  'REFERE BAV PARA LONGE HÁ 1 ANO. HMP: HAS',
  '20/30',
  '20/30',
  'BIO AO: SP',
  'FO AO: SP',
  'RX: -0.25 -1.00 165° OD / -0.50 -1.25 25° OE. PRESCREVO RX E LBF. ORIENTAÇÕES GERAIS',
  'completed',
  'sistema'
FROM patients p
WHERE p.name = 'Wesley Ribeiro Lima' AND p.cpf LIKE 'TEMP_WESLEY_%'
AND NOT EXISTS (
  SELECT 1 FROM consultations c 
  WHERE c.patient_id = p.id 
  AND c.consultation_date = '2026-01-07 09:30:00-04:00'
  AND c.doctor_name = 'Dr. Matheus'
)
LIMIT 1;

-- Consulta 7: Leila Anselmo da Silva Santos - 07/01/2026 14:00
INSERT INTO consultations (
  patient_id,
  doctor_name,
  consultation_date,
  anamnesis,
  visual_acuity_od,
  visual_acuity_oe,
  biomicroscopy,
  fundus_exam,
  prescription,
  amount,
  payment_received,
  status,
  created_by
)
SELECT 
  p.id,
  'Dr. Matheus',
  '2026-01-07 14:00:00-04:00',
  'REFERE BAV PARA PERTO. HMP: HAS.',
  '20/20P',
  '20/20P',
  'BIO AO: SP',
  'FO AO: SP',
  'RX: +0.50 ESF OD / +0.75 ESF OE / ADD: +2.00. PRESCREVO RX. ORIENTAÇÕES GERAIS.',
  350.00,
  true,
  'completed',
  'sistema'
FROM patients p
WHERE p.cpf = '79623611153'
AND NOT EXISTS (
  SELECT 1 FROM consultations c 
  WHERE c.patient_id = p.id 
  AND c.consultation_date = '2026-01-07 14:00:00-04:00'
  AND c.doctor_name = 'Dr. Matheus'
);

