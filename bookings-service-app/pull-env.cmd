@echo off
cd /d "%~dp0"
echo Pulling Wix env into .env.local ...
echo (requires: valid appId in wix.config.json + wix login)
call npx wix env pull
echo.
pause
