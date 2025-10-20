# 🚀 Solução Automática - Evitar Pausa do Supabase

## 🔍 **Problema:**

O Supabase **pausa projetos automaticamente** após **7 dias de inatividade** no plano gratuito.

## ✅ **Solução Implementada:**

Criamos um **Cron Job no Vercel** que faz "ping" no Supabase a cada **3 dias** para mantê-lo sempre ativo!

---

## 📋 **Como Funciona:**

### **1. Função Serverless (Keep-Alive)**

**Arquivo:** `api/keep-supabase-alive.ts`

Esta função:
- ✅ Faz requisição ao Supabase REST API
- ✅ Verifica o Auth Health endpoint
- ✅ Registra logs de sucesso/erro
- ✅ Mantém o projeto ativo

### **2. Cron Job do Vercel**

**Arquivo:** `vercel.json`

Configuração:
```json
"crons": [
  {
    "path": "/api/keep-supabase-alive",
    "schedule": "0 */72 * * *"
  }
]
```

**Tradução:** Executa a cada 72 horas (3 dias)

---

## ⚙️ **Configuração no Vercel:**

### **IMPORTANTE: Ativar Cron Jobs (APENAS UMA VEZ)**

Os Cron Jobs do Vercel estão disponíveis em **todos os planos**, mas precisam ser ativados:

1. **Acesse:** https://vercel.com/oftalmologias-projects/io-santaluzia/settings/crons
2. **Ou:** Settings → Crons
3. Você verá a tarefa `keep-supabase-alive` listada
4. O cron job será ativado automaticamente após o próximo deploy

**⚠️ NOTA:** Cron Jobs são executados apenas em **Production**, não em Preview/Development.

---

## 📅 **Frequência do Ping:**

| Evento | Quando |
|--------|--------|
| **Supabase pausa** | Após 7 dias sem uso |
| **Nosso ping** | A cada 3 dias (72h) |
| **Status** | ✅ Projeto sempre ativo |

**Margem de segurança:** 4 dias (7 - 3 = 4 dias de folga)

---

## 🧪 **Testar Manualmente:**

### **Após o deploy, teste:**

```bash
# Substituir pelo seu domínio real
curl https://io-santaluzia.vercel.app/api/keep-supabase-alive
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Supabase keep-alive ping successful",
  "timestamp": "2025-10-20T...",
  "supabaseUrl": "https://aobjtwikccovikmfoicg.supabase.co",
  "restApiStatus": 200,
  "authHealth": {...}
}
```

---

## 📊 **Monitorar Cron Jobs:**

### **No Vercel:**

1. Vá em **Deployments**
2. Clique no deployment em Production
3. Vá em **Functions**
4. Você verá logs das execuções do cron

### **Verificar se está funcionando:**

Os logs aparecerão assim:
```
🔄 Keep-alive ping iniciado: 2025-10-20T...
✅ Ping bem-sucedido!
REST API Status: 200
Auth Status: {...}
```

---

## 🔄 **Alterar Frequência (Opcional):**

Se quiser mudar a frequência, edite `vercel.json`:

```json
"schedule": "0 */72 * * *"  // A cada 3 dias (padrão)
"schedule": "0 */48 * * *"  // A cada 2 dias (mais seguro)
"schedule": "0 */24 * * *"  // A cada 1 dia (máxima segurança)
"schedule": "0 0 * * *"     // Todo dia à meia-noite
```

**Formato:** Cron Expression (minuto hora dia mês dia-da-semana)

---

## 💰 **Custos:**

### **Vercel:**
- ✅ **GRÁTIS** no plano Hobby
- Cron Jobs incluídos
- Uso mínimo de recursos

### **Supabase:**
- ✅ **GRÁTIS** no plano Free
- Mantém projeto ativo
- Sem custos adicionais

**Total: R$ 0,00 / mês** 🎉

---

## 🎯 **Alternativas (Se preferir):**

### **1. Upgrade para Supabase Pro**
- **Custo:** ~$25/mês
- **Vantagem:** Nunca pausa automaticamente
- **Recomendado para:** Produção crítica

### **2. Usar UptimeRobot (Externo)**
- **Site:** https://uptimerobot.com
- **Custo:** Grátis
- **Como:** Configurar monitor HTTP para `https://io-santaluzia.vercel.app/api/keep-supabase-alive`
- **Frequência:** A cada 5 minutos (mais que suficiente)

### **3. GitHub Actions**
- Criar workflow que executa a cada 3 dias
- Grátis no GitHub

---

## 🚀 **Próximos Passos:**

1. ✅ **Código já está pronto** (função + cron criados)
2. ⏳ **Aguardando:** Você fazer o commit e push
3. ⏳ **Aguardando:** Deploy no Vercel
4. ✅ **Automático:** Cron job ativa sozinho após deploy

---

## 📝 **Checklist:**

- [ ] Fazer commit dos arquivos novos
- [ ] Fazer push para GitHub
- [ ] Aguardar deploy no Vercel terminar
- [ ] Verificar em Settings → Crons se aparece
- [ ] Testar manualmente: `curl https://seu-site.vercel.app/api/keep-supabase-alive`
- [ ] Aguardar 3 dias e verificar logs

---

## 🎉 **Resultado:**

**Seu projeto Supabase NUNCA MAIS vai pausar automaticamente!** 🚀

O sistema fará ping automaticamente a cada 3 dias, mantendo o projeto sempre ativo.

---

**Última atualização:** 20 de outubro de 2025

