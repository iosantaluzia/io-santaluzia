# Instruções para Criar a Tabela Waitlist no Supabase

## Erro Atual
O erro indica que a tabela `waitlist` não existe no banco de dados Supabase:
```
Could not find the table 'public.waitlist' in the schema cache
```

## Solução

### Opção 1: Executar Script SQL no Dashboard do Supabase (Recomendado)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **SQL Editor** no menu lateral
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo `supabase/create_waitlist_table.sql`
6. Clique em **Run** para executar o script
7. Aguarde a confirmação de sucesso

### Opção 2: Usar Supabase CLI (Se configurado)

Se você tiver o Supabase CLI configurado e conectado ao projeto remoto:

```bash
# Aplicar migrations pendentes
npx supabase db push

# Ou aplicar migration específica
npx supabase migration up
```

### Opção 3: Executar SQL Manualmente

Copie e cole este SQL no SQL Editor do Supabase:

```sql
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

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_patient_id ON public.waitlist(patient_id);
```

## Verificação

Após executar o script, verifique se a tabela foi criada:

1. No Supabase Dashboard, vá para **Table Editor**
2. Verifique se a tabela `waitlist` aparece na lista
3. Recarregue a página da aplicação
4. Tente abrir o modal de Lista de Espera novamente

## Nota

O arquivo `supabase/create_waitlist_table.sql` contém o script completo com tratamento de erros e comentários.

