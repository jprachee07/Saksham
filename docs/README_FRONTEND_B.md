# 🎥 README — Person 2: Frontend B (Interview Board Room)

> **Your job**: Build the interview room — the video conference screen.
> You build TWO views: what the candidate sees AND what the expert sees (with AI panel).
> You do NOT build login, dashboard, or landing page.

---

## 🎯 What You Own

| Page / Component | Description |
|-----------------|-------------|
| Interview Room — Expert View | Video layout + AI side panel + transcript + live scores |
| Interview Room — Candidate View | Clean video layout only. No AI, no scores visible |
| Webcam Integration | Access camera/mic, display local video feed |
| Interview Controls | Mic mute, camera toggle, end call, next phase |
| AI Side Panel (expert only) | Shows suggested questions, answer scores, follow-up questions |
| Live Transcript Panel (expert only) | Displays conversation as text |
| Expression Overlay (expert only) | Shows confidence/emotion indicators on candidate video |
| Phase Progress Bar | Shows Phase 1/2/3 with timer |

---

## 📄 Pages You Build — In Detail

### 1. Candidate View (`/interview/candidate/:sessionId`)

> The candidate sees ONLY this. It must look like a clean video conference. NO AI stuff.

```
┌────────────────────────────────────────────────┐
│  🛡️ DRDO RAC — Interview Session              │
│                                                │
│  ┌────────────────────┐  ┌──────────────────┐  │
│  │                    │  │                  │  │
│  │   INTERVIEWER      │  │   YOUR CAMERA    │  │
│  │   (placeholder     │  │   (live webcam)  │  │
│  │    or static       │  │                  │  │
│  │    avatar)         │  │                  │  │
│  └────────────────────┘  └──────────────────┘  │
│                                                │
│  Phase: Technical (2/3)    ⏱️ 32:14 remaining  │
│                                                │
│  🎤 Mic  │  📹 Camera  │  🔴 End Interview    │
└────────────────────────────────────────────────┘
```

