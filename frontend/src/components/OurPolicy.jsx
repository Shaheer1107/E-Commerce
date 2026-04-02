import React, { useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'

const policies = [
  {
    icon: assets.exchange_icon,
    title: 'Easy Exchange',
    subtitle: 'HASSLE-FREE RETURNS',
    desc: 'Changed your mind? We make swapping sizes and styles completely effortless.',
  },
  {
    icon: assets.quality_icon,
    title: 'Premium Quality',
    subtitle: 'CRAFTED TO LAST',
    desc: 'Every piece is held to the highest material and construction standards.',
  },
  {
    icon: assets.support_img,
    title: '24/7 Support',
    subtitle: 'ALWAYS HERE FOR YOU',
    desc: 'Our team is on hand around the clock to assist with any query.',
  },
]

const OurPolicy = () => {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@300;400;500;600&display=swap');

        .policy-section {
          position: relative;
          background: #faf8f5;
          padding: 80px 48px;
          overflow: hidden;
        }

        /* Top seam from dark BestSeller section */
        .policy-top-rule {
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(196,160,100,0.25) 30%, rgba(196,160,100,0.25) 70%, transparent);
        }

        .policy-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
          max-width: 960px;
          margin: 0 auto;
        }
        @media (min-width: 640px) {
          .policy-grid {
            flex-direction: row;
            gap: 0;
          }
        }

        /* Vertical divider between cards */
        .policy-divider {
          display: none;
        }
        @media (min-width: 640px) {
          .policy-divider {
            display: block;
            width: 1px;
            align-self: stretch;
            background: linear-gradient(to bottom, transparent, rgba(196,160,100,0.2) 30%, rgba(196,160,100,0.2) 70%, transparent);
            flex-shrink: 0;
          }
        }

        .policy-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 40px 40px 40px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1), background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
          border: 1px solid transparent;
          cursor: default;
        }
        .policy-card.visible { opacity: 1; transform: translateY(0); }
        .policy-card:hover {
          background: #ffffff;
          border-color: rgba(196,160,100,0.22);
          box-shadow: 0 16px 48px rgba(196,160,100,0.09), 0 2px 12px rgba(0,0,0,0.04);
        }

        .policy-icon-ring {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 1px solid rgba(196,160,100,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          position: relative;
          transition: border-color 0.3s ease;
        }
        .policy-card:hover .policy-icon-ring {
          border-color: rgba(196,160,100,0.6);
        }
        /* Rotating dashed ring on hover */
        .policy-icon-ring::before {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 1px dashed rgba(196,160,100,0.15);
          transition: border-color 0.3s ease;
          animation: spinRing 12s linear infinite;
        }
        .policy-card:hover .policy-icon-ring::before {
          border-color: rgba(196,160,100,0.35);
        }
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .policy-icon {
          width: 26px;
          height: 26px;
          object-fit: contain;
          filter: invert(0%) sepia(20%) saturate(300%) hue-rotate(10deg) brightness(40%);
          transition: filter 0.3s ease;
        }
        .policy-card:hover .policy-icon {
          filter: invert(65%) sepia(30%) saturate(600%) hue-rotate(5deg) brightness(95%);
        }

        .policy-eyebrow {
          font-family: 'Montserrat', sans-serif;
          font-size: 8.5px;
          font-weight: 500;
          letter-spacing: 0.26em;
          color: #c4a064;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .policy-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 300;
          color: #1a1612;
          margin: 0 0 12px;
          line-height: 1.1;
          transition: color 0.3s ease;
        }
        .policy-card:hover .policy-title {
          color: #c4a064;
        }

        .policy-desc {
          font-family: 'Montserrat', sans-serif;
          font-size: 10.5px;
          font-weight: 300;
          letter-spacing: 0.04em;
          line-height: 1.85;
          color: #9a8f82;
          max-width: 200px;
          transition: color 0.3s ease;
        }
        .policy-card:hover .policy-desc {
          color: #6b6054;
        }

        @media (max-width: 640px) {
          .policy-section { padding: 64px 24px; }
          .policy-card { padding: 0 16px; }
        }
      `}</style>

      <section className="policy-section" ref={ref}>
        <div className="policy-top-rule" />
        <div className="policy-grid">
          {policies.map((p, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="policy-divider" />}
              <div
                className={`policy-card ${visible ? 'visible' : ''}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="policy-icon-ring">
                  <img className="policy-icon" src={p.icon} alt={p.title} />
                </div>
                <p className="policy-eyebrow">{p.subtitle}</p>
                <h3 className="policy-title">{p.title}</h3>
                <p className="policy-desc">{p.desc}</p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>
    </>
  )
}

export default OurPolicy