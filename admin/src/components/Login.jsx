import React, { useState } from 'react'
import axios from 'axios';
import { backendUrl } from '../App'
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password });
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        .al-root {
          min-height: 100vh;
          background: #1a1612;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          position: relative; overflow: hidden;
        }

        /* Subtle background texture */
        .al-root::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(196,160,100,0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(196,160,100,0.04) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Decorative glyphs */
        .al-glyph {
          position: absolute; font-family: 'Cormorant Garamond', serif;
          color: #c4a064; opacity: 0.06; pointer-events: none; user-select: none;
          font-size: 120px; font-weight: 300;
        }
        .al-glyph--tl { top: -20px; left: 20px; }
        .al-glyph--br { bottom: -20px; right: 20px; }

        /* Card */
        .al-card {
          width: 100%; max-width: 400px;
          background: #221e19;
          border: 1px solid rgba(196,160,100,0.2);
          padding: 48px 44px 44px;
          position: relative;
          animation: alFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        /* Corner marks */
        .al-card::before, .al-card::after {
          content: ''; position: absolute; width: 18px; height: 18px; pointer-events: none;
        }
        .al-card::before { top: 10px; left: 10px; border-top: 1px solid #c4a064; border-left: 1px solid #c4a064; }
        .al-card::after  { bottom: 10px; right: 10px; border-bottom: 1px solid #c4a064; border-right: 1px solid #c4a064; }

        @keyframes alFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .al-header { text-align: center; margin-bottom: 40px; }
        .al-eyebrow {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 500;
          letter-spacing: 0.3em; text-transform: uppercase; color: #c4a064;
          margin-bottom: 10px;
        }
        .al-eyebrow-rule { display: inline-block; width: 22px; height: 1px; background: #c4a064; }
        .al-title {
          font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300;
          color: #f5f0e8; margin: 0; line-height: 1;
        }
        .al-title em { font-style: italic; color: #c4a064; }
        .al-subtitle {
          font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 400;
          color: #6b5f50; letter-spacing: 0.1em; margin-top: 8px;
        }

        /* Form */
        .al-form { display: flex; flex-direction: column; gap: 24px; }

        .al-field { display: flex; flex-direction: column; gap: 8px; position: relative; }
        .al-label {
          font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 600;
          letter-spacing: 0.25em; text-transform: uppercase; color: #8b7355;
        }
        .al-input {
          background: rgba(255,255,255,0.04);
          border: none; border-bottom: 1px solid rgba(196,160,100,0.25);
          padding: 10px 0; outline: none; width: 100%;
          font-family: 'Montserrat', sans-serif; font-size: 12px; font-weight: 500;
          color: #f5f0e8; letter-spacing: 0.04em;
          transition: border-color 0.2s;
        }
        .al-input::placeholder { color: #4a3f35; }
        .al-input:focus { border-bottom-color: transparent; }
        .al-input-line {
          position: absolute; bottom: 0; left: 0; right: 0; height: 1.5px;
          background: #c4a064; transform: scaleX(0); transform-origin: left;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
          pointer-events: none;
        }
        .al-field:focus-within .al-input-line { transform: scaleX(1); }

        /* Button */
        .al-btn {
          width: 100%; border: none; cursor: pointer; padding: 0; margin-top: 8px;
          background: #c4a064; overflow: hidden; position: relative;
          transition: background 0.25s;
        }
        .al-btn:hover:not(:disabled) { background: #d4b07a; }
        .al-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .al-btn-inner {
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 15px 24px;
          font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 600;
          letter-spacing: 0.28em; text-transform: uppercase; color: #1a1612;
          transition: letter-spacing 0.3s;
        }
        .al-btn:hover:not(:disabled) .al-btn-inner { letter-spacing: 0.34em; }
        .al-btn-spinner {
          width: 13px; height: 13px;
          border: 1.5px solid rgba(26,22,18,0.3);
          border-top-color: #1a1612; border-radius: 50%;
          animation: alSpin 0.8s linear infinite;
        }
        @keyframes alSpin { to { transform: rotate(360deg); } }

        /* Divider */
        .al-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(196,160,100,0.2), transparent);
          margin-top: 8px;
        }

        /* Footer */
        .al-footer {
          text-align: center; margin-top: 20px;
          font-family: 'Montserrat', sans-serif; font-size: 9px; font-weight: 400;
          letter-spacing: 0.12em; color: #4a3f35;
        }

        @media (max-width: 480px) {
          .al-card { padding: 36px 28px 32px; }
          .al-title { font-size: 28px; }
        }
      `}</style>

      <div className="al-root">
        <div className="al-glyph al-glyph--tl">✦</div>
        <div className="al-glyph al-glyph--br">✦</div>

        <div className="al-card">

          {/* Header */}
          <div className="al-header">
            <div className="al-eyebrow">
              <span className="al-eyebrow-rule" />
              Restricted Access
              <span className="al-eyebrow-rule" />
            </div>
            <h1 className="al-title">Admin <em>Panel</em></h1>
            <p className="al-subtitle">Sign in to manage your store</p>
          </div>

          {/* Form */}
          <form className="al-form" onSubmit={onSubmitHandler}>

            <div className="al-field">
              <label className="al-label">Email Address</label>
              <input
                className="al-input"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="al-input-line" />
            </div>

            <div className="al-field">
              <label className="al-label">Password</label>
              <input
                className="al-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="al-input-line" />
            </div>

            <button className="al-btn" type="submit" disabled={loading}>
              <div className="al-btn-inner">
                {loading
                  ? <span className="al-btn-spinner" />
                  : <>
                      Sign In
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                }
              </div>
            </button>

          </form>

          <div className="al-divider" />
          <p className="al-footer">Authorised personnel only</p>

        </div>
      </div>
    </>
  );
};

export default Login;