**What to implement:**
- Access user's webcam using `navigator.mediaDevices.getUserMedia()`
- Display local video feed in the "Your Camera" box
- Interviewer side can be a static professional avatar/placeholder (since this is a simulation, we don't need real WebRTC)
- Timer counting down from session duration
- Phase indicator showing current phase (read from state)
- Mic toggle (mute/unmute icon change)
- Camera toggle (on/off)
- End Interview button → navigates to a "Thank you" screen

**Important rules:**
- ❌ NO AI panel
- ❌ NO scores
- ❌ NO suggested questions
- ❌ NO transcript
- ❌ NO expression analysis display
- Keep it CLEAN and SIMPLE — just a video call

---

### 2. Expert View (`/interview/expert/:sessionId`)

> This is the MAIN screen. The expert sees everything — video + AI assistance.

```
┌──────────────────────────────────────────────────────────────────┐
│  🛡️ DRDO RAC — Expert Panel           Phase 2/3    ⏱️ 32:14    │
│                                                                  │
│  ┌──────────────┐ ┌──────────┐  ┌──────────────────────────────┐│
│  │              │ │          │  │  🧠 AI ASSISTANT             ││
│  │  CANDIDATE   │ │ YOUR CAM │  │                              ││
│  │  WEBCAM      │ │ (self)   │  │  📌 Suggested Question:      ││
│  │              │ │          │  │  "Explain the CFAR algorithm  ││
│  │ [Confidence: │ │          │  │   you implemented at BEL"    ││
│  │  78% 😊]     │ │          │  │                              ││
│  │              │ │          │  │  Relevance: 9.3/10           ││
│  └──────────────┘ └──────────┘  │  Difficulty: Hard            ││
│                                  │                              ││
│  ┌────────────────────────────┐  │  [✅ Use This] [➡️ Next]     ││
│  │  📝 LIVE TRANSCRIPT        │  │                              ││
│  │                            │  │  ─────────────────────────── ││
│  │  Expert: "Can you explain  │  │                              ││
│  │  the signal processing..." │  │  📊 LIVE SCORES             ││
│  │                            │  │  Answer Score: 8.5/10 ████▌ ││
│  │  Candidate: "At BEL, I    │  │  Relevance:    9.0 █████    ││
│  │  worked on radar signal    │  │  Depth:        8.0 ████     ││
│  │  processing chain..."      │  │  Clarity:      8.5 ████▌   ││
│  │                            │  │                              ││
│  │  [Score: 8.5/10] ████▌    │  │  😊 Expression: Confident   ││
│  └────────────────────────────┘  └──────────────────────────────┘│
│                                                                  │
│  🎤 Mic │ 📹 Cam │ ⏭️ Next Phase │ 📊 End & Report │ 🔴 End    │
└──────────────────────────────────────────────────────────────────┘
```

**Layout**: CSS Grid — 3 columns
- Left: Candidate video + expression overlay
- Center-bottom: Live transcript
- Right: AI panel (suggested questions + scores)

---

## 🧩 Components You Build

### A. Video Display Component
```
File: src/components/interview/VideoFeed.jsx
```
- Uses `navigator.mediaDevices.getUserMedia({ video: true, audio: true })`
- Displays video in a `<video>` element
- Accepts props: `isLocal` (true for self, false for remote/placeholder)
- For the "other person" feed in demo → show a static avatar or looped placeholder video

**Code hint:**
```javascript
const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
videoRef.current.srcObject = stream;
```

### B. AI Panel Component (Expert Only)
```
File: src/components/interview/AIPanel.jsx
```
- Shows current suggested question (from question bank or follow-ups)
- "Use This" button → adds question to transcript
- "Next" button → shows next suggested question
- Shows answer score after grading (calls `POST /api/interview/grade-answer`)
- Shows follow-up questions returned from grading

**When to call APIs:**
- When expert clicks "Grade Answer" → call `POST /api/interview/grade-answer` with the transcript text
- When expert clicks "Suggest Question" → call `POST /api/interview/generate-followup`

### C. Transcript Panel Component (Expert Only)
```
File: src/components/interview/TranscriptPanel.jsx
```
- Scrollable list of conversation entries
- Each entry shows: role (Expert/Candidate), text, and score (if graded)
- Expert manually types/enters what was said (or use Web Speech API for auto-transcription)
- Input field at bottom to add entries

**Optional upgrade**: Use Web Speech API for real-time speech-to-text:
```javascript
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.onresult = (event) => {
  const text = event.results[event.results.length - 1][0].transcript;
  // Add to transcript
};
recognition.start();
```

### D. Expression Overlay Component (Expert Only)
```
File: src/components/interview/ExpressionOverlay.jsx
```
- Small overlay on top of candidate's video
- Shows: Confidence %, Emotion emoji, Engagement level
- Every 10-15 seconds → capture a frame from candidate's video and call `POST /api/interview/analyze-expression`

**How to capture a frame:**
```javascript
const canvas = document.createElement('canvas');
canvas.width = videoElement.videoWidth;
canvas.height = videoElement.videoHeight;
canvas.getContext('2d').drawImage(videoElement, 0, 0);
const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];
// Send imageBase64 to backend
```

> **Note**: In the demo, since candidate and expert are on the same machine, use the webcam feed as the "candidate" feed and capture from that.

### E. Phase Bar Component
```
File: src/components/interview/PhaseBar.jsx
```
- Shows 3 phases as a progress bar: Ice Breaking → Technical → Managerial
- Current phase highlighted
- Timer countdown
- "Next Phase" button (expert view only)

### F. Interview Controls Component
```
File: src/components/interview/InterviewControls.jsx
```
- Bottom toolbar
- Buttons: Mic toggle, Camera toggle, Next Phase, End & Generate Report, End Call
- "End & Generate Report" → calls `POST /api/interview/generate-report` and redirects to Report page (built by Person 1)

---

## 🔗 How You Connect with Others

### Getting data from Person 1's pages:
- When your page loads, read from `localStorage`:
```javascript
const sessionId = localStorage.getItem('sessionId');
const questionBank = JSON.parse(localStorage.getItem('questionBank'));
const token = localStorage.getItem('token');
```

### Sending data to Person 1's report page:
- After calling `POST /api/interview/generate-report`, save the report data:
```javascript
localStorage.setItem('reportData', JSON.stringify(reportResponse.data));
navigate('/expert/report/' + sessionId);
```

### Calling Backend (Person 4's) APIs:
- During interview → call `grade-answer`, `analyze-expression`, `generate-followup`
- At end → call `generate-report`
- See `API_CONTRACT.md` for exact JSON formats

---

## 🚫 What You Do NOT Touch

- ❌ Landing page (Person 1)
- ❌ Login / Join pages (Person 1)
- ❌ Dashboard (Person 1)
- ❌ Interview Setup page (Person 1)
- ❌ Report View page (Person 1)
- ❌ Radar chart (Person 1)
- ❌ Any backend code (Person 4)
- ❌ PPT (Person 3)

---

## 📁 Your Files / Folders

```
src/
├── pages/
│   ├── InterviewRoomExpert.jsx      ← you
│   └── InterviewRoomCandidate.jsx   ← you
├── components/
│   └── interview/
│       ├── VideoFeed.jsx            ← you
│       ├── AIPanel.jsx              ← you
│       ├── TranscriptPanel.jsx      ← you
│       ├── ExpressionOverlay.jsx    ← you
│       ├── PhaseBar.jsx             ← you
│       └── InterviewControls.jsx    ← you
├── services/
│   └── interviewLiveService.js      ← you (API calls for grade, expression, followup, report)
```

---

## 📦 Libraries You Need

```bash
npm install
# No extra libraries needed! Everything uses browser APIs:
# - navigator.mediaDevices (webcam)
# - webkitSpeechRecognition (speech-to-text, optional)
# - canvas (frame capture)
```

---

## ✅ Checklist Before Integration

- [ ] Webcam feed shows in both views
- [ ] Candidate view is CLEAN — no AI stuff visible
- [ ] Expert view has AI panel with suggested questions
- [ ] "Use This" and "Next" buttons work for questions
- [ ] Grade answer API call works, shows score in panel
- [ ] Expression capture sends frame every 10-15 sec
- [ ] Transcript panel shows conversation entries
- [ ] Phase bar shows current phase with timer
- [ ] "Next Phase" advances the phase
- [ ] "End & Report" calls generate-report API
- [ ] Controls (mic, camera, end) toggle properly
- [ ] SessionId and questionBank read from localStorage correctly
