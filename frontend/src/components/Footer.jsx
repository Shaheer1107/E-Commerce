import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        .footer-root {
          position: relative;
          background: #faf8f5;
          overflow: hidden;
        }

        .footer-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        .footer-glow {
          position: absolute;
          width: 600px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(196,160,100,0.07) 0%, transparent 70%);
          top: 0; left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          z-index: 0;
        }

        .footer-top-rule {
          position: absolute;
          top: 0; left: 8%; right: 8%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(196,160,100,0.35) 30%, rgba(196,160,100,0.35) 70%, transparent);
          z-index: 2;
        }

        .footer-body {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 64px;
          padding: 80px 64px 72px;
        }
        @media (max-width: 860px) {
          .footer-body {
            grid-template-columns: 1fr 1fr;
            gap: 48px;
            padding: 64px 32px 56px;
          }
        }
        @media (max-width: 520px) {
          .footer-body {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 56px 24px 48px;
          }
        }

        .footer-brand {}

        .footer-logo {
          width: 110px;
          margin-bottom: 28px;
          filter: none;
          opacity: 1;
        }

        .footer-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: 15px;
          color: #6b6259;
          margin: 0 0 20px;
          line-height: 1.5;
        }

        .footer-desc {
          font-family: 'Montserrat', sans-serif;
          font-size: 10.5px;
          font-weight: 300;
          letter-spacing: 0.04em;
          line-height: 1.9;
          color: #5a5049;
          max-width: 280px;
          margin: 0 0 32px;
        }

        .footer-socials {
          display: flex;
          gap: 12px;
        }
        .footer-social-btn {
          width: 34px;
          height: 34px;
          border: 1px solid rgba(196,160,100,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.3s ease, background 0.3s ease;
          text-decoration: none;
        }
        .footer-social-btn:hover {
          border-color: rgba(196,160,100,0.6);
          background: rgba(196,160,100,0.08);
        }
        .footer-social-btn svg {
          transition: opacity 0.3s ease;
          opacity: 0.5;
        }
        .footer-social-btn:hover svg { opacity: 1; }

        .footer-col {}

        .footer-col-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 8.5px;
          font-weight: 600;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #c4a064;
          margin: 0 0 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .footer-col-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(196,160,100,0.2);
        }

        .footer-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-link {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.06em;
          color: #5a5049;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0;
          position: relative;
          transition: color 0.25s ease;
          width: fit-content;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #c4a064;
          transition: width 0.3s ease;
        }
        .footer-link:hover { color: #c4a064; }
        .footer-link:hover::after { width: 100%; }

        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.05em;
          color: #5a5049;
          transition: color 0.25s ease;
          cursor: default;
        }
        .footer-contact-item:hover { color: #c4a064; }
        .footer-contact-icon {
          width: 28px;
          height: 28px;
          border: 1px solid rgba(196,160,100,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.3s ease;
        }
        .footer-contact-item:hover .footer-contact-icon {
          border-color: rgba(196,160,100,0.45);
        }
        .footer-contact-icon svg { opacity: 0.5; }
        .footer-contact-item:hover .footer-contact-icon svg { opacity: 0.85; }

        .footer-bottom {
          position: relative;
          z-index: 2;
          border-top: 1px solid rgba(196,160,100,0.15);
          margin: 0 64px;
          padding: 24px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        @media (max-width: 860px) { .footer-bottom { margin: 0 32px; } }
        @media (max-width: 520px) {
          .footer-bottom {
            margin: 0 24px;
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }
        }

        .footer-copy {
          font-family: 'Montserrat', sans-serif;
          font-size: 9.5px;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: #3d352c;
        }
        .footer-copy span { color: #1c1c1a; font-weight: 400; }

        .footer-legal {
          display: flex;
          gap: 24px;
        }
        .footer-legal a {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: #3d352c;
          text-decoration: none;
          transition: color 0.25s ease;
        }
        .footer-legal a:hover { color: #c4a064; }
      `}</style>

      <footer className="footer-root">
        <div className="footer-top-rule" />
        <div className="footer-glow" />

        <div className="footer-body">

          {/* Brand */}
          <div className="footer-brand">
            <img src={assets.logo} className="footer-logo" alt="Brand logo" />
            <p className="footer-tagline">Refined style for the modern wardrobe.</p>
            <p className="footer-desc">
              Thoughtfully crafted pieces built to last. We believe in quality over quantity — clothing that grows with you.
            </p>
            <div className="footer-socials">
              <a href="#" className="footer-social-btn" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c4a064" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.8" fill="#c4a064" stroke="none"/>
                </svg>
              </a>
              <a href="#" className="footer-social-btn" aria-label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c4a064" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="footer-social-btn" aria-label="Pinterest">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c4a064" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.76 1.22-5.17 1.22-5.17s-.31-.62-.31-1.54c0-1.45.84-2.53 1.88-2.53.89 0 1.32.67 1.32 1.47 0 .89-.57 2.24-.86 3.48-.25 1.04.51 1.88 1.53 1.88 1.83 0 3.24-1.93 3.24-4.72 0-2.47-1.77-4.19-4.31-4.19-2.94 0-4.66 2.2-4.66 4.48 0 .89.34 1.84.77 2.36.08.1.09.19.07.29-.08.32-.25 1.04-.28 1.18-.04.19-.14.23-.32.14-1.25-.58-2.03-2.42-2.03-3.89 0-3.15 2.29-6.05 6.61-6.05 3.47 0 6.16 2.47 6.16 5.77 0 3.45-2.17 6.22-5.19 6.22-1.01 0-1.97-.53-2.3-1.15l-.62 2.33c-.23.87-.84 1.96-1.25 2.62.94.29 1.94.45 2.97.45 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
                </svg>
              </a>
              <a href="#" className="footer-social-btn" aria-label="TikTok">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#c4a064">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.31 6.31 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="footer-col">
            <p className="footer-col-title">Company</p>
            <ul className="footer-links">
              {['Home', 'About Us', 'Delivery', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <a href="#" className="footer-link">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="footer-col">
            <p className="footer-col-title">Get In Touch</p>
            <ul className="footer-links" style={{ gap: '18px' }}>
              <li>
                <div className="footer-contact-item">
                  <div className="footer-contact-icon">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#c4a064" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-.95a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  +1-212-456-7890
                </div>
              </li>
              <li>
                <div className="footer-contact-item">
                  <div className="footer-contact-icon">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#c4a064" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  info@company.com
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © 2024 <span>Forever.com</span> — All rights reserved.
          </p>
          <div className="footer-legal">
            <a href="#">Terms of Use</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer