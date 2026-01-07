# Instruções para Upload do Executável

## 📋 Pré-requisitos

1. **Bucket criado no Supabase**:
   - Acesse o dashboard do Supabase
   - Vá em **Storage**
   - Crie um bucket chamado `public-downloads`
   - Marque como **público**
   - Limite de tamanho: 500MB

2. **Migração aplicada**:
   - Execute a migração `supabase/migrations/20250120000001_setup_public_downloads_storage.sql`
   - Isso criará as políticas RLS necessárias

## 🚀 Upload Automático (Recomendado)

### Passo 1: Build do Executável
```powershell
npm run electron:build:win:dir
```

### Passo 2: Upload para Supabase
```powershell
.\scripts\upload-executable.ps1
```

O script irá:
- ✅ Verificar se o executável existe
- ✅ Carregar variáveis de ambiente do `.env`
- ✅ Fazer upload para o bucket `public-downloads`
- ✅ Confirmar o upload

## 📤 Upload Manual

Se o script automático não funcionar, você pode fazer upload manualmente:

1. **Acesse o Dashboard do Supabase**:
   - Vá em https://supabase.com/dashboard
   - Selecione seu projeto

2. **Navegue até Storage**:
   - Clique em **Storage** no menu lateral
   - Selecione o bucket `public-downloads`

3. **Faça Upload**:
   - Clique em **Upload file**
   - Selecione o arquivo: `release\win-unpacked\Santa Luzia Admin.exe`
   - Renomeie para: `Santa-Luzia-Admin.exe` (se necessário)
   - Aguarde o upload completar

4. **Verifique**:
   - O arquivo deve aparecer na lista
   - Clique no arquivo para ver a URL pública

## ✅ Verificação

Após o upload, verifique se está funcionando:

1. **No painel administrativo** (`/adminio`):
   - Clique no botão **"Baixar App"**
   - O diálogo deve mostrar o botão de download habilitado
   - Não deve mostrar "Arquivo não disponível"

2. **URL de Download**:
   - A URL deve ser: `https://[seu-projeto].supabase.co/storage/v1/object/public/public-downloads/Santa-Luzia-Admin.exe`
   - Você pode testar abrindo esta URL no navegador

## 🐛 Solução de Problemas

### Erro: "Bucket não encontrado"
- **Solução**: Crie o bucket `public-downloads` manualmente no dashboard do Supabase

### Erro: "Permissão negada"
- **Solução**: Verifique se as políticas RLS foram aplicadas corretamente
- Execute a migração novamente se necessário

### Erro: "Arquivo muito grande"
- **Solução**: Verifique o limite do bucket (deve ser 500MB)
- O executável deve ter ~185MB

### Script não encontra o executável
- **Solução**: Certifique-se de que executou `npm run electron:build:win:dir` primeiro
- Verifique se o arquivo existe em `release\win-unpacked\Santa Luzia Admin.exe`

## 📝 Notas

- O upload deve ser feito após cada build do executável
- O arquivo será substituído se já existir (upsert)
- A URL de download permanece a mesma após cada upload
- Usuários autenticados podem baixar o executável através do painel

