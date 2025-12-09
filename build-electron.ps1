# Script para build do Electron sem code signing
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
$env:SKIP_NOTARIZATION = "true"

# Limpar build anterior
if (Test-Path "release\win-unpacked") {
    Remove-Item -Recurse -Force "release\win-unpacked" -ErrorAction SilentlyContinue
}

# Build da aplicação
Write-Host "Building application..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Build do Electron (ignorando erros de code signing)
Write-Host "Building Electron executable..." -ForegroundColor Green
npx electron-builder --win --dir 2>&1 | Out-Null

# Verificar se o executável foi criado
if (Test-Path "release\win-unpacked\Santa Luzia Admin.exe") {
    Write-Host "`n✅ Executável criado com sucesso!" -ForegroundColor Green
    Write-Host "Localização: release\win-unpacked\Santa Luzia Admin.exe" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Erro ao criar executável" -ForegroundColor Red
    exit 1
}

