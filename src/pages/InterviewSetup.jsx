import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { extractTextFromPDF } from '../utils/pdfExtractor.js';
import { createInterview } from '../services/interviewService.js';
import { getCurrentExpert } from '../services/authService.js';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const currentExpert = getCurrentExpert();

  const [formData, setFormData] = useState({
    candidateName: '',
    jobDescription: '',
    interviewType: 'Technical',
    candidateLevel: 'Mid',
    duration: 45,
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [extractedResumeText, setExtractedResumeText] = useState('');
  const [isExtractingText, setIsExtractingText] = useState(false);
  const [showTextPreview, setShowTextPreview] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrors((prev) => ({ ...prev, resume: 'Only PDF format is accepted.' }));
      setPdfFile(null);
      setExtractedResumeText('');
      return;
    }

    setPdfFile(file);
    setErrors((prev) => ({ ...prev, resume: null }));
    setIsExtractingText(true);
    setApiError(null);

    try {
      const text = await extractTextFromPDF(file);
      setExtractedResumeText(text);
    } catch (err) {
      console.error('PDF text extraction error:', err);
      setErrors((prev) => ({
        ...prev,
        resume: `Failed to extract text: ${err.message || 'Scanned or unreadable PDF'}.`,
      }));
    } finally {
      setIsExtractingText(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.candidateName.trim()) {
      errs.candidateName = 'Candidate name is required.';
    }
    if (!extractedResumeText.trim()) {
      errs.resume = 'A readable resume PDF is required with extractable text.';
    }
    if (!formData.jobDescription.trim()) {
      errs.jobDescription = 'Job description & requirements are required.';
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
      const payload = {
        expertId: currentExpert?.expertId || 'exp_001',
        resumeText: extractedResumeText,
        jobDescription: formData.jobDescription,
        candidateName: formData.candidateName,
        interviewType: formData.interviewType,
        candidateLevel: formData.candidateLevel,
        duration: Number(formData.duration),
      };

      const result = await createInterview(payload);

      if (result.success && result.data?.sessionId) {
        // Redirect to Session Created page
        navigate(`/expert/session/${result.data.sessionId}`);
      } else {
        setApiError(result.error || 'Failed to initialize interview session.');
      }
    } catch (err) {
      setApiError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoData = () => {
    setFormData({
      candidateName: 'Rahul Verma',
      jobDescription:
        'Scientist-C, Radar & Communication Systems, LRDE Bangalore.\nKey Requirements: Signal processing, antenna phased array design, matched filtering, CFAR detection, Doppler processing in MATLAB and embedded C. Minimum 3-5 years relevant experience.',
      interviewType: 'Technical',
      candidateLevel: 'Mid',
      duration: 45,
    });

    const demoResume =
      'Rahul Verma\nB.Tech in Electronics and Communication, IIT Delhi (2021)\nExperience: 5 years at Bharat Electronics Limited (BEL) as Systems Engineer.\nProjects: Radar signal processing chain, CFAR algorithms, real-time Doppler processing in embedded C and MATLAB.\nSkills: MATLAB, Embedded C, Radar Systems, Signal Processing, Phased Arrays.';

    setExtractedResumeText(demoResume);
    setPdfFile({ name: 'Rahul_Verma_Dossier.pdf', size: 142800 });
    setErrors({});
    setApiError(null);
  };

  return (
    <div className="app-page interview-setup-page">
      <div className="app-container">
        {/* Navigation Breadcrumb */}
        <div className="breadcrumb-nav">
          <Link to="/expert/dashboard" className="breadcrumb-link">
            ← Return to Dashboard
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Session Initialization</span>
        </div>

        {/* Page Title */}
        <div className="page-header">
          <span className="badge badge-gold font-mono">STEP 01 | SESSION CONFIGURATION</span>
          <h1 className="page-title">Configure Interview Simulation</h1>
          <p className="page-description">
            Upload candidate resume PDF and specify role criteria to generate tailored evaluation questions.
          </p>
        </div>

        {/* Form Container */}
        <div className="setup-layout">
          <div className="setup-main-col">
            <div className="card tactical-corner">
              <div className="card-header">
                <h2 className="card-title">Candidate Requisition Parameters</h2>
                <button
                  type="button"
                  onClick={handleFillDemoData}
                  className="btn btn-outline-navy btn-sm"
                >
                  Pre-fill Demo Data
                </button>
              </div>

              <div className="card-body">
                {apiError && (
                  <div className="alert alert-error" role="alert">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <div className="alert-content">
                      <strong>Submission Error:</strong> {apiError}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  {/* Candidate Name */}
                  <div className="form-group">
                    <label htmlFor="candidateName" className="form-label form-label-required">
                      Candidate Full Name
                    </label>
                    <input
                      type="text"
                      id="candidateName"
                      name="candidateName"
                      value={formData.candidateName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Verma"
                      className={`form-input ${errors.candidateName ? 'error' : ''}`}
                      disabled={isSubmitting}
                    />
                    {errors.candidateName && (
                      <div className="form-error">{errors.candidateName}</div>
                    )}
                  </div>

                  {/* Resume PDF Upload */}
                  <div className="form-group">
                    <label htmlFor="resumeFile" className="form-label form-label-required">
                      Candidate Resume (PDF Only)
                    </label>
                    <div className="upload-dropzone">
                      <input
                        type="file"
                        id="resumeFile"
                        accept="application/pdf,.pdf"
                        onChange={handleFileChange}
                        className="file-input-hidden"
                        disabled={isSubmitting}
                      />
                      <label htmlFor="resumeFile" className="file-input-label">
                        <div className="upload-icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="12" y1="18" x2="12" y2="12"></line>
                            <line x1="9" y1="15" x2="15" y2="15"></line>
                          </svg>
                        </div>
                        <div className="upload-text">
                          <span className="upload-title">
                            {pdfFile ? pdfFile.name : 'Choose Candidate Resume PDF'}
                          </span>
                          <span className="upload-hint">
                            {pdfFile
                              ? `Size: ${(pdfFile.size / 1024).toFixed(1)} KB • Text parsed client-side`
                              : 'Select or drag-and-drop PDF file for text extraction'}
                          </span>
                        </div>
                        <span className="btn btn-outline-navy btn-sm">Browse PDF</span>
                      </label>
                    </div>

                    {/* Extraction Status */}
                    {isExtractingText && (
                      <div className="extraction-status extracting">
                        <span className="spinner spinner-gold"></span>
                        <span>Extracting text layers via pdfjs-dist...</span>
                      </div>
                    )}

                    {!isExtractingText && extractedResumeText && (
                      <div className="extraction-status success">
                        <div className="status-meta">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>
                            Extracted {extractedResumeText.split(/\s+/).length} words ready for question synthesis.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowTextPreview(!showTextPreview)}
                          className="preview-toggle-btn font-mono"
                        >
                          {showTextPreview ? 'Hide Text' : 'Inspect Text'}
                        </button>
                      </div>
                    )}

                    {showTextPreview && extractedResumeText && (
                      <div className="resume-text-preview font-mono">
                        {extractedResumeText}
                      </div>
                    )}

                    {errors.resume && <div className="form-error">{errors.resume}</div>}
                  </div>

                  {/* Job Description */}
                  <div className="form-group">
                    <label htmlFor="jobDescription" className="form-label form-label-required">
                      Job Description & Technical Requirements
                    </label>
                    <textarea
                      id="jobDescription"
                      name="jobDescription"
                      rows={5}
                      value={formData.jobDescription}
                      onChange={handleInputChange}
                      placeholder="Paste vacancy details, required qualifications, system architecture, research competencies..."
                      className={`form-textarea ${errors.jobDescription ? 'error' : ''}`}
                      disabled={isSubmitting}
                    />
                    <div className="form-hint">
                      Used to calibrate question difficulty and domain focus.
                    </div>
                    {errors.jobDescription && (
                      <div className="form-error">{errors.jobDescription}</div>
                    )}
                  </div>

                  {/* Setup Parameters Row */}
                  <div className="form-grid-3">
                    {/* Interview Type */}
                    <div className="form-group">
                      <label htmlFor="interviewType" className="form-label">
                        Interview Assessment Type
                      </label>
                      <select
                        id="interviewType"
                        name="interviewType"
                        value={formData.interviewType}
                        onChange={handleInputChange}
                        className="form-select"
                        disabled={isSubmitting}
                      >
                        <option value="Technical">Technical Only</option>
                        <option value="Managerial">Managerial / Mission</option>
                        <option value="Both">Both (Comprehensive)</option>
                      </select>
                    </div>

                    {/* Candidate Level */}
                    <div className="form-group">
                      <label htmlFor="candidateLevel" className="form-label">
                        Candidate Assessment Level
                      </label>
                      <select
                        id="candidateLevel"
                        name="candidateLevel"
                        value={formData.candidateLevel}
                        onChange={handleInputChange}
                        className="form-select"
                        disabled={isSubmitting}
                      >
                        <option value="Entry">Entry (Scientist-B)</option>
                        <option value="Mid">Mid (Scientist-C/D)</option>
                        <option value="Senior">Senior (Scientist-E/F)</option>
                        <option value="Promotion">Internal Promotion</option>
                      </select>
                    </div>

                    {/* Duration */}
                    <div className="form-group">
                      <label htmlFor="duration" className="form-label">
                        Target Duration
                      </label>
                      <select
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="form-select"
                        disabled={isSubmitting}
                      >
                        <option value={30}>30 Minutes</option>
                        <option value={45}>45 Minutes</option>
                        <option value={60}>60 Minutes</option>
                      </select>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="form-submit-row">
                    <button
                      type="submit"
                      className="btn btn-gold btn-lg"
                      disabled={isSubmitting || isExtractingText}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner"></span>
                          Generating Questions & Initializing Session...
                        </>
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                          Generate Questions & Create Session
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar / Instructions */}
          <div className="setup-sidebar">
            <div className="card protocol-card">
              <div className="card-header">
                <span className="badge badge-navy font-mono">PROTOCOL STANDARDS</span>
                <h3 className="card-title">Security & Ingestion Rules</h3>
              </div>
              <div className="card-body">
                <ul className="protocol-list">
                  <li>
                    <strong>Client-Side Extraction:</strong> PDF text is extracted locally in your browser. Raw files are not transmitted or stored on the server.
                  </li>
                  <li>
                    <strong>Relevance Alignment:</strong> Job requirements provide the benchmark for question relevance scoring (1.0 - 10.0 scale).
                  </li>
                  <li>
                    <strong>Multi-Phase Generation:</strong> Automatically structures questions into Ice Breaking, Technical Depth, and Managerial categories.
                  </li>
                </ul>
              </div>
            </div>
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

        .page-header {
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 1.875rem;
          color: var(--color-deep-navy);
          margin: 0.5rem 0 0.25rem;
        }

        .page-description {
          font-size: 0.9375rem;
          color: var(--color-text-muted);
          max-width: 720px;
        }

        .setup-layout {
          display: grid;
          grid-template-columns: 2.2fr 1fr;
          gap: 2rem;
        }

        .upload-dropzone {
          border: 2px dashed var(--color-border);
          border-radius: 6px;
          background-color: #F8FAFC;
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }

        .upload-dropzone:hover {
          border-color: var(--color-gold);
          background-color: #FFFFFF;
        }

        .file-input-hidden {
          display: none;
        }

        .file-input-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem;
          cursor: pointer;
          gap: 1rem;
        }

        .upload-icon {
          width: 44px;
          height: 44px;
          background-color: #081525;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .upload-text {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .upload-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--color-deep-navy);
        }

        .upload-hint {
          font-size: 0.78125rem;
          color: var(--color-text-muted);
        }

        .extraction-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.75rem;
          padding: 0.6rem 0.85rem;
          border-radius: 4px;
          font-size: 0.8125rem;
        }

        .extraction-status.extracting {
          background-color: #FEF3C7;
          color: #92400E;
          gap: 0.6rem;
        }

        .extraction-status.success {
          background-color: #DCFCE7;
          color: #166534;
        }

        .status-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .preview-toggle-btn {
          background: none;
          border: none;
          color: #166534;
          font-size: 0.75rem;
          text-decoration: underline;
          cursor: pointer;
        }

        .resume-text-preview {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background-color: #F1F5F9;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          font-size: 0.75rem;
          max-height: 140px;
          overflow-y: auto;
          white-space: pre-wrap;
          color: #334155;
        }

        .form-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }

        .form-submit-row {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--color-border);
        }

        .protocol-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-size: 0.8125rem;
          color: var(--color-text-dark);
          line-height: 1.5;
        }

        .protocol-list strong {
          color: var(--color-deep-navy);
          display: block;
          margin-bottom: 0.2rem;
        }

        @media (max-width: 992px) {
          .setup-layout {
            grid-template-columns: 1fr;
          }
          .form-grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
