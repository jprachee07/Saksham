# ⚙️ README — Person 4: Backend & AI Engine

> **Your job**: Build ALL the APIs that frontend calls. You are the brain.
> Handle auth, resume parsing, question generation, answer grading, expression analysis, and report generation.
> You use Google Gemini API for all AI features.

---

## 🎯 What You Own

| Module | Description |
|--------|-------------|
| Auth API | Expert login validation + candidate code join |
| Interview Setup API | Parse resume, generate question bank using Gemini |
| Answer Grading API | Score candidate answers using Gemini |
| Follow-up Generation API | Generate next question based on conversation |
| Expression Analysis API | Analyze face image (use face-api.js or Gemini Vision) |
| Report Generation API | Calculate final 5-axis scores, generate report |
| Interview History API | Store and return past interviews |
| Server Setup | Express.js server, CORS, routes, middleware |

---

## 🏗️ Project Setup

### Initialize Backend
```bash
mkdir server
cd server
npm init -y
npm install express cors dotenv @google/generative-ai uuid
```

### Folder Structure
```
server/
├── server.js              ← main entry point
├── .env                   ← API keys (NEVER commit this)
├── routes/
│   ├── auth.js            ← login & join endpoints
│   ├── interview.js       ← create, grade, followup, report endpoints
│   └── expression.js      ← expression analysis endpoint
├── services/
│   ├── geminiService.js   ← all Gemini API calls
│   └── scoringService.js  ← scoring calculations
├── middleware/
│   └── authMiddleware.js  ← token verification
├── data/
│   └── sessions.js        ← in-memory session storage (no database needed for hackathon)
└── package.json
```

### Environment Variables (`.env`)
```
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Get Gemini API key**: Go to https://aistudio.google.com/apikey → Create API Key (free)

---

## 📡 Every API You Must Build

> **IMPORTANT**: Read `API_CONTRACT.md` for the EXACT JSON formats.
> Frontend devs are coding against those formats. If you change anything, tell them.

---

### 1. `POST /api/auth/expert-login`

**What to do:**
1. Receive `name`, `email`, `designation`, `domain`
2. Check email ends with `@drdo.in`, `@gov.in`, or `@rac.gov.in`
3. If invalid → return error
4. Generate a simple token (use `uuid` for hackathon — no real JWT needed)
5. Store expert info in memory
6. Return token + expert data

**Code hint:**
```javascript
const { v4: uuidv4 } = require('uuid');

app.post('/api/auth/expert-login', (req, res) => {
  const { name, email, designation, domain } = req.body;

  // Validate email domain
  const allowedDomains = ['@drdo.in', '@gov.in', '@rac.gov.in'];
  const isValid = allowedDomains.some(d => email.endsWith(d));

  if (!isValid) {
    return res.status(400).json({
      success: false, data: null,
      error: 'Only government organization emails are allowed'
    });
  }

  const expertId = 'exp_' + uuidv4().slice(0, 6);
  const token = uuidv4();

  // Store in memory
  experts[expertId] = { name, email, designation, domain, token };

  res.json({
    success: true,
    data: { token, expertId, name, email, designation, domain }
  });
});
```

---

### 2. `POST /api/auth/candidate-join`

**What to do:**
1. Receive `interviewCode`, `candidateName`
2. Look up the code in active sessions
3. If not found → return error
4. If found → return session info

---

### 3. `POST /api/interview/create` ⭐ (Most Complex)

**What to do:**
1. Receive `expertId`, `resumeText`, `jobDescription`, `candidateName`, `interviewType`, `candidateLevel`, `duration`
2. **Call Gemini API** to:
   - a. Parse resume → extract skills, education, experience, highlights
   - b. Generate question bank (ice breaking + technical + managerial)
3. Generate a unique interview code (format: `INT-XXXXXX`)
4. Store session in memory
5. Return session data with question bank

**Gemini Prompt for Resume Parsing:**
```
You are an expert HR analyst. Parse this resume and extract:
1. Name
2. Education (degree, college)
3. Total experience (years + companies)
4. Key skills (as an array)
5. Top 3 highlights

Resume text:
{resumeText}

Return as JSON:
{
  "name": "...",
  "education": "...",
  "experience": "...",
  "skills": ["...", "..."],
  "highlights": ["...", "..."]
}
```

**Gemini Prompt for Question Generation:**
```
You are a DRDO interview panel expert. Generate interview questions for this candidate.

Candidate Profile:
- Skills: {skills}
- Experience: {experience}
- Education: {education}

Job Description: {jobDescription}
Interview Type: {interviewType}
Candidate Level: {candidateLevel}

Generate questions in 3 phases:

