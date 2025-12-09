# 📥 Guia de Download do Executável

## 🎯 Funcionalidade Implementada

Foi adicionado um botão de download do executável no painel administrativo web!

### Localização do Botão
- **No Header do Admin Dashboard** (ao lado da busca e notificações)
- **Ícone**: Download
- **Texto**: "Baixar App" (visível em telas maiores)

## 📋 Como Funciona

### 1. Upload do Executável (Uma vez)

Após criar o executável, você precisa fazer upload para o Supabase Storage:

#### Opção A: Script Automático (Recomendado)

```powershell
# Execute após criar o executável
.\scripts\upload-executable.ps1
```

#### Opção B: Upload Manual

1. Acesse o dashboard do Supabase: https://app.supabase.com
2. Vá em **Storage** → **public-downloads**
3. Clique em **Upload file**
4. Selecione: `release\win-unpacked\Santa Luzia Admin.exe`
5. Renomeie para: `Santa-Luzia-Admin.exe` (se necessário)

### 2. Download pelo Painel Web

1. Acesse o painel administrativo: `/adminio`
2. Clique no botão **"Baixar App"** no header
3. Uma janela modal abrirá com informações
4. Clique em **"Baixar Executável"**
5. O download será iniciado automaticamente

## 🔧 Configuração Necessária

### Bucket Criado ✅

O bucket `public-downloads` já foi criado no Supabase Storage:
- **Nome**: `public-downloads`
- **Público**: Sim (para downloads diretos)
- **Limite**: 500MB
- **Tipos permitidos**: `.exe`, arquivos binários

### Variáveis de Ambiente

Certifique-se de ter no `.env`:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 📝 Fluxo Completo

### 1. Criar o Executável
```bash
npm run build
powershell -ExecutionPolicy Bypass -File build-electron.ps1
```

### 2. Fazer Upload
```powershell
.\scripts\upload-executable.ps1
```

### 3. Testar Download
- Acesse `/adminio` no navegador
- Clique em "Baixar App"
- Verifique se o download funciona

## 🎨 Interface

O botão abre um modal com:
- ✅ Informações do aplicativo (nome, tamanho, requisitos)
- ✅ Avisos importantes (internet, credenciais, sincronização)
- ✅ Botão de download com feedback visual
- ✅ Verificação automática de disponibilidade

## 🔄 Atualizações Futuras

Quando você criar uma nova versão do executável:

1. **Rebuild**: `powershell -ExecutionPolicy Bypass -File build-electron.ps1`
2. **Upload**: `.\scripts\upload-executable.ps1`
3. **Pronto!** O novo executável estará disponível para download

## ⚠️ Troubleshooting

### Botão mostra "Arquivo não disponível"
- Execute o script de upload: `.\scripts\upload-executable.ps1`
- Ou faça upload manual no Supabase Storage

### Erro ao fazer download
- Verifique se o bucket `public-downloads` existe
- Verifique se o arquivo foi enviado corretamente
- Verifique as variáveis de ambiente

### Upload falha
- Verifique se tem permissão no Supabase Storage
- Verifique se o bucket `public-downloads` está público
- Tente fazer upload manual pelo dashboard

---

**Tudo configurado e pronto para uso!** 🎉

