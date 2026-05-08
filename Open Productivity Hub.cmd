@echo off
setlocal
cd /d "%~dp0"
start "Productivity Hub Dev Server" cmd /k "npm.cmd run dev -- --hostname 127.0.0.1 --port 3000"
timeout /t 4 /nobreak > nul
start "" "http://127.0.0.1:3000"
