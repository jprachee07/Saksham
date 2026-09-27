export default function FeatureCard({ icon, title, description, badge, number }) {
  return (
    <div className="feature-card">
      <div className="feature-card-header">
        <div className="feature-icon-wrapper">
          {icon}
        </div>
        {number && <span className="feature-number font-mono">{number}</span>}
        {badge && <span className="badge badge-gold">{badge}</span>}
      </div>

      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>

      <div className="feature-card-footer">
        <span className="feature-status-line"></span>
      </div>

      <style>{`
        .feature-card {
          background-color: #0D1C30;
          border: 1px solid #1E3553;
          border-radius: 6px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .feature-card:hover {
          transform: translateY(-2px);
          border-color: #D4AF37;
          box-shadow: 0 6px 16px rgba(8, 21, 37, 0.4), 0 0 12px rgba(212, 175, 55, 0.12);
        }

        .feature-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .feature-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 4px;
          background-color: #10243D;
          border: 1px solid rgba(212, 175, 55, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D4AF37;
        }

        .feature-number {
          font-size: 0.75rem;
          color: #64748B;
          letter-spacing: 0.05em;
        }

        .feature-title {
          font-size: 1.0625rem;
          font-weight: 600;
          color: #F8FAFC;
          margin-bottom: 0.65rem;
          letter-spacing: -0.01em;
        }

        .feature-description {
          font-size: 0.84375rem;
          line-height: 1.6;
          color: #94A3B8;
          flex: 1;
        }

        .feature-card-footer {
          margin-top: 1.25rem;
          padding-top: 0.75rem;
        }

        .feature-status-line {
          display: block;
          width: 24px;
          height: 2px;
          background-color: #D4AF37;
          transition: width 0.2s ease;
        }

        .feature-card:hover .feature-status-line {
          width: 48px;
        }
      `}</style>
    </div>
  );
}
