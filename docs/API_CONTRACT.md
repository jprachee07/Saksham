# 📡 API CONTRACT — Frontend ↔ Backend Communication

> **Rule**: Frontend devs (Aryan & Riya) — use EXACTLY these endpoints and JSON formats.
> Backend dev (Sahil) — return EXACTLY these JSON formats. No surprises.

---

## 🔗 Base URL

```
During development: http://localhost:5000/api
```

All endpoints start with `/api/`. Example: `http://localhost:5000/api/auth/expert-login`

---

## 📌 Common Rules

- All requests and responses are **JSON** (`Content-Type: application/json`)
- All responses have this wrapper format:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

On error:
```json
{
  "success": false,
  "data": null,
  "error": "Something went wrong"
}
```

- Use **POST** for sending data, **GET** for fetching data
- Send auth token in header: `Authorization: Bearer <token>`

---

## 1️⃣ AUTH — Login & Join

### POST `/api/auth/expert-login`

> Expert logs in with org email. Backend validates domain and returns token.

**Frontend sends:**
```json
{
  "name": "Dr. Sharma",
  "email": "sharma@drdo.in",
  "designation": "Scientist-F",
  "domain": "Missile Systems"
}
```

**Backend returns:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUz...",
    "expertId": "exp_001",
    "name": "Dr. Sharma",
    "email": "sharma@drdo.in",
    "designation": "Scientist-F",
    "domain": "Missile Systems"
  }
}
```

**Validation rules (backend checks):**
- Email must end with `@drdo.in`, `@gov.in`, or `@rac.gov.in`
- All fields are required
- If invalid email domain → return error

---

### POST `/api/auth/candidate-join`

> Candidate joins using interview code shared by expert.

**Frontend sends:**
```json
{
  "interviewCode": "INT-7X9K2M",
  "candidateName": "Rahul Verma"
}
```

**Backend returns:**
```json
{
  "success": true,
  "data": {
    "sessionId": "sess_abc123",
    "candidateName": "Rahul Verma",
    "interviewType": "Technical",
    "expertName": "Dr. Sharma",
    "duration": 45,
    "phases": ["Ice Breaking", "Technical", "Managerial"]
  }
}
```

**Validation:**
- Code must match an active session
- If invalid code → return error: `"Invalid or expired interview code"`

---

## 2️⃣ INTERVIEW SETUP — Expert Creates Session

### POST `/api/interview/create`

> Expert uploads resume text + job description to create a new interview session.
> **Note:** Frontend extracts text from PDF using a library (pdf.js) and sends plain text. Backend does NOT handle PDF files.

**Frontend sends:**
```json
{
  "expertId": "exp_001",
  "resumeText": "Rahul Verma, B.Tech in Electronics from IIT Delhi, 5 years experience in radar systems at BEL, skills: MATLAB, signal processing, embedded C...",
  "jobDescription": "Scientist-C, Radar & Communication Systems, LRDE Bangalore. Required: Signal processing, antenna design, 3-5 years experience...",
  "candidateName": "Rahul Verma",
  "interviewType": "Technical",
  "candidateLevel": "Mid",
  "duration": 45
}
```

**Backend returns:**
```json
{
  "success": true,
  "data": {
    "sessionId": "sess_abc123",
    "interviewCode": "INT-7X9K2M",
    "candidateProfile": {
      "name": "Rahul Verma",
      "education": "B.Tech Electronics, IIT Delhi",
      "experience": "5 years at BEL",
      "skills": ["MATLAB", "Signal Processing", "Embedded C", "Radar Systems"],
      "highlights": ["Radar systems specialist", "IIT Delhi graduate", "BEL experience"]
    },
    "questionBank": {
      "iceBreaking": [
        {
          "id": "q1",
          "question": "Tell me about yourself and what drew you to defence research.",
          "relevanceScore": 9.2,
          "category": "Ice Breaking",
          "difficulty": "Easy"
        },
        {
          "id": "q2",
          "question": "I see you studied at IIT Delhi. How was your experience there?",
          "relevanceScore": 8.5,
          "category": "Ice Breaking",
          "difficulty": "Easy"
        }
      ],
      "technical": [
        {
          "id": "q3",
          "question": "Can you explain the signal processing pipeline you worked on at BEL?",
          "relevanceScore": 9.7,
          "category": "Technical",
          "difficulty": "Medium"
        },
        {
          "id": "q4",
          "question": "How would you design a phased array radar system for target tracking?",
          "relevanceScore": 9.1,
          "category": "Technical",
          "difficulty": "Hard"
        },
        {
          "id": "q5",
          "question": "What is the difference between pulse Doppler and continuous wave radar?",
          "relevanceScore": 8.8,
          "category": "Technical",
          "difficulty": "Medium"
        }
      ],
      "managerial": [
        {
          "id": "q6",
          "question": "Describe a time when you had to lead a team under a tight deadline.",
          "relevanceScore": 8.0,
          "category": "Managerial",
          "difficulty": "Medium"
        },
        {
          "id": "q7",
          "question": "How do you handle disagreements with senior colleagues on technical decisions?",
          "relevanceScore": 8.3,
          "category": "Managerial",
          "difficulty": "Medium"
        }
      ]
    }
  }
}
```

---

## 3️⃣ DURING INTERVIEW — Real-time AI Features

### POST `/api/interview/grade-answer`

> After candidate answers a question, frontend sends the answer text. Backend grades it.

**Frontend sends:**
```json
{
  "sessionId": "sess_abc123",
  "questionId": "q3",
  "questionText": "Can you explain the signal processing pipeline you worked on at BEL?",
  "answerText": "At BEL, I worked on a radar signal processing chain. We used matched filtering for pulse compression, followed by CFAR detection for target identification. I specifically handled the Doppler processing module using FFT-based methods in MATLAB, and later ported it to embedded C for real-time operation.",
  "currentPhase": "Technical"
}
```

**Backend returns:**
```json
{
  "success": true,
  "data": {
    "answerScore": 8.5,
    "maxScore": 10,
    "breakdown": {
      "relevance": 9.0,
      "depth": 8.0,
      "accuracy": 8.5,
      "clarity": 8.5
    },
    "feedback": "Strong answer with specific technical details. Mentioned key concepts (matched filtering, CFAR, FFT). Could have elaborated more on optimization challenges.",
    "followUpQuestions": [
      {
        "id": "fq1",
        "question": "What CFAR algorithm did you use — CA-CFAR or OS-CFAR? Why?",
        "relevanceScore": 9.5,
        "difficulty": "Hard"
      },
      {
        "id": "fq2",
        "question": "What challenges did you face porting MATLAB code to embedded C?",
        "relevanceScore": 9.0,
        "difficulty": "Medium"
      }
    ]
  }
}
```

---

### POST `/api/interview/analyze-expression`

> Frontend sends a snapshot image (base64) from webcam. Backend analyzes facial expression.
> **Call this every 10-15 seconds during interview.**

**Frontend sends:**
```json
{
  "sessionId": "sess_abc123",
  "imageBase64": "/9j/4AAQSkZJRgABAQ...",
  "timestamp": "2026-09-26T14:32:15Z"
}
```

**Backend returns:**
```json
{
  "success": true,
  "data": {
    "confidence": 78,
    "nervousness": 22,
    "engagement": 85,
    "eyeContact": 70,
    "dominantEmotion": "Focused",
    "emotions": {
      "happy": 10,
      "neutral": 65,
      "focused": 85,
      "nervous": 22,
      "confused": 5
    }
  }
}
```

> **Note**: All values are 0-100 percentages.

---

### POST `/api/interview/generate-followup`

> Expert wants AI to suggest next question based on conversation so far.

**Frontend sends:**
```json
{
  "sessionId": "sess_abc123",
  "currentPhase": "Technical",
  "conversationHistory": [
    {
      "role": "interviewer",
      "text": "Can you explain the signal processing pipeline you worked on?"
    },
    {
      "role": "candidate",
      "text": "At BEL, I worked on radar signal processing. We used matched filtering..."
    }
  ]
}
```

**Backend returns:**
```json
{
  "success": true,
  "data": {
    "suggestedQuestions": [
      {
        "id": "sq1",
        "question": "How did you handle clutter rejection in your radar processing chain?",
        "relevanceScore": 9.3,
        "difficulty": "Hard",
        "reasoning": "Based on candidate's radar experience, this tests deeper knowledge"
      }
    ]
  }
}
```

---

## 4️⃣ FINAL REPORT — After Interview Ends

### POST `/api/interview/generate-report`

> Interview is over. Frontend sends all collected data. Backend generates final assessment.

**Frontend sends:**
```json
{
  "sessionId": "sess_abc123",
  "expertId": "exp_001",
  "candidateName": "Rahul Verma",
  "allQnA": [
    {
      "questionId": "q1",
      "question": "Tell me about yourself.",
      "answer": "I am Rahul Verma, graduated from IIT Delhi...",
      "answerScore": 7.5,
      "phase": "Ice Breaking"
    },
    {
      "questionId": "q3",
      "question": "Explain the signal processing pipeline...",
      "answer": "At BEL, I worked on radar signal processing...",
      "answerScore": 8.5,
      "phase": "Technical"
    }
  ],
  "expressionData": {
    "averageConfidence": 75,
    "averageEngagement": 82,
    "averageEyeContact": 68,
    "averageNervousness": 25,
    "timeline": [
      { "time": "00:05", "confidence": 60, "engagement": 70 },
      { "time": "00:10", "confidence": 72, "engagement": 80 },
      { "time": "00:15", "confidence": 78, "engagement": 85 },
      { "time": "00:20", "confidence": 80, "engagement": 88 }
    ]
  },
  "interviewDuration": 42,
  "totalQuestions": 12
}
```

**Backend returns:**
```json
{
  "success": true,
  "data": {
    "overallScore": 78.5,
    "maxScore": 100,
    "recommendation": "Recommended for next round",
    "competencyScores": {
      "communication": 7.5,
      "technicalDepth": 8.5,
      "domainRelevance": 8.0,
      "problemSolving": 7.8,
      "confidenceComposure": 7.5
    },
    "phaseWiseScores": {
      "iceBreaking": { "score": 7.5, "maxScore": 10, "questionsAsked": 3 },
      "technical": { "score": 8.2, "maxScore": 10, "questionsAsked": 6 },
      "managerial": { "score": 7.8, "maxScore": 10, "questionsAsked": 3 }
    },
    "strengths": [
      "Strong technical depth in radar systems",
      "Clear and structured communication",
      "Good practical experience with specific examples"
    ],
    "weaknesses": [
      "Could improve on leadership examples",
      "Slightly nervous at the start",
      "Limited knowledge on antenna design"
    ],
    "summary": "Rahul Verma demonstrated strong technical expertise in radar signal processing with practical experience at BEL. His communication was clear and structured. Recommended for further consideration for Scientist-C position at LRDE.",
    "candidateImprovementSuggestions": [
      "Prepare more examples of team leadership",
      "Study antenna design fundamentals",
      "Practice staying composed during initial moments"
    ]
  }
}
```

---

## 5️⃣ INTERVIEW HISTORY — Expert Dashboard

### GET `/api/interview/history?expertId=exp_001`

> Expert wants to see past interviews they conducted.

**Backend returns:**
```json
{
  "success": true,
  "data": {
    "interviews": [
      {
        "sessionId": "sess_abc123",
        "candidateName": "Rahul Verma",
        "date": "2026-09-26",
        "post": "Scientist-C, LRDE",
        "overallScore": 78.5,
        "recommendation": "Recommended",
        "duration": 42
      },
      {
        "sessionId": "sess_def456",
        "candidateName": "Priya Nair",
        "date": "2026-09-25",
        "post": "Scientist-B, DRDL",
        "overallScore": 82.0,
        "recommendation": "Strongly Recommended",
        "duration": 38
      }
    ]
  }
}
```

---

### GET `/api/interview/report/:sessionId`

> Fetch full report of a past interview.

**Backend returns:** Same format as the `generate-report` response above.

---

## 🚫 Error Codes

| HTTP Code | Meaning | When |
|-----------|---------|------|
| `200` | Success | Everything worked |
| `400` | Bad Request | Missing fields, wrong format |
| `401` | Unauthorized | Invalid/missing token |
| `403` | Forbidden | Candidate trying to access expert routes |
| `404` | Not Found | Invalid session/interview code |
| `500` | Server Error | Something broke on backend |

**Error response format:**
```json
{
  "success": false,
  "data": null,
  "error": "Invalid interview code. Please check and try again."
}
```

---

## 🔑 Quick Reference — Which Endpoint to Call When

| Moment in App | Endpoint | Who Calls |
|---------------|----------|-----------|
| Expert clicks "Login" | `POST /api/auth/expert-login` | Frontend Person A |
| Candidate clicks "Join" | `POST /api/auth/candidate-join` | Frontend Person A |
| Expert submits resume + JD | `POST /api/interview/create` | Frontend Person A |
| Candidate answers a question | `POST /api/interview/grade-answer` | Frontend Person B |
| Every 10 sec during interview | `POST /api/interview/analyze-expression` | Frontend Person B |
| Expert clicks "Suggest Question" | `POST /api/interview/generate-followup` | Frontend Person B |
| Interview ends | `POST /api/interview/generate-report` | Frontend Person B |
| Expert opens dashboard | `GET /api/interview/history` | Frontend Person A |
| Expert views past report | `GET /api/interview/report/:id` | Frontend Person A |
