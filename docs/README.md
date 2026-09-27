# Saksham — AI-Powered Interview Simulation Platform

> **DRDO Recruitment & Assessment Centre (RAC)**
> Ministry of Defence, Government of India

## 📖 What Is This?

A web-based interview simulation platform where **AI co-pilots the interviewer** — generating relevant questions from the candidate's resume, grading answers in real-time, tracking facial expressions, and producing a **5-Axis Competency Score** — all while the candidate sees nothing but a clean video conference screen.

## 👥 Team Structure

| Person | Role | README | What They Build |
|--------|------|--------|----------------|
| **Person 1** | Frontend A | [README_FRONTEND_A.md](docs/README_FRONTEND_A.md) | Landing page, login, dashboard, setup, reports, routing |
| **Person 2** | Frontend B | [README_FRONTEND_B.md](docs/README_FRONTEND_B.md) | Board room (video conference), AI panel, transcript, expression overlay |
| **Person 3** | PPT & Docs | [README_PPT.md](docs/README_PPT.md) | Presentation, demo video, testing, documentation |
| **Person 4** | Backend | [README_BACKEND.md](docs/README_BACKEND.md) | All APIs, Gemini AI integration, server |

### 📡 API Contract
All frontend ↔ backend communication formats are documented in:
👉 [**API_CONTRACT.md**](docs/API_CONTRACT.md)

> **Rule**: Frontend sends EXACTLY the JSON shown. Backend returns EXACTLY the JSON shown. No surprises.

---

## 🚀 Quick Start

### Frontend (Person 1 & 2)
```bash
npm install
npm run dev
# Runs on http://localhost:5173
```

### Backend (Person 4)
```bash
cd server
npm install
node server.js
# Runs on http://localhost:5000
```

---

## 🔗 How Everything Connects

```
Person 1 (Pages)          Person 2 (Board Room)
     │                           │
     │   React Router            │  Webcam + AI Panel
     │   ───────────►            │
     │   /interview/expert/      │
     │   /interview/candidate/   │
     │                           │
     └───────────┬───────────────┘
                 │
                 │  HTTP API calls
                 ▼
          Person 4 (Backend)
                 │
                 │  Gemini API calls
                 ▼
           Google Gemini AI

     Person 3 (PPT) ← Takes screenshots of everything
```

---

## 📁 Project Structure

```
INT HACKATHON/
├── README.md                    ← this file
├── docs/
│   ├── API_CONTRACT.md          ← frontend ↔ backend JSON formats
│   ├── README_FRONTEND_A.md     ← Person 1's tasks
│   ├── README_FRONTEND_B.md     ← Person 2's tasks
│   ├── README_PPT.md            ← Person 3's tasks
│   └── README_BACKEND.md        ← Person 4's tasks
├── src/                         ← frontend code (Person 1 & 2)
│   ├── pages/
│   ├── components/
│   ├── services/
│   ├── App.jsx
│   └── index.css
├── server/                      ← backend code (Person 4)
│   ├── server.js
│   ├── routes/
│   ├── services/
│   └── data/
├── package.json
└── vite.config.js
```

---

## 📋 Integration Checklist

Before final demo, verify these cross-team connections:

- [ ] Frontend A → Backend: Expert login works
- [ ] Frontend A → Backend: Candidate join works
- [ ] Frontend A → Backend: Interview create returns question bank
- [ ] Frontend A → Frontend B: Redirect to board room works (sessionId in localStorage)
- [ ] Frontend B → Backend: Grade answer returns scores
- [ ] Frontend B → Backend: Expression analysis returns data
- [ ] Frontend B → Backend: Generate report returns 5-axis scores
- [ ] Frontend B → Frontend A: Report data passed to report view page
- [ ] PPT: All screenshots captured from latest build
- [ ] PPT: Demo video recorded

---

## 🎨 Design System

Use these consistently across ALL pages:

| Token | Value |
|-------|-------|
| Background | `#0a1628` (dark navy) |
| Card Background | `rgba(255, 255, 255, 0.05)` (glassmorphism) |
| Primary Accent | `#c9a84c` (gold) |
| Text Primary | `#ffffff` |
| Text Secondary | `#94a3b8` |
| Success | `#22c55e` |
| Error | `#ef4444` |
| Font | `'Inter', 'Outfit', sans-serif` |
| Border Radius | `12px` (cards), `8px` (buttons) |
| Tricolor Top Bar | `#FF9933, #FFFFFF, #138808` |
