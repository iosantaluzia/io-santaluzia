# Script PowerShell para fazer upload do executável para Supabase Storage
# Execute após cada build: .\scripts\upload-executable.ps1

Write-Host "=== Upload do Executável para Supabase Storage ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se o arquivo existe
$executablePath = "release\win-unpacked\Santa Luzia Admin.exe"
if (-not (Test-Path $executablePath)) {
    Write-Host "❌ Executável não encontrado em: $executablePath" -ForegroundColor Red
    Write-Host "Execute 'npm run electron:build:win:dir' primeiro para criar o executável." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Executável encontrado: $executablePath" -ForegroundColor Green
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
    Write-Host "❌ Variáveis de ambiente não configuradas!" -ForegroundColor Red
    Write-Host "Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "📤 Fazendo upload do executável..." -ForegroundColor Cyan

try {
    # Ler o arquivo como bytes
    $fileBytes = [System.IO.File]::ReadAllBytes($executablePath)
    $fileName = "Santa-Luzia-Admin.exe"
    
    # URL da API do Supabase Storage
    $storageUrl = "$supabaseUrl/storage/v1/object/public-downloads/$fileName"
    
    # Fazer upload usando PUT
    $headers = @{
        "apikey" = $supabaseKey
        "Authorization" = "Bearer $supabaseKey"
        "Content-Type" = "application/x-msdownload"
        "x-upsert" = "true"
    }
    
    $response = Invoke-RestMethod -Uri $storageUrl -Method Put -Headers $headers -Body $fileBytes -ContentType "application/x-msdownload" -ErrorAction Stop
    
    Write-Host "✅ Upload concluído com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 URL de download: $storageUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ Executável disponível para download no painel administrativo!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Erro ao fazer upload: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Dica: Você pode fazer upload manualmente:" -ForegroundColor Yellow
    Write-Host "   1. Acesse o dashboard do Supabase" -ForegroundColor Yellow
    Write-Host "   2. Vá em Storage > public-downloads" -ForegroundColor Yellow
    Write-Host "   3. Faça upload do arquivo: $executablePath" -ForegroundColor Yellow
    exit 1
}
