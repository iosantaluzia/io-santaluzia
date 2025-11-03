# 🧪 Como Testar o Assistente Vapi no Navegador

## Opções Disponíveis

### Opção 1: Usar o Simulador no Dashboard da Vapi (Recomendado)

1. **Acesse o Dashboard:**
   - Vá para: https://dashboard.vapi.ai
   - Faça login na sua conta

2. **Acesse o Simulador:**
   - Vá até o Assistant: `0eee3a3e-ab36-478d-acd2-cdf4aa3fdcb5`
   - Clique em "Test" ou "Simulator"
   - Use o chat de texto para simular conversas

3. **Teste o Agendamento:**
   - Digite mensagens como se fosse o paciente
   - Exemplo: "Olá, gostaria de agendar uma consulta"
   - O assistente responderá como em uma chamada real

### Opção 2: Usar o Botão no Site (Atual)

O botão flutuante no site está configurado para tentar criar uma chamada no navegador. Se a Vapi não suportar chamadas WebRTC diretas via API, você verá uma mensagem de sucesso e pode:

1. **Verificar no Dashboard:**
   - Acesse: https://dashboard.vapi.ai/calls
   - Veja se a chamada foi criada
   - Monitore o status e logs

2. **Usar Teste Telefônico:**
   - Clique no botão
   - Escolha a opção de chamada telefônica
   - Digite seu número: `41998620321`
   - Você receberá uma ligação real

### Opção 3: Integrar Widget Vapi (Se Disponível)

Se a Vapi oferecer um widget JavaScript, podemos integrá-lo. Verifique na documentação da Vapi se há um widget disponível.

## Como Funciona Atualmente

O botão no site (`useBrowserCall={true}`):
1. Solicita permissão de microfone
2. Tenta criar uma chamada via API sem número de telefone
3. Se bem-sucedido, conecta via WebRTC (se suportado)
4. Se não suportado, mostra mensagem de sucesso e você pode verificar no dashboard

## Próximos Passos

Para uma experiência completa de teste no navegador, você pode:

1. **Usar o Simulador da Vapi** (melhor opção para testes)
2. **Configurar um widget** se a Vapi oferecer
3. **Usar chamadas telefônicas** para testes reais

## Nota Importante

A Vapi pode não suportar chamadas WebRTC diretas via API REST. Nesse caso, use:
- O simulador no dashboard para testes
- Chamadas telefônicas reais para produção
- Verificar se há SDK JavaScript oficial da Vapi para integração web

