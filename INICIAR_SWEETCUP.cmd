@echo off
setlocal
cd /d "%~dp0"
echo Preparando a SweetCup...
where node >nul 2>nul
if errorlevel 1 goto missingnode
where python >nul 2>nul
if errorlevel 1 goto missingpython
if not exist node_modules call npm ci
if errorlevel 1 goto failed
call npm run build
if errorlevel 1 goto failed
echo Abra http://127.0.0.1:8787 no navegador.
python -m backend.local_server
goto end
:missingnode
echo Instale o Node.js para executar a interface.
goto failed
:missingpython
echo Instale o Python 3.12 ou superior para executar o servidor.
:failed
echo Nao foi possivel iniciar. Confira a mensagem acima.
pause
:end
endlocal
