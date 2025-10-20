# Configuração Vercel + Supabase - Solução para "Fail to Fetch"

## 🔍 Problema Identificado

O erro "fail to fetch" ao acessar dados de usuários ocorre porque:

1. As credenciais do Supabase precisam ser configuradas como variáveis de ambiente no Vercel
2. O CORS pode estar bloqueando requisições do domínio do Vercel
3. As políticas RLS (Row Level Security) precisam estar corretamente configuradas

## 📋 Solução Passo a Passo

### 1️⃣ Configurar Variáveis de Ambiente no Vercel

1. Acesse seu projeto no Vercel: https://vercel.com/oftalmologias-projects/io-santaluzia
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:

```
VITE_SUPABASE_URL = https://aobjtwikccovikmfoicg.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvYmp0d2lrY2NvdmlrbWZvaWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzQ1MDksImV4cCI6MjA3MDE1MDUwOX0.eEBwMUzQxO-6kjSjqpLzi10dklAOWna1Mc5Q85MRbw4
```

**Importante:** 
- Marque para aplicar em **Production**, **Preview** e **Development**
- Clique em "Save" após adicionar cada variável

### 2️⃣ Configurar CORS no Supabase

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard/project/aobjtwikccovikmfoicg
2. Vá em **Settings** → **API**
3. Role até a seção **CORS**
4. Adicione seu domínio do Vercel:
   - `https://io-santaluzia.vercel.app` (ou seu domínio personalizado)
   - Adicione também `http://localhost:5173` para desenvolvimento local

### 3️⃣ Verificar Políticas RLS no Supabase

As políticas já estão configuradas no seu projeto, mas vamos verificar:

1. Acesse **Database** → **Policies** no Supabase
2. Verifique a tabela `app_users`:
   - ✅ Deve ter a política **"Allow read access to app_users"** ativa
   - ✅ Esta política permite `SELECT` para todos os usuários

### 4️⃣ Fazer Redeploy no Vercel

Após configurar as variáveis de ambiente:

1. Vá em **Deployments** no Vercel
2. Clique nos três pontos (...) do último deployment
3. Selecione **Redeploy**
4. Aguarde o deploy finalizar

**OU** faça um novo commit e push:

```bash
git add .
git commit -m "fix: configurar variáveis de ambiente do Supabase"
git push
```

### 5️⃣ Verificar se Funcionou

1. Acesse seu site: https://io-santaluzia.vercel.app (ou seu domínio)
2. Abra o Console do navegador (F12)
3. Tente fazer login
4. Verifique se não há mais erros de "fail to fetch"

## 🔍 Debug Adicional

Se o problema persistir, verifique no Console do navegador:

```javascript
// Cole isso no console para testar a conexão
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
```

### Possíveis Erros e Soluções

| Erro | Causa | Solução |
|------|-------|---------|
| `Missing Supabase configuration` | Variáveis de ambiente não configuradas | Adicione as variáveis no Vercel |
| `Failed to fetch` | CORS bloqueando | Configure o domínio no Supabase CORS |
| `Invalid API key` | Chave anônima incorreta | Verifique se copiou a chave completa |
| `Row level security` | RLS bloqueando acesso | Verifique as políticas na tabela |

## 📱 Testando Localmente

Para testar localmente após as mudanças:

```bash
# 1. Certifique-se de ter o arquivo .env na raiz do projeto
# (já foi criado automaticamente)

# 2. Instale as dependências
npm install

# 3. Rode em modo de desenvolvimento
npm run dev

# 4. Acesse http://localhost:5173
```

## 🔐 Segurança

As variáveis de ambiente agora estão configuradas corretamente:
- ✅ Não estão mais hardcoded no código
- ✅ Podem ser atualizadas sem alterar o código
- ✅ São diferentes por ambiente (dev, preview, production)

## 📞 Próximos Passos

1. [ ] Configurar variáveis de ambiente no Vercel
2. [ ] Configurar CORS no Supabase
3. [ ] Fazer redeploy
4. [ ] Testar o login no site
5. [ ] Verificar se os dados de usuários carregam corretamente

---

**Última atualização:** 20 de outubro de 2025

