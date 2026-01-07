# Script para testar o Electron localmente
Write-Host "=== Testando Electron Localmente ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se o build existe
if (-not (Test-Path "dist\index.html")) {
    Write-Host "❌ Build não encontrado! Execute 'npm run build' primeiro." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build encontrado" -ForegroundColor Green
Write-Host ""

# Verificar se o executável existe
if (-not (Test-Path "release\win-unpacked\Santa Luzia Admin.exe")) {
    Write-Host "❌ Executável não encontrado!" -ForegroundColor Red
    Write-Host "Execute 'npm run electron:build:win:dir' primeiro." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Executável encontrado" -ForegroundColor Green
Write-Host ""

# Verificar estrutura de arquivos
Write-Host "📁 Verificando estrutura de arquivos..." -ForegroundColor Cyan
$distFiles = Get-ChildItem "dist" -Recurse | Measure-Object
Write-Host "   Arquivos em dist: $($distFiles.Count)" -ForegroundColor Gray

$exeFiles = Get-ChildItem "release\win-unpacked" -Recurse | Measure-Object
Write-Host "   Arquivos em win-unpacked: $($exeFiles.Count)" -ForegroundColor Gray
Write-Host ""

# Tentar executar
Write-Host "🚀 Tentando executar o aplicativo..." -ForegroundColor Cyan
Write-Host "   (Pressione Ctrl+C para parar)" -ForegroundColor Yellow
Write-Host ""

Start-Process -FilePath "release\win-unpacked\Santa Luzia Admin.exe" -Wait

