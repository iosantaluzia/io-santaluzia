# 🚀 Deploy Rápido - Checklist

## ⚠️ PROBLEMA DETECTADO:

```
❌ VITE_SUPABASE_ANON_KEY from env: ❌ Missing
```

**A chave ANON_KEY está FALTANDO no Vercel!**

---

## ✅ SOLUÇÃO - Faça AGORA:

### PASSO 1: Adicionar a Variável Faltando no Vercel

**Acesse:** https://vercel.com/oftalmologias-projects/io-santaluzia/settings/environment-variables

**Clique em "Add New"**

**Adicione esta variável:**

```
Name: 
VITE_SUPABASE_ANON_KEY

Value:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvYmp0d2lrY2NvdmlrbWZvaWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzQ1MDksImV4cCI6MjA3MDE1MDUwOX0.eEBwMUzQxO-6kjSjqpLzi10dklAOWna1Mc5Q85MRbw4

Environments:
☑️ Production
☑️ Preview
☑️ Development
```

**Clique em SAVE**

---

### PASSO 2: Fazer Redeploy

1. Vá em **Deployments**
2. Clique nos **3 pontos (...)** do último deployment
3. Clique em **"Redeploy"**
4. **Aguarde 2-3 minutos**

---

### PASSO 3: Testar

1. Aguarde o deploy mostrar ✓ Ready
2. Acesse o site
3. Pressione **Ctrl + Shift + R** (limpa cache)
4. Abra o Console (F12)
5. Procure por:
   ```
   ✅ VITE_SUPABASE_URL from env: https://...
   ✅ VITE_SUPABASE_ANON_KEY from env: ✅ Exists
   ```
6. Tente fazer login

---

## 📋 Checklist Final:

Você deve ter EXATAMENTE 2 variáveis no Vercel:

```
1️⃣ VITE_SUPABASE_URL
   Value: https://aobjtwikccovikmfoicg.supabase.co
   
2️⃣ VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6... (string longa)
```

**Ambas com:**
- ✅ Production
- ✅ Preview
- ✅ Development

---

## 🎯 Depois de Adicionar e Fazer Redeploy:

**Me mande os logs do Console novamente!**

Deve aparecer:
```
✅ VITE_SUPABASE_ANON_KEY from env: ✅ Exists
```

Se aparecer isso, o login vai funcionar! 🎉

