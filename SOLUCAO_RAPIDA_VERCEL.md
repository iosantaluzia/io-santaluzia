# 🚀 Solução Rápida - Erro "Fail to Fetch" no Vercel

## ⚡ O que foi feito automaticamente:

✅ Atualizado o código para usar variáveis de ambiente  
✅ Criado arquivo `.env.example` com as credenciais  
✅ Adicionado `.env` ao `.gitignore`

## 🎯 O que VOCÊ precisa fazer:

### PASSO 1: Configurar Variáveis no Vercel (5 minutos)

1. **Acesse seu projeto no Vercel:**
   - URL: https://vercel.com/oftalmologias-projects/io-santaluzia

2. **Entre em Settings:**
   - Clique em "Settings" no menu superior
   - Clique em "Environment Variables" no menu lateral

3. **Adicione as 2 variáveis abaixo:**

   **Variável 1:**
   ```
   Name: VITE_SUPABASE_URL
   Value: https://aobjtwikccovikmfoicg.supabase.co
   ```
   - Marque: ☑️ Production ☑️ Preview ☑️ Development
   - Clique em "Save"

   **Variável 2:**
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvYmp0d2lrY2NvdmlrbWZvaWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzQ1MDksImV4cCI6MjA3MDE1MDUwOX0.eEBwMUzQxO-6kjSjqpLzi10dklAOWna1Mc5Q85MRbw4
   ```
   - Marque: ☑️ Production ☑️ Preview ☑️ Development
   - Clique em "Save"

### PASSO 2: Fazer Deploy das Alterações

Escolha UMA das opções:

**Opção A - Via Git (Recomendado):**
```bash
git add .
git commit -m "fix: configurar Supabase com variáveis de ambiente"
git push
```
O Vercel vai fazer o deploy automaticamente.

**Opção B - Redeploy Manual:**
1. No Vercel, vá em "Deployments"
2. Clique nos 3 pontos (...) do último deployment
3. Clique em "Redeploy"

### PASSO 3: Testar

1. Aguarde o deploy finalizar (2-3 minutos)
2. Acesse seu site
3. Tente fazer login
4. ✅ Deve funcionar sem erro!

---

## 🆘 Ainda com erro?

### Checklist Rápido:

- [ ] As 2 variáveis estão no Vercel?
- [ ] Marcou Production, Preview e Development?
- [ ] Clicou em "Save" em cada uma?
- [ ] Fez o redeploy?
- [ ] Aguardou o deploy finalizar?

### Se ainda não funcionar:

1. **Verifique o Console do navegador (F12):**
   - Se ver "Missing Supabase configuration" → Variáveis não configuradas
   - Se ver "CORS error" → Veja solução CORS abaixo

2. **Configurar CORS no Supabase:**
   - Acesse: https://supabase.com/dashboard/project/aobjtwikccovikmfoicg/settings/api
   - Na seção "CORS", adicione seu domínio do Vercel
   - Exemplo: `https://io-santaluzia.vercel.app`

---

## 📝 Resumo Técnico

**Problema:** Credenciais hardcoded não funcionam corretamente no Vercel

**Solução:** Usar variáveis de ambiente (Environment Variables)

**Tempo estimado:** 5-10 minutos

**Dificuldade:** ⭐ Fácil

---

**Dúvidas?** Abra o arquivo `CONFIGURACAO_VERCEL_SUPABASE.md` para mais detalhes.

