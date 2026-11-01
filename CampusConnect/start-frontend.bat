@echo off
title CampusConnect Frontend
echo ===================================================
echo Starting CampusConnect React Frontend (Vite)
echo ===================================================

cd /d "%~dp0frontend"
echo Starting frontend development server on http://localhost:5173 ...
call npm run dev
pause
