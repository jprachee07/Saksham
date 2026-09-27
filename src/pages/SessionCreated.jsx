import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCachedSession } from '../services/interviewService.js';

function getDefaultSession(sessionId) {
  return {
    sessionId,
    interviewCode: 'INT-7X9K2M',
    candidateName: 'Candidate Dossier',
    interviewType: 'Technical',
    candidateLevel: 'Mid',
    duration: 45,
    questionBank: {
      iceBreaking: [
        {
          id: 'q1',
          question: 'Tell me about yourself and what drew you to defence scientific research.',
          relevanceScore: 9.2,
          difficulty: 'Easy',
        },
        {
          id: 'q2',
          question: 'How do you approach multidisciplinary teamwork in high-security environments?',
          relevanceScore: 8.5,
          difficulty: 'Easy',
        },
      ],
      technical: [
        {
          id: 'q3',
          question: 'Can you describe the signal processing chain used in pulse-compression radar systems?',
          relevanceScore: 9.7,
          difficulty: 'Medium',
        },
        {
          id: 'q4',
          question: 'Explain CFAR (Constant False Alarm Rate) target detection. Why choose CA-CFAR vs OS-CFAR in clutter?',
          relevanceScore: 9.5,
          difficulty: 'Hard',
        },
        {
          id: 'q5',
          question: 'How do you design beamforming algorithms for phased array antennas under dynamic jamming?',
          relevanceScore: 9.1,
          difficulty: 'Hard',
        },
      ],
      managerial: [
        {
          id: 'q6',
          question: 'Describe an instance where project delivery was endangered by unforeseen hardware latency. How did you mitigate?',
          relevanceScore: 8.4,
          difficulty: 'Medium',
        },
        {
          id: 'q7',
          question: 'How do you reconcile differing technical judgments between domain specialists under deadline?',
          relevanceScore: 8.2,
          difficulty: 'Medium',
        },
      ],
    },
  };
}

