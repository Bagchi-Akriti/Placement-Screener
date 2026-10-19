@echo off
REM ========================================================
REM   PlacementIQ - 1-Click Localhost Launcher
REM   Starts Backend (Port 8000) & Frontend (Port 5173)
REM ========================================================

echo Starting PlacementIQ on Localhost...
echo.

cd /d "d:\Antigravity\Agile"

REM 1. Start Backend in a new window
echo [1/2] Starting Backend API on http://localhost:8000 ...
start "PlacementIQ - Backend Server (Port 8000)" cmd /k "cd backend && python run.py"

REM 2. Start Frontend in a new window
echo [2/2] Starting Frontend App on http://localhost:5173 ...
start "PlacementIQ - Frontend App (Port 5173)" cmd /k "cd frontend && npm run dev"

REM 3. Open browser after 3 seconds
timeout /t 3 /nobreak >nul
echo.
echo Opening Application in your browser...
start http://localhost:5173

echo.
echo ========================================================
echo   Application Running!
echo   Frontend URL:  http://localhost:5173
echo   Backend API:   http://localhost:8000
echo   API Docs:      http://localhost:8000/docs
echo ========================================================
