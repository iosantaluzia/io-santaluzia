-- Criar tabela de lista de espera
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  observations TEXT,
  contact_attempts INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'waiting',
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  scheduled_consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by VARCHAR(255)
);

-- Habilitar RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para waitlist
CREATE POLICY "Allow authenticated users to view waitlist" ON public.waitlist
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert waitlist" ON public.waitlist
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update waitlist" ON public.waitlist
FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated users to delete waitlist" ON public.waitlist
FOR DELETE USING (true);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at);

