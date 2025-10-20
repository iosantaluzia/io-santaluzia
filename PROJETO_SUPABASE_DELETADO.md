# 🚨 PROBLEMA: Projeto Supabase Não Encontrado

## 🔍 **Diagnóstico Confirmado:**

```bash
✅ supabase.co → 76.76.21.21 (OK)
❌ aobjtwikccovikmfoicg.supabase.co → Non-existent domain (NÃO EXISTE)
```

**O projeto Supabase foi deletado, pausado ou o domínio mudou!**

---

## ✅ **SOLUÇÃO URGENTE:**

### **PASSO 1: Verificar no Dashboard do Supabase**

1. **Acesse:** https://supabase.com/dashboard/sign-in
2. **Faça login** com sua conta
3. **Verifique:**
   - ❓ O projeto **`aobjtwikccovikmfoicg`** ainda aparece na lista?
   - ❓ Ele está marcado como **"Paused"** (Pausado)?
   - ❓ Existe um aviso de que foi deletado?

---

### **CENÁRIO 1: Projeto Pausado** ⏸️

Se o projeto está pausado:

1. Clique no projeto
2. Procure por um botão **"Resume"** ou **"Restore"**
3. Clique para reativar
4. Aguarde 5-10 minutos
5. Teste o site novamente

---

### **CENÁRIO 2: Projeto Deletado** 🗑️

Se o projeto foi deletado, você precisa:

#### **Opção A: Restaurar Backup (se disponível)**
1. No dashboard, procure por **"Backups"**
2. Se houver backup recente, restaure

#### **Opção B: Criar Novo Projeto**

Se não houver backup, você precisa **criar um novo projeto**:

1. No dashboard do Supabase, clique em **"New Project"**
2. Escolha o nome: `io-santaluzia` (ou qualquer nome)
3. Escolha a região mais próxima: **South America (São Paulo)**
4. Crie uma senha forte para o banco
5. Clique em **"Create new project"**
6. Aguarde 2-5 minutos

**DEPOIS:**

1. Vá em **Settings** → **API**
2. Copie a **URL** e a **anon public key**
3. Atualize as variáveis de ambiente:
   - No código local: arquivo `.env`
   - No Vercel: Settings → Environment Variables

---

### **CENÁRIO 3: Domínio Mudou** 🔄

Se você tem outro projeto ativo:

1. No dashboard, clique no projeto correto
2. Vá em **Settings** → **API**
3. Copie:
   - **Project URL**
   - **Project API keys** → **anon/public**
4. Atualize o código

---

## 📝 **Se for criar novo projeto, use este checklist:**

### **Após criar o novo projeto:**

```sql
-- Execute no SQL Editor do Supabase:

-- 1. Criar tipo de usuário
CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'secretary');

-- 2. Criar tabela app_users
CREATE TABLE public.app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'secretary',
  approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by VARCHAR(50),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 3. Habilitar RLS
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- 4. Criar política RLS
CREATE POLICY "Allow read access to app_users" ON public.app_users
FOR SELECT USING (true);

-- 5. Inserir usuários
INSERT INTO public.app_users (username, role, approved, created_by) VALUES
  ('matheus', 'doctor', true, 'system'),
  ('fabiola', 'doctor', true, 'system'),
  ('iosantaluzia', 'secretary', true, 'system'),
  ('financeiro', 'secretary', true, 'system');
```

### **Criar contas de autenticação:**

No Supabase Dashboard:
1. Vá em **Authentication** → **Users**
2. Clique em **"Add user"** → **"Create new user"**
3. Crie para cada usuário:

```
Email: matheus@iosantaluzia.com
Password: iosantaluzia
Auto Confirm User: ✅ SIM
```

```
Email: fabiola@iosantaluzia.com
Password: iosantaluzia
Auto Confirm User: ✅ SIM
```

```
Email: iosantaluzia@iosantaluzia.com
Password: iosantaluzia
Auto Confirm User: ✅ SIM
```

```
Email: financeiro@iosantaluzia.com
Password: iosantaluzia
Auto Confirm User: ✅ SIM
```

### **Vincular contas:**

```sql
-- Execute no SQL Editor:
UPDATE public.app_users 
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'matheus@iosantaluzia.com')
WHERE username = 'matheus';

UPDATE public.app_users 
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'fabiola@iosantaluzia.com')
WHERE username = 'fabiola';

UPDATE public.app_users 
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'iosantaluzia@iosantaluzia.com')
WHERE username = 'iosantaluzia';

UPDATE public.app_users 
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'financeiro@iosantaluzia.com')
WHERE username = 'financeiro';
```

---

## 🔧 **Atualizar o Código:**

Depois de ter as novas credenciais:

### **1. Arquivo `.env` (local):**
```env
VITE_SUPABASE_URL=https://[SEU-NOVO-PROJETO].supabase.co
VITE_SUPABASE_ANON_KEY=[SUA-NOVA-CHAVE]
```

### **2. No Vercel:**
1. Settings → Environment Variables
2. **DELETE** as variáveis antigas
3. **ADD** as novas com os novos valores
4. Marque todos os ambientes
5. Faça **Redeploy**

---

## 📞 **Próximo Passo AGORA:**

**ACESSE:** https://supabase.com/dashboard

**Me diga:**
1. ❓ O projeto `aobjtwikccovikmfoicg` aparece?
2. ❓ Está pausado ou deletado?
3. ❓ Você tem outros projetos ativos?

Com essa informação, posso te ajudar a restaurar ou reconfigurar! 🚀

