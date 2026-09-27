import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { expertLogin, isValidOrgEmail } from '../services/authService.js';

export default function ExpertLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    domain: 'Radar Systems',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const domainOptions = [
    'Radar Systems',
    'Missile Technology',
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Aerospace',
    'Other',
  ];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Organization email is required.';
    } else if (!isValidOrgEmail(formData.email)) {
      errs.email = 'Email must end with @drdo.in, @gov.in, or @rac.gov.in';
    }

    if (!formData.designation.trim()) {
      errs.designation = 'Designation/Rank is required.';
    }

    if (!formData.domain.trim()) {
      errs.domain = 'Specialized domain is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear inline error on edit
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (apiError) {
      setApiError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await expertLogin(formData);

      if (result.success) {
        // Redirect to intended path or expert dashboard
        const destination = location.state?.from?.pathname || '/expert/dashboard';
        navigate(destination, { replace: true });
      } else {
        setApiError(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setApiError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setFormData({
      name: 'Dr. Vikram Sharma',
      email: 'v.sharma@drdo.in',
      designation: 'Scientist-F, Senior Evaluator',
      domain: 'Radar Systems',
    });
    setErrors({});
    setApiError(null);
  };

  return (
    <div className="login-page">
      <div className="login-card-container">
        {/* Tactical Security Header */}
        <div className="login-header-card">
          <div className="brand-crest-small">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
              <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
            </svg>
          </div>
          <div className="header-meta">
            <span className="badge badge-gold font-mono">AUTH PROTOCOL EXP-01</span>
            <h1 className="login-title">Board Member Portal</h1>
            <p className="login-subtitle">
              Authorized evaluation access for defence & scientific interview simulation
            </p>
          </div>
        </div>

        {/* Card Body with Form */}
        <div className="card login-card tactical-corner">
          <div className="card-body">
            {apiError && (
              <div className="alert alert-error" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <div className="alert-content">
                  <strong>Access Denied:</strong> {apiError}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="name" className="form-label form-label-required">
                  Evaluator Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Vikram Sharma"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  disabled={isSubmitting}
                  autoComplete="name"
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              {/* Organization Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label form-label-required">
                  Organization Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. sharma@drdo.in"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  disabled={isSubmitting}
                  autoComplete="email"
                />
                <div className="form-hint">
                  Permitted domains: <code className="font-mono">@drdo.in</code>, <code className="font-mono">@gov.in</code>, or <code className="font-mono">@rac.gov.in</code>
                </div>
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>

              {/* Designation */}
              <div className="form-group">
                <label htmlFor="designation" className="form-label form-label-required">
                  Designation / Grade
                </label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Scientist-F, Director, Technical Officer"
                  className={`form-input ${errors.designation ? 'error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.designation && <div className="form-error">{errors.designation}</div>}
              </div>

              {/* Domain / Expertise */}
              <div className="form-group">
                <label htmlFor="domain" className="form-label form-label-required">
                  Domain / Scientific Discipline
                </label>
                <select
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className={`form-select ${errors.domain ? 'error' : ''}`}
                  disabled={isSubmitting}
                >
                  {domainOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.domain && <div className="form-error">{errors.domain}</div>}
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-gold btn-block"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Authenticating Evaluator...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                      </svg>
                      Authenticate & Enter Dashboard
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Demo Pre-fill for Hackathon Testing */}
            <div className="demo-helper">
              <button
                type="button"
                onClick={handleFillDemo}
                className="btn btn-outline-navy btn-sm"
              >
                Use Sample Official Credentials
              </button>
              <span className="demo-hint font-mono">TEST PROTOCOL DRDO.IN</span>
            </div>
          </div>
        </div>

        {/* Candidate Switch Link */}
        <div className="login-footer-nav">
          <span>Are you an interview candidate?</span>
          <Link to="/candidate/join" className="candidate-join-link">
            Join Interview Session with Code →
          </Link>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: calc(100vh - 67px);
          background-color: var(--color-bg-app);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
        }

        .login-card-container {
          width: 100%;
          max-width: 520px;
        }

        .login-header-card {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .brand-crest-small {
          width: 44px;
          height: 44px;
          background-color: #081525;
          border: 1px solid #D4AF37;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 4px 10px rgba(8, 21, 37, 0.15);
        }

        .login-title {
          font-size: 1.625rem;
          font-weight: 700;
          color: var(--color-deep-navy);
          margin: 0.5rem 0 0.25rem;
        }

        .login-subtitle {
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }

        .login-card {
          background-color: #FFFFFF;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-md);
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

        .login-footer-nav {
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

        .candidate-join-link {
          color: var(--color-deep-navy);
          font-weight: 600;
          text-decoration: underline;
        }

        .candidate-join-link:hover {
          color: var(--color-gold-hover);
        }
      `}</style>
    </div>
  );
}
