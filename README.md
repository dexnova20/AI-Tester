# DRACULA
### Autonomous AI QA, Debugging & Security Testing Platform

A frontend-only single-page application with a dark/light theme, simulated scan engine, Google OAuth modal, and a full dashboard UI.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher (only needed to run the dev server)
- A modern browser (Chrome, Firefox, Safari, Edge)

Check your Node version:
```bash
node -v
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run

**Production-style static server:**
```bash
npm start
```

**Dev server with live reload:**
```bash
npm run dev
```

Then open [http://localhost:3001](http://localhost:3001) in your browser.

---

## No Node? Open directly

Since this is a pure static frontend, you can also just open `index.html` directly in your browser — no server required:

```bash
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

> Note: Google Fonts will require an internet connection to load correctly.

---

## Project Structure

```
damnn/
├── index.html      # All pages (landing, login, signup, dashboard)
├── main.js         # All client-side logic
├── styles.css      # Full theme system (light + dark)
├── package.json    # Dev server config
└── README.md
```

---

## Pages

| Page | Description |
|------|-------------|
| Landing | Hero section, platform capabilities, tech stack |
| Login | Email/password form + Google OAuth modal |
| Sign Up | Full registration form with password strength meter |
| Dashboard | Scan console, live terminal, KPI cards, findings panel |

---

## Features

- **Dual Theme** — Sakura Serenity (light) and Enterprise Minimalist (dark), toggled and persisted via `localStorage`
- **Scan Simulation** — Web URL scanner and GitHub Repo Analyzer with randomized terminal log streams
- **Google Account Chooser** — Fake OAuth modal with preset accounts and custom email input
- **Live KPI Dashboard** — Animated counters, security score gauge, session timer
- **Findings Gallery** — Per-scan report cards with viewport preview and vulnerability stats
- **Responsive** — Breakpoints at 1100px, 860px, and 500px

---

## Notes

- All scans are **simulated** — no real network requests are made
- The Google Sign-In (`data-client_id`) is a placeholder and does not perform real OAuth
- No backend, no database, no build step required
