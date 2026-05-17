# 🧛 DRACULA 

> **Autonomous AI QA, Debugging, and Security Testing Platform MVP.**
> An extremely robust, cinematic testing suite designed to capture website visuals and review GitHub repositories autonomously.

---

## ⚡ Key Features

*   **Website Testing Flow**: Input a target URL; the backend launches **Playwright**, opens the page, waits for network idle, captures a full-page screenshot, and runs simulated AI analysis for bugs and rate-limiting issues.
*   **GitHub Repository Analysis**: Simulates a containerized clone and build environment, generating detailed runtime terminal logs and diagnosing potential project configuration failures.
*   **Self-Healing Playwright Core**: Automatically detects if Chromium binaries are missing on the host system and installs them cleanly at runtime to prevent crashes.
*   **Intelligent Network Shields**: Integrated `/health` checkers verify the status of the server. If the backend goes offline, the UI intercepts and presents step-by-step diagnostic actions rather than silent network crashes.
*   **Pre-Flight Diagnostics**: Dedicated powershell startup script ensures dependencies are in order and checks for port collisions (ports `3000` & `8000`) before running.

---

## 🛠️ Technology Stack

*   **Frontend**: Next.js 14 (Stable), React 18, Tailwind CSS v4, TypeScript
*   **Backend**: FastAPI, Playwright (Headless Chromium Automation), Python-Dotenv, Uvicorn

---

## 🚀 Getting Started

Ensure you have **Node.js** (v18 or newer) and **Python** (3.9 - 3.12) installed on your system.

### 📋 Phase 1: Environment Configuration

DRACULA utilizes custom environment variables. Configure them by copying the templates:

1.  **Frontend Setup**:
    Copy `frontend/.env.example` to `frontend/.env.local`:
    ```bash
    # frontend/.env.local
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```
2.  **Backend Setup**:
    Copy `backend/.env.example` to `backend/.env`:
    ```bash
    # backend/.env
    HOST=127.0.0.1
    PORT=8000
    CORS_ORIGINS=http://localhost:3000
    ```

---

### 📦 Phase 2: Installing Dependencies

Ensure both frontend and backend packages are loaded:

*   **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    ```
*   **Backend Setup**:
    ```bash
    cd backend
    python -m venv venv
    
    # On Windows:
    .\venv\Scripts\Activate.ps1
    # On Unix/macOS:
    source venv/bin/activate
    
    pip install -r requirements.txt
    ```

---

### 🏁 Phase 3: Launching the App

#### Option A: The Easy Way (With Pre-Flight Diagnostics)
From the root workspace folder, open PowerShell and run:
```powershell
.\start.ps1
```
This script will test if your environments are set up correctly, check if ports `3000` or `8000` are blocked, and launch both dev servers concurrently!

*   **Frontend**: [http://localhost:3000](http://localhost:3000)
*   **Backend API**: [http://localhost:8000](http://localhost:8000)
*   **Interactive API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

#### Option B: Manual Execution
*   **Start Backend**:
    ```bash
    cd backend
    # Activate virtual environment
    .\venv\Scripts\Activate.ps1
    uvicorn main:app --reload --port 8000
    ```
*   **Start Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```

---

## 🛠️ Troubleshooting & Debugging

*   **Port Collision Errors**: If the start script alerts you that Port `3000` or `8000` is blocked, a previously crashed server instance may still be active. You can kill the active process using:
    ```powershell
    # Windows PowerShell:
    Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force
    ```
*   **Missing Playwright Browsers**: If you are running manual mode and Playwright complains about missing binaries, activate the virtual environment and run:
    ```bash
    playwright install chromium
    ```
    *(Note: DRACULA's self-healing backend will also automatically download this if it experiences a launch failure!)*
