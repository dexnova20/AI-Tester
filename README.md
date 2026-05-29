# 🩸 DRACULA AI
### Autonomous Multi-Agent AI QA & Software Reliability Platform

DRACULA is a production-inspired, autonomous AI QA engineer and software reliability platform. It orchestrates a cooperative team of specialized AI agents to crawl web applications, analyze codebase repositories, grade reliability metrics, predict system failure vectors, and produce high-visibility quality reports.

---

## 🚀 Core Platform Features

* **Autonomous Planner Agent (Master Orchestrator)** — The platform's brain. Based on target attributes, it constructs a verification checklist and dispatches crawler and codebase scanners, executing audit agents **concurrently** via asynchronous workers to keep scans extremely fast.
* **Upgraded Playwright Crawler Agent** — Explores same-origin routes (depth $\le 2$, limit $\le 3$), maps form configurations, logs console exceptions, captures visuals, and generates structured log telemetry.
* **Passive Security Agent** — Performs safe, passive compliance checks, grading transport security (SSL), password validation boundaries, autocomplete forms caching, and hidden anti-CSRF token parameters.
* **WCAG Accessibility Agent** — Audits alternative image tags, Pair-wise form associations, and ARIA landmarks to ensure accessibility standards.
* **Performance Weight Agent** — Estimates page load latencies, blocking script imports, graphic payloads, and bundle densities.
* **Codebase Repository Agent (GitHub MCP Ready)** — Walks file directories, audits `package.json` and `requirements.txt` dependencies, classifies frameworks (Next.js, React, FastAPI, Flask), and inspects configuration files.
* **Centralized Scoring & Benchmark Engine** — Outputs standardized health scores (out of 100) compared against **Industry Averages** (e.g. *Security average: 72*, *Accessibility: 78*), computing comparative offsets (`Difference: +28`).
* **"What Will Break First?" Predictive Failure Engine** — A signature highlight feature. It utilizes DOM findings, logs, and Google Gemini reasoning to pinpoint the most likely system breakdown point, explaining the risk weight and developer mitigation.
* **Historical Trend Intelligence** — Saves reports dynamically to a clean database storage directory, comparison-matching new runs against past audits to detect regressions over time (`Last Scan: 94, Current Scan: 95, Change: +1`).
* **Robust Gemini REST Layer** — Communicates natively with the Google Gemini Flash API via fast direct REST calls. Features an **intelligent offline fallback simulation engine** that dynamically creates realistic AI verdicts if no `GEMINI_API_KEY` is present, guaranteeing a flawless demo.

---

## 📐 Platform Target Architecture

The platform separates concerns across independent analyzers, agents, REST routers, and clean persistence layers:

```
backend/
├── agents/
│   ├── planner_agent.py        # Master Orchestrator (Brain)
│   ├── crawler_agent.py        # Upgraded Playwright Web Crawler
│   ├── security_agent.py       # Defensive Passive Security Scanner
│   ├── accessibility_agent.py  # WCAG / ARIA compliance auditor
│   ├── performance_agent.py    # Payload weight and speed evaluator
│   ├── repo_agent.py           # Code structure & package scanner (MCP Ready)
│   └── reporting_agent.py      # Console and report packaging coordinator
│
├── analyzers/
│   ├── html_analyzer.py        # Structural layout nodes parsed
│   ├── security_analyzer.py    # Non-intrusive compliance audits
│   ├── accessibility_analyzer.py # Accessibility role checker
│   ├── performance_analyzer.py # Transfer bundle size estimates
│   └── repo_analyzer.py        # Readme depth & package quality grader
│
├── services/
│   ├── gemini_service.py       # Gemini Flash API REST & Fallback simulation
│   ├── github_mcp_service.py   # Code blueprint & dependency parser
│   ├── playwright_service.py   # Isolated browser screenshot capture
│   ├── scoring_service.py      # Multi-metric averages & Industry Benchmarks
│   ├── report_service.py       # Executive Dashboard consolidator
│   └── storage_service.py      # Abstracted database & history storage
│
├── storage/
│   ├── reports/                # Unified scan JSON objects
│   ├── screenshots/            # Static route captures
│   └── logs/                   # telemetric log files
│
├── models/                     # API validation schemas
├── routes/                     # FastAPI endpoint paths
├── utils/                      # In-memory storage caches
└── main.py                     # App initialisation & Mounts
```

---

## 🛠️ Prerequisites

Install these utilities on your machine before running:

### Windows:
* **Python 3.10+** — Download from [python.org](https://python.org/downloads) (Ensure "Add Python to PATH" is checked).
* **Node.js 18+** — Download from [nodejs.org](https://nodejs.org).

### macOS & Linux:
* **Python 3.10+ & Node.js 18+** — Can be installed via Homebrew:
  ```bash
  brew install python node
  ```

---

## ⚡ Quick Start (One Command Setup)

**Step 1 — Navigate to cloned repository**
```bash
cd DRACULA
```

**Step 2 — Run the setup and startup script**

### 💻 macOS & Linux Setup:
First, grant execution permissions to the script, then launch it:
```bash
chmod +x start.sh
./start.sh
```

### 🪟 Windows Setup (PowerShell):
```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

---

### What the Automated Startup Script Does:
1. **Intelligent Self-Healing Runtimes (Windows)**: Detects and validates Python ($\ge 3.10$) and Node.js ($\ge v18$) versions. If any are missing or outdated, it crawls the registry to silently uninstall the wrong versions, downloads official stable installers, silent-installs them in the background, and reloads the PATH environment variables for immediate use in the same shell session!
2. Automatically sets up a local Python virtual environment (`backend/venv`).
3. Upgrades pip and installs all backend requirements (`requirements.txt`).
4. Downloads and configures Playwright Chromium driver binaries.
5. Installs all Next.js frontend package dependencies (`node_modules`).
6. Double-checks that ports `3000` (frontend) and `8000` (backend) are free.
7. Concurrently boots both FastAPI and Next.js and streams live console logs to your terminal.


---

## 💻 Accessing the Platform

- **Frontend User Interface**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Backend Server**: [http://localhost:8000](http://localhost:8000)
- **API Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

*Press `Ctrl+C` in your terminal to shut down both servers safely.*

---

## ⚙️ Environment Configurations

The backend retrieves settings from `backend/.env`. On your first run, duplicate the template file:

### Windows:
```powershell
copy backend\.env.example backend\.env
```
### macOS & Linux:
```bash
cp backend/.env.example backend/.env
```

To enable official AI diagnoses, input your API key:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```
*Note: If no API key is specified, DRACULA automatically triggers its cinematic AI simulation generator, preventing runtime crashes.*

---

## 🔧 Manual Startup (Alternative)

If you prefer to launch the layers in separate terminals:

### 💻 macOS & Linux:
**Terminal 1 — Backend**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
playwright install chromium
uvicorn main:app --reload
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm install
npm run dev
```

### 🪟 Windows:
**Terminal 1 — Backend**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
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

## ❌ Troubleshooting & Port Cleanup

If a port conflict occurs (e.g. server is already running in background), clean it using the commands below:

### 💻 macOS & Linux:
```bash
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### 🪟 Windows (PowerShell):
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

### Manual Playwright Browser Download:
If Chromium is flagged as missing on your host machine:

*macOS & Linux:*
```bash
cd backend
source venv/bin/activate
playwright install chromium
```

*Windows:*
```powershell
cd backend
.\venv\Scripts\python.exe -m playwright install chromium
```
