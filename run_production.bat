@echo off
REM PlacementIQ - Production Build & Single-Port Launch Script (Windows Batch)
REM Workspace: d:\Antigravity\Agile

echo ==========================================================
echo    PlacementIQ - Production Build & Launch (Port 8000)
echo ==========================================================

cd /d "d:\Antigravity\Agile"

echo.
echo [1/4] Building React Frontend bundle...
cd "frontend"
call npm install
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Frontend build failed or npm not in PATH.
)

echo.
echo [2/4] Installing Backend Dependencies...
cd "..\backend"
python -m pip install -r requirements.txt

echo.
echo [3/4] Seeding initial assessment data...
python seed_assessments.py

echo.
echo [4/4] Starting server on http://localhost:8000 ...
start http://localhost:8000
python run.py

pause
