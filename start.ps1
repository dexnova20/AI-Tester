# DRACULA - One-Command Setup & Launch
# Usage: powershell -ExecutionPolicy Bypass -File start.ps1

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot

Clear-Host
Write-Host ""
Write-Host "  ============================================" -ForegroundColor Red
Write-Host "        DRACULA  -  AI QA Platform            " -ForegroundColor Red
Write-Host "  ============================================" -ForegroundColor Red
Write-Host ""

function Step($msg) { Write-Host "  >> $msg" -ForegroundColor Cyan }
function Ok($msg)   { Write-Host "  OK $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "  !! $msg" -ForegroundColor Yellow }
function Fail($msg) { Write-Host "  XX $msg" -ForegroundColor Red; Exit 1 }

# --- 1. CHECK PYTHON ---
Step "Checking Python..."
try {
    $pyVersion = python --version 2>&1
    Ok "Found $pyVersion"
} catch {
    Fail "Python not found. Install Python 3.10+ from https://python.org and re-run."
}

# --- 2. CHECK NODE ---
Step "Checking Node.js..."
try {
    $nodeVersion = node --version 2>&1
    Ok "Found Node.js $nodeVersion"
} catch {
    Fail "Node.js not found. Install Node.js 18+ from https://nodejs.org and re-run."
}

# --- 3. BACKEND SETUP ---
$BackendDir = Join-Path $Root "backend"
$VenvDir    = Join-Path $BackendDir "venv"
$VenvPython = Join-Path $VenvDir "Scripts\python.exe"

Step "Setting up backend virtual environment..."

# Delete venv if broken (catches the stale-path / spaces-in-path bug)
if (Test-Path $VenvPython) {
    $testResult = & $VenvPython --version 2>&1
    if ($LASTEXITCODE -ne 0 -or "$testResult" -notmatch "Python") {
        Warn "Existing venv is broken. Recreating..."
        Remove-Item -Recurse -Force $VenvDir
    }
}

if (-not (Test-Path $VenvPython)) {
    Step "Creating fresh virtual environment..."
    python -m venv $VenvDir
    if (-not (Test-Path $VenvPython)) {
        Fail "Failed to create virtual environment. Check your Python installation."
    }
    Ok "Virtual environment created."
} else {
    Ok "Virtual environment already exists."
}

Step "Installing backend dependencies..."
& $VenvPython -m pip install --upgrade pip -q
& $VenvPython -m pip install -r (Join-Path $BackendDir "requirements.txt") -q
Ok "Backend dependencies installed."

Step "Installing Playwright Chromium browser..."
& $VenvPython -m playwright install chromium 2>&1 | Out-Null
Ok "Playwright Chromium ready."

# --- 4. FRONTEND SETUP ---
$FrontendDir = Join-Path $Root "frontend"
$NodeModules = Join-Path $FrontendDir "node_modules"

Step "Setting up frontend dependencies..."
if (-not (Test-Path $NodeModules)) {
    Push-Location $FrontendDir
    npm install --silent
    Pop-Location
    Ok "Frontend dependencies installed."
} else {
    Ok "Frontend dependencies already present."
}

# --- 5. PORT CHECKS ---
Step "Checking ports..."
$p3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$p8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($p3000) { Warn "Port 3000 already in use - frontend may fail to start." }
if ($p8000) { Warn "Port 8000 already in use - backend may fail to start." }
if (-not $p3000 -and -not $p8000) { Ok "Ports 3000 and 8000 are free." }

# --- 6. LAUNCH ---
Write-Host ""
Write-Host "  ============================================" -ForegroundColor DarkGray
Write-Host "   Launching DRACULA Platform..." -ForegroundColor White
Write-Host "   Frontend -> http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Backend  -> http://localhost:8000" -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop." -ForegroundColor DarkGray
Write-Host "  ============================================" -ForegroundColor DarkGray
Write-Host ""

$backendJob = Start-Job -ScriptBlock {
    param($python, $dir)
    Set-Location $dir
    & $python -m uvicorn main:app --reload 2>&1
} -ArgumentList $VenvPython, $BackendDir

Start-Sleep -Seconds 2

$frontendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run dev 2>&1
} -ArgumentList $FrontendDir

# Stream output until Ctrl+C
try {
    while ($true) {
        Receive-Job -Job $backendJob  | ForEach-Object { Write-Host "  [BACKEND]  $_" -ForegroundColor DarkGreen }
        Receive-Job -Job $frontendJob | ForEach-Object { Write-Host "  [FRONTEND] $_" -ForegroundColor DarkCyan }
        Start-Sleep -Milliseconds 500
    }
} finally {
    Write-Host ""
    Write-Host "  Shutting down..." -ForegroundColor Yellow
    if ($backendJob)  { Stop-Job $backendJob;  Remove-Job $backendJob  -Force }
    if ($frontendJob) { Stop-Job $frontendJob; Remove-Job $frontendJob -Force }
    Write-Host "  DRACULA stopped." -ForegroundColor Red
}
