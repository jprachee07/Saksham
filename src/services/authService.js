import { isDemoMode, setDemoMode, handleDemoExpertLogin, handleDemoCandidateJoin } from './demoData.js';

export { isDemoMode, setDemoMode };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'saksham_expert_token';
const EXPERT_KEY = 'saksham_expert_profile';
const CANDIDATE_SESSION_KEY = 'saksham_candidate_session';

/**
 * Validate organizational email domain
 * Must end with @drdo.in, @gov.in, or @rac.gov.in
 */
export function isValidOrgEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  return (
    trimmed.endsWith('@drdo.in') ||
    trimmed.endsWith('@gov.in') ||
    trimmed.endsWith('@rac.gov.in')
  );
}

/**
 * Validate interview code format
 * Expected format: INT-XXXXXX (or letters/numbers)
 */
export function isValidInterviewCode(code) {
  if (!code || typeof code !== 'string') return false;
  const regex = /^INT-[A-Z0-9]{4,10}$/i;
  return regex.test(code.trim());
}

/**
 * Expert login / registration
 * @param {Object} credentials { name, email, designation, domain }
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function expertLogin({ name, email, designation, domain }) {
  if (!name || !email || !designation || !domain) {
    return {
      success: false,
      error: 'All fields (Name, Email, Designation, Domain) are required.',
    };
  }

  if (!isValidOrgEmail(email)) {
    return {
      success: false,
      error: 'Organization email must end with @drdo.in, @gov.in, or @rac.gov.in',
    };
  }

  const payload = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    designation: designation.trim(),
    domain: domain.trim(),
  };

  // Isolated Demo Mode Handler (Bypasses backend when in preview mode)
  if (isDemoMode()) {
    const demoResult = handleDemoExpertLogin(payload);
    if (demoResult.data?.token) {
      localStorage.setItem(TOKEN_KEY, demoResult.data.token);
    }
    if (demoResult.data) {
      localStorage.setItem(EXPERT_KEY, JSON.stringify(demoResult.data));
    }
    return demoResult;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/expert-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result || result.success === false) {
      const errorMsg =
        result?.error ||
        `Login failed (${response.status}: ${response.statusText})`;
      return { success: false, error: errorMsg };
    }

    // Save token and profile info to localStorage
    if (result.data?.token) {
      localStorage.setItem(TOKEN_KEY, result.data.token);
    }
    if (result.data) {
      localStorage.setItem(EXPERT_KEY, JSON.stringify(result.data));
    }

    return { success: true, data: result.data };
  } catch (err) {
    console.error('Expert login network error:', err);
    return {
      success: false,
      error:
        err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')
          ? `Unable to connect to backend at ${API_BASE_URL}. Ensure the backend server is running.`
          : err.message || 'An unexpected error occurred during login.',
    };
  }
}

/**
 * Candidate join session
 * @param {Object} params { interviewCode, candidateName }
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export async function candidateJoin({ interviewCode, candidateName }) {
  if (!interviewCode || !candidateName) {
    return {
      success: false,
      error: 'Both Interview Code and Candidate Name are required.',
    };
  }

  const formattedCode = interviewCode.trim().toUpperCase();

  if (!isValidInterviewCode(formattedCode)) {
    return {
      success: false,
      error: 'Invalid interview code format. Expected format: INT-XXXXXX',
    };
  }

  const payload = {
    interviewCode: formattedCode,
    candidateName: candidateName.trim(),
  };

  // Isolated Demo Mode Handler (Bypasses backend when in preview mode)
  if (isDemoMode()) {
    const demoResult = handleDemoCandidateJoin(payload);
    if (demoResult.data) {
      localStorage.setItem(CANDIDATE_SESSION_KEY, JSON.stringify(demoResult.data));
    }
    return demoResult;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/candidate-join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result || result.success === false) {
      const errorMsg =
        result?.error ||
        `Join failed (${response.status}: ${response.statusText})`;
      return { success: false, error: errorMsg };
    }

    if (result.data) {
      localStorage.setItem(CANDIDATE_SESSION_KEY, JSON.stringify(result.data));
    }

    return { success: true, data: result.data };
  } catch (err) {
    console.error('Candidate join network error:', err);
    return {
      success: false,
      error:
        err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')
          ? `Unable to connect to backend at ${API_BASE_URL}. Ensure the backend server is running.`
          : err.message || 'An unexpected error occurred while joining.',
    };
  }
}

/**
 * Expert logout
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPERT_KEY);
}

/**
 * Get saved expert auth token
 */
export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}

/**
 * Check if expert is currently authenticated
 */
export function isAuthenticated() {
  return Boolean(getAuthToken());
}

/**
 * Get current expert profile from localStorage
 */
export function getCurrentExpert() {
  try {
    const raw = localStorage.getItem(EXPERT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Get candidate session data if stored
 */
export function getCandidateSession() {
  try {
    const raw = localStorage.getItem(CANDIDATE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
