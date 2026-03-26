import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
  const [loaded, setLoaded] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)

  useEffect(() => {
    // Trigger entrance animations after mount
    const timer = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleMouseMove = (e) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12
    setMousePos({ x, y })
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        .hero-root {
          position: relative;
          min-height: 92vh;
          background: #0e0c0a;
          overflow: hidden;
          display: flex;
          align-items: stretch;
          font-family: 'Montserrat', sans-serif;
        }

        /* Subtle grain texture overlay */
        .hero-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 10;
          opacity: 0.35;
        }

        /* Ambient glow */
        .hero-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(196,160,100,0.08) 0%, transparent 70%);
          top: -100px;
          left: -100px;
          pointer-events: none;
          z-index: 1;
        }

        /* Left content panel */
        .hero-left {
          position: relative;
          z-index: 5;
          width: 50%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 80px 60px 80px 72px;
          gap: 0;
        }

        /* Vertical label */
        .hero-label {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
        }
        .hero-label.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-label-line {
          width: 40px;
          height: 1px;
          background: #c4a064;
        }
        .hero-label-text {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.25em;
          color: #c4a064;
          text-transform: uppercase;
        }

        /* Main headline */
        .hero-headline-wrap {
          overflow: hidden;
          margin-bottom: 4px;
        }
        .hero-headline {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(52px, 5.5vw, 86px);
          line-height: 1.0;
          color: #f5f0e8;
          letter-spacing: -0.01em;
          margin: 0;
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 0.9s ease 0.4s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
        }
        .hero-headline.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-headline em {
          font-style: italic;
          color: #c4a064;
        }

        /* Sub-headline */
        .hero-subhead {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-style: italic;
          font-size: clamp(18px, 2vw, 26px);
          color: #8a7d6b;
          margin: 0 0 40px 0;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease 0.55s, transform 0.8s ease 0.55s;
        }
        .hero-subhead.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Description */
        .hero-desc {
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: #6b6054;
          line-height: 1.8;
          max-width: 300px;
          margin-bottom: 48px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease 0.65s, transform 0.8s ease 0.65s;
        }
        .hero-desc.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* CTA Buttons */
        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 24px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease 0.8s, transform 0.8s ease 0.8s;
        }
        .hero-cta-group.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #c4a064;
          color: #0e0c0a;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 16px 32px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: color 0.3s ease;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #0e0c0a;
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-primary:hover::before {
          transform: translateX(0);
        }
        .btn-primary:hover {
          color: #c4a064;
        }
        .btn-primary span {
          position: relative;
          z-index: 1;
        }
        .btn-primary-arrow {
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease;
        }
        .btn-primary:hover .btn-primary-arrow {
          transform: translateX(4px);
        }

        .btn-ghost {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b6054;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: none;
          padding: 4px 0;
          position: relative;
        }
        .btn-ghost::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: #c4a064;
          transition: width 0.3s ease;
        }
        .btn-ghost:hover {
          color: #c4a064;
        }
        .btn-ghost:hover::after {
          width: 100%;
        }

        /* Bottom stats bar */
        .hero-stats {
          position: absolute;
          bottom: 48px;
          left: 72px;
          display: flex;
          gap: 48px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s ease 1s, transform 0.8s ease 1s;
        }
        .hero-stats.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .hero-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 300;
          color: #f5f0e8;
          line-height: 1;
        }
        .hero-stat-label {
          font-size: 9px;
          letter-spacing: 0.18em;
          color: #4a4035;
          text-transform: uppercase;
        }
        .hero-stat-divider {
          width: 1px;
          height: 40px;
          background: #2a2520;
          align-self: center;
        }

        /* Right image panel */
        .hero-right {
          position: relative;
          width: 50%;
          overflow: hidden;
        }

        .hero-img-container {
          position: absolute;
          inset: 0;
          transition: transform 0.1s ease-out;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          filter: grayscale(10%) contrast(1.05);
          opacity: 0;
          transform: scale(1.08);
          transition: opacity 1.2s ease 0.3s, transform 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
        }
        .hero-img.visible {
          opacity: 1;
          transform: scale(1);
        }

        /* Image overlay gradient */
        .hero-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(14,12,10,0.45) 0%,
            rgba(14,12,10,0.0) 40%,
            rgba(14,12,10,0.0) 70%,
            rgba(14,12,10,0.2) 100%
          );
          z-index: 2;
        }
        .hero-img-overlay-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40%;
          background: linear-gradient(to top, rgba(14,12,10,0.6) 0%, transparent 100%);
          z-index: 2;
        }

        /* Floating collection tag */
        .hero-collection-tag {
          position: absolute;
          bottom: 48px;
          right: 40px;
          z-index: 5;
          text-align: right;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s ease 1.1s, transform 0.8s ease 1.1s;
        }
        .hero-collection-tag.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .hero-collection-season {
          font-size: 9px;
          letter-spacing: 0.2em;
          color: #c4a064;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .hero-collection-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 300;
          font-style: italic;
          color: #f5f0e8;
          line-height: 1.1;
        }

        /* Scroll indicator */
        .hero-scroll {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.8s ease 1.3s;
        }
        .hero-scroll.visible {
          opacity: 1;
        }
        .hero-scroll-text {
          font-size: 8px;
          letter-spacing: 0.25em;
          color: #4a4035;
          text-transform: uppercase;
          writing-mode: vertical-lr;
          text-orientation: mixed;
        }
        .hero-scroll-line {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, #c4a064, transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.2); }
        }

        /* Thin gold border accent */
        .hero-border-accent {
          position: absolute;
          top: 32px;
          left: 32px;
          right: 32px;
          bottom: 32px;
          border: 1px solid rgba(196,160,100,0.08);
          pointer-events: none;
          z-index: 8;
        }

        /* Corner marks */
        .corner {
          position: absolute;
          width: 16px;
          height: 16px;
          z-index: 9;
        }
        .corner-tl { top: 32px; left: 32px; border-top: 1px solid rgba(196,160,100,0.35); border-left: 1px solid rgba(196,160,100,0.35); }
        .corner-tr { top: 32px; right: 32px; border-top: 1px solid rgba(196,160,100,0.35); border-right: 1px solid rgba(196,160,100,0.35); }
        .corner-bl { bottom: 32px; left: 32px; border-bottom: 1px solid rgba(196,160,100,0.35); border-left: 1px solid rgba(196,160,100,0.35); }
        .corner-br { bottom: 32px; right: 32px; border-bottom: 1px solid rgba(196,160,100,0.35); border-right: 1px solid rgba(196,160,100,0.35); }

        /* Vertical divider between panels */
        .hero-divider {
          position: absolute;
          top: 10%;
          bottom: 10%;
          left: 50%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(196,160,100,0.15) 30%, rgba(196,160,100,0.15) 70%, transparent);
          z-index: 6;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .hero-root {
            flex-direction: column;
            min-height: 100vh;
          }
          .hero-left {
            width: 100%;
            padding: 80px 32px 48px;
            order: 2;
          }
          .hero-right {
            width: 100%;
            height: 55vw;
            order: 1;
            flex-shrink: 0;
          }
          .hero-stats {
            left: 32px;
            bottom: 32px;
            gap: 28px;
          }
          .hero-divider { display: none; }
          .hero-scroll { display: none; }
          .hero-border-accent { display: none; }
          .corner { display: none; }
        }
      `}</style>

      <div
        className="hero-root"
        ref={heroRef}
        onMouseMove={handleMouseMove}
      >
        {/* Decorative elements */}
        <div className="hero-glow" />
        <div className="hero-border-accent" />
        <div className="corner corner-tl" />
        <div className="corner corner-tr" />
        <div className="corner corner-bl" />
        <div className="corner corner-br" />
        <div className="hero-divider" />

        {/* Left Content */}
        <div className="hero-left">
          <div className={`hero-label ${loaded ? 'visible' : ''}`}>
            <div className="hero-label-line" />
            <span className="hero-label-text">SS 2025 Collection</span>
          </div>

          <div className="hero-headline-wrap">
            <h1 className={`hero-headline ${loaded ? 'visible' : ''}`}>
              Latest<br /><em>Arrivals</em>
            </h1>
          </div>

          <p className={`hero-subhead ${loaded ? 'visible' : ''}`}>
            Refined Essentials
          </p>

          <p className={`hero-desc ${loaded ? 'visible' : ''}`}>
            Thoughtfully curated pieces for the modern wardrobe. Timeless silhouettes, exceptional materials.
          </p>

          <div className={`hero-cta-group ${loaded ? 'visible' : ''}`}>
            <a href="/collection" className="btn-primary">
              <span>Shop Now</span>
              <svg className="btn-primary-arrow" width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5H13M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#bestsellers" className="btn-ghost">Bestsellers</a>
          </div>

          <div className={`hero-stats ${loaded ? 'visible' : ''}`}>
            <div className="hero-stat-item">
              <span className="hero-stat-num">200+</span>
              <span className="hero-stat-label">New Styles</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <span className="hero-stat-num">48h</span>
              <span className="hero-stat-label">Delivery</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat-item">
              <span className="hero-stat-num">Free</span>
              <span className="hero-stat-label">Returns</span>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="hero-right">
          <div
            className="hero-img-container"
            style={{
              transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px) scale(1.04)`,
            }}
          >
            <img
              className={`hero-img ${loaded ? 'visible' : ''}`}
              src={assets.hero_img}
              alt="Latest Arrivals"
            />
          </div>
          <div className="hero-img-overlay" />
          <div className="hero-img-overlay-bottom" />

          <div className={`hero-collection-tag ${loaded ? 'visible' : ''}`}>
            <p className="hero-collection-season">Spring / Summer</p>
            <p className="hero-collection-name">The Edit</p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className={`hero-scroll ${loaded ? 'visible' : ''}`}>
          <div className="hero-scroll-line" />
          <span className="hero-scroll-text">Scroll</span>
        </div>
      </div>
    </>
  )
}

export default Hero