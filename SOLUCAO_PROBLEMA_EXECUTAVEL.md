# 🔧 Solução para Problema ao Abrir o Executável

## 📋 Passos para Diagnosticar

### 1. Execute o Script de Diagnóstico

```powershell
powershell -ExecutionPolicy Bypass -File diagnostico-electron.ps1
```

Este script vai:
- ✅ Verificar se o executável existe
- ✅ Verificar se os arquivos necessários estão presentes
- ✅ Verificar processos em execução
- ✅ Tentar executar o aplicativo

### 2. Verificar o Arquivo debug.log

Se o executável tentar abrir mas falhar, verifique:
```
release\win-unpacked\debug.log
```

Este arquivo contém logs de erro do Electron.

### 3. Tentar Executar Manualmente

1. **Feche todos os processos do Electron:**
   ```powershell
   taskkill /F /IM "Santa Luzia Admin.exe" /T
   Get-Process | Where-Object {$_.ProcessName -like "*electron*"} | Stop-Process -Force
   ```

2. **Execute o executável diretamente:**
   ```
   release\win-unpacked\Santa Luzia Admin.exe
   ```

3. **Se não abrir, tente pelo PowerShell:**
   ```powershell
   cd release\win-unpacked
   .\Santa Luzia Admin.exe
   ```

### 4. Verificar Dependências

Certifique-se de que:
- ✅ O arquivo `dist/index.html` existe (execute `npm run build` se não existir)
- ✅ O arquivo `electron/main.cjs` existe
- ✅ O arquivo `electron/preload.cjs` existe

### 5. Rebuild Completo

Se nada funcionar, faça um rebuild completo:

```powershell
# Limpar tudo
Remove-Item -Recurse -Force release -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# Rebuild
npm run build
powershell -ExecutionPolicy Bypass -File build-electron.ps1
```

## 🐛 Problemas Comuns

### Problema: "O aplicativo não abre"
**Solução:**
1. Verifique o `debug.log` em `release\win-unpacked\`
2. Execute o script de diagnóstico
3. Verifique se há processos antigos em execução

### Problema: "Erro ao carregar arquivo"
**Solução:**
- Certifique-se de que `dist/index.html` existe
- Execute `npm run build` novamente

### Problema: "Erro de permissão"
**Solução:**
- Execute o PowerShell como Administrador
- Verifique se o antivírus não está bloqueando

## 📞 Próximos Passos

1. Execute o script de diagnóstico
2. Envie o conteúdo do `debug.log` se houver erros
3. Informe qual mensagem de erro aparece (se houver)

---

**Execute o diagnóstico e me informe o resultado!** 🔍

