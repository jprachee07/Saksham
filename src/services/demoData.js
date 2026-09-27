/**
 * Isolated Demo Data & Handlers for Saksham Platform
 * Provides realistic preview datasets conforming strictly to docs/API_CONTRACT.md.
 * Used exclusively when Demo/Preview Mode is active so all Person 1 pages can be inspected without a live backend.
 */

const DEMO_MODE_KEY = 'saksham_demo_mode';
const DEMO_SESSIONS_STORAGE_KEY = 'saksham_demo_sessions_store';

/**
 * Check if Demo Mode is currently active.
 * Defaults to true if unconfigured, allowing immediate local inspection.
 */
export function isDemoMode() {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(DEMO_MODE_KEY);
  if (stored === null) {
    // Default to true so frontend is immediately testable without backend
    return true;
  }
  return stored === 'true';
}

/**
 * Toggle or set Demo Mode.
 * @param {boolean} enabled
 */
export function setDemoMode(enabled) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEMO_MODE_KEY, String(Boolean(enabled)));
}

/**
 * Initial sample interviews for Expert Dashboard history.
 */
export const initialDemoHistory = [
  {
    sessionId: 'sess_demo_abc123',
    candidateName: 'Rahul Verma [DEMO]',
    date: '2026-09-26',
    post: 'Scientist-C, LRDE Bangalore (Radar & Comms)',
    overallScore: 78.5,
    recommendation: 'Recommended for Next Round',
    duration: 42,
  },
  {
    sessionId: 'sess_demo_def456',
    candidateName: 'Dr. Priya Nair [DEMO]',
    date: '2026-09-25',
    post: 'Scientist-D, DRDL Hyderabad (Missile Dynamics)',
    overallScore: 84.0,
    recommendation: 'Strongly Recommended',
    duration: 48,
  },
  {
    sessionId: 'sess_demo_ghi789',
    candidateName: 'Anand K. Swaminathan [DEMO]',
    date: '2026-09-22',
    post: 'Scientist-B, CAIR Bengaluru (AI & Autonomous Systems)',
    overallScore: 71.5,
    recommendation: 'Recommended with Training',
    duration: 35,
  },
];

/**
 * Pre-configured detailed reports mapped by sessionId.
 */
