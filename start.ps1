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

# --- HELPER FUNCTIONS FOR AUTO-INSTALL ---
$TempDir = Join-Path $Root "storage\installers"
if (-not (Test-Path $TempDir)) { New-Item -ItemType Directory -Force -Path $TempDir | Out-Null }


function Refresh-Path {
    Step "Reloading environment variables and path registries..."
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
}

function Uninstall-OldVersion($appName, $versionLimit) {
    $uninstallKeys = @(
        "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall",
        "HKLM:\Software\Wow6432Node\Microsoft\Windows\CurrentVersion\Uninstall",
        "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall"
    )
    foreach ($keyPath in $uninstallKeys) {
        if (Test-Path $keyPath) {
            Get-ChildItem -Path $keyPath | ForEach-Object {
                $displayName = $_.GetValue("DisplayName")
                if ($displayName -and ($displayName -like "*$appName*")) {
                    $version = $_.GetValue("DisplayVersion")
                    if ($version) {
                        try {
                            # Convert string version to comparable version object
                            $cleanVer = $version -replace '[^0-9\.]', ''
                            $parsedVer = [version]$cleanVer
                            $parsedLimit = [version]$versionLimit
                            
                            if ($parsedVer -lt $parsedLimit) {
                                Warn "Outdated $appName version detected: $displayName ($version). Initializing silent uninstallation..."
                                $uninstallString = $_.GetValue("UninstallString")
                                if ($uninstallString) {
                                    if ($uninstallString -match "msiexec") {
                                        # MSI Uninstall
                                        $guid = ($uninstallString -split "/x" | Select-Object -Last 1).Trim()
                                        Step "Uninstalling via MSIexec (GUID: $guid)..."
                                        Start-Process -FilePath "msiexec.exe" -ArgumentList "/x $guid /qn /norestart" -Wait
                                    } else {
                                        # Executable Uninstall
                                        $cleanCmd = ($uninstallString -split " ")[0].Replace('"', '')
                                        Step "Uninstalling via Executable ($cleanCmd)..."
                                        Start-Process -FilePath $cleanCmd -ArgumentList "/quiet /uninstall" -Wait
                                    }
                                    Ok "Successfully uninstalled outdated $appName."
                                }
                            }
                        } catch {
                            # Catch unparseable versions gracefully
                        }
                    }
                }
            }
        }
    }
}

# --- 1. CHECK PYTHON ---
Step "Checking Python..."
$pythonNeedsInstall = $false
try {
    $pyVerRaw = python --version 2>&1
    $pyVerClean = ($pyVerRaw -replace '[^0-9\.]', '').Split(" ")[0]
    $parsedPyVer = [version]$pyVerClean
    
    if ($parsedPyVer -lt [version]"3.10") {
        Warn "Python found but version ($pyVerClean) is below required 3.10."
        $pythonNeedsInstall = $true
        Uninstall-OldVersion "Python" "3.10"
    } else {
        Ok "Found Python $pyVerClean"
    }
} catch {
    Warn "Python is not installed on this system."
    $pythonNeedsInstall = $true
}

if ($pythonNeedsInstall) {
    Step "Automatically downloading Python 3.11.9 (stable, 64-bit)..."
    $pythonUrl = "https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe"
    $pythonDest = Join-Path $TempDir "python-3.11.9-amd64.exe"
    
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $pythonUrl -OutFile $pythonDest
        Step "Installing Python 3.11.9 silently in background..."
        
        # Run silent installer adding to PATH and installing for all users
        $installProcess = Start-Process -FilePath $pythonDest -ArgumentList "/quiet InstallAllUsers=1 PrependPath=1 Include_test=0" -Wait -PassThru
        if ($installProcess.ExitCode -eq 0) {
            Ok "Python 3.11.9 installation completed successfully."
            Refresh-Path
        } else {
            Fail "Python installation exited with non-zero code ($($installProcess.ExitCode)). Please install manually."
        }
    } catch {
        Fail "Failed to automatically download Python: $_. Please install Python 3.10+ manually."
    }
}

# --- 2. CHECK NODE.JS ---
Step "Checking Node.js..."
$nodeNeedsInstall = $false
try {
    $nodeVerRaw = node --version 2>&1
    $nodeVerClean = $nodeVerRaw -replace '[^0-9\.]', ''
    $parsedNodeVer = [version]$nodeVerClean
    
    if ($parsedNodeVer -lt [version]"18.0.0") {
        Warn "Node.js found but version ($nodeVerClean) is below required v18."
        $nodeNeedsInstall = $true
        Uninstall-OldVersion "Node.js" "18.0"
    } else {
        Ok "Found Node.js v$nodeVerClean"
    }
} catch {
    Warn "Node.js is not installed on this system."
    $nodeNeedsInstall = $true
}

if ($nodeNeedsInstall) {
    Step "Automatically downloading Node.js v20.13.1 LTS (LTS, 64-bit)..."
    $nodeUrl = "https://nodejs.org/dist/v20.13.1/node-v20.13.1-x64.msi"
    $nodeDest = Join-Path $TempDir "node-v20.13.1-x64.msi"
    
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $nodeUrl -OutFile $nodeDest
        Step "Installing Node.js v20.13.1 silently in background..."
        
        # Run MSI silently
        $installProcess = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$nodeDest`" /qn /norestart" -Wait -PassThru
        if ($installProcess.ExitCode -eq 0 -or $installProcess.ExitCode -eq 3010) {
            Ok "Node.js v20.13.1 installation completed successfully."
            Refresh-Path
        } else {
            Fail "Node.js installation exited with code ($($installProcess.ExitCode)). Please install manually."
        }
    } catch {
        Fail "Failed to automatically download Node.js: $_. Please install Node.js 18+ manually."
    }
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
