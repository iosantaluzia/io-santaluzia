# ⚠️ Nota Importante sobre Números de Telefone na Vapi

## Problema Identificado

A API da Vapi está retornando erro: "Need Either `phoneNumberId` Or `phoneNumber`"

## Possíveis Causas

1. **Número precisa estar cadastrado no Dashboard:**
   - Você precisa ter números de telefone cadastrados no dashboard da Vapi
   - Acesse: https://dashboard.vapi.ai/phone-numbers
   - Verifique se há números cadastrados

2. **Estrutura da API:**
   - A API aceita `customer.phoneNumber` OU `customer.phoneNumberId`
   - Se usar `phoneNumber`, precisa estar no formato E.164: `+5541998620321`
   - Se usar `phoneNumberId`, precisa ser o ID de um número cadastrado

## Solução

### Opção 1: Cadastrar Número no Dashboard
1. Acesse: https://dashboard.vapi.ai/phone-numbers
2. Adicione um número de telefone
3. Use o `phoneNumberId` retornado na API

### Opção 2: Usar phoneNumber Direto
- O código atual usa `customer.phoneNumber` com formato E.164
- Se ainda não funcionar, pode ser necessário:
  - Verificar se sua conta tem permissão para fazer chamadas
  - Verificar se há créditos disponíveis
  - Verificar se o número está em formato válido

## Verificação

Execute este comando para ver seus números cadastrados:
```bash
curl https://api.vapi.ai/phone-number \
  -H "Authorization: Bearer f5f59844-231f-4d0d-a4b2-bc7d8933bed6"
```

Se retornar `[]`, você precisa cadastrar números primeiro.

## Próximos Passos

1. Verificar se há números cadastrados no dashboard
2. Se não houver, cadastrar um número
3. Testar novamente com o número ou phoneNumberId

