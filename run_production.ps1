# PlacementIQ - Production Build & Single-Port Launch Script
# Workspace: d:\Antigravity\Agile

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   PlacementIQ - Production Build & Launch (Port 8000)   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$WorkspaceRoot = "d:\Antigravity\Agile"
$FrontendDir = "$WorkspaceRoot\frontend"
$BackendDir = "$WorkspaceRoot\backend"

# 1. Check Python
Write-Host "`n[1/5] Checking Python environment..." -ForegroundColor Yellow
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Python is not installed or not in PATH." -ForegroundColor Red
    exit 1
}
python --version

# 2. Check Node & npm
Write-Host "`n[2/5] Checking Node.js & npm..." -ForegroundColor Yellow
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "Warning: 'npm' not found in system PATH." -ForegroundColor Yellow
    Write-Host "Please ensure Node.js is installed (https://nodejs.org) to build the frontend." -ForegroundColor Yellow
    Write-Host "If Node.js is installed in a custom location, add it to your PATH." -ForegroundColor Yellow
} else {
    node -v
    npm -v

    # 3. Build Frontend
    Write-Host "`n[3/5] Building React Frontend bundle..." -ForegroundColor Yellow
    Set-Location $FrontendDir
    Write-Host "Installing frontend dependencies..."
    npm install
    Write-Host "Building production distribution (Vite)..."
    npm run build
}

# 4. Setup Backend & Seed
Write-Host "`n[4/5] Preparing Backend environment..." -ForegroundColor Yellow
Set-Location $BackendDir
Write-Host "Installing backend requirements..."
python -m pip install -r requirements.txt

Write-Host "Seeding initial assessment cohort..."
python seed_assessments.py

# 5. Launch FastAPI Single-Port Server
Write-Host "`n[5/5] Launching Single-Port Server on http://localhost:8000..." -ForegroundColor Green
Write-Host "Press Ctrl+C to terminate the server." -ForegroundColor Gray
Write-Host "Opening browser in 2 seconds..." -ForegroundColor Cyan

Start-Process "http://localhost:8000"

python run.py
