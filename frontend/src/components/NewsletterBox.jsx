import React, { useEffect, useRef, useState } from 'react'

const NewsletterBox = () => {
  const [visible, setVisible] = useState(false)
  const [focused, setFocused] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const onSubmitHandler = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        .nl-section {
          position: relative;
          background: #0e0c0a;
          padding: 100px 48px 96px;
          overflow: hidden;
          text-align: center;
        }

        /* Grain */
        .nl-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* Central glow behind content */
        .nl-glow {
          position: absolute;
          width: 800px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(196,160,100,0.06) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
        }

        /* Corner brackets */
        .nl-corner {
          position: absolute;
          width: 40px;
          height: 40px;
          z-index: 1;
        }
        .nl-corner-tl { top: 20px; left: 20px; border-top: 1px solid rgba(196,160,100,0.15); border-left: 1px solid rgba(196,160,100,0.15); }
        .nl-corner-tr { top: 20px; right: 20px; border-top: 1px solid rgba(196,160,100,0.15); border-right: 1px solid rgba(196,160,100,0.15); }
        .nl-corner-bl { bottom: 20px; left: 20px; border-bottom: 1px solid rgba(196,160,100,0.15); border-left: 1px solid rgba(196,160,100,0.15); }
        .nl-corner-br { bottom: 20px; right: 20px; border-bottom: 1px solid rgba(196,160,100,0.15); border-right: 1px solid rgba(196,160,100,0.15); }

        /* Top seam */
        .nl-top-rule {
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(196,160,100,0.2) 30%, rgba(196,160,100,0.2) 70%, transparent);
        }

        /* Content wrapper */
        .nl-content {
          position: relative;
          z-index: 2;
          max-width: 560px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.9s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1);
        }
        .nl-content.visible { opacity: 1; transform: translateY(0); }

        /* Eyebrow */
        .nl-eyebrow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 20px;
        }
        .nl-eyebrow-line {
          width: 32px;
          height: 1px;
          background: rgba(196,160,100,0.4);
        }
        .nl-eyebrow-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.28em;
          color: #c4a064;
          text-transform: uppercase;
        }

        /* Headline */
        .nl-headline {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(32px, 4vw, 52px);
          color: #f5f0e8;
          line-height: 1.1;
          margin: 0 0 8px;
          letter-spacing: -0.01em;
        }
        .nl-headline em {
          font-style: italic;
          color: #c4a064;
        }

        /* Subtext */
        .nl-sub {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.05em;
          line-height: 1.85;
          color: #a89e92;
          margin: 0 0 44px;
        }

        /* Form */
        .nl-form {
          display: flex;
          align-items: stretch;
          border: 1px solid rgba(196,160,100,0.18);
          transition: border-color 0.3s ease;
          background: rgba(255,255,255,0.02);
        }
        .nl-form.focused {
          border-color: rgba(196,160,100,0.45);
        }

        .nl-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 16px 20px;
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.06em;
          color: #f5f0e8;
          min-width: 0;
        }
        .nl-input::placeholder {
          color: #4a4035;
          letter-spacing: 0.08em;
        }

        /* Vertical divider inside form */
        .nl-form-divider {
          width: 1px;
          background: rgba(196,160,100,0.18);
          align-self: stretch;
          transition: background 0.3s ease;
        }
        .nl-form.focused .nl-form-divider {
          background: rgba(196,160,100,0.35);
        }

        .nl-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 16px 28px;
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c4a064;
          display: flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          transition: color 0.35s ease;
        }
        .nl-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #c4a064;
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .nl-btn:hover::before { transform: translateX(0); }
        .nl-btn:hover { color: #0e0c0a; }
        .nl-btn span, .nl-btn svg { position: relative; z-index: 1; }
        .nl-btn svg { transition: transform 0.3s ease; }
        .nl-btn:hover svg { transform: translateX(3px); }

        /* Success state */
        .nl-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          opacity: 0;
          transform: scale(0.95);
          animation: nlSuccessPop 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes nlSuccessPop {
          to { opacity: 1; transform: scale(1); }
        }
        .nl-success-ring {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 1px solid rgba(196,160,100,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .nl-success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 300;
          font-style: italic;
          color: #f5f0e8;
        }
        .nl-success-sub {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: #6b6054;
        }

        /* Disclaimer */
        .nl-disclaimer {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          font-weight: 300;
          letter-spacing: 0.06em;
          color: #3a342e;
          margin-top: 18px;
        }

        @media (max-width: 600px) {
          .nl-section { padding: 72px 24px 80px; }
          .nl-btn { padding: 16px 18px; font-size: 8px; }
        }
      `}</style>

      <section className="nl-section" ref={ref}>
        <div className="nl-top-rule" />
        <div className="nl-glow" />
        <div className="nl-corner nl-corner-tl" />
        <div className="nl-corner nl-corner-tr" />
        <div className="nl-corner nl-corner-bl" />
        <div className="nl-corner nl-corner-br" />

        <div className={`nl-content ${visible ? 'visible' : ''}`}>
          <div className="nl-eyebrow">
            <span className="nl-eyebrow-line" />
            <span className="nl-eyebrow-text">Exclusive Access</span>
            <span className="nl-eyebrow-line" />
          </div>

          <h2 className="nl-headline">
            Subscribe &amp; receive<br /><em>20% off</em> your first order
          </h2>

          <p className="nl-sub">
            Be the first to know about new arrivals, private sales, and members-only offers.
          </p>

          {!submitted ? (
            <>
              <form
                onSubmit={onSubmitHandler}
                className={`nl-form ${focused ? 'focused' : ''}`}
              >
                <input
                  className="nl-input"
                  type="email"
                  placeholder="Your email address"
                  required
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
                <div className="nl-form-divider" />
                <button className="nl-btn" type="submit">
                  <span>Subscribe</span>
                  <svg width="13" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5H13M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
              <p className="nl-disclaimer">No spam, ever. Unsubscribe at any time.</p>
            </>
          ) : (
            <div className="nl-success">
              <div className="nl-success-ring">
                <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
                  <path d="M1.5 7L7.5 13L18.5 1.5" stroke="#c4a064" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="nl-success-title">You're on the list.</p>
              <p className="nl-success-sub">Check your inbox for your welcome offer.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default NewsletterBox