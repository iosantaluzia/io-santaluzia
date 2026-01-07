# Script de diagnóstico para o executável Electron
Write-Host "=== Diagnóstico do Executável Electron ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se o executável existe
$exePath = "release\win-unpacked\Santa Luzia Admin.exe"
if (Test-Path $exePath) {
    Write-Host "✅ Executável encontrado: $exePath" -ForegroundColor Green
    $fileInfo = Get-Item $exePath
    Write-Host "   Tamanho: $($fileInfo.Length / 1MB) MB" -ForegroundColor Gray
    Write-Host "   Data: $($fileInfo.LastWriteTime)" -ForegroundColor Gray
} else {
    Write-Host "❌ Executável NÃO encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verificar se dist/index.html existe
$htmlPath = "dist\index.html"
if (Test-Path $htmlPath) {
    Write-Host "✅ Arquivo HTML encontrado: $htmlPath" -ForegroundColor Green
} else {
    Write-Host "❌ Arquivo HTML NÃO encontrado! Execute 'npm run build' primeiro." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verificar se electron/main.cjs existe
$mainPath = "electron\main.cjs"
if (Test-Path $mainPath) {
    Write-Host "✅ Arquivo main.cjs encontrado: $mainPath" -ForegroundColor Green
} else {
    Write-Host "❌ Arquivo main.cjs NÃO encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verificar processos do Electron em execução
$processes = Get-Process | Where-Object {$_.ProcessName -like "*electron*" -or $_.ProcessName -like "*Santa*"}
if ($processes) {
    Write-Host "⚠️  Processos Electron encontrados em execução:" -ForegroundColor Yellow
    $processes | ForEach-Object {
        Write-Host "   - $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray
    }
    Write-Host ""
    $kill = Read-Host "Deseja encerrar esses processos? (S/N)"
    if ($kill -eq "S" -or $kill -eq "s") {
        $processes | Stop-Process -Force
        Write-Host "✅ Processos encerrados" -ForegroundColor Green
        Start-Sleep -Seconds 2
    }
} else {
    Write-Host "✅ Nenhum processo Electron em execução" -ForegroundColor Green
}

Write-Host ""

# Tentar executar o aplicativo
Write-Host "Tentando executar o aplicativo..." -ForegroundColor Cyan
Write-Host ""

try {
    $process = Start-Process -FilePath $exePath -PassThru -NoNewWindow -Wait -ErrorAction Stop
    Write-Host "✅ Processo executado (Exit Code: $($process.ExitCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao executar: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Detalhes do erro:" -ForegroundColor Yellow
    Write-Host $_.Exception.ToString() -ForegroundColor Gray
}

Write-Host ""
Write-Host "=== Fim do Diagnóstico ===" -ForegroundColor Cyan

