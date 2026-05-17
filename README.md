# DRACULA
### Autonomous AI QA, Debugging & Security Testing Platform

---

## What it does

- **Website Scanner** — Input any URL, DRACULA launches a headless Chromium browser, crawls up to 3 pages, captures screenshots, detects accessibility/security/UI issues and generates an AI audit report.
- **GitHub Repo Analyzer** — Simulates a clone and build environment, diagnoses configuration failures and generates a detailed findings report.
- **Self-Healing Browser** — Automatically installs Playwright Chromium binaries if missing on the host machine.
- **Live Scan Console** — Real-time terminal log stream, score gauges, screenshot gallery and findings panel update as the scan runs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, Tailwind CSS v4, TypeScript |
| Backend | FastAPI, Uvicorn, Playwright (Headless Chromium), Python-Dotenv |

---

## Prerequisites

Install these two tools on your machine before anything else:

- [Python 3.10+](https://python.org/downloads) — make sure to check **"Add Python to PATH"** during install
- [Node.js 18+](https://nodejs.org)

---

## Quick Start (One Command)

**1. Clone the repo**
```powershell
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

**2. Run the start script**
```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

That's it. The script will automatically:
- Detect and validate Python and Node.js
- Create a Python virtual environment
- Install all backend dependencies (`requirements.txt`)
- Install Playwright Chromium browser
- Install all frontend dependencies (`node_modules`)
- Check ports 3000 and 8000 are free
- Launch both servers and stream logs to the terminal

**3. Open the app**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs

Press `Ctrl+C` to stop both servers.

---

## Environment Variables

The backend reads from `backend/.env`. Copy the example file on first run:

```powershell
copy backend\.env.example backend\.env
```

Default values work out of the box for local development:
```
HOST=127.0.0.1
PORT=8000
CORS_ORIGINS=http://localhost:3000
```

---

## Manual Start (Alternative)

If you prefer to run servers separately, open two terminals:

**Terminal 1 — Backend**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m playwright install chromium
python -m uvicorn main:app --reload
```

**Terminal 2 — Frontend**
```powershell
cd frontend
npm install
npm run dev
```

---

## Mac / Linux Users

### Prerequisites
- [Python 3.10+](https://python.org/downloads)
- [Node.js 18+](https://nodejs.org)

### Step 1 — Clone the repo
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### Step 2 — Setup and start backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install chromium
uvicorn main:app --reload
```
Backend is ready when you see: `Uvicorn running on http://127.0.0.1:8000`

### Step 3 — Start frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend is ready when you see: `Local: http://localhost:3000`

### Step 4 — Open the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

Press `Ctrl+C` in each terminal to stop the servers.

### Environment Variables (Mac)
```bash
cp backend/.env.example backend/.env
```

### Troubleshooting (Mac)

**Port already in use**
```bash
# Kill port 8000
lsof -ti:8000 | xargs kill -9
# Kill port 3000
lsof -ti:3000 | xargs kill -9
```

**`python3` not found**
```bash
brew install python
```

**`node` not found**
```bash
brew install node
```

**Playwright Chromium missing**
```bash
cd backend
source venv/bin/activate
playwright install chromium
```

---

## Troubleshooting

**Port already in use**
```powershell
# Kill whatever is on port 8000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force
# Kill whatever is on port 3000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

**`pip` / `uvicorn` fatal launcher error**

This happens when the venv path contains spaces. Use `python -m` prefix instead:
```powershell
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload
```
The `start.ps1` script handles this automatically.

**Playwright Chromium missing**
```powershell
cd backend
.\venv\Scripts\python.exe -m playwright install chromium
```
