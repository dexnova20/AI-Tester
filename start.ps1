# DRACULA Startup and Diagnostic Script

Clear-Host
Write-Host "====================================================" -ForegroundColor Red
Write-Host "           DRACULA PLATFORM MVP BOOTSTRAP           " -ForegroundColor Red
Write-Host "====================================================" -ForegroundColor Red
Write-Host ""

$HasErrors = $false

# 1. Dependency Validation Checks
Write-Host "🔍 [DIAGNOSTIC] Checking frontend dependencies..." -ForegroundColor Gray
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "❌ [ERROR] Frontend dependencies are missing!" -ForegroundColor Red
    Write-Host "👉 INSTRUCTION: Run the following commands to install dependencies first:" -ForegroundColor Yellow
    Write-Host "   cd frontend" -ForegroundColor White
    Write-Host "   npm install" -ForegroundColor White
    Write-Host ""
    $HasErrors = $true
} else {
    Write-Host "✅ Frontend dependencies detected." -ForegroundColor Green
}

Write-Host "🔍 [DIAGNOSTIC] Checking backend environment..." -ForegroundColor Gray
if (-not (Test-Path "backend\venv")) {
    Write-Host "❌ [ERROR] Backend virtual environment 'venv' is missing!" -ForegroundColor Red
    Write-Host "👉 INSTRUCTION: Set up the Python environment using:" -ForegroundColor Yellow
    Write-Host "   cd backend" -ForegroundColor White
    Write-Host "   python -m venv venv" -ForegroundColor White
    Write-Host "   .\venv\Scripts\Activate.ps1" -ForegroundColor White
    Write-Host "   pip install -r requirements.txt" -ForegroundColor White
    Write-Host ""
    $HasErrors = $true
} else {
    Write-Host "✅ Backend virtual environment detected." -ForegroundColor Green
}

# 2. Port Collision Checks
Write-Host "🔍 [DIAGNOSTIC] Verifying port availability..." -ForegroundColor Gray

# Check Port 3000
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "❌ [COLLISION] Port 3000 (Frontend) is already in use by another process!" -ForegroundColor Red
    Write-Host "👉 INSTRUCTION: Terminate the other process or free up port 3000 before running." -ForegroundColor Yellow
    Write-Host ""
    $HasErrors = $true
} else {
    Write-Host "✅ Port 3000 is free." -ForegroundColor Green
}

# Check Port 8000
$port8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($port8000) {
    Write-Host "❌ [COLLISION] Port 8000 (Backend) is already in use by another process!" -ForegroundColor Red
    Write-Host "👉 INSTRUCTION: Terminate the other process or free up port 8000 before running." -ForegroundColor Yellow
    Write-Host ""
    $HasErrors = $true
} else {
    Write-Host "✅ Port 8000 is free." -ForegroundColor Green
}

if ($HasErrors) {
    Write-Host "💥 Boot failed due to unresolved diagnostic errors." -ForegroundColor Red
    Write-Host "Please resolve the issues above and run the startup script again." -ForegroundColor Yellow
    Exit 1
}

Write-Host ""
Write-Host "🚀 Launching DRACULA Platform in development mode..." -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "🌐 Backend: http://localhost:8000" -ForegroundColor White
Write-Host ""

# Launch using concurrently
npx concurrently -c "cyan,green" -n "BACKEND,FRONTEND" "cd backend && .\venv\Scripts\python.exe -m uvicorn main:app --reload" "cd frontend && npm run dev"
