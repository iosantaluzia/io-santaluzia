# Script PowerShell para aplicar migracoes automaticamente no projeto correto
# Execute: .\scripts\apply-migrations-automatico.ps1

Write-Host "=== Aplicar Migracoes no Projeto Correto ===" -ForegroundColor Cyan
Write-Host ""

$PROJECT_ID = "aobjtwikccovikmfoicg"
$SUPABASE_URL = "https://$PROJECT_ID.supabase.co"

# Ler o SQL do arquivo
$sqlFile = "APPLY_MIGRATIONS_PROJECT_CORRETO.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "ERRO: Arquivo $sqlFile nao encontrado!" -ForegroundColor Red
    exit 1
}

$sql = Get-Content $sqlFile -Raw

Write-Host "OK: SQL carregado do arquivo: $sqlFile" -ForegroundColor Green
Write-Host ""

# Verificar se tem Service Role Key
$serviceRoleKey = $env:SUPABASE_SERVICE_ROLE_KEY

if ($serviceRoleKey) {
    Write-Host "Service Role Key encontrada. Tentando executar via API..." -ForegroundColor Yellow
    Write-Host ""
    
    # Tentar executar via API REST (requer funcao RPC exec_sql)
    try {
        $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/rpc/exec_sql" -Method Post -Headers @{
            "Content-Type" = "application/json"
            "apikey" = $serviceRoleKey
            "Authorization" = "Bearer $serviceRoleKey"
            "Prefer" = "return=representation"
        } -Body (@{ query = $sql } | ConvertTo-Json) -ErrorAction Stop
        
        Write-Host "OK: Migracoes aplicadas com sucesso via API!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Aguarde alguns minutos para o cache do PostgREST atualizar." -ForegroundColor Yellow
        exit 0
    } catch {
        Write-Host "AVISO: Nao foi possivel executar via API (funcao RPC nao existe)" -ForegroundColor Yellow
        Write-Host ""
    }
}

# Se nao conseguiu via API, abrir no navegador
Write-Host "Abrindo SQL Editor no navegador..." -ForegroundColor Cyan
Write-Host ""

$sqlEditorUrl = "https://supabase.com/dashboard/project/$PROJECT_ID/sql"

# Copiar SQL para area de transferencia
$sql | Set-Clipboard
Write-Host "OK: SQL copiado para area de transferencia!" -ForegroundColor Green
Write-Host ""

# Abrir navegador
Start-Process $sqlEditorUrl

Write-Host "INSTRUCOES:" -ForegroundColor Yellow
Write-Host "1. O SQL Editor foi aberto no navegador" -ForegroundColor White
Write-Host "2. O SQL ja esta copiado na sua area de transferencia" -ForegroundColor White
Write-Host "3. Cole o SQL no editor (Ctrl+V)" -ForegroundColor White
Write-Host "4. Clique em Run ou pressione Ctrl+Enter" -ForegroundColor White
Write-Host "5. Aguarde alguns minutos para o cache atualizar" -ForegroundColor White
Write-Host ""
Write-Host "URL: $sqlEditorUrl" -ForegroundColor Cyan
