import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentExpert, logout, isDemoMode, setDemoMode } from '../services/authService.js';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoActive, setDemoActive] = useState(() => isDemoMode());
  const [theme, setTheme] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('saksham_theme') : null;
    return saved === 'dark' ? 'dark' : 'light';
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Read auth state directly
  const isAuth = isAuthenticated();
  const expert = isAuth ? getCurrentExpert() : null;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/expert/login');
  };

  const handleToggleDemoMode = () => {
    const nextState = !demoActive;
    setDemoMode(nextState);
    setDemoActive(nextState);
    // Reload page to re-initialize services with new mode
    window.location.reload();
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('saksham_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const isLanding = location.pathname === '/';

  return (
    <header className="navbar-wrapper">
      {/* Saffron - White - Green Indian Tricolour Stripe */}
      <div className="tricolour-bar" />

      {/* Demo / Preview Mode Notification Strip */}
      {demoActive && (
        <div className="demo-mode-banner">
          <div className="demo-banner-content font-mono">
            <div className="demo-banner-badge">
              <span className="demo-pulse-dot"></span>
              <span>DEMO | PREVIEW MODE ACTIVE</span>
            </div>
            <span className="demo-banner-text">
              Backend integration pending. Running on isolated simulation datasets.
            </span>
            <div className="demo-banner-actions">
              <button
                type="button"
                onClick={handleToggleDemoMode}
                className="demo-toggle-btn"
                title="Switch to live API requests (http://localhost:5000/api)"
              >
                Switch to Live API Mode
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="navbar-container">
        <div className="navbar-content">
          {/* Brand Logo & Name */}
          <Link to="/" className="navbar-brand">
            <div className="brand-crest">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-title">SAKSHAM</span>
              <span className="brand-tagline">DEFENCE INTERVIEW INTELLIGENCE</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="navbar-links-desktop">
            {/* Light / Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={handleToggleTheme}
              className="theme-toggle-btn"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                /* Simple Outline Sun */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                /* Simple Outline Moon */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            {/* Demo Mode Quick Badge in Navbar */}
            <button
              type="button"
              onClick={handleToggleDemoMode}
              className={`demo-status-pill font-mono ${demoActive ? 'demo-pill-on' : 'demo-pill-off'}`}
              title="Click to toggle between Demo Mode and Live API Mode"
            >
              {demoActive ? '⚡ DEMO MODE: ON' : '🌐 LIVE API: ON'}
            </button>
            {isAuth ? (
              // Authenticated Expert Navigation
              <>
                <NavLink
                  to="/expert/dashboard"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                  }
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  Dashboard
                </NavLink>

                <NavLink
                  to="/expert/setup"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'nav-link-active' : ''}`
                  }
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Create Interview
                </NavLink>

                <div className="expert-status-badge">
                  <span className="status-indicator"></span>
                  <div className="expert-meta">
                    <span className="expert-name">{expert?.name || 'Assessment Expert'}</span>
                    <span className="expert-role">{expert?.designation || 'Scientific Evaluator'}</span>
                  </div>
                </div>

                <button onClick={handleLogout} className="navbar-logout-btn" title="Log out of Saksham">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              // Public / Unauthenticated Navigation
              <>
                <Link to="/" className="nav-link">
                  Home
                </Link>
                {isLanding && (
                  <>
                    <a href="#how-it-works" className="nav-link">
                      How It Works
                    </a>
                    <a href="#features" className="nav-link">
                      Capabilities
                    </a>
                  </>
                )}
                <Link to="/candidate/join" className="nav-link">
                  Candidate Join
                </Link>
                <Link to="/expert/login" className="btn btn-gold btn-sm">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Expert Portal
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions (Theme Toggle & Menu Toggle) */}
          <div className="mobile-actions">
            <button
              type="button"
              onClick={handleToggleTheme}
              className="theme-toggle-btn"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                /* Simple Outline Sun */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                /* Simple Outline Moon */
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            <button
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="navbar-mobile-menu">
            <button
              type="button"
              onClick={() => {
                handleToggleTheme();
                setMobileMenuOpen(false);
              }}
              className="mobile-link mobile-theme-toggle-row"
            >
              <span>{theme === 'dark' ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}</span>
            </button>
            {isAuth ? (
              <>
                <div className="mobile-expert-info">
                  <span className="expert-name">{expert?.name || 'Assessment Expert'}</span>
                  <span className="expert-role">{expert?.designation || 'Scientific Evaluator'}</span>
                </div>
                <Link to="/expert/dashboard" className="mobile-link">
                  Dashboard
                </Link>
                <Link to="/expert/setup" className="mobile-link">
                  Create Interview
                </Link>
                <button onClick={handleLogout} className="mobile-link mobile-logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="mobile-link">
                  Home
                </Link>
                <Link to="/candidate/join" className="mobile-link">
                  Join as Candidate
                </Link>
                <Link to="/expert/login" className="mobile-link mobile-highlight-link">
                  Expert Login
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          z-index: 1000;
          background-color: #081525;
          border-bottom: 1px solid #1E3553;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .demo-mode-banner {
          background: linear-gradient(90deg, #1C1917 0%, #292524 100%);
          border-bottom: 1px solid #D4AF37;
          padding: 0.35rem 1.5rem;
          color: #F8FAFC;
        }

        .demo-banner-content {
          max-width: 1240px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          font-size: 0.75rem;
        }

        .demo-banner-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(212, 175, 55, 0.2);
          color: #F0C75E;
          border: 1px solid rgba(212, 175, 55, 0.4);
          padding: 0.15rem 0.5rem;
          border-radius: 3px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .demo-pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #F0C75E;
          box-shadow: 0 0 6px #F0C75E;
        }

        .demo-banner-text {
          color: #D6D3D1;
          flex: 1;
        }

        .demo-toggle-btn {
          background: #081525;
          color: #D4AF37;
          border: 1px solid #D4AF37;
          font-size: 0.7rem;
          font-family: var(--font-mono);
          padding: 0.2rem 0.6rem;
          border-radius: 3px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.15s ease;
        }

        .demo-toggle-btn:hover {
          background: #D4AF37;
          color: #081525;
        }

        .demo-status-pill {
          padding: 0.3rem 0.65rem;
          font-size: 0.7rem;
          font-weight: 700;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
        }

        .demo-pill-on {
          background: rgba(212, 175, 55, 0.15);
          color: #F0C75E;
          border: 1px solid rgba(212, 175, 55, 0.4);
        }

        .demo-pill-on:hover {
          background: rgba(212, 175, 55, 0.25);
        }

        .demo-pill-off {
          background: rgba(34, 197, 94, 0.15);
          color: #86EFAC;
          border: 1px solid rgba(34, 197, 94, 0.4);
        }

        .navbar-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }

        .brand-crest {
          width: 38px;
          height: 38px;
          background-color: #10243D;
          border: 1px solid #D4AF37;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.15);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-family: var(--font-sans);
          font-size: 1.1875rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #F8FAFC;
          line-height: 1.1;
        }

        .brand-tagline {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #D4AF37;
          text-transform: uppercase;
        }

        .navbar-links-desktop {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: #94A3B8;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: color 0.15s ease;
          padding: 0.35rem 0.5rem;
          border-radius: 3px;
        }

        .nav-link:hover {
          color: #F8FAFC;
        }

        .nav-link-active {
          color: #D4AF37 !important;
          background-color: rgba(212, 175, 55, 0.08);
          font-weight: 600;
        }

        .expert-status-badge {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.3rem 0.75rem;
          background-color: #10243D;
          border: 1px solid #1E3553;
          border-radius: 4px;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #22C55E;
          box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
        }

        .expert-meta {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .expert-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #F8FAFC;
        }

        .expert-role {
          font-size: 0.6875rem;
          color: #D4AF37;
          font-family: var(--font-mono);
        }

        .navbar-logout-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #F8FAFC;
          background-color: transparent;
          border: 1px solid rgba(217, 225, 234, 0.4);
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.15s ease;
          line-height: 1.25;
        }

        .navbar-logout-btn:hover {
          background-color: rgba(239, 68, 68, 0.15);
          color: #FCA5A5;
          border-color: #EF4444;
        }

        .theme-toggle-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 4px;
          background-color: transparent;
          color: #D4AF37;
          border: 1px solid rgba(212, 175, 55, 0.4);
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .theme-toggle-btn:hover {
          background-color: rgba(212, 175, 55, 0.15);
          border-color: #D4AF37;
          color: #F0C75E;
        }

        .mobile-actions {
          display: none;
          align-items: center;
          gap: 0.6rem;
        }

        .mobile-theme-toggle-row {
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          color: #D4AF37;
          font-weight: 600;
        }

        .mobile-toggle-btn {
          display: none;
          background: none;
          border: 1px solid #1E3553;
          border-radius: 4px;
          color: #F8FAFC;
          padding: 0.4rem;
          cursor: pointer;
        }

        .navbar-mobile-menu {
          display: none;
          flex-direction: column;
          padding: 1rem 0 1.25rem;
          border-top: 1px solid #1E3553;
          background-color: #081525;
        }

        .mobile-link {
          padding: 0.75rem 0.5rem;
          color: #94A3B8;
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 500;
          border-bottom: 1px solid rgba(30, 53, 83, 0.4);
        }

        .mobile-link:hover {
          color: #F8FAFC;
        }

        .mobile-highlight-link {
          color: #D4AF37;
          font-weight: 600;
        }

        .mobile-expert-info {
          padding: 0.5rem 0;
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid #1E3553;
          margin-bottom: 0.5rem;
        }

        .mobile-logout-btn {
          background: none;
          border: none;
          text-align: left;
          color: #EF4444;
          cursor: pointer;
        }

        @media (max-width: 868px) {
          .navbar-links-desktop {
            display: none;
          }
          .mobile-actions {
            display: flex;
          }
          .mobile-toggle-btn {
            display: block;
          }
          .navbar-mobile-menu {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
}
