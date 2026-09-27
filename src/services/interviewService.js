import { getAuthToken, getCurrentExpert } from './authService.js';
import {
  isDemoMode,
  handleDemoCreateInterview,
  handleDemoGetInterviewHistory,
  handleDemoGetInterviewReport,
} from './demoData.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper to build auth headers
 */
function getHeaders() {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Create a new interview session
 * @param {Object} params { expertId, resumeText, jobDescription, candidateName, interviewType, candidateLevel, duration }
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function createInterview({
  expertId,
  resumeText,
  jobDescription,
  candidateName,
  interviewType = 'Technical',
  candidateLevel = 'Mid',
  duration = 45,
}) {
  const expert = getCurrentExpert();
  const resolvedExpertId = expertId || expert?.expertId || expert?.id || 'exp_001';

  if (!candidateName?.trim()) {
    return { success: false, error: 'Candidate Name is required.' };
  }
  if (!resumeText?.trim()) {
    return { success: false, error: 'Resume text is required. Please upload a valid resume PDF.' };
  }
  if (!jobDescription?.trim()) {
    return { success: false, error: 'Job Description is required.' };
  }

  const payload = {
    expertId: resolvedExpertId,
    resumeText: resumeText.trim(),
    jobDescription: jobDescription.trim(),
    candidateName: candidateName.trim(),
    interviewType,
    candidateLevel,
    duration: Number(duration),
  };

  // Isolated Demo Mode Handler
  if (isDemoMode()) {
    const demoResult = handleDemoCreateInterview(payload);
    if (demoResult.data?.sessionId) {
      try {
        localStorage.setItem(
          `saksham_session_${demoResult.data.sessionId}`,
          JSON.stringify({
            ...demoResult.data,
            candidateName,
            interviewType,
            candidateLevel,
            duration,
            createdAt: new Date().toISOString(),
          })
        );
      } catch (e) {
        console.warn('Failed to cache session locally:', e);
      }
    }
    return demoResult;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/interview/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result || result.success === false) {
      const errorMsg =
        result?.error ||
        `Interview creation failed (${response.status}: ${response.statusText})`;
      return { success: false, error: errorMsg };
    }

    // Cache the session data locally for quick display / offline resilience
    if (result.data?.sessionId) {
      try {
        localStorage.setItem(
          `saksham_session_${result.data.sessionId}`,
          JSON.stringify({
            ...result.data,
            candidateName,
            interviewType,
            candidateLevel,
            duration,
            createdAt: new Date().toISOString(),
          })
        );
      } catch (e) {
        console.warn('Failed to cache session locally:', e);
      }
    }

    return { success: true, data: result.data };
  } catch (err) {
    console.error('Create interview network error:', err);
    return {
      success: false,
      error:
        err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')
          ? `Unable to connect to backend at ${API_BASE_URL}. Ensure the backend server is running.`
          : err.message || 'An error occurred while creating the interview.',
    };
  }
}

/**
 * Fetch interview history for an expert
 * @param {string} [expertId]
 * @returns {Promise<{success: boolean, data?: {interviews: Array}, error?: string}>}
 */
export async function getInterviewHistory(expertId) {
  // Isolated Demo Mode Handler
  if (isDemoMode()) {
    return handleDemoGetInterviewHistory();
  }

  const expert = getCurrentExpert();
  const resolvedExpertId = expertId || expert?.expertId || expert?.id || '';
  const queryParam = resolvedExpertId ? `?expertId=${encodeURIComponent(resolvedExpertId)}` : '';

  try {
    const response = await fetch(`${API_BASE_URL}/interview/history${queryParam}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result || result.success === false) {
      const errorMsg =
        result?.error ||
        `Failed to fetch interview history (${response.status}: ${response.statusText})`;
      return { success: false, error: errorMsg };
    }

    return { success: true, data: result.data || { interviews: [] } };
  } catch (err) {
    console.error('Get interview history network error:', err);
    return {
      success: false,
      error:
        err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')
          ? `Unable to connect to backend at ${API_BASE_URL}. Check if the backend is running.`
          : err.message || 'An error occurred while fetching interview history.',
    };
  }
}

/**
 * Fetch past or final interview report by session ID
 * @param {string} sessionId
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function getInterviewReport(sessionId) {
  if (!sessionId) {
    return { success: false, error: 'Session ID is required to fetch report.' };
  }

  // Isolated Demo Mode Handler
  if (isDemoMode()) {
    return handleDemoGetInterviewReport(sessionId);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/interview/report/${sessionId}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result || result.success === false) {
      // Check if we have cached report or session data as a graceful fallback
      const cached = localStorage.getItem(`saksham_report_${sessionId}`);
      if (cached) {
        try {
          return { success: true, data: JSON.parse(cached), fromCache: true };
        } catch {
          // ignore
        }
      }

      const errorMsg =
        result?.error ||
        `Failed to load report (${response.status}: ${response.statusText})`;
      return { success: false, error: errorMsg };
    }

    return { success: true, data: result.data };
  } catch (err) {
    console.error('Get interview report network error:', err);

    // Fallback to local cache if available
    const cached = localStorage.getItem(`saksham_report_${sessionId}`);
    if (cached) {
      try {
        return { success: true, data: JSON.parse(cached), fromCache: true };
      } catch {
        // ignore
      }
    }

    return {
      success: false,
      error:
        err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')
          ? `Unable to connect to backend at ${API_BASE_URL}. Please ensure the server is active.`
          : err.message || 'An error occurred while loading the report.',
    };
  }
}

/**
 * Retrieve cached session info (used on SessionCreated page reload)
 */
export function getCachedSession(sessionId) {
  if (!sessionId) return null;
  try {
    const raw = localStorage.getItem(`saksham_session_${sessionId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