Phase 1 - Ice Breaking (3 questions): Casual, rapport-building questions related to candidate's background.
Phase 2 - Technical (5 questions): Deep technical questions based on their skills and the job requirements. Mix of medium and hard difficulty.
Phase 3 - Managerial (3 questions): Leadership, teamwork, crisis management questions appropriate for their level.

For each question provide:
- question text
- relevance score (0-10, how relevant to this specific candidate)
- category (Ice Breaking / Technical / Managerial)
- difficulty (Easy / Medium / Hard)

Return as JSON:
{
  "iceBreaking": [{ "id": "q1", "question": "...", "relevanceScore": 8.5, "category": "Ice Breaking", "difficulty": "Easy" }],
  "technical": [{ "id": "q3", "question": "...", "relevanceScore": 9.0, "category": "Technical", "difficulty": "Medium" }],
  "managerial": [{ "id": "q8", "question": "...", "relevanceScore": 8.0, "category": "Managerial", "difficulty": "Medium" }]
}
```

**Using Gemini API in code:**
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function callGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Extract JSON from response (Gemini sometimes wraps in ```json ... ```)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  return JSON.parse(text);
}
```

---

### 4. `POST /api/interview/grade-answer` ⭐

**What to do:**
1. Receive `sessionId`, `questionId`, `questionText`, `answerText`, `currentPhase`
2. **Call Gemini API** to grade the answer
3. Return score + breakdown + follow-up questions

**Gemini Prompt for Grading:**
```
You are an expert DRDO interview evaluator. Grade this candidate's answer.

Question: {questionText}
Candidate's Answer: {answerText}
Interview Phase: {currentPhase}

Evaluate on these criteria (each 0-10):
1. Relevance: How relevant is the answer to the question?
2. Depth: How detailed and thorough is the answer?
3. Accuracy: How technically accurate is the answer?
4. Clarity: How clear and well-structured is the communication?

Also:
- Calculate overall answer score (average of above, 0-10)
- Provide brief feedback (1-2 sentences)
- Suggest 2 follow-up questions based on this answer

Return as JSON:
{
  "answerScore": 8.5,
  "maxScore": 10,
  "breakdown": { "relevance": 9.0, "depth": 8.0, "accuracy": 8.5, "clarity": 8.5 },
  "feedback": "Strong answer with...",
  "followUpQuestions": [
    { "id": "fq1", "question": "...", "relevanceScore": 9.0, "difficulty": "Hard" },
    { "id": "fq2", "question": "...", "relevanceScore": 8.5, "difficulty": "Medium" }
  ]
}
```

---

### 5. `POST /api/interview/analyze-expression`

**Two approaches (pick one):**

#### Option A — Use face-api.js on Backend (Recommended for hackathon)
- Return mock/simulated expression data
- Randomize slightly based on timestamp to look realistic

```javascript
app.post('/api/interview/analyze-expression', (req, res) => {
  // For hackathon: return realistic simulated data
  // In production: use TensorFlow or Gemini Vision API
  const baseConfidence = 70 + Math.random() * 20;
  res.json({
    success: true,
    data: {
      confidence: Math.round(baseConfidence),
      nervousness: Math.round(100 - baseConfidence),
      engagement: Math.round(75 + Math.random() * 20),
      eyeContact: Math.round(60 + Math.random() * 30),
      dominantEmotion: baseConfidence > 80 ? "Confident" : "Focused",
      emotions: {
        happy: Math.round(Math.random() * 20),
        neutral: Math.round(50 + Math.random() * 20),
        focused: Math.round(baseConfidence),
        nervous: Math.round(100 - baseConfidence),
        confused: Math.round(Math.random() * 10)
      }
    }
  });
});
```

#### Option B — Use Gemini Vision API (more impressive but uses more API quota)
- Send the base64 image to Gemini's vision model
- Ask it to analyze facial expression

---

### 6. `POST /api/interview/generate-followup`

**What to do:**
1. Receive `sessionId`, `currentPhase`, `conversationHistory`
2. **Call Gemini API** with conversation context
3. Return suggested questions

**Gemini Prompt:**
```
Based on this interview conversation so far, suggest the next best question to ask.

Conversation:
{conversationHistory formatted as "Interviewer: ... \n Candidate: ..."}

Current Phase: {currentPhase}
Candidate Skills: {from stored session}

Suggest 1-2 questions that:
- Follow up on what the candidate just said
- Go deeper into their knowledge
- Are relevant to the job

Return as JSON:
{
  "suggestedQuestions": [
    { "id": "sq1", "question": "...", "relevanceScore": 9.3, "difficulty": "Hard", "reasoning": "..." }
  ]
}
```

---

### 7. `POST /api/interview/generate-report` ⭐

**What to do:**
1. Receive all Q&A data + expression data
2. **Call Gemini API** to generate final assessment
3. Calculate 5-axis scores
4. Return complete report

