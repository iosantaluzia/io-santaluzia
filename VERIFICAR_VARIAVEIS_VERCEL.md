# 🔧 Verificação - Variáveis de Ambiente no Vercel

## ❌ Erro Detectado:

```
ERR_NAME_NOT_RESOLVED
aobjtwikccovikmfoicg.supabase.co/auth/v1/token
```

Isso significa que a URL do Supabase está **SEM o protocolo `https://`**.

---

## ✅ SOLUÇÃO - Siga estes passos:

### 1️⃣ Verificar no Vercel

Acesse: **https://vercel.com/oftalmologias-projects/io-santaluzia/settings/environment-variables**

Verifique se as variáveis estão **EXATAMENTE assim:**

#### ✅ Variável 1 - CORRETA:
```
Name: VITE_SUPABASE_URL
Value: https://aobjtwikccovikmfoicg.supabase.co
         ^^^^^^^^ TEM QUE TER O https://
```

#### ❌ Variável 1 - ERRADA (sem https://):
```
Name: VITE_SUPABASE_URL
Value: aobjtwikccovikmfoicg.supabase.co
       ^^^^^^^^^^^^^^^^ FALTANDO https://
```

#### ✅ Variável 2 - CORRETA:
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvYmp0d2lrY2NvdmlrbWZvaWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzQ1MDksImV4cCI6MjA3MDE1MDUwOX0.eEBwMUzQxO-6kjSjqpLzi10dklAOWna1Mc5Q85MRbw4
```

**IMPORTANTE:** Ambas devem estar marcadas como:
- ✅ Production
- ✅ Preview  
- ✅ Development

---

### 2️⃣ Se a URL estava SEM `https://`:

1. **DELETE a variável `VITE_SUPABASE_URL` no Vercel**
2. **Adicione novamente COM `https://`:**
   ```
   https://aobjtwikccovikmfoicg.supabase.co
   ```
3. Marque os 3 ambientes (Production, Preview, Development)
4. Clique em **Save**

---

### 3️⃣ Fazer Redeploy

Após corrigir as variáveis:

**Opção A - Redeploy Manual (Mais Rápido):**
1. Vá em **Deployments** no Vercel
2. Clique nos 3 pontos (...) do último deployment
3. Clique em **"Redeploy"**
4. Aguarde 2-3 minutos

**Opção B - Via Git:**
```bash
git add .
git commit -m "fix: adicionar validação de protocolo https na URL do Supabase"
git push
```

---

### 4️⃣ Testar Novamente

1. Aguarde o deploy finalizar
2. Acesse o site
3. **IMPORTANTE:** Pressione **Ctrl + Shift + R** (limpa o cache)
4. Abra o Console (F12) e procure por:
   ```
   🔍 Debug Supabase Config:
   VITE_SUPABASE_URL from env: https://aobjtwikccovikmfoicg.supabase.co
   VITE_SUPABASE_ANON_KEY from env: ✅ Exists
   ✅ Final SUPABASE_URL: https://aobjtwikccovikmfoicg.supabase.co
   ```

5. Tente fazer login novamente

---

## 🆘 Ainda não funciona?

### Teste Local Primeiro:

Se o problema persistir no Vercel, teste localmente:

```bash
# 1. Pare o servidor se estiver rodando (Ctrl+C)

# 2. Limpe o cache do Vite
npm run build

# 3. Rode em modo de desenvolvimento
npm run dev

# 4. Acesse http://localhost:8080/admin-dashboard-santa-luzia
```

**Se funcionar localmente mas NÃO no Vercel:**
- As variáveis de ambiente no Vercel estão incorretas
- Ou não foi feito o redeploy após adicionar as variáveis

---

## 📸 Checklist Final:

- [ ] A variável `VITE_SUPABASE_URL` tem `https://` no início?
- [ ] A variável `VITE_SUPABASE_ANON_KEY` é uma string longa (~200 caracteres)?
- [ ] Ambas estão marcadas: Production ✓, Preview ✓, Development ✓?
- [ ] Clicou em "Save" em ambas?
- [ ] Fez o Redeploy após salvar as variáveis?
- [ ] Aguardou o deploy finalizar (status ✓ Ready)?
- [ ] Limpou o cache do navegador (Ctrl + Shift + R)?

Se todos os itens acima estão ✅, deve funcionar!

---

**🔧 Atualização no Código:**

Agora o código tem uma **proteção automática** que adiciona `https://` se a URL vier sem protocolo, mas é melhor configurar corretamente no Vercel.