export const demoReportsMap = {
  sess_demo_abc123: {
    candidateName: 'Rahul Verma [DEMO]',
    post: 'Scientist-C, LRDE Bangalore (Radar & Comms)',
    date: '2026-09-26',
    overallScore: 78.5,
    maxScore: 100,
    recommendation: 'Recommended for Next Round',
    competencyScores: {
      communication: 7.5,
      technicalDepth: 8.5,
      domainRelevance: 8.0,
      problemSolving: 7.8,
      confidenceComposure: 7.5,
    },
    phaseWiseScores: {
      iceBreaking: { score: 7.5, maxScore: 10, questionsAsked: 3 },
      technical: { score: 8.2, maxScore: 10, questionsAsked: 6 },
      managerial: { score: 7.8, maxScore: 10, questionsAsked: 3 },
    },
    strengths: [
      '[DEMO] Demonstrated deep technical mastery in pulse-Doppler radar signal processing pipelines and matched filtering.',
      '[DEMO] High clarity in evaluating CA-CFAR vs OS-CFAR trade-offs under dynamic sea/ground clutter conditions.',
      '[DEMO] Strong practical foundation with real-time embedded C firmware porting and MATLAB algorithm modeling.',
    ],
    weaknesses: [
      '[DEMO] Limited real-world exposure to phased array antenna radiation pattern optimization.',
      '[DEMO] Initial hesitancy observed during rapid-fire hardware-in-the-loop fault isolation scenarios.',
      '[DEMO] Could articulate cross-functional project management under tight defence delivery deadlines with greater structure.',
    ],
    summary:
      '[DEMO PREVIEW] Rahul Verma demonstrated strong technical expertise in radar signal processing with notable practical experience at BEL. His technical explanations were structured and grounded in mathematical principles. Recommended for further consideration for Scientist-C position at LRDE.',
    candidateImprovementSuggestions: [
      '[DEMO] Deepen study into phased array beamforming and planar array calibration techniques.',
      '[DEMO] Practice structured situational leadership responses under pressure.',
      '[DEMO] Enhance active eye contact and composure in initial oral examination moments.',
    ],
  },
  sess_demo_def456: {
    candidateName: 'Dr. Priya Nair [DEMO]',
    post: 'Scientist-D, DRDL Hyderabad (Missile Dynamics)',
    date: '2026-09-25',
    overallScore: 84.0,
    maxScore: 100,
    recommendation: 'Strongly Recommended',
    competencyScores: {
      communication: 8.5,
      technicalDepth: 9.0,
      domainRelevance: 8.8,
      problemSolving: 8.2,
      confidenceComposure: 8.5,
    },
    phaseWiseScores: {
      iceBreaking: { score: 8.5, maxScore: 10, questionsAsked: 3 },
      technical: { score: 8.8, maxScore: 10, questionsAsked: 6 },
      managerial: { score: 8.0, maxScore: 10, questionsAsked: 3 },
    },
    strengths: [
      '[DEMO] Outstanding comprehension of aerodynamic stability, hypersonic boundary layer modeling, and CFD simulations.',
      '[DEMO] Exceptional poise and scientific clarity throughout the technical examination board.',
      '[DEMO] Proven published research in guidance and navigation flight-control algorithms.',
    ],
    weaknesses: [
      '[DEMO] Minor gaps in knowledge concerning legacy launch telemetry protocols.',
      '[DEMO] Highly specialized in propulsion, with comparatively moderate familiarity with telemetry encryption.',
    ],
    summary:
      '[DEMO PREVIEW] Dr. Priya Nair demonstrated exemplary technical leadership, domain depth, and composure. Her contributions in missile dynamics place her in the top percentile of assessed scientific candidates.',
    candidateImprovementSuggestions: [
      '[DEMO] Expand inter-laboratory collaboration with avionics testing teams.',
      '[DEMO] Familiarize with next-generation secure datalink standards.',
    ],
  },
  sess_demo_ghi789: {
    candidateName: 'Anand K. Swaminathan [DEMO]',
    post: 'Scientist-B, CAIR Bengaluru (AI & Autonomous Systems)',
    date: '2026-09-22',
    overallScore: 71.5,
    maxScore: 100,
    recommendation: 'Recommended with Training',
    competencyScores: {
      communication: 7.0,
      technicalDepth: 7.5,
      domainRelevance: 7.2,
      problemSolving: 7.0,
      confidenceComposure: 6.8,
    },
    phaseWiseScores: {
      iceBreaking: { score: 7.0, maxScore: 10, questionsAsked: 3 },
      technical: { score: 7.3, maxScore: 10, questionsAsked: 5 },
      managerial: { score: 7.1, maxScore: 10, questionsAsked: 3 },
    },
    strengths: [
      '[DEMO] Sound theoretical grasp of deep reinforcement learning for robotic motion planning.',
      '[DEMO] High enthusiasm for defence AI research and indigenous hardware accelerators.',
    ],
    weaknesses: [
      '[DEMO] Needs further hardening of real-time embedded safety-critical software constraints.',
      '[DEMO] Exhibited mild nervous hesitation during mathematical derivation of Kalman filters.',
    ],
    summary:
      '[DEMO PREVIEW] Anand K. Swaminathan exhibits promising potential in intelligent systems algorithms. With supplementary training on defence-grade embedded standards, candidate will excel as Scientist-B.',
    candidateImprovementSuggestions: [
      '[DEMO] Practice real-time RTOS scheduling and memory-safety architectures.',
      '[DEMO] Revisit state-estimation mathematics prior to induction.',
    ],
  },
};

/**
 * Get demo sessions store from localStorage to persist newly created sessions in demo mode.
 */
