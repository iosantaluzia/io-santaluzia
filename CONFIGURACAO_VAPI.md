# Configuração da Integração Vapi - Voice Chat

## ✅ O que foi configurado automaticamente:

1. **Componente VoiceChatButton** (`src/components/VoiceChatButton.tsx`)
   - Botão flutuante para iniciar chamadas de voz
   - Integrado com sua conta Vapi
   - Assistant ID: `0eee3a3e-ab36-478d-acd2-cdf4aa3fdcb5`

2. **Edge Function para Webhook** (`supabase/functions/vapi-webhook/index.ts`)
   - Recebe dados do agendamento da Vapi
   - Cria/atualiza pacientes automaticamente
   - Salva agendamentos na tabela `consultations`

3. **Integração no Site**
   - Botão flutuante adicionado na página Home
   - Posicionado acima do botão do WhatsApp

## 📋 Configurações Necessárias no Dashboard da Vapi

### 1. Configurar Webhook URL ✅ CONCLUÍDO AUTOMATICAMENTE

**URL do Webhook configurada:**
```
https://aobjtwikccovikmfoicg.supabase.co/functions/v1/vapi-webhook
```

✅ O webhook foi configurado automaticamente via API no Assistant `0eee3a3e-ab36-478d-acd2-cdf4aa3fdcb5`.

### 2. Configurar Function Call para Agendamento

No seu Assistant, você precisa adicionar uma função chamada `schedule_appointment` que será chamada quando o paciente quiser agendar.

**Configuração da Função:**
- Nome: `schedule_appointment`
- Parâmetros esperados:
  - `patientName` (string): Nome completo do paciente
  - `patientPhone` (string): Telefone do paciente
  - `patientEmail` (string, opcional): Email do paciente
  - `patientCPF` (string, opcional): CPF do paciente
  - `appointmentDate` (string): Data do agendamento (formato: "YYYY-MM-DD")
  - `appointmentTime` (string): Horário do agendamento (formato: "HH:MM")
  - `doctor` (string): "matheus" ou "fabiola"
  - `appointmentType` (string, opcional): Tipo de consulta
  - `notes` (string, opcional): Observações adicionais

**Exemplo de prompt para adicionar no Assistant:**

```
Quando o paciente confirmar um agendamento, chame a função schedule_appointment com os seguintes dados:
- patientName: nome completo fornecido pelo paciente
- patientPhone: telefone do paciente (formato: +55669997215000)
- patientEmail: email se fornecido
- patientCPF: CPF se fornecido
- appointmentDate: data no formato YYYY-MM-DD
- appointmentTime: horário no formato HH:MM
- doctor: "matheus" ou "fabiola" conforme escolha do paciente
- appointmentType: tipo de consulta (ex: "Consulta de rotina", "Cirurgia de catarata")
- notes: qualquer observação adicional mencionada pelo paciente
```

### 3. Variáveis de Ambiente no Supabase

Certifique-se de que as seguintes variáveis estão configuradas no Supabase:

1. Acesse: https://supabase.com/dashboard/project/[seu-projeto]/settings/functions
2. Adicione/verifique:
   - `VAPI_PRIVATE_KEY`: `f5f59844-231f-4d0d-a4b2-bc7d8933bed6`
   - `SUPABASE_URL`: (já configurado automaticamente)
   - `SUPABASE_SERVICE_ROLE_KEY`: (já configurado automaticamente)

### 4. Deploy da Edge Function

Execute o deploy da função no Supabase:

```bash
# Via Supabase CLI
supabase functions deploy vapi-webhook

# Ou via dashboard do Supabase
# Acesse: Functions > vapi-webhook > Deploy
```

## 🧪 Como Testar

1. **Teste do Botão:**
   - Acesse o site
   - Clique no botão flutuante de telefone (ícone de telefone)
   - Digite seu número de telefone
   - Aguarde a ligação da Vapi

2. **Teste do Agendamento:**
   - Durante a chamada, informe que deseja agendar
   - Forneça os dados solicitados
   - A Vapi chamará a função `schedule_appointment`
   - O webhook salvará no banco de dados

3. **Verificar no Dashboard:**
   - Acesse o dashboard administrativo
   - Vá em "Agendamentos"
   - Verifique se o agendamento aparece na lista

## 📊 Fluxo Completo

1. **Usuário clica no botão** → Componente chama API da Vapi
2. **Vapi inicia chamada** → Liga para o número fornecido
3. **Durante a chamada** → Assistant coleta informações
4. **Ao confirmar agendamento** → Vapi chama função `schedule_appointment`
5. **Webhook recebe dados** → Edge Function processa
6. **Cria/atualiza paciente** → Salva na tabela `patients`
7. **Cria agendamento** → Salva na tabela `consultations`
8. **Agendamento visível** → Aparece no dashboard administrativo

## 🔧 Troubleshooting

### Erro: "Assistente não configurado"
- Verifique se o Assistant ID está correto no componente
- Confirme que o assistant existe na sua conta Vapi

### Erro: "Webhook não recebido"
- Verifique se a URL do webhook está correta no dashboard da Vapi
- Confirme que a Edge Function foi deployada
- Verifique os logs da função no Supabase

### Erro: "Erro ao criar paciente"
- Verifique se a tabela `patients` existe
- Confirme que o CPF não está duplicado
- Verifique os logs da Edge Function

## 📝 Notas Importantes

- O Assistant ID já está configurado e foi encontrado na sua conta
- O prompt do Assistant já está em português e configurado para o Instituto de Olhos Santa Luzia
- Os agendamentos são salvos na tabela `consultations` com status `scheduled`
- O sistema busca pacientes existentes pelo telefone ou CPF antes de criar novos

## 🎯 Próximos Passos

1. Configure o webhook no dashboard da Vapi (item 1 acima)
2. Adicione a função `schedule_appointment` no Assistant (item 2 acima)
3. Faça o deploy da Edge Function (item 4 acima)
4. Teste o fluxo completo (item "Como Testar" acima)

