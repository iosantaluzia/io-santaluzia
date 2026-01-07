# Instruções para Upload Manual do Executável

## ✅ Migração Aplicada com Sucesso!

A migração das políticas RLS foi aplicada com sucesso no Supabase. Agora você precisa fazer o upload do executável manualmente pelo dashboard.

## 📤 Passo a Passo para Upload Manual

### 1. Acesse o Dashboard do Supabase
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto: **iosantaluzia** (ID: aobjtwikccovikmfoicg)

### 2. Navegue até Storage
- No menu lateral, clique em **Storage**
- Você verá a lista de buckets
- Clique no bucket **public-downloads**

### 3. Faça Upload do Arquivo
- Clique no botão **Upload file** (ou arraste o arquivo)
- Navegue até: `C:\Users\roque\io-santaluzia\release\win-unpacked\`
- Selecione o arquivo: **Santa Luzia Admin.exe**
- Aguarde o upload completar (pode levar alguns minutos devido ao tamanho de ~201MB)

### 4. Renomear (se necessário)
- Após o upload, verifique se o nome do arquivo está como: **Santa-Luzia-Admin.exe**
- Se estiver diferente, clique no arquivo e renomeie para: **Santa-Luzia-Admin.exe**

### 5. Verificar Permissões
- O arquivo deve estar **público** (visível para todos)
- Se não estiver, clique no arquivo e marque como público

## ✅ Verificação

Após o upload, teste no painel administrativo:

1. Acesse `/adminio` no seu site
2. Clique no botão **"Baixar App"**
3. O diálogo deve mostrar o botão de download habilitado
4. Não deve mostrar "Arquivo não disponível"

## 🔄 Para Futuros Uploads

Quando houver uma nova versão do executável:

1. Execute o build: `npm run electron:build:win:dir`
2. Acesse o dashboard do Supabase
3. Vá em Storage > public-downloads
4. Delete o arquivo antigo (opcional)
5. Faça upload do novo arquivo
6. Renomeie para: **Santa-Luzia-Admin.exe**

## 📝 Notas

- O upload manual é mais seguro que usar scripts com service role key
- O arquivo ficará disponível imediatamente após o upload
- A URL de download será: `https://[seu-projeto].supabase.co/storage/v1/object/public/public-downloads/Santa-Luzia-Admin.exe`

