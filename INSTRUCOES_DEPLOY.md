# 🚀 Instruções para Deploy no GitHub

## Problema Identificado
O repositório local não está sincronizado com o GitHub. Precisamos fazer o push das mudanças.

## ⚠️ IMPORTANTE: Execute estes comandos no terminal

### 1. Abra o PowerShell ou CMD no diretório do projeto:
```bash
cd C:\Users\roque\io-santaluzia
```

### 2. Execute os comandos em sequência:

```bash
# Inicializar repositório Git
git init

# Adicionar remote do GitHub
git remote add origin https://github.com/iosantaluzia/io-santaluzia.git

# Adicionar todos os arquivos
git add .

# Fazer commit com todas as mudanças
git commit -m "feat: Complete website updates - articles modal, footer standardization, surgery pages, new images, favicon update"

# Configurar branch main
git branch -M main

# Push para GitHub (forçar se necessário)
git push -u origin main --force
```

### 3. Se der erro de autenticação, use:
```bash
git push -u origin main --force-with-lease
```

## 📋 Mudanças que serão enviadas:

✅ **Modal de Artigos** - Funcionando em Home e Artigos  
✅ **Footer Padronizado** - Logo maior e centralizada  
✅ **Páginas de Cirurgia** - Imagens específicas e layout correto  
✅ **Seções Novas** - Anel Intraestromal e Transplante de Córnea  
✅ **Favicon Atualizado** - Logo circular  
✅ **Dados Centralizados** - Arquivo articles.ts  
✅ **Layouts Responsivos** - Títulos padronizados  

## 🔗 Após o push:
1. Acesse: https://github.com/iosantaluzia/io-santaluzia
2. Verifique se as mudanças apareceram
3. O Vercel deve fazer deploy automático
4. Site atualizado em: https://io-santaluzia.vercel.app

## 📧 Configuração de Email (Locaweb)

### Variáveis de Ambiente no Supabase:
```bash
EMAIL_USER=financeiro@iosantaluzia.com.br
EMAIL_PASSWORD=sua_senha_aqui
```

### Servidores Corretos:
- **SMTP**: `smtp.locaweb.com.br:587` (TLS)
- **IMAP**: `imap.locaweb.com.br:993` (SSL)

### Teste de Conectividade:
Acesse: `https://seu-projeto.supabase.co/functions/v1/email-test`

## 🆘 Se ainda não funcionar:
- Verifique se o Git está instalado: `git --version`
- Verifique se está no diretório correto: `pwd` ou `cd`
- Tente com token de acesso pessoal do GitHub
- Para problemas de email, consulte: `CONFIGURACAO_EMAIL_LOCAWEB.md`
