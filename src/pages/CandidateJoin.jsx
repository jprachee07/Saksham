import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { candidateJoin, isValidInterviewCode } from '../services/authService.js';

export default function CandidateJoin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    interviewCode: '',
    candidateName: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleCodeChange = (e) => {
    // Automatically uppercase the code
    const rawVal = e.target.value.toUpperCase();
    setFormData((prev) => ({ ...prev, interviewCode: rawVal }));

    if (errors.interviewCode) {
      setErrors((prev) => ({ ...prev, interviewCode: null }));
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, candidateName: val }));

    if (errors.candidateName) {
      setErrors((prev) => ({ ...prev, candidateName: null }));
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const validate = () => {
    const errs = {};
    const code = formData.interviewCode.trim();

    if (!code) {
      errs.interviewCode = 'Interview code is required.';
    } else if (!isValidInterviewCode(code)) {
      errs.interviewCode = 'Expected format: INT-XXXXXX (e.g. INT-7X9K2M)';
    }

    if (!formData.candidateName.trim()) {
      errs.candidateName = 'Your full name is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await candidateJoin(formData);

      if (result.success && result.data?.sessionId) {
        // Person 1 boundary: redirect directly to Candidate Interview Room (owned by Person 2)
        navigate(`/interview/candidate/${result.data.sessionId}`);
      } else {
        setApiError(
          result.error ||
          'Failed to join session. Please verify that your interview code is active.'
        );
      }
    } catch (err) {
      setApiError(err.message || 'An unexpected connection error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoCode = () => {
    setFormData({
      interviewCode: 'INT-7X9K2M',
      candidateName: 'Rahul Verma',
    });
    setErrors({});
    setApiError(null);
  };

  return (
    <div className="candidate-join-page">
      <div className="join-card-container">
        {/* Header */}
        <div className="join-header-card">
          <div className="join-crest">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
          </div>
          <span className="badge badge-navy font-mono">CANDIDATE ENTRY GATEWAY</span>
          <h1 className="join-title">Join Interview Session</h1>
          <p className="join-subtitle">
            Enter the authorized assessment code provided by the interview board
          </p>
        </div>

        {/* Form Card */}
        <div className="card join-card tactical-corner">
          <div className="card-body">
            {apiError && (
              <div className="alert alert-error" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <div className="alert-content">
                  <strong>Access Error:</strong> {apiError}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Interview Code Input */}
              <div className="form-group">
                <label htmlFor="interviewCode" className="form-label form-label-required">
                  Interview Access Code
                </label>
                <div className="code-input-wrapper">
                  <input
                    type="text"
                    id="interviewCode"
                    name="interviewCode"
                    value={formData.interviewCode}
                    onChange={handleCodeChange}
                    placeholder="INT-XXXXXX"
                    className={`form-input font-mono code-input ${
                      errors.interviewCode ? 'error' : ''
                    }`}
                    disabled={isSubmitting}
                    maxLength={14}
                    autoComplete="off"
                    autoFocus
                  />
                  <span className="code-format-indicator font-mono">FORMAT: INT-XXXXXX</span>
                </div>
                {errors.interviewCode && (
                  <div className="form-error">{errors.interviewCode}</div>
                )}
              </div>

              {/* Candidate Full Name */}
              <div className="form-group">
                <label htmlFor="candidateName" className="form-label form-label-required">
                  Candidate Full Name
                </label>
                <input
                  type="text"
                  id="candidateName"
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={handleNameChange}
                  placeholder="e.g. Rahul Verma"
                  className={`form-input ${errors.candidateName ? 'error' : ''}`}
                  disabled={isSubmitting}
                  autoComplete="name"
                />
                <div className="form-hint">
                  Ensure the name matches your official application dossier.
                </div>
                {errors.candidateName && (
                  <div className="form-error">{errors.candidateName}</div>
                )}
              </div>

              {/* Action Submit */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-gold btn-block"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Verifying Code & Connecting...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                      Join Assessment Board Room
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Demo Pre-fill for Testing */}
            <div className="demo-helper">
              <button
                type="button"
                onClick={handleFillDemoCode}
                className="btn btn-outline-navy btn-sm"
              >
                Sample Code (INT-7X9K2M)
              </button>
              <span className="demo-hint font-mono">SAMPLE SESSION</span>
            </div>
          </div>
        </div>

        {/* Footer info & link */}
        <div className="join-footer-nav">
          <span>Are you a board evaluator?</span>
          <Link to="/expert/login" className="evaluator-link">
            Evaluator Sign-In Portal →
          </Link>
        </div>
      </div>

      <style>{`
        .candidate-join-page {
          min-height: calc(100vh - 67px);
          background-color: var(--color-bg-app);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
        }

        .join-card-container {
          width: 100%;
          max-width: 500px;
        }

        .join-header-card {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .join-crest {
          width: 44px;
          height: 44px;
          background-color: #081525;
          border: 1px solid #D4AF37;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.85rem;
          box-shadow: 0 4px 10px rgba(8, 21, 37, 0.15);
        }

        .join-title {
          font-size: 1.625rem;
          font-weight: 700;
          color: var(--color-deep-navy);
          margin: 0.5rem 0 0.25rem;
        }

        .join-subtitle {
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }

        .join-card {
          background-color: #FFFFFF;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-md);
        }

        .code-input-wrapper {
          position: relative;
        }

        .code-input {
          font-size: 1.25rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--color-deep-navy);
          padding: 0.75rem 1rem;
        }

        .code-format-indicator {
          display: block;
          margin-top: 0.35rem;
          font-size: 0.72rem;
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
        }

        .btn-block {
          width: 100%;
          padding: 0.8rem;
          font-size: 0.9375rem;
        }

        .form-actions {
          margin-top: 1.5rem;
        }

        .demo-helper {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px dashed var(--color-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .demo-hint {
          font-size: 0.7rem;
          color: var(--color-text-muted);
        }

        .join-footer-nav {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .evaluator-link {
          color: var(--color-deep-navy);
          font-weight: 600;
          text-decoration: underline;
        }

        .evaluator-link:hover {
          color: var(--color-gold-hover);
        }
      `}</style>
    </div>
  );
}
