# 🚀 Deploy da Edge Function Vapi Webhook

## ✅ Git Deploy Concluído

O código foi commitado e enviado para o repositório main:
- ✅ `src/components/VoiceChatButton.tsx`
- ✅ `supabase/functions/vapi-webhook/index.ts`
- ✅ `src/pages/Home.tsx`
- ✅ `CONFIGURACAO_VAPI.md`

## 📦 Deploy da Edge Function no Supabase

Como o Supabase CLI não está instalado localmente, você precisa fazer o deploy via Dashboard:

### Opção 1: Via Dashboard do Supabase (Recomendado)

1. **Acesse o Dashboard:**
   - Vá para: https://supabase.com/dashboard/project/aobjtwikccovikmfoicg/functions

2. **Criar a Function:**
   - Clique em "Create a new function"
   - Nome: `vapi-webhook`
   - Copie o conteúdo do arquivo `supabase/functions/vapi-webhook/index.ts`

3. **Configurar Variáveis de Ambiente:**
   - Vá em: Settings > Edge Functions > Environment Variables
   - Adicione:
     ```
     VAPI_PRIVATE_KEY=f5f59844-231f-4d0d-a4b2-bc7d8933bed6
     ```

4. **Deploy:**
   - Clique em "Deploy" ou "Save"

### Opção 2: Via Supabase CLI (Se preferir instalar)

```bash
# Instalar Supabase CLI (se ainda não tiver)
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref aobjtwikccovikmfoicg

# Deploy da função
supabase functions deploy vapi-webhook
```

## 🔗 URL da Function

Após o deploy, a URL será:
```
https://aobjtwikccovikmfoicg.supabase.co/functions/v1/vapi-webhook
```

Esta URL deve ser configurada no dashboard da Vapi como webhook.

## ✅ Checklist de Deploy

- [x] Código commitado no GitHub
- [x] Código enviado para main
- [ ] Edge Function deployada no Supabase
- [ ] Variável de ambiente `VAPI_PRIVATE_KEY` configurada
- [ ] Webhook URL configurada no dashboard da Vapi
- [ ] Teste realizado com sucesso

## 🧪 Como Testar Após Deploy

1. **Teste da Function:**
   ```bash
   curl -X POST https://aobjtwikccovikmfoicg.supabase.co/functions/v1/vapi-webhook \
     -H "Content-Type: application/json" \
     -d '{"message":{"type":"function-call","functionCall":{"name":"schedule_appointment","parameters":{"patientName":"Teste","patientPhone":"+55669997215000","appointmentDate":"2024-02-15","appointmentTime":"14:00","doctor":"matheus"}}}}'
   ```

2. **Teste no Site:**
   - Acesse o site em produção
   - Clique no botão flutuante de telefone
   - Digite um número de teste
   - Aguarde a ligação da Vapi

3. **Verificar no Dashboard:**
   - Acesse o dashboard administrativo
   - Verifique se o agendamento foi criado

## 📝 Próximos Passos

1. Deploy da Edge Function (instruções acima)
2. Configurar webhook no dashboard da Vapi (veja `CONFIGURACAO_VAPI.md`)
3. Testar o fluxo completo

