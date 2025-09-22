# Script para fazer deploy das mudanças para o GitHub
Write-Host "Inicializando repositório Git..." -ForegroundColor Green

# Inicializar git se não existir
if (!(Test-Path ".git")) {
    git init
    Write-Host "Repositório Git inicializado" -ForegroundColor Yellow
}

# Adicionar remote origin
git remote add origin https://github.com/iosantaluzia/io-santaluzia.git 2>$null
Write-Host "Remote origin configurado" -ForegroundColor Yellow

# Adicionar todos os arquivos
git add .
Write-Host "Arquivos adicionados ao staging" -ForegroundColor Yellow

# Fazer commit
git commit -m "feat: Complete website updates - articles modal, footer standardization, surgery pages, new images, favicon update"
Write-Host "Commit realizado" -ForegroundColor Yellow

# Configurar branch main
git branch -M main
Write-Host "Branch main configurada" -ForegroundColor Yellow

# Push para GitHub
git push -u origin main
Write-Host "Push para GitHub realizado!" -ForegroundColor Green

Write-Host "Deploy concluído! Verifique: https://github.com/iosantaluzia/io-santaluzia" -ForegroundColor Cyan
