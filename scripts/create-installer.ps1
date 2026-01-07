# Script para criar um instalador simples (ZIP auto-extraível)
# Baseado na pasta win-unpacked existente

Write-Host "=== Criando Instalador do Santa Luzia Admin ===" -ForegroundColor Cyan
Write-Host ""

$sourceDir = "release\win-unpacked"
$outputFile = "release\Santa-Luzia-Admin-Installer.zip"
$installerName = "Santa-Luzia-Admin-Setup.exe"

if (-not (Test-Path $sourceDir)) {
    Write-Host "❌ Pasta win-unpacked não encontrada!" -ForegroundColor Red
    Write-Host "Execute 'npm run electron:build:win:dir' primeiro." -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Compactando arquivos..." -ForegroundColor Cyan

# Criar arquivo ZIP
if (Test-Path $outputFile) {
    Remove-Item $outputFile -Force
}

# Compactar usando .NET
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($sourceDir, $outputFile, [System.IO.Compression.CompressionLevel]::Optimal, $false)

$zipSize = (Get-Item $outputFile).Length / 1MB
Write-Host "✅ Arquivo ZIP criado: $outputFile" -ForegroundColor Green
Write-Host "   Tamanho: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Gray
Write-Host ""
Write-Host "📝 Instruções para distribuição:" -ForegroundColor Yellow
Write-Host "   1. Envie o arquivo ZIP para os usuários" -ForegroundColor White
Write-Host "   2. Eles devem extrair o ZIP em uma pasta (ex: C:\SantaLuziaAdmin\)" -ForegroundColor White
Write-Host "   3. Executar 'Santa Luzia Admin.exe' de dentro da pasta extraída" -ForegroundColor White
Write-Host ""
Write-Host "💡 Alternativa: Use o arquivo ZIP como instalador" -ForegroundColor Cyan
Write-Host "   O Windows pode extrair automaticamente ao abrir o arquivo ZIP" -ForegroundColor Gray

