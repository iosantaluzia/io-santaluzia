# Configuração de Email - Locaweb

## Problema Identificado

O erro que você está recebendo indica problemas de conectividade com o servidor de email da Locaweb:

```
Socket error code 10061 - Connection refused
Server at iosantaluzia.com.br (216.198.79.1) returned '450 4.4.316 Connection refused'
```

## Configurações Corretas para Locaweb

### 1. Configurações SMTP (Envio)
- **Servidor SMTP**: `smtp.locaweb.com.br`
- **Porta**: `587` (recomendada) ou `465` (SSL)
- **Segurança**: TLS/STARTTLS
- **Autenticação**: Sim
- **Usuário**: Seu email completo (ex: `financeiro@iosantaluzia.com.br`)
- **Senha**: Sua senha de email

### 2. Configurações IMAP (Recebimento)
- **Servidor IMAP**: `imap.locaweb.com.br`
- **Porta**: `993` (SSL) ou `143` (TLS)
- **Segurança**: SSL/TLS
- **Autenticação**: Sim
- **Usuário**: Seu email completo
- **Senha**: Sua senha de email

## Variáveis de Ambiente Necessárias

Configure as seguintes variáveis no Supabase:

```bash
EMAIL_USER=financeiro@iosantaluzia.com.br
EMAIL_PASSWORD=sua_senha_aqui
```

## Verificações Importantes

### 1. Verificar DNS MX
Execute este comando para verificar os registros MX do seu domínio:

```bash
nslookup -type=MX iosantaluzia.com.br
```

Os registros devem apontar para servidores da Locaweb.

### 2. Verificar Conectividade
Teste a conectividade com os servidores:

```bash
# Testar SMTP
telnet smtp.locaweb.com.br 587

# Testar IMAP
telnet imap.locaweb.com.br 993
```

### 3. Verificar Firewall
Certifique-se de que as portas 587, 993 e 465 não estão bloqueadas.

## Solução Implementada

O código foi atualizado para:

1. **Usar servidores corretos da Locaweb**:
   - SMTP: `smtp.locaweb.com.br:587`
   - IMAP: `imap.locaweb.com.br:993`

2. **Implementar tratamento de erros**:
   - Fallback em caso de falha de conectividade
   - Logs detalhados para diagnóstico

3. **Configuração TLS adequada**:
   - STARTTLS na porta 587
   - SSL na porta 465

## Próximos Passos

1. **Configure as variáveis de ambiente** no Supabase com suas credenciais reais
2. **Teste o envio de email** através da interface do sistema
3. **Verifique os logs** do Supabase para identificar possíveis problemas
4. **Contate o suporte da Locaweb** se os problemas persistirem

## Contato com Suporte Locaweb

Se o problema persistir, entre em contato com o suporte da Locaweb fornecendo:

- Domínio: `iosantaluzia.com.br`
- Conta de email: `financeiro@iosantaluzia.com.br`
- Erro específico: `Socket error code 10061`
- Servidor de origem: `SA1P222MB1177.NAMP222.PROD.OUTLOOK.COM`

## Configurações Alternativas

Se a porta 587 não funcionar, tente:

### SMTP Alternativo
- **Servidor**: `smtp.locaweb.com.br`
- **Porta**: `465`
- **Segurança**: SSL (não STARTTLS)

### IMAP Alternativo
- **Servidor**: `imap.locaweb.com.br`
- **Porta**: `143`
- **Segurança**: STARTTLS
