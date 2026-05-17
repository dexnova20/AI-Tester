#!/bin/bash
# DRACULA - One-Command Setup & Launch (Mac/Linux)
# Usage: bash start.sh

set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "  ============================================"
echo "        DRACULA  -  AI QA Platform            "
echo "  ============================================"
echo ""

step() { echo "  >> $1"; }
ok()   { echo "  OK $1"; }
warn() { echo "  !! $1"; }
fail() { echo "  XX $1"; exit 1; }

# --- 1. CHECK PYTHON ---
step "Checking Python..."
if command -v python3 &>/dev/null; then
    ok "Found $(python3 --version)"
else
    fail "Python not found. Install Python 3.10+ from https://python.org or run: brew install python"
fi

# --- 2. CHECK NODE ---
step "Checking Node.js..."
if command -v node &>/dev/null; then
    ok "Found Node.js $(node --version)"
else
    fail "Node.js not found. Install Node.js 18+ from https://nodejs.org or run: brew install node"
fi

# --- 3. BACKEND SETUP ---
BACKEND_DIR="$ROOT/backend"
VENV_DIR="$BACKEND_DIR/venv"
VENV_PYTHON="$VENV_DIR/bin/python"

step "Setting up backend virtual environment..."

# Delete venv if broken
if [ -f "$VENV_PYTHON" ]; then
    if ! "$VENV_PYTHON" --version &>/dev/null; then
        warn "Existing venv is broken. Recreating..."
        rm -rf "$VENV_DIR"
    fi
fi

if [ ! -f "$VENV_PYTHON" ]; then
    step "Creating fresh virtual environment..."
    python3 -m venv "$VENV_DIR"
    ok "Virtual environment created."
else
    ok "Virtual environment already exists."
fi

step "Installing backend dependencies..."
"$VENV_PYTHON" -m pip install --upgrade pip -q
"$VENV_PYTHON" -m pip install -r "$BACKEND_DIR/requirements.txt" -q
ok "Backend dependencies installed."

step "Installing Playwright Chromium browser..."
"$VENV_PYTHON" -m playwright install chromium &>/dev/null
ok "Playwright Chromium ready."

# --- 4. FRONTEND SETUP ---
FRONTEND_DIR="$ROOT/frontend"

step "Setting up frontend dependencies..."
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    (cd "$FRONTEND_DIR" && npm install --silent)
    ok "Frontend dependencies installed."
else
    ok "Frontend dependencies already present."
fi

# --- 5. PORT CHECKS ---
step "Checking ports..."
P3000=$(lsof -ti:3000 2>/dev/null || true)
P8000=$(lsof -ti:8000 2>/dev/null || true)
[ -n "$P3000" ] && warn "Port 3000 already in use - frontend may fail to start."
[ -n "$P8000" ] && warn "Port 8000 already in use - backend may fail to start."
[ -z "$P3000" ] && [ -z "$P8000" ] && ok "Ports 3000 and 8000 are free."

# --- 6. LAUNCH ---
echo ""
echo "  ============================================"
echo "   Launching DRACULA Platform..."
echo "   Frontend -> http://localhost:3000"
echo "   Backend  -> http://localhost:8000"
echo "   Press Ctrl+C to stop."
echo "  ============================================"
echo ""

# Launch backend in background
(cd "$BACKEND_DIR" && "$VENV_PYTHON" -m uvicorn main:app --reload 2>&1 | sed 's/^/  [BACKEND]  /') &
BACKEND_PID=$!

sleep 2

# Launch frontend in background
(cd "$FRONTEND_DIR" && npm run dev 2>&1 | sed 's/^/  [FRONTEND] /') &
FRONTEND_PID=$!

# Wait and handle Ctrl+C
trap "echo ''; echo '  Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '  DRACULA stopped.'; exit 0" SIGINT SIGTERM

wait
