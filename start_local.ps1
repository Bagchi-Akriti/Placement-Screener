# PlacementIQ - 1-Click Localhost Launcher (PowerShell)
# Workspace: d:\Antigravity\Agile

Write-Host "Starting PlacementIQ on Localhost..." -ForegroundColor Cyan

Set-Location "d:\Antigravity\Agile"

# 1. Start Backend in a separate window
Write-Host "[1/2] Starting Backend API on http://localhost:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\Antigravity\Agile\backend'; python run.py"

# 2. Start Frontend in a separate window
Write-Host "[2/2] Starting Frontend App on http://localhost:5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\Antigravity\Agile\frontend'; npm run dev"

# 3. Wait and open browser
Start-Sleep -Seconds 3
Write-Host "Opening http://localhost:5173 in your default browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host "`nPlacementIQ is now running locally!" -ForegroundColor Green
Write-Host "Frontend App: http://localhost:5173"
Write-Host "Backend API:  http://localhost:8000"
Write-Host "API Docs:     http://localhost:8000/docs"