function getDemoSessionsStore() {
  try {
    const raw = localStorage.getItem(DEMO_SESSIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save demo session to store.
 */
function saveDemoSessionToStore(sessionId, sessionObj) {
  try {
    const current = getDemoSessionsStore();
    current[sessionId] = sessionObj;
    localStorage.setItem(DEMO_SESSIONS_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn('Failed to save demo session to localStorage:', e);
  }
}

/**
 * Demo handler: Expert Login
 */
export function handleDemoExpertLogin(credentials) {
  const expertProfile = {
    token: 'demo_token_scientist_f_9921_mock',
    expertId: 'exp_demo_001',
    name: credentials.name?.trim() || 'Dr. Vikram Sharma [DEMO]',
    email: credentials.email?.trim() || 'v.sharma@drdo.in',
    designation: credentials.designation?.trim() || 'Scientist-F, Senior Evaluator',
    domain: credentials.domain?.trim() || 'Radar Systems',
  };

  return {
    success: true,
    data: expertProfile,
    isDemo: true,
  };
}

/**
 * Demo handler: Candidate Join
 */
export function handleDemoCandidateJoin({ interviewCode, candidateName }) {
  const code = (interviewCode || 'INT-DEMO01').trim().toUpperCase();
  const name = (candidateName || 'Rahul Verma [DEMO]').trim();

  // Check if session exists in custom store or use demo session
  const store = getDemoSessionsStore();
  let matchedSessionId = 'sess_demo_abc123';

  for (const [id, s] of Object.entries(store)) {
    if (s.interviewCode === code) {
      matchedSessionId = id;
      break;
    }
  }

  return {
    success: true,
    data: {
      sessionId: matchedSessionId,
      candidateName: name,
      interviewType: 'Technical',
      expertName: 'Dr. Vikram Sharma [DEMO]',
      duration: 45,
      phases: ['Ice Breaking', 'Technical', 'Managerial'],
      interviewCode: code,
    },
    isDemo: true,
  };
}

/**
 * Demo handler: Create Interview
 */
export function handleDemoCreateInterview(payload) {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const sessionId = `sess_demo_${Date.now().toString(36)}`;
  const interviewCode = `INT-${randomSuffix}`;

  const sessionObj = {
    sessionId,
    interviewCode,
    candidateName: `${payload.candidateName?.trim() || 'Candidate Dossier'} [DEMO]`,
    interviewType: payload.interviewType || 'Technical',
    candidateLevel: payload.candidateLevel || 'Mid',
    duration: Number(payload.duration) || 45,
    candidateProfile: {
      name: `${payload.candidateName?.trim() || 'Candidate'} [DEMO]`,
      education: 'B.Tech / M.Tech in Applied Engineering, Premier Institute',
      experience: '4-6 years in specialized defence research & industry projects',
      skills: ['Signal Processing', 'System Modeling', 'MATLAB', 'Embedded C', 'Telemetry'],
      highlights: ['Defence specialist profile', 'Demonstrated domain experience'],
    },
    questionBank: {
      iceBreaking: [
        {
          id: `q_ice_1_${sessionId}`,
          question: `[DEMO] Welcome, ${payload.candidateName || 'Candidate'}. What motivated you to specialize in ${payload.candidateLevel || 'Mid'}-level defence and scientific research?`,
          relevanceScore: 9.3,
          category: 'Ice Breaking',
          difficulty: 'Easy',
        },
        {
          id: `q_ice_2_${sessionId}`,
          question: `[DEMO] How do you handle strict operational protocols and multidisciplinary teamwork under classified environments?`,
          relevanceScore: 8.7,
          category: 'Ice Breaking',
          difficulty: 'Easy',
        },
      ],
      technical: [
        {
          id: `q_tech_1_${sessionId}`,
          question: `[DEMO] Based on the specifications in the job description, how would you architect the primary signal processing pipeline to minimize latency?`,
          relevanceScore: 9.8,
          category: 'Technical',
          difficulty: 'Medium',
        },
        {
          id: `q_tech_2_${sessionId}`,
          question: `[DEMO] Explain your approach to implementing adaptive CFAR target detection under non-homogeneous clutter and jamming.`,
          relevanceScore: 9.5,
          category: 'Technical',
          difficulty: 'Hard',
        },
        {
          id: `q_tech_3_${sessionId}`,
          question: `[DEMO] What trade-offs arise when migrating signal algorithms from MATLAB models to embedded real-time micro-architecture?`,
          relevanceScore: 9.1,
          category: 'Technical',
          difficulty: 'Medium',
        },
      ],
      managerial: [
        {
          id: `q_mgr_1_${sessionId}`,
          question: `[DEMO] Describe an instance where system verification revealed unexpected critical faults close to project deadline. How did you coordinate resolution?`,
          relevanceScore: 8.5,
          category: 'Managerial',
          difficulty: 'Medium',
        },
        {
          id: `q_mgr_2_${sessionId}`,
          question: `[DEMO] How do you navigate technical disagreements between domain experts during formal scientific design reviews?`,
          relevanceScore: 8.3,
          category: 'Managerial',
          difficulty: 'Medium',
        },
      ],
    },
  };

  // Persist demo session to local store
  saveDemoSessionToStore(sessionId, sessionObj);

  return {
    success: true,
    data: sessionObj,
    isDemo: true,
  };
}

/**
 * Demo handler: Get Interview History
 */
export function handleDemoGetInterviewHistory() {
  const store = getDemoSessionsStore();
  const additional = Object.values(store).map((s) => ({
    sessionId: s.sessionId,
    candidateName: s.candidateName,
    date: new Date().toISOString().split('T')[0],
    post: `${s.interviewType} Assessment (${s.candidateLevel})`,
    overallScore: 81.0,
    recommendation: 'Recommended for Next Round',
    duration: s.duration,
  }));

  // Combine initial demo records with newly created sessions
  return {
    success: true,
    data: {
      interviews: [...additional, ...initialDemoHistory],
    },
    isDemo: true,
  };
}

/**
 * Demo handler: Get Interview Report
 */
export function handleDemoGetInterviewReport(sessionId) {
  // Check predefined map
  if (demoReportsMap[sessionId]) {
    return {
      success: true,
      data: demoReportsMap[sessionId],
      isDemo: true,
    };
  }

  // Check store
  const store = getDemoSessionsStore();
  if (store[sessionId]) {
    const s = store[sessionId];
    return {
      success: true,
      data: {
        candidateName: s.candidateName || 'Candidate Dossier [DEMO]',
        post: `${s.interviewType} Specialist, Defence Assessment Simulation`,
        date: new Date().toISOString().split('T')[0],
        overallScore: 80.5,
        maxScore: 100,
        recommendation: 'Recommended for Next Round',
        competencyScores: {
          communication: 8.0,
          technicalDepth: 8.5,
          domainRelevance: 8.2,
          problemSolving: 7.9,
          confidenceComposure: 7.8,
        },
        phaseWiseScores: {
          iceBreaking: { score: 8.0, maxScore: 10, questionsAsked: 2 },
          technical: { score: 8.4, maxScore: 10, questionsAsked: 3 },
          managerial: { score: 7.8, maxScore: 10, questionsAsked: 2 },
        },
        strengths: [
          '[DEMO] Robust technical mastery demonstrated across required domain parameters.',
          '[DEMO] Clear structured explanations grounded in core scientific principles.',
          '[DEMO] Excellent alignment with vacancy specifications.',
        ],
        weaknesses: [
          '[DEMO] Could elaborate more on cross-subsystem verification protocols.',
          '[DEMO] Minor hesitation during complex fault scenario exploration.',
        ],
        summary: `[DEMO PREVIEW] Assessment synthesis for ${s.candidateName}. Demonstrated high scientific competence and problem-solving agility. Recommended for recruitment consideration.`,
        candidateImprovementSuggestions: [
          '[DEMO] Further explore advanced automated testing pipelines.',
          '[DEMO] Strengthen situational leadership examples under operational pressure.',
        ],
      },
      isDemo: true,
    };
  }

  // Default fallback report
  return {
    success: true,
    data: demoReportsMap.sess_demo_abc123,
    isDemo: true,
  };
}
