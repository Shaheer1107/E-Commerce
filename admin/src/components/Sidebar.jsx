import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const NAV_ITEMS = [
  {
    to: '/add',
    icon: assets.add_icon,
    label: 'Add Items',
    sub: 'Upload new products',
  },
  {
    to: '/list',
    icon: assets.order_icon,
    label: 'List Items',
    sub: 'Manage catalogue',
  },
  {
    to: '/order',
    icon: assets.order_icon,
    label: 'Orders',
    sub: 'View & update orders',
  },
]

const Sidebar = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        .as-root {
          width: 220px; flex-shrink: 0;
          height: calc(100vh - 60px);
          background: #1e1a15;
          border-right: 1px solid rgba(196,160,100,0.15);
          display: flex; flex-direction: column;
          padding: 32px 0 24px;
          position: sticky;
          top: 60px;
          align-self: flex-start;
        }

        /* Subtle top glow */
        .as-root::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 120px;
          background: radial-gradient(ellipse at 50% 0%, rgba(196,160,100,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Section label */
        .as-section-label {
          font-family: 'Montserrat', sans-serif; font-size: 7.5px; font-weight: 600;
          letter-spacing: 0.3em; text-transform: uppercase; color: #7a6e65;
          padding: 0 24px; margin-bottom: 12px;
        }

        /* Nav */
        .as-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 12px; }

        /* Nav link */
        .as-link {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px;
          text-decoration: none;
          border: 1px solid transparent;
          position: relative; overflow: hidden;
          transition: background 0.2s, border-color 0.2s;
          border-radius: 2px;
        }
        .as-link::before {
          content: '';
          position: absolute; left: 0; top: 0; bottom: 0; width: 2px;
          background: #c4a064; transform: scaleY(0);
          transition: transform 0.25s cubic-bezier(0.16,1,0.3,1);
        }
        .as-link:hover {
          background: rgba(196,160,100,0.07);
          border-color: rgba(196,160,100,0.15);
        }
        .as-link:hover::before { transform: scaleY(1); }

        /* Active state */
        .as-link.active {
          background: rgba(196,160,100,0.1);
          border-color: rgba(196,160,100,0.25);
        }
        .as-link.active::before { transform: scaleY(1); }

        /* Icon */
        .as-icon {
          width: 16px; height: 16px; flex-shrink: 0;
          opacity: 0.4; filter: invert(1);
          transition: opacity 0.2s;
        }
        .as-link:hover .as-icon,
        .as-link.active .as-icon { opacity: 0.9; }

        /* Text block */
        .as-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .as-label {
          font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #c9bfb4; white-space: nowrap;
          transition: color 0.2s;
        }
        .as-link:hover .as-label,
        .as-link.active .as-label { color: #c4a064; }

        .as-sub {
          font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 400;
          letter-spacing: 0.06em; color: #7a6e65; white-space: nowrap;
          transition: color 0.2s;
        }
        .as-link:hover .as-sub,
        .as-link.active .as-sub { color: #6b5f50; }

        /* Divider */
        .as-divider {
          height: 1px; margin: 20px 24px;
          background: linear-gradient(to right, rgba(196,160,100,0.15), transparent);
        }

        /* Footer */
        .as-footer {
          margin-top: auto; padding: 0 24px;
        }
        .as-footer-text {
          font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase; color: #7a6e65;
          display: flex; align-items: center; gap: 8px;
        }
        .as-footer-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #c4a064;
          animation: asPulse 2.5s ease-in-out infinite; flex-shrink: 0;
        }
        @keyframes asPulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.35; }
        }

        /* Responsive — icon-only on small screens */
        @media (max-width: 640px) {
          .as-root { width: 60px; padding: 24px 0; }
          .as-section-label, .as-text, .as-divider, .as-footer { display: none; }
          .as-nav { padding: 0 6px; }
          .as-link { justify-content: center; padding: 14px 10px; }
          .as-icon { width: 18px; height: 18px; }
        }
      `}</style>

      <aside className="as-root">

        <span className="as-section-label">Navigation</span>

        <nav className="as-nav">
          {NAV_ITEMS.map(({ to, icon, label, sub }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `as-link${isActive ? ' active' : ''}`}
            >
              <img className="as-icon" src={icon} alt={label} />
              <div className="as-text">
                <span className="as-label">{label}</span>
                <span className="as-sub">{sub}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="as-divider" />

        <div className="as-footer">
          <span className="as-footer-text">
            <span className="as-footer-dot" />
            Store Active
          </span>
        </div>

      </aside>
    </>
  )
}

export default Sidebar