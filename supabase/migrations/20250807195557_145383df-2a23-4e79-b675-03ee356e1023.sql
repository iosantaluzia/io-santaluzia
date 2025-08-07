
-- Criar tabela de pacientes com dados completos
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  date_of_birth DATE NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  emergency_contact VARCHAR(255),
  emergency_phone VARCHAR(20),
  medical_history TEXT,
  allergies TEXT,
  medications TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by VARCHAR(255)
);

-- Criar tabela de consultas médicas
CREATE TABLE public.consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  doctor_name VARCHAR(255) NOT NULL,
  consultation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  anamnesis TEXT,
  physical_exam TEXT,
  visual_acuity_od VARCHAR(10),
  visual_acuity_oe VARCHAR(10),
  ocular_pressure_od VARCHAR(10),
  ocular_pressure_oe VARCHAR(10),
  biomicroscopy TEXT,
  diagnosis TEXT,
  prescription TEXT,
  observations TEXT,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by VARCHAR(255)
);

-- Criar enum para tipos de exames
CREATE TYPE public.exam_type AS ENUM (
  'pentacam',
  'campimetria',
  'topografia',
  'microscopia_especular',
  'oct',
  'retinografia',
  'angiofluoresceinografia',
  'ultrassom_ocular'
);

-- Criar tabela de exames de pacientes
CREATE TABLE public.patient_exams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  exam_type public.exam_type NOT NULL,
  exam_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  doctor_name VARCHAR(255),
  description TEXT,
  results TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by VARCHAR(255)
);

-- Criar tabela para arquivos de exames
CREATE TABLE public.exam_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_exam_id UUID REFERENCES public.patient_exams(id) ON DELETE CASCADE NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploaded_by VARCHAR(255)
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_files ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para patients
CREATE POLICY "Allow authenticated users to view patients" ON public.patients
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert patients" ON public.patients
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update patients" ON public.patients
FOR UPDATE USING (true);

-- Políticas RLS para consultations
CREATE POLICY "Allow authenticated users to view consultations" ON public.consultations
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert consultations" ON public.consultations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update consultations" ON public.consultations
FOR UPDATE USING (true);

-- Políticas RLS para patient_exams
CREATE POLICY "Allow authenticated users to view patient_exams" ON public.patient_exams
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert patient_exams" ON public.patient_exams
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update patient_exams" ON public.patient_exams
FOR UPDATE USING (true);

-- Políticas RLS para exam_files
CREATE POLICY "Allow authenticated users to view exam_files" ON public.exam_files
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert exam_files" ON public.exam_files
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update exam_files" ON public.exam_files
FOR UPDATE USING (true);

-- Inserir alguns dados de exemplo
INSERT INTO public.patients (name, cpf, date_of_birth, phone, email, allergies, medical_history) VALUES
('João da Silva', '123.456.789-00', '1980-03-15', '(11) 99999-9999', 'joao@email.com', 'Nenhuma conhecida', 'Hipertensão arterial'),
('Maria Oliveira', '987.654.321-00', '1992-07-22', '(11) 88888-8888', 'maria@email.com', 'Penicilina', 'Diabetes tipo 2'),
('Pedro Santos', '456.789.123-00', '1975-11-01', '(11) 77777-7777', 'pedro@email.com', 'Sulfamida', 'Histórico de glaucoma familiar'),
('Ana Costa', '321.654.987-00', '1988-05-10', '(11) 66666-6666', 'ana@email.com', 'Nenhuma conhecida', 'Miopia alta'),
('Carlos Ferreira', '654.321.789-00', '1970-12-25', '(11) 55555-5555', 'carlos@email.com', 'Aspirina', 'Catarata bilateral');

-- Inserir algumas consultas de exemplo
INSERT INTO public.consultations (patient_id, doctor_name, consultation_date, anamnesis, diagnosis, prescription, visual_acuity_od, visual_acuity_oe, ocular_pressure_od, ocular_pressure_oe) VALUES
((SELECT id FROM public.patients WHERE cpf = '123.456.789-00'), 'Dr. Matheus', '2024-01-10 10:30:00', 'Paciente relata visão embaçada', 'Miopia progressiva', 'Óculos -2.50 OD, -2.25 OE', '20/40', '20/30', '14', '15'),
((SELECT id FROM public.patients WHERE cpf = '987.654.321-00'), 'Dra. Fabíola', '2023-12-05 14:15:00', 'Consulta de rotina', 'Astigmatismo estável', 'Manter óculos atual', '20/25', '20/20', '16', '17'),
((SELECT id FROM public.patients WHERE cpf = '456.789.123-00'), 'Dr. Matheus', '2024-02-20 09:00:00', 'Dificuldade para leitura', 'Presbiopia', 'Óculos multifocal', '20/60', '20/50', '18', '19');

-- Inserir alguns exames de exemplo
INSERT INTO public.patient_exams (patient_id, exam_type, exam_date, doctor_name, description, status) VALUES
((SELECT id FROM public.patients WHERE cpf = '123.456.789-00'), 'pentacam', '2024-01-10 11:00:00', 'Dr. Matheus', 'Análise topográfica da córnea', 'completed'),
((SELECT id FROM public.patients WHERE cpf = '987.654.321-00'), 'campimetria', '2023-12-05 15:00:00', 'Dra. Fabíola', 'Exame de campo visual', 'completed'),
((SELECT id FROM public.patients WHERE cpf = '456.789.123-00'), 'oct', '2024-02-20 10:30:00', 'Dr. Matheus', 'Tomografia de coerência óptica', 'completed');