**Gemini Prompt:**
```
You are a senior DRDO assessment evaluator. Generate a comprehensive interview report.

Candidate: {candidateName}
Questions & Answers with scores:
{allQnA formatted}

Expression Analysis Summary:
- Average Confidence: {averageConfidence}%
- Average Engagement: {averageEngagement}%

Evaluate the candidate on these 5 competency axes (each 0-10):
1. Communication: Clarity, articulation, structured responses
2. Technical Depth: Accuracy, detail, problem-solving ability
3. Domain Relevance: Alignment with job requirements
4. Problem Solving: Analytical thinking, approach to unknowns
5. Confidence & Composure: Body language, steadiness, composure

Also provide:
- Overall score (0-100)
- Recommendation (Strongly Recommended / Recommended / Needs Review / Not Recommended)
- Phase-wise scores
- Top 3 strengths
- Top 3 weaknesses
- Summary paragraph
- 3 improvement suggestions for the candidate

Return as JSON matching the format in API_CONTRACT.md
```

---

### 8. `GET /api/interview/history`

**What to do:**
- Return all sessions for the given expertId from in-memory storage
- Simple array of session summaries

---

### 9. `GET /api/interview/report/:sessionId`

**What to do:**
- Return the stored report for the given session
- If not found → 404 error

---

## 💾 In-Memory Storage (No Database Needed)

For the hackathon, just use JavaScript objects:

```javascript
// data/sessions.js

const experts = {};
// { exp_001: { name, email, designation, domain, token } }

const sessions = {};
// { sess_abc123: { expertId, candidateName, interviewCode, questionBank, status, ... } }

const reports = {};
// { sess_abc123: { competencyScores, phaseWiseScores, strengths, ... } }

module.exports = { experts, sessions, reports };
```

> **Note**: Data resets when server restarts. This is fine for hackathon demo.

---

## 🔌 Server Setup (`server.js`)

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());                    // Allow frontend to call backend
app.use(express.json({ limit: '10mb' }));  // Large limit for base64 images

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/interview', require('./routes/interview'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**Run the server:**
```bash
cd server
node server.js
```
Or with auto-reload:
```bash
npx nodemon server.js
```

---

## 🚫 What You Do NOT Touch

- ❌ Any React code / frontend pages
- ❌ CSS / styling
- ❌ Webcam / video integration
- ❌ Chart rendering
- ❌ PDF generation
- ❌ PPT

---

## 📁 Your Files / Folders

```
server/
├── server.js                  ← you (main entry)
├── .env                       ← you (API keys)
├── package.json               ← you
├── routes/
│   ├── auth.js                ← you
│   ├── interview.js           ← you
│   └── expression.js          ← you
├── services/
│   ├── geminiService.js       ← you (all AI prompts)
│   └── scoringService.js      ← you (score calculations)
├── middleware/
│   └── authMiddleware.js      ← you
└── data/
    └── sessions.js            ← you (in-memory store)
```

---

## 📦 Libraries You Need

```bash
npm install express cors dotenv @google/generative-ai uuid
npm install -D nodemon
```

| Library | What For |
|---------|----------|
| `express` | Web server |
| `cors` | Allow frontend requests |
| `dotenv` | Load .env file |
| `@google/generative-ai` | Gemini API SDK |
| `uuid` | Generate unique IDs and tokens |
| `nodemon` | Auto-restart on code changes (dev only) |

---

## 🧪 Testing Your APIs

Test each endpoint with **Postman** or **Thunder Client** (VS Code extension) before connecting with frontend.

**Example test for `/api/interview/create`:**
```
POST http://localhost:5000/api/interview/create
Headers: Content-Type: application/json
Body:
{
  "expertId": "exp_001",
  "resumeText": "John Doe, B.Tech CSE from IIT Bombay, 4 years at ISRO, skills: Python, Machine Learning, Satellite Systems",
  "jobDescription": "Scientist-B, DRDO LRDE, Required: ML, Signal Processing",
  "candidateName": "John Doe",
  "interviewType": "Technical",
  "candidateLevel": "Mid",
  "duration": 45
}
```

---

## ✅ Checklist Before Integration

- [ ] Server starts without errors on port 5000
- [ ] CORS enabled (frontend on port 5173 can call you)
- [ ] Expert login validates email domain correctly
- [ ] Candidate join validates interview code
- [ ] Interview create returns question bank from Gemini
- [ ] Answer grading returns scores + follow-up questions
- [ ] Expression analysis returns data (mock is fine)
- [ ] Follow-up generation returns contextual questions
- [ ] Report generation returns 5-axis scores + full report
- [ ] History endpoint returns past sessions
- [ ] All responses match API_CONTRACT.md format EXACTLY
- [ ] Error responses use correct format
- [ ] Gemini API key is in .env (not hardcoded)
