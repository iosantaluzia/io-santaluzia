# 🚀 Executar SQL para Criar Tabela Waitlist

Como você não consegue acessar o Supabase Dashboard, aqui estão **3 alternativas**:

## ✅ Opção 1: Usar a Página HTML (Mais Fácil)

1. Abra o arquivo: `public/execute-waitlist-sql.html` no seu navegador
2. Clique em "Copiar SQL"
3. Use um método alternativo para acessar o Supabase (veja opção 2 ou 3)

## ✅ Opção 2: Usar Supabase CLI (Recomendado)

Se você tiver o Supabase CLI instalado e linkado:

```bash
# 1. Linkar ao projeto (se ainda não estiver linkado)
npx supabase link --project-ref aobjtwikccovikmfoicg

# 2. Aplicar migrations
npx supabase db push
```

## ✅ Opção 3: Executar via Código (Alternativa)

Crie um arquivo temporário e execute via Node.js:

```javascript
// temp-execute-sql.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://aobjtwikccovikmfoicg.supabase.co',
  'SUA_SERVICE_ROLE_KEY_AQUI' // Você precisa obter do Supabase
);

// Infelizmente, o cliente Supabase não permite executar SQL direto
// Esta é uma limitação de segurança
```

## 📋 SQL para Executar

Se conseguir acesso ao Dashboard ou usar outro método, execute este SQL:

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

-- Políticas RLS
CREATE POLICY "Allow authenticated users to view waitlist" ON public.waitlist
FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert waitlist" ON public.waitlist
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update waitlist" ON public.waitlist
FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated users to delete waitlist" ON public.waitlist
FOR DELETE USING (true);

-- Índices
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON public.waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_patient_id ON public.waitlist(patient_id);
```

## 🔧 Problema ao Acessar o Dashboard?

Se você está tendo problemas para acessar o Supabase Dashboard:

1. **Verifique sua conexão**: Teste acessar https://supabase.com
2. **Tente navegador diferente**: Chrome, Firefox, Edge
3. **Limpe cache e cookies**: Pode ser um problema de autenticação
4. **Use modo anônimo**: Para evitar problemas de cache
5. **Verifique firewall**: Alguns firewalls bloqueiam o Supabase

## 💡 Solução Temporária

**A aplicação já está preparada para funcionar SEM a tabela!**

- O código trata erros graciosamente
- Mostra lista vazia se a tabela não existir
- Não quebra a aplicação
- Você pode adicionar pacientes manualmente quando a tabela for criada

## 📞 Precisa de Ajuda?

Se nenhuma das opções funcionar, você pode:
1. Pedir para alguém com acesso ao Supabase executar o SQL
2. Usar um dispositivo diferente para acessar o Dashboard
3. Aguardar até conseguir acesso ao Dashboard

