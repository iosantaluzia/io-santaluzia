# Instruções para Distribuição do Aplicativo

## 📦 Arquivo para Upload

**Arquivo:** `release\Santa-Luzia-Admin-Installer.zip`

Este arquivo contém todos os arquivos necessários para executar o aplicativo em qualquer computador Windows.

## 📤 Upload para Supabase Storage

1. Acesse o dashboard do Supabase
2. Vá em **Storage > public-downloads**
3. Faça upload do arquivo: **`Santa-Luzia-Admin-Installer.zip`**
4. Renomeie para: **`Santa-Luzia-Admin-Installer.zip`** (se necessário)

## 📥 Instruções para Usuários Finais

### Opção 1: Extração Manual (Recomendado)

1. **Baixar o arquivo ZIP** do painel administrativo
2. **Extrair o ZIP** em uma pasta (ex: `C:\SantaLuziaAdmin\`)
3. **Executar** o arquivo `Santa Luzia Admin.exe` de dentro da pasta extraída
4. **Criar atalho** na área de trabalho (opcional):
   - Clique com botão direito no `Santa Luzia Admin.exe`
   - Selecione "Enviar para > Área de trabalho (criar atalho)"

### Opção 2: Extração Automática

1. **Baixar o arquivo ZIP**
2. **Clicar duas vezes** no arquivo ZIP
3. O Windows abrirá o arquivo
4. **Arrastar** a pasta `win-unpacked` para o local desejado (ex: `C:\Program Files\SantaLuziaAdmin\`)
5. **Renomear** a pasta para `SantaLuziaAdmin` (opcional)
6. **Executar** o `Santa Luzia Admin.exe`

## ⚠️ Importante

- **Não mova** o executável para fora da pasta - ele precisa de todos os arquivos da pasta
- **Mantenha** todos os arquivos juntos na mesma pasta
- **Primeira execução** pode demorar alguns segundos para carregar
- **Conexão com internet** é necessária para funcionar (validação com Supabase)

## 🔄 Atualizações Futuras

Quando houver uma nova versão:

1. Execute `npm run electron:build:win:dir`
2. Execute `Compress-Archive -Path "release\win-unpacked\*" -DestinationPath "release\Santa-Luzia-Admin-Installer.zip" -Force`
3. Faça upload do novo ZIP para o Supabase Storage
4. Os usuários precisarão baixar e extrair a nova versão

## 📝 Notas Técnicas

- O arquivo ZIP contém aproximadamente **~200MB** quando extraído
- Todos os arquivos necessários estão incluídos (não requer instalação adicional)
- Funciona em Windows 10 e 11 (64-bit)
- Não requer privilégios de administrador para executar

