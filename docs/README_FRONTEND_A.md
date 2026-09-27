# 📋 README — Person 1: Frontend A (Pages & Navigation)

> **Your job**: Build all the pages that come BEFORE and AFTER the interview room.
> You handle login, dashboard, setup, and navigation. You do NOT touch the interview board room.

---

## 🎯 What You Own

| Page / Component | Description |
|-----------------|-------------|
| Landing Page | The first page everyone sees. Hero section, features, trust bar |
| Expert Login Page | Form with name, email, designation, domain. Calls `/api/auth/expert-login` |
| Candidate Join Page | Form with interview code + name. Calls `/api/auth/candidate-join` |
| Expert Dashboard | After login — shows "Create New Interview" button + past interviews list |
| Interview Setup Page | Form to upload resume PDF, enter JD, select type/level/duration. Calls `/api/interview/create` |
| Code Generated Page | Shows the generated interview code for expert to share with candidate |
| Interview History Page | Table of past interviews with scores. Calls `GET /api/interview/history` |
| Past Report View | Shows full report of a completed interview. Calls `GET /api/interview/report/:id` |
| Routing / Navigation | React Router — connect all pages, protect expert routes |

---

## 📄 Pages You Build — In Detail

### 1. Landing Page (`/`)

**What to show:**
- Top bar with DRDO logo + tricolor stripe (saffron-white-green thin line at very top)
- Hero section:
  - Big heading: "AI-Powered Interview Intelligence for Defence Research"
  - Subtext explaining what it does in 1 line
  - Two buttons: `Expert Login` and `Join as Candidate`
- "How It Works" section — 3 cards: Setup → Interview → Report
- Features grid — 6 cards (AI Question Engine, Expression Analysis, 3-Phase, 5-Axis Radar, Anti-Bias, Secure)
- Footer with DRDO branding

**Design:**
- Dark navy background (`#0a1628`)
- Gold accents (`#c9a84c`)
- White text
- Glassmorphism cards (semi-transparent with blur)
- Smooth scroll animations on features section

---

### 2. Expert Login Page (`/expert/login`)

**Form fields:**
- Name (text input)
- Organization Email (email input — validate that it ends with `@drdo.in`, `@gov.in`, or `@rac.gov.in`)
- Designation (text input)
- Domain/Expertise (dropdown — options: "Radar Systems", "Missile Tech", "Computer Science", "Electronics", "Mechanical", "Aerospace", "Other")

**On submit:**
- Call `POST /api/auth/expert-login` (see API_CONTRACT.md for format)
- Save the returned token in localStorage
- Redirect to Expert Dashboard

**Validation (frontend side):**
- All fields required
- Email must match allowed domains
- Show error message if login fails

---

### 3. Candidate Join Page (`/candidate/join`)

**Form fields:**
- Interview Code (text input — uppercase, format: `INT-XXXXXX`)
- Full Name (text input)

**On submit:**
- Call `POST /api/auth/candidate-join`
- If valid → redirect to Board Room Candidate View (Person 2 builds this page, just redirect to `/interview/candidate/:sessionId`)
- If invalid code → show error

---

### 4. Expert Dashboard (`/expert/dashboard`)

**What to show:**
- Welcome message: "Welcome, Dr. Sharma"
- Big button: "➕ Create New Interview"
- Table/cards of past interviews (call `GET /api/interview/history`):

| Candidate | Date | Post | Score | Recommendation | Action |
|-----------|------|------|-------|----------------|--------|
| Rahul Verma | 26 Sep 2026 | Scientist-C | 78.5 | Recommended | View Report |

- Clicking "View Report" → goes to `/expert/report/:sessionId`
- Clicking "Create New Interview" → goes to `/expert/setup`

---

### 5. Interview Setup Page (`/expert/setup`)

**Form fields:**
- Candidate Name (text input)
- Resume Upload (file input — PDF only)
  - **Important**: Use a PDF parsing library like `pdf.js` or `pdfjs-dist` to extract text from the PDF on frontend
  - Send the extracted text to backend, NOT the file
- Job Description (textarea — expert types or pastes JD)
- Interview Type (radio: Technical / Managerial / Both)
- Candidate Level (dropdown: Entry / Mid / Senior / Promotion)
- Duration (dropdown: 30 / 45 / 60 mins)

**On submit:**
- Extract text from PDF
- Call `POST /api/interview/create` with `resumeText` + other fields
- Backend returns `interviewCode` + `questionBank`
- Redirect to Code Generated page

