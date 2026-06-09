<div align="center">

# DRACULA

### Autonomous AI QA, Debugging and Security Testing Platform

![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.2-black?style=flat-square&logo=framer)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Built for Hackathon — A full-stack AI-powered security testing platform with a modern Next.js frontend, live scan simulation, and an enterprise-grade dashboard UI.**

[Live Demo](#) · [Report Bug](https://github.com/dexnova20/DRACULA/issues) · [Request Feature](https://github.com/dexnova20/DRACULA/issues)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Pages](#pages)

---

## Overview

DRACULA is an AI-driven QA and security testing platform that simulates real-world vulnerability scanning across web applications and GitHub repositories. It features a cinematic onboarding experience, a live terminal scan console, animated KPI dashboards, and a dual-theme UI system — all built as a fully responsive Next.js application with zero backend dependencies for the frontend layer.

The platform is designed to demonstrate how AI agents can automate security auditing, surface vulnerability findings, and present actionable intelligence through an intuitive interface.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15.1 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 + Custom CSS Variables |
| Animation | Framer Motion 11.2 |
| UI Components | Custom component library (no external UI lib) |
| Auth | Simulated Google OAuth modal |
| State | React hooks + localStorage persistence |
| Deployment | Vercel-ready (static + SSR capable) |

---

## Features

**AI Scan Engine**
- Web URL scanner with headless Chromium simulation
- GitHub repository analyzer with dependency CVE detection
- Randomized terminal log streams that mimic real scan output
- Configurable scan depth (surface, standard, deep)

**Dashboard and Analytics**
- Animated KPI cards — scan count, vulnerability count, security score
- SVG gauge with live percentage animation
- Session timer that persists across navigation
- Findings gallery with per-scan report cards and viewport previews

**Authentication Flow**
- Email and password login with validation
- Google Account Chooser modal with preset and custom accounts
- Password strength meter on signup (4-segment visual indicator)
- Route guard protecting all authenticated pages

**UI and Theme**
- Dual theme system — Sakura Serenity (light) and Enterprise Minimalist (dark)
- Theme persisted via `localStorage`
- Cinematic intro sequence on first load
- Fully responsive — breakpoints at 1100px, 860px, and 500px

---

## Project Structure

```
dracula/
├── app/
│   ├── ai-agents/          # AI agents management page
│   ├── dashboard/          # Main dashboard page
│   ├── docs/               # Documentation page
│   ├── help/               # Help and support page
│   ├── home/               # Authenticated home page
│   ├── integrations/       # Third-party integrations page
│   ├── login/              # Login page
│   ├── new-scan/           # New scan configuration page
│   ├── reports/            # Reports and history page
│   ├── security/           # Security overview page
│   ├── settings/           # User settings page
│   ├── signup/             # Registration page
│   ├── team/               # Team management page
│   ├── globals.css         # Global styles and CSS variables
│   ├── layout.tsx          # Root app layout
│   └── page.tsx            # Landing page
│
├── components/
│   ├── dashboard/
│   │   ├── DashboardPage.tsx   # Full dashboard view
│   │   ├── FindingsPanel.tsx   # Vulnerability findings list
│   │   ├── KpiCard.tsx         # Animated KPI metric card
│   │   └── TerminalPanel.tsx   # Live scan terminal
│   ├── AppShell.tsx            # Authenticated app wrapper
│   ├── AuthGuard.tsx           # Route protection HOC
│   ├── DeviceShowcase.tsx      # Landing device mockup section
│   ├── FeatureGrid.tsx         # Feature highlights grid
│   ├── HeroSection.tsx         # Landing hero section
│   ├── Logo.tsx                # Brand logo component
│   ├── Navbar.tsx              # Top navigation bar
│   ├── ScanConsole.tsx         # Scan input and control
│   ├── StatsBar.tsx            # Platform stats banner
│   └── ThemeToggle.tsx         # Light/dark toggle
│
├── index.html              # Legacy static version
├── main.js                 # Legacy static JS logic
├── styles.css              # Legacy static styles
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher

```bash
node -v
npm -v
```

### Installation

```bash
# Clone the repository
git clone https://github.com/dexnova20/DRACULA.git
cd DRACULA

# Install dependencies
npm install
```

### Running the App

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### No Node? Open the Legacy Static Version

```bash
start index.html       # Windows
open index.html        # macOS
xdg-open index.html    # Linux
```

> Note: Google Fonts require an internet connection to load correctly.

---

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero, features, stats, device showcase, tech stack |
| `/login` | Login | Email/password form + Google OAuth modal |
| `/signup` | Sign Up | Registration form with password strength meter |
| `/home` | Home | Authenticated scan launcher with mode tabs |
| `/dashboard` | Dashboard | Terminal, KPI cards, findings panel |
| `/ai-agents` | AI Agents | Agent configuration and status |
| `/new-scan` | New Scan | Scan setup wizard |
| `/reports` | Reports | Historical scan reports |
| `/security` | Security | Security posture overview |
| `/integrations` | Integrations | Third-party tool connections |
| `/team` | Team | Member management |
| `/settings` | Settings | Account and theme preferences |
| `/docs` | Docs | Platform documentation |
| `/help` | Help | Support and FAQs |

---

## Notes

- All scans are simulated — no real network requests are made to target URLs
- Google Sign-In is a UI prototype and does not perform real OAuth
- The platform is frontend-only by design for the hackathon submission
- Backend integration points are stubbed and ready for API hookup

---

<div align="center">

Built with focus and speed for the hackathon.

</div>
