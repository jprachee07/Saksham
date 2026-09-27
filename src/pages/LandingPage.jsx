import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard.jsx';

export default function LandingPage() {
  const featureList = [
    {
      id: 'f1',
      title: 'Question Synthesis',
      description:
        'Extracts competencies from candidate resumes and generates role-aligned question banks matching job specifications.',
      badge: 'GEMINI POWERED',
      number: '01',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      ),
    },
    {
      id: 'f2',
      title: 'Expression Analysis',
      description:
        'Monitors candidate composure, confidence, and engagement during technical examination phases.',
      badge: 'REAL-TIME TELEMETRY',
      number: '02',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
      ),
    },
    {
      id: 'f3',
      title: '3-Phase Interview',
      description:
        'Sequential progression through Ice Breaking, Technical Rigor, and Managerial assessment phases.',
      badge: 'STANDARDIZED PROTOCOL',
      number: '03',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
    },
    {
      id: 'f4',
      title: '5-Axis Competency Radar',
      description:
        'Evaluates candidates across Communication, Technical Depth, Domain Relevance, Problem Solving, and Confidence.',
      badge: 'RADAR VISUALIZATION',
      number: '04',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      ),
    },
    {
      id: 'f5',
      title: 'Anti-Bias Evaluation',
      description:
        'Calibrates scoring against standardized assessment rubrics to maintain objective candidate appraisal.',
      badge: 'OBJECTIVE SCORING',
      number: '05',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
    },
    {
      id: 'f6',
      title: 'Secure Architecture',
      description:
        'Client-side PDF text extraction and role-based access for board members and candidates.',
      badge: 'RESEARCH-GRADE PRIVACY',
      number: '06',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="landing-page bg-grid-pattern">
      {/* Tactical Coordinate Sub-Header */}
      <div className="tactical-banner">
        <div className="app-container tactical-banner-content font-mono">
          <span>SYS-ID: SKM-DEF-AI | PROTOCOL: STAGE-1 SIMULATION</span>
          <span className="badge badge-gold">DEFENCE RESEARCH ASSESSMENT SYSTEM</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="app-container hero-container">
          <div className="hero-badge-wrap">
            <span className="badge badge-gold">
              <span className="pulse-dot"></span>
              RECRUITMENT & COMPETENCY SIMULATION
            </span>
          </div>

          <h1 className="hero-title">
            AI-Powered Interview Intelligence for Defence Research
          </h1>

          <p className="hero-subtitle">
            Standardized interview simulation and competency assessment platform for defence recruitment boards.
          </p>

          <div className="hero-actions">
            <Link to="/expert/login" className="btn btn-gold btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Expert Login
            </Link>
            <Link to="/candidate/join" className="btn btn-outline-gold btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Join as Candidate
            </Link>
          </div>

          {/* Operational Metrics Strip */}
          <div className="metrics-strip">
            <div className="metric-box">
              <span className="metric-value font-mono">3-PHASE</span>
              <span className="metric-label">Structured Assessment Pipeline</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-box">
              <span className="metric-value font-mono">5-AXIS</span>
              <span className="metric-label">Competency Vector Mapping</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-box">
              <span className="metric-value font-mono">0.0%</span>
              <span className="metric-label">Subjective Interviewer Bias</span>
            </div>
            <div className="metric-divider"></div>
            <div className="metric-box">
              <span className="metric-value font-mono">PDF.JS</span>
              <span className="metric-label">Client-Side Text Extraction</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="app-container">
          <div className="section-header">
            <span className="badge badge-navy">STANDARDIZED WORKFLOW</span>
            <h2 className="section-title">Evaluation Workflow</h2>
            <p className="section-desc">
              Three-step assessment lifecycle from requisition configuration to official performance dossier.
            </p>
          </div>

          <div className="workflow-grid">
            <div className="workflow-step-card">
              <div className="step-badge-number font-mono">STEP 01</div>
              <div className="step-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3 className="step-title">1. Setup & Ingestion</h3>
              <p className="step-desc">
                Evaluator uploads resume PDF and role requirements. Candidate skills are extracted client-side to generate tailored questions.
              </p>
              <div className="step-tags font-mono">
                <span>RESUME EXTRACT</span> • <span>JD MATCHING</span>
              </div>
            </div>

            <div className="workflow-connector">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>

            <div className="workflow-step-card">
              <div className="step-badge-number font-mono">STEP 02</div>
              <div className="step-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <h3 className="step-title">2. Interview Simulation</h3>
              <p className="step-desc">
                Candidate joins via session code. The board conducts a structured 3-phase assessment with real-time scoring and expression metrics.
              </p>
              <div className="step-tags font-mono">
                <span>DYNAMIC GRADING</span> • <span>TELEMETRY</span>
              </div>
            </div>

            <div className="workflow-connector">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>

            <div className="workflow-step-card">
              <div className="step-badge-number font-mono">STEP 03</div>
              <div className="step-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                </svg>
              </div>
              <h3 className="step-title">3. Evaluation Dossier</h3>
              <p className="step-desc">
                Generates a 5-axis competency radar report, phase-wise score breakdowns, identified strengths, and recruitment recommendations.
              </p>
              <div className="step-tags font-mono">
                <span>5-AXIS RADAR</span> • <span>PDF EXPORT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="features-section">
        <div className="app-container">
          <div className="section-header">
            <span className="badge badge-gold">INTELLIGENCE CAPABILITIES</span>
            <h2 className="section-title">Engineered for Rigorous Assessment</h2>
            <p className="section-desc">
              Precision features designed to evaluate scientists, engineers, and technical personnel for sensitive and mission-critical roles.
            </p>
          </div>

          <div className="features-grid">
            {featureList.map((feature) => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                badge={feature.badge}
                number={feature.number}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Access Action Banner */}
      <section className="cta-section">
        <div className="app-container">
          <div className="cta-box tactical-corner">
            <div className="cta-content">
              <span className="badge badge-gold">DEFENCE RESEARCH BENCHMARK</span>
              <h2 className="cta-title">Begin Structured Candidate Evaluation</h2>
              <p className="cta-text">
                Authorized assessment board members can log in to initialize an interview session. Candidates can enter with an authorized interview access code.
              </p>
            </div>
            <div className="cta-buttons">
              <Link to="/expert/login" className="btn btn-gold btn-lg">
                Enter Evaluator Portal
              </Link>
              <Link to="/candidate/join" className="btn btn-outline-gold btn-lg">
                Candidate Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .landing-page {
          min-height: calc(100vh - 67px);
          display: flex;
          flex-direction: column;
          background-color: var(--color-bg-app);
        }

        .tactical-banner {
          background-color: #E2EEF7;
          border-bottom: 1px solid #CFDFEC;
          padding: 0.35rem 0;
          font-size: 0.72rem;
          color: #475569;
        }

        .tactical-banner-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .hero-section {
          padding: 4.5rem 0 3.5rem;
          border-bottom: 1px solid #CFDFEC;
          text-align: center;
          position: relative;
        }

        .hero-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-badge-wrap {
          margin-bottom: 1.5rem;
        }

        .pulse-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #B48E1E;
          box-shadow: 0 0 6px rgba(180, 142, 30, 0.6);
        }

        .hero-title {
          font-size: 2.75rem;
          font-weight: 700;
          line-height: 1.2;
          color: var(--color-deep-navy);
          letter-spacing: -0.02em;
          margin-bottom: 1.25rem;
        }

        .hero-subtitle {
          font-size: 1.125rem;
          line-height: 1.7;
          color: var(--color-text-muted);
          max-width: 760px;
          margin: 0 auto 2.25rem;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          flex-wrap: wrap;
          margin-bottom: 3.5rem;
        }

        .hero-actions .btn-outline-gold {
          color: #8C6A04;
          border-color: #B48E1E;
          background-color: rgba(212, 175, 55, 0.08);
        }

        .hero-actions .btn-outline-gold:hover {
          background-color: rgba(212, 175, 55, 0.16);
          color: #6D5100;
        }

        .metrics-strip {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background-color: #0D1C30;
          border: 1px solid #1E3553;
          border-radius: 6px;
          padding: 1.5rem 1rem;
          flex-wrap: wrap;
          gap: 1rem;
          box-shadow: var(--shadow-md);
        }

        .metric-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          text-align: center;
        }

        .metric-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #D4AF37;
          letter-spacing: 0.05em;
        }

        .metric-label {
          font-size: 0.75rem;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .metric-divider {
          width: 1px;
          height: 36px;
          background-color: #1E3553;
        }

        /* Section Commons */
        .section-header {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 3rem;
        }

        .section-title {
          font-size: 2rem;
          color: var(--color-deep-navy);
          margin: 0.75rem 0;
          letter-spacing: -0.015em;
        }

        .section-desc {
          font-size: 0.9375rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        /* How it works */
        .how-it-works-section {
          padding: 4.5rem 0;
          border-bottom: 1px solid #CFDFEC;
          background-color: transparent;
        }

        .workflow-grid {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          gap: 1.25rem;
        }

        .workflow-step-card {
          flex: 1;
          background-color: #0D1C30;
          border: 1px solid #1E3553;
          border-radius: 6px;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: var(--shadow-sm);
        }

        .step-badge-number {
          font-size: 0.75rem;
          color: #D4AF37;
          font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 1rem;
        }

        .step-icon {
          width: 52px;
          height: 52px;
          border-radius: 4px;
          background-color: #10243D;
          border: 1px solid rgba(212, 175, 55, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .step-title {
          font-size: 1.15rem;
          color: #F8FAFC;
          margin-bottom: 0.75rem;
        }

        .step-desc {
          font-size: 0.84375rem;
          color: #94A3B8;
          line-height: 1.6;
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .step-tags {
          font-size: 0.6875rem;
          color: #64748B;
          border-top: 1px solid #1E3553;
          padding-top: 0.75rem;
        }

        .workflow-connector {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D4AF37;
        }

        /* Features Grid */
        .features-section {
          padding: 4.5rem 0;
          border-bottom: 1px solid #CFDFEC;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        /* CTA Section */
        .cta-section {
          padding: 4rem 0 5rem;
        }

        .cta-box {
          background-color: #0D1C30;
          border: 1px solid #1E3553;
          border-radius: 6px;
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .cta-content {
          max-width: 600px;
        }

        .cta-title {
          font-size: 1.75rem;
          color: #F8FAFC;
          margin: 0.75rem 0;
        }

        .cta-text {
          color: #94A3B8;
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        @media (max-width: 992px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .workflow-grid {
            flex-direction: column;
          }
          .workflow-connector {
            transform: rotate(90deg);
            padding: 0.5rem 0;
          }
          .hero-title {
            font-size: 2.25rem;
          }
        }

        @media (max-width: 640px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
          .cta-box {
            padding: 2rem 1.5rem;
          }
          .metric-divider {
            display: none;
          }
          .hero-title {
            font-size: 1.875rem;
          }
          .hero-section {
            padding: 3rem 0 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}
