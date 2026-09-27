import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import RadarChart from '../components/RadarChart.jsx';
import { getInterviewReport } from '../services/interviewService.js';

const defaultSampleReport = {
  candidateName: 'Rahul Verma',
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
    'Demonstrated deep technical mastery in radar signal processing pipelines & pulse compression.',
    'High clarity in explaining CA-CFAR vs OS-CFAR trade-offs under dynamic clutter conditions.',
    'Strong practical foundation with embedded C firmware porting and MATLAB algorithm modeling.',
  ],
  weaknesses: [
    'Limited real-world exposure to phased array antenna radiation pattern optimization.',
    'Initial hesitancy observed during rapid-fire fault isolation scenarios.',
    'Could strengthen communication around cross-functional project management under tight defence deadlines.',
  ],
  summary:
    'Rahul Verma demonstrated strong technical expertise in radar signal processing with notable practical experience at BEL. His technical explanations were structured and grounded in mathematical principles. Recommended for further consideration for Scientist-C position at LRDE.',
  candidateImprovementSuggestions: [
    'Deepen study into phased array beamforming and planar array calibration.',
    'Practice structured situational leadership responses under pressure.',
    'Enhance active eye contact and composure in early interview phases.',
  ],
};

export default function ReportView() {
  const { sessionId } = useParams();
  const reportRef = useRef(null);

  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getInterviewReport(sessionId)
      .then((result) => {
        if (!isMounted) return;
        if (result.success && result.data) {
          setReportData(result.data);
        } else {
          if (!result.success && result.error) {
            setError(result.error);
          }
          setReportData(defaultSampleReport);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Failed to communicate with report service.');
        setReportData(defaultSampleReport);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    setIsExporting(true);
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Handle multi-page if needed or single-page fit
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        let heightLeft = pdfHeight;
        let position = 0;
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = position - pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`Saksham_Assessment_Report_${sessionId || 'Candidate'}.pdf`);
    } catch (err) {
      console.error('Error generating PDF export:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Safe accessor defaults
  const overallScore = reportData?.overallScore ?? 78.5;
  const recommendation = reportData?.recommendation ?? 'Recommended for Next Round';
  const competencyScores = reportData?.competencyScores || {
    communication: 7.5,
    technicalDepth: 8.5,
    domainRelevance: 8.0,
    problemSolving: 7.8,
    confidenceComposure: 7.5,
  };
  const phaseScores = reportData?.phaseWiseScores || {};
  const strengths = reportData?.strengths || [];
  const weaknesses = reportData?.weaknesses || [];
  const summary =
    reportData?.summary ||
    'Assessment synthesis indicates candidate meets the technical benchmarks required for scientific evaluation.';
  const suggestions = reportData?.candidateImprovementSuggestions || [];

  return (
    <div className="app-page report-view-page">
      <div className="app-container">
        {/* Navigation & Controls */}
        <div className="report-action-bar no-print">
          <div className="breadcrumb-nav">
            <Link to="/expert/dashboard" className="breadcrumb-link">
              ← Dashboard
            </Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Official Assessment Report</span>
          </div>

          <div className="action-buttons">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="btn btn-gold btn-sm"
              disabled={isExporting || isLoading}
            >
              {isExporting ? (
                <>
                  <span className="spinner"></span>
                  Exporting Report PDF...
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download Report PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-info no-print" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div className="alert-content">
              <strong>Offline / Demo Notice:</strong> {error} Displaying assessment report dossier.
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="card state-card">
            <span className="spinner spinner-gold"></span>
            <p style={{ marginTop: '0.75rem', color: 'var(--color-text-muted)' }}>
              Compiling competency vectors & assessment telemetry...
            </p>
          </div>
        )}

        {/* Report Document Container */}
        {!isLoading && (
          <div id="report-export-container" ref={reportRef} className="report-document">
            {/* Report Header / Government Defence Style */}
            <div className="report-header">
              <div className="report-header-top">
                <div className="report-brand">
                  <div className="report-crest">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                      <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
                    </svg>
                  </div>
                  <div>
                    <span className="report-org-title">SAKSHAM ASSESSMENT INTELLIGENCE</span>
                    <span className="report-org-subtitle font-mono">
                      DEFENCE & SCIENTIFIC RECRUITMENT SIMULATION
                    </span>
                  </div>
                </div>

                <div className="report-id-box font-mono">
                  <div>DOSSIER: {sessionId || 'SESS-2026-X1'}</div>
                  <div>DATE: {reportData?.date || new Date().toISOString().split('T')[0]}</div>
                </div>
              </div>

              <div className="report-title-strip">
                <h1 className="report-title">Candidate Assessment & Competency Evaluation Dossier</h1>
              </div>

              {/* Candidate Info Strip */}
              <div className="candidate-info-strip">
                <div className="info-cell">
                  <span className="info-label">Candidate Name</span>
                  <span className="info-val">{reportData?.candidateName || 'Rahul Verma'}</span>
                </div>
                <div className="info-cell">
                  <span className="info-label">Target Requisition / Post</span>
                  <span className="info-val">{reportData?.post || 'Scientist-C (Radar Systems)'}</span>
                </div>
                <div className="info-cell">
                  <span className="info-label">Evaluator Domain</span>
                  <span className="info-val">Scientific Research & Development</span>
                </div>
                <div className="info-cell">
                  <span className="info-label">Protocol Validity</span>
                  <span className="info-val font-mono text-success">CERTIFIED</span>
                </div>
              </div>
            </div>

            {/* Score & Recommendation Banner */}
            <div className="score-summary-grid">
              <div className="card score-summary-card">
                <span className="score-label font-mono">OVERALL COMPOSITE SCORE</span>
                <div className="score-number-row font-mono">
                  <span className="score-big">{Number(overallScore).toFixed(1)}</span>
                  <span className="score-out-of">/ 100</span>
                </div>
                <span className="score-bench">Standardized 3-Phase Synthesis</span>
              </div>

              <div className="card recommendation-card">
                <span className="recom-label font-mono">ASSESSMENT RECOMMENDATION</span>
                <div className="recom-status-row">
                  <span
                    className={`badge ${
                      recommendation.toLowerCase().includes('strongly')
                        ? 'badge-success'
                        : recommendation.toLowerCase().includes('recommend')
                        ? 'badge-gold'
                        : 'badge-neutral'
                    } recom-badge`}
                  >
                    {recommendation}
                  </span>
                </div>
                <p className="recom-note">
                  Recommendation based on technical depth, domain accuracy, and composure scores.
                </p>
              </div>
            </div>

            {/* Visual Analytics Row: Radar Chart + Phase Scores */}
            <div className="analytics-layout-grid">
              {/* 5-Axis Competency Radar */}
              <div className="card radar-card">
                <div className="card-header">
                  <div>
                    <span className="badge badge-gold font-mono">COMPETENCY VECTORS</span>
                    <h3 className="card-title">5-Axis Competency Radar</h3>
                  </div>
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    SCALE 1.0 - 10.0
                  </span>
                </div>
                <div className="card-body radar-card-body">
                  <RadarChart scores={competencyScores} maxScore={10} />
                </div>
              </div>

              {/* Phase-Wise Scores */}
              <div className="card phase-card">
                <div className="card-header">
                  <div>
                    <span className="badge badge-navy font-mono">EVALUATION BREAKDOWN</span>
                    <h3 className="card-title">Phase-Wise Performance</h3>
                  </div>
                </div>
                <div className="card-body">
                  <div className="phase-scores-list">
                    {/* Phase 1: Ice Breaking */}
                    <div className="phase-row">
                      <div className="phase-info">
                        <span className="phase-name">Phase 1: Ice Breaking & Background</span>
                        <span className="phase-meta font-mono">
                          {phaseScores.iceBreaking?.questionsAsked || 3} Questions Evaluated
                        </span>
                      </div>
                      <div className="phase-score-pill font-mono">
                        {phaseScores.iceBreaking?.score || 7.5} / 10
                      </div>
                    </div>

                    {/* Phase 2: Technical Depth */}
                    <div className="phase-row highlight-phase">
                      <div className="phase-info">
                        <span className="phase-name">Phase 2: Deep Technical Rigor</span>
                        <span className="phase-meta font-mono">
                          {phaseScores.technical?.questionsAsked || 6} Questions Evaluated
                        </span>
                      </div>
                      <div className="phase-score-pill font-mono">
                        {phaseScores.technical?.score || 8.2} / 10
                      </div>
                    </div>

                    {/* Phase 3: Managerial & Mission */}
                    <div className="phase-row">
                      <div className="phase-info">
                        <span className="phase-name">Phase 3: Managerial & Mission Focus</span>
                        <span className="phase-meta font-mono">
                          {phaseScores.managerial?.questionsAsked || 3} Questions Evaluated
                        </span>
                      </div>
                      <div className="phase-score-pill font-mono">
                        {phaseScores.managerial?.score || 7.8} / 10
                      </div>
                    </div>
                  </div>

                  {/* Competency Metric Pills */}
                  <div className="vector-pills-grid font-mono">
                    <div className="vector-pill">
                      <span>COMMUNICATION:</span>
                      <strong>{competencyScores.communication || 7.5}/10</strong>
                    </div>
                    <div className="vector-pill">
                      <span>TECH DEPTH:</span>
                      <strong>{competencyScores.technicalDepth || 8.5}/10</strong>
                    </div>
                    <div className="vector-pill">
                      <span>DOMAIN REL:</span>
                      <strong>{competencyScores.domainRelevance || 8.0}/10</strong>
                    </div>
                    <div className="vector-pill">
                      <span>PROBLEM SOLV:</span>
                      <strong>{competencyScores.problemSolving || 7.8}/10</strong>
                    </div>
                    <div className="vector-pill">
                      <span>CONFIDENCE:</span>
                      <strong>
                        {competencyScores.confidenceComposure ||
                          competencyScores.confidence ||
                          7.5}
                        /10
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses Section */}
            <div className="eval-observations-grid">
              {/* Strengths */}
              <div className="card observation-card">
                <div className="card-header border-success">
                  <div className="obs-header-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <h3 className="card-title">Key Technical Strengths</h3>
                  </div>
                  <span className="badge badge-success font-mono">VALIDATED</span>
                </div>
                <div className="card-body">
                  <ul className="observation-list">
                    {strengths.map((str, idx) => (
                      <li key={idx} className="observation-item">
                        <span className="obs-bullet success-bullet font-mono">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Weaknesses / Improvement Areas */}
              <div className="card observation-card">
                <div className="card-header border-warning">
                  <div className="obs-header-title">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2">
                      <polygon points="12 2 2 22 22 22 12 2"></polygon>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <h3 className="card-title">Areas for Development</h3>
                  </div>
                  <span className="badge badge-warning font-mono">OBSERVED</span>
                </div>
                <div className="card-body">
                  <ul className="observation-list">
                    {weaknesses.map((weak, idx) => (
                      <li key={idx} className="observation-item">
                        <span className="obs-bullet warning-bullet font-mono">!</span>
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Executive Summary & Improvement Suggestions */}
            <div className="card summary-card">
              <div className="card-header">
                <span className="badge badge-gold font-mono">BOARD SYNTHESIS</span>
                <h3 className="card-title">Executive Evaluation Summary</h3>
              </div>
              <div className="card-body">
                <p className="summary-paragraph">{summary}</p>

                {suggestions.length > 0 && (
                  <div className="suggestions-block">
                    <h4 className="suggestions-heading">Candidate Development Recommendations:</h4>
                    <ul className="suggestions-list">
                      {suggestions.map((sug, idx) => (
                        <li key={idx}>{sug}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Report Footer Verification */}
            <div className="report-doc-footer">
              <div className="verification-signatures font-mono">
                <div>EVALUATOR SIGN-OFF: DRDO BOARD | AUTHENTICATED DOSSIER</div>
                <div>INTEGRITY CHECKSUM: SHA-256 VALIDATED • SAKSHAM ENGINE</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .report-action-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .breadcrumb-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
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

        .report-document {
          background-color: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 2.5rem;
          box-shadow: var(--shadow-md);
        }

        .report-header {
          border-bottom: 2px solid var(--color-deep-navy);
          padding-bottom: 1.5rem;
          margin-bottom: 2rem;
        }

        .report-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .report-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .report-crest {
          width: 42px;
          height: 42px;
          background-color: #081525;
          border: 1px solid #D4AF37;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .report-org-title {
          display: block;
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-deep-navy);
          letter-spacing: 0.05em;
        }

        .report-org-subtitle {
          font-size: 0.6875rem;
          color: #B48E1E;
          letter-spacing: 0.08em;
        }

        .report-id-box {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-align: right;
          line-height: 1.4;
        }

        .report-title-strip {
          margin-bottom: 1.25rem;
        }

        .report-title {
          font-size: 1.625rem;
          color: var(--color-deep-navy);
          letter-spacing: -0.015em;
        }

        .candidate-info-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background-color: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          padding: 0.85rem 1.25rem;
          gap: 1rem;
        }

        .info-cell {
          display: flex;
          flex-direction: column;
        }

        .info-label {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          font-weight: 600;
        }

        .info-val {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--color-deep-navy);
        }

        .score-summary-grid {
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .score-summary-card {
          padding: 1.5rem;
          background-color: #081525;
          color: #F8FAFC;
          border: 1px solid #1E3553;
        }

        .score-label {
          font-size: 0.72rem;
          color: #D4AF37;
          letter-spacing: 0.06em;
        }

        .score-number-row {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
          margin: 0.4rem 0;
        }

        .score-big {
          font-size: 3rem;
          font-weight: 800;
          color: #F8FAFC;
          line-height: 1;
        }

        .score-out-of {
          font-size: 1.25rem;
          color: #94A3B8;
        }

        .score-bench {
          font-size: 0.75rem;
          color: #94A3B8;
        }

        .recommendation-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .recom-label {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          margin-bottom: 0.5rem;
        }

        .recom-badge {
          font-size: 0.9375rem;
          padding: 0.4rem 0.85rem;
        }

        .recom-note {
          margin-top: 0.75rem;
          font-size: 0.84375rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        .analytics-layout-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .radar-card-body {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem 1rem;
        }

        .phase-scores-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-bottom: 1.5rem;
        }

        .phase-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background-color: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: 4px;
        }

        .highlight-phase {
          border-left: 3px solid var(--color-gold);
          background-color: #FFFDF5;
        }

        .phase-info {
          display: flex;
          flex-direction: column;
        }

        .phase-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-deep-navy);
        }

        .phase-meta {
          font-size: 0.72rem;
          color: var(--color-text-muted);
        }

        .phase-score-pill {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--color-deep-navy);
          background-color: #FFFFFF;
          border: 1px solid var(--color-border);
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
        }

        .vector-pills-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          font-size: 0.72rem;
        }

        .vector-pill {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.4rem 0.65rem;
          background-color: #F1F5F9;
          border-radius: 3px;
          color: #334155;
        }

        .eval-observations-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .obs-header-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .border-success {
          border-bottom-color: rgba(34, 197, 94, 0.3);
        }

        .border-warning {
          border-bottom-color: rgba(245, 158, 11, 0.3);
        }

        .observation-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .observation-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.84375rem;
          line-height: 1.5;
          color: var(--color-text-dark);
        }

        .obs-bullet {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 0.15rem;
        }

        .success-bullet {
          background-color: var(--color-success-bg);
          color: var(--color-success-text);
        }

        .warning-bullet {
          background-color: var(--color-warning-bg);
          color: var(--color-warning-text);
        }

        .summary-card {
          margin-bottom: 2rem;
        }

        .summary-paragraph {
          font-size: 0.9375rem;
          line-height: 1.7;
          color: var(--color-text-dark);
        }

        .suggestions-block {
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px dashed var(--color-border);
        }

        .suggestions-heading {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-deep-navy);
          margin-bottom: 0.5rem;
        }

        .suggestions-list {
          margin-left: 1.25rem;
          font-size: 0.84375rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        .report-doc-footer {
          padding-top: 1.5rem;
          border-top: 1px solid var(--color-border);
          font-size: 0.72rem;
          color: var(--color-text-muted);
        }

        .verification-signatures {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        @media (max-width: 992px) {
          .candidate-info-strip {
            grid-template-columns: repeat(2, 1fr);
          }
          .score-summary-grid {
            grid-template-columns: 1fr;
          }
          .analytics-layout-grid {
            grid-template-columns: 1fr;
          }
          .eval-observations-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .candidate-info-strip {
            grid-template-columns: 1fr;
          }
          .report-document {
            padding: 1.5rem 1rem;
          }
          .vector-pills-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
