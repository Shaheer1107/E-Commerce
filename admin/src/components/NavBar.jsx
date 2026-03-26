import React from 'react'
import { assets } from '../assets/assets'

const NavBar = ({ setToken }) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        .admin-nav {
          position: sticky; top: 0; z-index: 50;
          background: #1a1612;
          border-bottom: 1px solid rgba(196,160,100,0.2);
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; height: 60px;
        }

        /* Logo */
        .admin-nav-logo img { width: clamp(80px, 10%, 120px); display: block; filter: brightness(0) invert(1); }
        .admin-nav-logo-text {
          font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300;
          color: #f5f0e8; letter-spacing: 0.12em;
        }
        .admin-nav-logo-text em { font-style: italic; color: #c4a064; }

        /* Center badge */
        .admin-nav-badge {
          display: flex; align-items: center; gap: 8px;
        }
        .admin-nav-badge-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #c4a064;
          animation: adminPulse 2.5s ease-in-out infinite;
        }
        @keyframes adminPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
        .admin-nav-badge-text {
          font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 600;
          letter-spacing: 0.3em; text-transform: uppercase; color: #c4a064;
        }

        /* Logout */
        .admin-nav-logout {
          display: flex; align-items: center; gap: 8px;
          background: transparent;
          border: 1px solid rgba(196,160,100,0.35);
          padding: 8px 18px; cursor: pointer;
          font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 600;
          letter-spacing: 0.22em; text-transform: uppercase; color: #c4a064;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .admin-nav-logout:hover {
          background: #c4a064; color: #1a1612; border-color: #c4a064;
        }
        .admin-nav-logout svg { transition: transform 0.2s; }
        .admin-nav-logout:hover svg { transform: translateX(2px); }

        @media (max-width: 560px) {
          .admin-nav { padding: 0 16px; }
          .admin-nav-badge { display: none; }
          .admin-nav-logout span { display: none; }
          .admin-nav-logout { padding: 8px 12px; }
        }
      `}</style>

      <nav className="admin-nav">

        {/* Logo */}
        <div className="admin-nav-logo">
          {assets.logo
            ? <img src={assets.logo} alt="Logo" />
            : <span className="admin-nav-logo-text">Textiles<em>.</em></span>
          }
        </div>

        {/* Center — Admin badge */}
        <div className="admin-nav-badge">
          <div className="admin-nav-badge-dot" />
          <span className="admin-nav-badge-text">Admin Panel</span>
          <div className="admin-nav-badge-dot" />
        </div>

        {/* Logout */}
        <button className="admin-nav-logout" onClick={() => setToken('')}>
          <span>Logout</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M5 2H2a1 1 0 00-1 1v6a1 1 0 001 1h3M8 9l3-3-3-3M11 6H4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

      </nav>
    </>
  )
}

export default NavBar