---

### 6. Code Generated Page (`/expert/session/:sessionId`)

**What to show:**
- Big displayed code: `INT-7X9K2M` (with copy button)
- "Share this code with the candidate"
- "Start Interview" button → redirects to Board Room Expert View (`/interview/expert/:sessionId`) — Person 2 builds this
- Preview of AI-generated question bank (collapsible sections: Ice Breaking, Technical, Managerial)

---

### 7. Past Report View (`/expert/report/:sessionId`)

**What to show:**
- Call `GET /api/interview/report/:sessionId`
- Display the 5-axis radar chart (use Chart.js — radar type)
- Overall score with recommendation
- Phase-wise score bars
- Strengths & weaknesses lists
- Summary paragraph
- "Download PDF" button (use `html2canvas` + `jsPDF` to generate PDF of this page)

**Radar chart data mapping:**
```javascript
const radarData = {
  labels: ['Communication', 'Technical Depth', 'Domain Relevance', 'Problem Solving', 'Confidence'],
  datasets: [{
    data: [7.5, 8.5, 8.0, 7.8, 7.5],  // from competencyScores in API response
    backgroundColor: 'rgba(201, 168, 76, 0.2)',  // gold with transparency
    borderColor: '#c9a84c'  // gold
  }]
};
```

---

## 🚫 What You Do NOT Touch

- ❌ Board Room / Interview Room UI (that's Person 2)
- ❌ Live transcript display (Person 2)
- ❌ Webcam integration (Person 2)
- ❌ Expression analysis display (Person 2)
- ❌ Real-time answer scoring display during interview (Person 2)
- ❌ Any backend/API code (Person 4)

---

## 📁 Your Files / Folders

```
src/
├── pages/
│   ├── LandingPage.jsx          ← you
│   ├── ExpertLogin.jsx          ← you
│   ├── CandidateJoin.jsx        ← you
│   ├── ExpertDashboard.jsx      ← you
│   ├── InterviewSetup.jsx       ← you
│   ├── SessionCreated.jsx       ← you
│   ├── ReportView.jsx           ← you
│   ├── InterviewRoomExpert.jsx  ← Person 2 (DON'T TOUCH)
│   └── InterviewRoomCandidate.jsx ← Person 2 (DON'T TOUCH)
├── components/
│   ├── Navbar.jsx               ← you
│   ├── Footer.jsx               ← you
│   ├── FeatureCard.jsx          ← you
│   ├── RadarChart.jsx           ← you (used in ReportView)
│   └── ...
├── services/
│   ├── authService.js           ← you (API call functions for login/join)
│   └── interviewService.js      ← you (API call functions for create/history/report)
├── App.jsx                      ← you (routing)
└── index.css                    ← you (design system / theme)
```

---

## 🔌 How Your Pages Connect to Person 2's Pages

1. After expert creates session and clicks "Start Interview" → redirect to `/interview/expert/:sessionId`
   - Person 2 builds `InterviewRoomExpert.jsx` at this route
   - You just do `navigate('/interview/expert/' + sessionId)`

2. After candidate joins → redirect to `/interview/candidate/:sessionId`
   - Person 2 builds `InterviewRoomCandidate.jsx` at this route
   - You just do `navigate('/interview/candidate/' + sessionId)`

3. Pass data between pages using React Context or localStorage:
   - Save `sessionId`, `token`, `questionBank` to localStorage after setup
   - Person 2 reads from localStorage when their page loads

---

## 📦 Libraries You Need

```bash
npm install react-router-dom chart.js react-chartjs-2 jspdf html2canvas pdfjs-dist
```

| Library | What For |
|---------|----------|
| `react-router-dom` | Page routing |
| `chart.js` + `react-chartjs-2` | Radar chart in Report page |
| `jspdf` + `html2canvas` | PDF download of report |
| `pdfjs-dist` | Extract text from uploaded PDF resume |

---

## ✅ Checklist Before Integration

- [ ] Landing page looks professional (dark theme, animations)
- [ ] Expert login validates email domain
- [ ] Interview setup extracts PDF text correctly
- [ ] Generated code page shows code with copy button
- [ ] Dashboard loads past interviews from API
- [ ] Report page shows radar chart with correct data
- [ ] PDF download works
- [ ] All routes are set up in App.jsx
- [ ] Token saved in localStorage after login
- [ ] Redirect to Person 2's pages works
