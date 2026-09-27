import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand & Overview */}
          <div className="footer-col brand-col">
            <div className="footer-brand">
              <div className="footer-crest">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                  <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
                </svg>
              </div>
              <span className="footer-brand-title">SAKSHAM</span>
            </div>
            <p className="footer-desc">
              AI-Powered Interview Simulation & Competency Assessment Platform engineered for defence, scientific, and research recruitment intelligence.
            </p>
            <div className="footer-badges">
              <span className="badge badge-navy">INTEL PROTOCOL v2.4</span>
              <span className="badge badge-gold">5-AXIS RADAR</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/">Overview & Framework</Link></li>
              <li><a href="#how-it-works">Evaluation Workflow</a></li>
              <li><a href="#features">AI Assessment Modules</a></li>
              <li><Link to="/candidate/join">Candidate Entry Point</Link></li>
              <li><Link to="/expert/login">Evaluator Authentication</Link></li>
            </ul>
          </div>

          {/* Assessment Criteria */}
          <div className="footer-col">
            <h4 className="footer-heading">Assessment Vectors</h4>
            <ul className="footer-links text-subtle">
              <li>Communication & Clarity</li>
              <li>Technical Depth & Architecture</li>
              <li>Domain & Mission Relevance</li>
              <li>Dynamic Problem Solving</li>
              <li>Composure & Expression Analytics</li>
            </ul>
          </div>

          {/* Security & Standards */}
          <div className="footer-col">
            <h4 className="footer-heading">Compliance & Security</h4>
            <div className="security-box">
              <div className="security-item">
                <span className="security-dot"></span>
                <span>Deterministic Scoring Rubrics</span>
              </div>
              <div className="security-item">
                <span className="security-dot"></span>
                <span>Client-Side PDF Text Isolation</span>
              </div>
              <div className="security-item">
                <span className="security-dot"></span>
                <span>Anti-Bias Objective Synthesis</span>
              </div>
            </div>
            <p className="project-note">
              Developed as an AI interview simulation prototype for competitive assessment evaluation.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © {new Date().getFullYear()} SAKSHAM Platform. All evaluation parameters standardized for defence & scientific interview simulation.
          </div>
          <div className="footer-meta font-mono">
            SYS: STABLE • LATENCY: OPTIMIZED • SEC-LVL: RESEARCH
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background-color: #081525;
          border-top: 1px solid #1E3553;
          color: #94A3B8;
          padding: 3.5rem 0 1.5rem;
          font-size: 0.875rem;
        }

        .footer-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1.2fr 1.5fr;
          gap: 2.5rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid #1E3553;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.85rem;
        }

        .footer-crest {
          width: 30px;
          height: 30px;
          background-color: #10243D;
          border: 1px solid #D4AF37;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-brand-title {
          font-size: 1.125rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #F8FAFC;
        }

        .footer-desc {
          font-size: 0.8125rem;
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }

        .footer-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .footer-heading {
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #F8FAFC;
          margin-bottom: 1rem;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .footer-links a {
          color: #94A3B8;
          text-decoration: none;
          font-size: 0.8125rem;
          transition: color 0.15s ease;
        }

        .footer-links a:hover {
          color: #D4AF37;
        }

        .text-subtle li {
          font-size: 0.8125rem;
          color: #64748B;
        }

        .security-box {
          background-color: #0D1C30;
          border: 1px solid #1E3553;
          border-radius: 4px;
          padding: 0.75rem 1rem;
          margin-bottom: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .security-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #E2E8F0;
        }

        .security-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #D4AF37;
        }

        .project-note {
          font-size: 0.75rem;
          color: #64748B;
          line-height: 1.4;
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.5rem;
          font-size: 0.75rem;
          color: #64748B;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-meta {
          color: #D4AF37;
          font-size: 0.7rem;
        }

        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
        }
      `}</style>
    </footer>
  );
}
