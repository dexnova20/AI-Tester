# DRACULA

Autonomous AI QA, Debugging, and Security Testing Platform MVP.

## Features
- **Website Testing Flow**: Enter a URL, Playwright opens the site, takes a screenshot, and a mock AI generates a dummy QA analysis report.
- **GitHub Repository Analysis Flow**: Enter a GitHub repo URL, the backend simulates cloning, environment setup, and execution, returning fake logs and a mock AI analysis of errors.

## Tech Stack
- Frontend: Next.js, Tailwind CSS, TypeScript
- Backend: FastAPI, Playwright

## Getting Started

### Backend
1. `cd backend`
2. Create virtual environment: `python -m venv venv`
3. Activate virtual environment: `.\venv\Scripts\Activate.ps1` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install requirements: `pip install -r requirements.txt`
5. Install Playwright browsers: `playwright install chromium`
6. Run the server: `uvicorn main:app --reload`

Backend runs on `http://localhost:8000`.

### Frontend
1. `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

Frontend runs on `http://localhost:3000`.