export default function SessionCreated() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [sessionData] = useState(() => getCachedSession(sessionId) || getDefaultSession(sessionId));
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('technical');

  const interviewCode = sessionData?.interviewCode || 'INT-7X9K2M';

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(interviewCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleStartInterview = () => {
    // Navigate to Person 2's Board Room Expert Route
    navigate(`/interview/expert/${sessionId}`);
  };

  const questionBank = sessionData?.questionBank || {};
  const iceBreakingList = questionBank.iceBreaking || [];
  const technicalList = questionBank.technical || [];
  const managerialList = questionBank.managerial || [];

  return (
    <div className="app-page session-created-page">
      <div className="app-container">
        {/* Navigation Breadcrumb */}
        <div className="breadcrumb-nav">
          <Link to="/expert/dashboard" className="breadcrumb-link">
            ← Dashboard
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Session Authorization</span>
        </div>

        {/* Status Header */}
        <div className="session-header-banner">
          <div className="header-status">
            <span className="badge badge-success font-mono">
              <span className="live-dot"></span>
              SESSION GENERATED & STANDBY
            </span>
            <h1 className="session-heading">Interview Session Initialized</h1>
            <p className="session-subheading">
              Session ID: <code className="font-mono">{sessionId}</code> • Candidate:{' '}
              <strong>{sessionData?.candidateName || 'Rahul Verma'}</strong>
            </p>
          </div>

          <div className="header-action">
            <button
              onClick={handleStartInterview}
              className="btn btn-gold btn-lg btn-start"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Start Interview (Enter Room)
            </button>
          </div>
        </div>

        {/* Code Sharing Showcase Box */}
        <div className="card code-share-card tactical-corner">
          <div className="code-share-content">
            <div className="code-display-block">
              <span className="code-label font-mono">CANDIDATE ACCESS CODE</span>
              <div className="code-value-row font-mono">
                <span className="code-text">{interviewCode}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className={`btn ${copied ? 'btn-navy' : 'btn-gold'} btn-sm copy-btn`}
                >
                  {copied ? (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="share-instruction-block">
              <h4 className="share-title">Candidate Access Instructions</h4>
              <p className="share-text">
                Candidate can navigate to <code>/candidate/join</code> and enter this access code with their name to join the room.
              </p>
              <div className="share-meta-row font-mono">
                <span>PORTAL: /candidate/join</span> • <span>EXPIRES: 120 MIN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="session-meta-grid">
          <div className="card meta-box">
            <span className="meta-label">Assessment Type</span>
            <span className="meta-val">{sessionData?.interviewType || 'Technical'}</span>
          </div>
          <div className="card meta-box">
            <span className="meta-label">Seniority Level</span>
            <span className="meta-val">{sessionData?.candidateLevel || 'Mid (Scientist-C)'}</span>
          </div>
          <div className="card meta-box">
            <span className="meta-label">Allocated Duration</span>
            <span className="meta-val font-mono">{sessionData?.duration || 45} Minutes</span>
          </div>
          <div className="card meta-box">
            <span className="meta-label">Synthesized Questions</span>
            <span className="meta-val font-mono text-gold">
              {iceBreakingList.length + technicalList.length + managerialList.length} Items
            </span>
          </div>
        </div>

        {/* Question Bank Preview */}
        <div className="card question-bank-card">
          <div className="card-header">
            <div>
              <span className="badge badge-gold font-mono">QUESTION BANK PREVIEW</span>
              <h2 className="card-title">Evaluation Questions</h2>
              <p className="card-subtitle">
                Generated from candidate competencies and role specifications
              </p>
            </div>

            {/* Phase Switcher Tabs */}
            <div className="phase-tabs">
              <button
                type="button"
                onClick={() => setActiveTab('iceBreaking')}
                className={`tab-btn ${activeTab === 'iceBreaking' ? 'tab-btn-active' : ''}`}
              >
                Ice Breaking ({iceBreakingList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('technical')}
                className={`tab-btn ${activeTab === 'technical' ? 'tab-btn-active' : ''}`}
              >
                Technical Depth ({technicalList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('managerial')}
                className={`tab-btn ${activeTab === 'managerial' ? 'tab-btn-active' : ''}`}
              >
                Managerial / Mission ({managerialList.length})
              </button>
            </div>
          </div>

          <div className="card-body">
            {/* Active Question List */}
            {activeTab === 'iceBreaking' && (
              <div className="question-list">
                {iceBreakingList.map((q, idx) => (
                  <div key={q.id || idx} className="question-item">
                    <div className="question-meta">
                      <span className="q-number font-mono">PHASE 1 | Q{idx + 1}</span>
                      <span className="badge badge-neutral">{q.difficulty || 'Easy'}</span>
                      <span className="q-relevance font-mono">
                        Relevance: {q.relevanceScore || '9.0'}/10
                      </span>
                    </div>
                    <div className="question-text">{q.question}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'technical' && (
              <div className="question-list">
                {technicalList.map((q, idx) => (
                  <div key={q.id || idx} className="question-item">
                    <div className="question-meta">
                      <span className="q-number font-mono">PHASE 2 | Q{idx + 1}</span>
                      <span className={`badge ${q.difficulty === 'Hard' ? 'badge-warning' : 'badge-navy'}`}>
                        {q.difficulty || 'Medium'}
                      </span>
                      <span className="q-relevance font-mono">
                        Relevance: {q.relevanceScore || '9.5'}/10
                      </span>
                    </div>
                    <div className="question-text">{q.question}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'managerial' && (
              <div className="question-list">
                {managerialList.map((q, idx) => (
                  <div key={q.id || idx} className="question-item">
                    <div className="question-meta">
                      <span className="q-number font-mono">PHASE 3 | Q{idx + 1}</span>
                      <span className="badge badge-neutral">{q.difficulty || 'Medium'}</span>
                      <span className="q-relevance font-mono">
                        Relevance: {q.relevanceScore || '8.5'}/10
                      </span>
                    </div>
                    <div className="question-text">{q.question}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .breadcrumb-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          margin-bottom: 1.25rem;
        }

        .breadcrumb-link {
          color: var(--color-deep-navy);
          text-decoration: none;
          font-weight: 500;
        }

        .breadcrumb-separator {
          color: var(--color-text-muted);
        }

        .breadcrumb-current {
          color: var(--color-text-muted);
        }

        .session-header-banner {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }

        .live-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: var(--color-success);
        }

        .session-heading {
          font-size: 2rem;
          color: var(--color-deep-navy);
          margin: 0.5rem 0 0.25rem;
        }

        .session-subheading {
          font-size: 0.9375rem;
          color: var(--color-text-muted);
        }

        .code-share-card {
          background-color: #081525;
          color: #F8FAFC;
          border: 1px solid #1E3553;
          margin-bottom: 2rem;
          box-shadow: 0 4px 14px rgba(8, 21, 37, 0.15);
        }

        .code-share-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2rem;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .code-display-block {
          flex: 1;
          min-width: 280px;
        }

        .code-label {
          font-size: 0.75rem;
          color: #D4AF37;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .code-value-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-top: 0.5rem;
        }

        .code-text {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #F8FAFC;
          text-shadow: 0 0 12px rgba(212, 175, 55, 0.25);
        }

        .copy-btn {
          font-size: 0.8125rem;
          padding: 0.5rem 0.9rem;
        }

        .share-instruction-block {
          flex: 1.4;
          min-width: 280px;
          border-left: 1px solid #1E3553;
          padding-left: 2rem;
        }

        .share-title {
          font-size: 1rem;
          color: #F8FAFC;
          margin-bottom: 0.35rem;
        }

        .share-text {
          font-size: 0.84375rem;
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 0.75rem;
        }

        .share-meta-row {
          font-size: 0.7rem;
          color: #D4AF37;
        }

        .session-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .meta-box {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .meta-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }

        .meta-val {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-deep-navy);
        }

        .text-gold {
          color: #B48E1E;
        }

        .phase-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 0.4rem 0.85rem;
          font-size: 0.8125rem;
          font-weight: 600;
          background: #F1F5F9;
          border: 1px solid var(--color-border);
          color: var(--color-text-dark);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .tab-btn-active {
          background-color: var(--color-deep-navy);
          color: #F8FAFC;
          border-color: var(--color-deep-navy);
        }

        .question-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .question-item {
          padding: 1.25rem;
          background-color: #F8FAFC;
          border: 1px solid var(--color-border);
          border-left: 3px solid var(--color-gold);
          border-radius: 4px;
        }

        .question-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .q-number {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .q-relevance {
          font-size: 0.72rem;
          color: #B48E1E;
          margin-left: auto;
        }

        .question-text {
          font-size: 0.9375rem;
          color: var(--color-deep-navy);
          font-weight: 500;
          line-height: 1.5;
        }

        @media (max-width: 992px) {
          .session-meta-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .share-instruction-block {
            border-left: none;
            padding-left: 0;
            border-top: 1px solid #1E3553;
            padding-top: 1.5rem;
          }
        }

        @media (max-width: 640px) {
          .session-meta-grid {
            grid-template-columns: 1fr;
          }
          .session-header-banner {
            flex-direction: column;
          }
          .btn-start {
            width: 100%;
          }
          .code-value-row {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
