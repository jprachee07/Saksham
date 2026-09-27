import { useParams, Link } from 'react-router-dom';

export default function InterviewRoomExpertPlaceholder() {
  const { sessionId } = useParams();

  return (
    <div className="app-page interview-room-placeholder">
      <div className="app-container">
        <div className="card placeholder-card tactical-corner">
          <div className="card-header">
            <span className="badge badge-gold font-mono">PERSON 2 | FRONTEND B MODULE</span>
            <span className="badge badge-navy font-mono">SESSION: {sessionId}</span>
          </div>

          <div className="card-body">
            <div className="placeholder-icon">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>

            <h1 className="placeholder-title">Expert Interview Board Room</h1>
            <p className="placeholder-desc">
              This route (<code className="font-mono">/interview/expert/{sessionId}</code>) is designated for Person 2 (Frontend B). It contains the live AI interviewer panel, candidate video feed, real-time expression telemetry, answer grading, and suggestion engine.
            </p>

            <div className="status-box">
              <div className="status-item">
                <span className="dot dot-success"></span>
                <span>Person 1 Navigation Integration: <strong>ACTIVE</strong></span>
              </div>
              <div className="status-item">
                <span className="dot dot-gold"></span>
                <span>Session Authorization: <strong>VERIFIED ({sessionId})</strong></span>
              </div>
            </div>

            <div className="placeholder-actions">
              <Link to={`/expert/session/${sessionId}`} className="btn btn-outline-navy btn-sm">
                ← Return to Session Setup
              </Link>
              <Link to="/expert/dashboard" className="btn btn-navy btn-sm">
                Go to Dashboard
              </Link>
              <Link to={`/expert/report/${sessionId}`} className="btn btn-gold btn-sm">
                Preview Post-Interview Report →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .placeholder-card {
          max-width: 680px;
          margin: 3rem auto;
          text-align: center;
          background: #FFFFFF;
        }

        .placeholder-icon {
          width: 72px;
          height: 72px;
          background-color: #081525;
          border: 1px solid #D4AF37;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .placeholder-title {
          font-size: 1.5rem;
          color: var(--color-deep-navy);
          margin-bottom: 0.75rem;
        }

        .placeholder-desc {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: 1.75rem;
        }

        .status-box {
          background-color: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.75rem;
          font-size: 0.8125rem;
          text-align: left;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .dot-success {
          background-color: var(--color-success);
        }

        .dot-gold {
          background-color: var(--color-gold);
        }

        .placeholder-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}
