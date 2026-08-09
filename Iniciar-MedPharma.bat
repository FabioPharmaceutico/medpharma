@echo off
title MedPharma
cd /d "%~dp0"
if not exist node_modules (
  echo Primeira execucao: instalando dependencias...
  call npm install
  call npm run db:push
  call npm run db:seed
)
echo.
echo Iniciando o MedPharma... aguarde a mensagem "Ready" e o navegador abrir.
echo (Mantenha esta janela aberta enquanto usar o app. Feche com Ctrl+C.)
start "" cmd /c "timeout /t 7 >nul & start http://localhost:3000"
call npm run dev
