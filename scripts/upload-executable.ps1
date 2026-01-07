# Script PowerShell para fazer upload do executável para Supabase Storage
# Execute após cada build: .\scripts\upload-executable.ps1

Write-Host "=== Upload do Executavel para Supabase Storage ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se o arquivo existe
$executablePath = "release\win-unpacked\Santa Luzia Admin.exe"
if (-not (Test-Path $executablePath)) {
    Write-Host "❌ Executavel nao encontrado em: $executablePath" -ForegroundColor Red
    Write-Host "Execute 'npm run electron:build:win:dir' primeiro para criar o executavel." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Executavel encontrado: $executablePath" -ForegroundColor Green
$fileInfo = Get-Item $executablePath
$fileSizeMB = [math]::Round($fileInfo.Length / 1MB, 2)
Write-Host "   Tamanho: $fileSizeMB MB" -ForegroundColor Gray
Write-Host ""

# Carregar variáveis de ambiente do .env
$envFile = ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

$supabaseUrl = $env:VITE_SUPABASE_URL
$supabaseKey = $env:VITE_SUPABASE_ANON_KEY

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "❌ Variaveis de ambiente nao configuradas!" -ForegroundColor Red
    Write-Host "Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "📤 Fazendo upload do executavel..." -ForegroundColor Cyan

# Ler o arquivo como bytes
$fileBytes = [System.IO.File]::ReadAllBytes($executablePath)
$fileName = "Santa-Luzia-Admin.exe"

# URL da API do Supabase Storage
$storageUrl = "$supabaseUrl/storage/v1/object/public-downloads/$fileName"

# Headers para autenticação
$headers = @{
    "apikey" = $supabaseKey
    "Authorization" = "Bearer $supabaseKey"
    "Content-Type" = "application/x-msdownload"
    "x-upsert" = "true"
}

try {
    # Fazer upload usando POST
    $response = Invoke-RestMethod -Uri $storageUrl -Method Post -Headers $headers -Body $fileBytes -ContentType "application/x-msdownload" -ErrorAction Stop
    
    Write-Host "✅ Upload concluido com sucesso!" -ForegroundColor Green
    Write-Host ""
    
    # URL pública de download
    $publicUrl = "$supabaseUrl/storage/v1/object/public/public-downloads/$fileName"
    Write-Host "🔗 URL de download: $publicUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ Executavel disponivel para download no painel administrativo!" -ForegroundColor Green
    
} catch {
    $errorMessage = $_.Exception.Message
    Write-Host "❌ Erro ao fazer upload: $errorMessage" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solucoes:" -ForegroundColor Yellow
    Write-Host "   1. Verifique se o bucket 'public-downloads' existe no Supabase" -ForegroundColor Yellow
    Write-Host "   2. Execute a migracao: supabase/migrations/20250120000001_setup_public_downloads_storage.sql" -ForegroundColor Yellow
    Write-Host "   3. Ou faca upload manualmente:" -ForegroundColor Yellow
    Write-Host "      - Acesse o dashboard do Supabase" -ForegroundColor Yellow
    Write-Host "      - Va em Storage > public-downloads" -ForegroundColor Yellow
    Write-Host "      - Faca upload do arquivo: $executablePath" -ForegroundColor Yellow
    exit 1
}
