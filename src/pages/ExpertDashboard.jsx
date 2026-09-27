import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentExpert } from '../services/authService.js';
import { getInterviewHistory } from '../services/interviewService.js';

export default function ExpertDashboard() {
  const [expert] = useState(() => getCurrentExpert());
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleReload = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getInterviewHistory(expert?.expertId);
      if (result.success && result.data?.interviews) {
        setInterviews(result.data.interviews);
      } else if (!result.success) {
        setError(result.error || 'Failed to retrieve assessment history.');
      } else {
        setInterviews([]);
      }
    } catch (err) {
      setError(err.message || 'Error communicating with assessment server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    getInterviewHistory(expert?.expertId)
      .then((result) => {
        if (!isMounted) return;
        if (result.success && result.data?.interviews) {
          setInterviews(result.data.interviews);
        } else if (!result.success) {
          setError(result.error || 'Failed to retrieve assessment history.');
        } else {
          setInterviews([]);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Error communicating with assessment server.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [expert?.expertId]);

  // Filtered interviews for quick search
  const filteredInterviews = interviews.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.candidateName?.toLowerCase().includes(q) ||
      item.post?.toLowerCase().includes(q) ||
      item.recommendation?.toLowerCase().includes(q)
    );
  });

  // Calculate summary metrics
  const totalInterviews = interviews.length;
  const avgScore =
    totalInterviews > 0
      ? (
          interviews.reduce((acc, curr) => acc + (Number(curr.overallScore) || 0), 0) /
          totalInterviews
        ).toFixed(1)
      : '0.0';
  const recommendedCount = interviews.filter((i) =>
    i.recommendation?.toLowerCase().includes('recommend')
  ).length;

  return (
    <div className="app-page expert-dashboard">
      <div className="app-container">
        {/* Welcome & Top Profile Header */}
        <div className="dashboard-header">
          <div className="dashboard-title-area">
            <span className="badge badge-gold font-mono">
              BOARD EVALUATOR ACCESS | {expert?.domain || 'DEFENCE RESEARCH'}
            </span>
            <h1 className="dashboard-heading">
              Welcome, {expert?.name || 'Evaluator'}
            </h1>
            <p className="dashboard-subheading">
              {expert?.designation || 'Scientific Evaluator'} • {expert?.email || 'Authorized DRDO Personnel'}
            </p>
          </div>

          <div className="dashboard-actions">
            <Link to="/expert/setup" className="btn btn-gold btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create New Interview
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="stats-grid">
          <div className="card stat-card">
            <div className="stat-label">Total Conducted</div>
            <div className="stat-value font-mono">{totalInterviews}</div>
            <div className="stat-meta">Simulated Sessions</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Average Score</div>
            <div className="stat-value font-mono text-gold">{avgScore}%</div>
            <div className="stat-meta">Overall Benchmark</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Recommended</div>
            <div className="stat-value font-mono text-success">{recommendedCount}</div>
            <div className="stat-meta">Qualified for Next Round</div>
          </div>

          <div className="card stat-card">
            <div className="stat-label">Protocol Status</div>
            <div className="stat-value font-mono text-navy">ACTIVE</div>
            <div className="stat-meta">5-Axis Assessment Grid</div>
          </div>
        </div>

        {/* Interview History Card */}
        <div className="card history-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Interview Assessment History</h2>
              <p className="card-subtitle">
                Completed candidate simulation dossiers and evaluation reports
              </p>
            </div>

            <div className="table-search-bar">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by candidate, post..."
                className="form-input form-input-sm"
              />
              <button
                onClick={handleReload}
                className="btn btn-outline-navy btn-sm"
                title="Refresh table"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 4v6h-6"></path>
                  <path d="M1 20v-6h6"></path>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
                Sync
              </button>
            </div>
          </div>

          <div className="card-body no-padding">
            {/* Loading State */}
            {isLoading && (
              <div className="state-container">
                <span className="spinner spinner-gold"></span>
                <p className="state-message">Loading assessment archives from server...</p>
              </div>
            )}

            {/* Error State */}
            {!isLoading && error && (
              <div className="state-container">
                <div className="alert alert-warning" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <div>
                    <strong>Connection Notice:</strong> {error}
                    <div style={{ marginTop: '0.5rem' }}>
                      <button
                        onClick={handleReload}
                        className="btn btn-navy btn-sm"
                      >
                        Retry Server Sync
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredInterviews.length === 0 && (
              <div className="state-container">
                <div className="empty-state-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                  </svg>
                </div>
                <h3 className="empty-title">No Candidate Dossiers Found</h3>
                <p className="empty-desc">
                  {searchQuery
                    ? 'No records match your search criteria. Try a different query.'
                    : 'No interview sessions recorded yet. Create an interview session to begin evaluation.'}
                </p>
                <Link to="/expert/setup" className="btn btn-gold btn-sm" style={{ marginTop: '1rem' }}>
                  Configure First Interview
                </Link>
              </div>
            )}

            {/* History Table */}
            {!isLoading && !error && filteredInterviews.length > 0 && (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Date</th>
                      <th>Post / Requisition</th>
                      <th>Score</th>
                      <th>Recommendation</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInterviews.map((item, idx) => (
                      <tr key={item.sessionId || idx}>
                        <td>
                          <div className="candidate-cell">
                            <span className="candidate-name">{item.candidateName}</span>
                            <span className="candidate-session font-mono">
                              ID: {item.sessionId || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="date-badge font-mono">{item.date}</span>
                        </td>
                        <td>
                          <span className="post-text">{item.post || 'Defence Scientist'}</span>
                        </td>
                        <td>
                          <div className="score-cell">
                            <span className="score-value font-mono">
                              {item.overallScore ? Number(item.overallScore).toFixed(1) : 'N/A'}
                            </span>
                            <span className="score-max">/100</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              item.recommendation?.toLowerCase().includes('strongly')
                                ? 'badge-success'
                                : item.recommendation?.toLowerCase().includes('recommend')
                                ? 'badge-gold'
                                : 'badge-neutral'
                            }`}
                          >
                            {item.recommendation || 'Under Review'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link
                            to={`/expert/report/${item.sessionId}`}
                            className="btn btn-outline-navy btn-sm"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            View Report
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }

        .dashboard-heading {
          font-size: 2rem;
          color: var(--color-deep-navy);
          margin: 0.5rem 0 0.25rem;
        }

        .dashboard-subheading {
          font-size: 0.9375rem;
          color: var(--color-text-muted);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .stat-label {
          font-size: 0.78125rem;
          color: var(--color-text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 1.875rem;
          font-weight: 700;
          line-height: 1.1;
          color: var(--color-deep-navy);
        }

        .text-gold {
          color: #B48E1E;
        }

        .text-success {
          color: var(--color-success);
        }

        .text-navy {
          color: var(--color-secondary-navy);
        }

        .stat-meta {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        .history-card {
          background-color: #FFFFFF;
        }

        .card-subtitle {
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
        }

        .table-search-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-input-sm {
          padding: 0.4rem 0.75rem;
          font-size: 0.8125rem;
          width: 220px;
        }

        .no-padding {
          padding: 0;
        }

        .state-container {
          padding: 3.5rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .state-message {
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }

        .empty-state-icon {
          width: 56px;
          height: 56px;
          background-color: #F1F5F9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .empty-title {
          font-size: 1.125rem;
          color: var(--color-deep-navy);
        }

        .empty-desc {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          max-width: 440px;
          line-height: 1.5;
        }

        .candidate-cell {
          display: flex;
          flex-direction: column;
        }

        .candidate-name {
          font-weight: 600;
          color: var(--color-deep-navy);
        }

        .candidate-session {
          font-size: 0.7rem;
          color: var(--color-text-muted);
        }

        .date-badge {
          font-size: 0.8125rem;
          color: #334155;
        }

        .post-text {
          font-weight: 500;
          color: #1E293B;
        }

        .score-cell {
          display: flex;
          align-items: baseline;
          gap: 0.2rem;
        }

        .score-value {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-deep-navy);
        }

        .score-max {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        @media (max-width: 992px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          .dashboard-header {
            flex-direction: column;
          }
          .table-search-bar {
            width: 100%;
          }
          .form-input-sm {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
