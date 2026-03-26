import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign Up');
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const location = useLocation();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate(location.state?.from || '/');
  }, [token]);

  const isLogin = currentState === 'Login';

  return (
    <>
      <style>{STYLES}</style>

      <div className="lg-root">

        {/* Decorative background marks */}
        <div className="lg-bg-mark lg-bg-mark--tl">✦</div>
        <div className="lg-bg-mark lg-bg-mark--br">✦</div>

        <div className="lg-card">

          {/* Header */}
          <div className="lg-header">
            <span className="lg-eyebrow">
              <span className="lg-rule" />
              Welcome
              <span className="lg-rule" />
            </span>
            <h1 className="lg-title">
              {isLogin ? <>Sign <em>In</em></> : <>Create <em>Account</em></>}
            </h1>
            <p className="lg-subtitle">
              {isLogin
                ? 'Access your account and orders'
                : 'Join us for an elevated experience'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmitHandler} className="lg-form">

            {/* Name field — Sign Up only */}
            <div className={`lg-field-wrap ${!isLogin ? 'lg-field-wrap--visible' : ''}`}>
              <div className="lg-field">
                <label className="lg-label">Full Name</label>
                <input
                  type="text"
                  className="lg-input"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  tabIndex={isLogin ? -1 : 0}
                />
                <div className="lg-input-line" />
              </div>
            </div>

            {/* Email */}
            <div className="lg-field">
              <label className="lg-label">Email Address</label>
              <input
                type="email"
                className="lg-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="lg-input-line" />
            </div>

            {/* Password */}
            <div className="lg-field">
              <label className="lg-label">Password</label>
              <input
                type="password"
                className="lg-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="lg-input-line" />
            </div>

            {/* Forgot / Toggle */}
            <div className="lg-links">
              <span className="lg-link">Forgot password?</span>
              {isLogin
                ? <span className="lg-link" onClick={() => setCurrentState('Sign Up')}>Create account</span>
                : <span className="lg-link" onClick={() => setCurrentState('Login')}>Sign in instead</span>
              }
            </div>

            {/* Submit */}
            <button type="submit" className="lg-btn" disabled={loading}>
              <span className="lg-btn-label">
                {loading ? (
                  <span className="lg-btn-spinner" />
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </span>
              {!loading && (
                <svg className="lg-btn-arrow" width="15" height="15" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>

          </form>

          {/* Footer toggle */}
          <div className="lg-footer">
            <div className="lg-footer-rule" />
            <p className="lg-footer-text">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span
                className="lg-footer-link"
                onClick={() => setCurrentState(isLogin ? 'Sign Up' : 'Login')}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </span>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

/* ── Root ── */
.lg-root {
  min-height: 80vh;
  display: flex; align-items: center; justify-content: center;
  padding: 48px 20px;
  position: relative;
  border-top: 1px solid #e8e0d4;
}

/* Background decorative marks */
.lg-bg-mark {
  position: absolute; font-size: 80px; color: #c4a064;
  opacity: 0.045; pointer-events: none; user-select: none;
  font-family: 'Cormorant Garamond', serif;
}
.lg-bg-mark--tl { top: 40px; left: 60px; }
.lg-bg-mark--br { bottom: 40px; right: 60px; }

/* ── Card ── */
.lg-card {
  width: 100%; max-width: 420px;
  border: 1px solid #e8e0d4; background: #fdfcfa;
  padding: 48px 44px 40px;
  animation: lgFadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both;
  position: relative;
}
/* Gold corner marks */
.lg-card::before,
.lg-card::after {
  content: '';
  position: absolute; width: 20px; height: 20px; pointer-events: none;
}
.lg-card::before {
  top: 12px; left: 12px;
  border-top: 1.5px solid #c4a064; border-left: 1.5px solid #c4a064;
}
.lg-card::after {
  bottom: 12px; right: 12px;
  border-bottom: 1.5px solid #c4a064; border-right: 1.5px solid #c4a064;
}
@keyframes lgFadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Header ── */
.lg-header {
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; margin-bottom: 36px; text-align: center;
}
.lg-eyebrow {
  display: flex; align-items: center; gap: 10px;
  font-family: 'Montserrat', sans-serif; font-size: 8.5px; font-weight: 500;
  letter-spacing: 0.3em; text-transform: uppercase; color: #c4a064;
}
.lg-rule { display: inline-block; width: 24px; height: 1px; background: #c4a064; }
.lg-title {
  font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 300;
  color: #1a1612; margin: 4px 0 0; line-height: 1;
}
.lg-title em { font-style: italic; color: #c4a064; }
.lg-subtitle {
  font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 400;
  color: #6b5f50; letter-spacing: 0.08em; margin: 2px 0 0;
}

/* ── Form ── */
.lg-form { display: flex; flex-direction: column; gap: 22px; }

/* Animated name field */
.lg-field-wrap {
  max-height: 0; overflow: hidden; opacity: 0;
  transition: max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease;
}
.lg-field-wrap--visible { max-height: 80px; opacity: 1; }

/* Field */
.lg-field { display: flex; flex-direction: column; gap: 6px; position: relative; }
.lg-label {
  font-family: 'Montserrat', sans-serif; font-size: 8px; font-weight: 600;
  letter-spacing: 0.25em; text-transform: uppercase; color: #4a3f35;
}
.lg-input {
  font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 500;
  color: #1a1612; background: transparent;
  border: none; border-bottom: 1px solid #c8bfb4;
  padding: 8px 0; outline: none; width: 100%;
  transition: border-color 0.2s;
  letter-spacing: 0.04em;
}
.lg-input::placeholder { color: #8b7f72; }
.lg-input:focus { border-bottom-color: transparent; }
.lg-input-line {
  position: absolute; bottom: 0; left: 0; right: 0; height: 1.5px;
  background: #c4a064; transform: scaleX(0); transform-origin: left;
  transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
  pointer-events: none;
}
.lg-field:focus-within .lg-input-line { transform: scaleX(1); }

/* Links row */
.lg-links {
  display: flex; justify-content: space-between; margin-top: -8px;
}
.lg-link {
  font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 500;
  color: #4a3f35; letter-spacing: 0.06em; cursor: pointer;
  transition: color 0.2s;
}
.lg-link:hover { color: #c4a064; }

/* Submit button */
.lg-btn {
  width: 100%; background: #1a1612; border: none;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  padding: 15px 24px; cursor: pointer; margin-top: 4px;
  transition: background 0.25s;
  position: relative; overflow: hidden;
}
.lg-btn::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, transparent 40%, rgba(196,160,100,0.12) 100%);
  pointer-events: none;
}
.lg-btn:hover:not(:disabled) { background: #c4a064; }
.lg-btn:hover .lg-btn-label { color: #1a1612; letter-spacing: 0.32em; }
.lg-btn:hover .lg-btn-arrow { color: #1a1612; transform: translateX(4px); }
.lg-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.lg-btn-label {
  font-family: 'Montserrat', sans-serif; font-size: 9.5px; font-weight: 600;
  letter-spacing: 0.26em; text-transform: uppercase; color: #f5f0e8;
  transition: letter-spacing 0.3s, color 0.25s;
  display: flex; align-items: center; gap: 8px;
}
.lg-btn-arrow {
  color: #f5f0e8; flex-shrink: 0;
  transition: transform 0.25s, color 0.25s;
}
.lg-btn-spinner {
  width: 14px; height: 14px;
  border: 1.5px solid rgba(245,240,232,0.3);
  border-top-color: #f5f0e8; border-radius: 50%;
  animation: lgSpin 0.8s linear infinite; display: inline-block;
}
@keyframes lgSpin { to { transform: rotate(360deg); } }

/* ── Footer toggle ── */
.lg-footer { margin-top: 28px; }
.lg-footer-rule {
  height: 1px; background: linear-gradient(to right, transparent, #e0d8ce, transparent);
  margin-bottom: 18px;
}
.lg-footer-text {
  text-align: center;
  font-family: 'Montserrat', sans-serif; font-size: 10px;
  font-weight: 400; color: #4a3f35; letter-spacing: 0.06em;
}
.lg-footer-link {
  color: #c4a064; font-weight: 500; cursor: pointer;
  transition: opacity 0.2s;
}
.lg-footer-link:hover { opacity: 0.75; }

/* ── Responsive ── */
@media (max-width: 480px) {
  .lg-card { padding: 36px 28px 32px; }
  .lg-title { font-size: 30px; }
}
`;

export default Login;