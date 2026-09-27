import { useParams, Link } from 'react-router-dom';

export default function InterviewRoomCandidatePlaceholder() {
  const { sessionId } = useParams();

  return (
    <div className="app-page interview-room-placeholder">
      <div className="app-container">
        <div className="card placeholder-card tactical-corner">
          <div className="card-header">
            <span className="badge badge-navy font-mono">CANDIDATE INTERVIEW PORTAL</span>
            <span className="badge badge-gold font-mono">SESSION: {sessionId}</span>
          </div>

          <div className="card-body">
            <div className="placeholder-icon">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                <path d="M23 7l-7 5 7 5V7z"></path>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            </div>

            <h1 className="placeholder-title">Candidate Assessment Board Room</h1>
            <p className="placeholder-desc">
              This route (<code className="font-mono">/interview/candidate/{sessionId}</code>) is designated for Person 2 (Frontend B). It contains the candidate webcam feed, AI interviewer audio/speech, live transcription, and oral response recording.
            </p>

            <div className="status-box">
              <div className="status-item">
                <span className="dot dot-success"></span>
                <span>Candidate Authorization: <strong>VERIFIED</strong></span>
              </div>
              <div className="status-item">
                <span className="dot dot-navy"></span>
                <span>Session ID: <strong className="font-mono">{sessionId}</strong></span>
              </div>
            </div>

            <div className="placeholder-actions">
              <Link to="/candidate/join" className="btn btn-outline-navy btn-sm">
                ← Re-enter Interview Code
              </Link>
              <Link to="/" className="btn btn-gold btn-sm">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .placeholder-card {
          max-width: 640px;
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

        .dot-navy {
          background-color: var(--color-secondary-navy);
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
