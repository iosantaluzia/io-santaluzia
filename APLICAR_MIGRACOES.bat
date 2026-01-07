@echo off
echo ========================================
echo Aplicar Migracoes Automaticamente
echo ========================================
echo.

powershell.exe -ExecutionPolicy Bypass -File "scripts\apply-migrations-automatico.ps1"

pause

